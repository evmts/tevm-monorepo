import { assertType, describe, expect, test, vi } from 'vitest'

import { localhost } from '../chains/index.js'
import { type EIP1193RequestFn, type TestRpcSchema } from '../index.js'
import { createTestClient } from './createTestClient.js'
import { publicActions } from './decorators/public.js'
import { walletActions } from './decorators/wallet.js'
import { createTransport } from './transports/createTransport.js'
import { http } from './transports/http.js'
import { webSocket } from './transports/webSocket.js'
import { accounts, localWsUrl } from '~test/src/constants.js'

const mockTransport = () =>
	createTransport({
		key: 'mock',
		name: 'Mock Transport',
		request: vi.fn(() => null) as any,
		type: 'mock',
	})

test('creates', () => {
	const { uid, ...client } = createTestClient({
		chain: localhost,
		mode: 'anvil',
		transport: mockTransport,
	})

	assertType<EIP1193RequestFn<TestRpcSchema<'anvil'>>>(client.request)
	expect(uid).toBeDefined()
	expect(client).toMatchInlineSnapshot(`
    {
      "account": undefined,
      "batch": undefined,
      "cacheTime": 4000,
      "chain": {
        "fees": undefined,
        "formatters": undefined,
        "id": 1337,
        "name": "Localhost",
        "nativeCurrency": {
          "decimals": 18,
          "name": "Ether",
          "symbol": "ETH",
        },
        "network": "localhost",
        "rpcUrls": {
          "default": {
            "http": [
              "http://127.0.0.1:8545",
            ],
          },
          "public": {
            "http": [
              "http://127.0.0.1:8545",
            ],
          },
        },
        "serializers": undefined,
      },
      "dropTransaction": [Function],
      "extend": [Function],
      "getAutomine": [Function],
      "getTxpoolContent": [Function],
      "getTxpoolStatus": [Function],
      "impersonateAccount": [Function],
      "increaseTime": [Function],
      "inspectTxpool": [Function],
      "key": "test",
      "mine": [Function],
      "mode": "anvil",
      "name": "Test Client",
      "pollingInterval": 4000,
      "removeBlockTimestampInterval": [Function],
      "request": [Function],
      "reset": [Function],
      "revert": [Function],
      "sendUnsignedTransaction": [Function],
      "setAutomine": [Function],
      "setBalance": [Function],
      "setBlockGasLimit": [Function],
      "setBlockTimestampInterval": [Function],
      "setCode": [Function],
      "setCoinbase": [Function],
      "setIntervalMining": [Function],
      "setLoggingEnabled": [Function],
      "setMinGasPrice": [Function],
      "setNextBlockBaseFeePerGas": [Function],
      "setNextBlockTimestamp": [Function],
      "setNonce": [Function],
      "setRpcUrl": [Function],
      "setStorageAt": [Function],
      "snapshot": [Function],
      "stopImpersonatingAccount": [Function],
      "transport": {
        "key": "mock",
        "name": "Mock Transport",
        "request": [MockFunction spy],
        "retryCount": 3,
        "retryDelay": 150,
        "timeout": undefined,
        "type": "mock",
      },
      "type": "testClient",
    }
  `)
})

