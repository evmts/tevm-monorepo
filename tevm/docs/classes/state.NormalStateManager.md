[tevm](../README.md) / [Modules](../modules.md) / [state](../modules/state.md) / NormalStateManager

# Class: NormalStateManager

[state](../modules/state.md).NormalStateManager

The ethereum state manager implementation for running Tevm in `normal` mode.
Normal mode does not fork/proxy to a external RPC url and has no unique features
Internally this state manager gets used when no proxy or fork url is passed into Tevm client

**`See`**

 - ForkStateManager for a provider that uses forks state rather than always using latest state
 - ProxyStateManager for a provider that uses latest state rather than creating a fork

## Hierarchy

- `DefaultStateManager`

  ↳ **`NormalStateManager`**

## Implements

- [`TevmStateManagerInterface`](../interfaces/state.TevmStateManagerInterface.md)

## Table of contents

### Constructors

- [constructor](state.NormalStateManager.md#constructor)

### Properties

- [\_accountCache](state.NormalStateManager.md#_accountcache)
- [\_accountCacheSettings](state.NormalStateManager.md#_accountcachesettings)
- [\_checkpointCount](state.NormalStateManager.md#_checkpointcount)
- [\_codeCache](state.NormalStateManager.md#_codecache)
- [\_codeCacheSettings](state.NormalStateManager.md#_codecachesettings)
- [\_debug](state.NormalStateManager.md#_debug)
- [\_prefixCodeHashes](state.NormalStateManager.md#_prefixcodehashes)
- [\_prefixStorageTrieKeys](state.NormalStateManager.md#_prefixstoragetriekeys)
- [\_proofTrie](state.NormalStateManager.md#_prooftrie)
- [\_storageCache](state.NormalStateManager.md#_storagecache)
- [\_storageCacheSettings](state.NormalStateManager.md#_storagecachesettings)
- [\_storageTries](state.NormalStateManager.md#_storagetries)
- [\_trie](state.NormalStateManager.md#_trie)
- [common](state.NormalStateManager.md#common)
- [dumpCanonicalGenesis](state.NormalStateManager.md#dumpcanonicalgenesis)
- [generateCanonicalGenesis](state.NormalStateManager.md#generatecanonicalgenesis)
- [getAccountAddresses](state.NormalStateManager.md#getaccountaddresses)
- [originalStorageCache](state.NormalStateManager.md#originalstoragecache)

### Methods

- [\_getAccountTrie](state.NormalStateManager.md#_getaccounttrie)
- [\_getCodeDB](state.NormalStateManager.md#_getcodedb)
- [\_getStorageTrie](state.NormalStateManager.md#_getstoragetrie)
- [\_modifyContractStorage](state.NormalStateManager.md#_modifycontractstorage)
- [\_writeContractStorage](state.NormalStateManager.md#_writecontractstorage)
- [checkpoint](state.NormalStateManager.md#checkpoint)
- [clearCaches](state.NormalStateManager.md#clearcaches)
- [clearContractStorage](state.NormalStateManager.md#clearcontractstorage)
- [commit](state.NormalStateManager.md#commit)
- [deepCopy](state.NormalStateManager.md#deepcopy)
- [deleteAccount](state.NormalStateManager.md#deleteaccount)
- [dumpStorage](state.NormalStateManager.md#dumpstorage)
- [dumpStorageRange](state.NormalStateManager.md#dumpstoragerange)
- [flush](state.NormalStateManager.md#flush)
- [getAccount](state.NormalStateManager.md#getaccount)
- [getContractCode](state.NormalStateManager.md#getcontractcode)
- [getContractStorage](state.NormalStateManager.md#getcontractstorage)
- [getProof](state.NormalStateManager.md#getproof)
- [getStateRoot](state.NormalStateManager.md#getstateroot)
- [hasStateRoot](state.NormalStateManager.md#hasstateroot)
- [modifyAccountFields](state.NormalStateManager.md#modifyaccountfields)
- [putAccount](state.NormalStateManager.md#putaccount)
- [putContractCode](state.NormalStateManager.md#putcontractcode)
- [putContractStorage](state.NormalStateManager.md#putcontractstorage)
- [revert](state.NormalStateManager.md#revert)
- [setStateRoot](state.NormalStateManager.md#setstateroot)
- [shallowCopy](state.NormalStateManager.md#shallowcopy)
- [verifyProof](state.NormalStateManager.md#verifyproof)

## Constructors

### constructor

• **new NormalStateManager**(`opts?`): [`NormalStateManager`](state.NormalStateManager.md)

Instantiate the StateManager interface.

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts?` | `DefaultStateManagerOpts` |

#### Returns

[`NormalStateManager`](state.NormalStateManager.md)

#### Inherited from

DefaultStateManager.constructor

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:146

## Properties

### \_accountCache

• `Protected` `Optional` **\_accountCache**: `AccountCache`

#### Inherited from

DefaultStateManager.\_accountCache

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:118

___

### \_accountCacheSettings

• `Protected` `Readonly` **\_accountCacheSettings**: `CacheSettings`

#### Inherited from

DefaultStateManager.\_accountCacheSettings

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:128

___

### \_checkpointCount

• `Protected` **\_checkpointCount**: `number`

#### Inherited from

DefaultStateManager.\_checkpointCount

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:132

___

### \_codeCache

• `Protected` `Optional` **\_codeCache**: `CodeCache`

#### Inherited from

DefaultStateManager.\_codeCache

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:120

___

### \_codeCacheSettings

• `Protected` `Readonly` **\_codeCacheSettings**: `CacheSettings`

#### Inherited from

DefaultStateManager.\_codeCacheSettings

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:130

___

### \_debug

• `Protected` **\_debug**: `Debugger`

#### Inherited from

DefaultStateManager.\_debug

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:117

___

### \_prefixCodeHashes

• `Protected` `Readonly` **\_prefixCodeHashes**: `boolean`

#### Inherited from

DefaultStateManager.\_prefixCodeHashes

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:126

___

### \_prefixStorageTrieKeys

• `Protected` `Readonly` **\_prefixStorageTrieKeys**: `boolean`

#### Inherited from

DefaultStateManager.\_prefixStorageTrieKeys

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:127

___

### \_proofTrie

• `Protected` **\_proofTrie**: `Trie`

#### Inherited from

DefaultStateManager.\_proofTrie

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:133

___

### \_storageCache

• `Protected` `Optional` **\_storageCache**: `StorageCache`

#### Inherited from

DefaultStateManager.\_storageCache

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:119

___

### \_storageCacheSettings

• `Protected` `Readonly` **\_storageCacheSettings**: `CacheSettings`

#### Inherited from

DefaultStateManager.\_storageCacheSettings

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:129

___

### \_storageTries

• `Protected` **\_storageTries**: `Object`

#### Index signature

▪ [key: `string`]: `Trie`

#### Inherited from

DefaultStateManager.\_storageTries

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:123

___

### \_trie

• `Protected` **\_trie**: `Trie`

#### Inherited from

DefaultStateManager.\_trie

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:122

___

### common

• `Readonly` **common**: `Common`

#### Inherited from

DefaultStateManager.common

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:131

___

### dumpCanonicalGenesis

• **dumpCanonicalGenesis**: () => `Promise`\<[`SerializableTevmState`](../modules/index.md#serializabletevmstate)\>

Dumps the state of the state manager as a [SerializableTevmState](../modules/index.md#serializabletevmstate)

#### Type declaration

▸ (): `Promise`\<[`SerializableTevmState`](../modules/index.md#serializabletevmstate)\>

Dumps the state of the state manager as a [SerializableTevmState](../modules/index.md#serializabletevmstate)

##### Returns

`Promise`\<[`SerializableTevmState`](../modules/index.md#serializabletevmstate)\>

#### Defined in

evmts-monorepo/packages/state/types/NormalStateManager.d.ts:33

___

### generateCanonicalGenesis

• **generateCanonicalGenesis**: (`state`: [`SerializableTevmState`](../modules/index.md#serializabletevmstate)) => `Promise`\<`void`\>

Loads a [SerializableTevmState](../modules/index.md#serializabletevmstate) into the state manager

#### Type declaration

▸ (`state`): `Promise`\<`void`\>

Loads a [SerializableTevmState](../modules/index.md#serializabletevmstate) into the state manager

##### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`SerializableTevmState`](../modules/index.md#serializabletevmstate) |

##### Returns

`Promise`\<`void`\>

#### Implementation of

[TevmStateManagerInterface](../interfaces/state.TevmStateManagerInterface.md).[generateCanonicalGenesis](../interfaces/state.TevmStateManagerInterface.md#generatecanonicalgenesis)

#### Overrides

DefaultStateManager.generateCanonicalGenesis

#### Defined in

evmts-monorepo/packages/state/types/NormalStateManager.d.ts:29

___

### getAccountAddresses

• **getAccountAddresses**: () => \`0x$\{string}\`[]

Retrieves the addresses of all the accounts in the state.

#### Type declaration

▸ (): \`0x$\{string}\`[]

Retrieves the addresses of all the accounts in the state.

##### Returns

\`0x$\{string}\`[]

An array of account addresses.

#### Implementation of

[TevmStateManagerInterface](../interfaces/state.TevmStateManagerInterface.md).[getAccountAddresses](../interfaces/state.TevmStateManagerInterface.md#getaccountaddresses)

#### Defined in

evmts-monorepo/packages/state/types/NormalStateManager.d.ts:17

___

### originalStorageCache

• **originalStorageCache**: `OriginalStorageCache`

#### Implementation of

[TevmStateManagerInterface](../interfaces/state.TevmStateManagerInterface.md).[originalStorageCache](../interfaces/state.TevmStateManagerInterface.md#originalstoragecache)

#### Inherited from

DefaultStateManager.originalStorageCache

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:121

## Methods

### \_getAccountTrie

▸ **_getAccountTrie**(): `Trie`

Gets the storage trie for an account from the storage
cache or does a lookup.

#### Returns

`Trie`

#### Inherited from

DefaultStateManager.\_getAccountTrie

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:196

___

### \_getCodeDB

▸ **_getCodeDB**(): `DB`\<`Uint8Array`, `Uint8Array`\>

Gets the storage trie for an account from the storage
cache or does a lookup.

#### Returns

`DB`\<`Uint8Array`, `Uint8Array`\>

#### Inherited from

DefaultStateManager.\_getCodeDB

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:202

___

### \_getStorageTrie

▸ **_getStorageTrie**(`addressOrHash`, `account?`): `Trie`

Gets the storage trie for an account from the storage
cache or does a lookup.

#### Parameters

| Name | Type |
| :------ | :------ |
| `addressOrHash` | [`EthjsAddress`](utils.EthjsAddress.md) \| `Uint8Array` |
| `account?` | [`EthjsAccount`](utils.EthjsAccount.md) |

#### Returns

`Trie`

#### Inherited from

DefaultStateManager.\_getStorageTrie

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:190

___

### \_modifyContractStorage

▸ **_modifyContractStorage**(`address`, `account`, `modifyTrie`): `Promise`\<`void`\>

Modifies the storage trie of an account.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`EthjsAddress`](utils.EthjsAddress.md) | Address of the account whose storage is to be modified |
| `account` | [`EthjsAccount`](utils.EthjsAccount.md) | - |
| `modifyTrie` | (`storageTrie`: `Trie`, `done`: `Function`) => `void` | Function to modify the storage trie of the account |

#### Returns

`Promise`\<`void`\>

#### Inherited from

DefaultStateManager.\_modifyContractStorage

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:219

___

### \_writeContractStorage

▸ **_writeContractStorage**(`address`, `account`, `key`, `value`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`EthjsAddress`](utils.EthjsAddress.md) |
| `account` | [`EthjsAccount`](utils.EthjsAccount.md) |
| `key` | `Uint8Array` |
| `value` | `Uint8Array` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

DefaultStateManager.\_writeContractStorage

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:220

___

### checkpoint

▸ **checkpoint**(): `Promise`\<`void`\>

Checkpoints the current state of the StateManager instance.
State changes that follow can then be committed by calling
`commit` or `reverted` by calling rollback.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[TevmStateManagerInterface](../interfaces/state.TevmStateManagerInterface.md).[checkpoint](../interfaces/state.TevmStateManagerInterface.md#checkpoint)

#### Inherited from

DefaultStateManager.checkpoint

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:241

___

### clearCaches

▸ **clearCaches**(): `void`

Clears all underlying caches

#### Returns

`void`

#### Inherited from

DefaultStateManager.clearCaches

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:336

___

### clearContractStorage

▸ **clearContractStorage**(`address`): `Promise`\<`void`\>

Clears all storage entries for the account corresponding to `address`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`EthjsAddress`](utils.EthjsAddress.md) | Address to clear the storage of |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[TevmStateManagerInterface](../interfaces/state.TevmStateManagerInterface.md).[clearContractStorage](../interfaces/state.TevmStateManagerInterface.md#clearcontractstorage)

#### Inherited from

DefaultStateManager.clearContractStorage

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:235

___

### commit

▸ **commit**(): `Promise`\<`void`\>

Commits the current change-set to the instance since the
last call to checkpoint.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[TevmStateManagerInterface](../interfaces/state.TevmStateManagerInterface.md).[commit](../interfaces/state.TevmStateManagerInterface.md#commit)

#### Inherited from

DefaultStateManager.commit

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:246

___

### deepCopy

▸ **deepCopy**(): `Promise`\<[`NormalStateManager`](state.NormalStateManager.md)\>

Returns a new instance of the ForkStateManager with the same opts and all storage copied over

#### Returns

`Promise`\<[`NormalStateManager`](state.NormalStateManager.md)\>

#### Defined in

evmts-monorepo/packages/state/types/NormalStateManager.d.ts:21

___

### deleteAccount

▸ **deleteAccount**(`address`): `Promise`\<`void`\>

Deletes an account from state under the provided `address`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`EthjsAddress`](utils.EthjsAddress.md) | Address of the account which should be deleted |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[TevmStateManagerInterface](../interfaces/state.TevmStateManagerInterface.md).[deleteAccount](../interfaces/state.TevmStateManagerInterface.md#deleteaccount)

#### Inherited from

DefaultStateManager.deleteAccount

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:170

___

### dumpStorage

▸ **dumpStorage**(`address`): `Promise`\<`StorageDump`\>

Dumps the RLP-encoded storage values for an `account` specified by `address`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`EthjsAddress`](utils.EthjsAddress.md) | The address of the `account` to return storage for |

#### Returns

`Promise`\<`StorageDump`\>

- The state of the account as an `Object` map.
Keys are are the storage keys, values are the storage values as strings.
Both are represented as hex strings without the `0x` prefix.

#### Implementation of

[TevmStateManagerInterface](../interfaces/state.TevmStateManagerInterface.md).[dumpStorage](../interfaces/state.TevmStateManagerInterface.md#dumpstorage)

#### Inherited from

DefaultStateManager.dumpStorage

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:289

___

### dumpStorageRange

▸ **dumpStorageRange**(`address`, `startKey`, `limit`): `Promise`\<`StorageRange`\>

Dumps a limited number of RLP-encoded storage values for an account specified by `address`,
starting from `startKey` or greater.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`EthjsAddress`](utils.EthjsAddress.md) | The address of the `account` to return storage for. |
| `startKey` | `bigint` | The bigint representation of the smallest storage key that will be returned. |
| `limit` | `number` | The maximum number of storage values that will be returned. |

#### Returns

`Promise`\<`StorageRange`\>

- A StorageRange object that will contain at most `limit` entries in its `storage` field.
The object will also contain `nextKey`, the next (hashed) storage key after the range included in `storage`.

#### Implementation of

[TevmStateManagerInterface](../interfaces/state.TevmStateManagerInterface.md).[dumpStorageRange](../interfaces/state.TevmStateManagerInterface.md#dumpstoragerange)

#### Inherited from

DefaultStateManager.dumpStorageRange

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:299

___

### flush

▸ **flush**(): `Promise`\<`void`\>

Writes all cache items to the trie

#### Returns

`Promise`\<`void`\>

#### Inherited from

DefaultStateManager.flush

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:255

___

### getAccount

▸ **getAccount**(`address`): `Promise`\<`undefined` \| [`EthjsAccount`](utils.EthjsAccount.md)\>

Gets the account associated with `address` or `undefined` if account does not exist

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`EthjsAddress`](utils.EthjsAddress.md) | Address of the `account` to get |

#### Returns

`Promise`\<`undefined` \| [`EthjsAccount`](utils.EthjsAccount.md)\>

#### Implementation of

[TevmStateManagerInterface](../interfaces/state.TevmStateManagerInterface.md).[getAccount](../interfaces/state.TevmStateManagerInterface.md#getaccount)

#### Inherited from

DefaultStateManager.getAccount

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:151

___

### getContractCode

▸ **getContractCode**(`address`): `Promise`\<`Uint8Array`\>

Gets the code corresponding to the provided `address`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`EthjsAddress`](utils.EthjsAddress.md) | Address to get the `code` for |

#### Returns

`Promise`\<`Uint8Array`\>

-  Resolves with the code corresponding to the provided address.
Returns an empty `Uint8Array` if the account has no associated code.

#### Implementation of

[TevmStateManagerInterface](../interfaces/state.TevmStateManagerInterface.md).[getContractCode](../interfaces/state.TevmStateManagerInterface.md#getcontractcode)

#### Inherited from

DefaultStateManager.getContractCode

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:184

___

### getContractStorage

▸ **getContractStorage**(`address`, `key`): `Promise`\<`Uint8Array`\>

Gets the storage value associated with the provided `address` and `key`. This method returns
the shortest representation of the stored value.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`EthjsAddress`](utils.EthjsAddress.md) | Address of the account to get the storage for |
| `key` | `Uint8Array` | Key in the account's storage to get the value for. Must be 32 bytes long. |

#### Returns

`Promise`\<`Uint8Array`\>

- The storage value for the account
corresponding to the provided address at the provided key.
If this does not exist an empty `Uint8Array` is returned.

#### Implementation of

[TevmStateManagerInterface](../interfaces/state.TevmStateManagerInterface.md).[getContractStorage](../interfaces/state.TevmStateManagerInterface.md#getcontractstorage)

#### Inherited from

DefaultStateManager.getContractStorage

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:212

___

### getProof

▸ **getProof**(`address`, `storageSlots?`): `Promise`\<`Proof`\>

Get an EIP-1186 proof

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`EthjsAddress`](utils.EthjsAddress.md) | address to get proof of |
| `storageSlots?` | `Uint8Array`[] | storage slots to get proof of |

#### Returns

`Promise`\<`Proof`\>

#### Implementation of

[TevmStateManagerInterface](../interfaces/state.TevmStateManagerInterface.md).[getProof](../interfaces/state.TevmStateManagerInterface.md#getproof)

#### Inherited from

DefaultStateManager.getProof

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:261

___

### getStateRoot

▸ **getStateRoot**(): `Promise`\<`Uint8Array`\>

Gets the state-root of the Merkle-Patricia trie representation
of the state of this StateManager. Will error if there are uncommitted
checkpoints on the instance.

#### Returns

`Promise`\<`Uint8Array`\>

- Returns the state-root of the `StateManager`

#### Implementation of

[TevmStateManagerInterface](../interfaces/state.TevmStateManagerInterface.md).[getStateRoot](../interfaces/state.TevmStateManagerInterface.md#getstateroot)

#### Inherited from

DefaultStateManager.getStateRoot

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:273

___

### hasStateRoot

▸ **hasStateRoot**(`root`): `Promise`\<`boolean`\>

Checks whether there is a state corresponding to a stateRoot

#### Parameters

| Name | Type |
| :------ | :------ |
| `root` | `Uint8Array` |

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[TevmStateManagerInterface](../interfaces/state.TevmStateManagerInterface.md).[hasStateRoot](../interfaces/state.TevmStateManagerInterface.md#hasstateroot)

#### Inherited from

DefaultStateManager.hasStateRoot

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:309

___

### modifyAccountFields

▸ **modifyAccountFields**(`address`, `accountFields`): `Promise`\<`void`\>

Gets the account associated with `address`, modifies the given account
fields, then saves the account into state. Account fields can include
`nonce`, `balance`, `storageRoot`, and `codeHash`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`EthjsAddress`](utils.EthjsAddress.md) | Address of the account to modify |
| `accountFields` | `Partial`\<`Pick`\<[`EthjsAccount`](utils.EthjsAccount.md), ``"nonce"`` \| ``"balance"`` \| ``"storageRoot"`` \| ``"codeHash"``\>\> | Object containing account fields and values to modify |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[TevmStateManagerInterface](../interfaces/state.TevmStateManagerInterface.md).[modifyAccountFields](../interfaces/state.TevmStateManagerInterface.md#modifyaccountfields)

#### Inherited from

DefaultStateManager.modifyAccountFields

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:165

___

### putAccount

▸ **putAccount**(`address`, `account`): `Promise`\<`void`\>

Saves an account into state under the provided `address`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`EthjsAddress`](utils.EthjsAddress.md) | Address under which to store `account` |
| `account` | `undefined` \| [`EthjsAccount`](utils.EthjsAccount.md) | The account to store or undefined if to be deleted |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[TevmStateManagerInterface](../interfaces/state.TevmStateManagerInterface.md).[putAccount](../interfaces/state.TevmStateManagerInterface.md#putaccount)

#### Inherited from

DefaultStateManager.putAccount

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:157

___

### putContractCode

▸ **putContractCode**(`address`, `value`): `Promise`\<`void`\>

Adds `value` to the state trie as code, and sets `codeHash` on the account
corresponding to `address` to reference this.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`EthjsAddress`](utils.EthjsAddress.md) | Address of the `account` to add the `code` for |
| `value` | `Uint8Array` | The value of the `code` |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[TevmStateManagerInterface](../interfaces/state.TevmStateManagerInterface.md).[putContractCode](../interfaces/state.TevmStateManagerInterface.md#putcontractcode)

#### Inherited from

DefaultStateManager.putContractCode

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:177

___

### putContractStorage

▸ **putContractStorage**(`address`, `key`, `value`): `Promise`\<`void`\>

Adds value to the state trie for the `account`
corresponding to `address` at the provided `key`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`EthjsAddress`](utils.EthjsAddress.md) | Address to set a storage value for |
| `key` | `Uint8Array` | Key to set the value at. Must be 32 bytes long. |
| `value` | `Uint8Array` | Value to set at `key` for account corresponding to `address`. Cannot be more than 32 bytes. Leading zeros are stripped. If it is a empty or filled with zeros, deletes the value. |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[TevmStateManagerInterface](../interfaces/state.TevmStateManagerInterface.md).[putContractStorage](../interfaces/state.TevmStateManagerInterface.md#putcontractstorage)

#### Inherited from

DefaultStateManager.putContractStorage

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:230

___

### revert

▸ **revert**(): `Promise`\<`void`\>

Reverts the current change-set to the instance since the
last call to checkpoint.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[TevmStateManagerInterface](../interfaces/state.TevmStateManagerInterface.md).[revert](../interfaces/state.TevmStateManagerInterface.md#revert)

#### Inherited from

DefaultStateManager.revert

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:251

___

### setStateRoot

▸ **setStateRoot**(`stateRoot`, `clearCache?`): `Promise`\<`void`\>

Sets the state of the instance to that represented
by the provided `stateRoot`. Will error if there are uncommitted
checkpoints on the instance or if the state root does not exist in
the state trie.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `stateRoot` | `Uint8Array` | The state-root to reset the instance to |
| `clearCache?` | `boolean` | - |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[TevmStateManagerInterface](../interfaces/state.TevmStateManagerInterface.md).[setStateRoot](../interfaces/state.TevmStateManagerInterface.md#setstateroot)

#### Inherited from

DefaultStateManager.setStateRoot

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:281

___

### shallowCopy

▸ **shallowCopy**(`downlevelCaches`): [`NormalStateManager`](state.NormalStateManager.md)

Returns a new instance of the ForkStateManager with the same opts

#### Parameters

| Name | Type |
| :------ | :------ |
| `downlevelCaches` | `boolean` |

#### Returns

[`NormalStateManager`](state.NormalStateManager.md)

#### Implementation of

[TevmStateManagerInterface](../interfaces/state.TevmStateManagerInterface.md).[shallowCopy](../interfaces/state.TevmStateManagerInterface.md#shallowcopy)

#### Overrides

DefaultStateManager.shallowCopy

#### Defined in

evmts-monorepo/packages/state/types/NormalStateManager.d.ts:25

___

### verifyProof

▸ **verifyProof**(`proof`): `Promise`\<`boolean`\>

Verify an EIP-1186 proof. Throws if proof is invalid, otherwise returns true.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `proof` | `Proof` | the proof to prove |

#### Returns

`Promise`\<`boolean`\>

#### Inherited from

DefaultStateManager.verifyProof

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:266
