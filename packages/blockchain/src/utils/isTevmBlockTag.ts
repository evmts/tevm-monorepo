const tevmBlockTags = ['latest', 'earliest', 'pending', 'safe', 'finalized', 'forked'] as const
/**
 * All supported block tags for tevm by tag
 * Note these are supported by type but may not be on the given tevm client
 */
export type TevmBlockTag = (typeof tevmBlockTags)[number]

/**
 * Determines if an unknown type is a valid block tag
 * @param {unknown} blockTag
 * @returns {boolean} true if valid block tag
 */
export function isTevmBlockTag(blockTag: string): blockTag is TevmBlockTag {
	return typeof blockTag === 'string' && tevmBlockTags.includes(blockTag as TevmBlockTag)
}
