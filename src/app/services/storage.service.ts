import { ref, uploadBytes, storage, getDownloadURL } from '../libs/firebase';

class StorageService {
  async upload(file: File, path: string) {
    const storageRef = ref(storage, `${path}/${file.name}`);
    const result = await uploadBytes(storageRef, file);
    if (result) {
      const url = await getDownloadURL(result.ref);
      return url;
    }
  }
}

export const storageService = new StorageService();
