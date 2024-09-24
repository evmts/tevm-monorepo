import { Block } from '@tevm/block'
import { type TxReceipt } from '@tevm/receipt-manager'
import { type Hex } from '@tevm/utils'
import { describe, expect, it, vi } from 'vitest'
import { emitEvents } from './emitEvents.js'

describe('emitEvents', () => {
	it('should emit events for new blocks and receipts', () => {
		// Mock TevmNode client
		const client = {
			emit: vi.fn(),
		}

		// Mock block and receipt data
		const mockBlock = {
			hash: () => new Uint8Array([1, 2, 3]),
		} as Block

		const mockReceipt = {
			logs: [{ topics: ['0x123'], data: '0x456' }],
		} as any as TxReceipt

		const newBlocks = [mockBlock]
		const newReceipts = new Map<Hex, TxReceipt[]>([['0x010203', [mockReceipt]]])

		emitEvents(client as any, newBlocks, newReceipts)

		expect(client.emit).toHaveBeenCalledWith('newBlock', mockBlock)
		expect(client.emit).toHaveBeenCalledWith('newReceipt', mockReceipt)
		expect(client.emit).toHaveBeenCalledWith('newLog', mockReceipt.logs[0])
	})

	it('should throw an error if receipts are not found', () => {
		const client = {
			emit: vi.fn(),
		}

		const mockBlock = {
			hash: () => new Uint8Array([1, 2, 3]),
		} as Block

		const newBlocks = [mockBlock]
		const newReceipts = new Map<Hex, TxReceipt[]>()

		expect(() => emitEvents(client as any, newBlocks, newReceipts)).toThrow(
			'InternalError: Receipts not found in mineHandler. This indicates a bug in tevm.',
		)
	})
})
