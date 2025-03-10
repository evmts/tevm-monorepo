import { describe, expect, it } from 'vitest'
import * as indexExports from './index'
import { tevmUnplugin as originalPlugin } from './tevmUnplugin.js'
import { createUnplugin as originalCreate } from 'unplugin'

describe('index exports', () => {
  it('should export tevmUnplugin', () => {
    expect(indexExports.tevmUnplugin).toBeDefined()
    expect(typeof indexExports.tevmUnplugin).toBe('function')
    // Verify it's the same function as imported directly
    expect(indexExports.tevmUnplugin).toBe(originalPlugin)
  })

  it('should export createUnplugin', () => {
    expect(indexExports.createUnplugin).toBeDefined()
    expect(typeof indexExports.createUnplugin).toBe('function')
    // Verify it's the same function as imported directly
    expect(indexExports.createUnplugin).toBe(originalCreate)
  })

  it('should use exported types properly', () => {
    // Just a type test - validates the type is exported correctly
    const testType: indexExports.CompilerOption = '0.8.20'
    expect(testType).toBe('0.8.20')
    
    // Create a plugin to exercise the code
    const plugin = indexExports.tevmUnplugin()
    expect(plugin).toBeDefined()
    expect(plugin.name).toBe('@tevm/rollup-plugin')
  })
})