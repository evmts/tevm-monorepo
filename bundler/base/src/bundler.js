import { generateRuntime } from '@evmts/runtime'
import { resolveArtifacts, resolveArtifactsSync } from '@evmts/solc'
import { runSync } from 'effect/Effect'

/**
 * @type {import('./types.js').Bundler}
 */
export const bundler = (config, logger, fao) => {
	return {
		name: bundler.name,
		config,
		resolveDts: async (modulePath, basedir, includeAst, includeBytecode) => {
			try {
				const { solcInput, solcOutput, artifacts, modules, asts } =
					await resolveArtifacts(
						modulePath,
						basedir,
						logger,
						config,
						includeAst,
						includeBytecode,
						fao,
					)
				if (artifacts && Object.keys(artifacts).length > 0) {
					return {
						solcInput,
						solcOutput,
						asts,
						code: runSync(generateRuntime(artifacts, 'dts', includeBytecode)),
						modules,
					}
				}
				return { solcInput, solcOutput, code: '', modules, asts }
			} catch (e) {
				logger.error(/** @type {any} */ (e))
				logger.error('there was an error in evmts plugin generating .dts')
				throw e
			}
		},
		resolveDtsSync: (modulePath, basedir, includeAst, includeBytecode) => {
			try {
				const { artifacts, modules, asts, solcInput, solcOutput } =
					resolveArtifactsSync(
						modulePath,
						basedir,
						logger,
						config,
						includeAst,
						includeBytecode,
						fao,
					)
				if (artifacts && Object.keys(artifacts).length > 0) {
					return {
						solcInput,
						solcOutput,
						asts,
						modules,
						code: runSync(generateRuntime(artifacts, 'dts', includeBytecode)),
					}
				}
				return { modules, code: '', asts, solcInput, solcOutput }
			} catch (e) {
				logger.error(/** @type {any} */ (e))
				logger.error('there was an error in evmts plugin resolving .dts')
				throw e
			}
		},
		resolveTsModuleSync: (modulePath, basedir, includeAst, includeBytecode) => {
			try {
				const { solcInput, solcOutput, asts, artifacts, modules } =
					resolveArtifactsSync(
						modulePath,
						basedir,
						logger,
						config,
						includeAst,
						includeBytecode,
						fao,
					)
				let code = ''
				if (artifacts && Object.keys(artifacts).length > 0) {
					code = runSync(generateRuntime(artifacts, 'ts', includeBytecode))
				}
				return { code, modules, solcInput, solcOutput, asts }
			} catch (e) {
				logger.error(/** @type {any} */ (e))
				logger.error('there was an error in evmts plugin resolving .ts')
				throw e
			}
		},
		resolveTsModule: async (
			modulePath,
			basedir,
			includeAst,
			includeBytecode,
		) => {
			try {
				const { solcInput, solcOutput, asts, artifacts, modules } =
					await resolveArtifacts(
						modulePath,
						basedir,
						logger,
						config,
						includeAst,
						includeBytecode,
						fao,
					)
				let code = ''
				if (artifacts && Object.keys(artifacts).length > 0) {
					code = runSync(generateRuntime(artifacts, 'ts', includeBytecode))
				}
				return { code, modules, solcInput, solcOutput, asts }
			} catch (e) {
				logger.error(/** @type {any} */ (e))
				logger.error('there was an error in evmts plugin resolving .ts')
				throw e
			}
		},
		resolveCjsModuleSync: (
			modulePath,
			basedir,
			includeAst,
			includeBytecode,
		) => {
			try {
				const { solcInput, solcOutput, asts, artifacts, modules } =
					resolveArtifactsSync(
						modulePath,
						basedir,
						logger,
						config,
						includeAst,
						includeBytecode,
						fao,
					)
				let code = ''
				if (artifacts && Object.keys(artifacts).length > 0) {
					code = runSync(generateRuntime(artifacts, 'cjs', includeBytecode))
				}
				return { code, modules, solcInput, solcOutput, asts }
			} catch (e) {
				logger.error(/** @type {any} */ (e))
				logger.error('there was an error in evmts plugin resolving .cjs')
				throw e
			}
		},
		resolveCjsModule: async (
			modulePath,
			basedir,
			includeAst,
			includeBytecode,
		) => {
			try {
				const { solcInput, solcOutput, asts, artifacts, modules } =
					await resolveArtifacts(
						modulePath,
						basedir,
						logger,
						config,
						includeAst,
						includeBytecode,
						fao,
					)
				let code = ''
				if (artifacts && Object.keys(artifacts).length > 0) {
					code = runSync(generateRuntime(artifacts, 'cjs', includeBytecode))
				}
				return { code, modules, solcInput, solcOutput, asts }
			} catch (e) {
				logger.error(/** @type {any} */ (e))
				logger.error('there was an error in evmts plugin resolving .cjs')
				throw e
			}
		},
		resolveEsmModuleSync: (
			modulePath,
			basedir,
			includeAst,
			includeBytecode,
		) => {
			try {
				const { solcInput, solcOutput, asts, artifacts, modules } =
					resolveArtifactsSync(
						modulePath,
						basedir,
						logger,
						config,
						includeAst,
						includeBytecode,
						fao,
					)
				let code = ''
				if (artifacts && Object.keys(artifacts).length > 0) {
					code = runSync(generateRuntime(artifacts, 'mjs', includeBytecode))
				}
				return { code, modules, solcInput, solcOutput, asts }
			} catch (e) {
				logger.error('there was an error in evmts plugin resolving .mjs')
				logger.error(/** @type {any} */ (e))
				throw e
			}
		},
		resolveEsmModule: async (
			modulePath,
			basedir,
			includeAst,
			includeBytecode,
		) => {
			try {
				const { solcInput, solcOutput, asts, artifacts, modules } =
					await resolveArtifacts(
						modulePath,
						basedir,
						logger,
						config,
						includeAst,
						includeBytecode,
						fao,
					)
				let code = ''
				if (artifacts && Object.keys(artifacts).length > 0) {
					code = runSync(generateRuntime(artifacts, 'mjs', includeBytecode))
				}
				return { code, modules, solcInput, solcOutput, asts }
			} catch (e) {
				logger.error(/** @type {any} */ (e))
				logger.error('there was an error in evmts plugin resolving .mjs')
				throw e
			}
		},
	}
}
