const dotenv = require('dotenv');
const Gun = require('@jacobcoro/gun');
const SEA = require('@jacobcoro/gun/sea.js');

dotenv.config();

const createDbUser = async () => {
	console.log('\n\n\n');
	const PEERS = JSON.parse(process.env.PEERS);
	const APP_SECRET = process.env.APP_SECRET;

	const gun = Gun(PEERS);

	const user = gun.user();
	user.create('eduvault-backend', APP_SECRET, (ack) => {
		if ('error' in ack) throw new Error('error creating user');
	});

	const keyPair = await SEA.pair();
	console.log('save this into the .env.   as APP_KEY_PAIR= ...');
	console.log(JSON.stringify(keyPair));
};

const createJestUser = async () => {
	console.log(
		'\n\n\nMAKE SURE jestGun.user().create() DB_NAME and APP_SECRET match jest-env-api.cjs !!!!!!!'
	);
	const jestGun = Gun([]);
	// MAKE SURE these match the DB_NAME and APP_SECRET in jest-env-api.cjs !!!!!!!
	jestGun.user().create('jest-db-name', 'jest-secret', (ack) => {
		if ('error' in ack) throw new Error('error creating user');
	});
	const jestKeyPair = await SEA.pair();
	console.log('save this into the jest-env-api.cjs   as APP_KEY_PAIR= ...');
	console.log(JSON.stringify(jestKeyPair));
};

createDbUser();
createJestUser();
