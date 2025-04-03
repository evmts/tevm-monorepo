export {
	Address as EthjsAddress,
	Account as EthjsAccount,
	bytesToUnprefixedHex,
	equalsBytes,
	concatBytes,
	KeyEncoding,
	ValueEncoding,
	Withdrawal,
	GWEI_TO_WEI,
	setLengthLeft,
	toType,
	TypeOutput,
	bytesToUtf8,
	fetchFromProvider,
	getProvider,
	KECCAK256_RLP,
	KECCAK256_RLP_ARRAY,
	ecrecover,
	ecsign,
	randomBytes,
	AsyncEventEmitter,
} from '@ethereumjs/util'
/**
 * Returns a Uint8Array filled with zeros of the specified length.
 * @param {number} length - The length of the Uint8Array to create.
 * @returns {Uint8Array} A new Uint8Array filled with zeros.
 */
export function zeros(length) {
	return new Uint8Array(length).fill(0)
}
