const dotenv = require('dotenv');
const Gun = require('gun');
const SEA = require('gun/sea');

const createDbUser = async () => {
	dotenv.config();
	const PEER1 = process.env.PEER1;
	const PEER2 = process.env.PEER2;
	const APP_SECRET = process.env.APP_SECRET;
	const gun = Gun([PEER1, PEER2]);

	const user = gun.user();
	user.create('eduvault-backend', APP_SECRET, (ack) => {
		if ('error' in ack) throw new Error('error creating user');
	});

	const keyPair = await SEA.pair();
	console.log('save this into the .env.   as APP_KEY_PAIR= ...inside single quotes ');
	console.log(JSON.stringify(keyPair));
};

createDbUser();
