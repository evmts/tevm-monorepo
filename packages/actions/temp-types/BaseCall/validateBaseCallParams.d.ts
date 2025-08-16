export function validateBaseCallParams(action: import("../BaseCall/BaseCallParams.js").BaseCallParams): ValidateBaseCallParamsError[];
export type ValidateBaseCallParamsError = InvalidParamsError | InvalidSkipBalanceError | InvalidGasRefundError | InvalidBlockError | InvalidGasPriceError | InvalidOriginError | InvalidCallerError | InvalidDepthError | InvalidBlobVersionedHashesError | InvalidAddToMempoolError | InvalidAddToBlockchainError;
import { InvalidParamsError } from '@tevm/errors';
import { InvalidSkipBalanceError } from '@tevm/errors';
import { InvalidGasRefundError } from '@tevm/errors';
import { InvalidBlockError } from '@tevm/errors';
import { InvalidGasPriceError } from '@tevm/errors';
import { InvalidOriginError } from '@tevm/errors';
import { InvalidCallerError } from '@tevm/errors';
import { InvalidDepthError } from '@tevm/errors';
import { InvalidBlobVersionedHashesError } from '@tevm/errors';
import { InvalidAddToMempoolError } from '@tevm/errors';
import { InvalidAddToBlockchainError } from '@tevm/errors';
//# sourceMappingURL=validateBaseCallParams.d.ts.map