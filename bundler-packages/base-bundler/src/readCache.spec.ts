import { expect, describe, it, vi, beforeEach } from 'vitest'
import { readCache } from './readCache.js'

describe('readCache', () => {
  const mockLogger = {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  }

  const mockCache = {
    readArtifacts: vi.fn(),
    readArtifactsSync: vi.fn(),
    writeArtifacts: vi.fn(),
    writeArtifactsSync: vi.fn(),
  }

  const modulePath = '/path/to/module.sol'
  
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should return cached artifacts when they exist and no special requirements', async () => {
    const mockArtifacts = {
      artifacts: { 
        Contract: { 
          evm: { 
            deployedBytecode: '0x123' 
          } 
        } 
      },
      asts: { Contract: { nodes: [] } }
    }
    
    mockCache.readArtifacts.mockResolvedValue(mockArtifacts)
    
    const result = await readCache(mockLogger, mockCache, modulePath, false, false)
    
    expect(result).toEqual(mockArtifacts)
    expect(mockCache.readArtifacts).toHaveBeenCalledWith(modulePath)
    expect(mockLogger.error).not.toHaveBeenCalled()
  })

  it('should return undefined when no cached artifacts exist', async () => {
    mockCache.readArtifacts.mockResolvedValue(null)
    
    const result = await readCache(mockLogger, mockCache, modulePath, false, false)
    
    expect(result).toBeUndefined()
    expect(mockCache.readArtifacts).toHaveBeenCalledWith(modulePath)
    expect(mockLogger.error).not.toHaveBeenCalled()
  })

  it('should return undefined when includeAst is true but no ASTs in cache', async () => {
    const mockArtifacts = {
      artifacts: { 
        Contract: { 
          evm: { 
            deployedBytecode: '0x123' 
          } 
        } 
      },
      asts: {}
    }
    
    mockCache.readArtifacts.mockResolvedValue(mockArtifacts)
    
    const result = await readCache(mockLogger, mockCache, modulePath, true, false)
    
    expect(result).toBeUndefined()
    expect(mockCache.readArtifacts).toHaveBeenCalledWith(modulePath)
    expect(mockLogger.error).not.toHaveBeenCalled()
  })

  it('should return undefined when includeBytecode is true but no bytecode in cache', async () => {
    const mockArtifacts = {
      artifacts: { 
        Contract: { 
          evm: { 
            deployedBytecode: undefined 
          } 
        } 
      },
      asts: { Contract: { nodes: [] } }
    }
    
    mockCache.readArtifacts.mockResolvedValue(mockArtifacts)
    
    const result = await readCache(mockLogger, mockCache, modulePath, false, true)
    
    expect(result).toBeUndefined()
    expect(mockCache.readArtifacts).toHaveBeenCalledWith(modulePath)
    expect(mockLogger.error).not.toHaveBeenCalled()
  })
  
  it('should handle artifacts with evm property but no deployedBytecode when checking for bytecode', async () => {
    const mockArtifacts = {
      artifacts: { 
        Contract: { 
          evm: { } // evm exists but no deployedBytecode
        } 
      },
      asts: { Contract: { nodes: [] } }
    }
    
    mockCache.readArtifacts.mockResolvedValue(mockArtifacts)
    
    const result = await readCache(mockLogger, mockCache, modulePath, false, true)
    
    expect(result).toBeUndefined()
    expect(mockCache.readArtifacts).toHaveBeenCalledWith(modulePath)
    expect(mockLogger.error).not.toHaveBeenCalled()
  })

  it('should return undefined and log error if readArtifacts throws', async () => {
    const error = new Error('Cache read error')
    mockCache.readArtifacts.mockRejectedValue(error)
    
    const result = await readCache(mockLogger, mockCache, modulePath, false, false)
    
    expect(result).toBeUndefined()
    expect(mockCache.readArtifacts).toHaveBeenCalledWith(modulePath)
    expect(mockLogger.error).toHaveBeenCalledTimes(2)
    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringContaining('there was an error in tevm plugin reading cache')
    )
    expect(mockLogger.error).toHaveBeenCalledWith(error)
  })
})