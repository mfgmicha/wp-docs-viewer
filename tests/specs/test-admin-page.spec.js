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
		// The block will be rendered inside a div with the block name
		const blockContainer = page.locator('.wp-block-mfgmicha-docs-viewer');
		await expect(blockContainer).toBeVisible();
	});
});
