"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Html1File = exports.language = void 0;
const language_core_1 = require("@volar/language-core");
const html = require("vscode-html-languageservice");
exports.language = {
    createVirtualFile(fileName, snapshot) {
        if (fileName.endsWith('.html1')) {
            return new Html1File(fileName, snapshot);
        }
    },
    updateVirtualFile(html1File, snapshot) {
        html1File.update(snapshot);
    },
};
const htmlLs = html.getLanguageService();
class Html1File {
    sourceFileName;
    snapshot;
    kind = language_core_1.FileKind.TextFile;
    capabilities = language_core_1.FileCapabilities.full;
    codegenStacks = [];
    fileName;
    mappings;
    embeddedFiles;
    document;
    htmlDocument;
    constructor(sourceFileName, snapshot) {
        this.sourceFileName = sourceFileName;
        this.snapshot = snapshot;
        this.fileName = sourceFileName + '.html';
        this.onSnapshotUpdated();
    }
    update(newSnapshot) {
        this.snapshot = newSnapshot;
        this.onSnapshotUpdated();
    }
    onSnapshotUpdated() {
        this.mappings = [{
                sourceRange: [0, this.snapshot.getLength()],
                generatedRange: [0, this.snapshot.getLength()],
                data: language_core_1.FileRangeCapabilities.full,
            }];
        this.document = html.TextDocument.create(this.fileName, 'html', 0, this.snapshot.getText(0, this.snapshot.getLength()));
        this.htmlDocument = htmlLs.parseHTMLDocument(this.document);
        this.embeddedFiles = [];
        this.addStyleTag();
    }
    addStyleTag() {
        let i = 0;
        this.htmlDocument.roots.forEach(root => {
            if (root.tag === 'style' && root.startTagEnd !== undefined && root.endTagStart !== undefined) {
                const styleText = this.snapshot.getText(root.startTagEnd, root.endTagStart);
                this.embeddedFiles.push({
                    fileName: this.fileName + `.${i++}.css`,
                    kind: language_core_1.FileKind.TextFile,
                    snapshot: {
                        getText: (start, end) => styleText.substring(start, end),
                        getLength: () => styleText.length,
                        getChangeRange: () => undefined,
                    },
                    mappings: [{
                            sourceRange: [root.startTagEnd, root.endTagStart],
                            generatedRange: [0, styleText.length],
                            data: language_core_1.FileRangeCapabilities.full,
                        }],
                    codegenStacks: [],
                    capabilities: language_core_1.FileCapabilities.full,
                    embeddedFiles: [],
                });
            }
        });
    }
}
exports.Html1File = Html1File;
//# sourceMappingURL=language.js.map