#!/usr/bin/env node

/**
 * Tevm Language Server CLI entry point
 * 
 * This script starts the Tevm language server when run from the command line.
 * It's used by the VS Code extension and can also be used standalone.
 */

// Check for version flag
if (process.argv.includes('--version')) {
  const pkgJSON = require('../package.json')
  console.log(`Tevm Language Server v${pkgJSON.version}`)
} else {
  // Start the language server
  require('../dist/index.js').createLanguageServer()
}