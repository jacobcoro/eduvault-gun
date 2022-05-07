import { APP_KEY_PAIR } from '../config';
import * as bcrypt from 'bcryptjs';
import { default as SEA } from 'gun/sea.js';

export const hashPassword = (password: string) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const validPasswordHash = (providedPassword: string, storedPasswordHash: string) => {
	try {
		return bcrypt.compareSync(providedPassword, storedPasswordHash);
	} catch (error) {
		return false;
	}
};

export const doubleHashUser = (user: User) => {
	if (!user.passwordHash) throw new Error('must be called with password hash');
	const doubleHashedPassword = hashPassword(user.passwordHash);
	return { ...user, passwordHash: doubleHashedPassword };
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
