import { APP_KEY_PAIR } from '../config';
import * as bcrypt from 'bcryptjs';
import CryptoJS from 'crypto-js';
import SEA from 'gun/sea';

export const hash = (content: string) => {
	return CryptoJS.SHA256(content).toString();
};

export const hashPassword = (password: string) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const validPasswordHash = (providedPassword: string, storedPasswordHash: string) => {
	try {
		return bcrypt.compareSync(providedPassword, storedPasswordHash);
	} catch (error) {
		return false;
	}
};

export const doubleHashUser = (user: User) => {
	const doubleHashedPassword = hashPassword(user.passwordHash);
	return { ...user, passwordHash: doubleHashedPassword };
};

export const encrypt = (content: unknown, encryptKey: string) => {
	// console.log('encrypting', { content, encryptKey });
	if (!content) throw 'no encryption content';

	if (!encryptKey) throw 'no encryption key';

	const encJson = CryptoJS.AES.encrypt(JSON.stringify(content), encryptKey).toString();
	const encrypted = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encJson));
	// throw { encrypted });
	return encrypted;
};

export const decrypt = (content: string, decryptKey: string) => {
	// console.log('decrypting', { content, decryptKey });
	try {
		const decData = CryptoJS.enc.Base64.parse(content).toString(CryptoJS.enc.Utf8);
		const decryptedBytes = CryptoJS.AES.decrypt(decData, decryptKey).toString(CryptoJS.enc.Utf8);
		const decrypted = JSON.parse(decryptedBytes);
		// console.log({ decrypted });
		return decrypted;
	} catch (error) {
		console.log('decryption error', error);
		return false;
	}
};

export async function dbEncrypt(data: any) {
	return await SEA.encrypt(data, APP_KEY_PAIR);
}

/**
 * optimistically adds a type to the data (be careful, the return data might not actually be that type.)
 */
export async function dbDecrypt<T>(data: any) {
	// seems that decrypt already applies JSON.parse on the data
	return (await SEA.decrypt(data, APP_KEY_PAIR)) as T;
}
