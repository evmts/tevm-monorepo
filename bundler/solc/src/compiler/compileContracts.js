import { solcCompile } from '../solc.js'
import { invariant, resolveEffect } from '../utils/index.js'
import { moduleFactory } from '@evmts/resolutions'
import { Effect } from 'effect'
import { runPromise } from 'effect/Effect'

/**
 * Compile the Solidity contract and return its ABI.
 *
 * @template TIncludeAsts
 * @template TIncludeBytecode
 * @param {string} filePath
 * @param {string} basedir
 * @param {import('@evmts/config').ResolvedCompilerConfig} config
 * @param {TIncludeAsts} includeAst
 * @param {TIncludeBytecode} includeBytecode
 * @param {import('../types.js').FileAccessObject} fao
 * @param {import('../types.js').Logger} logger
 * @returns {Promise<import('../types.js').CompiledContracts<TIncludeAsts>>}
 * @example
 * const { artifacts, modules } = await compileContract(
 *   './contracts/MyContract.sol',
 *   __dirname,
 *   config,
 *   true,
 *   await import('fs'),
 *   logger,
 * )
 */
export const compileContract = async (
	filePath,
	basedir,
	config,
	includeAst,
	includeBytecode,
	fao,
	logger,
) => {
	const moduleMap = await runPromise(
		moduleFactory(
			filePath,
			await fao
				.readFile(
					await Effect.runPromise(
						resolveEffect(filePath, basedir, fao, logger),
					),
					'utf8',
				)
				.then((code) => {
					return code
				}),
			config.remappings,
			config.libs,
			fao,
			false,
		),
	)
	const entryModule = moduleMap.get(filePath)
	invariant(entryModule, 'Entry module should exist')

	/**
	 * @type {Object.<string, import('../types.js').ModuleInfo>}
	 */
	const modules = {}

	const stack = [entryModule]
	while (stack.length !== 0) {
		const m = stack.pop()
		invariant(m, 'Module should exist')
		if (m.id in modules) {
			continue
		}
		modules[m.id] = m
		const resolutions = m.importedIds.map(
			(id) =>
				/** @type {import("../types.js").ModuleInfo}*/ (moduleMap.get(id)),
		)
		for (const dep of resolutions) {
			stack.push(dep)
		}
	}

	const sources = Object.fromEntries(
		Object.entries(modules).map(([id, module]) => {
			return [
				id,
				{
					content:
						/** @type {string} */
						(module.code),
				},
			]
		}),
	)

	const emptyString = ''
	/**
	 * @type {['evm.bytecode.object', 'evm.deployedBytecode.object']}
	 */
	const evmBytecode = ['evm.bytecode.object', 'evm.deployedBytecode.object']
	/**
	 * @type {import('../solcTypes.js').SolcInputDescription}
	 */
	const input = {
		language: 'Solidity',
		sources,
		settings: {
			outputSelection: {
				'*': {
					'*': ['abi', 'userdoc', ...(includeBytecode ? evmBytecode : [])],
					...(includeAst ? { [emptyString]: ['ast'] } : {}),
				},
			},
		},
	}

	/**
	 * @type {import('../solcTypes.js').SolcOutput}
	 */
	const output = solcCompile(input)

	const warnings = output?.errors?.filter(({ type }) => type === 'Warning')
	const isErrors = (output?.errors?.length ?? 0) > (warnings?.length ?? 0)

	if (isErrors) {
		logger.error('Compilation errors:')
		logger.error(/** @type {any} */ (output?.errors))
		throw new Error('Compilation failed')
	}
	if (warnings?.length) {
		logger.warn(/** @type {any} */ (warnings))
		logger.warn('Compilation warnings:')
	}

	if (includeAst) {
		const asts = Object.fromEntries(
			Object.entries(output.sources).map(([id, source]) => {
				return [id, source.ast]
			}),
		)
		return {
			artifacts: output.contracts[entryModule.id],
			modules: /** @type {any} */ (modules),
			asts: /** @type {any} */ (asts),
			solcInput: input,
			solcOutput: output,
		}
	}
	return {
		artifacts: output.contracts[entryModule.id],
		modules: /** @type {any} */ (modules),
		asts: /** @type {any} */ (undefined),
		solcInput: input,
		solcOutput: output,
	}
}
