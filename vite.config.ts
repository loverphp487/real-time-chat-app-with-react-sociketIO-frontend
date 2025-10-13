import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // Import the plugin
import tsconfigPaths from 'vite-tsconfig-paths';
import { browserslistToTargets } from 'lightningcss';
import browserslist from 'browserslist';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react({
			babel: {
				plugins: [['babel-plugin-react-compiler']],
			},
		}),
		tailwindcss(),
		tsconfigPaths(),
	],
	resolve: {
		alias: { find: '@', replacement: path.resolve(__dirname, 'src') },
	},
	css: {
		lightningcss: {
			targets: browserslistToTargets(browserslist('>= 0.25%')), // Adjust target browsers as needed
		},
	},
	build: {
		cssMinify: 'lightningcss',
	},
});
