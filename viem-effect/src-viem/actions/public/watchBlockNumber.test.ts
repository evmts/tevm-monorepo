import { describe, expect, test, vi } from 'vitest'

import { localHttpUrl } from '~test/src/constants.js'
import { publicClient, testClient, webSocketClient } from '~test/src/utils.js'
import { localhost } from '../../chains/index.js'
import {
  type PublicClient,
  createPublicClient,
} from '../../clients/createPublicClient.js'
import { http } from '../../clients/transports/http.js'
import { wait } from '../../utils/wait.js'
import { mine } from '../test/mine.js'

import * as getBlockNumber from './getBlockNumber.js'
import {
  type OnBlockNumberParameter,
  watchBlockNumber,
} from './watchBlockNumber.js'

describe('poll', () => {
  test('watches for new block numbers', async () => {
    const blockNumbers: OnBlockNumberParameter[] = []
    const unwatch = watchBlockNumber(publicClient, {
      onBlockNumber: (blockNumber) => blockNumbers.push(blockNumber),
      poll: true,
      pollingInterval: 100,
    })
    await mine(testClient, { blocks: 1 })
    await wait(200)
    await mine(testClient, { blocks: 1 })
    await wait(200)
    await mine(testClient, { blocks: 1 })
    await wait(200)
    await mine(testClient, { blocks: 1 })
    await wait(200)
    unwatch()
    expect(blockNumbers.length).toBe(4)
  })

  describe('emitMissed', () => {
    test('emits on missed blocks', async () => {
      const blockNumbers: OnBlockNumberParameter[] = []
      const unwatch = watchBlockNumber(publicClient, {
        emitMissed: true,
        onBlockNumber: (blockNumber) => blockNumbers.push(blockNumber),
        poll: true,
        pollingInterval: 100,
      })
      await mine(testClient, { blocks: 1 })
      await wait(200)
      await mine(testClient, { blocks: 5 })
      await wait(200)
      unwatch()
      expect(blockNumbers.length).toBe(6)
    })
  })

  describe('emitOnBegin', () => {
    test('watches for new block numbers', async () => {
      const blockNumbers: OnBlockNumberParameter[] = []
      const unwatch = watchBlockNumber(publicClient, {
        emitOnBegin: true,
        onBlockNumber: (blockNumber) => blockNumbers.push(blockNumber),
        poll: true,
        pollingInterval: 100,
      })
      await wait(200)
      await mine(testClient, { blocks: 1 })
      await wait(200)
      await mine(testClient, { blocks: 1 })
      await wait(200)
      await mine(testClient, { blocks: 1 })
      await wait(200)
      await mine(testClient, { blocks: 1 })
      await wait(200)
      unwatch()
      expect(blockNumbers.length).toBe(5)
    })
  })

  describe('pollingInterval on client', () => {
    test('watches for new block numbers', async () => {
      const client = createPublicClient({
        chain: localhost,
        transport: http(localHttpUrl),
        pollingInterval: 100,
      })

      const blockNumbers: OnBlockNumberParameter[] = []
      const unwatch = watchBlockNumber(client, {
        onBlockNumber: (blockNumber) => blockNumbers.push(blockNumber),
        poll: true,
      })
      await mine(testClient, { blocks: 1 })
      await wait(200)
      await mine(testClient, { blocks: 1 })
      await wait(200)
      unwatch()
      expect(blockNumbers.length).toBe(2)
    })
  })

  describe('behavior', () => {
    test('does not emit when no new incoming blocks', async () => {
      const blockNumbers: OnBlockNumberParameter[] = []
      const unwatch = watchBlockNumber(publicClient, {
        onBlockNumber: (blockNumber) => blockNumbers.push(blockNumber),
        poll: true,
        pollingInterval: 100,
      })
      await mine(testClient, { blocks: 1 })
      await wait(200)
      await mine(testClient, { blocks: 1 })
      await wait(200)
      unwatch()
      expect(blockNumbers.length).toBe(2)
    })

    test('watch > unwatch > watch', async () => {
      let blockNumbers: OnBlockNumberParameter[] = []
      let unwatch = watchBlockNumber(publicClient, {
        onBlockNumber: (blockNumber) => blockNumbers.push(blockNumber),
        poll: true,
        pollingInterval: 100,
      })
      await mine(testClient, { blocks: 1 })
      await wait(200)
      await mine(testClient, { blocks: 1 })
      await wait(200)
      unwatch()
      expect(blockNumbers.length).toBe(2)

      blockNumbers = []
      unwatch = watchBlockNumber(publicClient, {
        onBlockNumber: (blockNumber) => blockNumbers.push(blockNumber),
        poll: true,
        pollingInterval: 100,
      })
      await mine(testClient, { blocks: 1 })
      await wait(200)
      unwatch()
      expect(blockNumbers.length).toBe(1)
    })

    test('multiple watchers', async () => {
      let blockNumbers: OnBlockNumberParameter[] = []

      let unwatch1 = watchBlockNumber(publicClient, {
        onBlockNumber: (blockNumber) => blockNumbers.push(blockNumber),
        poll: true,
        pollingInterval: 100,
      })
      let unwatch2 = watchBlockNumber(publicClient, {
        onBlockNumber: (blockNumber) => blockNumbers.push(blockNumber),
        poll: true,
        pollingInterval: 100,
      })
      let unwatch3 = watchBlockNumber(publicClient, {
        onBlockNumber: (blockNumber) => blockNumbers.push(blockNumber),
        poll: true,
        pollingInterval: 100,
      })
      await mine(testClient, { blocks: 1 })
      await wait(200)
      await mine(testClient, { blocks: 1 })
      await wait(200)
      unwatch1()
      unwatch2()
      unwatch3()
      expect(blockNumbers.length).toBe(6)

      blockNumbers = []

      unwatch1 = watchBlockNumber(publicClient, {
        onBlockNumber: (blockNumber) => blockNumbers.push(blockNumber),
        poll: true,
        pollingInterval: 100,
      })
      unwatch2 = watchBlockNumber(publicClient, {
        onBlockNumber: (blockNumber) => blockNumbers.push(blockNumber),
        poll: true,
        pollingInterval: 100,
      })
      unwatch3 = watchBlockNumber(publicClient, {
        onBlockNumber: (blockNumber) => blockNumbers.push(blockNumber),
        poll: true,
        pollingInterval: 100,
      })
      await mine(testClient, { blocks: 1 })
      await wait(200)
      await mine(testClient, { blocks: 1 })
      await wait(200)
      unwatch1()
      unwatch2()
      unwatch3()
      expect(blockNumbers.length).toBe(6)
    })

    test('immediately unwatch', async () => {
      const blockNumbers: OnBlockNumberParameter[] = []
      const unwatch = watchBlockNumber(publicClient, {
        onBlockNumber: (blockNumber) => blockNumbers.push(blockNumber),
        poll: true,
      })
      unwatch()
      await mine(testClient, { blocks: 1 })
      await wait(200)
      expect(blockNumbers.length).toBe(0)
    })

    test('out of order blocks', async () => {
      vi.spyOn(getBlockNumber, 'getBlockNumber')
        .mockResolvedValueOnce(420n)
        .mockResolvedValueOnce(421n)
        .mockResolvedValueOnce(419n)
        .mockResolvedValueOnce(424n)
        .mockResolvedValueOnce(424n)
        .mockResolvedValueOnce(426n)
        .mockResolvedValueOnce(423n)
        .mockResolvedValueOnce(424n)
        .mockResolvedValueOnce(429n)
        .mockResolvedValueOnce(430n)

      const blockNumbers: [
        OnBlockNumberParameter,
        OnBlockNumberParameter | undefined,
      ][] = []
      const unwatch = watchBlockNumber(publicClient, {
        poll: true,
        pollingInterval: 100,
        onBlockNumber: (blockNumber, prevBlockNumber) =>
          blockNumbers.push([blockNumber, prevBlockNumber]),
      })
      await wait(1000)
      unwatch()
      expect(blockNumbers).toMatchInlineSnapshot(`
        [
          [
            420n,
            undefined,
          ],
          [
            421n,
            420n,
          ],
          [
            424n,
            421n,
          ],
          [
            426n,
            424n,
          ],
          [
            429n,
            426n,
          ],
        ]
      `)
    })

    test('out of order blocks (emitMissed)', async () => {
      vi.spyOn(getBlockNumber, 'getBlockNumber')
        .mockResolvedValueOnce(420n)
        .mockResolvedValueOnce(421n)
        .mockResolvedValueOnce(419n)
        .mockResolvedValueOnce(424n)
        .mockResolvedValueOnce(424n)
        .mockResolvedValueOnce(426n)
        .mockResolvedValueOnce(423n)
        .mockResolvedValueOnce(424n)
        .mockResolvedValueOnce(429n)
        .mockResolvedValueOnce(430n)

      const blockNumbers: [
        OnBlockNumberParameter,
        OnBlockNumberParameter | undefined,
      ][] = []
      const unwatch = watchBlockNumber(publicClient, {
        emitMissed: true,
        poll: true,
        pollingInterval: 100,
        onBlockNumber: (blockNumber, prevBlockNumber) =>
          blockNumbers.push([blockNumber, prevBlockNumber]),
      })
      await wait(1000)
      unwatch()
      expect(blockNumbers).toMatchInlineSnapshot(`
        [
          [
            420n,
            undefined,
          ],
          [
            421n,
            420n,
          ],
          [
            422n,
            421n,
          ],
          [
            423n,
            422n,
          ],
          [
            424n,
            423n,
          ],
          [
            425n,
            424n,
          ],
          [
            426n,
            425n,
          ],
          [
            427n,
            426n,
          ],
          [
            428n,
            427n,
          ],
          [
            429n,
            428n,
          ],
        ]
      `)
    })
  })

  describe('errors', () => {
    test('handles error thrown', async () => {
      vi.spyOn(getBlockNumber, 'getBlockNumber').mockRejectedValue(
        new Error('foo'),
      )

      let unwatch: () => void = () => null
      const error = await new Promise((resolve) => {
        unwatch = watchBlockNumber(publicClient, {
          onBlockNumber: () => null,
          onError: resolve,
          poll: true,
        })
      })
      expect(error).toMatchInlineSnapshot('[Error: foo]')
      unwatch()
    })
  })
})

