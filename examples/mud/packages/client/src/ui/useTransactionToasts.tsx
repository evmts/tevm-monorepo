import type { TxStatus } from '@tevm/mud'
import { useOptimisticWrapper } from '@tevm/mud/react'
import { useEffect, useRef } from 'react'
import { toast } from 'sonner' // or whatever toast library you're using

export const useTransactionToasts = () => {
	const optimisticWrapper = useOptimisticWrapper()
	const activeToasts = useRef<Map<string, string | number>>(new Map()) // txId -> toastId

	useEffect(() => {
		if (!optimisticWrapper?.subscribeTx) return
		const { subscribeTx } = optimisticWrapper

		const unsubscribe = subscribeTx({
			subscriber: (progress: TxStatus) => {
				const { id, status } = progress
				const existingToastId = activeToasts.current.get(id)

				switch (status) {
					case 'simulating': {
						const toastId = toast.loading('Simulating transaction...', {
							id: existingToastId,
						})
						activeToasts.current.set(id, toastId)
						break
					}

					case 'optimistic': {
						if (existingToastId) {
							const description =
								'hash' in progress
									? `Waiting for confirmation... (${progress.hash.slice(0, 8)}...)`
									: 'Waiting for confirmation...'

							toast.success('Updated optimistic state.', {
								id: existingToastId,
								description,
								duration: Infinity,
							})
						}
						break
					}

					case 'confirmed': {
						if (existingToastId) {
							toast.success('Transaction confirmed!', {
								id: existingToastId,
								description: progress.hash,
								style: {
									backgroundColor: '#f7decd',
									borderColor: '#f7decd',
								},
							})

							setTimeout(() => {
								toast.dismiss(existingToastId)
								activeToasts.current.delete(id)
							}, 3000)
						}
						break
					}

					case 'reverted': {
						if (existingToastId) {
							const toastId = toast.error(`Transaction reverted (${progress.hash.slice(0, 8)}...)`, {
								id: existingToastId,
							})

							setTimeout(() => {
								toast.dismiss(toastId)
								activeToasts.current.delete(id)
							}, 5000)
						}
						break
					}
				}
			},
		})

		return () => {
			unsubscribe()
			activeToasts.current.forEach((toastId) => toast.dismiss(toastId))
			activeToasts.current.clear()
		}
	}, [optimisticWrapper?.subscribeTx])
}
