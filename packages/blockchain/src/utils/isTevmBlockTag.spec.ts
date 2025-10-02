import { describe, expect, it } from 'vitest'
import { isTevmBlockTag, type TevmBlockTag } from './isTevmBlockTag.js'

describe(isTevmBlockTag.name, () => {
	it('should return true for valid block tags', () => {
		const validTags: TevmBlockTag[] = ['latest', 'earliest', 'pending', 'safe', 'finalized', 'forked']
		validTags.forEach((tag) => {
			expect(isTevmBlockTag(tag)).toBe(true)
		})
	})

	it('should return false for invalid block tags', () => {
		const invalidTags = ['newest', 'oldest', 'confirmed', '', null, undefined, 123, {}, []]
		invalidTags.forEach((tag) => {
			expect(isTevmBlockTag(tag as any)).toBe(false)
		})
	})

	it('should return false for non-string inputs', () => {
		const nonStringInputs = [123, null, undefined, {}, [], true, false]
		nonStringInputs.forEach((input) => {
			expect(isTevmBlockTag(input as any)).toBe(false)
		})
	})

	it('should be able to infer the type of the block tag', () => {
		const latest = 'latest' as string
		// @ts-expect-error
		latest satisfies TevmBlockTag
		if (isTevmBlockTag(latest)) {
			latest satisfies TevmBlockTag
		}
	})
})
