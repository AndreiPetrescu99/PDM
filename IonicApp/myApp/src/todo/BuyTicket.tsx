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
import Train, {TrainDetails} from "./Train";

const log = getLogger('ItemEdit');

interface ItemEditProps extends RouteComponentProps<{
    id?: string;
}> {}

const ItemEdit: React.FC<ItemEditProps> = ({ history, match }) => {
    const { trains, buying, buyingError, buyTicket } = useContext(TrainContext);
    const [text, setText] = useState('');
    const [item, setItem] = useState<TrainProps>();
    useEffect(() => {
        log('useEffect');
        const routeId = match.params.id || '';
        const item = trains?.find(it => it.id === routeId);
        setItem(item);
        if (item) {
            log('Exista');
        }
    }, [match.params.id, trains]);
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
                    <TrainDetails key = {item.id} id={item.id} from={item.from} to={item.to} timeLeave={item.timeLeave} timeArrive={item.timeArrive} nrSeats={item.nrSeats}/>
                )}
            </IonContent>
        </IonPage>
    );
};

export default ItemEdit;
