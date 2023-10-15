import type { Address } from 'abitype'

import type { Block, BlockTag } from '../../types/block.js'
import type { FeeValuesEIP1559 } from '../../types/fee.js'
import type { Hex } from '../../types/misc.js'
import type {
  Index,
  Quantity,
  RpcBlock,
  RpcTransaction as RpcTransaction_,
  RpcTransactionReceipt,
  RpcTransactionRequest as RpcTransactionRequest_,
  TransactionType,
} from '../../types/rpc.js'
import type {
  AccessList,
  Transaction as Transaction_,
  TransactionBase,
  TransactionReceipt,
  TransactionRequest as TransactionRequest_,
  TransactionRequestBase,
  TransactionSerializable,
  TransactionSerializableBase,
  TransactionSerialized,
} from '../../types/transaction.js'
import type { NeverBy } from '../../types/utils.js'
import type { OptimismRpcTransaction } from '../optimism/types.js'

type CeloBlockExclude =
  | 'difficulty'
  | 'gasLimit'
  | 'mixHash'
  | 'nonce'
  | 'uncles'

export type CeloBlockOverrides = {
  randomness: {
    committed: Hex
    revealed: Hex
  }
}
export type CeloBlock<
  TIncludeTransactions extends boolean = boolean,
  TBlockTag extends BlockTag = BlockTag,
> = NeverBy<
  Block<
    bigint,
    TIncludeTransactions,
    TBlockTag,
    CeloTransaction<TBlockTag extends 'pending' ? true : false>
  >,
  CeloBlockExclude
> &
  CeloBlockOverrides

export type CeloRpcBlockOverrides = {
  randomness: {
    committed: Hex
    revealed: Hex
  }
}
export type CeloRpcBlock<
  TBlockTag extends BlockTag = BlockTag,
  TIncludeTransactions extends boolean = boolean,
> = NeverBy<
  RpcBlock<
    TBlockTag,
    TIncludeTransactions,
    OptimismRpcTransaction<TBlockTag extends 'pending' ? true : false>
  >,
  CeloBlockExclude
> &
  CeloRpcBlockOverrides

export type CeloRpcTransaction<TPending extends boolean = boolean> =
  | RpcTransaction<TPending>
  | RpcTransactionCIP42<TPending>

export type CeloRpcTransactionReceiptOverrides = {
  feeCurrency: Address | null
  gatewayFee: Hex | null
  gatewayFeeRecipient: Address | null
}
export type CeloRpcTransactionReceipt = RpcTransactionReceipt &
  CeloRpcTransactionReceiptOverrides

export type CeloRpcTransactionRequest =
  | RpcTransactionRequest
  | RpcTransactionRequestCIP42

export type CeloTransaction<TPending extends boolean = boolean> =
  | Transaction<TPending>
  | TransactionCIP42<TPending>

export type CeloTransactionReceiptOverrides = {
  feeCurrency: Address | null
  gatewayFee: bigint | null
  gatewayFeeRecipient: Address | null
}
export type CeloTransactionReceipt = TransactionReceipt &
  CeloTransactionReceiptOverrides

export type CeloTransactionRequest =
  | TransactionRequest
  | TransactionRequestCIP42

export type CeloTransactionSerializable =
  | TransactionSerializableCIP42
  | TransactionSerializable

export type CeloTransactionSerialized<
  TType extends CeloTransactionType = 'legacy',
> = TransactionSerialized<TType> | TransactionSerializedCIP42

export type CeloTransactionType = TransactionType | 'cip42'

type RpcTransaction<TPending extends boolean = boolean> =
  RpcTransaction_<TPending> & {
    feeCurrency: Address | null
    gatewayFee: Hex | null
    gatewayFeeRecipient: Address | null
  }

type RpcTransactionRequest = RpcTransactionRequest_ & {
  feeCurrency?: Address
  gatewayFee?: Hex
  gatewayFeeRecipient?: Address
}

export type RpcTransactionCIP42<TPending extends boolean = boolean> =
  TransactionBase<Quantity, Index, TPending> &
    FeeValuesEIP1559<Quantity> & {
      feeCurrency: Address | null
      gatewayFee: Hex | null
      gatewayFeeRecipient: Address | null
      type: '0x7c'
    }

export type RpcTransactionRequestCIP42 = TransactionRequestBase<
  Quantity,
  Index
> &
  Partial<FeeValuesEIP1559<Quantity>> & {
    accessList?: AccessList
    feeCurrency?: Address
    gatewayFee?: Hex
    gatewayFeeRecipient?: Address
    type?: '0x7c'
  }

type Transaction<TPending extends boolean = boolean> = Transaction_<
  bigint,
  number,
  TPending
> & {
  feeCurrency: Address | null
  gatewayFee: bigint | null
  gatewayFeeRecipient: Address | null
}

export type TransactionCIP42<TPending extends boolean = boolean> =
  TransactionBase<bigint, number, TPending> &
    FeeValuesEIP1559 & {
      feeCurrency: Address | null
      gatewayFee: bigint | null
      gatewayFeeRecipient: Address | null
      type: 'cip42'
    }

type TransactionRequest = TransactionRequest_ & {
  feeCurrency?: Address
  gatewayFee?: bigint
  gatewayFeeRecipient?: Address
}

export type TransactionRequestCIP42 = TransactionRequestBase &
  Partial<FeeValuesEIP1559> & {
    accessList?: AccessList
    feeCurrency?: Address
    gatewayFee?: bigint
    gatewayFeeRecipient?: Address
    type?: 'cip42'
  }

export type TransactionSerializableCIP42<
  TQuantity = bigint,
  TIndex = number,
> = TransactionSerializableBase<TQuantity, TIndex> &
  FeeValuesEIP1559<TQuantity> & {
    accessList?: AccessList
    gasPrice?: never
    feeCurrency?: Address
    gatewayFeeRecipient?: Address
    gatewayFee?: TQuantity
    chainId: number
    type?: 'cip42'
  }

export type TransactionSerializedCIP42 = `0x7c${string}`
