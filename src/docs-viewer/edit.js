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
import { useState, useEffect, useCallback } from '@wordpress/element';
import {
	Placeholder,
	Spinner,
	Panel,
	PanelBody,
	Button,
} from '@wordpress/components';

import './editor.scss';

/**
 * File item component.
 *
 * @param {Object}   props              Component props.
 * @param {Object}   props.file         File data.
 * @param {Function} props.onSelect     Callback when file is selected.
 * @param {string}   props.selectedFile Currently selected file path.
 * @return {Element} File item element.
 */
function FileItem({ file, onSelect, selectedFile }) {
	const isSelected = selectedFile === file.path;

	return (
		<div
			className={`wp-docs-viewer-file-item ${isSelected ? 'is-selected' : ''}`}
			onClick={() => onSelect(file.path)}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					onSelect(file.path);
				}
			}}
			role="button"
			tabIndex={0}
		>
			<span className="wp-docs-viewer-file-icon">📄</span>
			<span className="wp-docs-viewer-file-name">{file.name}</span>
			<span
				className={`wp-docs-viewer-source-badge wp-docs-viewer-source-${file.source_type}`}
			>
				{file.source_type}
			</span>
		</div>
	);
}

/**
 * Collapsible group component.
 *
 * @param {Object}   props              Component props.
 * @param {string}   props.title        Group title.
 * @param {Array}    props.files        Files in the group.
 * @param {Function} props.onSelect     Callback when file is selected.
 * @param {string}   props.selectedFile Currently selected file path.
 * @param {boolean}  props.defaultOpen  Whether the group is open by default.
 * @return {Element} Group element.
 */
function FileGroup({
	title,
	files,
	onSelect,
	selectedFile,
	defaultOpen = false,
}) {
	const [isOpen, setIsOpen] = useState(defaultOpen);

	if (!files || files.length === 0) {
		return null;
	}

	return (
		<PanelBody
			title={`${title} (${files.length})`}
			opened={isOpen}
			onToggle={() => setIsOpen(!isOpen)}
			className="wp-docs-viewer-file-group"
		>
			{files.map((f) => (
				<FileItem
					key={f.path}
					file={f}
					onSelect={onSelect}
					selectedFile={selectedFile}
				/>
			))}
		</PanelBody>
	);
}

/**
 * File browser component (browser mode).
 *
 * @param {Object}   props              Component props.
 * @param {Function} props.onFileSelect Callback when a file is selected.
 * @param {string}   props.selectedFile Currently selected file path.
 * @return {Element} File browser element.
 */
function FileBrowser({ onFileSelect, selectedFile }) {
	const [files, setFiles] = useState({
		plugins: [],
		themes: [],
		wordpress: [],
	});
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchFiles = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);

			const response = await fetch('/wp-json/wp/v2/docs-viewer/files');

			if (!response.ok) {
				throw new Error(`HTTP error: ${response.status}`);
			}

			const data = await response.json();
			setFiles(data.files || { plugins: [], themes: [], wordpress: [] });
		} catch (err) {
			setError(err.message);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchFiles();
	}, [fetchFiles]);

	if (isLoading) {
		return (
			<Placeholder
				icon="book"
				label={__('Loading documentation files…', 'wp-docs-viewer')}
			>
				<Spinner />
			</Placeholder>
		);
	}

	if (error) {
		return (
			<Placeholder
				icon="warning"
				label={__('Error loading files', 'wp-docs-viewer')}
			>
				<p>{error}</p>
				<Button isPrimary onClick={fetchFiles}>
					{__('Retry', 'wp-docs-viewer')}
				</Button>
			</Placeholder>
		);
	}

	const hasFiles =
		files.plugins.length > 0 ||
		files.themes.length > 0 ||
		files.wordpress.length > 0;

	if (!hasFiles) {
		return (
			<Placeholder
				icon="book"
				label={__('No documentation files found', 'wp-docs-viewer')}
			>
				<p>
					{__(
						'No documentation files were found on this WordPress installation.',
						'wp-docs-viewer'
					)}
				</p>
			</Placeholder>
		);
	}

	return (
		<div className="wp-docs-viewer-browser">
			<Panel className="wp-docs-viewer-sidebar">
				<FileGroup
					title={__('Plugins', 'wp-docs-viewer')}
					files={files.plugins}
					onSelect={onFileSelect}
					selectedFile={selectedFile}
					defaultOpen={true}
				/>
				<FileGroup
					title={__('Themes', 'wp-docs-viewer')}
					files={files.themes}
					onSelect={onFileSelect}
					selectedFile={selectedFile}
				/>
				<FileGroup
					title={__('WordPress', 'wp-docs-viewer')}
					files={files.wordpress}
					onSelect={onFileSelect}
					selectedFile={selectedFile}
				/>
			</Panel>
		</div>
	);
}

