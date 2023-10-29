import type { Hex, SignableMessage } from '../../types/misc.js'
export type SignMessageParameters = {
	/** The message to sign. */
	message: SignableMessage
	/** The private key to sign with. */
	privateKey: Hex
}
export type SignMessageReturnType = Hex
/**
 * @description Calculates an Ethereum-specific signature in [EIP-191 format](https://eips.ethereum.org/EIPS/eip-191):
 * `keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))`.
 *
 * @returns The signature.
 */
export declare function signMessage({
	message,
	privateKey,
}: SignMessageParameters): Promise<SignMessageReturnType>
//# sourceMappingURL=signMessage.d.ts.map
