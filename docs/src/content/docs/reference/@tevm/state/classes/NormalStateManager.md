---
editUrl: false
next: false
prev: false
title: "NormalStateManager"
---

The ethereum state manager implementation for running Tevm in `normal` mode.
Normal mode does not fork/proxy to a external RPC url and has no unique features
Internally this state manager gets used when no proxy or fork url is passed into Tevm client

## See

 - ForkStateManager for a provider that uses forks state rather than always using latest state
 - ProxyStateManager for a provider that uses latest state rather than creating a fork

## Extends

- `DefaultStateManager`

## Implements

- [`TevmStateManagerInterface`](/reference/tevm/state/interfaces/tevmstatemanagerinterface/)

## Constructors

### new NormalStateManager(opts)

> **new NormalStateManager**(`opts`?): [`NormalStateManager`](/reference/tevm/state/classes/normalstatemanager/)

#### Parameters

▪ **opts?**: `NormalStateManagerOpts`

#### Overrides

DefaultStateManager.constructor

#### Source

[packages/state/src/NormalStateManager.ts:37](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/NormalStateManager.ts#L37)

## Properties

### \_accountCache

> **`protected`** **\_accountCache**?: `AccountCache`

#### Inherited from

DefaultStateManager.\_accountCache

#### Source

node\_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node\_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:118

***

### \_accountCacheSettings

> **`protected`** **`readonly`** **\_accountCacheSettings**: `CacheSettings`

#### Inherited from

DefaultStateManager.\_accountCacheSettings

#### Source

node\_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node\_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:128

***

### \_checkpointCount

> **`protected`** **\_checkpointCount**: `number`

#### Inherited from

DefaultStateManager.\_checkpointCount

#### Source

node\_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node\_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:132

***

### \_codeCache

> **`protected`** **\_codeCache**?: `CodeCache`

#### Inherited from

DefaultStateManager.\_codeCache

#### Source

node\_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node\_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:120

***

### \_codeCacheSettings

> **`protected`** **`readonly`** **\_codeCacheSettings**: `CacheSettings`

#### Inherited from

DefaultStateManager.\_codeCacheSettings

#### Source

node\_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node\_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:130

***

### \_debug

> **`protected`** **\_debug**: `Debugger`

#### Inherited from

DefaultStateManager.\_debug

#### Source

node\_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node\_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:117

***

### \_prefixCodeHashes

> **`protected`** **`readonly`** **\_prefixCodeHashes**: `boolean`

#### Inherited from

DefaultStateManager.\_prefixCodeHashes

#### Source

node\_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node\_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:126

***

### \_prefixStorageTrieKeys

> **`protected`** **`readonly`** **\_prefixStorageTrieKeys**: `boolean`

#### Inherited from

DefaultStateManager.\_prefixStorageTrieKeys

#### Source

node\_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node\_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:127

***

### \_proofTrie

> **`protected`** **\_proofTrie**: `Trie`

#### Inherited from

DefaultStateManager.\_proofTrie

#### Source

node\_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node\_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:133

***

### \_storageCache

> **`protected`** **\_storageCache**?: `StorageCache`

#### Inherited from

DefaultStateManager.\_storageCache

#### Source

node\_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node\_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:119

***

### \_storageCacheSettings

> **`protected`** **`readonly`** **\_storageCacheSettings**: `CacheSettings`

#### Inherited from

DefaultStateManager.\_storageCacheSettings

#### Source

node\_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node\_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:129

***

### \_storageTries

> **`protected`** **\_storageTries**: `object`

#### Index signature

 \[`key`: `string`\]: `Trie`

#### Inherited from

DefaultStateManager.\_storageTries

#### Source

node\_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node\_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:123

***

### \_trie

> **`protected`** **\_trie**: `Trie`

#### Inherited from

DefaultStateManager.\_trie

#### Source

node\_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node\_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:122

***

### common

> **`readonly`** **common**: `Common`

#### Inherited from

DefaultStateManager.common

#### Source

node\_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node\_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:131

***

### opts

> **`protected`** **`readonly`** **opts**?: `NormalStateManagerOpts`

#### Source

[packages/state/src/NormalStateManager.ts:37](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/NormalStateManager.ts#L37)

***

### originalStorageCache

> **originalStorageCache**: `OriginalStorageCache`

#### Implementation of

[`TevmStateManagerInterface`](/reference/tevm/state/interfaces/tevmstatemanagerinterface/).[`originalStorageCache`](/reference/tevm/state/interfaces/tevmstatemanagerinterface/#originalstoragecache)

#### Inherited from

DefaultStateManager.originalStorageCache

#### Source

node\_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node\_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:121

## Methods

### \_getAccountTrie()

> **`private`** **\_getAccountTrie**(): `Trie`

Gets the storage trie for an account from the storage
cache or does a lookup.

#### Inherited from

DefaultStateManager.\_getAccountTrie

#### Source

node\_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node\_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:196

***

### \_getCodeDB()

> **`private`** **\_getCodeDB**(): `DB`\<`Uint8Array`, `Uint8Array`\>

Gets the storage trie for an account from the storage
cache or does a lookup.

#### Inherited from

DefaultStateManager.\_getCodeDB

#### Source

node\_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node\_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:202

***

### \_getStorageTrie()

> **`private`** **\_getStorageTrie**(`addressOrHash`, `account`?): `Trie`

Gets the storage trie for an account from the storage
cache or does a lookup.

#### Parameters

▪ **addressOrHash**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/) \| `Uint8Array`

▪ **account?**: [`EthjsAccount`](/reference/tevm/utils/classes/ethjsaccount/)

#### Inherited from

DefaultStateManager.\_getStorageTrie

#### Source

node\_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node\_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:190

***

### \_modifyContractStorage()

> **`private`** **\_modifyContractStorage**(`address`, `account`, `modifyTrie`): `Promise`\<`void`\>

Modifies the storage trie of an account.

#### Parameters

▪ **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

Address of the account whose storage is to be modified

▪ **account**: [`EthjsAccount`](/reference/tevm/utils/classes/ethjsaccount/)

▪ **modifyTrie**: (`storageTrie`, `done`) => `void`

Function to modify the storage trie of the account

#### Inherited from

DefaultStateManager.\_modifyContractStorage

#### Source

node\_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node\_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:219

***

### \_writeContractStorage()

> **`protected`** **\_writeContractStorage**(`address`, `account`, `key`, `value`): `Promise`\<`void`\>

#### Parameters

▪ **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

▪ **account**: [`EthjsAccount`](/reference/tevm/utils/classes/ethjsaccount/)

▪ **key**: `Uint8Array`

▪ **value**: `Uint8Array`

#### Inherited from

DefaultStateManager.\_writeContractStorage

#### Source

node\_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node\_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:220

***

### checkpoint()

> **checkpoint**(): `Promise`\<`void`\>

Checkpoints the current state of the StateManager instance.
State changes that follow can then be committed by calling
`commit` or `reverted` by calling rollback.

#### Implementation of

[`TevmStateManagerInterface`](/reference/tevm/state/interfaces/tevmstatemanagerinterface/).[`checkpoint`](/reference/tevm/state/interfaces/tevmstatemanagerinterface/#checkpoint)

#### Inherited from

DefaultStateManager.checkpoint

#### Source

node\_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node\_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:241

***

### clearCaches()

> **clearCaches**(): `void`

Clears all underlying caches

#### Inherited from

DefaultStateManager.clearCaches

#### Source

node\_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node\_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:336

***

### clearContractStorage()

> **clearContractStorage**(`address`): `Promise`\<`void`\>

Clears all storage entries for the account corresponding to `address`.

#### Parameters

▪ **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

Address to clear the storage of

#### Implementation of

[`TevmStateManagerInterface`](/reference/tevm/state/interfaces/tevmstatemanagerinterface/).[`clearContractStorage`](/reference/tevm/state/interfaces/tevmstatemanagerinterface/#clearcontractstorage)

#### Inherited from

DefaultStateManager.clearContractStorage

#### Source

node\_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node\_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:235

***

### commit()

> **commit**(): `Promise`\<`void`\>

Commits the current change-set to the instance since the
last call to checkpoint.

#### Implementation of

[`TevmStateManagerInterface`](/reference/tevm/state/interfaces/tevmstatemanagerinterface/).[`commit`](/reference/tevm/state/interfaces/tevmstatemanagerinterface/#commit)

#### Inherited from

DefaultStateManager.commit

#### Source

node\_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node\_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:246

***

### deepCopy()

> **deepCopy**(): `Promise`\<[`NormalStateManager`](/reference/tevm/state/classes/normalstatemanager/)\>

Returns a new instance of the ForkStateManager with the same opts and all storage copied over

#### Source

[packages/state/src/NormalStateManager.ts:58](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/NormalStateManager.ts#L58)

***

### deleteAccount()

> **deleteAccount**(`address`): `Promise`\<`void`\>

Deletes an account from state under the provided `address`.

#### Parameters

▪ **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

Address of the account which should be deleted

#### Implementation of

[`TevmStateManagerInterface`](/reference/tevm/state/interfaces/tevmstatemanagerinterface/).[`deleteAccount`](/reference/tevm/state/interfaces/tevmstatemanagerinterface/#deleteaccount)

#### Inherited from

DefaultStateManager.deleteAccount

#### Source

node\_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node\_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:170

***

### dumpCanonicalGenesis()

> **dumpCanonicalGenesis**(): `Promise`\<[`TevmState`](/reference/tevm/state/type-aliases/tevmstate/)\>

Dumps the state of the state manager as a [TevmState](/reference/tevm/state/type-aliases/tevmstate/)

#### Source

[packages/state/src/NormalStateManager.ts:184](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/NormalStateManager.ts#L184)

***

### dumpStorage()

> **dumpStorage**(`address`): `Promise`\<`StorageDump`\>

Dumps the RLP-encoded storage values for an `account` specified by `address`.

#### Parameters

▪ **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

The address of the `account` to return storage for

#### Returns

- The state of the account as an `Object` map.
Keys are are the storage keys, values are the storage values as strings.
Both are represented as hex strings without the `0x` prefix.

#### Implementation of

[`TevmStateManagerInterface`](/reference/tevm/state/interfaces/tevmstatemanagerinterface/).[`dumpStorage`](/reference/tevm/state/interfaces/tevmstatemanagerinterface/#dumpstorage)

#### Inherited from

DefaultStateManager.dumpStorage

#### Source

node\_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node\_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:289

***

### dumpStorageRange()

> **dumpStorageRange**(`address`, `startKey`, `limit`): `Promise`\<`StorageRange`\>

Dumps a limited number of RLP-encoded storage values for an account specified by `address`,
starting from `startKey` or greater.

#### Parameters

▪ **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

The address of the `account` to return storage for.

▪ **startKey**: `bigint`

The bigint representation of the smallest storage key that will be returned.

▪ **limit**: `number`

The maximum number of storage values that will be returned.

#### Returns

- A [StorageRange]([object Object]) object that will contain at most `limit` entries in its `storage` field.
The object will also contain `nextKey`, the next (hashed) storage key after the range included in `storage`.

#### Implementation of

[`TevmStateManagerInterface`](/reference/tevm/state/interfaces/tevmstatemanagerinterface/).[`dumpStorageRange`](/reference/tevm/state/interfaces/tevmstatemanagerinterface/#dumpstoragerange)

#### Inherited from

DefaultStateManager.dumpStorageRange

#### Source

node\_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node\_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:299

***

### flush()

> **flush**(): `Promise`\<`void`\>

Writes all cache items to the trie

#### Inherited from

DefaultStateManager.flush

#### Source

node\_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node\_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:255

***

### generateCanonicalGenesis()

> **generateCanonicalGenesis**(`state`): `Promise`\<`void`\>

Loads a [TevmState](/reference/tevm/state/type-aliases/tevmstate/) into the state manager

#### Parameters

▪ **state**: [`TevmState`](/reference/tevm/state/type-aliases/tevmstate/)

#### Implementation of

[`TevmStateManagerInterface`](/reference/tevm/state/interfaces/tevmstatemanagerinterface/).[`generateCanonicalGenesis`](/reference/tevm/state/interfaces/tevmstatemanagerinterface/#generatecanonicalgenesis)

#### Overrides

DefaultStateManager.generateCanonicalGenesis

#### Source

[packages/state/src/NormalStateManager.ts:148](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/NormalStateManager.ts#L148)

***

### getAccount()

> **getAccount**(`address`): `Promise`\<`undefined` \| [`EthjsAccount`](/reference/tevm/utils/classes/ethjsaccount/)\>

Gets the account associated with `address` or `undefined` if account does not exist

#### Parameters

▪ **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

Address of the `account` to get

#### Implementation of

[`TevmStateManagerInterface`](/reference/tevm/state/interfaces/tevmstatemanagerinterface/).[`getAccount`](/reference/tevm/state/interfaces/tevmstatemanagerinterface/#getaccount)

#### Inherited from

DefaultStateManager.getAccount

#### Source

node\_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node\_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:151

***

### getAccountAddresses()

> **getAccountAddresses**(): \`0x${string}\`[]

Retrieves the addresses of all the accounts in the state.

#### Returns

An array of account addresses.

#### Implementation of

[`TevmStateManagerInterface`](/reference/tevm/state/interfaces/tevmstatemanagerinterface/).[`getAccountAddresses`](/reference/tevm/state/interfaces/tevmstatemanagerinterface/#getaccountaddresses)

#### Source

[packages/state/src/NormalStateManager.ts:45](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/NormalStateManager.ts#L45)

***

### getContractCode()

> **getContractCode**(`address`): `Promise`\<`Uint8Array`\>

Gets the code corresponding to the provided `address`.

#### Parameters

▪ **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

Address to get the `code` for

#### Returns

-  Resolves with the code corresponding to the provided address.
Returns an empty `Uint8Array` if the account has no associated code.

#### Implementation of

[`TevmStateManagerInterface`](/reference/tevm/state/interfaces/tevmstatemanagerinterface/).[`getContractCode`](/reference/tevm/state/interfaces/tevmstatemanagerinterface/#getcontractcode)

#### Inherited from

DefaultStateManager.getContractCode

#### Source

node\_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node\_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:184

***

### getContractStorage()

> **getContractStorage**(`address`, `key`): `Promise`\<`Uint8Array`\>

Gets the storage value associated with the provided `address` and `key`. This method returns
the shortest representation of the stored value.

#### Parameters

▪ **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

Address of the account to get the storage for

▪ **key**: `Uint8Array`

Key in the account's storage to get the value for. Must be 32 bytes long.

#### Returns

- The storage value for the account
corresponding to the provided address at the provided key.
If this does not exist an empty `Uint8Array` is returned.

#### Implementation of

[`TevmStateManagerInterface`](/reference/tevm/state/interfaces/tevmstatemanagerinterface/).[`getContractStorage`](/reference/tevm/state/interfaces/tevmstatemanagerinterface/#getcontractstorage)

#### Inherited from

DefaultStateManager.getContractStorage

#### Source

node\_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node\_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:212

***

### getProof()

> **getProof**(`address`, `storageSlots`?): `Promise`\<`Proof`\>

Get an EIP-1186 proof

#### Parameters

▪ **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

address to get proof of

▪ **storageSlots?**: `Uint8Array`[]

storage slots to get proof of

#### Implementation of

[`TevmStateManagerInterface`](/reference/tevm/state/interfaces/tevmstatemanagerinterface/).[`getProof`](/reference/tevm/state/interfaces/tevmstatemanagerinterface/#getproof)

#### Inherited from

DefaultStateManager.getProof

#### Source

node\_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node\_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:261

***

### getStateRoot()

> **getStateRoot**(): `Promise`\<`Uint8Array`\>

Gets the state-root of the Merkle-Patricia trie representation
of the state of this StateManager. Will error if there are uncommitted
checkpoints on the instance.

#### Returns

- Returns the state-root of the `StateManager`

#### Implementation of

[`TevmStateManagerInterface`](/reference/tevm/state/interfaces/tevmstatemanagerinterface/).[`getStateRoot`](/reference/tevm/state/interfaces/tevmstatemanagerinterface/#getstateroot)

#### Inherited from

DefaultStateManager.getStateRoot

#### Source

node\_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node\_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:273

***

### hasStateRoot()

> **hasStateRoot**(`root`): `Promise`\<`boolean`\>

Checks whether there is a state corresponding to a stateRoot

#### Parameters

▪ **root**: `Uint8Array`

#### Implementation of

[`TevmStateManagerInterface`](/reference/tevm/state/interfaces/tevmstatemanagerinterface/).[`hasStateRoot`](/reference/tevm/state/interfaces/tevmstatemanagerinterface/#hasstateroot)

#### Inherited from

DefaultStateManager.hasStateRoot

#### Source

node\_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node\_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:309

***

### modifyAccountFields()

> **modifyAccountFields**(`address`, `accountFields`): `Promise`\<`void`\>

Gets the account associated with `address`, modifies the given account
fields, then saves the account into state. Account fields can include
`nonce`, `balance`, `storageRoot`, and `codeHash`.

#### Parameters

▪ **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

Address of the account to modify

▪ **accountFields**: `Partial`\<`Pick`\<[`EthjsAccount`](/reference/tevm/utils/classes/ethjsaccount/), `"nonce"` \| `"balance"` \| `"storageRoot"` \| `"codeHash"`\>\>

Object containing account fields and values to modify

#### Implementation of

[`TevmStateManagerInterface`](/reference/tevm/state/interfaces/tevmstatemanagerinterface/).[`modifyAccountFields`](/reference/tevm/state/interfaces/tevmstatemanagerinterface/#modifyaccountfields)

#### Inherited from

DefaultStateManager.modifyAccountFields

#### Source

node\_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node\_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:165

***

### putAccount()

> **putAccount**(`address`, `account`): `Promise`\<`void`\>

Saves an account into state under the provided `address`.

#### Parameters

▪ **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

Address under which to store `account`

▪ **account**: `undefined` \| [`EthjsAccount`](/reference/tevm/utils/classes/ethjsaccount/)

The account to store or undefined if to be deleted

#### Implementation of

[`TevmStateManagerInterface`](/reference/tevm/state/interfaces/tevmstatemanagerinterface/).[`putAccount`](/reference/tevm/state/interfaces/tevmstatemanagerinterface/#putaccount)

#### Inherited from

DefaultStateManager.putAccount

#### Source

node\_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node\_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:157

***

### putContractCode()

> **putContractCode**(`address`, `value`): `Promise`\<`void`\>

Adds `value` to the state trie as code, and sets `codeHash` on the account
corresponding to `address` to reference this.

#### Parameters

▪ **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

Address of the `account` to add the `code` for

▪ **value**: `Uint8Array`

The value of the `code`

#### Implementation of

[`TevmStateManagerInterface`](/reference/tevm/state/interfaces/tevmstatemanagerinterface/).[`putContractCode`](/reference/tevm/state/interfaces/tevmstatemanagerinterface/#putcontractcode)

#### Inherited from

DefaultStateManager.putContractCode

#### Source

node\_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node\_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:177

***

### putContractStorage()

> **putContractStorage**(`address`, `key`, `value`): `Promise`\<`void`\>

Adds value to the state trie for the `account`
corresponding to `address` at the provided `key`.

#### Parameters

▪ **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

Address to set a storage value for

▪ **key**: `Uint8Array`

Key to set the value at. Must be 32 bytes long.

▪ **value**: `Uint8Array`

Value to set at `key` for account corresponding to `address`.
Cannot be more than 32 bytes. Leading zeros are stripped.
If it is a empty or filled with zeros, deletes the value.

#### Implementation of

[`TevmStateManagerInterface`](/reference/tevm/state/interfaces/tevmstatemanagerinterface/).[`putContractStorage`](/reference/tevm/state/interfaces/tevmstatemanagerinterface/#putcontractstorage)

#### Inherited from

DefaultStateManager.putContractStorage

#### Source

node\_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node\_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:230

***

### revert()

> **revert**(): `Promise`\<`void`\>

Reverts the current change-set to the instance since the
last call to checkpoint.

#### Implementation of

[`TevmStateManagerInterface`](/reference/tevm/state/interfaces/tevmstatemanagerinterface/).[`revert`](/reference/tevm/state/interfaces/tevmstatemanagerinterface/#revert)

#### Inherited from

DefaultStateManager.revert

#### Source

node\_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node\_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:251

***

### setStateRoot()

> **setStateRoot**(`stateRoot`, `clearCache`?): `Promise`\<`void`\>

Sets the state of the instance to that represented
by the provided `stateRoot`. Will error if there are uncommitted
checkpoints on the instance or if the state root does not exist in
the state trie.

#### Parameters

▪ **stateRoot**: `Uint8Array`

The state-root to reset the instance to

▪ **clearCache?**: `boolean`

#### Implementation of

[`TevmStateManagerInterface`](/reference/tevm/state/interfaces/tevmstatemanagerinterface/).[`setStateRoot`](/reference/tevm/state/interfaces/tevmstatemanagerinterface/#setstateroot)

#### Inherited from

DefaultStateManager.setStateRoot

#### Source

node\_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node\_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:281

***

### shallowCopy()

> **shallowCopy**(`downlevelCaches`): [`NormalStateManager`](/reference/tevm/state/classes/normalstatemanager/)

Returns a new instance of the ForkStateManager with the same opts

#### Parameters

▪ **downlevelCaches**: `boolean`

#### Implementation of

[`TevmStateManagerInterface`](/reference/tevm/state/interfaces/tevmstatemanagerinterface/).[`shallowCopy`](/reference/tevm/state/interfaces/tevmstatemanagerinterface/#shallowcopy)

#### Overrides

DefaultStateManager.shallowCopy

#### Source

[packages/state/src/NormalStateManager.ts:112](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/NormalStateManager.ts#L112)

***

### verifyProof()

> **verifyProof**(`proof`): `Promise`\<`boolean`\>

Verify an EIP-1186 proof. Throws if proof is invalid, otherwise returns true.

#### Parameters

▪ **proof**: `Proof`

the proof to prove

#### Inherited from

DefaultStateManager.verifyProof

#### Source

node\_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node\_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:266

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
