import type { ByteArray, Hex } from '../../types/misc.js'
import type { Address } from 'abitype'
export type RecoverAddressParameters = {
	hash: Hex | ByteArray
	signature: Hex | ByteArray
}
export type RecoverAddressReturnType = Address
export declare function recoverAddress({
	hash,
	signature,
}: RecoverAddressParameters): Promise<RecoverAddressReturnType>
//# sourceMappingURL=recoverAddress.d.ts.map
