import { beforeEach, describe, expect, it, vi } from 'vitest'
import { notifyTxStatus, subscribeTxStatus, type TxStatus, type TxStatusSubscriber } from './subscribeTx.js'

describe('subscribeTx', () => {
	let subscribers: Set<TxStatusSubscriber>
	let mockSubscriber1: TxStatusSubscriber
	let mockSubscriber2: TxStatusSubscriber

	beforeEach(() => {
		subscribers = new Set()
		mockSubscriber1 = vi.fn()
		mockSubscriber2 = vi.fn()
	})

	describe('subscribeTxStatus', () => {
		it('should add subscriber to the set', () => {
			const subscribe = subscribeTxStatus(subscribers)

			expect(subscribers.size).toBe(0)

			subscribe(mockSubscriber1)

			expect(subscribers.size).toBe(1)
			expect(subscribers.has(mockSubscriber1)).toBe(true)
		})

		it('should return unsubscribe function', () => {
			const subscribe = subscribeTxStatus(subscribers)
			const unsubscribe = subscribe(mockSubscriber1)

			expect(typeof unsubscribe).toBe('function')
			expect(subscribers.has(mockSubscriber1)).toBe(true)

			unsubscribe()

			expect(subscribers.has(mockSubscriber1)).toBe(false)
			expect(subscribers.size).toBe(0)
		})

		it('should handle multiple subscribers', () => {
			const subscribe = subscribeTxStatus(subscribers)

			const unsubscribe1 = subscribe(mockSubscriber1)
			const unsubscribe2 = subscribe(mockSubscriber2)

			expect(subscribers.size).toBe(2)
			expect(subscribers.has(mockSubscriber1)).toBe(true)
			expect(subscribers.has(mockSubscriber2)).toBe(true)

			unsubscribe1()

			expect(subscribers.size).toBe(1)
			expect(subscribers.has(mockSubscriber1)).toBe(false)
			expect(subscribers.has(mockSubscriber2)).toBe(true)

			unsubscribe2()

			expect(subscribers.size).toBe(0)
		})
	})

	describe('notifyTxStatus', () => {
		it('should notify all subscribers with simulating status', () => {
			subscribers.add(mockSubscriber1)
			subscribers.add(mockSubscriber2)

			const notify = notifyTxStatus(subscribers)
			const status: TxStatus = {
				id: crypto.randomUUID(),
				timestamp: Date.now(),
				status: 'simulating',
			}

			notify(status)

			expect(mockSubscriber1).toHaveBeenCalledWith(status)
			expect(mockSubscriber2).toHaveBeenCalledWith(status)
		})

		it('should notify all subscribers with optimistic status', () => {
			subscribers.add(mockSubscriber1)
			subscribers.add(mockSubscriber2)

			const notify = notifyTxStatus(subscribers)
			const status: TxStatus = {
				id: crypto.randomUUID(),
				timestamp: Date.now(),
				status: 'optimistic',
			}

			notify(status)

			expect(mockSubscriber1).toHaveBeenCalledWith(status)
			expect(mockSubscriber2).toHaveBeenCalledWith(status)
		})

		it('should notify all subscribers with confirmed status and hash', () => {
			subscribers.add(mockSubscriber1)
			subscribers.add(mockSubscriber2)

			const notify = notifyTxStatus(subscribers)
			const status: TxStatus = {
				id: crypto.randomUUID(),
				timestamp: Date.now(),
				status: 'confirmed',
				hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
			}

			notify(status)

			expect(mockSubscriber1).toHaveBeenCalledWith(status)
			expect(mockSubscriber2).toHaveBeenCalledWith(status)
		})

		it('should notify all subscribers with reverted status and hash', () => {
			subscribers.add(mockSubscriber1)
			subscribers.add(mockSubscriber2)

			const notify = notifyTxStatus(subscribers)
			const status: TxStatus = {
				id: crypto.randomUUID(),
				timestamp: Date.now(),
				status: 'reverted',
				hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
			}

			notify(status)

			expect(mockSubscriber1).toHaveBeenCalledWith(status)
			expect(mockSubscriber2).toHaveBeenCalledWith(status)
		})

		it('should handle empty subscriber set', () => {
			const notify = notifyTxStatus(subscribers)
			const status: TxStatus = {
				id: crypto.randomUUID(),
				timestamp: Date.now(),
				status: 'simulating',
			}

			// Should not throw
			expect(() => notify(status)).not.toThrow()
		})

		it('should handle subscriber errors gracefully', () => {
			const errorSubscriber = vi.fn().mockImplementation(() => {
				throw new Error('Subscriber error')
			})
			const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

			subscribers.add(errorSubscriber)
			subscribers.add(mockSubscriber1)

			const notify = notifyTxStatus(subscribers)
			const status: TxStatus = {
				id: crypto.randomUUID(),
				timestamp: Date.now(),
				status: 'simulating',
			}

			// Should not throw and should continue notifying other subscribers
			expect(() => notify(status)).not.toThrow()

			expect(errorSubscriber).toHaveBeenCalledWith(status)
			expect(mockSubscriber1).toHaveBeenCalledWith(status)
			expect(consoleSpy).toHaveBeenCalledWith('TxStatus subscriber failed:', expect.any(Error))

			consoleSpy.mockRestore()
		})
	})

	describe('integration', () => {
		it('should work together for complete subscription lifecycle', () => {
			const subscribe = subscribeTxStatus(subscribers)
			const notify = notifyTxStatus(subscribers)

			// Subscribe
			const unsubscribe1 = subscribe(mockSubscriber1)
			const unsubscribe2 = subscribe(mockSubscriber2)

			// Notify simulating
			const simulatingStatus: TxStatus = {
				id: crypto.randomUUID(),
				timestamp: Date.now(),
				status: 'simulating',
			}
			notify(simulatingStatus)

			expect(mockSubscriber1).toHaveBeenCalledWith(simulatingStatus)
			expect(mockSubscriber2).toHaveBeenCalledWith(simulatingStatus)

			// Notify optimistic with hash
			const optimisticStatus: TxStatus = {
				id: simulatingStatus.id, // Same transaction
				timestamp: Date.now(),
				status: 'optimistic',
				hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
			}
			notify(optimisticStatus)

			expect(mockSubscriber1).toHaveBeenCalledWith(optimisticStatus)
			expect(mockSubscriber2).toHaveBeenCalledWith(optimisticStatus)

			// Unsubscribe one
			unsubscribe1()

			// Notify confirmed
			const confirmedStatus: TxStatus = {
				id: simulatingStatus.id, // Same transaction
				timestamp: Date.now(),
				status: 'confirmed',
				hash: optimisticStatus.hash,
			}
			notify(confirmedStatus)

			expect(mockSubscriber1).toHaveBeenCalledTimes(2) // Not called again
			expect(mockSubscriber2).toHaveBeenCalledWith(confirmedStatus)
			expect(mockSubscriber2).toHaveBeenCalledTimes(3)

			// Cleanup
			unsubscribe2()
			expect(subscribers.size).toBe(0)
		})
	})
})
