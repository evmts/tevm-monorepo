import { describe, expect, it } from 'vitest'
import * as interop from './index.js'

describe('index', () => {
	it('should export effectToPromise', () => {
		expect(interop.effectToPromise).toBeDefined()
		expect(typeof interop.effectToPromise).toBe('function')
	})

	it('should export promiseToEffect', () => {
		expect(interop.promiseToEffect).toBeDefined()
		expect(typeof interop.promiseToEffect).toBe('function')
	})

	it('should export wrapWithEffect', () => {
		expect(interop.wrapWithEffect).toBeDefined()
		expect(typeof interop.wrapWithEffect).toBe('function')
	})

	it('should export layerFromFactory', () => {
		expect(interop.layerFromFactory).toBeDefined()
		expect(typeof interop.layerFromFactory).toBe('function')
	})

	it('should export createManagedRuntime', () => {
		expect(interop.createManagedRuntime).toBeDefined()
		expect(typeof interop.createManagedRuntime).toBe('function')
	})
})
