import type { Address, Hex } from '../common/index.js';
import type { TevmGetAccountError } from './TevmGetAccountError.js';
/**
 * Result of GetAccount Action
 */
export type GetAccountResult<ErrorType = TevmGetAccountError> = {
    /**
     * Description of the exception, if any occurred
     */
    errors?: ErrorType[];
    /**
     * Address of account
     */
    address: Address;
    /**
     * Nonce to set account to
     */
    nonce: bigint;
    /**
     * Balance to set account to
     */
    balance: bigint;
    /**
     * Contract bytecode to set account to
     */
    deployedBytecode: Hex;
    /**
     * Storage root to set account to
     */
    storageRoot: Hex;
    /**
     * Code hash to set account to
     */
    codeHash: Hex;
    /**
     * True if account is a contract
     */
    isContract: boolean;
    /**
     * True if account is empty
     */
    isEmpty: boolean;
    /**
     * Contract storage for the account
     * only included if `returnStorage` is set to true in the request
     */
    storage?: {
        [key: Hex]: Hex;
    };
};
//# sourceMappingURL=GetAccountResult.d.ts.map