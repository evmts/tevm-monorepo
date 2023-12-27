import type { RunScriptResult } from '../../actions/runScript/RunScriptResult.js';
import type { Abi } from 'abitype';
export type TevmScriptResponse<TAbi extends Abi | readonly unknown[] = Abi, TFunctionName extends string = string> = {
    jsonrpc: '2.0';
    method: 'tevm_script';
    result: RunScriptResult<TAbi, TFunctionName>;
    id?: string | number | null;
};
//# sourceMappingURL=TevmScriptResponse.d.ts.map