import { generateEvmtsBody } from './generateEvmtsBody.js'
import { die, map } from 'effect/Effect'

const importsByModuleType = {
	cjs: `const { evmtsContractFactory } = require('@evmts/core')`,
	dts: `import { EvmtsContract } from '@evmts/core'`,
	ts: `import { evmtsContractFactory } from '@evmts/core'`,
	mjs: `import { evmtsContractFactory } from '@evmts/core'`,
}

/**
 * @param {import("@evmts/solc").Artifacts} artifacts
 * @param {import('./types.js').ModuleType} moduleType
 * @param {boolean} includeBytecode
 * @returns {import('effect/Effect').Effect<never, never, string>}
 */
export const generateRuntime = (artifacts, moduleType, includeBytecode) => {
	if (!artifacts || Object.keys(artifacts).length === 0) {
		return die('No artifacts provided to generateRuntime')
	}
	const imports = importsByModuleType[moduleType]
	if (!imports) {
		return die(
			`Unknown module type: ${moduleType}. Valid module types include ${Object.keys(
				importsByModuleType,
			).join(', ')}`,
		)
	}
	return generateEvmtsBody(artifacts, moduleType, includeBytecode).pipe(
		map((body) => [imports, body].join('\n')),
	)
}
