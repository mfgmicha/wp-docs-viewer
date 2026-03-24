/**
 * Frontend view for the Docs Viewer block.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#view-script
 */

import './style.scss';

/**
 * Initialize all docs viewer blocks on the page.
 */
document.addEventListener('DOMContentLoaded', () => {
	document
		.querySelectorAll('.wp-block-mfgmicha-docs-viewer')
		.forEach((block) => {
			// Look for data-file on the inner content div
			const contentEl = block.querySelector('.wp-docs-viewer-content');
			const filePath = contentEl ? contentEl.dataset.file : null;
			if (filePath) {
				fetchAndRenderDoc(contentEl, filePath);
			}
		});
});

/**
 * Fetch and render a documentation file.
 *
 * @param {HTMLElement} container Container element.
 * @param {string}      path     File path.
 */
async function fetchAndRenderDoc(container, path) {
	try {
		const response = await fetch(
			`/wp-json/wp/v2/docs-viewer/file?path=${encodeURIComponent(path)}`
		);

		if (!response.ok) {
			throw new Error(`HTTP error: ${response.status}`);
		}

		const data = await response.json();

		if (data.content) {
			container.innerHTML = data.content;
		}
	} catch (error) {
		container.innerHTML = `<p class="wp-docs-viewer-error">Error loading documentation: ${error.message}</p>`;
	}
}
