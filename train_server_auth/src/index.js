import Koa from 'koa';
import WebSocket from 'ws';
import http from 'http';
import Router from 'koa-router';
import koaBody from 'koa-bodyparser'
import bodyParser from "koa-bodyparser";
import { timingLogger, exceptionHandler, jwtConfig, initWss, verifyClient } from './utils';
import { router as authRouter } from './auth';
import { router as trainRouter } from "./train";
import trainStore from './train/store';
import jwt from 'koa-jwt';
import cors from '@koa/cors';

const app = new Koa();
const server = http.createServer(app.callback());
const wss = new WebSocket.Server({ server });

const {upload}= require('upload.js')
initWss(wss);

app.use(cors());
app.use(timingLogger);
app.use(exceptionHandler);
app.use(bodyParser());
app.use(koaBody({ multipart: true }));

const prefix = '/api';

// public
const publicApiRouter = new Router({ prefix });
publicApiRouter
    .use('/auth', authRouter.routes());
app
    .use(publicApiRouter.routes())
    .use(publicApiRouter.allowedMethods());

app.use(jwt(jwtConfig));

const protectedApiRouter = new Router({ prefix });
protectedApiRouter
    .use('/train', trainRouter.routes());
app
    .use(protectedApiRouter.routes())
    .use(protectedApiRouter.allowedMethods());

// app.use(upload()) //  Route
// app.use(route).use(router.post('/upload',upload));

server.listen(3000);
console.log('started on port 3000');
