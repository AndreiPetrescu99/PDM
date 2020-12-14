import {useContext, useEffect, useState} from 'react';
import { NetworkStatus, Plugins } from '@capacitor/core';
import {useBackgroundTask} from "./useBackgroundTask";
import {TrainProps} from "../todo/TrainProps";
import {updateTrain} from "../todo/TrainsAPI";
import {AuthContext} from "../auth";

const { BackgroundTask } = Plugins;

const { Network } = Plugins;

const { Storage } = Plugins

const initialState = {
  connected: false,
  connectionType: 'unknown',
}

function buildTrainProps(train: TrainProps){
  return train;
}

export const useNetwork = () => {
  const [networkStatus, setNetworkStatus] = useState(initialState)
  useEffect(() => {
    const handler = Network.addListener('networkStatusChange', handleNetworkStatusChange);
    Network.getStatus().then(handleNetworkStatusChange);
    let canceled = false;
    return () => {
      canceled = true;
      handler.remove();
    }

    async function handleNetworkStatusChange(status: NetworkStatus) {
      console.log('useNetwork - status change', status);
      if (!canceled) {
        if (status.connected) {

          console.log('useBackgroundTask - executeTask started');

          let items = []
          const {Storage} = Plugins;
          const res = await Storage.get({key: 'user'});
          let token;
          if (res.value) {
            console.log('User found', JSON.parse(res.value));
            token = JSON.parse(res.value).token;
          } else {
            console.log('User not found');
            token = '';
          }
          const {keys} = await Storage.keys();
          for (let i = 0; i < keys.length; i++) {
            if (keys[i].startsWith('Bought:')) {
              const res = await Storage.get({key: keys[i]});
              if (res.value) {
                items.push(buildTrainProps(JSON.parse(res.value).train));
                const item = buildTrainProps(JSON.parse(res.value).item);
                //const json = JSON.parse(res.value);
                console.log(item);
                try {
                  //console.log(json._id);
                  if (token !== '') {
                    const savedItem = await (item._id ? updateTrain(token, item) : updateTrain(token, item));
                    if (savedItem && savedItem) {
                      console.log("Saved: " + savedItem);
                    }
                  }
                } catch (error) {
                  console.log("error trying to update data for: " + item);
                }
              }
            }
          }




          // for (let i = 0; i < items.length; i++) {
          //   const item = items[i];
          //   try {
          //     if (token !== '') {
          //       const savedItem = await (item._id ? updateTrain(token, item) : updateTrain(token, item));
          //       if (savedItem && savedItem) {
          //         console.log("Saved: " + savedItem);
          //       }
          //     }
          //   } catch (error) {
          //     console.log("error trying to update data for: " + item);
          //   }
          // }


          console.log('useBackgroundTask - executeTask finished');

          // let taskId = BackgroundTask.beforeExit(async () => {
          //   console.log('useBackgroundTask - executeTask started');
          //
          //   let items = []
          //   const {Storage} = Plugins;
          //   const res = await Storage.get({ key: 'user' });
          //   let token;
          //   if (res.value) {
          //     console.log('User found', JSON.parse(res.value));
          //     token = res.value;
          //   } else {
          //     console.log('User not found');
          //     token = '';
          //   }
          //   const {keys} = await Storage.keys();
          //   for (let i = 0; i < keys.length; i++) {
          //     if (keys[i].startsWith('Bought:')) {
          //       const res = await Storage.get({key: keys[i]});
          //       if (res.value) {
          //         items.push(buildTrainProps(JSON.parse(res.value)));
          //       }
          //     }
          //   }
          //
          //
          //   for(let i=0; i<items.length; i++){
          //     const item = items[i];
          //     try {
          //       if(token !== '') {
          //         const savedItem = await (item._id ? updateTrain(token, item) : updateTrain(token, item));
          //         if(savedItem && savedItem){
          //           console.log("Saved: " + savedItem);
          //         }
          //       }
          //     }catch (error){
          //       console.log("error trying to update data for: " + item);
          //     }
          //   }
          //
          //
          //   console.log('useBackgroundTask - executeTask finished');
          //   BackgroundTask.finish({ taskId });
          // });
        }
        setNetworkStatus(status);
      }
    }
  }, [])
  return { networkStatus };
};
