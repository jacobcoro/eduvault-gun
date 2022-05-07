// if you need polyfills:
const { TestEnvironment } = require('jest-environment-node');

const fetch = require('isomorphic-fetch');
const { Response, Headers, Request } = require('whatwg-fetch');
/**
 * A custom environment to set the TextEncoder that is required by Textile js.
 * add --env=./jest-env.cjs to jest call in package.json script
 */
class CustomTestEnvironment extends TestEnvironment {
	async setup() {
		await super.setup();
		this.global.fetch = fetch;
		this.global.Response = Response;
		this.global.Headers = Headers;
		this.global.Request = Request;
	}
}
process.env = {
	ENV_CHECK: 'working',
	RUN_ENV: 'node',
	TEST_ENV: 'unit',
	APP_SECRET: 'jest-secret',
	DB_NAME: 'jest-db-name',
	KEY_PAIR:
		'{"pub":"q6Q76_iv8xPiP1_HkbuBkp29XZ4CI5uFh_-nPunDPn4.chGvUOFTFPV0DOd54KwajnOm6dnw4V7wjGRczQlinFs","priv":"6ZoN3mWb1GkZ5HTm-FikpbF5WrGtDGkUCYu4Tw-72bY","epub":"B6QPZMdhqc_riJmRAzZzWspODbvevML-O6NS3CQQ5x0.-dqWqswTKDZg4ndQACOn4VtlVWrvkkuULuxJQq2qzBY","epriv":"iecRFM73oTd6rCSwVHBWjbtQ_pOe-1--ObpJBDMglg8"}'
};

module.exports = CustomTestEnvironment;
