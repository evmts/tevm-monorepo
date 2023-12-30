import type { ByteArray, Hex, SignableMessage } from '../../types/misc.js'
import type { Address } from 'abitype'
export type RecoverMessageAddressParameters = {
	message: SignableMessage
	signature: Hex | ByteArray
}
export type RecoverMessageAddressReturnType = Address
export declare function recoverMessageAddress({
	message,
	signature,
}: RecoverMessageAddressParameters): Promise<RecoverMessageAddressReturnType>
//# sourceMappingURL=recoverMessageAddress.d.ts.map
