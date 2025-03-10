import { describe, expect, it, vi } from 'vitest'
import { resolveJsonAsConst } from './resolveJsonAsConst.js'

describe('resolveJsonAsConst', () => {
  it('should convert JSON to const export when it matches config pattern', () => {
    const config = {
      jsonAsConst: ['**/*.json'],
    }
    const jsonFilePath = 'test.json'
    
    const fao = {
      readFileSync: vi.fn().mockReturnValue('{"test": "value"}'),
    }
    
    const languageServiceHost = {
      getScriptSnapshot: vi.fn(),
    }
    
    const ts = {
      ScriptSnapshot: {
        fromString: vi.fn().mockReturnValue('snapshot'),
      },
    }
    
    const result = resolveJsonAsConst(config, jsonFilePath, fao, languageServiceHost, ts)
    
    expect(fao.readFileSync).toHaveBeenCalledWith(jsonFilePath, 'utf8')
    expect(ts.ScriptSnapshot.fromString).toHaveBeenCalledWith('export default {"test": "value"} as const')
    expect(result).toBe('snapshot')
    expect(languageServiceHost.getScriptSnapshot).not.toHaveBeenCalled()
  })
  
  it('should return original script snapshot when JSON does not match config pattern', () => {
    const config = {
      jsonAsConst: ['**/*.special.json'],
    }
    const jsonFilePath = 'test.json'
    
    const fao = {
      readFileSync: vi.fn(),
    }
    
    const languageServiceHost = {
      getScriptSnapshot: vi.fn().mockReturnValue('original snapshot'),
    }
    
    const ts = {
      ScriptSnapshot: {
        fromString: vi.fn(),
      },
    }
    
    const result = resolveJsonAsConst(config, jsonFilePath, fao, languageServiceHost, ts)
    
    expect(fao.readFileSync).not.toHaveBeenCalled()
    expect(ts.ScriptSnapshot.fromString).not.toHaveBeenCalled()
    expect(languageServiceHost.getScriptSnapshot).toHaveBeenCalledWith(jsonFilePath)
    expect(result).toBe('original snapshot')
  })
})