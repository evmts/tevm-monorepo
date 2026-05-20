import { formatAbi } from 'abitype'
import { succeed } from 'effect/Effect'

/** @param {string | null | undefined} value */
const escapeJSDoc = (value) =>
	String(value ?? '')
		.replace(/\*\//g, '*\\/')
		.replace(/\r?\n/g, '\n * ')

/**
 * Generates TypeScript declaration file (.d.ts) content for Tevm contracts.
 *
 * This function creates TypeScript type declarations for Solidity contracts,
 * including proper typing for the contract name, ABI, and optionally bytecode.
 * It also includes NatSpec documentation as JSDoc comments.
 *
 * @param {import("@tevm/compiler").Artifacts} artifacts - Compiled Solidity artifacts
 *   containing ABI, bytecode, and other contract information
 * @param {boolean} includeBytecode - Whether to include bytecode in the type definitions,
 *   true for deployable contracts, false for interface-only contracts
 * @returns {import('effect/Effect').Effect<string, never, never>} - Effect that
 *   resolves to the generated TypeScript declaration file content as a string
 *
 * @example
 * ```javascript
 * import { generateDtsBody } from '@tevm/runtime'
 * import { runPromise } from 'effect/Effect'
 *
 * // Generate TypeScript declaration file content
 * const dtsContent = await runPromise(
 *   generateDtsBody(
 *     artifacts, // Solidity compilation results
 *     true       // Include bytecode
 *   )
 * )
 *
 * console.log(dtsContent)
 * ```
 *
 * @internal This function is primarily used by generateTevmBody
 */
export const generateDtsBody = (artifacts, includeBytecode) => {
	return succeed(
		`
			${Object.entries(artifacts)
				.flatMap(([contractName, { abi, userdoc = {}, evm }]) => {
				// Create contract metadata
				const contract = {
					name: contractName,
					humanReadableAbi: formatAbi(abi),
				}

				// Generate JSDoc from NatSpec comments
				const natspec = Object.entries(userdoc.methods ?? {}).map(
					([method, { notice }]) => ` * @property ${escapeJSDoc(method)} ${escapeJSDoc(notice)}`,
				)

				// Add contract-level notice if available
				if (userdoc.notice) {
					natspec.unshift(` * @notice ${escapeJSDoc(userdoc.notice)}`)
				}

				// Generate type declaration for contracts with bytecode
				if (includeBytecode) {
					const bytecodeType =
						evm?.bytecode?.object && evm.bytecode.object !== '' ? '`0x${string}`' : 'undefined'
					const deployedBytecodeType =
						evm?.deployedBytecode?.object && evm.deployedBytecode.object !== '' ? '`0x${string}`' : 'undefined'
					const bytecodeLabel =
						bytecodeType === 'undefined' && deployedBytecodeType === 'undefined' ? 'no bytecode' : 'with bytecode'
					return [
						// Define constants for name and ABI with const assertions for type safety
						`declare const _name${contractName}: ${JSON.stringify(contractName, null, 2)};`,
						`declare const _abi${contractName}: readonly ${JSON.stringify(contract.humanReadableAbi, null, 2)};`,

						// JSDoc comments for the contract
						'/**',
						` * ${contractName} Contract (${bytecodeLabel})`,
						...natspec,
						' * @see [contract docs](https://tevm.sh/learn/contracts/) for more documentation',
						' */',

						// Type declaration for the contract
						`export const ${contractName}: Contract<`,
						`  typeof _name${contractName},`, // Contract name
						`  typeof _abi${contractName},`, // ABI
						'  undefined,', // Address placeholder
						`  ${bytecodeType},`, // Bytecode
						`  ${deployedBytecodeType},`, // Deployed bytecode
						'  undefined', // Additional data - removed trailing comma
						'>;',
					].filter(Boolean)
				}

				// Generate type declaration for interface-only contracts (no bytecode)
				return [
					// Define constants for ABI and name with const assertions
					`declare const _abi${contractName}: readonly ${JSON.stringify(contract.humanReadableAbi)};`,
					`declare const _name${contractName}: ${JSON.stringify(contractName)};`,

					// JSDoc comments for the contract
					'/**',
					` * ${contractName} Contract (no bytecode)`,
					` * change file name or add file that ends in '.s.sol' extension if you wish to compile the bytecode`,
					' * @see [contract docs](https://tevm.sh/learn/contracts/) for more documentation',
					...natspec,
					' */',

					// Type declaration for the contract (without bytecode)
					`export const ${contractName}: Contract<typeof _name${contractName}, typeof _abi${contractName}, undefined, undefined, undefined, undefined>;`,
				].filter(Boolean)
			})
			.join('\n')}
// solc artifacts of compilation
export declare const artifacts: ${JSON.stringify(artifacts, null, 2)};
`,
	)
}
