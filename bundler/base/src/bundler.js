import { generateRuntime } from '@tevm/runtime'
import { resolveArtifacts, resolveArtifactsSync } from '@tevm/solc'
import { runSync } from 'effect/Effect'

/**
 * @type {import('./types.js').Bundler}
 */
export const bundler = (config, logger, fao, solc) => {
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
						solc,
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
				logger.error('there was an error in tevm plugin generating .dts')
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
						solc,
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
				logger.error('there was an error in tevm plugin resolving .dts')
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
						solc,
					)
				let code = ''
				if (artifacts && Object.keys(artifacts).length > 0) {
					code = runSync(generateRuntime(artifacts, 'ts', includeBytecode))
				}
				return { code, modules, solcInput, solcOutput, asts }
			} catch (e) {
				logger.error(/** @type {any} */ (e))
				logger.error('there was an error in tevm plugin resolving .ts')
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
						solc,
					)
				let code = ''
				if (artifacts && Object.keys(artifacts).length > 0) {
					code = runSync(generateRuntime(artifacts, 'ts', includeBytecode))
				}
				return { code, modules, solcInput, solcOutput, asts }
			} catch (e) {
				logger.error(/** @type {any} */ (e))
				logger.error('there was an error in tevm plugin resolving .ts')
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
						solc,
					)
				let code = ''
				if (artifacts && Object.keys(artifacts).length > 0) {
					code = runSync(generateRuntime(artifacts, 'cjs', includeBytecode))
				}
				return { code, modules, solcInput, solcOutput, asts }
			} catch (e) {
				logger.error(/** @type {any} */ (e))
				logger.error('there was an error in tevm plugin resolving .cjs')
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
						solc,
					)
				let code = ''
				if (artifacts && Object.keys(artifacts).length > 0) {
					code = runSync(generateRuntime(artifacts, 'cjs', includeBytecode))
				}
				return { code, modules, solcInput, solcOutput, asts }
			} catch (e) {
				logger.error(/** @type {any} */ (e))
				logger.error('there was an error in tevm plugin resolving .cjs')
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
						solc,
					)
				let code = ''
				if (artifacts && Object.keys(artifacts).length > 0) {
					code = runSync(generateRuntime(artifacts, 'mjs', includeBytecode))
				}
				return { code, modules, solcInput, solcOutput, asts }
			} catch (e) {
				logger.error('there was an error in tevm plugin resolving .mjs')
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
						solc,
					)
				let code = ''
				if (artifacts && Object.keys(artifacts).length > 0) {
					code = runSync(generateRuntime(artifacts, 'mjs', includeBytecode))
				}
				return { code, modules, solcInput, solcOutput, asts }
			} catch (e) {
				logger.error(/** @type {any} */ (e))
				logger.error('there was an error in tevm plugin resolving .mjs')
				throw e
			}
		},
	}
}
