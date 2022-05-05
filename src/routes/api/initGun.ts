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

	return gun;
};

export { initGun };
