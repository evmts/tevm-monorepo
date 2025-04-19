import { describe, it, expect } from 'vitest'
import path from 'path'
import { resolveImportsJs, resolveImportsRust, processAllFiles } from './resolutions.js'

// Path to our main test fixture
const FIXTURE_DIR = path.join(__dirname)
const MAIN_CONTRACT = path.join(FIXTURE_DIR, 'fixture.sol')

describe('Solidity Import Resolution', () => {
  it('should resolve imports using JavaScript implementation', async () => {
    const result = await resolveImportsJs(MAIN_CONTRACT)
    expect(result).toBeDefined()
    expect(result.length).toBeGreaterThan(0)
    
    // Check for expected import paths
    const importPaths = result.map(imp => imp.original).sort()
    expect(importPaths).toContain('./contracts/Token.sol')
    expect(importPaths).toContain('./contracts/Marketplace.sol')
    expect(importPaths).toContain('./contracts/NFT.sol')
  })
  
  it('should resolve imports using Rust FFI implementation', async () => {
    const result = await resolveImportsRust(MAIN_CONTRACT)
    expect(result).toBeDefined()
    expect(result.length).toBeGreaterThan(0)
    
    // Check for expected import paths
    const importPaths = result.map(imp => imp.original).sort()
    expect(importPaths).toContain('./contracts/Token.sol')
    expect(importPaths).toContain('./contracts/Marketplace.sol')
    expect(importPaths).toContain('./contracts/NFT.sol')
  })
  
  it('should process all Solidity files in the fixture directory', async () => {
    const stats = await processAllFiles()
    expect(stats.fileCount).toBeGreaterThan(1)
    expect(stats.jsImportCount).toBeGreaterThan(0)
    expect(stats.rustImportCount).toBeGreaterThan(0)
    
    // Both implementations should find the same number of imports
    expect(stats.jsImportCount).toBe(stats.rustImportCount)
  })
})