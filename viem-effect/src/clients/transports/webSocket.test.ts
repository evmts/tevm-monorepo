import { WebSocket } from 'isows'

import { assertType, describe, expect, test } from 'vitest'

import { localhost } from '../../chains/index.js'
import { wait } from '../../utils/wait.js'
import { localWsUrl } from '~test/src/constants.js'

import { mine } from '../../test/index.js'
import { type WebSocketTransport, webSocket } from './webSocket.js'
import { testClient } from '~test/src/utils.js'

test('default', () => {
	const transport = webSocket(localWsUrl)

	assertType<WebSocketTransport>(transport)
	assertType<'webSocket'>(transport({}).config.type)

	expect(transport).toMatchInlineSnapshot('[Function]')
})

describe('config', () => {
	test('key', () => {
		const transport = webSocket(localWsUrl, {
			key: 'mock',
		})

		expect(transport({})).toMatchInlineSnapshot(`
      {
        "config": {
          "key": "mock",
          "name": "WebSocket JSON-RPC",
          "request": [Function],
          "retryCount": 3,
          "retryDelay": 150,
          "timeout": 10000,
          "type": "webSocket",
        },
        "request": [Function],
        "value": {
          "getSocket": [Function],
          "subscribe": [Function],
        },
      }
    `)
	})

	test('name', () => {
		const transport = webSocket(localWsUrl, {
			name: 'Mock Transport',
		})

		expect(transport({})).toMatchInlineSnapshot(`
      {
        "config": {
          "key": "webSocket",
          "name": "Mock Transport",
          "request": [Function],
          "retryCount": 3,
          "retryDelay": 150,
          "timeout": 10000,
          "type": "webSocket",
        },
        "request": [Function],
        "value": {
          "getSocket": [Function],
          "subscribe": [Function],
        },
      }
    `)
	})

	test('url', () => {
		const transport = webSocket('https://mockapi.com/rpc')

		expect(transport({})).toMatchInlineSnapshot(`
      {
        "config": {
          "key": "webSocket",
          "name": "WebSocket JSON-RPC",
          "request": [Function],
          "retryCount": 3,
          "retryDelay": 150,
          "timeout": 10000,
          "type": "webSocket",
        },
        "request": [Function],
        "value": {
          "getSocket": [Function],
          "subscribe": [Function],
        },
      }
    `)
	})
})

test('getSocket', async () => {
	const transport = webSocket(localWsUrl)
	const socket = await transport({}).value?.getSocket()
	expect(socket).toBeDefined()
	expect(socket?.readyState).toBe(WebSocket.OPEN)
})

test('request', async () => {
	const transport = webSocket(undefined, {
		key: 'jsonRpc',
		name: 'JSON RPC',
	})

	expect(
		await transport({
			chain: {
				...localhost,
				rpcUrls: {
					public: { http: [localWsUrl], webSocket: [localWsUrl] },
					default: { http: [localWsUrl], webSocket: [localWsUrl] },
				},
			},
		}).config.request({
			method: 'eth_blockNumber',
		}),
	).toBeDefined()
})

test('errors: rpc error', async () => {
	const transport = webSocket(localWsUrl, {
		key: 'jsonRpc',
		name: 'JSON RPC',
	})({ chain: localhost })

	await expect(() =>
		transport.request({ method: 'eth_wagmi' }),
	).rejects.toThrowErrorMatchingInlineSnapshot(`
    "Invalid parameters were provided to the RPC method.
    Double check you have provided the correct parameters.

    URL: http://localhost
    Request body: {\\"method\\":\\"eth_wagmi\\"}

    Details: data did not match any variant of untagged enum EthRpcCall
    Version: viem@1.0.2"
  `)
})

test('subscribe', async () => {
	const transport = webSocket(localWsUrl, {
		key: 'jsonRpc',
		name: 'JSON RPC',
	})({})
	if (!transport.value) return

	const blocks: any[] = []
	const { subscriptionId, unsubscribe } = await transport.value.subscribe({
		params: ['newHeads'],
		onData: (data) => blocks.push(data),
	})

	// Make sure we are subscribed.
	expect(subscriptionId).toBeDefined()

	// Make sure we are receiving blocks.
	await mine(testClient, { blocks: 1 })
	await wait(200)
	expect(blocks.length).toBe(1)

	// Make sure we unsubscribe.
	const { result } = await unsubscribe()
	expect(result).toBeDefined()

	// Make sure we are no longer receiving blocks.
	await mine(testClient, { blocks: 1 })
	await wait(200)
	expect(blocks.length).toBe(1)
})

test('throws on bogus subscription', async () => {
	const transport = webSocket(localWsUrl, {
		key: 'jsonRpc',
		name: 'JSON RPC',
	})

	const errors: any[] = []
	await expect(() =>
		transport({}).value?.subscribe({
			// @ts-expect-error - testing
			params: ['lol'],
			onData: () => null,
			onError: (err) => errors.push(err),
		}),
	).rejects.toThrowError()
	expect(errors.length).toBeGreaterThan(0)
})

test('no url', () => {
	expect(() => webSocket()({})).toThrowErrorMatchingInlineSnapshot(`
    "No URL was provided to the Transport. Please provide a valid RPC URL to the Transport.

    Docs: https://viem.sh/docs/clients/intro.html
    Version: viem@1.0.2"
  `)
})
