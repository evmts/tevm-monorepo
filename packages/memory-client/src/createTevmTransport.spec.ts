import { base, tevmDefault } from '@tevm/common'
import { requestEip1193 } from '@tevm/decorators'
import { createTevmNode } from '@tevm/node'
import { describe, expect, it } from 'vitest'
import { createTevmTransport } from './createTevmTransport.js'

describe('createTevmTransport', () => {
	it('should create a TEVM transport with default options', () => {
		const node = createTevmNode().extend(requestEip1193())
		const transport = createTevmTransport(node)({})

		expect(transport.config.timeout).toBe(20000)
		expect(transport.config.retryCount).toBe(3)
		expect(transport.config.key).toBe('tevm')
		expect(transport.config.name).toBe('Tevm transport')
		expect(transport.value.tevm).toBeDefined()
	})

	it('should create a TEVM transport with custom options', () => {
		const node = createTevmNode({ common: tevmDefault }).extend(requestEip1193())
		const customTimeout = 30000
		const customRetryCount = 5
		const transport = createTevmTransport(node)({
			timeout: customTimeout,
			retryCount: customRetryCount,
			chain: tevmDefault,
		})

		expect(transport.config.timeout).toBe(customTimeout)
		expect(transport.config.retryCount).toBe(customRetryCount)
		expect(transport.config.key).toBe('tevm')
		expect(transport.config.name).toBe('Tevm transport')
		expect(transport.value.tevm).toBeDefined()
	})

	it('should reuse an existing TEVM client if available', () => {
		const node = createTevmNode({ common: tevmDefault }).extend(requestEip1193())
		const tevmTransport = createTevmTransport(node)
		const transport1 = tevmTransport({ chain: tevmDefault })
		const transport2 = tevmTransport({ chain: tevmDefault })

		expect(transport1.value.tevm).toBe(transport2.value.tevm)
	})

	it('should create a new TEVM client for a different chain', () => {
		const node1 = createTevmNode({ common: tevmDefault }).extend(requestEip1193())
		const customChain = { ...tevmDefault, id: 9999 }
		const node2 = createTevmNode({ common: customChain }).extend(requestEip1193())
		
		const transport1 = createTevmTransport(node1)({ chain: tevmDefault })
		const transport2 = createTevmTransport(node2)({ chain: customChain })

		expect(transport1.value.tevm).not.toBe(transport2.value.tevm)
	})

	it('should use the provided common object if available', async () => {
		const node = createTevmNode({ common: base }).extend(requestEip1193())
		const transport = createTevmTransport(node)({})
		const { common } = await transport.value.tevm.getVm()
		expect(common.id).toBe(base.id)
	})
})
