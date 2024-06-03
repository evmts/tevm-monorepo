import type { TransactionsBytes } from './TransactionsBytes.js'
import type { UncleHeadersBytes } from './UncleHeaderBytes.js'
import type { WithdrawalsBytes } from './WithdrawalsBytes.js'

export type BlockBodyBytes = [TransactionsBytes, UncleHeadersBytes, WithdrawalsBytes?, Uint8Array?]
