import { generateTevmBody } from './generateTevmBody.js'
import { die, map } from 'effect/Effect'

const importsByModuleType = {
	contract: {
		cjs: `const { createContract } = require('@tevm/contract')`,
		dts: `import { Contract } from '@tevm/contract'`,
		ts: `import { createContract } from '@tevm/contract'`,
		mjs: `import { createContract } from '@tevm/contract'`,
	},
	script: {
		cjs: `const { createScript } = require('@tevm/contract')`,
		dts: `import { Script } from '@tevm/contract'`,
		ts: `import { createScript } from '@tevm/contract'`,
		mjs: `import { createScript } from '@tevm/contract'`,
	},
}

/**
 * @param {import("@tevm/compiler").Artifacts} artifacts
 * @param {import('./types.js').ModuleType} moduleType
 * @param {boolean} includeBytecode
 * @returns {import('effect/Effect').Effect<never, never, string>}
 */
export const generateRuntime = (artifacts, moduleType, includeBytecode) => {
	if (!artifacts || Object.keys(artifacts).length === 0) {
		return die('No artifacts provided to generateRuntime')
	}
	const imports =
		importsByModuleType[includeBytecode ? 'script' : 'contract'][moduleType]
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
