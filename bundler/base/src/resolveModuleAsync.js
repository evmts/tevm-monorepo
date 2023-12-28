import { readCache } from './readCache.js'
import { writeCache } from './writeCache.js'
import { resolveArtifacts } from '@tevm/compiler'
import { generateRuntime } from '@tevm/runtime'
import { runPromise } from 'effect/Effect'

/**
 * @param {import('@tevm/compiler').Logger} logger
 * @param {import('@tevm/config').ResolvedCompilerConfig} config
 * @param {import('@tevm/compiler').FileAccessObject} fao
 * @param {import('@tevm/solc').Solc} solc
 * @param {string} modulePath
 * @param {string} basedir
 * @param {boolean} includeAst
 * @param {boolean} includeBytecode
 * @param {import('@tevm/runtime').ModuleType} moduleType
 * @param {import('@tevm/bundler-cache').Cache} cache
 * @returns {Promise<import('./types.js').BundlerResult>} a promise that resolves to a bundler result object
 */
export const resolveModuleAsync = async (
	logger,
	config,
	fao,
	solc,
	modulePath,
	basedir,
	includeAst,
	includeBytecode,
	moduleType,
	cache,
) => {
	const cachedResult = readCache(
		logger,
		cache,
		modulePath,
		includeAst,
		includeBytecode,
	)
	try {
		const { solcInput, solcOutput, asts, artifacts, modules } =
			cachedResult ??
			(await resolveArtifacts(
				modulePath,
				basedir,
				logger,
				config,
				includeAst,
				includeBytecode,
				fao,
				solc,
			))
		let code = ''
		const artifactsExist = artifacts && Object.keys(artifacts).length > 0
		if (artifactsExist) {
			code = await runPromise(
				generateRuntime(artifacts, moduleType, includeBytecode),
			)
		} else {
			const message = `there were no artifacts for ${modulePath}. This is likely a bug in tevm`
			code = `// ${message}`
			logger.warn(message)
		}

		writeCache(
			logger,
			cache,
			{ solcInput, solcOutput, asts, artifacts, modules },
			code,
			modulePath,
			moduleType,
			// This is kinda quick and dirty but works for now
			// We are skipping writing artifacts if there is an error
			// But still write dts and mjs files since they always
			// fall back to generating an empty file with error messages
			artifactsExist,
		)

		return { solcInput, solcOutput, asts, modules, code }
	} catch (e) {
		logger.error(`there was an error in tevm plugin resolving .${moduleType}`)
		logger.error(/** @type any */ (e))
		throw e
	}
}
