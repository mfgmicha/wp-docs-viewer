<?php
/**
 * PHP file to use when rendering the block type on the server to show on the front end.
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content.
 *     $block (WP_Block): The block instance.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 *
 * @package mfgmicha/docs-viewer
 */

namespace WpDocsViewer;

if ( ! \defined( 'ABSPATH' ) ) {
	exit();
}

$file_path = ( $attributes['file'] ?? '' );
$file_name = ( $file_path !== '' ) ? \basename( $file_path ) : '';

// Get files for browser mode.
$finder = new Docs_Finder();
$files  = $finder->get_files();

?>
<div <?php echo \get_block_wrapper_attributes(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="wp-docs-viewer-content" data-file="<?php echo \esc_attr( $file_path ); ?>">
		<?php if ( empty( $file_path ) ) : ?>
			<?php
			// Browser mode: render the file browser UI.
			?>
			<div class="wp-docs-viewer-browser">
				<div class="wp-docs-viewer-sidebar">
					<?php if ( ! empty( $files['plugins'] ) ) : ?>
						<div class="wp-docs-viewer-file-group" data-source="plugins">
							<button class="wp-docs-viewer-group-toggle" aria-expanded="true" type="button">
								<span class="wp-docs-viewer-group-title"><?php \esc_html_e( 'Plugins', 'wp-docs-viewer' ); ?></span>
								<span class="wp-docs-viewer-group-count">(<?php echo \count( $files['plugins'] ); ?>)</span>
								<span class="wp-docs-viewer-group-arrow">▼</span>
							</button>
							<ul class="wp-docs-viewer-file-list">
								<?php foreach ( $files['plugins'] as $file ) : ?>
									<li class="wp-docs-viewer-file-item" data-path="<?php echo \esc_attr( $file['path'] ); ?>">
										<span class="wp-docs-viewer-file-icon">📄</span>
										<span class="wp-docs-viewer-file-name"><?php echo \esc_html( $file['name'] ); ?></span>
										<span class="wp-docs-viewer-source-badge wp-docs-viewer-source-plugin"><?php \esc_html_e( 'plugin', 'wp-docs-viewer' ); ?></span>
									</li>
								<?php endforeach; ?>
							</ul>
						</div>
					<?php endif; ?>

					<?php if ( ! empty( $files['themes'] ) ) : ?>
						<div class="wp-docs-viewer-file-group" data-source="themes">
							<button class="wp-docs-viewer-group-toggle" aria-expanded="false" type="button">
								<span class="wp-docs-viewer-group-title"><?php \esc_html_e( 'Themes', 'wp-docs-viewer' ); ?></span>
								<span class="wp-docs-viewer-group-count">(<?php echo \count( $files['themes'] ); ?>)</span>
								<span class="wp-docs-viewer-group-arrow">▶</span>
							</button>
							<ul class="wp-docs-viewer-file-list" hidden>
								<?php foreach ( $files['themes'] as $file ) : ?>
									<li class="wp-docs-viewer-file-item" data-path="<?php echo \esc_attr( $file['path'] ); ?>">
										<span class="wp-docs-viewer-file-icon">📄</span>
										<span class="wp-docs-viewer-file-name"><?php echo \esc_html( $file['name'] ); ?></span>
										<span class="wp-docs-viewer-source-badge wp-docs-viewer-source-theme"><?php \esc_html_e( 'theme', 'wp-docs-viewer' ); ?></span>
									</li>
								<?php endforeach; ?>
							</ul>
						</div>
					<?php endif; ?>

					<?php if ( ! empty( $files['wordpress'] ) ) : ?>
						<div class="wp-docs-viewer-file-group" data-source="wordpress">
							<button class="wp-docs-viewer-group-toggle" aria-expanded="false" type="button">
								<span class="wp-docs-viewer-group-title"><?php \esc_html_e( 'WordPress', 'wp-docs-viewer' ); ?></span>
								<span class="wp-docs-viewer-group-count">(<?php echo \count( $files['wordpress'] ); ?>)</span>
								<span class="wp-docs-viewer-group-arrow">▶</span>
							</button>
							<ul class="wp-docs-viewer-file-list" hidden>
								<?php foreach ( $files['wordpress'] as $file ) : ?>
									<li class="wp-docs-viewer-file-item" data-path="<?php echo \esc_attr( $file['path'] ); ?>">
										<span class="wp-docs-viewer-file-icon">📄</span>
										<span class="wp-docs-viewer-file-name"><?php echo \esc_html( $file['name'] ); ?></span>
										<span class="wp-docs-viewer-source-badge wp-docs-viewer-source-wordpress"><?php \esc_html_e( 'wp', 'wp-docs-viewer' ); ?></span>
									</li>
								<?php endforeach; ?>
							</ul>
						</div>
					<?php endif; ?>
				</div>

				<div class="wp-docs-viewer-preview-area">
					<div class="wp-docs-viewer-preview wp-docs-viewer-preview--empty">
						<p><?php \esc_html_e( 'Select a file to preview its content.', 'wp-docs-viewer' ); ?></p>
					</div>
				</div>
			</div>
		<?php else : ?>
			<?php
			// Single file mode: fetch and render the file content.
			$parser      = new Markdown_Parser();
			$content     = '';
			$file_exists = false;

			// Try to parse the file directly.
			if ( \file_exists( $file_path ) ) {
				$content     = $parser->parse_from_path( $file_path );
				$file_exists = true;
			}
			?>
			<div class="wp-docs-viewer-single-file">
				<div class="wp-docs-viewer-file-header">
					<span class="wp-docs-viewer-file-icon">📄</span>
					<span class="wp-docs-viewer-file-name"><?php echo \esc_html( $file_name ); ?></span>
				</div>
				<?php if ( $file_exists && $content ) : ?>
					<div class="wp-docs-viewer-preview">
						<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
					</div>
				<?php else : ?>
					<div class="wp-docs-viewer-preview wp-docs-viewer-preview--error">
						<p><?php \esc_html_e( 'Error loading file content.', 'wp-docs-viewer' ); ?></p>
					</div>
				<?php endif; ?>
			</div>
		<?php endif; ?>
	</div>
</div>
