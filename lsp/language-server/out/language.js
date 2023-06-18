"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Html1File = exports.language = void 0;
var language_core_1 = require("@volar/language-core");
var html = require("vscode-html-languageservice");
exports.language = {
    createVirtualFile: function (fileName, snapshot) {
        if (fileName.endsWith('.html1')) {
            return new Html1File(fileName, snapshot);
        }
    },
    updateVirtualFile: function (html1File, snapshot) {
        html1File.update(snapshot);
    },
};
var htmlLs = html.getLanguageService();
var Html1File = /** @class */ (function () {
    function Html1File(sourceFileName, snapshot) {
        this.sourceFileName = sourceFileName;
        this.snapshot = snapshot;
        this.kind = language_core_1.FileKind.TextFile;
        this.capabilities = language_core_1.FileCapabilities.full;
        this.codegenStacks = [];
        this.fileName = sourceFileName + '.html';
        this.onSnapshotUpdated();
    }
    Html1File.prototype.update = function (newSnapshot) {
        this.snapshot = newSnapshot;
        this.onSnapshotUpdated();
    };
    Html1File.prototype.onSnapshotUpdated = function () {
        this.mappings = [{
                sourceRange: [0, this.snapshot.getLength()],
                generatedRange: [0, this.snapshot.getLength()],
                data: language_core_1.FileRangeCapabilities.full,
            }];
        this.document = html.TextDocument.create(this.fileName, 'html', 0, this.snapshot.getText(0, this.snapshot.getLength()));
        this.htmlDocument = htmlLs.parseHTMLDocument(this.document);
        this.embeddedFiles = [];
        this.addStyleTag();
    };
    Html1File.prototype.addStyleTag = function () {
        var _this = this;
        var i = 0;
        this.htmlDocument.roots.forEach(function (root) {
            if (root.tag === 'style' && root.startTagEnd !== undefined && root.endTagStart !== undefined) {
                var styleText_1 = _this.snapshot.getText(root.startTagEnd, root.endTagStart);
                _this.embeddedFiles.push({
                    fileName: _this.fileName + ".".concat(i++, ".css"),
                    kind: language_core_1.FileKind.TextFile,
                    snapshot: {
                        getText: function (start, end) { return styleText_1.substring(start, end); },
                        getLength: function () { return styleText_1.length; },
                        getChangeRange: function () { return undefined; },
                    },
                    mappings: [{
                            sourceRange: [root.startTagEnd, root.endTagStart],
                            generatedRange: [0, styleText_1.length],
                            data: language_core_1.FileRangeCapabilities.full,
                        }],
                    codegenStacks: [],
                    capabilities: language_core_1.FileCapabilities.full,
                    embeddedFiles: [],
                });
            }
        });
    };
    return Html1File;
}());
exports.Html1File = Html1File;
