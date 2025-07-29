export function validateSetAccountParams(action: import("./SetAccountParams.js").SetAccountParams): Array<ValidateSetAccountParamsError>;
export type ValidateSetAccountParamsError = InvalidAddressError | InvalidBalanceError | InvalidDeployedBytecodeError | InvalidNonceError | InvalidRequestError | InvalidStorageRootError;
import { InvalidAddressError } from '@tevm/errors';
import { InvalidBalanceError } from '@tevm/errors';
import { InvalidDeployedBytecodeError } from '@tevm/errors';
import { InvalidNonceError } from '@tevm/errors';
import { InvalidRequestError } from '@tevm/errors';
import { InvalidStorageRootError } from '@tevm/errors';
//# sourceMappingURL=validateSetAccountParams.d.ts.map