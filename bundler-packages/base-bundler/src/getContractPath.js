import { createRequire } from 'node:module'

/**
 * @type {readonly ['tevm/contract', '@tevm/contract']}
 */
const contractPackages = ['tevm/contract', '@tevm/contract']
/**
 * @param {string} basePath
 * @returns {'tevm/contract' | '@tevm/contract'}
 */
export const getContractPath = (basePath) => {
	const require = createRequire(basePath.endsWith('/') ? basePath : `${basePath}/`)
	for (const contractPackage of contractPackages) {
		try {
			require.resolve(contractPackage)
			return contractPackage
		} catch (e) {}
	}
	// @ts-expect-error checking for global existence of bun
	const isBun = typeof Bun !== 'undefined'
	if (isBun) {
		return 'tevm/contract'
	}
	throw new Error(
		`Could not find tevm/contract or @tevm/contract in ${basePath}!. Please install it with \`npm i @tevm/contract\` \`pnpm i @tevm/contract\` or \`yarn add tevm/contract\``,
	)
}
