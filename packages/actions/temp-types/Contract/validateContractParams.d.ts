export function validateContractParams(action: import("./ContractParams.js").ContractParams): Array<ValidateContractParamsError>;
export type ValidateContractParamsError = InvalidAbiError | InvalidAddressError | InvalidArgsError | InvalidFunctionNameError | import("../BaseCall/validateBaseCallParams.js").ValidateBaseCallParamsError;
import { InvalidAbiError } from '@tevm/errors';
import { InvalidAddressError } from '@tevm/errors';
import { InvalidArgsError } from '@tevm/errors';
import { InvalidFunctionNameError } from '@tevm/errors';
//# sourceMappingURL=validateContractParams.d.ts.map