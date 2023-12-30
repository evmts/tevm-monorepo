import type {
	AccountSource,
	CustomSource,
	JsonRpcAccount,
	LocalAccount,
} from './types.js'
import type { Address } from 'abitype'
type GetAccountReturnType<TAccountSource extends AccountSource> =
	| (TAccountSource extends Address ? JsonRpcAccount : never)
	| (TAccountSource extends CustomSource ? LocalAccount : never)
/**
 * @description Creates an Account from a custom signing implementation.
 *
 * @returns A Local Account.
 */
export declare function toAccount<TAccountSource extends AccountSource>(
	source: TAccountSource,
): GetAccountReturnType<TAccountSource>
export {}
//# sourceMappingURL=toAccount.d.ts.map
