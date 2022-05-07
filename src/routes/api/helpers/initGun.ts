import { APP_SECRET, TEST_ENV } from '../config';
// import Gun from 'gun/gun';
import GunNode from 'gun';
import { default as SEA } from 'gun/sea.js';
import then from 'gun/lib/then.js';

// frontend deps can usually work in backend (node) but usually not vice versa
import { createNewUser, hash } from '../../../lib/helpers';
import { dbEncrypt, doubleHashUser, sleep } from './index';

export const dummyUserPassword = '123123123';
export const dummyUserEmail = 'first@email.com';
export const dummyUserOnceHashedPassword = hash(dummyUserPassword);
export const usersKey = 'users';
export const sessionsKey = 'sessions';

const prepareDummyUser = async (email: string = dummyUserEmail) => {
	const dummyOnceHashed = await createNewUser(email, dummyUserPassword);
	const dummyUser = doubleHashUser(dummyOnceHashed);
	const enc = await dbEncrypt(dummyUser);
	return enc;
};

const initGun = async (peers: string[], userName: string, dbName: string) => {
	console.time('total init time');

	GunNode.SEA = SEA;

	const gunPublic = GunNode(peers);
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

	return {
		gunUser
	};
};

export { initGun };
