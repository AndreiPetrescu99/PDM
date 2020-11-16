import {
    IonContent,
    IonFab,
    IonFabButton,
    IonHeader,
    IonIcon, IonList,
    IonLoading,
    IonPage,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import React, {useContext, useState} from "react";
import Train from "./Train";
import { getLogger } from '../core';
import {add, train} from "ionicons/icons";
import {TrainContext} from "./TrainProvider";
import {RouteComponentProps} from "react-router";

const log = getLogger('Home');

const Home: React.FC<RouteComponentProps> = ({history}) =>{
    const {trains, fetching, fetchingError} = useContext(TrainContext);
    log(trains);
    log("Trains render...");
    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Student CFR</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonLoading isOpen = {fetching} message = "Fetching trains"/>
                {trains && (
                    <IonList>
                        {trains.map(({id, from, to, nrSeats}) =>
                            <Train key={id} id={id} from={from} to={to} nrSeats={nrSeats} onBuy={_id => history.push(`/train/${_id}`)}/>)}
                    </IonList>
                )}
                {fetchingError && (
                    <div>{fetchingError.message || 'Failed to fetch items'}</div>
                )}
            </IonContent>
        </IonPage>
    );
};

export default Home;