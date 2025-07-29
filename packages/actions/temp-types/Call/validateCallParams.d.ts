export function validateCallParams(action: import("../Call/CallParams.js").CallParams): ValidateCallParamsError[];
export type ValidateCallParamsError = InvalidSaltError | InvalidDataError | InvalidBytecodeError | import("../BaseCall/validateBaseCallParams.js").ValidateBaseCallParamsError;
import { InvalidSaltError } from '@tevm/errors';
import { InvalidDataError } from '@tevm/errors';
import { InvalidBytecodeError } from '@tevm/errors';
//# sourceMappingURL=validateCallParams.d.ts.map