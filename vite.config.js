import dotenv from 'dotenv';
import { defineConfig } from 'vite';
import replace from '@rollup/plugin-replace';
import EnvironmentPlugin from "vite-plugin-environment";

dotenv.config();

export default defineConfig({
	// Your VITE configuration settings here
	server: {
		host: true,
	},

	// Change the output format to ESM
	build: {
		rollupOptions: {
			output: {
				format: 'esm', // Set the format to 'esm'
			},
			plugins: [

				EnvironmentPlugin(['OPENAI_KEY']),
			],
		},
	},
});
