/**
 * REST API Tests for Docs Viewer
 *
 * Note: Currently these tests may fail with 401 errors due to authentication
 * issues with WordPress Playground's login feature. This needs to be resolved
 * before these tests can pass reliably.
 */

const { test, expect } = require('@playwright/test');

test.describe('REST API - Docs Viewer', () => {
	test('GET /wp/v2/docs-viewer/files returns all documentation files', async ({
		page,
	}) => {
		const response = await page.request.get(
			'/wp-json/wp/v2/docs-viewer/files'
		);

		// Should be authenticated (logged in via blueprint)
		expect(response.status()).toBe(200);

		const body = await response.json();

		// Should have files object
		expect(body).toHaveProperty('files');
		expect(body.files).toHaveProperty('plugins');
		expect(body.files).toHaveProperty('themes');
		expect(body.files).toHaveProperty('wordpress');

		// Should include our plugin's docs
		const pluginDocs = body.files.plugins;
		const hasOurPlugin = pluginDocs.some(
			(file) =>
				file.source === 'wp-docs-viewer' && file.name === 'LOCAL-DEVELOPMENT'
		);
		expect(hasOurPlugin).toBe(true);
	});

	test('GET /wp/v2/docs-viewer/file returns specific file content', async ({
		page,
	}) => {
		const response = await page.request.get(
			'/wp-json/wp/v2/docs-viewer/file?path=docs/LOCAL-DEVELOPMENT.md'
		);

		// Should be authenticated (logged in via blueprint)
		expect(response.status()).toBe(200);

		const body = await response.json();

		// Should have path and content
		expect(body).toHaveProperty('path');
		expect(body).toHaveProperty('content');

		// Content should be HTML (markdown rendered)
		expect(body.content).toContain('<h1>');
	});

	test('GET /wp/v2/docs-viewer/file returns 400 for missing path', async ({
		page,
	}) => {
		const response = await page.request.get(
			'/wp-json/wp/v2/docs-viewer/file'
		);

		expect(response.status()).toBe(400);
	});

	test('GET /wp/v2/docs-viewer/file returns 404 for non-existent file', async ({
		page,
	}) => {
		const response = await page.request.get(
			'/wp-json/wp/v2/docs-viewer/file?path=non-existent/file.md'
		);

		expect(response.status()).toBe(404);
	});
});
