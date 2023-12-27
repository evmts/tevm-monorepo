import type { Log } from '@ethereumjs/evm';
import type { Abi } from 'abitype';
import { type DecodeFunctionResultReturnType } from 'viem';
export type RunContractCallResult<TAbi extends Abi | readonly unknown[] = Abi, TFunctionName extends string = string> = {
    data: DecodeFunctionResultReturnType<TAbi, TFunctionName>;
    gasUsed: BigInt;
    logs: Log[];
};
//# sourceMappingURL=RunContractCallResult.d.ts.map