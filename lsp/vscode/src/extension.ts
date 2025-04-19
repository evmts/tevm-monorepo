import type { InitializationOptions } from '@volar/language-server'
import * as serverProtocol from '@volar/language-server/protocol'
import { activateAutoInsertion, supportLabsVersion, type ExportsInfoForLabs } from '@volar/vscode'
import * as path from 'path'
import * as vscode from 'vscode'
import * as lsp from 'vscode-languageclient/node'

let client: lsp.BaseLanguageClient

/**
 * Activate the Tevm VS Code extension
 * @param context The extension context
 * @returns Export info for Volar Labs (optional)
 */
export async function activate(context: vscode.ExtensionContext) {
  // Configure the server module
  const serverModule = vscode.Uri.joinPath(context.extensionUri, 'dist', 'server.js')
  const runOptions = { execArgv: <string[]>[] }
  const debugOptions = { execArgv: ['--nolazy', `--inspect=${6009}`] }
  
  // Configure server options
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
  
  // Configure initialization options
  const config = vscode.workspace.getConfiguration('tevm')
  const initializationOptions: InitializationOptions = {
    // Provide TypeScript SDK path
    typescript: { 
      tsdk: path.join(vscode.env.appRoot, 'extensions/node_modules/typescript/lib') 
    },
    // Pass extension configuration
    tevm: {
      solcVersion: config.get('solcVersion') as string,
      debug: config.get('debug') as boolean,
    }
  }
  
  // Configure client options
  const clientOptions: lsp.LanguageClientOptions = {
    documentSelector: [
      { scheme: 'file', language: 'javascript' },
      { scheme: 'file', language: 'typescript' },
      { scheme: 'file', language: 'javascriptreact' },
      { scheme: 'file', language: 'typescriptreact' },
      { scheme: 'file', language: 'solidity' },
    ],
    initializationOptions,
    synchronize: {
      // Notify the server about file changes in the workspace
      fileEvents: vscode.workspace.createFileSystemWatcher('**/{*.js,*.ts,*.jsx,*.tsx,*.sol,*.json}')
    }
  }
  
  // Create and start the language client
  client = new lsp.LanguageClient(
    'tevm-language-server',
    'Tevm Language Server',
    serverOptions,
    clientOptions
  )
  
  // Start the client
  await client.start()
  
  // Register template tag support for 'sol' tag in TypeScript/JavaScript files
  const solTagProvider = vscode.languages.registerCompletionItemProvider(
    [
      { scheme: 'file', language: 'javascript' },
      { scheme: 'file', language: 'typescript' },
      { scheme: 'file', language: 'javascriptreact' },
      { scheme: 'file', language: 'typescriptreact' },
    ],
    {
      provideCompletionItems(document, position) {
        const linePrefix = document.lineAt(position).text.substr(0, position.character)
        // Provide the 'sol' template tag
        if (linePrefix.endsWith('sol')) {
          const solCompletion = new vscode.CompletionItem('sol`', vscode.CompletionItemKind.Snippet)
          solCompletion.insertText = new vscode.SnippetString('sol`$1`')
          solCompletion.documentation = new vscode.MarkdownString(
            'Solidity template tag - write Solidity code with syntax highlighting and type checking'
          )
          return [solCompletion]
        }
        return undefined
      }
    },
    '`' // Trigger on backtick character
  )
  
  // Register the completion provider
  context.subscriptions.push(solTagProvider)
  
  // Support for auto close tag
  activateAutoInsertion([client], document => 
    document.languageId === 'solidity' || 
    document.languageId === 'javascript' || 
    document.languageId === 'typescript'
  )
  
  // Support for Volar Labs extension
  return {
    volarLabs: {
      version: supportLabsVersion,
      languageClients: [client],
      languageServerProtocol: serverProtocol,
    },
  } satisfies ExportsInfoForLabs
}

/**
 * Deactivate the extension
 * @returns A promise that resolves when the client is stopped
 */
export function deactivate(): Thenable<any> | undefined {
  return client?.stop()
}