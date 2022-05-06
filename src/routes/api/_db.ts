import { hashPassword } from '$lib/helpers/crypto';
import type { ServerSession, User } from 'src/types';
import { v4 as uuidv4 } from 'uuid';
import { initGun } from '$lib/helpers/initGun';
import { APP_KEY_PAIR, APP_SECRET, DB_NAME, PEER1, PEER2 } from '$lib/config';
import SEA from 'gun/sea';
import then from 'gun/lib/then';
const gun = initGun([PEER1, PEER2]);
const userKey = 'user';
const sessionKey = 'session';

const gunUser = gun.user();
let db = gunUser.get(DB_NAME);

gunUser.auth(DB_NAME, APP_SECRET, (ack) => {
	console.log({ ack });
	db = gunUser.get(DB_NAME);
	db.get(userKey).on((change) => {
		console.log(change);
	});
});
const appKeyPair = JSON.parse(APP_KEY_PAIR);

async function dbEncrypt(data: unknown) {
	return await SEA.encrypt(data, appKeyPair);
}
async function dbDecrypt<T>(data: string) {
	// seems that decrypt already applies JSON.parse on the data
	return (await SEA.decrypt(data, appKeyPair)) as T;
}

const users: User[] = [];
let sessions: ServerSession[] = [];

export const getUserByEmail = (email: string) => {
	const existingUser = users.find((user) => user.email === email);
	if (!existingUser) return null;
	return existingUser;
};

const log = (data: any) => console.log(data);

export const registerUser = async (user: User) => {
	console.log({ user });
	const users = await db.get(userKey).map().then();
	console.log({ users });
	users.once(log);
	const existingUser = users.get(user.pubKey);
	existingUser.once(log);
	const email = existingUser.get('email');
	email.once(log);
	// if (existingUser) throw new Error('User already exists');

	const encryptedUser = await dbEncrypt(user);
	const decryptedUser = await dbDecrypt<User>(encryptedUser);
	if (decryptedUser.pubKey !== user.pubKey) throw new Error('unable to encrypt and decrypt');
	db.get(userKey).put({ [user.pubKey]: encryptedUser });

	// Yes I know we have ssl etc. But this double hashing means the original password never even leaves the frontend.
	const doubleHashedPassword = hashPassword(user.passwordHash);
	// users.push({ ...user, passwordHash: doubleHashedPassword });
	return user;
};

export const createSession = (email: string) => {
	const user = getUserByEmail(email);
	if (!user) throw new Error('user not found by email');
	const session: ServerSession = {
		id: uuidv4(),
		user
	};
	sessions.push(session);
	return session;
};

export const getSession = (id: string) => {
	const session = sessions.find((session) => session.id === id);
	if (!session) null;
	return session;
};

export const removeSession = (id: string) => {
	const session = sessions.find((session) => session.id === id);
	if (!session) throw new Error('Session not found');
	sessions = sessions.filter((session) => session.id !== id);
	return session;
};
