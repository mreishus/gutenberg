/**
 * WordPress dependencies
 */
import { ComplementaryAreaMoreMenuItem } from '@wordpress/interface';

export default function PluginPreviewMoreMenuItem( props ) {
	return (
		<ComplementaryAreaMoreMenuItem scope="core/block-editor" { ...props } />
	);
}
