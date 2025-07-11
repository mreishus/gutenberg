/**
 * WordPress dependencies
 */
import { postCommentsCount as icon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import initBlock from '../utils/init-block';
import metadata from './block.json';
import edit from './edit';
import transforms from './transforms';

const { name } = metadata;
export { metadata, name };

export const settings = {
	icon,
	edit,
	transforms,
};

export const init = () => initBlock( { name, metadata, settings } );
