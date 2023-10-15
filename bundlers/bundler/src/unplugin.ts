import packageJson from '../package.json'
import { bundler } from './bundler.js'
import { createCache } from './createCache.js'
import type { FileAccessObject } from './types.js'
import { type ResolvedCompilerConfig, loadConfigAsync } from '@evmts/config'
import { existsSync, readFileSync } from 'fs'
import { readFile } from 'fs/promises'
import { createRequire } from 'module'
import { type UnpluginFactory, createUnplugin } from 'unplugin'
import { z } from 'zod'

const compilerOptionValidator = z
	.enum(['solc', 'foundry'])
	.default('solc')
	.describe('compiler to use.  Defaults to solc')

export type CompilerOption = z.infer<typeof compilerOptionValidator>

const bundlers = {
	solc: bundler,
}

// make a function with this signature
export const unpluginFn: UnpluginFactory<
	{ compiler?: CompilerOption } | undefined,
	false
> = (options = {}) => {
	let config: ResolvedCompilerConfig

	// for current release we will hardcode this to solc
	const parsedCompilerOption = compilerOptionValidator.safeParse(
		options.compiler,
	)
	if (!parsedCompilerOption.success) {
		throw new Error(
			`Invalid compiler option: ${options.compiler}.  Valid options are 'solc' and 'foundry'`,
		)
	}
	const compilerOption = parsedCompilerOption.data

	if (compilerOption === 'foundry') {
		throw new Error(
			'We have abandoned the foundry option despite supporting it in the past. Please use solc instead. Foundry will be added back as a compiler at a later time.',
		)
	}
	const bundler = bundlers[compilerOption]
	let moduleResolver: ReturnType<typeof bundler>

	const fao: FileAccessObject = {
		existsSync,
		readFile,
		readFileSync,
	}

	const solcCache = createCache(console)

	return {
		name: '@evmts/rollup-plugin',
		version: packageJson.version,
		async buildStart() {
			config = await loadConfigAsync(process.cwd())
			moduleResolver = bundler(config, console, fao, solcCache)
			this.addWatchFile('./tsconfig.json')
		},
		async resolveId(id, importer, options) {
			// to handle the case where the import is coming from a node_module or a different workspace
			// we need to always point @evmts/core to the local version
			if (
				id.startsWith('@evmts/core') &&
				!importer?.startsWith(process.cwd()) &&
				!importer?.includes('node_modules')
			) {
				console.log({ id, importer, options })
				return createRequire(`${process.cwd()}/`).resolve('@evmts/core')
			}
			return null
		},
		async load(id: string) {
			if (!id.endsWith('.sol')) {
				return
			}
			if (existsSync(`${id}.ts`)) {
				return
			}
			if (existsSync(`${id}.d.ts`)) {
				return
			}
			const { code, modules } = await moduleResolver.resolveEsmModule(
				id,
				process.cwd(),
				false,
			)
			Object.values(modules).forEach((module) => {
				if (module.id.includes('node_modules')) {
					return
				}
				this.addWatchFile(module.id)
			})
			return code
		},
	} as const
}

const evmtsUnplugin = createUnplugin(unpluginFn)

// Hacks to make types portable
// we should manually type these at some point

export const vitePluginEvmts =
	evmtsUnplugin.vite as any as typeof evmtsUnplugin.rollup
export const rollupPluginEvmts = evmtsUnplugin.rollup
export const esbuildPluginEvmts = evmtsUnplugin.esbuild
export const webpackPluginEvmts =
	evmtsUnplugin.webpack as typeof evmtsUnplugin.rspack

export const rspackPluginEvmts = evmtsUnplugin.rspack
