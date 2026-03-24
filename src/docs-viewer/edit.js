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
import { useBlockProps } from '@wordpress/block-editor';
import {
	Placeholder,
	TextControl,
	Button,
	Panel,
	PanelBody,
} from '@wordpress/components';
import { useState } from '@wordpress/element';

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
	const [isExpanded, setIsExpanded] = useState(false);
	const blockProps = useBlockProps();

	// Browser mode: no file selected
	if (!file) {
		return (
			<div {...blockProps}>
				<Placeholder
					icon="book"
					label={__('Docs Viewer', 'wp-docs-viewer')}
					instructions={__(
						'Display documentation files from plugins, themes, and WordPress.',
						'wp-docs-viewer'
					)}
				>
					<div className="wp-docs-viewer-editor-config">
						<p className="wp-docs-viewer-editor-hint">
							{__(
								'Leave empty to show all documentation files (browser mode).',
								'wp-docs-viewer'
							)}
						</p>
						<TextControl
							label={__(
								'Specific File Path (optional)',
								'wp-docs-viewer'
							)}
							value={file || ''}
							onChange={(value) => setAttributes({ file: value })}
							placeholder={__(
								'e.g., /wp-content/plugins/my-plugin/docs/readme.md',
								'wp-docs-viewer'
							)}
							className="wp-docs-viewer-file-input"
						/>
						<Button
							variant="primary"
							onClick={() => setAttributes({ file: '' })}
							disabled={!file}
						>
							{__('Clear Path', 'wp-docs-viewer')}
						</Button>
					</div>
					<div className="wp-docs-viewer-editor-info">
						<p>
							<strong>{__('Note:', 'wp-docs-viewer')}</strong>{' '}
							{__(
								'On the frontend, this block will show the file browser if no specific file is selected.',
								'wp-docs-viewer'
							)}
						</p>
					</div>
				</Placeholder>
			</div>
		);
	}

	// Single file mode: a file is selected
	return (
		<div {...blockProps}>
			<div className="wp-docs-viewer-editor-header">
				<div className="wp-docs-viewer-mode-badge">
					<span className="dashicons dashicons-media-document"></span>
					{__('Single File Mode', 'wp-docs-viewer')}
				</div>
			</div>

			<Panel className="wp-docs-viewer-editor-panel">
				<PanelBody
					title={__('Selected File', 'wp-docs-viewer')}
					opened={isExpanded}
					onToggle={() => setIsExpanded(!isExpanded)}
				>
					<TextControl
						label={__('File Path', 'wp-docs-viewer')}
						value={file}
						onChange={(value) => setAttributes({ file: value })}
						help={__(
							'Enter the absolute path to a markdown documentation file.',
							'wp-docs-viewer'
						)}
					/>
					<div className="wp-docs-viewer-editor-actions">
						<Button
							variant="secondary"
							onClick={() => setAttributes({ file: '' })}
						>
							{__('Switch to Browser Mode', 'wp-docs-viewer')}
						</Button>
					</div>
				</PanelBody>
			</Panel>

			<div className="wp-docs-viewer-editor-footer">
				<p>
					{__(
						'Preview this block on the frontend to see the documentation file rendered.',
						'wp-docs-viewer'
					)}
				</p>
			</div>
		</div>
	);
}
