import { beforeEach, describe, expect, it, vi } from 'vitest'
import { runPromise } from 'effect/Effect'
import { loadRemappings } from './loadRemappingstxt.js'
import * as fs from 'node:fs'

// Mock fs readFileSync
vi.mock('node:fs', () => ({
  readFileSync: vi.fn(),
  existsSync: vi.fn(),
}))

describe('loadRemappings', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should handle empty remappings file', async () => {
    vi.mocked(fs.readFileSync).mockReturnValueOnce('  \n  ')

    const result = await runPromise(loadRemappings('/path/to/config'))
    expect(result).toEqual({})
  })

  it('should parse valid remappings', async () => {
    vi.mocked(fs.readFileSync).mockReturnValueOnce('@openzeppelin/=lib/openzeppelin/\n@solmate/=lib/solmate/src/')

    const result = await runPromise(loadRemappings('/path/to/config'))
    expect(result).toEqual({
      remappings: {
        '@openzeppelin/': '/path/to/config/lib/openzeppelin/',
        '@solmate/': '/path/to/config/lib/solmate/src/',
      },
    })
  })

  it('should handle remappings with empty lines', async () => {
    vi.mocked(fs.readFileSync).mockReturnValueOnce('@openzeppelin/=lib/openzeppelin/\n\n@solmate/=lib/solmate/src/')

    const result = await runPromise(loadRemappings('/path/to/config'))
    
    // Check that we have both remappings
    expect(result).toHaveProperty('remappings.@openzeppelin/')
    expect(result).toHaveProperty('remappings.@solmate/')
    expect(result.remappings?.['@openzeppelin/']).toContain('/path/to/config/lib/openzeppelin/')
    expect(result.remappings?.['@solmate/']).toContain('/path/to/config/lib/solmate/src/')
  })

  it('should throw InvalidRemappingsError for invalid remapping format', async () => {
    vi.mocked(fs.readFileSync).mockReturnValueOnce('@openzeppelin/lib/openzeppelin/\n@solmate/=lib/solmate/src/')

    await expect(runPromise(loadRemappings('/path/to/config'))).rejects.toThrow('Invalid remapping @openzeppelin/lib/openzeppelin/')
  })

  it('should return empty object when remappings file does not exist', async () => {
    vi.mocked(fs.readFileSync).mockImplementationOnce(() => {
      throw new Error('ENOENT')
    })

    const result = await runPromise(loadRemappings('/path/to/config'))
    expect(result).toEqual({})
  })
  
  it('should handle Windows paths in remappings', async () => {
    vi.mocked(fs.readFileSync).mockReturnValueOnce('@openzeppelin/=lib\\windows\\path\\')

    // On Windows, paths may use backslashes
    const result = await runPromise(loadRemappings('C:\\path\\to\\config'))
    
    expect(result).toHaveProperty('remappings.@openzeppelin/')
    // Windows path handling should be correctly adjusted in the implementation
    expect(result.remappings?.['@openzeppelin/']).toBeDefined()
  })

  it('should handle remappings with paths starting with slash', async () => {
    vi.mocked(fs.readFileSync).mockReturnValueOnce('@openzeppelin/=/absolute/path/lib/openzeppelin/')

    const result = await runPromise(loadRemappings('/path/to/config'))
    
    expect(result).toHaveProperty('remappings.@openzeppelin/')
    // Should correctly handle paths starting with slash by removing the leading slash
    expect(result.remappings?.['@openzeppelin/']).toEqual('/path/to/config/absolute/path/lib/openzeppelin/')
  })

  it('should handle config path with trailing slash', async () => {
    vi.mocked(fs.readFileSync).mockReturnValueOnce('@openzeppelin/=lib/openzeppelin/')

    const result = await runPromise(loadRemappings('/path/to/config/'))
    
    expect(result).toHaveProperty('remappings.@openzeppelin/')
    // Should not add double slash when config path already has trailing slash
    expect(result.remappings?.['@openzeppelin/']).toEqual('/path/to/config/lib/openzeppelin/')
  })
})