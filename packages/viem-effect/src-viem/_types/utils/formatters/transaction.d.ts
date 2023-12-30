import type { BlockTag } from '../../types/block.js'
import type { Chain } from '../../types/chain.js'
import type {
	ExtractChainFormatterExclude,
	ExtractChainFormatterReturnType,
} from '../../types/chain.js'
import type { RpcTransaction } from '../../types/rpc.js'
import type { Transaction } from '../../types/transaction.js'
import type { UnionOmit } from '../../types/utils.js'
type TransactionPendingDependencies =
	| 'blockHash'
	| 'blockNumber'
	| 'transactionIndex'
export type FormattedTransaction<
	TChain extends
		| {
				formatters?: Chain['formatters']
		  }
		| undefined =
		| {
				formatters?: Chain['formatters']
		  }
		| undefined,
	TBlockTag extends BlockTag = BlockTag,
	_FormatterReturnType = ExtractChainFormatterReturnType<
		TChain,
		'transaction',
		Transaction
	>,
	_ExcludedPendingDependencies extends string = TransactionPendingDependencies &
		ExtractChainFormatterExclude<TChain, 'transaction'>,
> = UnionOmit<_FormatterReturnType, TransactionPendingDependencies> & {
	[K in _ExcludedPendingDependencies]: never
} & Pick<
		Transaction<bigint, number, TBlockTag extends 'pending' ? true : false>,
		TransactionPendingDependencies
	>
export declare const transactionType: {
	readonly '0x0': 'legacy'
	readonly '0x1': 'eip2930'
	readonly '0x2': 'eip1559'
}
export declare function formatTransaction(
	transaction: Partial<RpcTransaction>,
): Transaction
export declare const defineTransaction: <
	TOverrideParameters,
	TOverrideReturnType,
	TExclude extends (
		| 'type'
		| 'blockHash'
		| 'blockNumber'
		| 'from'
		| 'gas'
		| 'hash'
		| 'input'
		| 'nonce'
		| 'r'
		| 's'
		| 'to'
		| 'transactionIndex'
		| 'v'
		| 'value'
		| 'gasPrice'
		| 'maxFeePerGas'
		| 'maxPriorityFeePerGas'
		| 'accessList'
		| 'chainId'
	)[] = [],
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
			Partial<RpcTransaction>,
			TOverrideParameters
		>,
	) => (
		| (import('../../types/utils.js').Assign_<
				import('../../types/transaction.js').TransactionLegacy<
					bigint,
					number,
					boolean,
					'legacy'
				>,
				TOverrideReturnType
		  > &
				TOverrideReturnType extends infer T
				? {
						[K in keyof T]: (import('../../types/utils.js').Assign_<
							import('../../types/transaction.js').TransactionLegacy<
								bigint,
								number,
								boolean,
								'legacy'
							>,
							TOverrideReturnType
						> &
							TOverrideReturnType)[K]
				  }
				: never)
		| (import('../../types/utils.js').Assign_<
				import('../../types/transaction.js').TransactionEIP2930<
					bigint,
					number,
					boolean,
					'eip2930'
				>,
				TOverrideReturnType
		  > &
				TOverrideReturnType extends infer T_1
				? {
						[K_1 in keyof T_1]: (import('../../types/utils.js').Assign_<
							import('../../types/transaction.js').TransactionEIP2930<
								bigint,
								number,
								boolean,
								'eip2930'
							>,
							TOverrideReturnType
						> &
							TOverrideReturnType)[K_1]
				  }
				: never)
		| (import('../../types/utils.js').Assign_<
				import('../../types/transaction.js').TransactionEIP1559<
					bigint,
					number,
					boolean,
					'eip1559'
				>,
				TOverrideReturnType
		  > &
				TOverrideReturnType extends infer T_2
				? {
						[K_2 in keyof T_2]: (import('../../types/utils.js').Assign_<
							import('../../types/transaction.js').TransactionEIP1559<
								bigint,
								number,
								boolean,
								'eip1559'
							>,
							TOverrideReturnType
						> &
							TOverrideReturnType)[K_2]
				  }
				: never)
	) & { [K_3 in TExclude[number]]: never }
	type: 'transaction'
}
export {}
//# sourceMappingURL=transaction.d.ts.map
