import type { Hex } from 'viem'

export type TxStatus = {
	id: ReturnType<typeof crypto.randomUUID>
	timestamp: number
} & (
	| {
			status:
				| 'simulating' // optimistic tx running
				| 'optimistic' // optimistic tx mined
	  }
	| {
			status:
				| 'optimistic' // in this case tx has been broadcast as well as we have a tx hash
				| 'confirmed' // tx mined and confirmed
				| 'reverted' // tx reverted
			hash: Hex
	  }
)

export type TxStatusSubscriber = (status: TxStatus) => void

export const subscribeTxStatus = (subscribers: Set<TxStatusSubscriber>) => (subscriber: TxStatusSubscriber) => {
	subscribers.add(subscriber)
	return () => {
		subscribers.delete(subscriber)
	}
}

export const notifyTxStatus = (subscribers: Set<TxStatusSubscriber>) => (status: TxStatus) => {
	subscribers.forEach((subscriber) => {
		try {
			subscriber(status)
		} catch (error) {
			console.warn('TxStatus subscriber failed:', error)
		}
	})
}
