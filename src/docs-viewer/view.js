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
			const filePath = block.dataset.file;
			if (filePath) {
				fetchAndRenderDoc(block, filePath);
			}
		});
});

/**
 * Fetch and render a documentation file.
 *
 * @param {HTMLElement} block Block element.
 * @param {string}      path  File path.
 */
async function fetchAndRenderDoc(block, path) {
	const container = block.querySelector('.wp-docs-viewer-content');

	if (!container) {
		return;
	}

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
