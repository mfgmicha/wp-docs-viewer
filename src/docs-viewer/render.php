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

$file_path = $attributes['file'] ?? '';

?>
<div <?php echo get_block_wrapper_attributes(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
?>>
	<div class="wp-docs-viewer-content" data-file="<?php echo esc_attr($file_path); ?>">
		<?php if (empty($file_path)) : ?>
			<p class="wp-docs-viewer-placeholder">
				<?php esc_html_e('Select a documentation file in the block editor.', 'wp-docs-viewer'); ?>
			</p>
		<?php endif; ?>
	</div>
</div>
