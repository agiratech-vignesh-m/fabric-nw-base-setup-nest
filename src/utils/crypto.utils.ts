import CryptoJS from 'crypto-js';
import * as dotenv from 'dotenv';

dotenv.config();

const key: string | undefined = process.env.HASH_SECRET;

// Encryption function
const encrypt = (data: string): string => {
  const encryptedData = CryptoJS.AES.encrypt(data, key).toString();
  return encryptedData;
};

// Decryption function
const decrypt = (data: string): string => {
  const bytes = CryptoJS.AES.decrypt(data, key);
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedData;
};

export { encrypt, decrypt };