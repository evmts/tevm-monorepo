import type { Address, TypedData } from 'abitype'

import type { ByteArray, Hex } from '../../types/misc.js'
import type { TypedDataDefinition } from '../../types/typedData.js'
import { type GetAddressErrorType, getAddress } from '../address/getAddress.js'
import {
  type IsAddressEqualErrorType,
  isAddressEqual,
} from '../address/isAddressEqual.js'

import type { ErrorType } from '../../errors/utils.js'
import {
  type RecoverTypedDataAddressParameters,
  recoverTypedDataAddress,
} from './recoverTypedDataAddress.js'

export type VerifyTypedDataParameters<
  TTypedData extends TypedData | { [key: string]: unknown } = TypedData,
  TPrimaryType extends string = string,
> = TypedDataDefinition<TTypedData, TPrimaryType> & {
  /** The address to verify the typed data for. */
  address: Address
  /** The signature to verify */
  signature: Hex | ByteArray
}

export type VerifyTypedDataReturnType = boolean

export type VerifyTypedDataErrorType =
  | IsAddressEqualErrorType
  | GetAddressErrorType
  | RecoverTypedDataAddressParameters
  | ErrorType

/**
 * Verify that typed data was signed by the provided address.
 *
 * Note:  Only supports Externally Owned Accounts. Does not support Contract Accounts.
 *        It is highly recommended to use `publicClient.verifyTypedData` instead to ensure
 *        wallet interoperability.
 *
 * - Docs {@link https://viem.sh/docs/utilities/verifyTypedData.html}
 *
 * @param parameters - {@link VerifyTypedDataParameters}
 * @returns Whether or not the signature is valid. {@link VerifyTypedDataReturnType}
 */
export async function verifyTypedData<
  const TTypedData extends TypedData | { [key: string]: unknown },
  TPrimaryType extends string = string,
>({
  address,
  domain,
  message,
  primaryType,
  signature,
  types,
}: VerifyTypedDataParameters<
  TTypedData,
  TPrimaryType
>): Promise<VerifyTypedDataReturnType> {
  return isAddressEqual(
    getAddress(address),
    await recoverTypedDataAddress({
      domain,
      message,
      primaryType,
      signature,
      types,
    } as RecoverTypedDataAddressParameters),
  )
}
