/**
 * REST API Tests for Docs Viewer
 */

const { test, expect } = require('@playwright/test');

test.describe('REST API - Docs Viewer', () => {
	test('GET /wp/v2/docs-viewer/files returns all documentation files', async ({
		page,
	}) => {
		const response = await page.request.get(
			'/wp-json/wp/v2/docs-viewer/files'
		);

		expect(response.status()).toBe(200);

		const body = await response.json();

		// Should have files object
		expect(body).toHaveProperty('files');
		expect(body.files).toHaveProperty('plugins');
		expect(body.files).toHaveProperty('themes');
		expect(body.files).toHaveProperty('wordpress');

		// Should include our plugin's docs (check that we have some wp-docs-viewer docs)
		const pluginDocs = body.files.plugins;
		expect(pluginDocs.length).toBeGreaterThan(0);

		// Store first file path for next test
		const firstFile = pluginDocs[0];
		expect(firstFile).toHaveProperty('path');
		expect(firstFile).toHaveProperty('source');
		expect(firstFile).toHaveProperty('source_type');
		expect(firstFile).toHaveProperty('name');
		expect(firstFile).toHaveProperty('url');

		// Store for use in other tests
		test.info().annotations.push({
			type: 'file-path',
			description: firstFile.path,
		});
	});

	test('GET /wp/v2/docs-viewer/file returns specific file content', async ({
		page,
	}) => {
		// First get the list of files to find a valid path
		const listResponse = await page.request.get(
			'/wp-json/wp/v2/docs-viewer/files'
		);
		expect(listResponse.status()).toBe(200);

		const listBody = await listResponse.json();
		const pluginDocs = listBody.files.plugins;

		// Use the first file from our plugin
		const ourPluginFile = pluginDocs.find(
			(file) =>
				file.source === 'wp-docs-viewer' ||
				file.source.includes('wp-docs-viewer')
		);

		expect(ourPluginFile).toBeDefined();

		const response = await page.request.get(
			`/wp-json/wp/v2/docs-viewer/file?path=${ourPluginFile.path}`
		);

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
