import { generateDtsBody } from './generateEvmtsBodyDts.js'
import { formatAbi } from 'abitype'

/**
 * @typedef {'cjs' | 'mjs' | 'ts' | 'dts'} ModuleType
 */

/**
 * @param {import("../solc/resolveArtifactsSync.js").Artifacts} artifacts
 * @param {ModuleType} moduleType
 * @returns {string}
 */
export const generateEvmtsBody = (artifacts, moduleType) => {
	if (moduleType === 'dts') {
		return generateDtsBody(artifacts)
	}
	return Object.entries(artifacts)
		.flatMap(([contractName, { abi, userdoc = {} }]) => {
			const contract = JSON.stringify({
				name: contractName,
				humanReadableAbi: formatAbi(abi),
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
					`module.exports.${contractName} = evmtsContractFactory(_${contractName})`,
				]
			}

			if (moduleType === 'ts') {
				return [
					`const _${contractName} = ${contract} as const`,
					...natspec,
					`export const ${contractName} = evmtsContractFactory(_${contractName})`,
				]
			}

			return [
				`const _${contractName} = ${contract}`,
				...natspec,
				`export const ${contractName} = evmtsContractFactory(_${contractName})`,
			]
		})
		.join('\n')
}
