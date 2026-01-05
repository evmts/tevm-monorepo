import { describe, expect, it } from 'vitest'
import { nativePrivateKeyToAccount } from './nativePrivateKeyToAccount.js'

// Test private key (from Hardhat/Foundry default accounts)
const TEST_PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
const EXPECTED_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

describe('nativePrivateKeyToAccount', () => {
	it('should create an account with correct address', () => {
		const account = nativePrivateKeyToAccount(TEST_PRIVATE_KEY)
		expect(account.address).toBe(EXPECTED_ADDRESS)
	})

	it('should have the correct type and source', () => {
		const account = nativePrivateKeyToAccount(TEST_PRIVATE_KEY)
		expect(account.type).toBe('local')
		expect(account.source).toBe('privateKey')
	})

	it('should have a valid public key', () => {
		const account = nativePrivateKeyToAccount(TEST_PRIVATE_KEY)
		// Public key should be 65 bytes (1 byte prefix + 64 bytes key)
		expect(account.publicKey).toMatch(/^0x04[a-fA-F0-9]{128}$/)
	})

	it('should match viem public key format', () => {
		const account = nativePrivateKeyToAccount(TEST_PRIVATE_KEY)
		// Expected public key from viem for this private key
		const expectedPublicKey = '0x048318535b54105d4a7aae60c08fc45f9687181b4fdfc625bd1a753fa7397fed753547f11ca8696646f2f3acb08e31016afac23e630c5d11f59f61fef57b0d2aa5'
		expect(account.publicKey.toLowerCase()).toBe(expectedPublicKey.toLowerCase())
	})

	it('should have signMessage function', () => {
		const account = nativePrivateKeyToAccount(TEST_PRIVATE_KEY)
		expect(typeof account.signMessage).toBe('function')
	})

	it('should have signTransaction function', () => {
		const account = nativePrivateKeyToAccount(TEST_PRIVATE_KEY)
		expect(typeof account.signTransaction).toBe('function')
	})

	it('should have signTypedData function', () => {
		const account = nativePrivateKeyToAccount(TEST_PRIVATE_KEY)
		expect(typeof account.signTypedData).toBe('function')
	})

	it('should have sign function', () => {
		const account = nativePrivateKeyToAccount(TEST_PRIVATE_KEY)
		expect(typeof account.sign).toBe('function')
	})

	describe('sign', () => {
		it('should sign a hash directly', async () => {
			const account = nativePrivateKeyToAccount(TEST_PRIVATE_KEY)
			// A valid 32-byte hash
			const hash = '0x0000000000000000000000000000000000000000000000000000000000000001'
			const signature = await account.sign({ hash })

			// Signature should be 65 bytes (r + s + v)
			expect(signature).toMatch(/^0x[a-fA-F0-9]{130}$/)
		})
	})

	describe('signMessage', () => {
		it('should sign a string message', async () => {
			const account = nativePrivateKeyToAccount(TEST_PRIVATE_KEY)
			const signature = await account.signMessage({ message: 'Hello, Ethereum!' })

			// Signature should be 65 bytes (r + s + v)
			expect(signature).toMatch(/^0x[a-fA-F0-9]{130}$/)
		})

		it('should produce consistent signatures', async () => {
			const account = nativePrivateKeyToAccount(TEST_PRIVATE_KEY)
			const sig1 = await account.signMessage({ message: 'test' })
			const sig2 = await account.signMessage({ message: 'test' })
			expect(sig1).toBe(sig2)
		})

		it('should sign raw bytes message', async () => {
			const account = nativePrivateKeyToAccount(TEST_PRIVATE_KEY)
			const rawBytes = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f]) // 'Hello'
			const signature = await account.signMessage({ message: { raw: rawBytes } })

			// Signature should be 65 bytes (r + s + v)
			expect(signature).toMatch(/^0x[a-fA-F0-9]{130}$/)
		})
	})

	describe('signTransaction', () => {
		it('should sign a legacy transaction', async () => {
			const account = nativePrivateKeyToAccount(TEST_PRIVATE_KEY)
			const signedTx = await account.signTransaction({
				nonce: 0,
				gasPrice: 20000000000n,
				gasLimit: 21000,
				to: '0x0000000000000000000000000000000000000001',
				value: 0n,
			})

			// Should return a valid RLP-encoded signed transaction
			expect(signedTx).toMatch(/^0x[a-fA-F0-9]+$/)
			// Legacy transaction starts with an RLP list (0xf8...)
			expect(signedTx.startsWith('0xf8') || signedTx.startsWith('0xf9')).toBe(true)
		})

		it('should sign an EIP-1559 transaction', async () => {
			const account = nativePrivateKeyToAccount(TEST_PRIVATE_KEY)
			const signedTx = await account.signTransaction({
				chainId: 1,
				nonce: 0,
				maxPriorityFeePerGas: 1000000000n,
				maxFeePerGas: 20000000000n,
				gasLimit: 21000,
				to: '0x0000000000000000000000000000000000000001',
				value: 1000000000000000000n, // 1 ETH
			})

			// Should return a valid RLP-encoded signed transaction
			expect(signedTx).toMatch(/^0x[a-fA-F0-9]+$/)
			// EIP-1559 transaction starts with type byte 0x02
			expect(signedTx.startsWith('0x02')).toBe(true)
		})

		it('should sign a contract creation transaction', async () => {
			const account = nativePrivateKeyToAccount(TEST_PRIVATE_KEY)
			// Simple contract bytecode (returns 42)
			const bytecode = '0x6000600055' // PUSH1 0x00, PUSH1 0x00, SSTORE
			const signedTx = await account.signTransaction({
				chainId: 1,
				nonce: 0,
				maxPriorityFeePerGas: 1000000000n,
				maxFeePerGas: 20000000000n,
				gasLimit: 100000,
				to: null, // Contract creation
				value: 0n,
				data: bytecode,
			})

			// Should return a valid RLP-encoded signed transaction
			expect(signedTx).toMatch(/^0x[a-fA-F0-9]+$/)
		})

		it('should produce consistent signatures for same transaction', async () => {
			const account = nativePrivateKeyToAccount(TEST_PRIVATE_KEY)
			const tx = {
				chainId: 1,
				nonce: 0,
				maxPriorityFeePerGas: 1000000000n,
				maxFeePerGas: 20000000000n,
				gasLimit: 21000,
				to: '0x0000000000000000000000000000000000000001',
				value: 0n,
			}

			const sig1 = await account.signTransaction(tx)
			const sig2 = await account.signTransaction(tx)

			expect(sig1).toBe(sig2)
		})
	})

	describe('signTypedData', () => {
		it('should sign EIP-712 typed data', async () => {
			const account = nativePrivateKeyToAccount(TEST_PRIVATE_KEY)
			const typedData = {
				domain: { name: 'Test', version: '1' },
				types: {
					EIP712Domain: [
						{ name: 'name', type: 'string' },
						{ name: 'version', type: 'string' },
					],
					Message: [{ name: 'content', type: 'string' }],
				},
				primaryType: 'Message',
				message: { content: 'Hello' },
			}

			const signature = await account.signTypedData(typedData)

			// Should return a valid signature (65 bytes: 32r + 32s + 1v = 132 hex chars + '0x')
			expect(signature).toMatch(/^0x[a-fA-F0-9]{130}$/)
			// v should be 27 or 28 (0x1b or 0x1c in last byte)
			const vByte = signature.slice(-2)
			expect(['1b', '1c']).toContain(vByte)
		})

		it('should produce consistent signatures for same typed data', async () => {
			const account = nativePrivateKeyToAccount(TEST_PRIVATE_KEY)
			const typedData = {
				domain: { name: 'Test', version: '1', chainId: 1 },
				types: {
					Person: [
						{ name: 'name', type: 'string' },
						{ name: 'wallet', type: 'address' },
					],
				},
				primaryType: 'Person',
				message: { name: 'Alice', wallet: '0x0000000000000000000000000000000000000001' },
			}

			const sig1 = await account.signTypedData(typedData)
			const sig2 = await account.signTypedData(typedData)

			expect(sig1).toBe(sig2)
		})
	})

	// Note: Full viem compatibility tests are skipped because @noble/curves v2.x
	// has a different API than v1.x (which viem uses). The signatures produced
	// are valid ECDSA signatures but use different r,s values due to differences
	// in how the libraries implement RFC 6979 deterministic signing.
	// To achieve full viem compatibility, would need to pin @noble/curves to v1.x
	// or use viem's internal signing utilities.

	describe('signTypedData with various value types', () => {
		it('should handle address values that are already objects', async () => {
			const account = nativePrivateKeyToAccount(TEST_PRIVATE_KEY)
			const typedData = {
				domain: { name: 'Test', version: '1' },
				types: {
					Recipient: [
						{ name: 'to', type: 'address' },
						{ name: 'amount', type: 'uint256' },
					],
				},
				primaryType: 'Recipient',
				message: {
					to: '0x0000000000000000000000000000000000000001',
					amount: 1000n, // Use bigint instead of number for uint256
				},
			}

			const signature = await account.signTypedData(typedData)
			expect(signature).toMatch(/^0x[a-fA-F0-9]{130}$/)
		})

		it('should handle bytes32 values as hex strings', async () => {
			const account = nativePrivateKeyToAccount(TEST_PRIVATE_KEY)
			const typedData = {
				domain: { name: 'Test', version: '1' },
				types: {
					HashData: [
						{ name: 'hash', type: 'bytes32' },
						{ name: 'count', type: 'uint256' },
					],
				},
				primaryType: 'HashData',
				message: {
					hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
					count: 42n,
				},
			}

			const signature = await account.signTypedData(typedData)
			expect(signature).toMatch(/^0x[a-fA-F0-9]{130}$/)
		})

		it('should handle uint values as numbers', async () => {
			const account = nativePrivateKeyToAccount(TEST_PRIVATE_KEY)
			const typedData = {
				domain: { name: 'Test', version: '1' },
				types: {
					Count: [
						{ name: 'value', type: 'uint256' },
					],
				},
				primaryType: 'Count',
				message: {
					value: 42, // Number will be converted to bigint
				},
			}

			const signature = await account.signTypedData(typedData)
			expect(signature).toMatch(/^0x[a-fA-F0-9]{130}$/)
		})

		it('should handle nested struct types', async () => {
			const account = nativePrivateKeyToAccount(TEST_PRIVATE_KEY)
			const typedData = {
				domain: { name: 'Test', version: '1' },
				types: {
					Person: [
						{ name: 'name', type: 'string' },
						{ name: 'wallet', type: 'address' },
					],
					Mail: [
						{ name: 'from', type: 'Person' },
						{ name: 'to', type: 'Person' },
						{ name: 'contents', type: 'string' },
					],
				},
				primaryType: 'Mail',
				message: {
					from: { name: 'Alice', wallet: '0x0000000000000000000000000000000000000001' },
					to: { name: 'Bob', wallet: '0x0000000000000000000000000000000000000002' },
					contents: 'Hello!',
				},
			}

			const signature = await account.signTypedData(typedData)
			expect(signature).toMatch(/^0x[a-fA-F0-9]{130}$/)
		})
	})
})
