import type { BlockHeaderBytes } from './BlockHeaderBytes.js'
import type { ExecutionWitnessBytes } from './ExecutionWitnessBytes.js'
import type { RequestsBytes } from './RequestBytes.js'
import type { TransactionsBytes } from './TransactionsBytes.js'
import type { UncleHeadersBytes } from './UncleHeaderBytes.js'
import type { WithdrawalsBytes } from './WithdrawalsBytes.js'

export type BlockBytes =
	| [BlockHeaderBytes, TransactionsBytes, UncleHeadersBytes]
	| [BlockHeaderBytes, TransactionsBytes, UncleHeadersBytes, WithdrawalsBytes]
	| [BlockHeaderBytes, TransactionsBytes, UncleHeadersBytes, WithdrawalsBytes, RequestsBytes]
	| [BlockHeaderBytes, TransactionsBytes, UncleHeadersBytes, WithdrawalsBytes, RequestsBytes, ExecutionWitnessBytes]
