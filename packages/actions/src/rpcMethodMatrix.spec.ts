import { readFileSync } from 'node:fs'
import { createTevmNode } from '@tevm/node'
import { describe, expect, it } from 'vitest'
import { createHandlers } from './createHandlers.js'
import { buildRpcMethodMatrix, intentionallyUnsupportedRuntimeMethods, typedButMissingMethods } from './rpcMethodMatrix.js'

const typedSchemaFiles = [
  'packages/decorators/src/eip1193/JsonRpcSchemaPublic.ts',
  'packages/decorators/src/eip1193/JsonRpcSchemaTest.ts',
  'packages/decorators/src/eip1193/JsonRpcSchemaTevm.ts',
] as const

const getTypedMethods = () => {
  const methods = new Set<string>()
  for (const file of typedSchemaFiles) {
    const source = readFileSync(file, 'utf8')
    for (const match of source.matchAll(/Method:\s*'([^']+)'/g)) {
      methods.add(match[1]!)
    }
  }
  return Array.from(methods).sort()
}

describe('rpc method matrix parity', () => {
  it('typed methods are runtime-registered', async () => {
    const client = createTevmNode()
    await client.ready()
    const runtimeMethods = new Set(Object.keys(createHandlers(client)))
    const typedMethods = getTypedMethods()
    const missing = typedMethods.filter((method) => !runtimeMethods.has(method) && !typedButMissingMethods.has(method))
    expect(missing).toEqual([])
  })

  it('matrix has owner and status and matches runtime for implemented methods', async () => {
    const client = createTevmNode()
    await client.ready()
    const runtimeMethods = Object.keys(createHandlers(client))
    const runtimeSet = new Set(runtimeMethods)
    const matrix = buildRpcMethodMatrix(runtimeMethods, getTypedMethods())
    for (const entry of matrix) {
      expect(entry.ownerPackage).toBeTruthy()
      expect(entry.status).toBeTruthy()
      if (entry.status === 'supported' || entry.status === 'intentionally_unsupported') {
        expect(runtimeSet.has(entry.method)).toBe(true)
      }
    }
  })

  it('intentionally unsupported methods are explicitly registered', async () => {
    const client = createTevmNode()
    await client.ready()
    const runtimeMethods = new Set(Object.keys(createHandlers(client)))
    for (const method of intentionallyUnsupportedRuntimeMethods) {
      expect(runtimeMethods.has(method)).toBe(true)
    }
  })
})
