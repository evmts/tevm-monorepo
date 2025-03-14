import { formatAbi } from 'abitype'
import { succeed } from 'effect/Effect'
import { generateDtsBody } from './generateTevmBodyDts.js'

/**
 * Generates the body of a JavaScript/TypeScript module for Tevm contracts.
 *
 * This function transforms Solidity compilation artifacts into JavaScript/TypeScript code
 * that creates Tevm Contract objects. It handles different output formats (cjs, ts, mjs)
 * and can include or exclude bytecode based on the provided options.
 *
 * For TypeScript declaration files (.d.ts), it delegates to generateDtsBody
 * which creates appropriate type definitions.
 *
 * @param {import("@tevm/compiler").Artifacts} artifacts - Compiled Solidity artifacts
 *   containing ABI, bytecode, and other contract information
 * @param {import('./types.js').ModuleType} moduleType - The target module format
 *   ('cjs', 'dts', 'ts', or 'mjs')
 * @param {boolean} includeBytecode - Whether to include bytecode in the output,
 *   true for script/deployable contracts, false for interface-only contracts
 * @returns {import('effect/Effect').Effect<string, never, never>} - Effect that
 *   resolves to the generated module body code as a string
 *
 * @example
 * ```javascript
 * import { generateTevmBody } from '@tevm/runtime'
 * import { runPromise } from 'effect/Effect'
 *
 * // Generate the body of a TypeScript module
 * const body = await runPromise(
 *   generateTevmBody(
 *     artifacts, // Solidity compilation results
 *     'ts',      // Generate TypeScript code
 *     true       // Include bytecode
 *   )
 * )
 *
 * console.log(body)
 * ```
 *
 * @internal This function is primarily used by generateRuntime
 */
export const generateTevmBody = (artifacts, moduleType, includeBytecode) => {
	// For TypeScript declaration files, delegate to generateDtsBody
	if (moduleType === 'dts') {
		return generateDtsBody(artifacts, includeBytecode)
	}

	// Generate JavaScript/TypeScript code for the contracts
	return succeed(
		Object.entries(artifacts)
			.flatMap(([contractName, { abi, userdoc = {}, evm }]) => {
				// Create the contract configuration object
				const contract = JSON.stringify(
					{
						name: contractName,
						humanReadableAbi: formatAbi(abi),
						// Include bytecode if requested and available (checking for empty string for interfaces)
						...(includeBytecode
							? {
									bytecode:
										evm?.bytecode?.object && evm.bytecode.object !== '' ? `0x${evm.bytecode.object}` : undefined,
									deployedBytecode:
										evm?.deployedBytecode?.object && evm.deployedBytecode.object !== ''
											? `0x${evm.deployedBytecode.object}`
											: undefined,
								}
							: {}),
					},
					null,
					2,
				)

				// Generate JSDoc documentation from NatSpec comments
				const natspec = Object.entries(userdoc.methods ?? {}).map(
					([method, { notice }]) => ` * @property ${method} ${notice}`,
				)

				// Add contract-level documentation if available
				if (userdoc.notice) {
					natspec.unshift(` * ${userdoc.notice}`)
				}

				// Add link to additional documentation
				natspec.push(' * @see [contract docs](https://tevm.sh/learn/contracts/) for more documentation')
				natspec.unshift('/**')
				natspec.push(' */')

				// Generate CommonJS format
				if (moduleType === 'cjs') {
					return [
						`const _${contractName} = ${contract}`,
						...natspec,
						`module.exports.${contractName} = createContract(_${contractName})`,
					]
				}

				// Generate TypeScript format with const assertion
				if (moduleType === 'ts') {
					return [
						`const _${contractName} = ${contract} as const`,
						...natspec,
						`export const ${contractName} = createContract(_${contractName})`,
					]
				}

				// Generate ES module format
				return [
					`const _${contractName} = ${contract}`,
					...natspec,
					`export const ${contractName} = createContract(_${contractName})`,
				]
			})
			.join('\n'),
	)
}
