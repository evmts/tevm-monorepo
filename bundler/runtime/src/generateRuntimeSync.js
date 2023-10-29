import { generateEvmtsBody } from './generateEvmtsBody.js'

/**
 * @param {import("@evmts/solc").Artifacts} artifacts
 * @param {'cjs' | 'mjs' | 'ts' | 'dts'} moduleType
 * @param {import("@evmts/solc").Logger} logger
 * @returns {string}
 */
export const generateRuntimeSync = (artifacts, moduleType, logger) => {
	if (!artifacts || Object.keys(artifacts).length === 0) {
		logger.warn('No artifacts found, skipping runtime generation')
		return ''
	}
	/**
	 * @type {string}
	 */
	let evmtsImports
	if (moduleType === 'cjs') {
		evmtsImports = `const { evmtsContractFactory } = require('@evmts/core')`
	} else if (moduleType === 'dts') {
		evmtsImports = `import { EvmtsContract } from '@evmts/core'`
	} else if (moduleType === 'ts' || moduleType === 'mjs') {
		evmtsImports = `import { evmtsContractFactory } from '@evmts/core'`
	} else {
		throw new Error(`Unknown module type: ${moduleType}`)
	}
	const evmtsBody = generateEvmtsBody(artifacts, moduleType)
	return [evmtsImports, evmtsBody].join('\n')
}
