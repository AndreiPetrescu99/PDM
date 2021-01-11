import { useCamera } from '@ionic/react-hooks/camera';
import { CameraPhoto, CameraResultType, CameraSource, FilesystemDirectory } from '@capacitor/core';
import { useEffect, useState } from 'react';
import { base64FromPath, useFilesystem } from '@ionic/react-hooks/filesystem';
import { useStorage } from '@ionic/react-hooks/storage';
import axios from 'axios';
import {authConfig, baseUrl} from "../core";
export interface Photo {
  filepath: string;
  webviewPath?: string;
  base64str?: string;
}

const PHOTO_STORAGE = 'photos';

export function usePhotoGallery() {
  const { getPhoto } = useCamera();
  const [photos, setPhotos] = useState<Photo[]>([]);

  const takePhoto = async () => {
    const cameraPhoto = await getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });
    const fileName = new Date().getTime() + '.jpeg';
    const savedFileImage = await savePicture(cameraPhoto, fileName);
    const newPhotos = [savedFileImage, ...photos];
    setPhotos(newPhotos);
    set(PHOTO_STORAGE, JSON.stringify(newPhotos));
    return savedFileImage;
  };

  const { deleteFile, readFile, writeFile } = useFilesystem();
  const savePicture = async (photo: CameraPhoto, fileName: string): Promise<Photo> => {
    const base64Data = await base64FromPath(photo.webPath!);
    await writeFile({
      path: fileName,
      data: base64Data,
      directory: FilesystemDirectory.Data
    });

    return {
      filepath: fileName,
      webviewPath: photo.webPath,
      base64str: base64Data
    };
  };

  const { get, set } = useStorage();
  useEffect(() => {
    const loadSaved = async () => {
      const photosString = await get(PHOTO_STORAGE);
      const photos = (photosString ? JSON.parse(photosString) : []) as Photo[];
      for (let photo of photos) {
        const file = await readFile({
          path: photo.filepath,
          directory: FilesystemDirectory.Data
        });
        photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
      }
      setPhotos(photos);
    };
    loadSaved();
  }, [get, readFile]);

  const deletePhoto = async (photo: Photo) => {
    const newPhotos = photos.filter(p => p.filepath !== photo.filepath);
    set(PHOTO_STORAGE, JSON.stringify(newPhotos));
    const filename = photo.filepath.substr(photo.filepath.lastIndexOf('/') + 1);
    await deleteFile({
      path: filename,
      directory: FilesystemDirectory.Data
    });
    setPhotos(newPhotos);
  };

  const uploadPhoto = async (photo: Photo, token: string | undefined) => {
    const file = await readFile({
      path: photo.filepath,
      directory: FilesystemDirectory.Data
    });
    const formData = new FormData();
    const imgBlob = new Blob([file.data], {
      type: ".png"
    });
    console.log(imgBlob);
    formData.append('file', imgBlob, photo.filepath);

    const trainURL = `http://${baseUrl}/api/train/upload`;
    console.log(formData);
    axios.post(trainURL, JSON.stringify(formData), authConfig(token));
  }


  return {
    photos,
    takePhoto,
    deletePhoto,
    uploadPhoto,
  };
}
