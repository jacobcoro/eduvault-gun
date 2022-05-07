import dotenv from 'dotenv';
dotenv.config();
const env = process.env;

export const ENV_CHECK = env.ENV_CHECK;
if (ENV_CHECK !== 'working')
	throw new Error('make sure to set up an .env file as per the example.env');

export const RUN_ENV = env.RUN_ENV;

export const TEST_ENV = env.TEST_ENV;

export const APP_SECRET = env.APP_SECRET || 'super-secret';

/** expressed in seconds or a string describing a time span zeit/ms. Eg: 60, "2 days", "10h", "7d" */
export const JWT_EXPIRY = '30d';

export const APP_KEY_PAIR = JSON.parse(env.APP_KEY_PAIR ?? '');
if (!APP_KEY_PAIR)
	throw new Error('app started without keys. please run `npm run generate-api-keys`');

export const DB_NAME = env.DB_NAME || 'eduvault-backend';

export const PEERS = TEST_ENV === 'unit' ? [] : JSON.parse(env.PEERS ?? '[]');
