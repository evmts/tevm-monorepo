import { compileContract } from './compiler/compileContracts.js'

/**
 * Resolves artifacts with solc asyncronously
 * @type {import('./types.js').ResolveArtifacts}
 */
export const resolveArtifacts = async (
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
		await compileContract(
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
