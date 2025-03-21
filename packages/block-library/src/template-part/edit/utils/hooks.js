/**
 * External dependencies
 */
import { paramCase as kebabCase } from 'change-case';

/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { useMemo } from '@wordpress/element';
import { serialize } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { createTemplatePartId } from './create-template-part-id';

/**
 * Retrieves the available template parts for the given area.
 *
 * @param {string} area       Template part area.
 * @param {string} excludedId Template part ID to exclude.
 *
 * @return {{ templateParts: Array, isResolving: boolean }} array of template parts.
 */
export function useAlternativeTemplateParts( area, excludedId ) {
	const { templateParts, isResolving } = useSelect( ( select ) => {
		const { getEntityRecords, isResolving: _isResolving } =
			select( coreStore );
		const query = { per_page: -1 };
		return {
			templateParts: getEntityRecords(
				'postType',
				'wp_template_part',
				query
			),
			isResolving: _isResolving( 'getEntityRecords', [
				'postType',
				'wp_template_part',
				query,
			] ),
		};
	}, [] );

	const filteredTemplateParts = useMemo( () => {
		if ( ! templateParts ) {
			return [];
		}
		return (
			templateParts.filter(
				( templatePart ) =>
					createTemplatePartId(
						templatePart.theme,
						templatePart.slug
					) !== excludedId &&
					( ! area ||
						'uncategorized' === area ||
						templatePart.area === area )
			) || []
		);
	}, [ templateParts, area, excludedId ] );

	return {
		templateParts: filteredTemplateParts,
		isResolving,
	};
}

/**
 * Retrieves the available block patterns for the given area.
 *
 * @param {string} area     Template part area.
 * @param {string} clientId Block Client ID. (The container of the block can impact allowed blocks).
 *
 * @return {Array} array of block patterns.
 */
export function useAlternativeBlockPatterns( area, clientId ) {
	return useSelect(
		( select ) => {
			const blockNameWithArea = area
				? `core/template-part/${ area }`
				: 'core/template-part';
			const { getBlockRootClientId, getPatternsByBlockTypes } =
				select( blockEditorStore );
			const rootClientId = getBlockRootClientId( clientId );
			return getPatternsByBlockTypes( blockNameWithArea, rootClientId );
		},
		[ area, clientId ]
	);
}

export function useCreateTemplatePartFromBlocks( area, setAttributes ) {
	const { saveEntityRecord } = useDispatch( coreStore );

	return async ( blocks = [], title = __( 'Untitled Template Part' ) ) => {
		// Currently template parts only allow latin chars.
		// Fallback slug will receive suffix by default.
		const cleanSlug =
			kebabCase( title ).replace( /[^\w-]+/g, '' ) || 'wp-custom-part';

		// If we have `area` set from block attributes, means an exposed
		// block variation was inserted. So add this prop to the template
		// part entity on creation. Afterwards remove `area` value from
		// block attributes.
		const record = {
			title,
			slug: cleanSlug,
			content: serialize( blocks ),
			// `area` is filterable on the server and defaults to `UNCATEGORIZED`
			// if provided value is not allowed.
			area,
		};
		const templatePart = await saveEntityRecord(
			'postType',
			'wp_template_part',
			record
		);
		setAttributes( {
			slug: templatePart.slug,
			theme: templatePart.theme,
			area: undefined,
		} );
	};
}

/**
 * Retrieves the template part area object.
 *
 * @param {string} area Template part area identifier.
 *
 * @return {{icon: Object, label: string, tagName: string}} Template Part area.
 */
export function useTemplatePartArea( area ) {
	return useSelect(
		( select ) => {
			const definedAreas =
				select( coreStore ).getCurrentTheme()
					?.default_template_part_areas || [];

			const selectedArea = definedAreas.find(
				( definedArea ) => definedArea.area === area
			);
			const defaultArea = definedAreas.find(
				( definedArea ) => definedArea.area === 'uncategorized'
			);

			return {
				icon: selectedArea?.icon || defaultArea?.icon,
				label: selectedArea?.label || __( 'Template Part' ),
				tagName: selectedArea?.area_tag ?? 'div',
			};
		},
		[ area ]
	);
}
