import adapter from '@sveltejs/adapter-vercel';
import preprocess from 'svelte-preprocess';
const noExternal = process.env.NODE_ENV === 'production' ? ['text-encoder'] : [];
/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess({
		scss: {
			prependData: `@use './src/style';`
		}
	}),

	kit: {
		adapter: adapter()
	},
	vite: { ssr: { noExternal } }
};
export default config;
