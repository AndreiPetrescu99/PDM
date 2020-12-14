import React, { useContext, useEffect, useState } from 'react';
import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonInput, IonList,
    IonLoading,
    IonPage,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import { getLogger } from '../core';
import { TrainContext } from './TrainProvider';
import { RouteComponentProps } from 'react-router';
import { TrainProps } from './TrainProps';
import {Plugins} from "@capacitor/core";

import Train, {TrainDetails} from "./Train";

const log = getLogger('ItemEdit');

interface ItemEditProps extends RouteComponentProps<{
    id?: string;
}> {}

const ItemEdit: React.FC<ItemEditProps> = ({ history, match }) => {
    const { trains, buying, buyingError, buyTicket } = useContext(TrainContext);
    const [text, setText] = useState('');
    const [item, setItem] = useState<TrainProps>();
    const [localItem, setLocalItem] = useState<TrainProps>();

    useEffect(() => {
        log('useEffect');
        const routeId = match.params.id || '';
        const item = trains?.find(it => it._id === routeId);
        setItem(item);
        if (item) {
            log('Exista');
        }else {
            log("Nu exista, incercam local")
            getLocal(routeId);
        }
    }, [match.params.id, trains]);

    function getLocal(routeId: string){
        (async () => {
            const {Storage} = Plugins;
            const res = await Storage.get({key: routeId});
            if (res.value) {
                console.log('Train found', JSON.parse(res.value));
                setItem(JSON.parse(res.value));
            } else {
                console.log('Train not found');
            }
        })();
    }

    const handleBuy = () => {
        const editedItem = item;
        if(item) {
            buyTicket && buyTicket(item).then(() => history.goBack());
        }
    };
    log('render');
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Edit</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={handleBuy}>
                            Buy
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {item && (
                    <TrainDetails _id={item._id} from={item.from} to={item.to} timeLeave={item.timeLeave} timeArrive={item.timeArrive} nrSeats={item.nrSeats}/>
                )}
            </IonContent>
        </IonPage>
    );
};

export default ItemEdit;
