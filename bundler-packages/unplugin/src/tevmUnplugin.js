import { createRequire } from 'node:module'
import { bundler, getContractPath } from '@tevm/base-bundler'
import { createCache } from '@tevm/bundler-cache'
import { defaultConfig, loadConfig } from '@tevm/config'
import { createSolc, releases } from '@tevm/solc'
import { catchTag, logWarning, map, runPromise } from 'effect/Effect'
// @ts-expect-error
import defaultSolc from 'solc'
import { z } from 'zod'
import { fao } from './fao.js'

const defaultVersion = defaultSolc.version().slice(0, defaultSolc.version().indexOf('+'))

/**
 * @type {import("zod").ZodSchema<import('@tevm/solc').SolcVersions>}
 */
const compilerOptionValidator = z
	.union(
		/**
		 * @type {any}
		 */
		(Object.keys(releases).map((release) => z.literal(release))),
	)
	.default(defaultVersion)
	.describe(`Solc compiler version to use. Defaults to ${defaultVersion}}`)

/**
 * @typedef {import("zod").infer<typeof compilerOptionValidator>} CompilerOption
 */

const bundlers = {
	solc: bundler,
}

/**
 * @type {import("unplugin").UnpluginFactory<{solc?: CompilerOption } | undefined, false>}
 */
export const tevmUnplugin = (options = {}) => {
	/**
	 * @type {import("@tevm/config").ResolvedCompilerConfig}
	 */
	let config

	// for current release we will hardcode this to solc
	const parsedSolcVersion = compilerOptionValidator.safeParse(options.solc)
	if (!parsedSolcVersion.success) {
		console.error(parsedSolcVersion.error)
		throw new Error(`Invalid solc compiler passed to Tevm plugin'`)
	}

	const bundler = bundlers.solc
	/**
	 * @type {ReturnType<typeof bundler>}
	 */
	let moduleResolver

	return {
		name: '@tevm/rollup-plugin',
		/**
		 * Make this plugin run before other plugins
		 * We do this so other plugins (specifically webpack ones) don't barf on the solidity imports
		 */
		enforce: 'pre',
		async buildStart() {
			config = await runPromise(
				loadConfig(process.cwd()).pipe(
					catchTag('FailedToReadConfigError', () =>
						logWarning('Unable to find tevm.config.json. Using default config.').pipe(map(() => defaultConfig)),
					),
				),
			)
			const solcCache = createCache(config.cacheDir, fao, process.cwd())
			console.log('proces.cwd()', process.cwd())
			const contractPackage = getContractPath(process.cwd())
			const versionedSolc =
				parsedSolcVersion.data === defaultVersion ? defaultSolc : await createSolc(parsedSolcVersion.data)
			moduleResolver = bundler(config, console, fao, versionedSolc, solcCache, contractPackage)
		},
		loadInclude: (id) => {
			// Extract base path without query parameters
			const basePath = id.includes('.sol') ? /** @type {string}*/(id.split('?')[0]) : id
			return basePath.endsWith('.sol') && !fao.existsSync(`${basePath}.ts`) && !fao.existsSync(`${basePath}.d.ts`)
		},
		async resolveId(id, importer) {
			// to handle the case where the import is coming from a node_module or a different workspace
			// we need to always point @tevm/contract to the local version
			if (
				id.startsWith('@tevm/contract') &&
				!importer?.startsWith(process.cwd()) &&
				!importer?.includes('node_modules')
			) {
				return createRequire(`${process.cwd()}/`).resolve('@tevm/contract')
			}
			return null
		},
		async load(id) {
			// Parse file path to extract query parameters
			const { filePath, queryParams } = (() => {
				const [filePath, queryString] = id.split('?')
				if (!filePath) throw new Error('expectedFilePath')
				return {
					filePath,
					queryParams: new URLSearchParams(queryString ?? '')
				}
			})()

			// Determine compilation options from query params or file extension
			const includeBytecode = queryParams.get('includeBytecode') !== null ? queryParams.get('includeBytecode') === 'true' : filePath.endsWith('.s.sol')
			const includeAst = queryParams.get('includeAst') === 'true'

			const { code, modules } = await moduleResolver.resolveEsmModule(
				filePath,
				process.cwd(),
				includeAst,
				includeBytecode
			)

			Object.values(modules).forEach((module) => {
				if (module.id.includes('node_modules')) {
					return
				}
				this.addWatchFile(module.id)
			})
			return code
		},
		...{ version: '0.11.2' },
	}
}
