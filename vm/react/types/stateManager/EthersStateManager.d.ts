import { Account } from '@ethereumjs/util';
import { ethers } from 'ethers';
import { AccountCache, StorageCache } from '@ethereumjs/statemanager';
import type { AccountFields, EVMStateManagerInterface, StorageDump } from '@ethereumjs/common';
import type { StorageRange } from '@ethereumjs/common';
import type { Proof } from '@ethereumjs/statemanager';
import type { Debugger } from 'debug';
import type { Address } from '@ethereumjs/util';
type getContractStorage = (address: Address, key: Uint8Array) => Promise<Uint8Array>;
declare class OriginalStorageCache {
    private map;
    private getContractStorage;
    constructor(getContractStorage: getContractStorage);
    get(address: Address, key: Uint8Array): Promise<Uint8Array>;
    put(address: Address, key: Uint8Array, value: Uint8Array): void;
    clear(): void;
}
export interface EthersStateManagerOpts {
    provider: string | ethers.JsonRpcProvider;
    blockTag: bigint | 'earliest';
}
export declare class EthersStateManager implements EVMStateManagerInterface {
    protected _provider: ethers.JsonRpcProvider;
    protected _contractCache: Map<string, Uint8Array>;
    protected _storageCache: StorageCache;
    protected _blockTag: string;
    protected _accountCache: AccountCache;
    originalStorageCache: OriginalStorageCache;
    protected _debug: Debugger;
    protected DEBUG: boolean;
    constructor(opts: EthersStateManagerOpts);
    /**
     * Note that the returned statemanager will share the same JsonRpcProvider as the original
     *
     * @returns EthersStateManager
     */
    shallowCopy(): EthersStateManager;
    /**
     * Sets the new block tag used when querying the provider and clears the
     * internal cache.
     * @param blockTag - the new block tag to use when querying the provider
     */
    setBlockTag(blockTag: bigint | 'earliest'): void;
    /**
     * Clears the internal cache so all accounts, contract code, and storage slots will
     * initially be retrieved from the provider
     */
    clearCaches(): void;
    /**
     * Gets the code corresponding to the provided `address`.
     * @param address - Address to get the `code` for
     * @returns {Promise<Uint8Array>} - Resolves with the code corresponding to the provided address.
     * Returns an empty `Uint8Array` if the account has no associated code.
     */
    getContractCode(address: Address): Promise<Uint8Array>;
    /**
     * Adds `value` to the state trie as code, and sets `codeHash` on the account
     * corresponding to `address` to reference this.
     * @param address - Address of the `account` to add the `code` for
     * @param value - The value of the `code`
     */
    putContractCode(address: Address, value: Uint8Array): Promise<void>;
    /**
     * Gets the storage value associated with the provided `address` and `key`. This method returns
     * the shortest representation of the stored value.
     * @param address - Address of the account to get the storage for
     * @param key - Key in the account's storage to get the value for. Must be 32 bytes long.
     * @returns {Uint8Array} - The storage value for the account
     * corresponding to the provided address at the provided key.
     * If this does not exist an empty `Uint8Array` is returned.
     */
    getContractStorage(address: Address, key: Uint8Array): Promise<Uint8Array>;
    /**
     * Adds value to the cache for the `account`
     * corresponding to `address` at the provided `key`.
     * @param address - Address to set a storage value for
     * @param key - Key to set the value at. Must be 32 bytes long.
     * @param value - Value to set at `key` for account corresponding to `address`.
     * Cannot be more than 32 bytes. Leading zeros are stripped.
     * If it is empty or filled with zeros, deletes the value.
     */
    putContractStorage(address: Address, key: Uint8Array, value: Uint8Array): Promise<void>;
    /**
     * Clears all storage entries for the account corresponding to `address`.
     * @param address - Address to clear the storage of
     */
    clearContractStorage(address: Address): Promise<void>;
    /**
     * Dumps the RLP-encoded storage values for an `account` specified by `address`.
     * @param address - The address of the `account` to return storage for
     * @returns {Promise<StorageDump>} - The state of the account as an `Object` map.
     * Keys are the storage keys, values are the storage values as strings.
     * Both are represented as `0x` prefixed hex strings.
     */
    dumpStorage(address: Address): Promise<StorageDump>;
    dumpStorageRange(_address: Address, _startKey: bigint, _limit: number): Promise<StorageRange>;
    /**
     * Checks if an `account` exists at `address`
     * @param address - Address of the `account` to check
     */
    accountExists(address: Address): Promise<boolean>;
    /**
     * Gets the code corresponding to the provided `address`.
     * @param address - Address to get the `account` for
     * @returns {Promise<Uint8Array>} - Resolves with the code corresponding to the provided address.
     * Returns an empty `Uint8Array` if the account has no associated code.
     */
    getAccount(address: Address): Promise<Account | undefined>;
    /**
     * Retrieves an account from the provider and stores in the local trie
     * @param address Address of account to be retrieved from provider
     * @private
     */
    getAccountFromProvider(address: Address): Promise<Account>;
    /**
     * Saves an account into state under the provided `address`.
     * @param address - Address under which to store `account`
     * @param account - The account to store
     */
    putAccount(address: Address, account: Account | undefined): Promise<void>;
    /**
     * Gets the account associated with `address`, modifies the given account
     * fields, then saves the account into state. Account fields can include
     * `nonce`, `balance`, `storageRoot`, and `codeHash`.
     * @param address - Address of the account to modify
     * @param accountFields - Object containing account fields and values to modify
     */
    modifyAccountFields(address: Address, accountFields: AccountFields): Promise<void>;
    /**
     * Deletes an account from state under the provided `address`.
     * @param address - Address of the account which should be deleted
     */
    deleteAccount(address: Address): Promise<void>;
    /**
     * Get an EIP-1186 proof from the provider
     * @param address address to get proof of
     * @param storageSlots storage slots to get proof of
     * @returns an EIP-1186 formatted proof
     */
    getProof(address: Address, storageSlots?: Uint8Array[]): Promise<Proof>;
    /**
     * Checkpoints the current state of the StateManager instance.
     * State changes that follow can then be committed by calling
     * `commit` or `reverted` by calling rollback.
     *
     * Partial implementation, called from the subclass.
     */
    checkpoint(): Promise<void>;
    /**
     * Commits the current change-set to the instance since the
     * last call to checkpoint.
     *
     * Partial implementation, called from the subclass.
     */
    commit(): Promise<void>;
    /**
     * Reverts the current change-set to the instance since the
     * last call to checkpoint.
     *
     * Partial implementation , called from the subclass.
     */
    revert(): Promise<void>;
    flush(): Promise<void>;
    /**
     * @deprecated This method is not used by the Ethers State Manager and is a stub required by the State Manager interface
     */
    getStateRoot: () => Promise<Uint8Array>;
    /**
     * @deprecated This method is not used by the Ethers State Manager and is a stub required by the State Manager interface
     */
    setStateRoot: (_root: Uint8Array) => Promise<void>;
    /**
     * @deprecated This method is not used by the Ethers State Manager and is a stub required by the State Manager interface
     */
    hasStateRoot: () => never;
    generateCanonicalGenesis(_initState: any): Promise<void>;
}
export {};
//# sourceMappingURL=EthersStateManager.d.ts.map