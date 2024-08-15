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
						`const _name${contractName} = ${JSON.stringify(contractName, null, 2)} as const;`,
						`const _abi${contractName} = ${JSON.stringify(contract.humanReadableAbi, null, 2)} as const;`,
						'/**',
						` * ${contractName} Contract (with bytecode)`,
						...natspec,
						' * @see [contract docs](https://tevm.sh/learn/contracts/) for more documentation',
						' */',
						`export const ${contractName}: Contract<`,
						`  typeof _name${contractName},`,
						`  typeof _abi${contractName},`,
						'  undefined,',
						'  `0x${string}`,',
						'  `0x${string}`,',
						'  undefined,',
						'>;',
					].filter(Boolean)
				}
				return [
					`const _abi${contractName} = ${JSON.stringify(contract.humanReadableAbi)} as const;`,
					`const _name${contractName} = ${JSON.stringify(contractName)} as const;`,
					'/**',
					` * ${contractName} Contract (no bytecode)`,
					` * change file name or add file that ends in '.s.sol' extension if you wish to compile the bytecode`,
					' * @see [contract docs](https://tevm.sh/learn/contracts/) for more documentation',
					...natspec,
					' */',
					`export const ${contractName}: Contract<typeof _name${contractName}, typeof _abi${contractName}, undefined, undefined, undefined, undefined>;`,
				].filter(Boolean)
			})
			.join('\n'),
	)
}
