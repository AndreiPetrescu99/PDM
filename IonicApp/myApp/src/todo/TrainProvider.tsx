import React, {useCallback, useContext, useEffect, useReducer, useState} from 'react';
import PropTypes from 'prop-types';
import { getLogger } from '../core';
import { TrainProps } from './TrainProps';
import {createItem, getTrains, newWebSocket, updateTrain} from './TrainsAPI';
import {AuthContext} from "../auth";
import {Plugins} from "@capacitor/core";

const log = getLogger('ItemProvider');

type BuyTicketFn = (item: TrainProps) => Promise<any>;

function buildTrainProps(train: TrainProps){
    return train;
}

export interface TrainState {
    trains?: TrainProps[],
    fetching: boolean,
    fetchingError?: Error | null,
    buying: boolean,
    buyingError?: Error | null,
    buyTicket?: BuyTicketFn,
}

interface ActionProps {
    type: string,
    payload?: any,
}

const initialState: TrainState = {
    fetching: false,
    buying: false,
};

const FETCH_ITEMS_STARTED = 'FETCH_ITEMS_STARTED';
const FETCH_ITEMS_SUCCEEDED = 'FETCH_ITEMS_SUCCEEDED';
const FETCH_ITEMS_FAILED = 'FETCH_ITEMS_FAILED';
const SAVE_ITEM_STARTED = 'SAVE_ITEM_STARTED';
const SAVE_ITEM_SUCCEEDED = 'SAVE_ITEM_SUCCEEDED';
const SAVE_ITEM_FAILED = 'SAVE_ITEM_FAILED';

const reducer: (state: TrainState, action: ActionProps) => TrainState =
    (state, { type, payload }) => {
        switch(type) {
            case FETCH_ITEMS_STARTED:
                return { ...state, fetching: true, fetchingError: null };
            case FETCH_ITEMS_SUCCEEDED:
                log(payload.trains);
                return { ...state, trains: payload.items, fetching: false };
            case FETCH_ITEMS_FAILED:
                return { ...state, fetchingError: payload.error, fetching: false };
            case SAVE_ITEM_STARTED:
                return { ...state, buyingError: null, buying: true };
            case SAVE_ITEM_SUCCEEDED:
                const trains = [...(state.trains || [])];
                const item = payload.train;
                const index = trains.findIndex(it => it._id === item._id);
                log(index);
                if (index === -1) {
                   trains.splice(0, 0, item);
                } else {
                    trains[index] = item;
                }
                return { ...state,  trains, buying: false };
            case SAVE_ITEM_FAILED:
                return { ...state, buyingError: payload.error, buying: false };
            default:
                return state;
        }
    };

export const TrainContext = React.createContext<TrainState>(initialState);

interface ItemProviderProps {
    children: PropTypes.ReactNodeLike,
}

export const TrainProvider: React.FC<ItemProviderProps> = ({ children }) => {

    const {token} = useContext(AuthContext);
    const [state, dispatch] = useReducer(reducer, initialState);
    const { trains, fetching, fetchingError, buying, buyingError } = state;
    useEffect(getItemsEffect, [token]);
    useEffect(wsEffect, [token]);
    const buyTicket = useCallback<BuyTicketFn>(saveItemCallback, [token]);
    const value = { trains, fetching, fetchingError, buying, buyingError, buyTicket };
    log('returns');
    return (
        <TrainContext.Provider value={value}>
            {children}
        </TrainContext.Provider>
    );

    function getItemsEffect() {
        let canceled = false;
        fetchItems();
        return () => {
            canceled = true;
        }

        async function fetchItems() {
            try {
                log('fetchItems started');
                dispatch({ type: FETCH_ITEMS_STARTED });
                const items = await getTrains(token);
                //log(items);
                log('fetchItems succeeded');
                if (!canceled) {
                    dispatch({ type: FETCH_ITEMS_SUCCEEDED, payload: { items } });
                    await saveLocal(items);
                }
            } catch (error) {
                log('fetchItems failed');
                dispatch({ type: FETCH_ITEMS_FAILED, payload: { error } });
            }
        }
    }

    async function saveItemCallback(item: TrainProps) {
        try {
            log('saveItem started');
            dispatch({ type: SAVE_ITEM_STARTED });
            const savedItem = await (item._id ? updateTrain(token, item) : updateTrain(token, item));
            log('saveItem succeeded');
            dispatch({ type: SAVE_ITEM_SUCCEEDED, payload: { train: savedItem } });
        } catch (error) {
            log('saveItem failed');
            log('saving for later');
            await saveBought(item);
            dispatch({ type: SAVE_ITEM_FAILED, payload: { error } });
            //item.nrSeats = item.nrSeats - 1;
            alert("Offline we'll get your ticket later");
            //dispatch({ type: SAVE_ITEM_SUCCEEDED, payload: { train: item } });
        }
    }

    async function saveLocal(items: TrainProps[]){
        const { Storage } = Plugins;

        // Saving ({ key: string, value: string }) => Promise<void>
        await Storage.set({
            key: 'user',
            value: JSON.stringify({
                token: token
            })
        });

        for (let i=0; i<items.length; i++){
            const item = items[i]
            await Storage.set({
                key: item._id!,
                value: JSON.stringify({
                    train: item
                })
            });
        }
    }

    async function saveBought(item: TrainProps){
        const { Storage } = Plugins;

        // Saving ({ key: string, value: string }) => Promise<void>
        await Storage.set({
            key: "Bought:"+item._id!,
            value: JSON.stringify({
                item
            })
        });
    }

    function wsEffect() {
        let canceled = false;
        log('wsEffect - connecting');
        const closeWebSocket = newWebSocket(message => {
            if (canceled) {
                return;
            }
            log(message);
            log(message.payload);
            const { event } = message;
            const train = message.payload;
            log(`ws message, item ${event}`);
            log(train);
            if (event === 'created' || event === 'updated') {
                dispatch({ type: SAVE_ITEM_SUCCEEDED, payload: {train} });
            }
        });
        return () => {
            log('wsEffect - disconnecting');
            canceled = true;
            closeWebSocket();
        }
    }
};
