import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [
		react(),
		nodePolyfills({
			include: ['buffer', 'crypto'],
			exclude: [
				'_stream_duplex',
				'_stream_passthrough',
				'_stream_readable',
				'_stream_transform',
				'_stream_writable',
				'assert',
				'child_process',
				'cluster',
				'console',
				'constants',
				'dgram',
				'dns',
				'domain',
				'events',
				'fs',
				'http',
				'http2',
				'https',
				'module',
				'net',
				'os',
				'path',
				'process',
				'punycode',
				'querystring',
				'readline',
				'repl',
				'stream',
				'string_decoder',
				'sys',
				'timers',
				'timers/promises',
				'tls',
				'tty',
				'url',
				'util',
				'vm',
				'zlib',
			],
			protocolImports: true,
		}),
	],
	resolve: {
		alias: {
			"@": "/src",
			process: "process/browser",
			stream: "stream-browserify",
			zlib: "browserify-zlib",
			util: 'util',
		},
	}
})
