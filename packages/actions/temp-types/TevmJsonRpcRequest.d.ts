import type { CallJsonRpcRequest } from './Call/CallJsonRpcRequest.js';
import type { DumpStateJsonRpcRequest } from './DumpState/DumpStateJsonRpcRequest.js';
import type { GetAccountJsonRpcRequest } from './GetAccount/GetAccountJsonRpcRequest.js';
import type { LoadStateJsonRpcRequest } from './LoadState/LoadStateJsonRpcRequest.js';
import type { MineJsonRpcRequest } from './Mine/MineJsonRpcRequest.js';
import type { SetAccountJsonRpcRequest } from './SetAccount/SetAccountJsonRpcRequest.js';
/**
 * A Tevm JSON-RPC request
 * `tevm_account`, `tevm_call`, `tevm_contract`, `tevm_script`
 */
export type TevmJsonRpcRequest = GetAccountJsonRpcRequest | SetAccountJsonRpcRequest | CallJsonRpcRequest | LoadStateJsonRpcRequest | DumpStateJsonRpcRequest | MineJsonRpcRequest;
//# sourceMappingURL=TevmJsonRpcRequest.d.ts.map