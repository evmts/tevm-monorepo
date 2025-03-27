import { createConnection, createServer } from '@volar/language-server/node.js'
import { plugin } from './plugin.js'

// Export the plugin for programmatic use
export { plugin as tevmVolarPlugin }

// Create a server for the LSP
export function createLanguageServer() {
  return createServer(
    // Create a connection to communicate with the client
    createConnection(),
    // Initialize the server with the Tevm plugin
    { plugins: [plugin()] }
  )
}

// Start the language server when this file is run directly
if (require.main === module) {
  createLanguageServer()
}