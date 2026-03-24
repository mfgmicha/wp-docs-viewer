import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: './specs/',
	timeout: 30000,
	expect: {
		timeout: 5000,
	},
	fullyParallel: true,
	retries: 2,
	reporter: 'list',
	use: {
		baseURL: 'http://127.0.0.1:8890',
		trace: 'on-first-retry',
		headless: true,
		actionTimeout: 10000,
	},
	projects: [
		{
			name: 'chromium',
			use: {
				...devices['Desktop Chrome'],
				launchOptions: {
					args: [
						'--disable-proxy-bypass',
						'--disable-setuid-sandbox',
					],
				},
			},
		},
	],
	globalSetup: require.resolve('./global-setup.js'),
	globalTeardown: require.resolve('./global-teardown.js'),
});
