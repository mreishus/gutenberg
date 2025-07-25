// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react-hooks/exhaustive-deps */

/**
 * External dependencies
 */
import { h as createElement, type VNode, type RefObject } from 'preact';
import { useContext, useMemo, useRef } from 'preact/hooks';

/**
 * Internal dependencies
 */
import {
	useWatch,
	useInit,
	kebabToCamelCase,
	warn,
	splitTask,
	isPlainObject,
} from './utils';
import {
	directive,
	getEvaluate,
	isDefaultDirectiveSuffix,
	isNonDefaultDirectiveSuffix,
	type DirectiveCallback,
	type DirectiveEntry,
} from './hooks';
import { getScope } from './scopes';
import { proxifyState, proxifyContext, deepMerge } from './proxies';

/**
 * Recursively clones the passed object.
 *
 * @param source Source object.
 * @return Cloned object.
 */
function deepClone< T >( source: T ): T {
	if ( isPlainObject( source ) ) {
		return Object.fromEntries(
			Object.entries( source as object ).map( ( [ key, value ] ) => [
				key,
				deepClone( value ),
			] )
		) as T;
	}
	if ( Array.isArray( source ) ) {
		return source.map( ( i ) => deepClone( i ) ) as T;
	}
	return source;
}

/**
 * Wraps event object to warn about access of synchronous properties and methods.
 *
 * For all store actions attached to an event listener the event object is proxied via this function, unless the action
 * uses the `withSyncEvent()` utility to indicate that it requires synchronous access to the event object.
 *
 * At the moment, the proxied event only emits warnings when synchronous properties or methods are being accessed. In
 * the future this will be changed and result in an error. The current temporary behavior allows implementers to update
 * their relevant actions to use `withSyncEvent()`.
 *
 * For additional context, see https://github.com/WordPress/gutenberg/issues/64944.
 *
 * @param event Event object.
 * @return Proxied event object.
 */
function wrapEventAsync( event: Event ) {
	const handler = {
		get( target: Event, prop: string | symbol, receiver: any ) {
			const value = target[ prop ];
			switch ( prop ) {
				case 'currentTarget':
					warn(
						`Accessing the synchronous event.${ prop } property in a store action without wrapping it in withSyncEvent() is deprecated and will stop working in WordPress 6.9. Please wrap the store action in withSyncEvent().`
					);
					break;
				case 'preventDefault':
				case 'stopImmediatePropagation':
				case 'stopPropagation':
					warn(
						`Using the synchronous event.${ prop }() function in a store action without wrapping it in withSyncEvent() is deprecated and will stop working in WordPress 6.9. Please wrap the store action in withSyncEvent().`
					);
					break;
			}
			if ( value instanceof Function ) {
				return function ( this: any, ...args: any[] ) {
					return value.apply(
						this === receiver ? target : this,
						args
					);
				};
			}
			return value;
		},
	};

	return new Proxy( event, handler );
}

const newRule =
	/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g;
const ruleClean = /\/\*[^]*?\*\/|  +/g;
const ruleNewline = /\n+/g;
const empty = ' ';

/**
 * Converts a css style string into a object.
 *
 * Made by Cristian Bote (@cristianbote) for Goober.
 * https://unpkg.com/browse/goober@2.1.13/src/core/astish.js
 *
 * @param val CSS string.
 * @return CSS object.
 */
const cssStringToObject = (
	val: string
): Record< string, string | number > => {
	const tree = [ {} ];
	let block, left;

	while ( ( block = newRule.exec( val.replace( ruleClean, '' ) ) ) ) {
		if ( block[ 4 ] ) {
			tree.shift();
		} else if ( block[ 3 ] ) {
			left = block[ 3 ].replace( ruleNewline, empty ).trim();
			tree.unshift( ( tree[ 0 ][ left ] = tree[ 0 ][ left ] || {} ) );
		} else {
			tree[ 0 ][ block[ 1 ] ] = block[ 2 ]
				.replace( ruleNewline, empty )
				.trim();
		}
	}

	return tree[ 0 ];
};

