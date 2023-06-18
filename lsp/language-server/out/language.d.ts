import { Language, VirtualFile, FileKind, FileCapabilities } from "@volar/language-core";
import * as html from 'vscode-html-languageservice';
import type * as ts from 'typescript/lib/tsserverlibrary';
export declare const language: Language<Html1File>;
export declare class Html1File implements VirtualFile {
    sourceFileName: string;
    snapshot: ts.IScriptSnapshot;
    kind: FileKind;
    capabilities: FileCapabilities;
    codegenStacks: never[];
    fileName: string;
    mappings: VirtualFile['mappings'];
    embeddedFiles: VirtualFile['embeddedFiles'];
    document: html.TextDocument;
    htmlDocument: html.HTMLDocument;
    constructor(sourceFileName: string, snapshot: ts.IScriptSnapshot);
    update(newSnapshot: ts.IScriptSnapshot): void;
    onSnapshotUpdated(): void;
    addStyleTag(): void;
}
