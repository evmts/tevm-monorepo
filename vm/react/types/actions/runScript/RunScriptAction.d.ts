import type { Abi } from 'abitype';
import { type Address, type EncodeFunctionDataParameters, type Hex } from 'viem';
/**
 * Tevm action to deploy and execute a script or contract
 */
export type RunScriptAction<TAbi extends Abi | readonly unknown[] = Abi, TFunctionName extends string = string> = EncodeFunctionDataParameters<TAbi, TFunctionName> & {
    deployedBytecode: Hex;
    caller?: Address;
};
//# sourceMappingURL=RunScriptAction.d.ts.map