import { bundler, createCache } from '@evmts/base'
import { loadConfig } from '@evmts/config'
import { createSolc, releases } from '@evmts/solc'
import { runSync } from 'effect/Effect'
import { existsSync, readFileSync } from 'fs'
import { readFile } from 'fs/promises'
import { createRequire } from 'module'
// @ts-expect-error
import defaultSolc from 'solc'
import { z } from 'zod'

const defaultVersion = defaultSolc
	.version()
	.slice(0, defaultSolc.version().indexOf('+'))

/**
 * @typedef {import("@evmts/solc").SolcVersions} SolcVersions
 */

/**
 * @type {import("zod").ZodSchema<SolcVersions>}
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
export const evmtsUnplugin = (options = {}) => {
	/**
	 * @type {import("@evmts/config").ResolvedCompilerConfig}
	 */
	let config

	// for current release we will hardcode this to solc
	const parsedSolcVersion = compilerOptionValidator.safeParse(options.solc)
	if (!parsedSolcVersion.success) {
		console.error(parsedSolcVersion.error)
		throw new Error(`Invalid solc compiler passed to EVMts plugin'`)
	}

	const bundler = bundlers.solc
	/**
	 * @type {ReturnType<typeof bundler>}
	 */
	let moduleResolver

	/**
	 * @type {import("@evmts/base").FileAccessObject}
	 */
	const fao = {
		existsSync,
		readFile,
		readFileSync,
	}

	const solcCache = createCache(console)

	return {
		name: '@evmts/rollup-plugin',
		enforce: 'pre',
		async buildStart() {
			config = runSync(loadConfig(process.cwd()))
			const versionedSolc =
				parsedSolcVersion.data === defaultVersion
					? defaultSolc
					: await createSolc(parsedSolcVersion.data)
			moduleResolver = bundler(config, console, fao, versionedSolc, solcCache)
			this.addWatchFile('./tsconfig.json')
		},
		loadInclude: (id) => {
			return (
				id.endsWith('.sol') &&
				!existsSync(`${id}.ts`) &&
				!existsSync(`${id}.d.ts`)
			)
		},
		async resolveId(id, importer) {
			// to handle the case where the import is coming from a node_module or a different workspace
			// we need to always point @evmts/core to the local version
			if (
				id.startsWith('@evmts/core') &&
				!importer?.startsWith(process.cwd()) &&
				!importer?.includes('node_modules')
			) {
				return createRequire(`${process.cwd()}/`).resolve('@evmts/core')
			}
			return null
		},
		async load(id) {
			const resolveBytecode = id.endsWith('.s.sol')

			const { code, modules } = await moduleResolver.resolveEsmModule(
				id,
				process.cwd(),
				false,
				resolveBytecode,
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
