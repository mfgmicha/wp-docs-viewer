const { test, expect } = require('@playwright/test');

test.describe('Docs Viewer Block', () => {
	test('block renders on frontend', async ({ page }) => {
		await page.goto('/test-block/');

		// The block should be visible
		const block = page.locator('.wp-block-mfgmicha-docs-viewer');
		await expect(block).toBeVisible();

		// In browser mode (no file selected), should show file browser
		const browser = page.locator('.wp-docs-viewer-browser');
		await expect(browser).toBeVisible();
	});

	test('block works in editor', async ({ page }) => {
		await page.goto('/test-block/');

		// Click edit button
		await expect(page.locator('#wp-admin-bar-edit')).toBeVisible();
		await page.locator('#wp-admin-bar-edit a').click();
		await expect(page.url()).toContain('&action=edit');

		// Wait for editor to load
		await page.waitForTimeout(2000);

		// The block should be visible in the editor
		const blockInEditor = page
			.frameLocator('iframe[name="editor-canvas"]')
			.locator('.wp-block-mfgmicha-docs-viewer');
		await expect(blockInEditor).toBeVisible();
	});
});
