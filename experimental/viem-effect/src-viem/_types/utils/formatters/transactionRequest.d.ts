import type {
	Chain,
	ExtractChainFormatterParameters,
} from '../../types/chain.js'
import type { RpcTransactionRequest } from '../../types/rpc.js'
import type { TransactionRequest } from '../../types/transaction.js'
export type FormattedTransactionRequest<
	TChain extends Chain | undefined = Chain | undefined,
> = ExtractChainFormatterParameters<
	TChain,
	'transactionRequest',
	TransactionRequest
>
export declare const rpcTransactionType: {
	readonly legacy: '0x0'
	readonly eip2930: '0x1'
	readonly eip1559: '0x2'
}
export declare function formatTransactionRequest(
	transactionRequest: Partial<TransactionRequest>,
): RpcTransactionRequest
export declare const defineTransactionRequest: <
	TOverrideParameters,
	TOverrideReturnType,
	TExclude extends (
		| 'type'
		| 'from'
		| 'gas'
		| 'nonce'
		| 'to'
		| 'value'
		| 'gasPrice'
		| 'maxFeePerGas'
		| 'maxPriorityFeePerGas'
		| 'accessList'
		| 'data'
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
			Partial<TransactionRequest>,
			TOverrideParameters
		>,
	) => (
		| (import('../../types/utils.js').Assign_<
				import('../../types/transaction.js').TransactionRequestLegacy<
					`0x${string}`,
					`0x${string}`,
					'0x0'
				>,
				TOverrideReturnType
		  > &
				TOverrideReturnType extends infer T
				? {
						[K in keyof T]: (import('../../types/utils.js').Assign_<
							import('../../types/transaction.js').TransactionRequestLegacy<
								`0x${string}`,
								`0x${string}`,
								'0x0'
							>,
							TOverrideReturnType
						> &
							TOverrideReturnType)[K]
				  }
				: never)
		| (import('../../types/utils.js').Assign_<
				import('../../types/transaction.js').TransactionRequestEIP2930<
					`0x${string}`,
					`0x${string}`,
					'0x1'
				>,
				TOverrideReturnType
		  > &
				TOverrideReturnType extends infer T_1
				? {
						[K_1 in keyof T_1]: (import('../../types/utils.js').Assign_<
							import('../../types/transaction.js').TransactionRequestEIP2930<
								`0x${string}`,
								`0x${string}`,
								'0x1'
							>,
							TOverrideReturnType
						> &
							TOverrideReturnType)[K_1]
				  }
				: never)
		| (import('../../types/utils.js').Assign_<
				import('../../types/transaction.js').TransactionRequestEIP1559<
					`0x${string}`,
					`0x${string}`,
					'0x2'
				>,
				TOverrideReturnType
		  > &
				TOverrideReturnType extends infer T_2
				? {
						[K_2 in keyof T_2]: (import('../../types/utils.js').Assign_<
							import('../../types/transaction.js').TransactionRequestEIP1559<
								`0x${string}`,
								`0x${string}`,
								'0x2'
							>,
							TOverrideReturnType
						> &
							TOverrideReturnType)[K_2]
				  }
				: never)
	) & { [K_3 in TExclude[number]]: never }
	type: 'transactionRequest'
}
//# sourceMappingURL=transactionRequest.d.ts.map
