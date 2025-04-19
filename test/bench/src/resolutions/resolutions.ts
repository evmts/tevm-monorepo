import path from 'path'
import { promises as fs } from 'fs'
import { runPromise } from 'effect/Effect'
import { resolveImports } from '@tevm/resolutions'
import { resolutionsRsFfi } from './resolutions-rs-ffi.js'

// Paths to our test fixtures
const FIXTURE_DIR = path.join(__dirname)
const MAIN_CONTRACT = path.join(FIXTURE_DIR, 'fixture.sol')

/**
 * Processes a single Solidity file using JavaScript implementation
 * @param filePath The path to the Solidity file
 * @returns An array of resolved imports
 */
export async function resolveImportsJs(filePath: string) {
  const code = await fs.readFile(filePath, 'utf-8')
  return runPromise(resolveImports(filePath, code, {}, [], false))
}

/**
 * Processes a single Solidity file using Rust implementation
 * @param filePath The path to the Solidity file
 * @returns An array of resolved imports
 */
export async function resolveImportsRust(filePath: string) {
  const code = await fs.readFile(filePath, 'utf-8')
  return resolutionsRsFfi.resolveImports(filePath, code, {}, [])
}

/**
 * Processes all Solidity files in the fixture directory
 * @returns Statistics about the processing
 */
export async function processAllFiles() {
  const files = await loadAllFiles(FIXTURE_DIR)
  const jsResults = []
  const rustResults = []
  
  for (const file of files) {
    jsResults.push(await resolveImportsJs(file))
    rustResults.push(await resolveImportsRust(file))
  }
  
  return {
    fileCount: files.length,
    jsImportCount: jsResults.reduce((acc, res) => acc + res.length, 0),
    rustImportCount: rustResults.reduce((acc, res) => acc + res.length, 0)
  }
}

/**
 * Loads all Solidity files in a directory recursively
 * @param dir The directory to scan
 * @param fileList Accumulator for the file list
 * @returns An array of file paths
 */
async function loadAllFiles(dir: string, fileList: string[] = []): Promise<string[]> {
  const items = await fs.readdir(dir, { withFileTypes: true })
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name)
    
    if (item.isDirectory()) {
      fileList = await loadAllFiles(fullPath, fileList)
    } else if (item.isFile() && item.name.endsWith('.sol')) {
      fileList.push(fullPath)
    }
  }
  
  return fileList
}