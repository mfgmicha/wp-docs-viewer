const { test, expect } = require('@playwright/test');

test.describe('Check Test Block', () => {
	test('block renders on frontend', async ({ page }) => {
		await page.goto('/test-block/');

		await expect(
			page.locator(
				'p:has-text("Example Dynamic – hello from a dynamic block!")'
			)
		).toBeVisible();
	});

	test('block works in editor', async ({ page }) => {
		await page.goto('/test-block/');

		await expect(page.locator('#wp-admin-bar-edit')).toBeVisible();
		await page.locator('#wp-admin-bar-edit a').click();
		await expect(page.url()).toContain('&action=edit');

		const locator = page
			.locator('iframe[name="editor-canvas"]')
			.contentFrame();
		await expect(
			locator.getByText('Example Dynamic – hello from the editor!')
		).toBeVisible();
	});
});
