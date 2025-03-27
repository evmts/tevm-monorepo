import type { LanguageServerPlugin } from '@volar/language-server/node.js'
import { ScriptKind } from 'typescript/lib/tsserverlibrary.js'
import { create as createTsService } from 'volar-service-typescript'
import { solidityLanguage } from './language.js'
import { createSolidityService } from './service/solidityService.js'

/**
 * Tevm Volar Language Server Plugin
 * 
 * This plugin provides the following features for Solidity files:
 * 1. TypeScript typings for imported Solidity contracts
 * 2. Go-to-definition support to navigate to Solidity functions/events
 * 3. Embedded TypeScript support via sol`` template tag
 */
export const plugin: LanguageServerPlugin = () => {
  return {
    // Register .sol extension
    extraFileExtensions: [
      {
        extension: 'sol',
        isMixedContent: false,
        scriptKind: ScriptKind.Deferred,
      },
    ],
    
    // Watch for changes in these file types
    watchFileExtensions: ['sol', 'js', 'ts', 'tsx', 'jsx', 'json'],
    
    // Configure language services
    resolveConfig(config) {
      // Register Solidity language
      config.languages ??= {}
      config.languages.sol ??= solidityLanguage
      
      // Register services
      config.services ??= {}
      
      // Solidity service handles diagnostics, hover info, etc.
      config.services.sol ??= createSolidityService()
      
      // TypeScript service with Solidity support
      config.services.typescript ??= createTsService({
        // Support `sol` template literal tag
        templateTags: ['sol'],
        
        // Enable TypeScript features
        completionForSolidity: true,
        diagnosticsForSolidity: true,
        
        // Configure the language service
        configureLanguageService: (ts, service) => {
          const baseGetDefinitionAtPosition = service.getDefinitionAtPosition.bind(service)
          
          // Enhance getDefinitionAtPosition to support .sol files
          service.getDefinitionAtPosition = (fileName, position) => {
            // Call original implementation first
            const definitions = baseGetDefinitionAtPosition(fileName, position)
            
            // Process Solidity-specific definitions (if needed)
            // Implementation will be added in a separate file
            
            return definitions
          }
          
          return service
        }
      })
      
      return config
    },
  }
}