import WebSocket from "ws";
import jwt from "jsonwebtoken";
import { jwtConfig } from "./constants";

let wss;

export const initWss = value => {
    wss = value;
    wss.on('connection', ws => {
        ws.on('message', message => {
            const { type, payload: { token } } = JSON.parse(message);
            if (type !== 'authorization') {
                ws.close();
                return;
            }
            try {
                ws.user = jwt.verify(token, jwtConfig.secret);
            } catch (err) {
                ws.close();
            }
        })
    });
};

export const broadcast = (userId, data) => {
    console.log("Broadcasting all...");
    if (!wss) {
        console.log("No wss");
        return;
    }
    //console.log(wss.clients.size);
    wss.clients.forEach(client => {
        //console.log(client);
        if (client.readyState === WebSocket.OPEN) {
            //console.log(`broadcast sent to ${client.user.username}`);
            client.send(JSON.stringify(data));
            console.log("Data sent");
        }
    });
};
