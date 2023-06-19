import { DiagnosticModel, InitializationOptions } from '@volar/language-server'
import { activateAutoInsertion } from '@volar/vscode'
import * as vscode from 'vscode'
import * as lsp from 'vscode-languageclient/node'

let client: lsp.BaseLanguageClient

export async function activate(context: vscode.ExtensionContext) {
	const serverModule = vscode.Uri.joinPath(
		context.extensionUri,
		'dist',
		'server.js',
	)
	const runOptions = { execArgv: <string[]>[] }
	const debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] }
	const serverOptions: lsp.ServerOptions = {
		run: {
			module: serverModule.fsPath,
			transport: lsp.TransportKind.ipc,
			options: runOptions,
		},
		debug: {
			module: serverModule.fsPath,
			transport: lsp.TransportKind.ipc,
			options: debugOptions,
		},
	}
	const initializationOptions: InitializationOptions = {
		// no need tsdk because language server do not have typescript features
		// typescript: { tsdk: require('path').join(vscode.env.appRoot, 'extensions/node_modules/typescript/lib') },
		diagnosticModel: DiagnosticModel.Pull,
	}
	const clientOptions: lsp.LanguageClientOptions = {
		documentSelector: [{ language: 'sol' }],
		initializationOptions,
	}
	client = new lsp.LanguageClient(
		'evmts-language-server',
		'EVMts Language Server',
		serverOptions,
		clientOptions,
	)
	await client.start()

	// support for auto close tag
	activateAutoInsertion([client], (document) => document.languageId === 'sol')
}

export function deactivate(): Thenable<any> | undefined {
	return client?.stop()
}