/**
 * Creates a directive that adds an event listener to the global window or
 * document object.
 *
 * @param type 'window' or 'document'
 */
const getGlobalEventDirective = (
	type: 'window' | 'document'
): DirectiveCallback => {
	return ( { directives, evaluate } ) => {
		directives[ `on-${ type }` ]
			.filter( isNonDefaultDirectiveSuffix )
			.forEach( ( entry ) => {
				const eventName = entry.suffix.split( '--', 1 )[ 0 ];
				useInit( () => {
					const cb = ( event: Event ) => {
						const result = evaluate( entry );
						if ( typeof result === 'function' ) {
							if ( ! result?.sync ) {
								event = wrapEventAsync( event );
							}
							result( event );
						}
					};
					const globalVar = type === 'window' ? window : document;
					globalVar.addEventListener( eventName, cb );
					return () => globalVar.removeEventListener( eventName, cb );
				} );
			} );
	};
};

/**
 * Creates a directive that adds an async event listener to the global window or
 * document object.
 *
 * @param type 'window' or 'document'
 */
const getGlobalAsyncEventDirective = (
	type: 'window' | 'document'
): DirectiveCallback => {
	return ( { directives, evaluate } ) => {
		directives[ `on-async-${ type }` ]
			.filter( isNonDefaultDirectiveSuffix )
			.forEach( ( entry ) => {
				const eventName = entry.suffix.split( '--', 1 )[ 0 ];
				useInit( () => {
					const cb = async ( event: Event ) => {
						await splitTask();
						const result = evaluate( entry );
						if ( typeof result === 'function' ) {
							result( event );
						}
					};
					const globalVar = type === 'window' ? window : document;
					globalVar.addEventListener( eventName, cb, {
						passive: true,
					} );
					return () => globalVar.removeEventListener( eventName, cb );
				} );
			} );
	};
};

