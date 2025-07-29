export function validateMineParams(action: import("./MineParams.js").MineParams): Array<ValidateMineParamsError>;
export type ValidateMineParamsError = InvalidAddressError | InvalidBalanceError | InvalidNonceError | InvalidRequestError;
import { InvalidAddressError } from '@tevm/errors';
import { InvalidBalanceError } from '@tevm/errors';
import { InvalidNonceError } from '@tevm/errors';
import { InvalidRequestError } from '@tevm/errors';
//# sourceMappingURL=validateMineParams.d.ts.map