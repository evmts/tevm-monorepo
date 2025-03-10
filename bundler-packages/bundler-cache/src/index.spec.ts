import { describe, expect, it } from 'vitest'
import * as index from './index.js'

describe('index', () => {
  it('should export createCache', () => {
    expect(index.createCache).toBeDefined()
    expect(typeof index.createCache).toBe('function')
  })
})