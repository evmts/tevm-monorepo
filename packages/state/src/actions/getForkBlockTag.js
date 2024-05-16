/**
 * If this does not exist an empty `Uint8Array` is returned.
 * @param {import("../BaseState.js").BaseState} baseState
 * @returns {undefined | {blockTag: import("viem").BlockTag} | { blockNumber: bigint}}
 */
export const getForkBlockTag = ({ options: { fork } }) => {
	if (!fork) {
		return undefined
	}
	if (fork.blockTag === undefined) {
		return { blockTag: 'latest' }
	}
	if (typeof fork.blockTag === 'bigint') {
		return { blockNumber: fork.blockTag }
	}
	return { blockTag: fork.blockTag }
}