export default () => {
	// data-wp-context
	directive(
		'context',
		( {
			directives: { context },
			props: { children },
			context: inheritedContext,
		} ) => {
			const { Provider } = inheritedContext;
			const defaultEntry = context.find( isDefaultDirectiveSuffix );
			const { client: inheritedClient, server: inheritedServer } =
				useContext( inheritedContext );

			const ns = defaultEntry!.namespace;
			const client = useRef( proxifyState( ns, {} ) );
			const server = useRef( proxifyState( ns, {}, { readOnly: true } ) );

			// No change should be made if `defaultEntry` does not exist.
			const contextStack = useMemo( () => {
				const result = {
					client: { ...inheritedClient },
					server: { ...inheritedServer },
				};
				if ( defaultEntry ) {
					const { namespace, value } = defaultEntry;
					// Check that the value is a JSON object. Send a console warning if not.
					if ( ! isPlainObject( value ) ) {
						warn(
							`The value of data-wp-context in "${ namespace }" store must be a valid stringified JSON object.`
						);
					}
					deepMerge(
						client.current,
						deepClone( value ) as object,
						false
					);
					deepMerge( server.current, deepClone( value ) as object );
					result.client[ namespace ] = proxifyContext(
						client.current,
						inheritedClient[ namespace ]
					);
					result.server[ namespace ] = proxifyContext(
						server.current,
						inheritedServer[ namespace ]
					);
				}
				return result;
			}, [ defaultEntry, inheritedClient, inheritedServer ] );

			return createElement( Provider, { value: contextStack }, children );
		},
		{ priority: 5 }
	);

	// data-wp-watch--[name]
	directive( 'watch', ( { directives: { watch }, evaluate } ) => {
		watch.forEach( ( entry ) => {
			useWatch( () => {
				let start;
				if ( globalThis.IS_GUTENBERG_PLUGIN ) {
					if ( globalThis.SCRIPT_DEBUG ) {
						// eslint-disable-next-line no-unused-vars
						start = performance.now();
					}
				}
				let result = evaluate( entry );
				if ( typeof result === 'function' ) {
					result = result();
				}
				if ( globalThis.IS_GUTENBERG_PLUGIN ) {
					if ( globalThis.SCRIPT_DEBUG ) {
						performance.measure(
							`interactivity api watch ${ entry.namespace }`,
							{
								start,
								end: performance.now(),
								detail: {
									devtools: {
										track: `IA: watch ${ entry.namespace }`,
									},
								},
							}
						);
					}
				}
				return result;
			} );
		} );
	} );

	// data-wp-init--[name]
	directive( 'init', ( { directives: { init }, evaluate } ) => {
		init.forEach( ( entry ) => {
			// TODO: Replace with useEffect to prevent unneeded scopes.
			useInit( () => {
				let start;
				if ( globalThis.IS_GUTENBERG_PLUGIN ) {
					if ( globalThis.SCRIPT_DEBUG ) {
						start = performance.now();
					}
				}
				let result = evaluate( entry );
				if ( typeof result === 'function' ) {
					result = result();
				}
				if ( globalThis.IS_GUTENBERG_PLUGIN ) {
					if ( globalThis.SCRIPT_DEBUG ) {
						performance.measure(
							`interactivity api init ${ entry.namespace }`,
							{
								// eslint-disable-next-line no-undef
								start,
								end: performance.now(),
								detail: {
									devtools: {
										track: `IA: init ${ entry.namespace }`,
									},
								},
							}
						);
					}
				}
				return result;
			} );
		} );
	} );

	// data-wp-on--[event]
	directive( 'on', ( { directives: { on }, element, evaluate } ) => {
		const events = new Map< string, Set< DirectiveEntry > >();
		on.filter( isNonDefaultDirectiveSuffix ).forEach( ( entry ) => {
			const event = entry.suffix.split( '--' )[ 0 ];
			if ( ! events.has( event ) ) {
				events.set( event, new Set< DirectiveEntry >() );
			}
			events.get( event )!.add( entry );
		} );

		events.forEach( ( entries, eventType ) => {
			const existingHandler = element.props[ `on${ eventType }` ];
			element.props[ `on${ eventType }` ] = ( event: Event ) => {
				entries.forEach( ( entry ) => {
					if ( existingHandler ) {
						existingHandler( event );
					}
					let start;
					if ( globalThis.IS_GUTENBERG_PLUGIN ) {
						if ( globalThis.SCRIPT_DEBUG ) {
							start = performance.now();
						}
					}
					const result = evaluate( entry );
					if ( typeof result === 'function' ) {
						if ( ! result?.sync ) {
							event = wrapEventAsync( event );
						}
						result( event );
					}
					if ( globalThis.IS_GUTENBERG_PLUGIN ) {
						if ( globalThis.SCRIPT_DEBUG ) {
							performance.measure(
								`interactivity api on ${ entry.namespace }`,
								{
									// eslint-disable-next-line no-undef
									start,
									end: performance.now(),
									detail: {
										devtools: {
											track: `IA: on ${ entry.namespace }`,
										},
									},
								}
							);
						}
					}
				} );
			};
		} );
	} );

	// data-wp-on-async--[event]
	directive(
		'on-async',
		( { directives: { 'on-async': onAsync }, element, evaluate } ) => {
			const events = new Map< string, Set< DirectiveEntry > >();
			onAsync
				.filter( isNonDefaultDirectiveSuffix )
				.forEach( ( entry ) => {
					const event = entry.suffix.split( '--' )[ 0 ];
					if ( ! events.has( event ) ) {
						events.set( event, new Set< DirectiveEntry >() );
					}
					events.get( event )!.add( entry );
				} );

			events.forEach( ( entries, eventType ) => {
				const existingHandler = element.props[ `on${ eventType }` ];
				element.props[ `on${ eventType }` ] = ( event: Event ) => {
					if ( existingHandler ) {
						existingHandler( event );
					}
					entries.forEach( async ( entry ) => {
						await splitTask();
						const result = evaluate( entry );
						if ( typeof result === 'function' ) {
							result( event );
						}
					} );
				};
			} );
		}
	);

	// data-wp-on-window--[event]
	directive( 'on-window', getGlobalEventDirective( 'window' ) );
	// data-wp-on-document--[event]
	directive( 'on-document', getGlobalEventDirective( 'document' ) );

	// data-wp-on-async-window--[event]
	directive( 'on-async-window', getGlobalAsyncEventDirective( 'window' ) );
	// data-wp-on-async-document--[event]
	directive(
		'on-async-document',
		getGlobalAsyncEventDirective( 'document' )
	);

	// data-wp-class--[classname]
	directive(
		'class',
		( { directives: { class: classNames }, element, evaluate } ) => {
			classNames
				.filter( isNonDefaultDirectiveSuffix )
				.forEach( ( entry ) => {
					const className = entry.suffix;
					let result = evaluate( entry );
					if ( typeof result === 'function' ) {
						result = result();
					}
					const currentClass = element.props.class || '';
					const classFinder = new RegExp(
						`(^|\\s)${ className }(\\s|$)`,
						'g'
					);
					if ( ! result ) {
						element.props.class = currentClass
							.replace( classFinder, ' ' )
							.trim();
					} else if ( ! classFinder.test( currentClass ) ) {
						element.props.class = currentClass
							? `${ currentClass } ${ className }`
							: className;
					}

					useInit( () => {
						/*
						 * This seems necessary because Preact doesn't change the class
						 * names on the hydration, so we have to do it manually. It doesn't
						 * need deps because it only needs to do it the first time.
						 */
						if ( ! result ) {
							(
								element.ref as RefObject< HTMLElement >
							 ).current!.classList.remove( className );
						} else {
							(
								element.ref as RefObject< HTMLElement >
							 ).current!.classList.add( className );
						}
					} );
				} );
		}
	);

	// data-wp-style--[style-prop]
	directive( 'style', ( { directives: { style }, element, evaluate } ) => {
		style.filter( isNonDefaultDirectiveSuffix ).forEach( ( entry ) => {
			const styleProp = entry.suffix;
			let result = evaluate( entry );
			if ( typeof result === 'function' ) {
				result = result();
			}
			element.props.style = element.props.style || {};
			if ( typeof element.props.style === 'string' ) {
				element.props.style = cssStringToObject( element.props.style );
			}
			if ( ! result ) {
				delete element.props.style[ styleProp ];
			} else {
				element.props.style[ styleProp ] = result;
			}

			useInit( () => {
				/*
				 * This seems necessary because Preact doesn't change the styles on
				 * the hydration, so we have to do it manually. It doesn't need deps
				 * because it only needs to do it the first time.
				 */
				if ( ! result ) {
					(
						element.ref as RefObject< HTMLElement >
					 ).current!.style.removeProperty( styleProp );
				} else {
					( element.ref as RefObject< HTMLElement > ).current!.style[
						styleProp
					] = result;
				}
			} );
		} );
	} );

	// data-wp-bind--[attribute]
	directive( 'bind', ( { directives: { bind }, element, evaluate } ) => {
		bind.filter( isNonDefaultDirectiveSuffix ).forEach( ( entry ) => {
			const attribute = entry.suffix;
			let result = evaluate( entry );
			if ( typeof result === 'function' ) {
				result = result();
			}
			element.props[ attribute ] = result;

			/*
			 * This is necessary because Preact doesn't change the attributes on the
			 * hydration, so we have to do it manually. It only needs to do it the
			 * first time. After that, Preact will handle the changes.
			 */
			useInit( () => {
				const el = ( element.ref as RefObject< HTMLElement > ).current!;

				/*
				 * We set the value directly to the corresponding HTMLElement instance
				 * property excluding the following special cases. We follow Preact's
				 * logic: https://github.com/preactjs/preact/blob/ea49f7a0f9d1ff2c98c0bdd66aa0cbc583055246/src/diff/props.js#L110-L129
				 */
				if ( attribute === 'style' ) {
					if ( typeof result === 'string' ) {
						el.style.cssText = result;
					}
					return;
				} else if (
					attribute !== 'width' &&
					attribute !== 'height' &&
					attribute !== 'href' &&
					attribute !== 'list' &&
					attribute !== 'form' &&
					/*
					 * The value for `tabindex` follows the parsing rules for an
					 * integer. If that fails, or if the attribute isn't present, then
					 * the browsers should "follow platform conventions to determine if
					 * the element should be considered as a focusable area",
					 * practically meaning that most elements get a default of `-1` (not
					 * focusable), but several also get a default of `0` (focusable in
					 * order after all elements with a positive `tabindex` value).
					 *
					 * @see https://html.spec.whatwg.org/#tabindex-value
					 */
					attribute !== 'tabIndex' &&
					attribute !== 'download' &&
					attribute !== 'rowSpan' &&
					attribute !== 'colSpan' &&
					attribute !== 'role' &&
					attribute in el
				) {
					try {
						el[ attribute ] =
							result === null || result === undefined
								? ''
								: result;
						return;
					} catch ( err ) {}
				}
				/*
				 * aria- and data- attributes have no boolean representation.
				 * A `false` value is different from the attribute not being
				 * present, so we can't remove it.
				 * We follow Preact's logic: https://github.com/preactjs/preact/blob/ea49f7a0f9d1ff2c98c0bdd66aa0cbc583055246/src/diff/props.js#L131C24-L136
				 */
				if (
					result !== null &&
					result !== undefined &&
					( result !== false || attribute[ 4 ] === '-' )
				) {
					el.setAttribute( attribute, result );
				} else {
					el.removeAttribute( attribute );
				}
			} );
		} );
	} );

	// data-wp-ignore
	directive(
		'ignore',
		( {
			element: {
				type: Type,
				props: { innerHTML, ...rest },
			},
		}: {
			element: any;
		} ) => {
			// Preserve the initial inner HTML.
			const cached = useMemo( () => innerHTML, [] );
			return createElement( Type, {
				dangerouslySetInnerHTML: { __html: cached },
				...rest,
			} );
		}
	);

	// data-wp-text
	directive( 'text', ( { directives: { text }, element, evaluate } ) => {
		const entry = text.find( isDefaultDirectiveSuffix );
		if ( ! entry ) {
			element.props.children = null;
			return;
		}

		try {
			let result = evaluate( entry );
			if ( typeof result === 'function' ) {
				result = result();
			}
			element.props.children =
				typeof result === 'object' ? null : result.toString();
		} catch ( e ) {
			element.props.children = null;
		}
	} );

	// data-wp-run
	directive( 'run', ( { directives: { run }, evaluate } ) => {
		run.forEach( ( entry ) => {
			let result = evaluate( entry );
			if ( typeof result === 'function' ) {
				result = result();
			}
			return result;
		} );
	} );

	// data-wp-each--[item]
	directive(
		'each',
		( {
			directives: { each, 'each-key': eachKey },
			context: inheritedContext,
			element,
			evaluate,
		} ) => {
			if ( element.type !== 'template' ) {
				return;
			}

			const { Provider } = inheritedContext;
			const inheritedValue = useContext( inheritedContext );

			const [ entry ] = each;
			const { namespace } = entry;

			let iterable = evaluate( entry );
			if ( typeof iterable === 'function' ) {
				iterable = iterable();
			}

			if ( typeof iterable?.[ Symbol.iterator ] !== 'function' ) {
				return;
			}

			const itemProp = isNonDefaultDirectiveSuffix( entry )
				? kebabToCamelCase( entry.suffix )
				: 'item';

			const result: VNode< any >[] = [];

			for ( const item of iterable ) {
				const itemContext = proxifyContext(
					proxifyState( namespace, {} ),
					inheritedValue.client[ namespace ]
				);
				const mergedContext = {
					client: {
						...inheritedValue.client,
						[ namespace ]: itemContext,
					},
					server: { ...inheritedValue.server },
				};

				// Set the item after proxifying the context.
				mergedContext.client[ namespace ][ itemProp ] = item;

				const scope = {
					...getScope(),
					context: mergedContext.client,
					serverContext: mergedContext.server,
				};
				const key = eachKey
					? getEvaluate( { scope } )( eachKey[ 0 ] )
					: item;

				result.push(
					createElement(
						Provider,
						{ value: mergedContext, key },
						element.props.content
					)
				);
			}
			return result;
		},
		{ priority: 20 }
	);

	directive( 'each-child', () => null, { priority: 1 } );
};