describe('subscribe', () => {
  test('watches for new block numbers', async () => {
    const blockNumbers: OnBlockNumberParameter[] = []
    const unwatch = watchBlockNumber(webSocketClient, {
      onBlockNumber: (blockNumber) => blockNumbers.push(blockNumber),
    })
    await wait(200)
    await mine(testClient, { blocks: 1 })
    await wait(200)
    await mine(testClient, { blocks: 1 })
    await wait(200)
    await mine(testClient, { blocks: 1 })
    await wait(200)
    await mine(testClient, { blocks: 1 })
    await wait(200)
    await mine(testClient, { blocks: 1 })
    await wait(200)
    unwatch()
    expect(blockNumbers.length).toBe(5)
  })

  describe('behavior', () => {
    test('watch > unwatch > watch', async () => {
      let blockNumbers: OnBlockNumberParameter[] = []
      let unwatch = watchBlockNumber(webSocketClient, {
        onBlockNumber: (blockNumber) => blockNumbers.push(blockNumber),
      })
      await wait(200)
      await mine(testClient, { blocks: 1 })
      await wait(200)
      await mine(testClient, { blocks: 1 })
      await wait(200)
      await mine(testClient, { blocks: 1 })
      await wait(200)
      unwatch()
      expect(blockNumbers.length).toBe(3)

      blockNumbers = []
      unwatch = watchBlockNumber(webSocketClient, {
        onBlockNumber: (blockNumber) => blockNumbers.push(blockNumber),
      })
      await wait(200)
      await mine(testClient, { blocks: 1 })
      await wait(200)
      await mine(testClient, { blocks: 1 })
      await wait(200)
      await mine(testClient, { blocks: 1 })
      await wait(200)
      unwatch()
      expect(blockNumbers.length).toBe(3)
    })

    test('multiple watchers', async () => {
      let blockNumbers: OnBlockNumberParameter[] = []

      let unwatch1 = watchBlockNumber(webSocketClient, {
        onBlockNumber: (blockNumber) => blockNumbers.push(blockNumber),
      })
      let unwatch2 = watchBlockNumber(webSocketClient, {
        onBlockNumber: (blockNumber) => blockNumbers.push(blockNumber),
      })
      let unwatch3 = watchBlockNumber(webSocketClient, {
        onBlockNumber: (blockNumber) => blockNumbers.push(blockNumber),
      })
      await wait(200)
      await mine(testClient, { blocks: 1 })
      await wait(200)
      await mine(testClient, { blocks: 1 })
      await wait(200)
      await mine(testClient, { blocks: 1 })
      await wait(200)
      unwatch1()
      unwatch2()
      unwatch3()
      expect(blockNumbers.length).toBe(9)

      blockNumbers = []

      unwatch1 = watchBlockNumber(webSocketClient, {
        onBlockNumber: (blockNumber) => blockNumbers.push(blockNumber),
      })
      unwatch2 = watchBlockNumber(webSocketClient, {
        onBlockNumber: (blockNumber) => blockNumbers.push(blockNumber),
      })
      unwatch3 = watchBlockNumber(webSocketClient, {
        onBlockNumber: (blockNumber) => blockNumbers.push(blockNumber),
      })
      await wait(200)
      await mine(testClient, { blocks: 1 })
      await wait(200)
      await mine(testClient, { blocks: 1 })
      await wait(200)
      await mine(testClient, { blocks: 1 })
      await wait(200)
      unwatch1()
      unwatch2()
      unwatch3()
      expect(blockNumbers.length).toBe(9)
    })

    test('immediately unwatch', async () => {
      const blockNumbers: OnBlockNumberParameter[] = []
      const unwatch = watchBlockNumber(webSocketClient, {
        onBlockNumber: (blockNumber) => blockNumbers.push(blockNumber),
      })
      unwatch()
      await wait(1000)
      expect(blockNumbers.length).toBe(0)
    })
  })

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
        unwatch = watchBlockNumber(client, {
          onBlockNumber: () => null,
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
        unwatch = watchBlockNumber(client as PublicClient, {
          onBlockNumber: () => null,
          onError: resolve,
        })
      })
      expect(error).toMatchInlineSnapshot('[Error: error]')
      unwatch()
    })
  })
})
