import { describe, expect, it } from 'vitest'
import { getForkBlockTag } from './getForkBlockTag.js'

describe('getForkBlockTag', () => {
	it('should return undefined if fork option is not provided', () => {
		const baseState = {
			options: {},
		} as any
		expect(getForkBlockTag(baseState)).toBeUndefined()
	})

	it('should return { blockTag: "latest" } if blockTag is undefined', () => {
		const baseState = {
			options: {
				fork: {},
			},
		} as any
		expect(getForkBlockTag(baseState)).toEqual({ blockTag: 'latest' })
	})

	it('should return { blockNumber } if blockTag is a bigint', () => {
		const baseState = {
			options: {
				fork: {
					blockTag: 123456789n,
				},
			},
		} as any
		expect(getForkBlockTag(baseState)).toEqual({ blockNumber: 123456789n })
	})

	it('should return { blockTag } if blockTag is a string', () => {
		const baseState = {
			options: {
				fork: {
					blockTag: '0xabcdef',
				},
			},
		} as any
		expect(getForkBlockTag(baseState)).toEqual({ blockTag: '0xabcdef' } as any)
	})
})
