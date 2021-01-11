import {
    IonButton,
    IonButtons,
    IonContent,
    IonFab,
    IonFabButton,
    IonHeader,
    IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonList,
    IonLoading,
    IonPage,
    IonTitle,
    IonToolbar, NavContext, useIonViewDidEnter, useIonViewWillEnter,
    IonSearchbar, createAnimation
} from "@ionic/react";
import React, {useCallback, useContext, useEffect, useState} from "react";
import Train from "./Train";
import {baseUrl, getLogger} from '../core';
import {add, train} from "ionicons/icons";
import {TrainContext, TrainProvider} from "./TrainProvider";
import {RouteComponentProps} from "react-router";
import {getTrains, getTrainsPage} from "./TrainsAPI";
import {AuthContext} from "../auth";
import {TrainProps} from "./TrainProps";
import {Plugins} from "@capacitor/core";
import {Redirect} from "react-router-dom";
import {useNetwork} from "../network/useNetwork";
import {useAppState} from "../network/useAppState";
import {useBackgroundTask} from "../network/useBackgroundTask";
const log = getLogger('Home');

const Home: React.FC<RouteComponentProps> = ({history}) =>{

    const { appState } = useAppState();
    const { networkStatus } = useNetwork();

    const {trains, fetching, fetchingError, } = useContext(TrainContext);
    const {token, logout, isAuthenticated} = useContext(AuthContext);
    const {navigate} = useContext(NavContext);
    const [searchText, setSearchText] = useState('');

    const offset = 15
    const [page, setPage] = useState<number>(1);
    const [trainSlice, setTrainSlice] = useState<TrainProps[] | undefined>([]);


    useEffect(() => {
        const slice = trains?.slice(0, offset);
        setTrainSlice(slice);
        //log("FOLOSIM USE EFFECT");
        return;
        }, [trains])
    //log("Dupa use effect", trainSlice);

    useBackgroundTask(() => new Promise(resolve => {
        console.log("Trying to send data");
        resolve = async () => {
            let items = []
            const {Storage} = Plugins;
            const {keys} = await Storage.keys();
            for (let i = 0; i < keys.length; i++) {
                if (keys[i].startsWith("Bought:")) {
                    const res = await Storage.get({key: keys[i]});
                    if (res.value) {
                        items.push(buildTrainProps(JSON.parse(res.value)));
                    }
                }
            }
        }
        resolve();
    }));



    const [disableInfiniteScroll, setDisableInfiniteScroll] = useState<boolean>(false);

    useIonViewDidEnter(async () => {
        // await setInit();
        // await fetchItems(page);
        // @ts-ignore
    });

    async function searchNext($event: CustomEvent<void>) {
        //const {trains, fetching, fetchingError} = useContext(TrainContext);
        log("searching Next");
        log(page);
        // await fetchItems(page);
        if(trainSlice?.length !== trains?.length) {
        const slice = trains?.slice(page*offset, (page+1) * offset);
        // @ts-ignore
        setTrainSlice(trainSlice?.concat(slice));
            setPage(prevState => prevState + 1);
        }
        ($event.target as HTMLIonInfiniteScrollElement).complete();
    }
    const redirect = useCallback(
        () => navigate('/login', 'back'),
        [navigate]
    );

    const handleLogout = () => {
        log('handleLogout');
        logout?.();
        log('is not auth');
        const {Storage} = Plugins;
        Storage.clear();

        redirect();

    }

    const handleSearch = () => {
        if(searchText === ''){
            setTrainSlice([]);
        }else {
            const slice = trains?.filter(train => train.from.startsWith(searchText) || train.to.startsWith(searchText));
            console.log(slice);
            if(slice !== undefined || slice !== [])
                setTrainSlice(slice);
            else setTrainSlice([]);
        }

    }

    useEffect(() => {

        async function basicAnimation() {
            const element = document.getElementsByClassName("buttonLogout");
            if (element) {
                const animation = createAnimation()
                    .addElement(element[0])
                    .duration(3000)
                    .iterations(1)
                    .fromTo('transform', 'translateX(300px)', 'translateX(0px)')
                    .fromTo('opacity', '0', '1.5');

                animation.play();
            }
        }
        basicAnimation();
    }, []);

    log("Trains render...");
    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Student CFR</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={handleLogout} className ="buttonLogout">
                            Logout
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonSearchbar value={searchText} onIonChange={e => {setSearchText(e.detail.value!); handleSearch()}}></IonSearchbar>
                <div>App state is {JSON.stringify(appState)}</div>
                <div>Network status is {JSON.stringify(networkStatus)}</div>
                <IonLoading isOpen = {fetching} message = "Fetching trains"/>
                {trainSlice && (
                    <IonList>
                        {trainSlice.map(({_id, from, to, nrSeats}) =>
                            <Train key={_id} _id={_id} from={from} to={to} nrSeats={nrSeats} onBuy={id => history.push(`/train/${id}`)}/>)}
                    </IonList>
                )}
                {fetchingError && (
                    <div>{fetchingError.message || 'Failed to fetch items'}</div>
                )}
                <IonInfiniteScroll threshold="0" disabled={disableInfiniteScroll}
                                   onIonInfinite={(e: CustomEvent<void>) => searchNext(e)}>
                    <IonInfiniteScrollContent
                        loadingText="Loading...">
                    </IonInfiniteScrollContent>
                </IonInfiniteScroll>
            </IonContent>
        </IonPage>
    );


    async function getLocalData() {
        let items = []
        const {Storage} = Plugins;
        const {keys} = await Storage.keys();
        for(let i = 0; i<keys.length; i++){
            const res = await Storage.get({ key: keys[i] });
            if(res.value) {
                items.push(buildTrainProps(JSON.parse(res.value)));
            }
        }

        return items;
    }

    function buildTrainProps(train: TrainProps){
        return train;
    }


    function trainStorage(token: string) {
        (async () => {
            const { Storage } = Plugins;

            // Saving ({ key: string, value: string }) => Promise<void>
            await Storage.set({
                key: 'user',
                value: JSON.stringify({
                    token: token
                })
            });

            // Loading value by key ({ key: string }) => Promise<{ value: string | null }>
            const res = await Storage.get({ key: 'user' });
            if (res.value) {
                console.log('User found', JSON.parse(res.value));
            } else {
                console.log('User not found');
            }

            // Loading keys () => Promise<{ keys: string[] }>
            const { keys } = await Storage.keys();
            console.log('Keys found', keys);

            // Removing value by key, ({ key: string }) => Promise<void>
            await Storage.remove({ key: 'user' });
            console.log('Keys found after remove', await Storage.keys());

            // Clear storage () => Promise<void>
           // await Storage.clear();
        })();
    }
};

export default Home;