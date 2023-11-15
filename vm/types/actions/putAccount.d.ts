import type { EVMts } from '../evmts.js';
import { Account as EthjsAccount } from '@ethereumjs/util';
import type { Address } from 'abitype';
/**
 * EVMts action to put an account into the vm state
 */
export type PutAccountAction = {
    account: Address;
    balance?: bigint;
};
export declare const putAccountHandler: (evmts: EVMts, { account, balance }: PutAccountAction) => Promise<EthjsAccount>;
//# sourceMappingURL=putAccount.d.ts.map