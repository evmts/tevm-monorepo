import { createCache } from '@tevm/bundler-cache'
import { defaultConfig, loadConfig } from '@tevm/config'
import { catchTag, logWarning, map, runSync } from 'effect/Effect'
import type typescript from 'typescript/lib/tsserverlibrary.js'
import { getDefinitionServiceDecorator } from './decorators/getDefinitionAtPosition.js'
import {
	getScriptKindDecorator,
	getScriptSnapshotDecorator,
	resolveModuleNameLiteralsDecorator,
} from './decorators/index.js'
import { createFileAccessObject, createRealFileAccessObject } from './factories/fileAccessObject.js'
import { createLogger, decorateHost } from './factories/index.js'
import { isSolidity } from './utils/index.js'

/**
 * TypeScript server plugin factory that enables Solidity support in TypeScript.
 * This plugin allows direct importing of .sol files in TypeScript with proper
 * type definitions, code navigation, and IDE support.
 *
 * The plugin works by decorating the TypeScript language service to handle
 * Solidity files, compile them with solc, and provide TypeScript definitions.
 *
 * Add to your tsconfig.json:
 * @example
 * ```json
 * {
 *   "compilerOptions": {
 *     "plugins": [{ "name": "tevm-ts-plugin" }]
 *   }
 * }
 * ```
 *
 * @see https://github.com/microsoft/TypeScript/wiki/Writing-a-Language-Service-Plugin
 * @see https://github.com/microsoft/TypeScript/wiki/Writing-a-Language-Service-Plugin#decorator-creation
 */
export const tsPlugin: typescript.server.PluginModuleFactory = (modules) => {
	return {
		create: (createInfo) => {
			const logger = createLogger(createInfo)

			const config = runSync(
				loadConfig(createInfo.project.getCurrentDirectory()).pipe(
					catchTag('FailedToReadConfigError', () =>
						logWarning('Unable to find tevm.config.json. Using default config.').pipe(map(() => defaultConfig)),
					),
				),
			)
			// this fao uses the lsp not the real file system
			const fao = createFileAccessObject(createInfo.languageServiceHost)
			const cache = createCache(
				config.cacheDir,
				// this fao uses real file system
				// TODO we want to handle the case where fs doesn't exist
				createRealFileAccessObject(),
				createInfo.project.getCurrentDirectory(),
			)
			const service = getDefinitionServiceDecorator(
				modules.typescript.createLanguageService(
					decorateHost(getScriptKindDecorator, resolveModuleNameLiteralsDecorator, getScriptSnapshotDecorator(cache))(
						createInfo,
						modules.typescript,
						logger,
						config,
						fao,
					),
				),
				config,
				logger,
				modules.typescript,
				fao,
				cache,
			)

			return service
		},
		getExternalFiles: (project) => {
			return project.getFileNames().filter(isSolidity)
		},
	}
}
