import { InternalError } from '@tevm/errors'
import { mainnet } from '@tevm/common'
import { describe, expect, it } from 'vitest'
import { Block } from './block.js'
import { ClRequest } from './ClRequest.js'

describe(ClRequest.name, () => {
	it('should serialize', () => {
		const clRequest = new ClRequest(164, new Uint8Array([1, 2, 3]))
		expect(clRequest.type).toBe(164)
		expect(clRequest.bytes).toEqual(new Uint8Array([1, 2, 3]))
		expect(clRequest.serialize()).toMatchSnapshot()
	})
	it('should throw if undefined passed in as type', () => {
		expect(() => new ClRequest(undefined as any, new Uint8Array())).toThrowError(
			new InternalError('request type is required'),
		)
	})

	it('should preserve requestsRoot in execution payload conversion', async () => {
		const request = new ClRequest(1, new Uint8Array([2, 3]))
		const requestsRoot = await Block.genRequestsTrieRoot([request])
		const block = Block.fromBlockData(
			{
				header: { requestsRoot },
				requests: [request],
			},
			{ common: mainnet.copy() },
		)
		expect(block.toExecutionPayload().requestsRoot).toBe(block.toJSON().header!.requestsRoot)
	})
})