describe('transports', () => {
	test('http', () => {
		const { uid, ...client } = createTestClient({
			chain: localhost,
			mode: 'anvil',
			transport: http(),
		})

		expect(uid).toBeDefined()
		expect(client).toMatchInlineSnapshot(`
      {
        "account": undefined,
        "batch": undefined,
        "cacheTime": 4000,
        "chain": {
          "fees": undefined,
          "formatters": undefined,
          "id": 1337,
          "name": "Localhost",
          "nativeCurrency": {
            "decimals": 18,
            "name": "Ether",
            "symbol": "ETH",
          },
          "network": "localhost",
          "rpcUrls": {
            "default": {
              "http": [
                "http://127.0.0.1:8545",
              ],
            },
            "public": {
              "http": [
                "http://127.0.0.1:8545",
              ],
            },
          },
          "serializers": undefined,
        },
        "dropTransaction": [Function],
        "extend": [Function],
        "getAutomine": [Function],
        "getTxpoolContent": [Function],
        "getTxpoolStatus": [Function],
        "impersonateAccount": [Function],
        "increaseTime": [Function],
        "inspectTxpool": [Function],
        "key": "test",
        "mine": [Function],
        "mode": "anvil",
        "name": "Test Client",
        "pollingInterval": 4000,
        "removeBlockTimestampInterval": [Function],
        "request": [Function],
        "reset": [Function],
        "revert": [Function],
        "sendUnsignedTransaction": [Function],
        "setAutomine": [Function],
        "setBalance": [Function],
        "setBlockGasLimit": [Function],
        "setBlockTimestampInterval": [Function],
        "setCode": [Function],
        "setCoinbase": [Function],
        "setIntervalMining": [Function],
        "setLoggingEnabled": [Function],
        "setMinGasPrice": [Function],
        "setNextBlockBaseFeePerGas": [Function],
        "setNextBlockTimestamp": [Function],
        "setNonce": [Function],
        "setRpcUrl": [Function],
        "setStorageAt": [Function],
        "snapshot": [Function],
        "stopImpersonatingAccount": [Function],
        "transport": {
          "fetchOptions": undefined,
          "key": "http",
          "name": "HTTP JSON-RPC",
          "request": [Function],
          "retryCount": 3,
          "retryDelay": 150,
          "timeout": 10000,
          "type": "http",
          "url": undefined,
        },
        "type": "testClient",
      }
    `)
	})

	test('webSocket', () => {
		const { uid, ...client } = createTestClient({
			chain: localhost,
			mode: 'anvil',
			transport: webSocket(localWsUrl),
		})

		expect(uid).toBeDefined()
		expect(client).toMatchInlineSnapshot(`
      {
        "account": undefined,
        "batch": undefined,
        "cacheTime": 4000,
        "chain": {
          "fees": undefined,
          "formatters": undefined,
          "id": 1337,
          "name": "Localhost",
          "nativeCurrency": {
            "decimals": 18,
            "name": "Ether",
            "symbol": "ETH",
          },
          "network": "localhost",
          "rpcUrls": {
            "default": {
              "http": [
                "http://127.0.0.1:8545",
              ],
            },
            "public": {
              "http": [
                "http://127.0.0.1:8545",
              ],
            },
          },
          "serializers": undefined,
        },
        "dropTransaction": [Function],
        "extend": [Function],
        "getAutomine": [Function],
        "getTxpoolContent": [Function],
        "getTxpoolStatus": [Function],
        "impersonateAccount": [Function],
        "increaseTime": [Function],
        "inspectTxpool": [Function],
        "key": "test",
        "mine": [Function],
        "mode": "anvil",
        "name": "Test Client",
        "pollingInterval": 4000,
        "removeBlockTimestampInterval": [Function],
        "request": [Function],
        "reset": [Function],
        "revert": [Function],
        "sendUnsignedTransaction": [Function],
        "setAutomine": [Function],
        "setBalance": [Function],
        "setBlockGasLimit": [Function],
        "setBlockTimestampInterval": [Function],
        "setCode": [Function],
        "setCoinbase": [Function],
        "setIntervalMining": [Function],
        "setLoggingEnabled": [Function],
        "setMinGasPrice": [Function],
        "setNextBlockBaseFeePerGas": [Function],
        "setNextBlockTimestamp": [Function],
        "setNonce": [Function],
        "setRpcUrl": [Function],
        "setStorageAt": [Function],
        "snapshot": [Function],
        "stopImpersonatingAccount": [Function],
        "transport": {
          "getSocket": [Function],
          "key": "webSocket",
          "name": "WebSocket JSON-RPC",
          "request": [Function],
          "retryCount": 3,
          "retryDelay": 150,
          "subscribe": [Function],
          "timeout": 10000,
          "type": "webSocket",
        },
        "type": "testClient",
      }
    `)
	})
})

