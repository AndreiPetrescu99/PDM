import {authConfig, baseUrl, getLogger, withLogs  } from "../core";
import {TrainProps} from "./TrainProps";
import axios from 'axios';


const log = getLogger('trainsAPI');
const trainURL = `http://${baseUrl}/api/train`;
let crPage = 1;
const trainURLPage =`${trainURL}/page/${crPage}`;


export const getTrainsPage: (token: string, page: number) => Promise<TrainProps[]> = (token, page) =>{
    const trainURLPage =`${trainURL}/page/${page}`;
    log(trainURLPage);
    return withLogs(axios.get(trainURLPage, authConfig(token)), 'getItems');
};

export const getTrains: (token: string) => Promise<TrainProps[]> = token =>{
    crPage = crPage + 1;
    log(trainURLPage);
    return withLogs(axios.get(trainURLPage, authConfig(token)), 'getItems');
};

export const updateTrain: (token: string, train: TrainProps) => Promise<TrainProps[]> = (token, train) => {
    return withLogs(axios.put(`${trainURL}/${train._id}`, train, authConfig(token)), 'updateTrain');
};

export const createItem: (token: string, train: TrainProps) => Promise<TrainProps[]> = (token, train) => {
    return withLogs(axios.post(trainURL, train, authConfig(token)), 'createItem');
}

interface MessageData{
    event: string;
    payload:{
        train: TrainProps
    };
}

export const newWebSocket = (onMessage: (data: MessageData) => void) => {
    const ws = new WebSocket(`ws://${baseUrl}`);
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