import { generateTevmBody } from './generateTevmBody.js'
import { die, map } from 'effect/Effect'

const importsByModuleType = {
	cjs: `const { createTevmContract } = require('@tevm/contract')`,
	dts: `import { TevmContract } from '@tevm/contract'`,
	ts: `import { createTevmContract } from '@tevm/contract'`,
	mjs: `import { createTevmContract } from '@tevm/contract'`,
}

/**
 * @param {import("@tevm/solc").Artifacts} artifacts
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
	return generateTevmBody(artifacts, moduleType, includeBytecode).pipe(
		map((body) => [imports, body].join('\n')),
	)
}
