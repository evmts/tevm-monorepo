import type { CallJsonRpcRequest } from '../Call/CallJsonRpcRequest.js';
import type { DumpStateJsonRpcRequest } from '../DumpState/DumpStateJsonRpcRequest.js';
import type { GetAccountJsonRpcRequest } from '../GetAccount/GetAccountJsonRpcRequest.js';
import type { LoadStateJsonRpcRequest } from '../LoadState/LoadStateJsonRpcRequest.js';
import type { MineJsonRpcRequest } from '../Mine/MineJsonRpcRequest.js';
import type { SetAccountJsonRpcRequest } from '../SetAccount/SetAccountJsonRpcRequest.js';
/**
 * A mapping of `tevm_*` method names to their request type
 */
export type TevmRequestType = {
    tevm_call: CallJsonRpcRequest;
    tevm_loadState: LoadStateJsonRpcRequest;
    tevm_dumpState: DumpStateJsonRpcRequest;
    tevm_getAccount: GetAccountJsonRpcRequest;
    tevm_setAccount: SetAccountJsonRpcRequest;
    tevm_mine: MineJsonRpcRequest;
};
//# sourceMappingURL=TevmRequestType.d.ts.map