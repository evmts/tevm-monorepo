import { compileContractSync } from './compiler/compileContractsSync.js'

/**
 * @type {import('./types.js').ResolveArtifactsSync}
 */
export const resolveArtifactsSync = (
	solFile,
	basedir,
	logger,
	config,
	includeAst,
	includeBytecode,
	fao,
	solc,
) => {
	if (!solFile.endsWith('.sol')) {
		throw new Error('Not a solidity file')
	}
	const { artifacts, modules, asts, solcInput, solcOutput } =
		compileContractSync(
			solFile,
			basedir,
			config,
			includeAst,
			includeBytecode,
			fao,
			logger,
			solc,
		)
	if (!artifacts) {
		logger.error(`Compilation failed for ${solFile}`)
		throw new Error('Compilation failed')
	}

	return {
		artifacts: Object.fromEntries(
			Object.entries(artifacts).map(([contractName, contract]) => {
				return [
					contractName,
					{
						contractName,
						abi: contract.abi,
						userdoc: contract.userdoc,
						evm: contract.evm,
					},
				]
			}),
		),
		modules,
		asts,
		solcInput,
		solcOutput,
	}
}
