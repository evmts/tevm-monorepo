export function handleRunTxError(e: unknown): HandleRunTxError;
export type EvmErrorConstructor = (typeof evmErrors)[number];
export type TevmEvmError = AuthCallUnsetError | BLS12381FpNotInFieldError | BLS12381InputEmptyError | BLS12381InvalidInputLengthError | BLS12381PointNotOnCurveError | CodeStoreOutOfGasError | CodeSizeExceedsMaximumError | CreateCollisionError | InvalidCommitmentError | EvmRevertError | InitcodeSizeViolationError | InsufficientBalanceError | InternalEvmError | InvalidBeginSubError | InvalidBytecodeResultError | InvalidEofFormatError | InvalidInputLengthError | InvalidJumpError | InvalidJumpSubError | InvalidKzgInputsError | InvalidOpcodeError | InvalidProofError | InvalidReturnSubError | OutOfGasError | OutOfRangeError | RefundExhaustedError | StackOverflowError | StackUnderflowError | StaticStateChangeError | StopError | ValueOverflowError;
export type HandleRunTxError = TevmEvmError | InvalidGasPriceError | InvalidAddressError | InvalidGasLimitError;
/**
 * @internal
 * Array of every error EVM can throw
 * @type {[typeof AuthCallUnsetError, typeof CodeSizeExceedsMaximumError, typeof CreateCollisionError, typeof InvalidCommitmentError, typeof EvmRevertError, typeof InitcodeSizeViolationError, typeof InsufficientBalanceError, typeof InternalEvmError, typeof InvalidBeginSubError, typeof InvalidBytecodeResultError, typeof InvalidEofFormatError, typeof InvalidInputLengthError, typeof InvalidJumpError, typeof InvalidJumpSubError, typeof InvalidKzgInputsError, typeof InvalidOpcodeError, typeof InvalidProofError, typeof InvalidReturnSubError, typeof OutOfGasError, typeof OutOfRangeError, typeof RefundExhaustedError, typeof StackOverflowError, typeof StackUnderflowError, typeof StaticStateChangeError, typeof StopError, typeof ValueOverflowError, typeof BLS12381InputEmptyError, typeof BLS12381FpNotInFieldError, typeof BLS12381InvalidInputLengthError, typeof BLS12381PointNotOnCurveError, typeof CodeStoreOutOfGasError]}
 */
declare const evmErrors: [typeof AuthCallUnsetError, typeof CodeSizeExceedsMaximumError, typeof CreateCollisionError, typeof InvalidCommitmentError, typeof EvmRevertError, typeof InitcodeSizeViolationError, typeof InsufficientBalanceError, typeof InternalEvmError, typeof InvalidBeginSubError, typeof InvalidBytecodeResultError, typeof InvalidEofFormatError, typeof InvalidInputLengthError, typeof InvalidJumpError, typeof InvalidJumpSubError, typeof InvalidKzgInputsError, typeof InvalidOpcodeError, typeof InvalidProofError, typeof InvalidReturnSubError, typeof OutOfGasError, typeof OutOfRangeError, typeof RefundExhaustedError, typeof StackOverflowError, typeof StackUnderflowError, typeof StaticStateChangeError, typeof StopError, typeof ValueOverflowError, typeof BLS12381InputEmptyError, typeof BLS12381FpNotInFieldError, typeof BLS12381InvalidInputLengthError, typeof BLS12381PointNotOnCurveError, typeof CodeStoreOutOfGasError];
import { AuthCallUnsetError } from '@tevm/errors';
import { BLS12381FpNotInFieldError } from '@tevm/errors';
import { BLS12381InputEmptyError } from '@tevm/errors';
import { BLS12381InvalidInputLengthError } from '@tevm/errors';
import { BLS12381PointNotOnCurveError } from '@tevm/errors';
import { CodeStoreOutOfGasError } from '@tevm/errors';
import { CodeSizeExceedsMaximumError } from '@tevm/errors';
import { CreateCollisionError } from '@tevm/errors';
import { InvalidCommitmentError } from '@tevm/errors';
import { EvmRevertError } from '@tevm/errors';
import { InitcodeSizeViolationError } from '@tevm/errors';
import { InsufficientBalanceError } from '@tevm/errors';
import { InternalEvmError } from '@tevm/errors';
import { InvalidBeginSubError } from '@tevm/errors';
import { InvalidBytecodeResultError } from '@tevm/errors';
import { InvalidEofFormatError } from '@tevm/errors';
import { InvalidInputLengthError } from '@tevm/errors';
import { InvalidJumpError } from '@tevm/errors';
import { InvalidJumpSubError } from '@tevm/errors';
import { InvalidKzgInputsError } from '@tevm/errors';
import { InvalidOpcodeError } from '@tevm/errors';
import { InvalidProofError } from '@tevm/errors';
import { InvalidReturnSubError } from '@tevm/errors';
import { OutOfGasError } from '@tevm/errors';
import { OutOfRangeError } from '@tevm/errors';
import { RefundExhaustedError } from '@tevm/errors';
import { StackOverflowError } from '@tevm/errors';
import { StackUnderflowError } from '@tevm/errors';
import { StaticStateChangeError } from '@tevm/errors';
import { StopError } from '@tevm/errors';
import { ValueOverflowError } from '@tevm/errors';
import { InvalidGasPriceError } from '@tevm/errors';
import { InvalidAddressError } from '@tevm/errors';
import { InvalidGasLimitError } from '@tevm/errors';
export {};
//# sourceMappingURL=handleEvmError.d.ts.map