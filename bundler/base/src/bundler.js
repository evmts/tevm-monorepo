import { resolveModuleAsync } from './resolveModuleAsync.js'
import { resolveModuleSync } from './resolveModuleSync.js'

/**
 * @type {import('./types.js').Bundler}
 */
export const bundler = (config, logger, fao, solc, cache) => {
	return {
		name: bundler.name,
		config,
		resolveDts: (modulePath, basedir, includeAst, includeBytecode) =>
			resolveModuleAsync(
				logger,
				config,
				fao,
				solc,
				modulePath,
				basedir,
				includeAst,
				includeBytecode,
				'dts',
				cache,
			),
		resolveDtsSync: (modulePath, basedir, includeAst, includeBytecode) =>
			resolveModuleSync(
				logger,
				config,
				fao,
				solc,
				modulePath,
				basedir,
				includeAst,
				includeBytecode,
				'dts',
				cache,
			),
		resolveTsModuleSync: (modulePath, basedir, includeAst, includeBytecode) =>
			resolveModuleSync(
				logger,
				config,
				fao,
				solc,
				modulePath,
				basedir,
				includeAst,
				includeBytecode,
				'ts',
				cache,
			),
		resolveTsModule: (modulePath, basedir, includeAst, includeBytecode) =>
			resolveModuleAsync(
				logger,
				config,
				fao,
				solc,
				modulePath,
				basedir,
				includeAst,
				includeBytecode,
				'ts',
				cache,
			),
		resolveCjsModuleSync: (modulePath, basedir, includeAst, includeBytecode) =>
			resolveModuleSync(
				logger,
				config,
				fao,
				solc,
				modulePath,
				basedir,
				includeAst,
				includeBytecode,
				'cjs',
				cache,
			),
		resolveCjsModule: (modulePath, basedir, includeAst, includeBytecode) =>
			resolveModuleAsync(
				logger,
				config,
				fao,
				solc,
				modulePath,
				basedir,
				includeAst,
				includeBytecode,
				'cjs',
				cache,
			),
		resolveEsmModuleSync: (modulePath, basedir, includeAst, includeBytecode) =>
			resolveModuleSync(
				logger,
				config,
				fao,
				solc,
				modulePath,
				basedir,
				includeAst,
				includeBytecode,
				'mjs',
				cache,
			),
		resolveEsmModule: (modulePath, basedir, includeAst, includeBytecode) =>
			resolveModuleAsync(
				logger,
				config,
				fao,
				solc,
				modulePath,
				basedir,
				includeAst,
				includeBytecode,
				'mjs',
				cache,
			),
	}
}
