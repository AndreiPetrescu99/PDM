import React, { useContext, useEffect, useState } from 'react';
import {
    IonButton,
    IonButtons,
    IonContent, IonFab, IonFabButton,
    IonHeader,
    IonInput, IonList,
    IonLoading,
    IonPage,
    IonTitle,
    IonToolbar,
    IonIcon, IonGrid, IonRow, IonCol, IonImg, IonActionSheet, createAnimation
} from '@ionic/react';
import { getLogger } from '../core';
import { TrainContext } from './TrainProvider';
import { RouteComponentProps } from 'react-router';
import { TrainProps } from './TrainProps';
import {Plugins} from "@capacitor/core";
import {camera, trash, close, star} from 'ionicons/icons';

import Train, {TrainDetails} from "./Train";
import {Photo, usePhotoGallery} from "./usePhotoGallery";
import {AuthContext} from "../auth";
import {MapComponent} from "./MapComponent";
import {useMyLocation} from "./useMyLocation";

const log = getLogger('ItemEdit');

interface ItemEditProps extends RouteComponentProps<{
    id?: string;
}> {}

const ItemEdit: React.FC<ItemEditProps> = ({ history, match }) => {
    const { trains, buying, buyingError, buyTicket } = useContext(TrainContext);
    const {token} = useContext(AuthContext);
    const [text, setText] = useState('');
    const [item, setItem] = useState<TrainProps>();
    const [localItem, setLocalItem] = useState<TrainProps>();
    const [imgPath, setImgPath] = useState("");
    const [base64str, setBase64str] = useState("");

    const { photos, takePhoto, deletePhoto, uploadPhoto } = usePhotoGallery();
    const [photoToDelete, setPhotoToDelete] = useState<Photo>();


    // const [latitude, setLatitude] = useState(47.65371);
    // const [longitude, setLongitude] = useState(24.548178);

    const myLocation = useMyLocation();
    const { latitude: lat, longitude: lng } = myLocation.position?.coords || {}
    const [latitude, setLatitude] = useState(46.769379);
    const [longitude, setLongitude] = useState(23.5899542);

    useEffect(()=>{
        //setLatitude(Number(lat));
        //setLongitude(Number(lng));
    });

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
            item.imgSrc = imgPath;
            item.base64str = base64str;
            buyTicket && buyTicket(item).then(() => history.goBack());
        }
    };
    log('render');


    useEffect(() => {
        async function groupedAnimation() {
            const saveButtonAnimation = createAnimation()
                .addElement(document.getElementsByClassName("button-save")[0])
                .duration(3000)
                .direction('alternate')
                .iterations(Infinity)
                .keyframes([
                    {offset: 0, opacity: '0.6', transform: 'scale(0.7)'},
                    {offset: 1, opacity: '0.99', transform: 'scale(1)'}
                ])

            const deleteButtonAnimation = createAnimation()
                .addElement(document.getElementsByClassName("button-photo")[0])
                .duration(2000)
                .direction('alternate')
                .iterations(Infinity)
                .keyframes([
                    {offset: 0, opacity: '0.6', transform: 'scale(0.7)'},
                    {offset: 1, opacity: '0.99', transform: 'scale(1)'}
                ])

            const parentAnipation = createAnimation()
                .duration(5000)
                .iterations(Infinity)
                .direction('alternate')
                .addAnimation([saveButtonAnimation, deleteButtonAnimation])


            parentAnipation.play();
        }

        groupedAnimation();
    }, [])

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Edit</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={handleBuy} className = "button-save">
                            Buy
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <MapComponent
                    lat={latitude}
                    lng={longitude}
                    onMapClick={(location: any) => {
                        setLatitude(location.latLng.lat());
                        setLongitude(location.latLng.lng());
                    }}
                />
                {item && (
                    <TrainDetails _id={item._id} from={item.from} to={item.to} timeLeave={item.timeLeave} timeArrive={item.timeArrive} nrSeats={item.nrSeats} base64str={item.base64str}/>
                )}
                {item && (
                    <img src={item?.imgSrc} alt="no image"/>
                )}
                <IonGrid>
                    <IonRow>
                        {photos.map((photo, index) => (
                            <IonCol size="6" key={index}>
                                <IonImg onClick={() => setPhotoToDelete(photo)}
                                        src={photo.webviewPath}/>
                            </IonCol>
                        ))}
                    </IonRow>
                </IonGrid>
                <div className={"button-photo"}>
                <IonFab vertical="bottom" horizontal="center" slot="fixed">
                    <IonFabButton onClick={() => {
                        const photoTaken = takePhoto();
                        photoTaken.then((data) => {
                            setImgPath(data.webviewPath!);
                            setBase64str(data.base64str!);
                        })
                    }}>
                        <IonIcon icon={camera}></IonIcon>
                    </IonFabButton>
                </IonFab>
                </div>
                <IonActionSheet
                    isOpen={!!photoToDelete}
                    buttons={[{
                        text: 'Upload',
                        icon: star,
                        handler: () => {
                            handleBuy();
                        }
                    },{
                        text: 'Delete',
                        role: 'destructive',
                        icon: trash,
                        cssClass: "button-delete",
                        handler: () => {
                            if (photoToDelete) {
                                deletePhoto(photoToDelete);
                                setPhotoToDelete(undefined);
                            }
                        }
                    }, {
                        text: 'Cancel',
                        icon: close,
                        role: 'cancel'
                    }]}
                    onDidDismiss={() => setPhotoToDelete(undefined)}
                />
            </IonContent>
        </IonPage>
    );
};

export default ItemEdit;
