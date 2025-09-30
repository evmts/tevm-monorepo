import { releases } from '@tevm/solc'

const latestSolcVersion = /** @type {keyof import('@tevm/solc').Releases | undefined} */ (Object.keys(releases)[0])
if (!latestSolcVersion) throw new Error('No Solc versions found')

/**
 * Default compilation options
 * @type {import('../../types.js').ValidatedCompileBaseOptions}
 */
export const defaults = {
	language: 'Solidity',
	compilationOutput: ['abi', 'ast', 'evm.bytecode', 'evm.deployedBytecode', 'storageLayout'],
	hardfork: 'cancun',
	solcVersion: latestSolcVersion,
	throwOnVersionMismatch: true,
}
