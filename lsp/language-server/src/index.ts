import { language, Html1File } from './language';
import createEmmetService from 'volar-service-emmet';
import createHtmlService from 'volar-service-html';
import createCssService from 'volar-service-css';
import { createConnection, startLanguageServer, LanguageServerPlugin, Diagnostic, Service } from '@volar/language-server/node';

const plugin: LanguageServerPlugin = (): ReturnType<LanguageServerPlugin> => ({
	extraFileExtensions: [{ extension: 'html1', isMixedContent: true, scriptKind: 7 }],
	resolveConfig(config) {

		// languages
		config.languages ??= {};
		config.languages.html1 ??= language;

		// services
		config.services ??= {};
		config.services.html ??= createHtmlService();
		config.services.css ??= createCssService();
		config.services.emmet ??= createEmmetService();
		config.services.html1 ??= (context): ReturnType<Service> => ({
			provideDiagnostics(document) {

				const [file] = context!.documents.getVirtualFileByUri(document.uri);
				if (!(file instanceof Html1File)) return;

				const styleNodes = file.htmlDocument.roots.filter(root => root.tag === 'style');
				if (styleNodes.length <= 1) return;

				const errors: Diagnostic[] = [];
				for (let i = 1; i < styleNodes.length; i++) {
					errors.push({
						severity: 2,
						range: {
							start: file.document.positionAt(styleNodes[i].start),
							end: file.document.positionAt(styleNodes[i].end),
						},
						source: 'html1',
						message: 'Only one style tag is allowed.',
					});
				}
				return errors;
			},
		});

		return config;
	},
});

startLanguageServer(createConnection(), plugin);
