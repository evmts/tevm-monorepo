import { describe, expect, it } from 'vitest'
import * as index from './index.js'

describe('index.js', () => {
  it('should export bundler function', () => {
    expect(index.bundler).toBeDefined()
    expect(typeof index.bundler).toBe('function')
  })

  it('should export getContractPath function', () => {
    expect(index.getContractPath).toBeDefined()
    expect(typeof index.getContractPath).toBe('function')
  })
})