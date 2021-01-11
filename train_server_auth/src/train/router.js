import Router from 'koa-router';
import trainStore from './store';
import { broadcast } from "../utils";
import {uploadImg} from "../utils/upload";


const path = require("path");
const fs = require("fs");
const multer = require("multer");


export const router = new Router();


router.get('/', async (ctx) => {
    const response = ctx.response;
    const from = ctx.state.user.from;
    const id = ctx.state.user._id;
    let trains = await trainStore.find();
    response.body = trains;
    response.status = 200; // ok
});

router.get('/page/:id', async (ctx) =>{
   const response = ctx.response;
   let page = ctx.params.id;
   console.log("Page " + page);
   let maxPage = 20;
   let crPage = 1;
   let cr = 0;
   let trains = await trainStore.find();
   let out = []
   for(let i = 0; i<trains.length; i++){
       if(cr === maxPage - 1){
           //console.log(cr);
           cr = 0;
           crPage = crPage + 1;
       }
       console.log(crPage);
       if(crPage === Number(page)){
           //console.log("AICI");
           //console.log(trains[i]);
           out.push(trains[i]);
       }
       cr = cr + 1;
   }
   //console.log(out);
   response.body = JSON.stringify(out);
   response.status = 200;
});


router.get('/:id', async (ctx) => {
    const userId = ctx.state.user._id;
    const train = await trainStore.findOne({ _id: ctx.params.id });
    const response = ctx.response;
    if (train) {
        response.body = train;
        response.status = 200; // ok
    } else {
        response.status = 404; // not found
    }
});

router.put('/:id', async (ctx) => {
    console.log("PUT METHOD");
    let train = ctx.request.body;
    //console.log(train);
    train.nrSeats = train.nrSeats - 1;
    const id = ctx.params.id;
    const response = ctx.response;
    const userId = ctx.state.user._id;
    //let found = await trainStore.findOne({_id:id});

    try {
        const updatedCount = await trainStore.update({_id: id}, train);
        console.log(updatedCount);
        ctx.response.body = train;
        ctx.response.status = 200; // ok
        console.log(response);
        console.log(train);
        broadcast(userId, { event: 'updated', payload: train });
    }catch (error){
        console.log(error);
    }


});

const createTrain = async (ctx, train, response) => {
    try {
        const userId = ctx.state.user._id;
        console.log(userId);
        const from = ctx.state.user.from;
        response.body = await trainStore.insert(train);
        response.status = 201; // created
        broadcast(userId, { type: 'created', payload: train });
    } catch (err) {
        response.body = { message: err.message };
        response.status = 400; // bad request
    }
};

router.post('/', async ctx => await createTrain(ctx, ctx.request.body, ctx.response));

router.post('/upload', uploadImg)



router.del('/:id', async (ctx) => {
    const userId = ctx.state.user._id;
    const note = await trainStore.findOne({ _id: ctx.params.id });
    if (note && userId !== note.userId) {
        ctx.response.status = 403; // forbidden
    } else {
        await trainStore.remove({ _id: ctx.params.id });
        ctx.response.status = 204; // no content
    }
});
