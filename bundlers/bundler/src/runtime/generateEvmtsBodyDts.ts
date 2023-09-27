import type { Artifacts } from '../solc/resolveArtifactsSync'

export const generateDtsBody = (artifacts: Artifacts) => {
	return Object.entries(artifacts)
		.flatMap(([contractName, { abi, userdoc = {} }]) => {
			const contract = {
				name: contractName,
				abi,
			}
			const natspec = Object.entries(userdoc.methods ?? {}).map(
				([method, { notice }]) => ` * @property ${method} ${notice}`,
			)
			if (userdoc.notice) {
				natspec.unshift(` * @notice ${userdoc.notice}`)
			}
			return [
				`const _abi${contractName} = ${JSON.stringify(contract.abi)} as const;`,
				`const _name${contractName} = ${JSON.stringify(
					contractName,
				)} as const;`,
				'/**',
				` * ${contractName} EvmtsContract`,
				...natspec,
				' */',
				`export const ${contractName}: EvmtsContract<typeof _name${contractName}, typeof _abi${contractName}>;`,
			].filter(Boolean)
		})
		.join('\n')
}
