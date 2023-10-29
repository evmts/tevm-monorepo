import { generateEvmtsBody } from './generateEvmtsBody.js'

/**
 * Generates the runtime code for the given artifacts.
 * @param {import("@evmts/solc").Artifacts} artifacts
 * @param {'cjs' | 'mjs' | 'ts'} moduleType
 * @param {import("@evmts/solc").Logger} logger
 * @returns {Promise<string>}
 */
export const generateRuntime = async (artifacts, moduleType, logger) => {
	if (artifacts) {
		const evmtsImports =
			moduleType !== 'cjs'
				? `import { evmtsContractFactory } from '@evmts/core'`
				: `const { evmtsContractFactory } = require('@evmts/core')`
		const evmtsBody = generateEvmtsBody(artifacts, moduleType)
		return [evmtsImports, evmtsBody].join('\n')
	}
	logger.warn('No artifacts found, skipping runtime generation')
	return ''
}
