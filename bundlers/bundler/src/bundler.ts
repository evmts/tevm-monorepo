import { generateDtsBody } from './runtime/generateEvmtsBodyDts'
import { generateRuntime } from './runtime/generateRuntime'
import { generateRuntimeSync } from './runtime/generateRuntimeSync'
import { resolveArtifacts, resolveArtifactsSync } from './solc'
import type { Bundler } from './types'
import { checkSolcVersion } from './utils/checkSolcVersion'
// TODO wrap this in a typesafe version
// @ts-ignore
import solc from 'solc'

export const bundler: Bundler = (config, logger) => {
	checkSolcVersion(config, logger, solc.version)
	return {
		name: bundler.name,
		config,
		resolveDts: async (module, basedir) => {
			const { artifacts, modules } = await resolveArtifacts(
				module,
				basedir,
				logger,
				config,
			)
			if (artifacts) {
				const evmtsImports = `import { EvmtsContract } from '@evmts/core'`
				const evmtsBody = generateDtsBody(artifacts, config)
				return { code: [evmtsImports, evmtsBody].join('\n'), modules }
			}
			return { code: '', modules }
		},
		resolveDtsSync: (module, basedir) => {
			const { artifacts, modules } = resolveArtifactsSync(
				module,
				basedir,
				logger,
				config,
			)
			if (artifacts) {
				const evmtsImports = `import { EvmtsContract } from '@evmts/core'`
				const evmtsBody = generateDtsBody(artifacts, config)
				return { modules, code: [evmtsImports, evmtsBody].join('\n') }
			}
			return { modules, code: '' }
		},
		resolveTsModuleSync: (module, basedir) => {
			return generateRuntimeSync(
				module,
				basedir,
				'evmtsContractFactory',
				config,
				logger,
				'ts',
			)
		},
		resolveTsModule: async (module, basedir) => {
			return generateRuntime(
				module,
				basedir,
				'evmtsContractFactory',
				config,
				logger,
				'ts',
			)
		},
		resolveCjsModuleSync: (module, basedir) => {
			return generateRuntimeSync(
				module,
				basedir,
				'evmtsContractFactory',
				config,
				logger,
				'cjs',
			)
		},
		resolveCjsModule: async (module, basedir) => {
			return generateRuntime(
				module,
				basedir,
				'evmtsContractFactory',
				config,
				logger,
				'cjs',
			)
		},
		resolveEsmModuleSync: (module, basedir) => {
			return generateRuntimeSync(
				module,
				basedir,
				'evmtsContractFactory',
				config,
				logger,
				'mjs',
			)
		},
		resolveEsmModule: async (module, basedir) => {
			return generateRuntime(
				module,
				basedir,
				'evmtsContractFactory',
				config,
				logger,
				'mjs',
			)
		},
	}
}
