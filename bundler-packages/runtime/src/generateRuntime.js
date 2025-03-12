import { die, map } from 'effect/Effect'
import { generateTevmBody } from './generateTevmBody.js'

/**
 * Map of import statements by module type and contract type.
 * This determines the appropriate import statement based on:
 * 1. Whether it's a regular contract or a script contract (with bytecode)
 * 2. The target module format (cjs, ts, dts, mjs)
 * 3. The Tevm contract package to import from
 *
 * @param {'tevm/contract' | '@tevm/contract'} contractPackage - Package to import contracts from
 * @returns {{
 *   contract: {
 *     cjs: string,
 *     dts: string,
 *     ts: string,
 *     mjs: string
 *   },
 *   script: {
 *     cjs: string,
 *     dts: string,
 *     ts: string,
 *     mjs: string
 *   }
 * }} A nested object mapping contract types and module types to import statements
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
 * Generates a complete runtime module from Solidity compilation artifacts.
 *
 * This function combines the appropriate import statements with the generated
 * contract body code to create a complete module that exports the Tevm Contract
 * objects. It supports different output formats and can optionally include
 * bytecode for deployable contracts.
 *
 * @param {import("@tevm/compiler").Artifacts} artifacts - Compiled Solidity artifacts
 *   containing ABI, bytecode, and other contract information
 * @param {import('./types.js').ModuleType} moduleType - The target module format
 *   ('cjs', 'dts', 'ts', or 'mjs')
 * @param {boolean} includeBytecode - Whether to include bytecode in the output,
 *   true for script/deployable contracts, false for interface-only contracts
 * @param {'tevm/contract' | '@tevm/contract'} tevmPackage - Package name to import
 *   the createContract function from
 * @returns {import('effect/Effect').Effect<string, never, never>} - Effect that
 *   resolves to the generated module code as a string
 * @throws {Error} If no artifacts are provided or if an invalid module type is specified
 *
 * @example
 * ```javascript
 * import { generateRuntime } from '@tevm/runtime'
 * import { runPromise } from 'effect/Effect'
 *
 * // Generate TypeScript module from artifacts
 * const code = await runPromise(
 *   generateRuntime(
 *     artifacts,         // Solidity compilation results
 *     'ts',              // Generate TypeScript code
 *     true,              // Include bytecode
 *     '@tevm/contract'   // Import from this package
 *   )
 * )
 *
 * console.log(code)
 * ```
 */
export const generateRuntime = (artifacts, moduleType, includeBytecode, tevmPackage) => {
	// Validate that artifacts exist
	if (!artifacts || Object.keys(artifacts).length === 0) {
		return die('No artifacts provided to generateRuntime')
	}

	// Determine the appropriate import statements based on module type and bytecode inclusion
	const contractType = includeBytecode ? 'script' : 'contract'
	const imports = importsByModuleType(tevmPackage)[contractType][moduleType]

	// Validate the module type
	if (!imports) {
		return die(`Unknown module type: ${moduleType}. Valid module types include 'cjs', 'dts', 'ts', and 'mjs'`)
	}

	// Generate the contract body and combine with imports
	return generateTevmBody(artifacts, moduleType, includeBytecode).pipe(map((body) => [imports, body].join('\n')))
}
