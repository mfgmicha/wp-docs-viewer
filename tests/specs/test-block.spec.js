const { test, expect } = require('@playwright/test');

test.describe('Docs Viewer Block', () => {
	test.describe.configure({ mode: 'serial' });

	test('block renders in browser mode (no file)', async ({ page }) => {
		await page.goto('/test-block-browser/');

		// The block should be visible
		const block = page.locator('.wp-block-mfgmicha-docs-viewer');
		await expect(block).toBeVisible();

		// In browser mode, should show file browser
		const browser = page.locator('.wp-docs-viewer-browser');
		await expect(browser).toBeVisible();

		// Should show file groups (plugins, themes, wordpress)
		const fileGroups = page.locator('.wp-docs-viewer-file-group');
		await expect(fileGroups.first()).toBeVisible();
	});

	test('block renders in single file mode', async ({ page }) => {
		await page.goto('/test-block-single/');

		// The block should be visible
		const block = page.locator('.wp-block-mfgmicha-docs-viewer');
		await expect(block).toBeVisible();

		// Should NOT show file browser
		const browser = page.locator('.wp-docs-viewer-browser');
		await expect(browser).not.toBeVisible();

		// Should show single file mode content
		const singleFile = page.locator('.wp-docs-viewer-single-file');
		await expect(singleFile).toBeVisible();

		// Should show the file header
		const fileHeader = page.locator('.wp-docs-viewer-file-header');
		await expect(fileHeader).toBeVisible();
	});

	test('block works in editor', async ({ page }) => {
		await page.goto('/test-block-browser/');

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

		// Should show placeholder with icon
		const placeholder = page
			.frameLocator('iframe[name="editor-canvas"]')
			.locator('.components-placeholder');
		await expect(placeholder).toBeVisible();

		// Should show "Browser Mode" text in the block placeholder
		const browserModeText = page
			.frameLocator('iframe[name="editor-canvas"]')
			.locator('.wp-block-mfgmicha-docs-viewer >> text=Browser Mode');
		await expect(browserModeText).toBeVisible();
	});
});
