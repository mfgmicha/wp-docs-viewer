/**
 * Edit component for the Docs Viewer block.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object}   props               Block props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Set block attributes.
 * @return {Element} Element to render.
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	Placeholder,
	TextControl,
	Button,
	PanelBody,
} from '@wordpress/components';

import './editor.scss';

/**
 * Edit component.
 *
 * Renders a simple configuration UI in the block editor.
 * The actual file browser UI is rendered server-side in render.php
 * (used on both frontend and admin page).
 *
 * @param {Object}   props               Block props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Set block attributes.
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
	const { file } = attributes;
	const blockProps = useBlockProps();

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('File Settings', 'wp-docs-viewer')}>
					<TextControl
						label={__('File Path', 'wp-docs-viewer')}
						value={file || ''}
						onChange={(value) => setAttributes({ file: value })}
						placeholder={__(
							'e.g., /wp-content/plugins/my-plugin/docs/readme.md',
							'wp-docs-viewer'
						)}
						help={
							file
								? __(
										'Leave empty to switch to browser mode.',
										'wp-docs-viewer'
									)
								: __(
										'Leave empty to show all documentation files (browser mode).',
										'wp-docs-viewer'
									)
						}
					/>
					{file && (
						<Button
							variant="secondary"
							onClick={() => setAttributes({ file: '' })}
						>
							{__('Clear Path (Browser Mode)', 'wp-docs-viewer')}
						</Button>
					)}
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<Placeholder
					icon="book"
					label={__('Docs Viewer', 'wp-docs-viewer')}
				>
					{file ? (
						<div className="wp-docs-viewer-editor-single-mode">
							<p>
								<span className="dashicons dashicons-media-document"></span>
								{__('Single File Mode', 'wp-docs-viewer')}
							</p>
							<p className="wp-docs-viewer-editor-file-preview">
								<code>{file}</code>
							</p>
							<p className="wp-docs-viewer-editor-hint">
								{__(
									'Edit the file path in the block settings sidebar.',
									'wp-docs-viewer'
								)}
							</p>
						</div>
					) : (
						<div className="wp-docs-viewer-editor-browser-mode">
							<p>
								{__(
									'Browser Mode - All documentation files will be shown on the frontend.',
									'wp-docs-viewer'
								)}
							</p>
							<p className="wp-docs-viewer-editor-hint">
								{__(
									'To display a specific file, enter its path in the block settings sidebar.',
									'wp-docs-viewer'
								)}
							</p>
						</div>
					)}
				</Placeholder>
			</div>
		</>
	);
}
