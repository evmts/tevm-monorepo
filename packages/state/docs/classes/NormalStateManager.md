**@tevm/state** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > NormalStateManager

# Class: NormalStateManager

The ethereum state manager implementation for running Tevm in `normal` mode.
Normal mode does not fork/proxy to a external RPC url and has no unique features
Internally this state manager gets used when no proxy or fork url is passed into Tevm client

## See

 - ForkStateManager for a provider that uses forks state rather than always using latest state
 - ProxyStateManager for a provider that uses latest state rather than creating a fork

## Extends

- `DefaultStateManager`

## Implements

- [`TevmStateManagerInterface`](../interfaces/TevmStateManagerInterface.md)

## Constructors

### new NormalStateManager(opts)

> **new NormalStateManager**(`opts`?): [`NormalStateManager`](NormalStateManager.md)

Instantiate the StateManager interface.

#### Parameters

▪ **opts?**: `DefaultStateManagerOpts`

#### Inherited from

DefaultStateManager.constructor

#### Source

node\_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node\_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:146

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

### originalStorageCache

> **originalStorageCache**: `OriginalStorageCache`

#### Implementation of

[`TevmStateManagerInterface`](../interfaces/TevmStateManagerInterface.md).[`originalStorageCache`](../interfaces/TevmStateManagerInterface.md#originalstoragecache)

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

▪ **addressOrHash**: `Address` \| `Uint8Array`

▪ **account?**: `Account`

#### Inherited from

DefaultStateManager.\_getStorageTrie

#### Source

node\_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node\_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:190

***

### \_modifyContractStorage()

> **`private`** **\_modifyContractStorage**(`address`, `account`, `modifyTrie`): `Promise`\<`void`\>

Modifies the storage trie of an account.

#### Parameters

▪ **address**: `Address`

Address of the account whose storage is to be modified

▪ **account**: `Account`

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

▪ **address**: `Address`

▪ **account**: `Account`

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

[`TevmStateManagerInterface`](../interfaces/TevmStateManagerInterface.md).[`checkpoint`](../interfaces/TevmStateManagerInterface.md#checkpoint)

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

▪ **address**: `Address`

Address to clear the storage of

#### Implementation of

[`TevmStateManagerInterface`](../interfaces/TevmStateManagerInterface.md).[`clearContractStorage`](../interfaces/TevmStateManagerInterface.md#clearcontractstorage)

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

[`TevmStateManagerInterface`](../interfaces/TevmStateManagerInterface.md).[`commit`](../interfaces/TevmStateManagerInterface.md#commit)

#### Inherited from

DefaultStateManager.commit

#### Source

node\_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node\_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:246

***

### deleteAccount()

> **deleteAccount**(`address`): `Promise`\<`void`\>

Deletes an account from state under the provided `address`.

#### Parameters

▪ **address**: `Address`

Address of the account which should be deleted

#### Implementation of

[`TevmStateManagerInterface`](../interfaces/TevmStateManagerInterface.md).[`deleteAccount`](../interfaces/TevmStateManagerInterface.md#deleteaccount)

#### Inherited from

DefaultStateManager.deleteAccount

#### Source

node\_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node\_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:170

***

### dumpCanonicalGenesis()

> **dumpCanonicalGenesis**(): `Promise`\<[`SerializableTevmState`](../type-aliases/SerializableTevmState.md)\>

Dumps the state of the state manager as a [SerializableTevmState](../type-aliases/SerializableTevmState.md)

#### Source

[packages/state/src/NormalStateManager.ts:121](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/NormalStateManager.ts#L121)

***

### dumpStorage()

> **dumpStorage**(`address`): `Promise`\<`StorageDump`\>

Dumps the RLP-encoded storage values for an `account` specified by `address`.

#### Parameters

▪ **address**: `Address`

The address of the `account` to return storage for

#### Returns

- The state of the account as an `Object` map.
Keys are are the storage keys, values are the storage values as strings.
Both are represented as hex strings without the `0x` prefix.

#### Implementation of

[`TevmStateManagerInterface`](../interfaces/TevmStateManagerInterface.md).[`dumpStorage`](../interfaces/TevmStateManagerInterface.md#dumpstorage)

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

▪ **address**: `Address`

The address of the `account` to return storage for.

▪ **startKey**: `bigint`

The bigint representation of the smallest storage key that will be returned.

▪ **limit**: `number`

The maximum number of storage values that will be returned.

#### Returns

- A [StorageRange]([object Object]) object that will contain at most `limit` entries in its `storage` field.
The object will also contain `nextKey`, the next (hashed) storage key after the range included in `storage`.

#### Implementation of

[`TevmStateManagerInterface`](../interfaces/TevmStateManagerInterface.md).[`dumpStorageRange`](../interfaces/TevmStateManagerInterface.md#dumpstoragerange)

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

Loads a [SerializableTevmState](../type-aliases/SerializableTevmState.md) into the state manager

#### Parameters

▪ **state**: [`SerializableTevmState`](../type-aliases/SerializableTevmState.md)

#### Implementation of

[`TevmStateManagerInterface`](../interfaces/TevmStateManagerInterface.md).[`generateCanonicalGenesis`](../interfaces/TevmStateManagerInterface.md#generatecanonicalgenesis)

#### Overrides

DefaultStateManager.generateCanonicalGenesis

#### Source

[packages/state/src/NormalStateManager.ts:85](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/NormalStateManager.ts#L85)

***

### getAccount()

> **getAccount**(`address`): `Promise`\<`undefined` \| `Account`\>

Gets the account associated with `address` or `undefined` if account does not exist

#### Parameters

▪ **address**: `Address`

Address of the `account` to get

#### Implementation of

[`TevmStateManagerInterface`](../interfaces/TevmStateManagerInterface.md).[`getAccount`](../interfaces/TevmStateManagerInterface.md#getaccount)

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

[`TevmStateManagerInterface`](../interfaces/TevmStateManagerInterface.md).[`getAccountAddresses`](../interfaces/TevmStateManagerInterface.md#getaccountaddresses)

#### Source

[packages/state/src/NormalStateManager.ts:22](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/NormalStateManager.ts#L22)

***

### getContractCode()

> **getContractCode**(`address`): `Promise`\<`Uint8Array`\>

Gets the code corresponding to the provided `address`.

#### Parameters

▪ **address**: `Address`

Address to get the `code` for

#### Returns

-  Resolves with the code corresponding to the provided address.
Returns an empty `Uint8Array` if the account has no associated code.

#### Implementation of

[`TevmStateManagerInterface`](../interfaces/TevmStateManagerInterface.md).[`getContractCode`](../interfaces/TevmStateManagerInterface.md#getcontractcode)

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

▪ **address**: `Address`

Address of the account to get the storage for

▪ **key**: `Uint8Array`

Key in the account's storage to get the value for. Must be 32 bytes long.

#### Returns

- The storage value for the account
corresponding to the provided address at the provided key.
If this does not exist an empty `Uint8Array` is returned.

#### Implementation of

[`TevmStateManagerInterface`](../interfaces/TevmStateManagerInterface.md).[`getContractStorage`](../interfaces/TevmStateManagerInterface.md#getcontractstorage)

#### Inherited from

DefaultStateManager.getContractStorage

#### Source

node\_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node\_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:212

***

### getProof()

> **getProof**(`address`, `storageSlots`?): `Promise`\<`Proof`\>

Get an EIP-1186 proof

#### Parameters

▪ **address**: `Address`

address to get proof of

▪ **storageSlots?**: `Uint8Array`[]

storage slots to get proof of

#### Implementation of

[`TevmStateManagerInterface`](../interfaces/TevmStateManagerInterface.md).[`getProof`](../interfaces/TevmStateManagerInterface.md#getproof)

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

[`TevmStateManagerInterface`](../interfaces/TevmStateManagerInterface.md).[`getStateRoot`](../interfaces/TevmStateManagerInterface.md#getstateroot)

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

[`TevmStateManagerInterface`](../interfaces/TevmStateManagerInterface.md).[`hasStateRoot`](../interfaces/TevmStateManagerInterface.md#hasstateroot)

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

▪ **address**: `Address`

Address of the account to modify

▪ **accountFields**: `Partial`\<`Pick`\<`Account`, `"nonce"` \| `"balance"` \| `"storageRoot"` \| `"codeHash"`\>\>

Object containing account fields and values to modify

#### Implementation of

[`TevmStateManagerInterface`](../interfaces/TevmStateManagerInterface.md).[`modifyAccountFields`](../interfaces/TevmStateManagerInterface.md#modifyaccountfields)

#### Inherited from

DefaultStateManager.modifyAccountFields

#### Source

node\_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node\_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:165

***

### putAccount()

> **putAccount**(`address`, `account`): `Promise`\<`void`\>

Saves an account into state under the provided `address`.

#### Parameters

▪ **address**: `Address`

Address under which to store `account`

▪ **account**: `undefined` \| `Account`

The account to store or undefined if to be deleted

#### Implementation of

[`TevmStateManagerInterface`](../interfaces/TevmStateManagerInterface.md).[`putAccount`](../interfaces/TevmStateManagerInterface.md#putaccount)

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

▪ **address**: `Address`

Address of the `account` to add the `code` for

▪ **value**: `Uint8Array`

The value of the `code`

#### Implementation of

[`TevmStateManagerInterface`](../interfaces/TevmStateManagerInterface.md).[`putContractCode`](../interfaces/TevmStateManagerInterface.md#putcontractcode)

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

▪ **address**: `Address`

Address to set a storage value for

▪ **key**: `Uint8Array`

Key to set the value at. Must be 32 bytes long.

▪ **value**: `Uint8Array`

Value to set at `key` for account corresponding to `address`.
Cannot be more than 32 bytes. Leading zeros are stripped.
If it is a empty or filled with zeros, deletes the value.

#### Implementation of

[`TevmStateManagerInterface`](../interfaces/TevmStateManagerInterface.md).[`putContractStorage`](../interfaces/TevmStateManagerInterface.md#putcontractstorage)

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

[`TevmStateManagerInterface`](../interfaces/TevmStateManagerInterface.md).[`revert`](../interfaces/TevmStateManagerInterface.md#revert)

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

[`TevmStateManagerInterface`](../interfaces/TevmStateManagerInterface.md).[`setStateRoot`](../interfaces/TevmStateManagerInterface.md#setstateroot)

#### Inherited from

DefaultStateManager.setStateRoot

#### Source

node\_modules/.pnpm/@ethereumjs+statemanager@2.1.0/node\_modules/@ethereumjs/statemanager/dist/esm/stateManager.d.ts:281

***

### shallowCopy()

> **shallowCopy**(`downlevelCaches`): [`NormalStateManager`](NormalStateManager.md)

Returns a new instance of the ForkStateManager with the same opts

#### Parameters

▪ **downlevelCaches**: `boolean`

#### Implementation of

[`TevmStateManagerInterface`](../interfaces/TevmStateManagerInterface.md).[`shallowCopy`](../interfaces/TevmStateManagerInterface.md#shallowcopy)

#### Overrides

DefaultStateManager.shallowCopy

#### Source

[packages/state/src/NormalStateManager.ts:35](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/NormalStateManager.ts#L35)

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
