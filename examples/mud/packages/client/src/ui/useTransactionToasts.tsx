import { useEffect, useRef } from 'react'
import { toast } from 'sonner' // or whatever toast library you're using
import type { TxStatus } from '@tevm/mud'

export const useTransactionToasts =(
  subscribeTx: (args: { subscriber: (progress: TxStatus) => void }) => () => void,
) => {
  const activeToasts = useRef<Map<string, string | number>>(new Map()) // txId -> toastId

  useEffect(() => {
    const unsubscribe = subscribeTx({
      subscriber: (progress: TxStatus) => {
        const { id, status} = progress
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
              const description = 'hash' in progress
                ? `Waiting for confirmation... (${progress.hash.slice(0, 8)}...)`
                : 'Waiting for confirmation...'

              toast.loading('Updated optimistic state.', {
                id: existingToastId,
                description,
              })
            }
            break
          }

          case 'confirmed': {
            if (existingToastId) {
              toast.success('Transaction confirmed!', {
                id: existingToastId,
                description: progress.hash,
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
      }
    })

    return () => {
      unsubscribe()
      activeToasts.current.forEach((toastId) => toast.dismiss(toastId))
      activeToasts.current.clear()
    }
  }, [subscribeTx])
}