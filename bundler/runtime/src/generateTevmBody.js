import { generateDtsBody } from './generateTevmBodyDts.js'
import { formatAbi } from 'abitype'
import { succeed } from 'effect/Effect'

/**
 * @param {import("@tevm/compiler").Artifacts} artifacts
 * @param {import('./types.js').ModuleType} moduleType
 * @param {boolean} includeBytecode
 * @returns {import('effect/Effect').Effect<never, never, string>}
 */
export const generateTevmBody = (artifacts, moduleType, includeBytecode) => {
	if (moduleType === 'dts') {
		return generateDtsBody(artifacts, includeBytecode)
	}
	return succeed(
		Object.entries(artifacts)
			.flatMap(([contractName, { abi, userdoc = {}, evm }]) => {
				const contract = JSON.stringify({
					name: contractName,
					humanReadableAbi: formatAbi(abi),
					bytecode: evm?.bytecode.object && `0x${evm.bytecode.object}`,
					deployedBytecode:
						evm?.deployedBytecode.object && `0x${evm.deployedBytecode.object}`,
				})
				const natspec = Object.entries(userdoc.methods ?? {}).map(
					([method, { notice }]) => ` * @property ${method} ${notice}`,
				)
				if (userdoc.notice) {
					natspec.unshift(` * ${userdoc.notice}`)
				}
				if (natspec.length) {
					natspec.unshift('/**')
					natspec.push(' */')
				}
				if (moduleType === 'cjs') {
					return [
						`const _${contractName} = ${contract}`,
						...natspec,
						`module.exports.${contractName} = createTevmContract(_${contractName})`,
					]
				}

				if (moduleType === 'ts') {
					return [
						`const _${contractName} = ${contract} as const`,
						...natspec,
						`export const ${contractName} = createTevmContract(_${contractName})`,
					]
				}

				return [
					`const _${contractName} = ${contract}`,
					...natspec,
					`export const ${contractName} = createTevmContract(_${contractName})`,
				]
			})
			.join('\n'),
	)
}
