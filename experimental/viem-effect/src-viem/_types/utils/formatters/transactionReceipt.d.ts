import type {
	Chain,
	ExtractChainFormatterReturnType,
} from '../../types/chain.js'
import type { RpcTransactionReceipt } from '../../types/rpc.js'
import type { TransactionReceipt } from '../../types/transaction.js'
export type FormattedTransactionReceipt<
	TChain extends Chain | undefined = Chain | undefined,
> = ExtractChainFormatterReturnType<
	TChain,
	'transactionReceipt',
	TransactionReceipt
>
export declare function formatTransactionReceipt(
	transactionReceipt: Partial<RpcTransactionReceipt>,
): TransactionReceipt
export declare const defineTransactionReceipt: <
	TOverrideParameters,
	TOverrideReturnType,
	TExclude extends (keyof RpcTransactionReceipt)[] = [],
>({
	exclude,
	format: overrides,
}: {
	exclude?: TExclude | undefined
	format: (_: TOverrideParameters) => TOverrideReturnType
}) => {
	exclude: TExclude | undefined
	format: (
		args: import('../../types/utils.js').Assign<
			Partial<RpcTransactionReceipt>,
			TOverrideParameters
		>,
	) => (import('../../types/utils.js').Assign<
		TransactionReceipt,
		TOverrideReturnType
	> extends infer T
		? {
				[K in keyof T]: import('../../types/utils.js').Assign<
					TransactionReceipt,
					TOverrideReturnType
				>[K]
		  }
		: never) & { [K_1 in TExclude[number]]: never }
	type: 'transactionReceipt'
}
//# sourceMappingURL=transactionReceipt.d.ts.map
