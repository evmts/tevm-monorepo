import { generateTevmBody } from './generateTevmBody.js'
import { die, map } from 'effect/Effect'

/**
 * @param {'tevm/contract' | '@tevm/contract'} contractPackage
 */
const importsByModuleType = (contractPackage) => ({
	contract: {
		cjs: `const { createContract } = require('${contractPackage}')`,
		dts: `import { Contract } from '${contractPackage}'`,
		ts: `import { createContract } from '${contractPackage}'`,
		mjs: `import { createContract } from '${contractPackage}'`,
	},
	script: {
		cjs: `const { createScript } = require('${contractPackage}')`,
		dts: `import { Script } from '${contractPackage}'`,
		ts: `import { createScript } from '${contractPackage}'`,
		mjs: `import { createScript } from '${contractPackage}'`,
	},
})
/**
 * @param {import("@tevm/compiler").Artifacts} artifacts
 * @param {import('./types.js').ModuleType} moduleType
 * @param {boolean} includeBytecode
 * @param {'tevm/contract' | '@tevm/contract'} tevmPackage - Package to import contracts from
 * @returns {import('effect/Effect').Effect<never, never, string>}
 */
export const generateRuntime = (
	artifacts,
	moduleType,
	includeBytecode,
	tevmPackage,
) => {
	if (!artifacts || Object.keys(artifacts).length === 0) {
		return die('No artifacts provided to generateRuntime')
	}
	const imports =
		importsByModuleType(tevmPackage)[includeBytecode ? 'script' : 'contract'][
			moduleType
		]
	if (!imports) {
		return die(
			`Unknown module type: ${moduleType}. Valid module types include ${Object.keys(
				importsByModuleType(tevmPackage),
			).join(', ')}`,
		)
	}
	return generateTevmBody(artifacts, moduleType, includeBytecode).pipe(
		map((body) => [imports, body].join('\n')),
	)
}
