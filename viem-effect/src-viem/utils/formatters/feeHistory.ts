import type { ErrorType } from '../../errors/utils.js'
import type { FeeHistory } from '../../types/fee.js'
import type { RpcFeeHistory } from '../../types/rpc.js'

export type FormatFeeHistoryErrorType = ErrorType

export function formatFeeHistory(feeHistory: RpcFeeHistory): FeeHistory {
  return {
    baseFeePerGas: feeHistory.baseFeePerGas.map((value) => BigInt(value)),
    gasUsedRatio: feeHistory.gasUsedRatio,
    oldestBlock: BigInt(feeHistory.oldestBlock),
    reward: feeHistory.reward?.map((reward) =>
      reward.map((value) => BigInt(value)),
    ),
  }
}
