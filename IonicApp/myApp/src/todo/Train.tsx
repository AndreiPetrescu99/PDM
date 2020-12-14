import React from "react";
import {TrainProps} from "./TrainProps";
import {time} from "ionicons/icons";
import {IonItem, IonLabel, IonList} from "@ionic/react";
import {Plugins} from "@capacitor/core";

interface TrainPropsExt extends TrainProps{
    onBuy: (id?: string) => void;
}

const {Storage} = Plugins;

const Train: React.FC<TrainPropsExt> = ({_id, from, to, timeLeave, timeArrive, nrSeats, onBuy}) =>{

    return(
        <IonItem onClick={() => onBuy(_id)}>
            <IonLabel>From: {from}  -  To: {to}  -  Seats: {nrSeats}</IonLabel>
        </IonItem>
    );
};

export const TrainDetails: React.FC<TrainProps> = ({_id, from, to, timeLeave, timeArrive, nrSeats}) =>{
    return(
      <IonList>
          <IonItem>
              From: {from}    To: {to}
          </IonItem>
          <IonItem>Leaves: {timeLeave}</IonItem>
          <IonItem>Arrives: {timeArrive}</IonItem>
          <IonItem>
              Seats: {nrSeats}
          </IonItem>
      </IonList>
    );
}

export default Train;
