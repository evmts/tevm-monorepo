import { secp256k1 } from '@noble/curves/secp256k1'

import type { Hex } from '../types/misc.js'
import { type ToHexErrorType, toHex } from '../utils/encoding/toHex.js'

import type { ErrorType } from '../errors/utils.js'
import { type ToAccountErrorType, toAccount } from './toAccount.js'
import type { PrivateKeyAccount } from './types.js'
import {
  type PublicKeyToAddressErrorType,
  publicKeyToAddress,
} from './utils/publicKeyToAddress.js'
import { type SignMessageErrorType, signMessage } from './utils/signMessage.js'
import {
  type SignTransactionErrorType,
  signTransaction,
} from './utils/signTransaction.js'
import {
  type SignTypedDataErrorType,
  signTypedData,
} from './utils/signTypedData.js'

export type PrivateKeyToAccountErrorType =
  | ToAccountErrorType
  | ToHexErrorType
  | PublicKeyToAddressErrorType
  | SignMessageErrorType
  | SignTransactionErrorType
  | SignTypedDataErrorType
  | ErrorType

/**
 * @description Creates an Account from a private key.
 *
 * @returns A Private Key Account.
 */
export function privateKeyToAccount(privateKey: Hex): PrivateKeyAccount {
  const publicKey = toHex(secp256k1.getPublicKey(privateKey.slice(2), false))
  const address = publicKeyToAddress(publicKey)

  const account = toAccount({
    address,
    async signMessage({ message }) {
      return signMessage({ message, privateKey })
    },
    async signTransaction(transaction, { serializer } = {}) {
      return signTransaction({ privateKey, transaction, serializer })
    },
    async signTypedData(typedData) {
      return signTypedData({ ...typedData, privateKey })
    },
  })

  return {
    ...account,
    publicKey,
    source: 'privateKey',
  }
}
