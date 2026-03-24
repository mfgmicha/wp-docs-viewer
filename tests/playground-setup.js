import { runCLI } from '@wp-playground/cli';
import { resolve } from 'path';

const projectRoot = resolve(__dirname, '..');

async function startPlaygroundServer() {
	let server;
	try {
		server = await runCLI({
			command: 'server',
			php: '8.3',
			wp: 'latest',
			port: 8890,
			reset: true,
			login: true,
			mount: [
				{
					hostPath: projectRoot,
					vfsPath: '/wordpress/wp-content/plugins/wp-docs-viewer',
				},
			],
			blueprint: {
				steps: [
					{
						step: 'activatePlugin',
						pluginPath: 'wp-docs-viewer/plugin.php',
					},
					{
						step: 'wp-cli',
						command:
							'wp post create --post_title="Test Block Browser Mode" --post_slug="test-block-browser" --post_type=page --post_status=publish --post_content="<!-- wp:mfgmicha/docs-viewer /-->',
					},
					{
						step: 'wp-cli',
						command:
							'wp post create --post_title="Test Block Single File" --post_slug="test-block-single" --post_type=page --post_status=publish --post_content="<!-- wp:mfgmicha/docs-viewer {\\\"file\\\":\\\"plugins/wp-docs-viewer/docs/SETUP.md\\\"} /-->"',
					},
				],
			},
		});
	} catch (e) {
		// eslint-disable-next-line no-console
		console.error('Failed to start Playground:', e.message);
		throw e;
	}

	return {
		close: async () => {
			try {
				if (server.close) {
					await server.close();
				}
			} catch (e) {
				// eslint-disable-next-line no-console
				console.warn('Error closing server:', e.message);
			}
		},
		url: server?.url || `http://127.0.0.1:8890`,
	};
}

export { startPlaygroundServer };
