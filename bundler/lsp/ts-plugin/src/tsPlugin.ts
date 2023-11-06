import { getDefinitionServiceDecorator } from './decorators/getDefinitionAtPosition.js'
import {
	getScriptKindDecorator,
	getScriptSnapshotDecorator,
	resolveModuleNameLiteralsDecorator,
} from './decorators/index.js'
import { createFileAccessObject } from './factories/fileAccessObject.js'
import { createLogger, decorateHost } from './factories/index.js'
import { isSolidity } from './utils/index.js'
import { createCache } from '@evmts/base'
import { loadConfig } from '@evmts/config'
import { runSync } from 'effect/Effect'
import typescript from 'typescript/lib/tsserverlibrary.js'

/**
 * [Typescript plugin factory](https://github.com/microsoft/TypeScript/wiki/Writing-a-Language-Service-Plugin)
 * @example
 * ```json
 * {
 *   "plugins": [{ "name": "evmts-ts-plugin"}]
 * }
 * @see https://github.com/microsoft/TypeScript/wiki/Writing-a-Language-Service-Plugin#decorator-creation
 */
export const tsPlugin: typescript.server.PluginModuleFactory = (modules) => {
	return {
		create: (createInfo) => {
			const logger = createLogger(createInfo)
			const snapshotSolcCache = createCache(logger)
			const definitionSolcCache = createCache(logger)
			const config = runSync(
				loadConfig(createInfo.project.getCurrentDirectory()),
			)
			const fao = createFileAccessObject(createInfo.languageServiceHost)
			const service = getDefinitionServiceDecorator(
				modules.typescript.createLanguageService(
					decorateHost(
						getScriptKindDecorator,
						resolveModuleNameLiteralsDecorator,
						getScriptSnapshotDecorator(snapshotSolcCache),
					)(createInfo, modules.typescript, logger, config, fao),
				),
				config,
				logger,
				modules.typescript,
				fao,
				definitionSolcCache,
			)

			return service
		},
		getExternalFiles: (project) => {
			return project.getFileNames().filter(isSolidity)
		},
	}
}
