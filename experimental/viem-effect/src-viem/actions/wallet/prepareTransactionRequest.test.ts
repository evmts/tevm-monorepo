import { describe, expect, test, vi } from 'vitest'

import { privateKeyToAccount } from '../../accounts/privateKeyToAccount.js'
import * as getBlock from '../../actions/public/getBlock.js'
import { mine } from '../../actions/test/mine.js'
import { setBalance } from '../../actions/test/setBalance.js'
import { setNextBlockBaseFeePerGas } from '../../actions/test/setNextBlockBaseFeePerGas.js'
import { parseEther } from '../../utils/unit/parseEther.js'
import { parseGwei } from '../../utils/unit/parseGwei.js'
import { accounts } from '~test/src/constants.js'
import {
	anvilChain,
	publicClient,
	testClient,
	walletClient,
} from '~test/src/utils.js'

import { createWalletClient, http } from '../../index.js'
import { prepareTransactionRequest } from './prepareTransactionRequest.js'

const sourceAccount = accounts[0]
const targetAccount = accounts[1]

async function setup() {
	await setBalance(testClient, {
		address: sourceAccount.address,
		value: sourceAccount.balance,
	})
	await setBalance(testClient, {
		address: targetAccount.address,
		value: targetAccount.balance,
	})
	await setNextBlockBaseFeePerGas(testClient, {
		baseFeePerGas: parseGwei('10'),
	})
	await mine(testClient, { blocks: 1 })
}

