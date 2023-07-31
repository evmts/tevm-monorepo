import {
	getScriptKindDecorator,
	getScriptSnapshotDecorator,
	resolveModuleNameLiteralsDecorator,
} from './decorators'
import { createLogger, decorate } from './factories'
import { isSolidity } from './utils'
import { loadConfig } from '@evmts/config'
import type typescript from 'typescript/lib/tsserverlibrary'

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
			return modules.typescript.createLanguageService(
				decorate(
					getScriptKindDecorator,
					resolveModuleNameLiteralsDecorator,
					getScriptSnapshotDecorator,
				)(
					createInfo,
					modules.typescript,
					logger,
					loadConfig(createInfo.project.getCurrentDirectory(), logger),
				),
			)
		},
		getExternalFiles: (project) => {
			return project.getFileNames().filter(isSolidity)
		},
	}
}
