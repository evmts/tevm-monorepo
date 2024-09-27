import { formatAbi } from 'abitype'
import { succeed } from 'effect/Effect'
import { generateDtsBody } from './generateTevmBodyDts.js'

/**
 * @param {import("@tevm/compiler").Artifacts} artifacts
 * @param {import('./types.js').ModuleType} moduleType
 * @param {boolean} includeBytecode
 * @returns {import('effect/Effect').Effect<string, never, never>}
 */
export const generateTevmBody = (artifacts, moduleType, includeBytecode) => {
	if (moduleType === 'dts') {
		return generateDtsBody(artifacts, includeBytecode)
	}
	return succeed(
		Object.entries(artifacts)
			.flatMap(([contractName, { abi, userdoc = {}, evm }]) => {
				const contract = JSON.stringify(
					{
						name: contractName,
						humanReadableAbi: formatAbi(abi),
						...(includeBytecode
							? {
									bytecode: evm?.bytecode?.object && `0x${evm.bytecode.object}`,
									deployedBytecode: evm?.deployedBytecode?.object && `0x${evm.deployedBytecode.object}`,
								}
							: {}),
					},
					null,
					2,
				)
				const natspec = Object.entries(userdoc.methods ?? {}).map(
					([method, { notice }]) => ` * @property ${method} ${notice}`,
				)
				if (userdoc.notice) {
					natspec.unshift(` * ${userdoc.notice}`)
				}
				natspec.push(' * @see [contract docs](https://tevm.sh/learn/contracts/) for more documentation')
				natspec.unshift('/**')
				natspec.push(' */')

				if (moduleType === 'cjs') {
					return [
						`const _${contractName} = ${contract}`,
						...natspec,
						`module.exports.${contractName} = ${includeBytecode ? 'createContract' : 'createContract'}(_${contractName})`,
					]
				}

				if (moduleType === 'ts') {
					return [
						`const _${contractName} = ${contract} as const`,
						...natspec,
						`export const ${contractName} = ${includeBytecode ? 'createContract' : 'createContract'}(_${contractName})`,
					]
				}

				return [
					`const _${contractName} = ${contract}`,
					...natspec,
					`export const ${contractName} = ${includeBytecode ? 'createContract' : 'createContract'}(_${contractName})`,
				]
			})
			.join('\n'),
	)
}
