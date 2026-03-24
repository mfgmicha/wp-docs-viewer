/**
 * Cache Tests for Docs Viewer
 */

const { test, expect } = require('@playwright/test');

test.describe('Cache - Docs Viewer', () => {
	test('GET /wp/v2/docs-viewer/files returns cached results on second call', async ({
		page,
	}) => {
		// First call - should return fresh data
		const response1 = await page.request.get(
			'/wp-json/wp/v2/docs-viewer/files'
		);
		expect(response1.status()).toBe(200);
		const body1 = await response1.json();

		// Wait a moment
		await page.waitForTimeout(100);

		// Second call - should return same data (cached)
		const response2 = await page.request.get(
			'/wp-json/wp/v2/docs-viewer/files'
		);
		expect(response2.status()).toBe(200);
		const body2 = await response2.json();

		// Results should be identical
		expect(body1.files).toEqual(body2.files);
	});

	test('GET /wp/v2/docs-viewer/files?refresh=true forces fresh data', async ({
		page,
	}) => {
		// First call
		const response1 = await page.request.get(
			'/wp-json/wp/v2/docs-viewer/files'
		);
		expect(response1.status()).toBe(200);

		// Force refresh
		const response2 = await page.request.get(
			'/wp-json/wp/v2/docs-viewer/files?refresh=true'
		);
		expect(response2.status()).toBe(200);

		// Both should return valid data (refresh should work regardless)
		const body2 = await response2.json();
		expect(body2.files).toHaveProperty('plugins');
		expect(body2.files).toHaveProperty('themes');
		expect(body2.files).toHaveProperty('wordpress');
	});
});
