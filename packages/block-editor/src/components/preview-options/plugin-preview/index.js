/**
 * WordPress dependencies
 */
import { ComplementaryArea } from '@wordpress/interface';
//import { useSelect } from '@wordpress/data';
//import { __ } from '@wordpress/i18n';

/*
export default function PluginSidebarEditPost( { className, ...props } ) {
	const { postTitle, shortcut, showIconLabels } = useSelect( ( select ) => {
		return {
			postTitle: select( 'core/editor' ).getEditedPostAttribute(
				'title'
			),
			shortcut: select(
				'core/keyboard-shortcuts'
			).getShortcutRepresentation( 'core/edit-post/toggle-sidebar' ),
			showIconLabels: select( 'core/edit-post' ).isFeatureActive(
				'showIconLabels'
			),
		};
	} );
	return (
		<ComplementaryArea
			panelClassName={ className }
			className="edit-post-sidebar"
			smallScreenTitle={ postTitle || __( '(no title)' ) }
			scope="core/edit-post"
			toggleShortcut={ shortcut }
			showIconLabels={ showIconLabels }
			{ ...props }
		/>
	);
}
*/

export default function PluginPreview( props ) {
	return <ComplementaryArea scope="core/block-editor" { ...props } />;
}
