/**
 * @typedef {'latest' | 'earliest' | 'pending' | 'safe' | 'finalized' | 'forked'} TevmBlockTag
 */

/**
 * All supported block tags for tevm by tag
 * Note these are supported by type but may not be on the given tevm client
 * @type {Array<TevmBlockTag>}
 */
const tevmBlockTags = ['latest', 'earliest', 'pending', 'safe', 'finalized', 'forked']

/**
 * Determines if an unknown type is a valid block tag
 * @param {unknown} blockTag
 * @returns {blockTag is TevmBlockTag} true if valid block tag
 */
export function isTevmBlockTag(blockTag) {
	return typeof blockTag === 'string' && tevmBlockTags.includes(/** @type {TevmBlockTag}*/ (blockTag))
}
