"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var language_1 = require("./language");
var volar_service_emmet_1 = require("volar-service-emmet");
var volar_service_html_1 = require("volar-service-html");
var volar_service_css_1 = require("volar-service-css");
var node_1 = require("@volar/language-server/node");
var plugin = function () { return ({
    extraFileExtensions: [{ extension: 'html1', isMixedContent: true, scriptKind: 7 }],
    resolveConfig: function (config) {
        var _a, _b, _c, _d, _e, _f, _g;
        var _h, _j, _k, _l, _m;
        // languages
        (_a = config.languages) !== null && _a !== void 0 ? _a : (config.languages = {});
        (_b = (_h = config.languages).html1) !== null && _b !== void 0 ? _b : (_h.html1 = language_1.language);
        // services
        (_c = config.services) !== null && _c !== void 0 ? _c : (config.services = {});
        (_d = (_j = config.services).html) !== null && _d !== void 0 ? _d : (_j.html = (0, volar_service_html_1.default)());
        (_e = (_k = config.services).css) !== null && _e !== void 0 ? _e : (_k.css = (0, volar_service_css_1.default)());
        (_f = (_l = config.services).emmet) !== null && _f !== void 0 ? _f : (_l.emmet = (0, volar_service_emmet_1.default)());
        (_g = (_m = config.services).html1) !== null && _g !== void 0 ? _g : (_m.html1 = function (context) { return ({
            provideDiagnostics: function (document) {
                var file = context.documents.getVirtualFileByUri(document.uri)[0];
                if (!(file instanceof language_1.Html1File))
                    return;
                var styleNodes = file.htmlDocument.roots.filter(function (root) { return root.tag === 'style'; });
                if (styleNodes.length <= 1)
                    return;
                var errors = [];
                for (var i = 1; i < styleNodes.length; i++) {
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
        }); });
        return config;
    },
}); };
(0, node_1.startLanguageServer)((0, node_1.createConnection)(), plugin);
