// import Gun from 'gun/gun';
import GunBrowser from 'gun/gun';
import SEA from 'gun/sea';
import then from 'gun/lib/then';
import { sleep } from '.';

export const usersKey = 'users';
export const sessionsKey = 'sessions';

// this file is failing with "gunpublic.user()" is no a function

/** use community in frontend and private peers in backend */
export const communityPeers = [
	// Community relay peers:
	// https://github.com/amark/gun/wiki/volunteer.dht
	'https://gun-manhattan.herokuapp.com/gun',
	'https://gunmeetingserver.herokuapp.com/gun',
	'https://gun-us.herokuapp.com/gun'
];

export const initGun = async (
	userName: string,
	password: string,
	peers: string[] = communityPeers
) => {
	console.time('total init time');

	GunBrowser.SEA = SEA;

	const gunPublic = GunBrowser(peers);
	const gunUser = gunPublic.user();

	let authenticated = false;
	let times = 0;
	gunUser.auth(userName, password, (ack) => {
		console.log('authenticated', ack);
		authenticated = true;
	});
	while (!authenticated && times < 100) {
		await sleep(30);
		times++;
	}
	if (!authenticated) throw new Error('authentication failed or timed out');
	console.log('waited for auth', times * 30, 'ms');
	return { gunPublic, gunUser };
};
