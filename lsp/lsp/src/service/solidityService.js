import { bundler, createCache } from '@tevm/base-bundler'
import { defaultConfig, loadConfig } from '@tevm/config'
import { catchTag, logWarning, map, runSync } from 'effect/Effect'
import { existsSync, readFileSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
// @ts-expect-error
import solc from 'solc'

/**
 * Create a service for Solidity files
 * 
 * This service provides:
 * - Diagnostics for Solidity compilation errors
 * - Hover information for Solidity symbols
 * - Completion suggestions for Solidity code
 * 
 * @returns {object} The Solidity service
 */
export function createSolidityService() {
  return (context) => {
    // Get configuration
    const config = runSync(
      loadConfig(process.cwd()).pipe(
        catchTag('FailedToReadConfigError', () =>
          logWarning('Unable to find tevm.config.json. Using default config.').pipe(map(() => defaultConfig)),
        ),
      ),
    )
    
    // Create file access object
    const fileAccessObject = {
      existsSync,
      readFile,
      readFileSync,
    }
    
    // Create cache
    const cache = createCache(
      config.cacheDir,
      fileAccessObject,
      process.cwd(),
    )
    
    // Create bundler
    const tevmBundler = bundler(
      config,
      console,
      fileAccessObject,
      solc,
      cache,
    )
    
    return {
      /**
       * Provide diagnostics for Solidity files
       * @param {object} document - The document to analyze
       * @returns {Array} Array of diagnostics
       */
      provideDiagnostics(document) {
        try {
          // Use bundler to get compilation results
          const result = tevmBundler.resolveDtsSync(
            document.uri, 
            process.cwd(), 
            false, 
            false
          )
          
          // If we have errors from the bundler, convert them to diagnostics
          if (result.errors && result.errors.length > 0) {
            return result.errors.map(error => {
              // Convert Solidity error to LSP diagnostic
              // This is a simplified implementation
              return {
                range: {
                  start: { line: 0, character: 0 },
                  end: { line: 0, character: 0 },
                },
                severity: 1, // Error
                message: error.message || 'Solidity compilation error',
                source: 'tevm',
              }
            })
          }
          
          return []
        } catch (error) {
          console.error('Error providing diagnostics:', error)
          
          // Return a generic error diagnostic
          return [{
            range: {
              start: { line: 0, character: 0 },
              end: { line: 0, character: 0 },
            },
            severity: 1, // Error
            message: `Error compiling Solidity: ${error.message || 'Unknown error'}`,
            source: 'tevm',
          }]
        }
      },
      
      /**
       * Provide hover information for Solidity symbols
       * @param {object} document - The document being hovered
       * @param {object} position - The position being hovered
       * @returns {object|null} Hover information or null
       */
      provideHover(document, position) {
        // This would require parsing the Solidity AST and finding the symbol at position
        // For now, we'll return a simple implementation
        return null
      },
      
      /**
       * Provide completion items for Solidity code
       * @param {object} document - The document
       * @param {object} position - The position
       * @returns {Array} Array of completion items
       */
      provideCompletionItems(document, position) {
        // This would require analyzing the Solidity code to provide smart completions
        // For now, we'll return an empty array
        return []
      },
      
      /**
       * Provide definition locations for Solidity symbols
       * @param {object} document - The document
       * @param {object} position - The position
       * @returns {Array|null} Array of definition locations or null
       */
      provideDefinition(document, position) {
        // This would require analyzing the Solidity AST to find definitions
        // For now, we'll return null
        return null
      }
    }
  }
}