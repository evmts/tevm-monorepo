import type { Tevm } from '../../Tevm.js';
import type { TevmScriptRequest } from './TevmScriptRequest.js';
import type { TevmScriptResponse } from './TevmScriptResponse.js';
import type { Abi } from 'abitype';
export type TevmScriptGeneric = <TAbi extends Abi | readonly unknown[] = Abi, TFunctionName extends string = string>(vm: Tevm, request: TevmScriptRequest<TAbi, TFunctionName>) => Promise<TevmScriptResponse<TAbi, TFunctionName>>;
//# sourceMappingURL=TevmScriptGeneric.d.ts.map