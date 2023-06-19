import { SolidityFile, language } from './language'
import {
	Diagnostic,
	LanguageServerPlugin,
	Service,
	createConnection,
	startLanguageServer,
} from '@volar/language-server/node'
import createCssService from 'volar-service-css'
import createEmmetService from 'volar-service-emmet'
import createHtmlService from 'volar-service-html'

const plugin: LanguageServerPlugin = (): ReturnType<LanguageServerPlugin> => ({
	extraFileExtensions: [
		{ extension: 'sol', isMixedContent: true, scriptKind: 7 },
	],
	resolveConfig(config) {
		// languages
		config.languages ??= {}
		config.languages.sol ??= language

		// services
		config.services ??= {}
		config.services.html ??= createHtmlService()
		config.services.css ??= createCssService()
		config.services.emmet ??= createEmmetService()
		config.services.sol ??= (context): ReturnType<Service> => ({
			provideDiagnostics(document) {
				if (!context) {
					throw new Error('No context foundnew')
				}

				const [file] = context.documents.getVirtualFileByUri(document.uri)
				if (!(file instanceof SolidityFile)) return

				const styleNodes = file.htmlDocument.roots.filter(
					(root) => root.tag === 'style',
				)
				if (styleNodes.length <= 1) return

				const errors: Diagnostic[] = []
				for (let i = 1; i < styleNodes.length; i++) {
					errors.push({
						severity: 2,
						range: {
							start: file.document.positionAt(styleNodes[i].start),
							end: file.document.positionAt(styleNodes[i].end),
						},
						source: 'sol',
						message: 'Only one style tag is allowed.',
					})
				}
				return errors
			},
		})

		return config
	},
})

startLanguageServer(createConnection(), plugin)