describe('prepareTransactionRequest', () => {
	test('default', async () => {
		await setup()

		const block = await getBlock.getBlock(publicClient)
		const {
			maxFeePerGas,
			maxPriorityFeePerGas,
			nonce: _nonce,
			...rest
		} = await prepareTransactionRequest(walletClient, {
			account: privateKeyToAccount(sourceAccount.privateKey),
			to: targetAccount.address,
			value: parseEther('1'),
		})
		expect(maxFeePerGas).toEqual(
			(block.baseFeePerGas! * 120n) / 100n + maxPriorityFeePerGas!,
		)
		expect(rest).toMatchInlineSnapshot(`
      {
        "account": {
          "address": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
          "publicKey": "0x048318535b54105d4a7aae60c08fc45f9687181b4fdfc625bd1a753fa7397fed753547f11ca8696646f2f3acb08e31016afac23e630c5d11f59f61fef57b0d2aa5",
          "signMessage": [Function],
          "signTransaction": [Function],
          "signTypedData": [Function],
          "source": "privateKey",
          "type": "local",
        },
        "from": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "gas": 21000n,
        "to": "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
        "type": "eip1559",
        "value": 1000000000000000000n,
      }
    `)
	})

	test('legacy fees', async () => {
		await setup()

		vi.spyOn(getBlock, 'getBlock').mockResolvedValueOnce({
			baseFeePerGas: undefined,
		} as any)

		const { nonce: _nonce, ...request } = await prepareTransactionRequest(
			walletClient,
			{
				account: privateKeyToAccount(sourceAccount.privateKey),
				to: targetAccount.address,
				value: parseEther('1'),
			},
		)
		expect(request).toMatchInlineSnapshot(`
      {
        "account": {
          "address": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
          "publicKey": "0x048318535b54105d4a7aae60c08fc45f9687181b4fdfc625bd1a753fa7397fed753547f11ca8696646f2f3acb08e31016afac23e630c5d11f59f61fef57b0d2aa5",
          "signMessage": [Function],
          "signTransaction": [Function],
          "signTypedData": [Function],
          "source": "privateKey",
          "type": "local",
        },
        "from": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "gas": 21000n,
        "gasPrice": 11700000000n,
        "to": "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
        "type": "legacy",
        "value": 1000000000000000000n,
      }
    `)
	})

	test('args: chain', async () => {
		await setup()

		const {
			maxFeePerGas: _maxFeePerGas,
			nonce: _nonce,
			...rest
		} = await prepareTransactionRequest(walletClient, {
			account: privateKeyToAccount(sourceAccount.privateKey),
			to: targetAccount.address,
			value: parseEther('1'),
		})
		expect(rest).toMatchInlineSnapshot(`
      {
        "account": {
          "address": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
          "publicKey": "0x048318535b54105d4a7aae60c08fc45f9687181b4fdfc625bd1a753fa7397fed753547f11ca8696646f2f3acb08e31016afac23e630c5d11f59f61fef57b0d2aa5",
          "signMessage": [Function],
          "signTransaction": [Function],
          "signTypedData": [Function],
          "source": "privateKey",
          "type": "local",
        },
        "from": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "gas": 21000n,
        "maxPriorityFeePerGas": 18500000000n,
        "to": "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
        "type": "eip1559",
        "value": 1000000000000000000n,
      }
    `)
	})

	test('args: nonce', async () => {
		await setup()

		const { maxFeePerGas: _maxFeePerGas, ...rest } =
			await prepareTransactionRequest(walletClient, {
				account: privateKeyToAccount(sourceAccount.privateKey),
				to: targetAccount.address,
				nonce: 5,
				value: parseEther('1'),
			})
		expect(rest).toMatchInlineSnapshot(`
      {
        "account": {
          "address": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
          "publicKey": "0x048318535b54105d4a7aae60c08fc45f9687181b4fdfc625bd1a753fa7397fed753547f11ca8696646f2f3acb08e31016afac23e630c5d11f59f61fef57b0d2aa5",
          "signMessage": [Function],
          "signTransaction": [Function],
          "signTypedData": [Function],
          "source": "privateKey",
          "type": "local",
        },
        "from": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "gas": 21000n,
        "maxPriorityFeePerGas": 18500000000n,
        "nonce": 5,
        "to": "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
        "type": "eip1559",
        "value": 1000000000000000000n,
      }
    `)
	})

	test('args: gasPrice', async () => {
		await setup()

		vi.spyOn(getBlock, 'getBlock').mockResolvedValueOnce({} as any)

		const { nonce: _nonce, ...request } = await prepareTransactionRequest(
			walletClient,
			{
				account: privateKeyToAccount(sourceAccount.privateKey),
				to: targetAccount.address,
				gasPrice: parseGwei('10'),
				value: parseEther('1'),
			},
		)
		expect(request).toMatchInlineSnapshot(`
      {
        "account": {
          "address": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
          "publicKey": "0x048318535b54105d4a7aae60c08fc45f9687181b4fdfc625bd1a753fa7397fed753547f11ca8696646f2f3acb08e31016afac23e630c5d11f59f61fef57b0d2aa5",
          "signMessage": [Function],
          "signTransaction": [Function],
          "signTypedData": [Function],
          "source": "privateKey",
          "type": "local",
        },
        "from": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "gas": 21000n,
        "gasPrice": 10000000000n,
        "to": "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
        "type": "legacy",
        "value": 1000000000000000000n,
      }
    `)
	})

	test('args: gasPrice (on chain w/ block.baseFeePerGas)', async () => {
		await setup()

		const { nonce: _nonce, ...request } = await prepareTransactionRequest(
			walletClient,
			{
				account: privateKeyToAccount(sourceAccount.privateKey),
				to: targetAccount.address,
				gasPrice: parseGwei('10'),
				value: parseEther('1'),
			},
		)
		expect(request).toMatchInlineSnapshot(`
      {
        "account": {
          "address": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
          "publicKey": "0x048318535b54105d4a7aae60c08fc45f9687181b4fdfc625bd1a753fa7397fed753547f11ca8696646f2f3acb08e31016afac23e630c5d11f59f61fef57b0d2aa5",
          "signMessage": [Function],
          "signTransaction": [Function],
          "signTypedData": [Function],
          "source": "privateKey",
          "type": "local",
        },
        "from": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "gas": 21000n,
        "gasPrice": 10000000000n,
        "to": "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
        "type": "legacy",
        "value": 1000000000000000000n,
      }
    `)
	})

	test('args: maxFeePerGas', async () => {
		await setup()

		const { nonce: _nonce, ...rest } = await prepareTransactionRequest(
			walletClient,
			{
				account: privateKeyToAccount(sourceAccount.privateKey),
				to: targetAccount.address,
				maxFeePerGas: parseGwei('100'),
				value: parseEther('1'),
			},
		)
		expect(rest).toMatchInlineSnapshot(`
      {
        "account": {
          "address": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
          "publicKey": "0x048318535b54105d4a7aae60c08fc45f9687181b4fdfc625bd1a753fa7397fed753547f11ca8696646f2f3acb08e31016afac23e630c5d11f59f61fef57b0d2aa5",
          "signMessage": [Function],
          "signTransaction": [Function],
          "signTypedData": [Function],
          "source": "privateKey",
          "type": "local",
        },
        "from": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "gas": 21000n,
        "maxFeePerGas": 100000000000n,
        "maxPriorityFeePerGas": 18500000000n,
        "to": "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
        "type": "eip1559",
        "value": 1000000000000000000n,
      }
    `)
	})

	test('args: maxFeePerGas (under default tip)', async () => {
		await setup()

		await expect(() =>
			prepareTransactionRequest(walletClient, {
				account: privateKeyToAccount(sourceAccount.privateKey),
				to: targetAccount.address,
				maxFeePerGas: parseGwei('1'),
				value: parseEther('1'),
			}),
		).rejects.toThrowErrorMatchingInlineSnapshot(`
      "\`maxFeePerGas\` cannot be less than the \`maxPriorityFeePerGas\` (18.5 gwei).

      Version: viem@1.0.2"
    `)
	})

	test('args: maxFeePerGas (on legacy)', async () => {
		await setup()

		vi.spyOn(getBlock, 'getBlock').mockResolvedValueOnce({
			baseFeePerGas: undefined,
		} as any)

		await expect(() =>
			prepareTransactionRequest(walletClient, {
				account: privateKeyToAccount(sourceAccount.privateKey),
				to: targetAccount.address,
				maxFeePerGas: parseGwei('10'),
				value: parseEther('1'),
			}),
		).rejects.toThrowErrorMatchingInlineSnapshot(`
      "Chain does not support EIP-1559 fees.

      Version: viem@1.0.2"
    `)
	})

	test('args: maxPriorityFeePerGas', async () => {
		await setup()

		const { nonce: _nonce, ...rest } = await prepareTransactionRequest(
			walletClient,
			{
				account: privateKeyToAccount(sourceAccount.privateKey),
				to: targetAccount.address,
				maxPriorityFeePerGas: parseGwei('5'),
				value: parseEther('1'),
			},
		)
		expect(rest).toMatchInlineSnapshot(`
      {
        "account": {
          "address": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
          "publicKey": "0x048318535b54105d4a7aae60c08fc45f9687181b4fdfc625bd1a753fa7397fed753547f11ca8696646f2f3acb08e31016afac23e630c5d11f59f61fef57b0d2aa5",
          "signMessage": [Function],
          "signTransaction": [Function],
          "signTypedData": [Function],
          "source": "privateKey",
          "type": "local",
        },
        "from": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "gas": 21000n,
        "maxFeePerGas": 17000000000n,
        "maxPriorityFeePerGas": 5000000000n,
        "to": "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
        "type": "eip1559",
        "value": 1000000000000000000n,
      }
    `)
	})

	test('args: maxPriorityFeePerGas (on legacy)', async () => {
		await setup()

		vi.spyOn(getBlock, 'getBlock').mockResolvedValueOnce({
			baseFeePerGas: undefined,
		} as any)

		await expect(() =>
			prepareTransactionRequest(walletClient, {
				account: privateKeyToAccount(sourceAccount.privateKey),
				to: targetAccount.address,
				maxFeePerGas: parseGwei('5'),
				value: parseEther('1'),
			}),
		).rejects.toThrowErrorMatchingInlineSnapshot(`
      "Chain does not support EIP-1559 fees.

      Version: viem@1.0.2"
    `)
	})

	test('args: maxFeePerGas + maxPriorityFeePerGas', async () => {
		await setup()

		const { nonce: _nonce, ...rest } = await prepareTransactionRequest(
			walletClient,
			{
				account: privateKeyToAccount(sourceAccount.privateKey),
				to: targetAccount.address,
				maxFeePerGas: parseGwei('10'),
				maxPriorityFeePerGas: parseGwei('5'),
				value: parseEther('1'),
			},
		)
		expect(rest).toMatchInlineSnapshot(`
      {
        "account": {
          "address": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
          "publicKey": "0x048318535b54105d4a7aae60c08fc45f9687181b4fdfc625bd1a753fa7397fed753547f11ca8696646f2f3acb08e31016afac23e630c5d11f59f61fef57b0d2aa5",
          "signMessage": [Function],
          "signTransaction": [Function],
          "signTypedData": [Function],
          "source": "privateKey",
          "type": "local",
        },
        "from": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "gas": 21000n,
        "maxFeePerGas": 10000000000n,
        "maxPriorityFeePerGas": 5000000000n,
        "to": "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
        "type": "eip1559",
        "value": 1000000000000000000n,
      }
    `)
	})

	test('args: gasPrice + maxFeePerGas', async () => {
		await setup()

		await expect(() =>
			// @ts-expect-error
			prepareTransactionRequest(walletClient, {
				account: privateKeyToAccount(sourceAccount.privateKey),
				to: targetAccount.address,
				gasPrice: parseGwei('10'),
				maxFeePerGas: parseGwei('20'),
				value: parseEther('1'),
			}),
		).rejects.toThrowError(
			'Cannot specify both a `gasPrice` and a `maxFeePerGas`/`maxPriorityFeePerGas`.',
		)
	})

	test('args: gasPrice + maxPriorityFeePerGas', async () => {
		await setup()

		await expect(() =>
			// @ts-expect-error
			prepareTransactionRequest(walletClient, {
				account: privateKeyToAccount(sourceAccount.privateKey),
				to: targetAccount.address,
				gasPrice: parseGwei('10'),
				maxPriorityFeePerGas: parseGwei('20'),
				type: 'legacy',
				value: parseEther('1'),
			}),
		).rejects.toThrowErrorMatchingInlineSnapshot(`
      "Chain does not support EIP-1559 fees.

      Version: viem@1.0.2"
    `)
	})

	test('args: type', async () => {
		await setup()

		const { nonce: _nonce, ...rest } = await prepareTransactionRequest(
			walletClient,
			{
				account: privateKeyToAccount(sourceAccount.privateKey),
				to: targetAccount.address,
				type: 'eip1559',
				value: parseEther('1'),
			},
		)
		expect(rest).toMatchInlineSnapshot(`
      {
        "account": {
          "address": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
          "publicKey": "0x048318535b54105d4a7aae60c08fc45f9687181b4fdfc625bd1a753fa7397fed753547f11ca8696646f2f3acb08e31016afac23e630c5d11f59f61fef57b0d2aa5",
          "signMessage": [Function],
          "signTransaction": [Function],
          "signTypedData": [Function],
          "source": "privateKey",
          "type": "local",
        },
        "from": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "gas": 21000n,
        "maxFeePerGas": 30500000000n,
        "maxPriorityFeePerGas": 18500000000n,
        "to": "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
        "type": "eip1559",
        "value": 1000000000000000000n,
      }
    `)
	})

	test('chain default priority fee', async () => {
		await setup()

		const block = await getBlock.getBlock(publicClient)

		// client chain
		const client_1 = createWalletClient({
			chain: {
				...anvilChain,
				fees: {
					defaultPriorityFee: () => parseGwei('69'),
				},
			},
			transport: http(),
		})
		const request_1 = await prepareTransactionRequest(client_1, {
			account: privateKeyToAccount(sourceAccount.privateKey),
			to: targetAccount.address,
			value: parseEther('1'),
		})
		expect(request_1.maxFeePerGas).toEqual(
			(block.baseFeePerGas! * 120n) / 100n + parseGwei('69'),
		)

		// client chain (async)
		const client_2 = createWalletClient({
			chain: {
				...anvilChain,
				fees: {
					defaultPriorityFee: async () => parseGwei('69'),
				},
			},
			transport: http(),
		})
		const request_2 = await prepareTransactionRequest(client_2, {
			account: privateKeyToAccount(sourceAccount.privateKey),
			to: targetAccount.address,
			value: parseEther('1'),
		})
		expect(request_2.maxFeePerGas).toEqual(
			(block.baseFeePerGas! * 120n) / 100n + parseGwei('69'),
		)

		// client chain (bigint)
		const client_3 = createWalletClient({
			chain: {
				...anvilChain,
				fees: {
					defaultPriorityFee: parseGwei('69'),
				},
			},
			transport: http(),
		})
		const request_3 = await prepareTransactionRequest(client_3, {
			account: privateKeyToAccount(sourceAccount.privateKey),
			to: targetAccount.address,
			value: parseEther('1'),
		})
		expect(request_3.maxFeePerGas).toEqual(
			(block.baseFeePerGas! * 120n) / 100n + parseGwei('69'),
		)

		// chain override (bigint)
		const request_4 = await prepareTransactionRequest(walletClient, {
			account: privateKeyToAccount(sourceAccount.privateKey),
			chain: {
				...anvilChain,
				fees: {
					defaultPriorityFee: () => parseGwei('69'),
				},
			},
			to: targetAccount.address,
			value: parseEther('1'),
		})
		expect(request_4.maxFeePerGas).toEqual(
			(block.baseFeePerGas! * 120n) / 100n + parseGwei('69'),
		)

		// chain override (async)
		const request_5 = await prepareTransactionRequest(walletClient, {
			account: privateKeyToAccount(sourceAccount.privateKey),
			chain: {
				...anvilChain,
				fees: {
					defaultPriorityFee: async () => parseGwei('69'),
				},
			},
			to: targetAccount.address,
			value: parseEther('1'),
		})
		expect(request_5.maxFeePerGas).toEqual(
			(block.baseFeePerGas! * 120n) / 100n + parseGwei('69'),
		)

		// chain override (bigint)
		const request_6 = await prepareTransactionRequest(walletClient, {
			account: privateKeyToAccount(sourceAccount.privateKey),
			chain: {
				...anvilChain,
				fees: {
					defaultPriorityFee: parseGwei('69'),
				},
			},
			to: targetAccount.address,
			value: parseEther('1'),
		})
		expect(request_6.maxFeePerGas).toEqual(
			(block.baseFeePerGas! * 120n) / 100n + parseGwei('69'),
		)

		// chain override (bigint zero base fee)
		const request_7 = await prepareTransactionRequest(walletClient, {
			account: privateKeyToAccount(sourceAccount.privateKey),
			chain: {
				...anvilChain,
				fees: {
					defaultPriorityFee: 0n,
				},
			},
			to: targetAccount.address,
			value: parseEther('1'),
		})
		expect(request_7.maxPriorityFeePerGas).toEqual(0n)

		// chain override (async zero base fee)
		const request_8 = await prepareTransactionRequest(walletClient, {
			account: privateKeyToAccount(sourceAccount.privateKey),
			chain: {
				...anvilChain,
				fees: {
					defaultPriorityFee: async () => 0n,
				},
			},
			to: targetAccount.address,
			value: parseEther('1'),
		})
		expect(request_8.maxPriorityFeePerGas).toEqual(0n)
	})

	test('no account', async () => {
		await setup()

		await expect(() =>
			// @ts-expect-error
			prepareTransactionRequest(walletClient, {
				to: targetAccount.address,
				value: parseEther('1'),
			}),
		).rejects.toThrowErrorMatchingInlineSnapshot(`
      "Could not find an Account to execute with this Action.
      Please provide an Account with the \`account\` argument on the Action, or by supplying an \`account\` to the WalletClient.

      Version: viem@1.0.2"
    `)
	})
})
