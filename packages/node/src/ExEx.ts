import type { Block } from '@tevm/block'
import type { TxReceipt } from '@tevm/receipt-manager'

export type ExExEvent =
	| {
			type: 'transaction'
			phase: 'executed'
			txHash: `0x${string}`
			blockHash: `0x${string}`
			receipt: TxReceipt
	  }
	| {
			type: 'receipt'
			phase: 'created'
			blockHash: `0x${string}`
			receipt: TxReceipt
	  }
	| {
			type: 'log'
			phase: 'created'
			blockHash: `0x${string}`
			receipt: TxReceipt
			log: TxReceipt['logs'][number]
	  }
	| {
			type: 'state'
			phase: 'committed'
			blockHash: `0x${string}`
			stateRoot: `0x${string}`
	  }
	| {
			type: 'block'
			phase: 'imported'
			block: Block
			blockHash: `0x${string}`
	  }
	| {
			type: 'canonical'
			phase: 'headChanged'
			headHash: `0x${string}`
			headNumber: bigint
			reorged: boolean
	  }
	| {
			type: 'enginePayload'
			phase: 'received' | 'validated'
			method: string
			payload: unknown
			result?: unknown
	  }

export type ExExHook = (event: ExExEvent) => void | Promise<void>

