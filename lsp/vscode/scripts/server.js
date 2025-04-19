// Entry point for the language server
// This file is bundled and becomes the server implementation for VS Code
const { createLanguageServer } = require('@tevm/lsp')

// Start the language server
createLanguageServer()