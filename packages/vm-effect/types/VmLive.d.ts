export function VmLive(_options?: VmLiveOptions): Layer.Layer<VmServiceId, TevmError, typeof CommonService | typeof StateManagerService | typeof BlockchainService | typeof EvmService>;
export type VmShape = import("./types.js").VmShape;
export type VmLiveOptions = import("./types.js").VmLiveOptions;
export type VmServiceId = import("./VmService.js").VmServiceId;
import { Layer } from 'effect';
import { TevmError } from '@tevm/errors-effect';
import { CommonService } from '@tevm/common-effect';
import { StateManagerService } from '@tevm/state-effect';
import { BlockchainService } from '@tevm/blockchain-effect';
import { EvmService } from '@tevm/evm-effect';
//# sourceMappingURL=VmLive.d.ts.map