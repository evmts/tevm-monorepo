import { die, map } from 'effect/Effect'
import { generateTevmBody } from './generateTevmBody.js'

/**
 * @param {'tevm/contract' | '@tevm/contract'} contractPackage
 */
const importsByModuleType = (contractPackage) => ({
	contract: {
		cjs: `const { createContract } = require('${contractPackage}')`,
		dts: `import type { Contract } from '${contractPackage}'`,
		ts: `import { createContract } from '${contractPackage}'`,
		mjs: `import { createContract } from '${contractPackage}'`,
	},
	script: {
		cjs: `const { createContract } = require('${contractPackage}')`,
		dts: `import type { Contract } from '${contractPackage}'`,
		ts: `import { createContract } from '${contractPackage}'`,
		mjs: `import { createContract } from '${contractPackage}'`,
	},
})
/**
 * @param {import("@tevm/compiler").Artifacts} artifacts
 * @param {import('./types.js').ModuleType} moduleType
 * @param {boolean} includeBytecode
 * @param {'tevm/contract' | '@tevm/contract'} tevmPackage - Package to import contracts from
 * @returns {import('effect/Effect').Effect<string, never, never>}
 */
export const generateRuntime = (artifacts, moduleType, includeBytecode, tevmPackage) => {
	if (!artifacts || Object.keys(artifacts).length === 0) {
		return die('No artifacts provided to generateRuntime')
	}
	const imports = importsByModuleType(tevmPackage)[includeBytecode ? 'script' : 'contract'][moduleType]
	if (!imports) {
		return die(
			`Unknown module type: ${moduleType}. Valid module types include ${Object.keys(
				importsByModuleType(tevmPackage),
			).join(', ')}`,
		)
	}
	return generateTevmBody(artifacts, moduleType, includeBytecode).pipe(map((body) => [imports, body].join('\n')))
}
