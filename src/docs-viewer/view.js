/**
 * Frontend view for the Docs Viewer block.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata.md#view-script
 */

import './style.scss';

/**
 * Initialize all docs viewer blocks on the page.
 */
document.addEventListener('DOMContentLoaded', () => {
	document
		.querySelectorAll('.wp-block-mfgmicha-docs-viewer')
		.forEach((block) => {
			initDocsViewer(block);
		});
});

/**
 * Initialize a docs viewer block.
 *
 * @param {HTMLElement} block The block element.
 */
function initDocsViewer(block) {
	const browser = block.querySelector('.wp-docs-viewer-browser');

	if (!browser) {
		// Single file mode - just render the content (already done by PHP)
		return;
	}

	// Browser mode - add interactivity
	initFileBrowser(browser);
}

/**
 * Initialize file browser interactivity.
 *
 * @param {HTMLElement} browser The browser element.
 */
function initFileBrowser(browser) {
	const groupToggles = browser.querySelectorAll(
		'.wp-docs-viewer-group-toggle'
	);
	const fileItems = browser.querySelectorAll('.wp-docs-viewer-file-item');
	const previewArea = browser.querySelector('.wp-docs-viewer-preview-area');

	// Toggle group expand/collapse
	groupToggles.forEach((toggle) => {
		toggle.addEventListener('click', () => {
			const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
			const fileList = toggle.nextElementSibling;

			toggle.setAttribute('aria-expanded', !isExpanded);
			toggle.querySelector('.wp-docs-viewer-group-arrow').textContent =
				isExpanded ? '▶' : '▼';

			if (fileList) {
				fileList.hidden = isExpanded;
			}
		});
	});

	// Handle file selection
	fileItems.forEach((item) => {
		item.addEventListener('click', () => {
			const path = item.dataset.path;

			// Update selection state
			fileItems.forEach((f) => f.classList.remove('is-selected'));
			item.classList.add('is-selected');

			// Fetch and render file content
			fetchAndRenderDoc(previewArea, path);
		});
	});
}

/**
 * Fetch and render a documentation file.
 *
 * @param {HTMLElement} container Container element.
 * @param {string}      path      File path.
 */
async function fetchAndRenderDoc(container, path) {
	// Show loading state
	container.innerHTML = `
		<div class="wp-docs-viewer-preview wp-docs-viewer-preview--loading">
			<p>Loading...</p>
		</div>
	`;

	try {
		const response = await fetch(
			`/wp-json/wp/v2/docs-viewer/file?path=${encodeURIComponent(path)}`
		);

		if (!response.ok) {
			throw new Error(`HTTP error: ${response.status}`);
		}

		const data = await response.json();

		if (data.content) {
			container.innerHTML = `
				<div class="wp-docs-viewer-preview">
					${data.content}
				</div>
			`;
		} else {
			throw new Error('No content returned');
		}
	} catch (error) {
		container.innerHTML = `
			<div class="wp-docs-viewer-preview wp-docs-viewer-preview--error">
				<p>Error loading documentation: ${error.message}</p>
			</div>
		`;
	}
}
