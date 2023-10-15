import type { Abi, Address } from 'abitype';
import { BaseError } from '../../errors/base.js';
import { ContractFunctionExecutionError } from '../../errors/contract.js';
export declare function getContractError(err: BaseError, { abi, address, args, docsPath, functionName, sender, }: {
    abi: Abi;
    args: any;
    address?: Address;
    docsPath?: string;
    functionName: string;
    sender?: Address;
}): ContractFunctionExecutionError;
//# sourceMappingURL=getContractError.d.ts.map