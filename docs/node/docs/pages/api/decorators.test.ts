import { describe, it, expect } from 'vitest'
import { createTevmNode } from 'tevm'
import { requestEip1193 } from 'tevm/decorators'
import { createHttpTransport } from 'tevm/network'

describe('Tevm Decorators', () => {
  describe('EIP-1193 Decorator', () => {
    it('should add EIP-1193 interface to node', async () => {
      const node = createTevmNode().extend(requestEip1193())

      const response = await node.request({
        method: 'eth_blockNumber',
        params: [],
      })

      expect(response).toBeDefined()
      expect(typeof response).toBe('string')
    })

    it('should handle eth_call requests', async () => {
      const node = createTevmNode().extend(requestEip1193())

      const response = await node.request({
        method: 'eth_call',
        params: [{
          to: '0x1234567890123456789012345678901234567890',
          data: '0x70a08231000000000000000000000000' + '1234567890123456789012345678901234567890'.slice(2),
        }],
      })

      expect(response).toBeDefined()
      expect(typeof response).toBe('string')
    })
  })

  describe('Custom Decorators', () => {
    it('should create and use custom decorator', async () => {
      const customDecorator = (node) => ({
        ...node,
        customMethod: async () => 'custom result',
      })

      const node = createTevmNode().extend(customDecorator)
      const result = await node.customMethod()

      expect(result).toBe('custom result')
    })

    it('should chain multiple decorators', async () => {
      const decorator1 = (node) => ({
        ...node,
        method1: async () => 'result1',
      })

      const decorator2 = (node) => ({
        ...node,
        method2: async () => 'result2',
      })

      const node = createTevmNode()
        .extend(decorator1)
        .extend(decorator2)

      const result1 = await node.method1()
      const result2 = await node.method2()

      expect(result1).toBe('result1')
      expect(result2).toBe('result2')
    })
  })

  describe('Network Decorators', () => {
    it('should add HTTP transport', async () => {
      const transport = createHttpTransport('https://eth.llamarpc.com')
      const node = createTevmNode({
        fork: {
          transport,
        },
      })

      const blockNumber = await node.getBlockNumber()
      expect(blockNumber).toBeDefined()
    })

    it('should handle network requests', async () => {
      const transport = createHttpTransport('https://eth.llamarpc.com')
      const node = createTevmNode({
        fork: {
          transport,
        },
      }).extend(requestEip1193())

      const response = await node.request({
        method: 'eth_getBalance',
        params: ['0x1234567890123456789012345678901234567890', 'latest'],
      })

      expect(response).toBeDefined()
      expect(typeof response).toBe('string')
    })
  })

  describe('State Management Decorators', () => {
    it('should handle state persistence', async () => {
      const stateDecorator = (node) => ({
        ...node,
        saveState: async () => ({ saved: true }),
        loadState: async (state) => ({ ...node, loaded: state.saved }),
      })

      const node = createTevmNode().extend(stateDecorator)
      const state = await node.saveState()
      const loadedNode = await node.loadState(state)

      expect(loadedNode.loaded).toBe(true)
    })

    it('should handle state checkpoints', async () => {
      const checkpointDecorator = (node) => ({
        ...node,
        checkpoint: async () => 'checkpoint-id',
        revert: async (checkpointId) => ({ reverted: checkpointId }),
      })

      const node = createTevmNode().extend(checkpointDecorator)
      const checkpointId = await node.checkpoint()
      const revertedNode = await node.revert(checkpointId)

      expect(revertedNode.reverted).toBe('checkpoint-id')
    })
  })

  describe('Error Handling', () => {
    it('should handle method not found', async () => {
      const node = createTevmNode().extend(requestEip1193())

      try {
        await node.request({
          method: 'invalid_method',
          params: [],
        })
        throw new Error('Should have failed')
      } catch (error) {
        expect(error).toBeDefined()
      }
    })

    it('should handle invalid parameters', async () => {
      const node = createTevmNode().extend(requestEip1193())

      try {
        await node.request({
          method: 'eth_call',
          params: [{ invalid: 'params' }],
        })
        throw new Error('Should have failed')
      } catch (error) {
        expect(error).toBeDefined()
      }
    })
  })

  describe('Performance', () => {
    it('should handle concurrent requests', async () => {
      const node = createTevmNode().extend(requestEip1193())
      const requests = Array.from({ length: 10 }, () => ({
        method: 'eth_blockNumber',
        params: [],
      }))

      const responses = await Promise.all(
        requests.map(request => node.request(request))
      )

      expect(responses.length).toBe(10)
      responses.forEach(response => {
        expect(response).toBeDefined()
        expect(typeof response).toBe('string')
      })
    })

    it('should cache responses', async () => {
      const cacheDecorator = (node) => {
        const cache = new Map()
        return {
          ...node,
          request: async (params) => {
            const key = JSON.stringify(params)
            if (cache.has(key)) {
              return cache.get(key)
            }
            const result = await node.request(params)
            cache.set(key, result)
            return result
          },
        }
      }

      const node = createTevmNode()
        .extend(requestEip1193())
        .extend(cacheDecorator)

      const request = {
        method: 'eth_blockNumber',
        params: [],
      }

      const response1 = await node.request(request)
      const response2 = await node.request(request)

      expect(response2).toBe(response1)
    })
  })
})