import Compressor from "image-compressor.js";
import { storage } from "../firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

const uploadFile = async (file, path, setStatus) => {
  try {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setStatus(percent);
        },
        (err) => {
          reject(err);
        },
        async () => {
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({ url });
          } catch (error) {
            reject({ error });
          }
        }
      );
    });
  } catch (error) {
    throw { error };
  }
};

const compressFile = async (file) => {
  try {
    const compressedFile = await new Promise((resolve, reject) => {
      new Compressor(file, {
        quality: 0.8,
        success(result) {
          resolve(result);
        },
        error(err) {
          reject(err);
        },
      });
    });
    return compressedFile;
  } catch (error) {
    return null;
  }
};

export { compressFile, uploadFile };
