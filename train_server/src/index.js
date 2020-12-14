
const Koa = require('koa');
const app = new Koa();
const server = require('http').createServer(app.callback());
const WebSocket = require('ws');
const wss = new WebSocket.Server({ server });
const Router = require('koa-router');
const cors = require('koa-cors');
const bodyparser = require('koa-bodyparser');

class Train{
    constructor({id, from, to, timeLeave, timeArrive, nrSeats}) {
        this.id = id;
        this.from = from;
        this.to = to;
        this.timeLeave = timeLeave;
        this.timeArrive = timeArrive;
        this.nrSeats = nrSeats;
    }
}

const trains = [];

app.use(bodyparser());
app.use(cors());
app.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} ${ctx.response.status} - ${ms}ms`);
});

app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.response.body = { issue: [{ error: err.message || 'Unexpected error' }] };
        ctx.response.status = 500;
    }
});

//Inserting trains (hardcoded)
//TODO: chage with database

for(let i = 0; i < 10; i++){
    trains.push(new Train({id:`${i}`, from:"Location: "+`${i}`, to:"Location: "+`${i+1}`, timeLeave: new Date(Date.now()).toString(), timeArrive: new Date(Date.now() + 1).toString(), nrSeats:100}));
}

let lastUpdated = new Date(Date.now());
let lastId = trains[trains.length - 1].id;
const pageSize = 10;

const broadcast = data =>
    wss.clients.forEach(client =>{
        if(client.readyState === WebSocket.OPEN){
            client.send(JSON.stringify(data));
        }
    });

const router =  new Router();

router.get('/train', ctx => {
    const ifModifiedSince = ctx.request.get('If-Modif ied-Since');
    if (ifModifiedSince && new Date(ifModifiedSince).getTime() >= lastUpdated.getTime() - lastUpdated.getMilliseconds()) {
        ctx.response.status = 304; // NOT MODIFIED
        return;
    }
    const text = ctx.request.query.text;
    const page = parseInt(ctx.request.query.page) || 1;
    ctx.response.set('Last-Modified', lastUpdated.toUTCString());
    ctx.response.body = trains;
    ctx.response.status = 200;

});

router.get('/train/:id', async (ctx) =>{
    const trainId = ctx.params.id;
    const train = trains.find(train => train.id === trainId);
    if(train){
        ctx.response.body = train;
        ctx.response.status = 200; //All ok
    }else {
        ctx.response.body = {issue: [{warning: `Train with id = ${trainId} not found`}]};
        ctx.response.status = 404; //Train not found;
    }
});

router.put('/train/:id', async (ctx) => {
    const trainId = ctx.params.id;
    const index = trains.findIndex(train => train.id === trainId);
    if(index === -1){
        ctx.response.body = {issue:[{error:`Train with id = ${trainId} not found`}]};
        ctx.response.status = 404;
        return;
    }
    trains[index].nrSeats--;
    const train = trains[index];
    ctx.response.body = train;
    ctx.response.status = 200;
    broadcast({event: 'updated', payload: {train}});
})

app.use(router.routes());
app.use(router.allowedMethods());

server.listen(3000);
console.log("Listening....");