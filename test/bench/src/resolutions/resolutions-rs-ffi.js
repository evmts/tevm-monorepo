// Import the actual FFI implementation from '@tevm/resolutions-rs'
// In a real project, this would use:
// import { resolveImports, processModule, moduleFactory } from '@tevm/resolutions-rs'

// For our benchmark, we'll try to load the library directly, and if it fails, 
// we'll fall back to a simulated implementation

// First try to import directly from the compiled library
export let isUsingNativeModule = false
let nativeResolveImports
let nativeProcessModule
let nativeModuleFactory

try {
  // Use dynamic import to avoid errors if the module isn't compiled yet
  const module = await import('../../../bundler-packages/resolutions-rs')
  nativeResolveImports = module.resolveImports
  nativeProcessModule = module.processModule
  nativeModuleFactory = module.moduleFactory
  isUsingNativeModule = true
  console.log('Successfully loaded native @tevm/resolutions-rs module')
} catch (error) {
  console.warn('Could not load native @tevm/resolutions-rs module, using simulation', error.message)
  // We'll use the simulation implementation if the native module fails to load
}

/**
 * Wrapper class for the Rust implementation to use in benchmarks
 */
class ResolutionsRS {
  /**
   * Resolves imports for a Solidity file using the Rust implementation
   * @param {string} absolutePath - The absolute path to the Solidity file
   * @param {string} code - The Solidity code
   * @param {Record<string, string>} remappings - Remappings for import paths
   * @param {Array<string>} libs - Libraries to include in the resolution
   * @returns {Promise<Array<{original: string, absolute: string, updated: string}>>} - Resolved imports
   */
  async resolveImports(absolutePath, code, remappings = {}, libs = []) {
    // If we have the native module, use it
    if (isUsingNativeModule) {
      try {
        return await nativeResolveImports(absolutePath, code, remappings, libs)
      } catch (error) {
        console.error('Error in native resolveImports:', error)
        // Fall back to simulation
      }
    }
    
    // Simulation implementation as fallback
    try {
      // Extract imports using regex
      const importRegEx = /^\s?import\s+[^'"]*['"](.*)['"]\s*/gm
      const imports = []
      let foundImport = importRegEx.exec(code)
      
      while (foundImport != null) {
        const importPath = foundImport[1]
        if (!importPath) {
          throw new Error('Import does not exist')
        }
        
        // Resolve the import path
        const resolvedPath = await this.resolveImportPath(absolutePath, importPath, remappings, libs)
        
        imports.push({
          original: importPath,
          absolute: resolvedPath,
          updated: resolvedPath,
        })
        
        foundImport = importRegEx.exec(code)
      }
      
      return imports
    } catch (error) {
      console.error('Error in simulated resolveImports:', error)
      return []
    }
  }
  
  /**
   * Process a module to get its imports and transformed code
   * @param {string} absolutePath - The absolute path to the file
   * @param {string} code - The source code
   * @param {Record<string, string>} remappings - Remappings for import paths
   * @param {Array<string>} libs - Libraries to include in the resolution
   * @returns {Promise<{code: string, imported_ids: string[]}>} - Module information
   */
  async processModule(absolutePath, code, remappings = {}, libs = []) {
    // If we have the native module, use it
    if (isUsingNativeModule) {
      try {
        return await nativeProcessModule(absolutePath, code, remappings, libs)
      } catch (error) {
        console.error('Error in native processModule:', error)
        // Fall back to simulation
      }
    }
    
    // Simulation implementation as fallback
    try {
      const imports = await this.resolveImports(absolutePath, code, remappings, libs)
      
      return {
        code,
        imported_ids: imports.map(imp => imp.absolute)
      }
    } catch (error) {
      console.error('Error in simulated processModule:', error)
      return {
        code,
        imported_ids: []
      }
    }
  }

  /**
   * Processes a module and all its dependencies to create a complete module map
   * @param {string} absolutePath - The absolute path to the Solidity file
   * @param {string} code - The Solidity code
   * @param {Record<string, string>} remappings - Remappings for import paths
   * @param {Array<string>} libs - Libraries to include in the resolution
   * @returns {Promise<Map<string, {id: string, code: string, rawCode: string, importedIds: string[]}>>} - Module map
   */
  async moduleFactory(absolutePath, code, remappings = {}, libs = []) {
    // If we have the native module, use it
    if (isUsingNativeModule) {
      try {
        const result = await nativeModuleFactory(absolutePath, code, remappings, libs)
        // Convert result to Map if it's not already (handle potential format differences)
        return result instanceof Map ? result : new Map(Object.entries(result))
      } catch (error) {
        console.error('Error in native moduleFactory:', error)
        // Fall back to simulation
      }
    }
    
    // Simulation implementation for module factory
    try {
      const fs = await import('fs/promises')
      const path = await import('path')
      
      // Create a Map to store processed modules
      const moduleMap = new Map()
      // Track visited modules to prevent infinite recursion with circular dependencies
      const visited = new Set()
      
      // Process a module and its imports recursively
      const processModuleRecursive = async (currentPath, currentCode) => {
        // Skip if already processed
        if (visited.has(currentPath)) {
          return
        }
        
        visited.add(currentPath)
        
        // Resolve imports for the current module
        const imports = await this.resolveImports(currentPath, currentCode, remappings, libs)
        
        // Add the module to our map
        moduleMap.set(currentPath, {
          id: currentPath,
          code: currentCode,
          rawCode: currentCode,
          importedIds: imports.map(imp => imp.absolute)
        })
        
        // Process all imports recursively
        for (const importFile of imports) {
          try {
            const importCode = await fs.readFile(importFile.absolute, 'utf8')
            await processModuleRecursive(importFile.absolute, importCode)
          } catch (err) {
            console.error(`Error processing import ${importFile.absolute}:`, err)
          }
        }
      }
      
      // Start processing from the entry point
      await processModuleRecursive(absolutePath, code)
      
      return moduleMap
    } catch (error) {
      console.error('Error in simulated moduleFactory:', error)
      return new Map()
    }
  }

  /**
   * Helper method for resolving import paths (used in simulation)
   * @private
   */
  async resolveImportPath(absolutePath, importPath, remappings = {}, libs = []) {
    const path = await import('path')
    const baseDir = path.dirname(absolutePath)
    
    // Apply remappings
    for (const [prefix, target] of Object.entries(remappings)) {
      if (importPath.startsWith(prefix)) {
        const remappedPath = path.join(target, importPath.slice(prefix.length))
        return remappedPath
      }
    }
    
    // Handle relative imports
    if (importPath.startsWith('./') || importPath.startsWith('../')) {
      return path.resolve(baseDir, importPath)
    }
    
    // Try searching in lib directories
    for (const lib of libs) {
      const libPath = path.join(lib, importPath)
      return libPath
    }
    
    // Default fallback
    return path.resolve(baseDir, importPath)
  }
}

// Export a singleton instance for the benchmark
export const resolutionsRsFfi = new ResolutionsRS()