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

	it('should create a common from a non-ethjsCommon chain object', async () => {
		// Using a minimal chain-like object to test the branch where
		// chain is defined but not an ethjsCommon instance
		const minimalChain = {
			id: 8888,
			name: 'Test Chain',
		}

		// We need to cast to any because TypeScript will complain about the minimal chain object
		const transport = createTevmTransport()({
			// @ts-ignore - Using minimal object to test the code path
			chain: minimalChain,
		})

		// Just verify the transport was created successfully
		expect(transport.config.timeout).toBe(20000)
		expect(transport.config.retryCount).toBe(3)
		expect(transport.value.tevm).toBeDefined()
	})
})
