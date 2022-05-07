import { APP_SECRET, RUN_ENV, TEST_ENV } from '../config';
import Gun from 'gun/gun';
import GunNode from 'gun';
import SEA from 'gun/sea';
import then from 'gun/lib/then';

import { createNewUser } from './createNewUser';
import { dbEncrypt, doubleHashUser, hash } from './crypto';

export const dummyUserPassword = '123123123';
export const dummyUserEmail = 'first@email.com';
export const dummyUserOnceHashedPassword = hash(dummyUserPassword);
export const usersKey = 'users';
export const sessionsKey = 'sessions';

/** Sleep is a wait function */
export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

const prepareDummyUser = async (email: string = dummyUserEmail) => {
	const dummyOnceHashed = await createNewUser(email, dummyUserPassword);
	const dummyUser = doubleHashUser(dummyOnceHashed);
	const enc = await dbEncrypt(dummyUser);
	return enc;
};

/** use community in frontend and private peers in backend */
export const communityPeers = [
	// Community relay peers:
	// https://github.com/amark/gun/wiki/volunteer.dht
	'https://gun-manhattan.herokuapp.com/gun',
	'https://gunmeetingserver.herokuapp.com/gun',
	'https://gun-us.herokuapp.com/gun'
];

const initGun = async (peers: string[], userName: string, dbName: string) => {
	console.time('total init time');

	GunNode.SEA = SEA;
	Gun.SEA = SEA;

	const gunPublic = RUN_ENV === 'node' ? GunNode(peers) : Gun(peers);
	const gunUser = gunPublic.user();

	let authenticated = false;
	let times = 0;
	gunUser.auth(userName, APP_SECRET, () => {
		console.log('authenticated');
		authenticated = true;
	});
	while (!authenticated && times < 100) {
		await sleep(30);
		times++;
	}
	if (!authenticated) throw new Error('authentication failed or timed out');
	console.log('waited for auth', times * 30, 'ms');

	let populated = false;
	times = 0;

	console.time('put dummy user');
	if (TEST_ENV === 'unit') {
		try {
			// remove third user to test signups//
			await gunUser.get(dbName).get(usersKey).get('third@email.com').put(null).then();

			const dummyUser = await prepareDummyUser();
			const dummyUser2 = await prepareDummyUser('second@email.com');

			await gunUser.get(dbName).get(usersKey).get(dummyUserEmail).put(dummyUser).then();
			await gunUser.get(dbName).get(usersKey).get('second@email.com').put(dummyUser2).then();
			populated = true;
		} catch (error) {
			console.log('put dummy user error ', error);
		}
	} else {
		// skip populate
		populated = true;
	}

	while (!populated && times < 100) {
		await sleep(30);
		times++;
	}
	if (!populated) throw new Error('populate failed or timed out');
	console.timeEnd('put dummy user');

	console.timeEnd('total init time');

	return { gunPublic, gunUser };
};

export { initGun };
