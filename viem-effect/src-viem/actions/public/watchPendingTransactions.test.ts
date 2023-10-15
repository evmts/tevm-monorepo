import { describe, expect, test, vi } from 'vitest'

import { accounts } from '~test/src/constants.js'
import {
  publicClient,
  testClient,
  walletClient,
  webSocketClient,
} from '~test/src/utils.js'
import type { PublicClient } from '../../clients/createPublicClient.js'
import { parseEther } from '../../utils/unit/parseEther.js'
import { wait } from '../../utils/wait.js'
import { mine } from '../test/mine.js'
import { sendTransaction } from '../wallet/sendTransaction.js'

import * as createPendingTransactionFilter from './createPendingTransactionFilter.js'
import * as getFilterChanges from './getFilterChanges.js'
import {
  type OnTransactionsParameter,
  watchPendingTransactions,
} from './watchPendingTransactions.js'

describe('poll', () => {
  test(
    'watches for pending transactions',
    async () => {
      await wait(1000)

      let transactions: OnTransactionsParameter = []
      const unwatch = watchPendingTransactions(publicClient, {
        onTransactions: (transactions_) => {
          transactions = [...transactions, ...transactions_]
        },
        poll: true,
      })
      await wait(1000)
      await sendTransaction(walletClient, {
        account: accounts[0].address,
        to: accounts[1].address,
        value: parseEther('1'),
      })
      await wait(1000)
      await sendTransaction(walletClient, {
        account: accounts[2].address,
        to: accounts[3].address,
        value: parseEther('1'),
      })
      await wait(1500)
      unwatch()
      expect(transactions.length).toBe(2)

      await mine(testClient, { blocks: 1 })
    },
    { timeout: 10_000 },
  )

  test('watches for pending transactions (unbatched)', async () => {
    await wait(1000)

    let transactions: OnTransactionsParameter = []
    const unwatch = watchPendingTransactions(publicClient, {
      batch: false,
      onTransactions: (transactions_) => {
        transactions = [...transactions, ...transactions_]
      },
      poll: true,
    })
    await wait(1000)
    await sendTransaction(walletClient, {
      account: accounts[0].address,
      to: accounts[1].address,
      value: parseEther('1'),
    })
    await wait(1000)
    await sendTransaction(walletClient, {
      account: accounts[0].address,
      to: accounts[1].address,
      value: parseEther('1'),
    })
    await sendTransaction(walletClient, {
      account: accounts[0].address,
      to: accounts[1].address,
      value: parseEther('1'),
    })
    await wait(2000)
    unwatch()
    expect(transactions.length).toBe(3)

    await mine(testClient, { blocks: 1 })
  })

  describe('errors', () => {
    test('handles error thrown from creating filter', async () => {
      vi.spyOn(
        createPendingTransactionFilter,
        'createPendingTransactionFilter',
      ).mockRejectedValueOnce(new Error('foo'))

      let unwatch: () => void = () => null
      const error = await new Promise((resolve) => {
        unwatch = watchPendingTransactions(publicClient, {
          onTransactions: () => null,
          onError: resolve,
          poll: true,
        })
      })
      expect(error).toMatchInlineSnapshot('[Error: foo]')
      unwatch()
    })

    test('handles error thrown from filter changes', async () => {
      vi.spyOn(getFilterChanges, 'getFilterChanges').mockRejectedValueOnce(
        new Error('bar'),
      )

      let unwatch: () => void = () => null
      const error = await new Promise((resolve) => {
        unwatch = watchPendingTransactions(publicClient, {
          onTransactions: () => null,
          onError: resolve,
          poll: true,
        })
      })
      expect(error).toMatchInlineSnapshot('[Error: bar]')
      unwatch()
    })
  })
})

describe('subscribe', () => {
  test(
    'watches for pending transactions',
    async () => {
      await wait(1000)

      let transactions: OnTransactionsParameter = []
      const unwatch = watchPendingTransactions(webSocketClient, {
        onTransactions: (transactions_) => {
          transactions = [...transactions, ...transactions_]
        },
      })
      await wait(1000)
      await sendTransaction(walletClient, {
        account: accounts[0].address,
        to: accounts[1].address,
        value: parseEther('1'),
      })
      await wait(1000)
      await sendTransaction(walletClient, {
        account: accounts[2].address,
        to: accounts[3].address,
        value: parseEther('1'),
      })
      await wait(1500)
      unwatch()
      expect(transactions.length).toBe(2)

      await mine(testClient, { blocks: 1 })
    },
    { timeout: 10_000 },
  )

  describe('errors', () => {
    test('handles error thrown on init', async () => {
      const client = {
        ...webSocketClient,
        transport: {
          ...webSocketClient.transport,
          subscribe() {
            throw new Error('error')
          },
        },
      }

      let unwatch: () => void = () => null
      const error = await new Promise((resolve) => {
        unwatch = watchPendingTransactions(client, {
          onTransactions: () => null,
          onError: resolve,
        })
      })
      expect(error).toMatchInlineSnapshot('[Error: error]')
      unwatch()
    })

    test('handles error thrown on event', async () => {
      const client = {
        ...webSocketClient,
        transport: {
          ...webSocketClient.transport,
          subscribe({ onError }: any) {
            onError(new Error('error'))
          },
        },
      }

      let unwatch: () => void = () => null
      const error = await new Promise((resolve) => {
        unwatch = watchPendingTransactions(client as PublicClient, {
          onTransactions: () => null,
          onError: resolve,
        })
      })
      expect(error).toMatchInlineSnapshot('[Error: error]')
      unwatch()
    })
  })
})
