import type { TypedError } from '../TypedError.js'

export type TevmEVMErrorMessage =
	| 'out of gas'
	| 'code store out of gas'
	| 'code size to deposit exceeds maximum code size'
	| 'stack underflow'
	| 'stack overflow'
	| 'invalid JUMP'
	| 'invalid opcode'
	| 'value out of range'
	| 'revert'
	| 'static state change'
	| 'internal error'
	| 'create collision'
	| 'stop'
	| 'refund exhausted'
	| 'value overflow'
	| 'insufficient balance'
	| 'invalid BEGINSUB'
	| 'invalid RETURNSUB'
	| 'invalid JUMPSUB'
	| 'invalid bytecode deployed'
	| 'invalid EOF format'
	| 'initcode exceeds max initcode size'
	| 'invalid input length'
	| 'attempting to AUTHCALL without AUTH set'
	| 'attempting to execute AUTHCALL with nonzero external value'
	| 'invalid Signature: s-values greater than secp256k1n/2 are considered invalid'

	// BLS errors
	| 'invalid input length'
	| 'point not on curve'
	| 'input is empty'
	| 'fp point not in field'

	// Point Evaluation Errors
	| 'kzg commitment does not match versioned hash'
	| 'kzg inputs invalid'
	| 'kzg proof invalid'

/**
 * Error type of errors thrown while internally executing a call in the EVM
 */
export type EvmError<
	TEVMErrorMessage extends TevmEVMErrorMessage = TevmEVMErrorMessage,
> = TypedError<TEVMErrorMessage>
