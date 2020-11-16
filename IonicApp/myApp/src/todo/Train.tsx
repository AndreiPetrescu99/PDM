import React from "react";
import {TrainProps} from "./TrainProps";
import {time} from "ionicons/icons";
import {IonItem, IonLabel, IonList} from "@ionic/react";

interface TrainPropsExt extends TrainProps{
    onBuy: (id?: string) => void;
}

const Train: React.FC<TrainPropsExt> = ({id, from, to, timeLeave, timeArrive, nrSeats, onBuy}) =>{
    return(
        <IonItem onClick={() => onBuy(id)}>
            <IonLabel>From: {from}  -  To: {to}  -  Seats: {nrSeats}</IonLabel>
        </IonItem>
    );
};

export const TrainDetails: React.FC<TrainProps> = ({id, from, to, timeLeave, timeArrive, nrSeats}) =>{
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
