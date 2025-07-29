import type { CallJsonRpcResponse } from '../Call/CallJsonRpcResponse.js';
import type { DumpStateJsonRpcResponse } from '../DumpState/DumpStateJsonRpcResponse.js';
import type { GetAccountJsonRpcResponse } from '../GetAccount/GetAccountJsonRpcResponse.js';
import type { LoadStateJsonRpcResponse } from '../LoadState/LoadStateJsonRpcResponse.js';
import type { MineJsonRpcResponse } from '../Mine/MineJsonRpcResponse.js';
import type { SetAccountJsonRpcResponse } from '../SetAccount/SetAccountJsonRpcResponse.js';
/**
 * A mapping of `tevm_*` method names to their return type
 */
export type TevmReturnType = {
    tevm_call: CallJsonRpcResponse;
    /**
     * @deprecated
     */
    tevm_loadState: LoadStateJsonRpcResponse;
    tevm_dumpState: DumpStateJsonRpcResponse;
    tevm_getAccount: GetAccountJsonRpcResponse;
    tevm_setAccount: SetAccountJsonRpcResponse;
    tevm_mine: MineJsonRpcResponse;
};
//# sourceMappingURL=TevmReturnType.d.ts.map