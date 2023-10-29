import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { Chain } from '../../types/chain.js'
import type { ByteArray, Hex } from '../../types/misc.js'
import type { TypedDataDefinition } from '../../types/typedData.js'
import { type VerifyHashParameters } from './verifyHash.js'
import type { Address, TypedData } from 'abitype'
export type VerifyTypedDataParameters<
	TTypedData extends
		| TypedData
		| {
				[key: string]: unknown
		  } = TypedData,
	TPrimaryType extends string = string,
> = Omit<VerifyHashParameters, 'hash'> &
	TypedDataDefinition<TTypedData, TPrimaryType> & {
		/** The address to verify the typed data for. */
		address: Address
		/** The signature to verify */
		signature: Hex | ByteArray
	}
export type VerifyTypedDataReturnType = boolean
/**
 * Verify that typed data was signed by the provided address.
 *
 * - Docs {@link https://viem.sh/docs/actions/public/verifyTypedData.html}
 *
 * @param client - Client to use.
 * @param parameters - {@link VerifyTypedDataParameters}
 * @returns Whether or not the signature is valid. {@link VerifyTypedDataReturnType}
 */
export declare function verifyTypedData<TChain extends Chain | undefined>(
	client: Client<Transport, TChain>,
	{
		address,
		signature,
		message,
		primaryType,
		types,
		domain,
		...callRequest
	}: VerifyTypedDataParameters,
): Promise<VerifyTypedDataReturnType>
//# sourceMappingURL=verifyTypedData.d.ts.map
