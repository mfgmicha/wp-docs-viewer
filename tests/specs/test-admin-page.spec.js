/**
 * Admin Page Tests for Docs Viewer
 */

const { test, expect } = require('@playwright/test');

test.describe('Admin Page - Docs Viewer', () => {
	test('WP Docs Viewer appears under Tools menu', async ({ page }) => {
		// Navigate to admin dashboard
		await page.goto('/wp-admin/');

		// Check if WP Docs Viewer link exists under Tools
		const docsViewerLink = page
			.locator('#adminmenu a[href*="wp-docs-viewer"]')
			.getByText('WP Docs Viewer');
		await expect(docsViewerLink).toBeVisible();
	});

	test('WP Docs Viewer admin page loads', async ({ page }) => {
		// Navigate directly to the admin page
		await page.goto('/wp-admin/tools.php?page=wp-docs-viewer');

		// Check page title
		const pageTitle = page.locator('h1').getByText('WP Docs Viewer');
		await expect(pageTitle).toBeVisible();
	});

	test('WP Docs Viewer admin page renders the block', async ({ page }) => {
		// Navigate to the admin page
		await page.goto('/wp-admin/tools.php?page=wp-docs-viewer');

		// Check that the block container exists
		const blockContainer = page.locator('.wp-block-mfgmicha-docs-viewer');
		await expect(blockContainer).toBeVisible();
	});

	test('Admin page shows file browser UI with file list', async ({
		page,
	}) => {
		// Navigate to the admin page
		await page.goto('/wp-admin/tools.php?page=wp-docs-viewer');

		// Wait for file browser to load
		await page.waitForSelector(
			'.wp-docs-viewer-file-group, .wp-docs-viewer-error',
			{ timeout: 10000 }
		);

		// Should show either file groups or an error
		const hasFileGroups = await page
			.locator('.wp-docs-viewer-file-group')
			.count();
		const hasError = await page
			.locator('.wp-docs-viewer-error, .wp-docs-viewer-preview--error')
			.count();

		// At least one should be visible
		expect(hasFileGroups > 0 || hasError > 0).toBeTruthy();
	});

	test('Admin page displays documentation files', async ({ page }) => {
		// Navigate to the admin page
		await page.goto('/wp-admin/tools.php?page=wp-docs-viewer');

		// Wait for files to load
		await page.waitForSelector('.wp-docs-viewer-file-item', {
			timeout: 10000,
		});

		// Check that at least one file item is visible
		const fileItems = page.locator('.wp-docs-viewer-file-item');
		await expect(fileItems.first()).toBeVisible();

		// Should have wp-docs-viewer docs
		const wpDocsViewerFiles = page
			.locator('.wp-docs-viewer-file-item')
			.filter({ hasText: /LOCAL-DEVELOPMENT|Local Development/i });
		await expect(wpDocsViewerFiles.first()).toBeVisible();
	});
});
