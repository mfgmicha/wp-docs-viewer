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

?>
<div <?php echo get_block_wrapper_attributes(); //phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<p>Docs Viewer – hello from a dynamic block!</p>
</div>
