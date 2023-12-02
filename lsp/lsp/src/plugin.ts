import { language } from './language.js'
import { type LanguageServerPlugin } from '@volar/language-server/node.js'
import { ScriptKind } from 'typescript/lib/tsserverlibrary.js'
import { create as createTsService } from 'volar-service-typescript'

export const plugin: LanguageServerPlugin = () => {
	return {
		extraFileExtensions: [
			{
				extension: 'sol',
				isMixedContent: false,
				scriptKind: ScriptKind.Deferred,
			},
		],
		watchFileExtensions: ['sol', 'js', 'ts', 'tsx', 'jsx', 'json'],
		resolveConfig(config) {
			// languages
			config.languages ??= {}
			config.languages['sol'] ??= language

			// services
			config.services ??= {}
			config.services['sol'] ??= (context) => ({
				provideDiagnostics(document) {
					console.log(document, context)
					return []
				},
			})
			config.services['typescript'] ??= createTsService()

			return config
		},
	}
}
