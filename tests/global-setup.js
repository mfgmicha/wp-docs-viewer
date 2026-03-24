import { startPlaygroundServer } from './playground-setup';

async function globalSetup() {
	const server = await startPlaygroundServer();
	global.__PLAYWRIGHT_SERVER__ = server;
}

export default globalSetup;
