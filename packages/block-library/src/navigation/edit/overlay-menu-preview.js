/**
 * WordPress dependencies
 */
import {
	ToggleControl,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import OverlayMenuIcon from './overlay-menu-icon';

export default function OverlayMenuPreview( { setAttributes, hasIcon, icon } ) {
	return (
		<>
			<ToolsPanelItem
				label={ __( 'Show icon button' ) }
				isShownByDefault
				hasValue={ () => ! hasIcon }
				onDeselect={ () => setAttributes( { hasIcon: true } ) }
			>
				<ToggleControl
					__nextHasNoMarginBottom
					label={ __( 'Show icon button' ) }
					help={ __(
						'Configure the visual appearance of the button that toggles the overlay menu.'
					) }
					onChange={ ( value ) =>
						setAttributes( { hasIcon: value } )
					}
					checked={ hasIcon }
				/>
			</ToolsPanelItem>

			<ToolsPanelItem
				label={ __( 'Icon' ) }
				isShownByDefault
				hasValue={ () => icon !== 'handle' }
				onDeselect={ () => setAttributes( { icon: 'handle' } ) }
			>
				<ToggleGroupControl
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					className="wp-block-navigation__overlay-menu-icon-toggle-group"
					label={ __( 'Icon' ) }
					value={ icon }
					onChange={ ( value ) => setAttributes( { icon: value } ) }
					isBlock
				>
					<ToggleGroupControlOption
						value="handle"
						aria-label={ __( 'handle' ) }
						label={ <OverlayMenuIcon icon="handle" /> }
					/>
					<ToggleGroupControlOption
						value="menu"
						aria-label={ __( 'menu' ) }
						label={ <OverlayMenuIcon icon="menu" /> }
					/>
				</ToggleGroupControl>
			</ToolsPanelItem>
		</>
	);
}