/**
 * File preview component.
 *
 * @param {Object} props          Component props.
 * @param {string} props.filePath File path to preview.
 * @return {Element} Preview element.
 */
function FilePreview({ filePath }) {
	const [content, setContent] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		let cancelled = false;

		async function fetchPreview() {
			if (!filePath) {
				setContent('');
				setIsLoading(false);
				return;
			}

			try {
				setIsLoading(true);
				setError(null);

				const response = await fetch(
					`/wp-json/wp/v2/docs-viewer/file?path=${encodeURIComponent(filePath)}`
				);

				if (!response.ok) {
					throw new Error(`HTTP error: ${response.status}`);
				}

				const data = await response.json();

				if (!cancelled) {
					setContent(data.content || '');
				}
			} catch (err) {
				if (!cancelled) {
					setError(err.message);
				}
			} finally {
				if (!cancelled) {
					setIsLoading(false);
				}
			}
		}

		fetchPreview();

		return () => {
			cancelled = true;
		};
	}, [filePath]);

	if (!filePath) {
		return (
			<div className="wp-docs-viewer-preview wp-docs-viewer-preview--empty">
				<p>{__('Select a file to preview', 'wp-docs-viewer')}</p>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="wp-docs-viewer-preview wp-docs-viewer-preview--loading">
				<Spinner />
			</div>
		);
	}

	if (error) {
		return (
			<div className="wp-docs-viewer-preview wp-docs-viewer-preview--error">
				<p>
					{__('Error loading preview:', 'wp-docs-viewer')} {error}
				</p>
			</div>
		);
	}

	return (
		<div
			className="wp-docs-viewer-preview"
			dangerouslySetInnerHTML={{ __html: content }}
		/>
	);
}

/**
 * Edit component.
 *
 * @param {Object}   props               Block props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Set block attributes.
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
	const { file } = attributes;
	const [selectedFile, setSelectedFile] = useState(file || '');
	const blockProps = useBlockProps();

	// If a file is selected, update the block attribute
	function handleFileSelect(filePath) {
		setSelectedFile(filePath);
		setAttributes({ file: filePath });
	}

	// Browser mode: no file selected yet
	if (!file) {
		return (
			<div {...blockProps}>
				<div className="wp-docs-viewer-help-text">
					<em>
						{__(
							'Select a documentation file from the list to preview it.',
							'wp-docs-viewer'
						)}
					</em>
				</div>
				<FileBrowser
					onFileSelect={handleFileSelect}
					selectedFile={selectedFile}
				/>
			</div>
		);
	}

	// Single file mode: file is selected, show browser mode with preview
	return (
		<div {...blockProps}>
			<div className="wp-docs-viewer-toolbar">
				<div className="wp-docs-viewer-mode-indicator">
					<span className="wp-docs-viewer-mode-label">
						{__('Selected:', 'wp-docs-viewer')}
					</span>
					<code className="wp-docs-viewer-selected-path">{file}</code>
				</div>
				<Button
					variant="secondary"
					onClick={() => {
						setAttributes({ file: '' });
						setSelectedFile('');
					}}
				>
					{__('Browse all docs', 'wp-docs-viewer')}
				</Button>
			</div>
			<div className="wp-docs-viewer-single-mode">
				<div className="wp-docs-viewer-single-sidebar">
					<FileBrowser
						onFileSelect={handleFileSelect}
						selectedFile={file}
					/>
				</div>
				<div className="wp-docs-viewer-single-preview">
					<FilePreview filePath={file} />
				</div>
			</div>
		</div>
	);
}
