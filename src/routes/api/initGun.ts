import Gun from 'gun/gun';
import SEA from 'gun/sea';
const initGun = () => {
	// if (process.env.NODE_ENV === 'development') {
	// 	peers = ['http://localhost:8765/gun'];
	// } else {
	const peers = [
		// Community relay peers:
		// https://github.com/amark/gun/wiki/volunteer.dht
		'https://gun-manhattan.herokuapp.com/gun',
		'https://gunmeetingserver.herokuapp.com/gun',
		'https://gun-us.herokuapp.com/gun'
	];
	// }
	const gun = Gun({
		peers
	});
	// console.log(gun, Gun);
	// const user = gun.user();
	// const SEA = Gun.SEA;
	// const personPair = await SEA.pair();
	// console.log({ personPair });
	// const person = user.create(Math.random().toString(), 'password123', (ack) => {
	// 	console.log(ack);
	// 	if ('err' in ack) return;
	// 	const auth = gun.get('~' + ack.pub);
	// 	console.log(auth);
	// });s
	// const test = gun.get('test');
	// test.put({ val: 'testval' });
	// attaching gun to window for testing purposes
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	//@ts-ignore
	// global.window.gun = gun;

	return gun;
};

export { initGun };
