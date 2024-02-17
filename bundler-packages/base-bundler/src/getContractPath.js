import { createRequire } from 'module'

/**
 * @type {readonly ['tevm/contract', '@tevm/contract']}
 */
const contractPackages = ['tevm/contract', '@tevm/contract']
/**
 * @param {string} basePath
 * @returns {'tevm/contract' | '@tevm/contract'}
 */
export const getContractPath = (basePath) => {
	const require = createRequire(basePath)
	for (const contractPackage of contractPackages) {
		try {
			require.resolve(contractPackage)
			return contractPackage
		} catch (e) {}
	}
	throw new Error(
		'Could not find tevm/contract or @tevm/contract!. Please install it with `npm i @tevm/contract` `pnpm i @tevm/contract` or `yarn add tevm/contract`',
	)
}
