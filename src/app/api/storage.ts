import { useState } from 'react';
import { storageService } from '../services/storage.service';

export const useStorage = () => {
  const [isUploadLoading, setIsUploadLoading] = useState(false);

  const uploadFile = async (file: File, path: string) => {
    try {
      setIsUploadLoading(true);
      const url = await storageService.upload(file, path);
      if (url) {
        setIsUploadLoading(false);
        return url;
      }
    } catch (error) {
      console.log(error);
      setIsUploadLoading(false);
    }
  };

  return { uploadFile, isUploadLoading };
};
