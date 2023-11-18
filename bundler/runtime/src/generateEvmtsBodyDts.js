import { formatAbi } from 'abitype'
import { succeed } from 'effect/Effect'

/**
 * @param {import("@evmts/solc").Artifacts} artifacts
 * @param {boolean} includeBytecode
 * @returns {import('effect/Effect').Effect<never, never, string>}
 */
export const generateDtsBody = (artifacts, includeBytecode) => {
	return succeed(
		Object.entries(artifacts)
			.flatMap(([contractName, { abi, userdoc = {} }]) => {
				const contract = {
					name: contractName,
					humanReadableAbi: formatAbi(abi),
				}
				const natspec = Object.entries(userdoc.methods ?? {}).map(
					([method, { notice }]) => ` * @property ${method} ${notice}`,
				)
				if (userdoc.notice) {
					natspec.unshift(` * @notice ${userdoc.notice}`)
				}
				return [
					`const _abi${contractName} = ${JSON.stringify(
						contract.humanReadableAbi,
					)} as const;`,
					`const _name${contractName} = ${JSON.stringify(
						contractName,
					)} as const;`,
					'/**',
					` * ${contractName} EvmtsContract`,
					...natspec,
					' */',
					`export const ${contractName}: EvmtsContract<typeof _name${contractName}, typeof _abi${contractName}, ${
						includeBytecode ? '`0x${string}`' : 'undefined'
					}, ${includeBytecode ? '`0x${string}`' : 'undefined'}>;`,
				].filter(Boolean)
			})
			.join('\n'),
	)
}
