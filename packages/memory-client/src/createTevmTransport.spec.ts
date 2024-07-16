import { base, tevmDefault } from '@tevm/common'
import { describe, expect, it } from 'vitest'
import { createTevmTransport } from './createTevmTransport.js'

describe('createTevmTransport', () => {
	it('should create a TEVM transport with default options', () => {
		const transport = createTevmTransport()({})

		expect(transport.config.timeout).toBe(20000)
		expect(transport.config.retryCount).toBe(3)
		expect(transport.config.key).toBe('tevm')
		expect(transport.config.name).toBe('Tevm transport')
		expect(transport.value.tevm).toBeDefined()
	})

	it('should create a TEVM transport with custom options', () => {
		const customTimeout = 30000
		const customRetryCount = 5
		const transport = createTevmTransport()({
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
		const tevmTransport = createTevmTransport()
		const transport1 = tevmTransport({ chain: tevmDefault })
		const transport2 = tevmTransport({ chain: tevmDefault })

		expect(transport1.value.tevm).toBe(transport2.value.tevm)
	})

	it('should create a new TEVM client for a different chain', () => {
		const customChain = { ...tevmDefault, id: 9999 }
		const transport1 = createTevmTransport()({ chain: tevmDefault })
		const transport2 = createTevmTransport()({ chain: customChain })

		expect(transport1.value.tevm).not.toBe(transport2.value.tevm)
	})

	it('should use the provided common object if available', async () => {
		// TODO I shouldn't have to as any this
		const transport = createTevmTransport({ common: base })({})
		const { common } = await transport.value.tevm.getVm()
		expect(common.id).toBe(base.id)
	})
})
