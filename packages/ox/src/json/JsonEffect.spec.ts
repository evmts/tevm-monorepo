import { describe, it, expect } from 'vitest'
import { Effect } from 'effect'
import { JsonEffectLive } from './JsonEffect.js'

describe('JsonEffect', () => {
  describe('parseEffect', () => {
    it('should parse a JSON string', async () => {
      const program = JsonEffectLive.parseEffect('{"foo":"bar"}')
      const result = await Effect.runPromise(program)
      expect(result).toEqual({ foo: 'bar' })
    })

    it('should handle parsing bigint values', async () => {
      const program = JsonEffectLive.parseEffect('{"number":"12345678901234567890#__bigint"}')
      const result = await Effect.runPromise(program)
      expect(result).toEqual({ number: 12345678901234567890n })
    })

    it('should handle invalid JSON', async () => {
      const program = JsonEffectLive.parseEffect('{"invalid JSON')
      await expect(Effect.runPromise(program)).rejects.toThrow()
    })

    it('should support custom reviver', async () => {
      const reviver = (_key: string, value: any) => {
        if (typeof value === 'string') {
          return `modified-${value}`
        }
        return value
      }
      const program = JsonEffectLive.parseEffect('{"foo":"bar"}', reviver)
      const result = await Effect.runPromise(program)
      expect(result).toEqual({ foo: 'modified-bar' })
    })
  })

  describe('stringifyEffect', () => {
    it('should stringify an object to JSON', async () => {
      const program = JsonEffectLive.stringifyEffect({ foo: 'bar' })
      const result = await Effect.runPromise(program)
      expect(result).toBe('{"foo":"bar"}')
    })

    it('should handle stringifying bigint values', async () => {
      const program = JsonEffectLive.stringifyEffect({ number: 12345678901234567890n })
      const result = await Effect.runPromise(program)
      expect(result).toBe('{"number":"12345678901234567890#__bigint"}')
    })

    it('should support custom replacer', async () => {
      const replacer = (_key: string, value: any) => {
        if (typeof value === 'string') {
          return `modified-${value}`
        }
        return value
      }
      const program = JsonEffectLive.stringifyEffect({ foo: 'bar' }, replacer)
      const result = await Effect.runPromise(program)
      expect(result).toBe('{"foo":"modified-bar"}')
    })

    it('should support spacing parameter', async () => {
      const program = JsonEffectLive.stringifyEffect({ foo: 'bar' }, null, 2)
      const result = await Effect.runPromise(program)
      expect(result).toBe('{\n  "foo": "bar"\n}')
    })
  })
})