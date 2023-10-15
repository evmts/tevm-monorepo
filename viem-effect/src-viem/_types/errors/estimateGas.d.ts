import type { Account } from '../accounts/types.js';
import type { EstimateGasParameters } from '../actions/public/estimateGas.js';
import type { Chain } from '../types/chain.js';
import { BaseError } from './base.js';
export declare class EstimateGasExecutionError extends BaseError {
    cause: BaseError;
    name: string;
    constructor(cause: BaseError, { account, docsPath, chain, data, gas, gasPrice, maxFeePerGas, maxPriorityFeePerGas, nonce, to, value, }: Omit<EstimateGasParameters<any, any>, 'account'> & {
        account?: Account;
        chain?: Chain;
        docsPath?: string;
    });
}
//# sourceMappingURL=estimateGas.d.ts.map