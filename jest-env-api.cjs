// if you need polyfills:
const { TestEnvironment } = require('jest-environment-node');

// const fetch = require('isomorphic-fetch');
/**
 * A custom environment to set the TextEncoder that is required by Textile js.
 * add --env=./jest-env.cjs to jest call in package.json script
 */
class CustomTestEnvironment extends TestEnvironment {
	async setup() {
		await super.setup();
		// this.global.fetch = fetch;
	}
}
process.env = {
	ENV_CHECK: 'working',
	TEST_ENV: 'unit',
	APP_SECRET: 'jest-secret'
};

module.exports = CustomTestEnvironment;
