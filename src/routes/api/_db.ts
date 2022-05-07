import { v4 as uuidv4 } from 'uuid';

import { dbDecrypt, dbEncrypt, doubleHashUser, initGun, sleep, usersKey } from './helpers';
import { DB_NAME, PEERS } from './config';

import type { IGunChain } from 'gun';
import type { ServerSession, User } from 'src/types';

/**
 * removes gundb metadata from data fetched with `.then()`
 *
 * optimistically adds a type to the data (be careful, the return data might not actually be that type.)
 */
export function sanitize<T>(o: any) {
	const copy = { ...o };
	delete copy._;
	return copy as T;
}

// might need the root db later.
// type GunUser = IGunUserInstance<any, any, any, IGunInstanceRoot<any, IGunInstance<any>>>;
// let dbRoot: GunUser | null = null;

let db: IGunChain<any, any, any, string> | null = null;

let sessions: ServerSession[] = [];

initGun(PEERS, DB_NAME, DB_NAME).then(({ gunUser }) => {
	// dbRoot = gunUser;
	db = gunUser.get(DB_NAME);
});

export const getUserByEmail = async (email: string) => {
	while (!db) await sleep(35); // // to query all users
	// query all users
	// db.get(usersKey)
	// 	.map()
	// 	.once(async (data) => {
	// 		const userMap = data ? await dbDecrypt(data) : null;
	// 		console.log({ userMap });
	// 	});
	// or
	// buggy - sometimes it hangs on this forever without any feedback
	// const users = await db.get(usersKey).map().once().then();
	// console.log({ users });

	let user: User | null = null;
	let finished = false;
	// strange behavior from gun. Was not able to use the .then() await syntax because sometimes await db.get(usersKey).get(email) returns ALL the users.
	db.get(usersKey)
		.get(email)
		.once(async (encryptedUser) => {
			user = encryptedUser ? await dbDecrypt<User>(encryptedUser) : null;
			finished = true;
		});

	while (!finished) await sleep(35);
	// console.log({ user });

	if (!user) return null;
	return user as User;
};

export const registerUser = async (user: User) => {
	while (!db) await sleep(35);

	const existingUser = await getUserByEmail(user.email);
	if (existingUser) throw new Error('User already exists');

	// Yes I know we have ssl etc. But this double hashing means the original password never even leaves the frontend.

	const doubleHashedUser = doubleHashUser(user);
	let encryptedUser = '';
	let decryptedUser: User | null = null;

	encryptedUser = await dbEncrypt(doubleHashedUser);
	decryptedUser = await dbDecrypt<User>(encryptedUser);
	if (!decryptedUser || decryptedUser.pubKey !== user.pubKey)
		throw new Error('unable to encrypt and decrypt');

	await db.get(usersKey).get(user.email).put(encryptedUser).then();

	return doubleHashedUser;
};

export const createSession = async (email: string) => {
	const user = await getUserByEmail(email);
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
