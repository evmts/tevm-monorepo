import type { ByteArray, Hex } from '../../types/misc.js'
export type RecoverPublicKeyParameters = {
	hash: Hex | ByteArray
	signature: Hex | ByteArray
}
export type RecoverPublicKeyReturnType = Hex
export declare function recoverPublicKey({
	hash,
	signature,
}: RecoverPublicKeyParameters): Promise<RecoverPublicKeyReturnType>
//# sourceMappingURL=recoverPublicKey.d.ts.map
