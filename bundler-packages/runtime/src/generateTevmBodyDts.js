import { formatAbi } from 'abitype'
import { succeed } from 'effect/Effect'

/**
 * @param {import("@tevm/compiler").Artifacts} artifacts
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
				if (includeBytecode) {
					return [
						`const _abi${contractName} = ${JSON.stringify(
							contract.humanReadableAbi,
						)} as const;`,
						`const _name${contractName} = ${JSON.stringify(
							contractName,
						)} as const;`,
						'/**',
						` * ${contractName} Script`,
						...natspec,
						' */',
						`export const ${contractName}: Script<typeof _name${contractName}, typeof _abi${contractName}>;`,
					].filter(Boolean)
				}
				return [
					`const _abi${contractName} = ${JSON.stringify(
						contract.humanReadableAbi,
					)} as const;`,
					`const _name${contractName} = ${JSON.stringify(
						contractName,
					)} as const;`,
					'/**',
					` * ${contractName} Contract`,
					...natspec,
					' */',
					`export const ${contractName}: Contract<typeof _name${contractName}, typeof _abi${contractName}>;`,
				].filter(Boolean)
			})
			.join('\n'),
	)
}
