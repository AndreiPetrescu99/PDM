import {getLogger} from "../core";
import {TrainProps} from "./TrainProps";
import axios from 'axios';

const log = getLogger('trainsAPI');

const baseURL = 'localhost:3000';
const trainURL = `http://${baseURL}/train`;

interface ResponseProps<T>{
    data: T;
}

function witLogs<T>(promise: Promise<ResponseProps<T>>, fnName:string): Promise<T>{
    log(`${fnName} - started`);
    return promise
        .then(res => {
            log(`${fnName} - succeded`);
            return Promise.resolve(res.data);
        })
        .catch(err => {
            log(`${fnName} - failed`);
            return Promise.reject(err);
        });
}

const config = {
    headers:{
        'Content-Type': 'application/json'
    }
};

export const getTrains: () => Promise<TrainProps[]> = () =>{
    return witLogs(axios.get(trainURL, config), 'getItems');
};

export const updateTrain: (train: TrainProps) => Promise<TrainProps[]> = train => {
    return witLogs(axios.put(`${trainURL}/${train.id}`, train, config), 'updateTrain');
};

export const createItem: (item: TrainProps) => Promise<TrainProps[]> = item => {
    return witLogs(axios.post(trainURL, item, config), 'createItem');
}

interface MessageData{
    event: string;
    payload:{
        train: TrainProps
    };
}

export const newWebSocket = (onMessage: (data: MessageData) => void) => {
    const ws = new WebSocket(`ws://${baseURL}`);
    ws.onopen = () =>{
        log('WebSocket onOpen');
    }
    ws.onclose = () =>{
        log('WebSocket onClose');
    }
    ws.onerror = () =>{
        log('WebSocket onError');
    }
    ws.onmessage = messageEvent =>{
        log('WebSocket onMessage');
        onMessage(JSON.parse(messageEvent.data));
    };
    return () => {
        ws.close();
    }
}