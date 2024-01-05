/**
 * @type {import('tsup').Options['target']}
 */
const nodeTargets = ['node16']
/**
 * @type {import('tsup').Options['target']}
 */
const browserTargets = [
	'chrome91',
	'firefox90',
	'edge91',
	'safari15',
	'ios15',
	'opera77',
]

/**
 * @typedef {'js' | 'node' | 'browser'} Target
 */

/**
 * @type {Record<Target, Exclude<import('tsup').Options['target'], undefined>>}
 */
export const targets = {
	// target both node and browser applications
	js: browserTargets,
	// target node applications
	node: nodeTargets,
	// target browsers
	browser: browserTargets,
}