test('extend', () => {
	const { uid: _, ...client } = createTestClient({
		account: accounts[0].address,
		chain: localhost,
		mode: 'anvil',
		transport: http(),
	})
		.extend(walletActions)
		.extend(publicActions)

	expect(client).toMatchInlineSnapshot(`
    {
      "account": {
        "address": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        "type": "json-rpc",
      },
      "addChain": [Function],
      "batch": undefined,
      "cacheTime": 4000,
      "call": [Function],
      "chain": {
        "fees": undefined,
        "formatters": undefined,
        "id": 1337,
        "name": "Localhost",
        "nativeCurrency": {
          "decimals": 18,
          "name": "Ether",
          "symbol": "ETH",
        },
        "network": "localhost",
        "rpcUrls": {
          "default": {
            "http": [
              "http://127.0.0.1:8545",
            ],
          },
          "public": {
            "http": [
              "http://127.0.0.1:8545",
            ],
          },
        },
        "serializers": undefined,
      },
      "createBlockFilter": [Function],
      "createContractEventFilter": [Function],
      "createEventFilter": [Function],
      "createPendingTransactionFilter": [Function],
      "deployContract": [Function],
      "dropTransaction": [Function],
      "estimateContractGas": [Function],
      "estimateFeesPerGas": [Function],
      "estimateGas": [Function],
      "estimateMaxPriorityFeePerGas": [Function],
      "extend": [Function],
      "getAddresses": [Function],
      "getAutomine": [Function],
      "getBalance": [Function],
      "getBlock": [Function],
      "getBlockNumber": [Function],
      "getBlockTransactionCount": [Function],
      "getBytecode": [Function],
      "getChainId": [Function],
      "getContractEvents": [Function],
      "getEnsAddress": [Function],
      "getEnsAvatar": [Function],
      "getEnsName": [Function],
      "getEnsResolver": [Function],
      "getEnsText": [Function],
      "getFeeHistory": [Function],
      "getFilterChanges": [Function],
      "getFilterLogs": [Function],
      "getGasPrice": [Function],
      "getLogs": [Function],
      "getPermissions": [Function],
      "getProof": [Function],
      "getStorageAt": [Function],
      "getTransaction": [Function],
      "getTransactionConfirmations": [Function],
      "getTransactionCount": [Function],
      "getTransactionReceipt": [Function],
      "getTxpoolContent": [Function],
      "getTxpoolStatus": [Function],
      "impersonateAccount": [Function],
      "increaseTime": [Function],
      "inspectTxpool": [Function],
      "key": "test",
      "mine": [Function],
      "mode": "anvil",
      "multicall": [Function],
      "name": "Test Client",
      "pollingInterval": 4000,
      "prepareTransactionRequest": [Function],
      "readContract": [Function],
      "removeBlockTimestampInterval": [Function],
      "request": [Function],
      "requestAddresses": [Function],
      "requestPermissions": [Function],
      "reset": [Function],
      "revert": [Function],
      "sendRawTransaction": [Function],
      "sendTransaction": [Function],
      "sendUnsignedTransaction": [Function],
      "setAutomine": [Function],
      "setBalance": [Function],
      "setBlockGasLimit": [Function],
      "setBlockTimestampInterval": [Function],
      "setCode": [Function],
      "setCoinbase": [Function],
      "setIntervalMining": [Function],
      "setLoggingEnabled": [Function],
      "setMinGasPrice": [Function],
      "setNextBlockBaseFeePerGas": [Function],
      "setNextBlockTimestamp": [Function],
      "setNonce": [Function],
      "setRpcUrl": [Function],
      "setStorageAt": [Function],
      "signMessage": [Function],
      "signTransaction": [Function],
      "signTypedData": [Function],
      "simulateContract": [Function],
      "snapshot": [Function],
      "stopImpersonatingAccount": [Function],
      "switchChain": [Function],
      "transport": {
        "fetchOptions": undefined,
        "key": "http",
        "name": "HTTP JSON-RPC",
        "request": [Function],
        "retryCount": 3,
        "retryDelay": 150,
        "timeout": 10000,
        "type": "http",
        "url": undefined,
      },
      "type": "testClient",
      "uninstallFilter": [Function],
      "verifyMessage": [Function],
      "verifyTypedData": [Function],
      "waitForTransactionReceipt": [Function],
      "watchAsset": [Function],
      "watchBlockNumber": [Function],
      "watchBlocks": [Function],
      "watchContractEvent": [Function],
      "watchEvent": [Function],
      "watchPendingTransactions": [Function],
      "writeContract": [Function],
    }
  `)
})
