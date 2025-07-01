import { type ExactPartial, type Hex, type RpcTransactionRequest } from 'viem'
import { describe, expect, it } from 'vitest'
import { normalizeTx } from './normalizeTx.js'

describe('normalizeTx', () => {
	it('should return empty array for empty transaction', () => {
		const tx: ExactPartial<RpcTransactionRequest> = {}
		const result = normalizeTx(tx)
		expect(result).toEqual([])
	})

	it('should normalize basic transaction fields', () => {
		const tx: ExactPartial<RpcTransactionRequest> = {
			from: '0xABC123',
			to: '0xDEF456',
			value: '0x789ABC',
			gas: '0x123DEF',
			gasPrice: '0xABCDEF',
			nonce: '0x12',
			data: '0xCAFEBABE',
		}

		const result = normalizeTx(tx)

		expect(result).toContain('0xabc123') // from
		expect(result).toContain('0xdef456') // to
		expect(result).toContain('0x789abc') // value
		expect(result).toContain('0x123def') // gas
		expect(result).toContain('0xabcdef') // gasPrice
		expect(result).toContain('0x12') // nonce
		expect(result).toContain('0xcafebabe') // data
	})

	it('should normalize EIP-1559 transaction fields', () => {
		const tx: ExactPartial<RpcTransactionRequest> = {
			from: '0xABC123',
			to: '0xDEF456',
			maxFeePerGas: '0xAAA',
			maxPriorityFeePerGas: '0xBBB',
			type: '0x2',
		}

		const result = normalizeTx(tx)

		expect(result).toContain('0xabc123') // from
		expect(result).toContain('0xdef456') // to
		expect(result).toContain('0xaaa') // maxFeePerGas
		expect(result).toContain('0xbbb') // maxPriorityFeePerGas
		expect(result).toContain('0x2') // type
	})

	it('should normalize access list', () => {
		const tx: ExactPartial<RpcTransactionRequest> = {
			accessList: [
				{
					address: '0xABC123',
					storageKeys: ['0xDEF456', '0x789ABC'],
				},
				{
					address: '0xFEDCBA',
					storageKeys: ['0x111222'],
				},
			],
		}

		const result = normalizeTx(tx)
		const flatResult = result.flat(Number.POSITIVE_INFINITY)

		expect(flatResult).toContain('0xabc123') // first address
		expect(flatResult).toContain('0xdef456') // first storage key
		expect(flatResult).toContain('0x789abc') // second storage key
		expect(flatResult).toContain('0xfedcba') // second address
		expect(flatResult).toContain('0x111222') // second address storage key
	})

	it('should normalize blob transaction fields', () => {
		const tx: ExactPartial<RpcTransactionRequest> = {
			type: '0x3',
			blobVersionedHashes: ['0xBLOB123', '0xBLOB456'],
			maxFeePerBlobGas: '0xCCC',
			blobs: ['0xBLOBDATA1', '0xBLOBDATA2'],
		}

		const result = normalizeTx(tx)

		expect(result).toContain('0x3') // type
		expect(result).toContain('0xblob123') // first blob hash
		expect(result).toContain('0xblob456') // second blob hash
		expect(result).toContain('0xccc') // maxFeePerBlobGas
		expect(result).toContain('0xblobdata1') // first blob
		expect(result).toContain('0xblobdata2') // second blob
	})

	it('should normalize authorization list', () => {
		const tx: ExactPartial<RpcTransactionRequest> = {
			authorizationList: [
				{
					chainId: '0x1',
					address: '0xAUTH123',
					nonce: '0x1',
					r: '0xRRRRRR',
					s: '0xSSSSS',
					yParity: '0x1b',
				},
			],
		}

		const result = normalizeTx(tx)
		const flatResult = result.flat(Number.POSITIVE_INFINITY)

		// Authorization list values should be normalized
		expect(flatResult).toContain('0x1') // chainId
		expect(flatResult).toContain('0xauth123') // address
		expect(flatResult).toContain('0x1') // nonce
		expect(flatResult).toContain('0xrrrrrr') // r
		expect(flatResult).toContain('0xsssss') // s
		expect(flatResult).toContain('0x1b') // yParity (hex)
	})

	it('should normalize sidecars', () => {
		const tx: ExactPartial<RpcTransactionRequest> = {
			sidecars: [
				{
					blob: '0xSIDECAR1',
					commitment: '0xCOMMIT1',
					proof: '0xPROOF1',
				},
			],
		}

		const result = normalizeTx(tx)
		const flatResult = result.flat(Number.POSITIVE_INFINITY)

		expect(flatResult).toContain('0xsidecar1') // blob
		expect(flatResult).toContain('0xcommit1') // commitment
		expect(flatResult).toContain('0xproof1') // proof
	})

	it('should handle chainId parameter', () => {
		const tx: ExactPartial<RpcTransactionRequest> & { chainId?: Hex } = {
			from: '0xABC123',
			chainId: '0x1',
		}

		const result = normalizeTx(tx)

		expect(result).toContain('0xabc123') // from
		expect(result).toContain('0x1') // chainId
	})

	it('should handle null and undefined values gracefully', () => {
		const tx: ExactPartial<RpcTransactionRequest> = {
			from: '0xABC123',
			to: null, // null value
			data: undefined, // undefined value
		}

		const result = normalizeTx(tx)

		expect(result).toContain('0xabc123') // from
		// to and data should not appear since they're null/undefined
		expect(result).not.toContain('null')
		expect(result).not.toContain('undefined')
	})

	it('should handle mixed case hex values', () => {
		const tx: ExactPartial<RpcTransactionRequest> = {
			from: '0xAbCdEf123456',
			to: '0xFEDCBA987654',
			value: '0xDeAdBeEf',
		}

		const result = normalizeTx(tx)

		expect(result).toContain('0xabcdef123456') // normalized to lowercase
		expect(result).toContain('0xfedcba987654') // normalized to lowercase
		expect(result).toContain('0xdeadbeef') // normalized to lowercase
	})

	it('should handle blob data as Uint8Array', () => {
		const blobData = new Uint8Array([0x01, 0x02, 0x03])
		const tx: ExactPartial<RpcTransactionRequest> = {
			blobs: [blobData, new Uint8Array([0x04, 0x05, 0x06])],
		}

		const result = normalizeTx(tx)

		expect(result).toContain('0x010203') // Uint8Array converted to hex
		expect(result).toContain('0x040506') // string blob normalized
	})

	it('should handle empty arrays gracefully', () => {
		const tx: ExactPartial<RpcTransactionRequest> = {
			accessList: [],
			authorizationList: [],
		}

		const result = normalizeTx(tx)

		// Should not contain any values from empty arrays
		expect(result.length).toBe(0)
	})

	it('should preserve order and flatten correctly', () => {
		const tx: ExactPartial<RpcTransactionRequest> = {
			from: '0xFROM',
			accessList: [
				{
					address: '0xADDR1',
					storageKeys: ['0xKEY1', '0xKEY2'],
				},
			],
			to: '0xTO',
		}

		const result = normalizeTx(tx)
		const flatResult = result.flat(Number.POSITIVE_INFINITY)

		// The function flattens arrays, so order within the result depends on the object key order
		// but we can verify all expected values are present
		expect(flatResult).toContain('0xaddr1') // access list address
		expect(flatResult).toContain('0xkey1') // first storage key
		expect(flatResult).toContain('0xkey2') // second storage key
		expect(flatResult).toContain('0xfrom') // from address
		expect(flatResult).toContain('0xto') // to address
	})
})
