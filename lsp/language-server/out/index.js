"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const language_1 = require("./language");
const volar_service_emmet_1 = require("volar-service-emmet");
const volar_service_html_1 = require("volar-service-html");
const volar_service_css_1 = require("volar-service-css");
const node_1 = require("@volar/language-server/node");
const plugin = () => ({
    extraFileExtensions: [{ extension: 'html1', isMixedContent: true, scriptKind: 7 }],
    resolveConfig(config) {
        // languages
        config.languages ??= {};
        config.languages.html1 ??= language_1.language;
        // services
        config.services ??= {};
        config.services.html ??= (0, volar_service_html_1.default)();
        config.services.css ??= (0, volar_service_css_1.default)();
        config.services.emmet ??= (0, volar_service_emmet_1.default)();
        config.services.html1 ??= (context) => ({
            provideDiagnostics(document) {
                const [file] = context.documents.getVirtualFileByUri(document.uri);
                if (!(file instanceof language_1.Html1File))
                    return;
                const styleNodes = file.htmlDocument.roots.filter(root => root.tag === 'style');
                if (styleNodes.length <= 1)
                    return;
                const errors = [];
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
(0, node_1.startLanguageServer)((0, node_1.createConnection)(), plugin);
//# sourceMappingURL=index.js.map