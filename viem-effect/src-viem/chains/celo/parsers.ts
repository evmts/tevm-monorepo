import { InvalidSerializedTransactionError } from '../../errors/transaction.js'
import type { Hex } from '../../types/misc.js'
import { isHex } from '../../utils/data/isHex.js'
import { sliceHex } from '../../utils/data/slice.js'
import { hexToBigInt, hexToNumber } from '../../utils/encoding/fromHex.js'
import type { RecursiveArray } from '../../utils/encoding/toRlp.js'
import type { GetSerializedTransactionType } from '../../utils/transaction/getSerializedTransactionType.js'
import {
  type ParseTransactionReturnType,
  parseAccessList,
  parseTransaction,
  toTransactionArray,
} from '../../utils/transaction/parseTransaction.js'
import { assertTransactionCIP42 } from './serializers.js'
import type {
  CeloTransactionSerialized,
  CeloTransactionType,
  TransactionSerializableCIP42,
  TransactionSerializedCIP42,
} from './types.js'

export type ParseTransactionCeloReturnType<
  TSerialized extends CeloTransactionSerialized = CeloTransactionSerialized,
  TType extends CeloTransactionType = GetSerializedTransactionType<TSerialized>,
> = TSerialized extends TransactionSerializedCIP42
  ? TransactionSerializableCIP42
  : ParseTransactionReturnType<TSerialized, TType>

export function parseTransactionCelo<
  TSerialized extends CeloTransactionSerialized,
>(
  serializedTransaction: TSerialized,
): ParseTransactionCeloReturnType<TSerialized> {
  const serializedType = sliceHex(serializedTransaction, 0, 1)

  if (serializedType === '0x7c')
    return parseTransactionCIP42(
      serializedTransaction as TransactionSerializedCIP42,
    ) as ParseTransactionCeloReturnType<TSerialized>

  return parseTransaction(
    serializedTransaction,
  ) as ParseTransactionCeloReturnType<TSerialized>
}

function parseTransactionCIP42(
  serializedTransaction: TransactionSerializedCIP42,
): TransactionSerializableCIP42 {
  const transactionArray = toTransactionArray(serializedTransaction)

  const [
    chainId,
    nonce,
    maxPriorityFeePerGas,
    maxFeePerGas,
    gas,
    feeCurrency,
    gatewayFeeRecipient,
    gatewayFee,
    to,
    value,
    data,
    accessList,
    v,
    r,
    s,
  ] = transactionArray

  if (transactionArray.length !== 15 && transactionArray.length !== 12) {
    throw new InvalidSerializedTransactionError({
      attributes: {
        chainId,
        nonce,
        maxPriorityFeePerGas,
        maxFeePerGas,
        gas,
        feeCurrency,
        to,
        gatewayFeeRecipient,
        gatewayFee,
        value,
        data,
        accessList,
        ...(transactionArray.length > 12
          ? {
              v,
              r,
              s,
            }
          : {}),
      },
      serializedTransaction,
      type: 'cip42',
    })
  }

  const transaction: Partial<TransactionSerializableCIP42> = {
    chainId: hexToNumber(chainId as Hex),
    type: 'cip42',
  }

  if (isHex(to) && to !== '0x') transaction.to = to
  if (isHex(gas) && gas !== '0x') transaction.gas = hexToBigInt(gas)
  if (isHex(data) && data !== '0x') transaction.data = data
  if (isHex(nonce) && nonce !== '0x') transaction.nonce = hexToNumber(nonce)
  if (isHex(value) && value !== '0x') transaction.value = hexToBigInt(value)
  if (isHex(feeCurrency) && feeCurrency !== '0x')
    transaction.feeCurrency = feeCurrency
  if (isHex(gatewayFeeRecipient) && gatewayFeeRecipient !== '0x')
    transaction.gatewayFeeRecipient = gatewayFeeRecipient
  if (isHex(gatewayFee) && gatewayFee !== '0x')
    transaction.gatewayFee = hexToBigInt(gatewayFee)
  if (isHex(maxFeePerGas) && maxFeePerGas !== '0x')
    transaction.maxFeePerGas = hexToBigInt(maxFeePerGas)
  if (isHex(maxPriorityFeePerGas) && maxPriorityFeePerGas !== '0x')
    transaction.maxPriorityFeePerGas = hexToBigInt(maxPriorityFeePerGas)
  if (accessList.length !== 0 && accessList !== '0x')
    transaction.accessList = parseAccessList(accessList as RecursiveArray<Hex>)

  assertTransactionCIP42(transaction as TransactionSerializableCIP42)

  return transaction as TransactionSerializableCIP42
}
