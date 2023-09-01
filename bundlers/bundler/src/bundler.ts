import { generateDtsBody } from './runtime/generateEvmtsBodyDts'
import { generateRuntime } from './runtime/generateRuntime'
import { generateRuntimeSync } from './runtime/generateRuntimeSync'
import { resolveArtifacts, resolveArtifactsSync } from './solc'
import type { Bundler } from './types'
// TODO wrap this in a typesafe version
// @ts-ignore
import solc from 'solc'

export const bundler: Bundler = (config, logger) => {
	return {
		name: bundler.name,
		config,
		resolveDts: async (modulePath, basedir, includeAst) => {
			const { artifacts, modules } = await resolveArtifacts(
				modulePath,
				basedir,
				logger,
				config,
				includeAst,
			)
			if (artifacts) {
				const evmtsImports = `import { EvmtsContract } from '@evmts/core'`
				const evmtsBody = generateDtsBody(artifacts, config)
				return { code: [evmtsImports, evmtsBody].join('\n'), modules }
			}
			return { code: '', modules }
		},
		resolveDtsSync: (modulePath, basedir, includeAst) => {
			const { artifacts, modules } = resolveArtifactsSync(
				modulePath,
				basedir,
				logger,
				config,
				includeAst,
			)
			if (artifacts) {
				const evmtsImports = `import { EvmtsContract } from '@evmts/core'`
				const evmtsBody = generateDtsBody(artifacts, config)
				return { modules, code: [evmtsImports, evmtsBody].join('\n') }
			}
			return { modules, code: '' }
		},
		resolveTsModuleSync: (modulePath, basedir, includeAst) => {
			const { artifacts, modules } = resolveArtifactsSync(
				modulePath,
				basedir,
				logger,
				config,
				includeAst,
			)
			const code = generateRuntimeSync(artifacts, config, 'ts', logger)
			return { code, modules }
		},
		resolveTsModule: async (modulePath, basedir, includeAst) => {
			const { artifacts, modules } = await resolveArtifacts(
				modulePath,
				basedir,
				logger,
				config,
				includeAst,
			)
			const code = await generateRuntime(artifacts, config, 'ts', logger)
			return { code, modules }
		},
		resolveCjsModuleSync: (modulePath, basedir, includeAst) => {
			const { artifacts, modules } = resolveArtifactsSync(
				modulePath,
				basedir,
				logger,
				config,
				includeAst,
			)
			const code = generateRuntimeSync(artifacts, config, 'cjs', logger)
			return { code, modules }
		},
		resolveCjsModule: async (modulePath, basedir, includeAst) => {
			const { artifacts, modules } = await resolveArtifacts(
				modulePath,
				basedir,
				logger,
				config,
				includeAst,
			)
			const code = await generateRuntime(artifacts, config, 'cjs', logger)
			return { code, modules }
		},
		resolveEsmModuleSync: (modulePath, basedir, includeAst) => {
			const { artifacts, modules } = resolveArtifactsSync(
				modulePath,
				basedir,
				logger,
				config,
				includeAst,
			)
			const code = generateRuntimeSync(artifacts, config, 'mjs', logger)
			return { code, modules }
		},
		resolveEsmModule: async (modulePath, basedir, includeAst) => {
			const { artifacts, modules } = await resolveArtifacts(
				modulePath,
				basedir,
				logger,
				config,
				includeAst,
			)
			const code = await generateRuntime(artifacts, config, 'mjs', logger)
			return { code, modules }
		},
	}
}
