import type { ChainFormatter } from '../../types/chain.js'
/**
 * @description Picks out the keys from `value` that exist in the formatter.
 */
export declare function extract(
	value: Record<string, unknown>,
	{
		format,
	}: {
		format?: ChainFormatter['format']
	},
): Record<string, unknown>
//# sourceMappingURL=extract.d.ts.map
