import {
  AuthCallUnsetError,
  BLS12381FpNotInFieldError,
  BLS12381InputEmptyError,
  BLS12381PointNotOnCurveError,
  BaseError,
  CodeSizeExceedsMaximumError,
  CodeStoreOutOfGasError,
  CreateCollisionError,
  InitcodeSizeViolationError,
  InsufficientBalanceError,
  InternalError,
  InvalidBeginSubError,
  InvalidBytecodeResultError,
  InvalidCommitmentError,
  InvalidEofFormatError,
  InvalidInputLengthError,
  InvalidJumpError,
  InvalidJumpSubError,
  InvalidKzgInputsError,
  InvalidOpcodeError,
  InvalidProofError,
  InvalidReturnSubError,
  OutOfGasError,
  OutOfRangeError,
  RefundExhaustedError,
  RevertError,
  StackOverflowError,
  StackUnderflowError,
  StaticStateChangeError,
  StopError,
  ValueOverflowError,
} from "@tevm/errors";

/**
 * @type {ReturnType<typeof createEvmError>} EvmError
 */

/**
 * @param {import('@tevm/evm').EvmError} error
 */
export const createEvmError = (error) => {
  // make it so we can always override it for now
  if (error instanceof BaseError) {
    return /** @type {never}*/ (error);
  }

  const errorMessage = error?.error;

  switch (errorMessage) {
    case "stop": {
      return new StopError(errorMessage, { cause: error });
    }
    case "revert": {
      return new RevertError(errorMessage, { cause: error });
    }
    case "out of gas": {
      return new OutOfGasError(errorMessage, { cause: error });
    }
    case "invalid opcode": {
      return new InvalidOpcodeError(errorMessage, { cause: error });
    }
    case "stack overflow": {
      return new StackOverflowError(errorMessage, { cause: error });
    }
    case "stack underflow": {
      return new StackUnderflowError(errorMessage, { cause: error });
    }
    case "invalid JUMP": {
      return new InvalidJumpError(errorMessage, { cause: error });
    }
    case "value out of range": {
      return new OutOfRangeError(errorMessage, { cause: error });
    }
    case "kzg proof invalid": {
      return new InvalidProofError(errorMessage, { cause: error });
    }
    case "attempting to AUTHCALL without AUTH set": {
      return new AuthCallUnsetError(errorMessage, { cause: error });
    }
    case "internal error": {
      return new InternalError(errorMessage, { cause: error });
    }
    case "kzg inputs invalid": {
      return new InvalidKzgInputsError(errorMessage, { cause: error });
    }
    case "value overflow": {
      return new ValueOverflowError(errorMessage, { cause: error });
    }
    case "invalid JUMPSUB": {
      return new InvalidJumpSubError(errorMessage, { cause: error });
    }
    case "create collision": {
      return new CreateCollisionError(errorMessage, { cause: error });
    }
    case "invalid BEGINSUB": {
      return new InvalidBeginSubError(errorMessage, { cause: error });
    }
    case "refund exhausted": {
      return new RefundExhaustedError(errorMessage, { cause: error });
    }
    case "invalid RETURNSUB": {
      return new InvalidReturnSubError(errorMessage, { cause: error });
    }
    case "kzg commitment does not match versioned hash": {
      return new InvalidCommitmentError(errorMessage, { cause: error });
    }
    case "invalid EOF format": {
      return new InvalidEofFormatError(errorMessage, { cause: error });
    }
    case "static state change": {
      return new StaticStateChangeError(errorMessage, { cause: error });
    }
    case "code store out of gas": {
      return new CodeStoreOutOfGasError(errorMessage, { cause: error });
    }
    case "insufficient balance": {
      return new InsufficientBalanceError(errorMessage, { cause: error });
    }
    case "invalid input length": {
      return new InvalidInputLengthError(errorMessage, { cause: error });
    }
    case "input is empty": {
      return new BLS12381InputEmptyError(errorMessage, { cause: error });
    }
    case "initcode exceeds max initcode size": {
      return new InitcodeSizeViolationError(errorMessage, { cause: error });
    }
    case "invalid bytecode deployed": {
      return new InvalidBytecodeResultError(errorMessage, { cause: error });
    }
    case "code size to deposit exceeds maximum code size": {
      return new CodeSizeExceedsMaximumError(errorMessage, { cause: error });
    }
    case "fp point not in field": {
      return new BLS12381FpNotInFieldError(errorMessage, { cause: error });
    }
    case "point not on curve": {
      return new BLS12381PointNotOnCurveError(errorMessage, { cause: error });
    }
    default: {
      return new InternalError(errorMessage || "Unknown error", {
        cause: error,
      });
    }
  }
};
