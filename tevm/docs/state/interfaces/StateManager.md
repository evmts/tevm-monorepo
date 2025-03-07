[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [state](../README.md) / StateManager

# Interface: StateManager

Defined in: packages/state/dist/index.d.ts:123

## Extends

- [`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md)

## Properties

### \_baseState

> **\_baseState**: [`BaseState`](../type-aliases/BaseState.md)

Defined in: packages/state/dist/index.d.ts:127

The internal state representation

***

### getAccountAddresses()

> **getAccountAddresses**: () => `Set`\<`` `0x${string}` ``\>

Defined in: packages/state/dist/index.d.ts:132

Returns contract addresses

#### Returns

`Set`\<`` `0x${string}` ``\>

***

### originalStorageCache

> **originalStorageCache**: `object`

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:136

#### clear()

##### Returns

`void`

#### get()

##### Parameters

###### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

###### key

`Uint8Array`

##### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`originalStorageCache`](../../common/interfaces/EvmStateManagerInterface.md#originalstoragecache)

***

### ready()

> **ready**: () => `Promise`\<`true`\>

Defined in: packages/state/dist/index.d.ts:128

#### Returns

`Promise`\<`true`\>

## Methods

### checkChunkWitnessPresent()?

> `optional` **checkChunkWitnessPresent**(`contract`, `programCounter`): `Promise`\<`boolean`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:133

#### Parameters

##### contract

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

##### programCounter

`number`

#### Returns

`Promise`\<`boolean`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`checkChunkWitnessPresent`](../../common/interfaces/EvmStateManagerInterface.md#checkchunkwitnesspresent)

***

### checkpoint()

> **checkpoint**(): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:124

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`checkpoint`](../../common/interfaces/EvmStateManagerInterface.md#checkpoint)

***

### clearCaches()

> **clearCaches**(): `void`

Defined in: packages/state/dist/index.d.ts:144

Resets all internal caches

#### Returns

`void`

***

### clearContractStorage()

> **clearContractStorage**(`address`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:123

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`clearContractStorage`](../../common/interfaces/EvmStateManagerInterface.md#clearcontractstorage)

***

### commit()

> **commit**(`createNewStateRoot`?): `Promise`\<`void`\>

Defined in: packages/state/dist/index.d.ts:154

Commits the current state.

#### Parameters

##### createNewStateRoot?

`boolean`

**`Experimental`**

Whether to create a new state root
Defaults to true.
This api is not stable

#### Returns

`Promise`\<`void`\>

#### Overrides

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`commit`](../../common/interfaces/EvmStateManagerInterface.md#commit)

***

### deepCopy()

> **deepCopy**(): `Promise`\<[`StateManager`](StateManager.md)\>

Defined in: packages/state/dist/index.d.ts:136

Returns a new instance of the ForkStateManager with the same opts and all storage copied over

#### Returns

`Promise`\<[`StateManager`](StateManager.md)\>

***

### deleteAccount()

> **deleteAccount**(`address`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:116

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`deleteAccount`](../../common/interfaces/EvmStateManagerInterface.md#deleteaccount)

***

### dumpCanonicalGenesis()

> **dumpCanonicalGenesis**(): `Promise`\<[`TevmState`](../../index/type-aliases/TevmState.md)\>

Defined in: packages/state/dist/index.d.ts:140

Dumps the state of the state manager as a [TevmState](../../index/type-aliases/TevmState.md)

#### Returns

`Promise`\<[`TevmState`](../../index/type-aliases/TevmState.md)\>

***

### dumpStorage()

> **dumpStorage**(`address`): `Promise`\<[`StorageDump`](../../common/interfaces/StorageDump.md)\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:140

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`Promise`\<[`StorageDump`](../../common/interfaces/StorageDump.md)\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`dumpStorage`](../../common/interfaces/EvmStateManagerInterface.md#dumpstorage)

***

### dumpStorageRange()

> **dumpStorageRange**(`address`, `startKey`, `limit`): `Promise`\<[`StorageRange`](../../common/interfaces/StorageRange.md)\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:141

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

##### startKey

`bigint`

##### limit

`number`

#### Returns

`Promise`\<[`StorageRange`](../../common/interfaces/StorageRange.md)\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`dumpStorageRange`](../../common/interfaces/EvmStateManagerInterface.md#dumpstoragerange)

***

### generateCanonicalGenesis()

> **generateCanonicalGenesis**(`initState`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:142

#### Parameters

##### initState

`any`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`generateCanonicalGenesis`](../../common/interfaces/EvmStateManagerInterface.md#generatecanonicalgenesis)

***

### getAccount()

> **getAccount**(`address`): `Promise`\<`undefined` \| [`EthjsAccount`](../../utils/classes/EthjsAccount.md)\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:114

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`Promise`\<`undefined` \| [`EthjsAccount`](../../utils/classes/EthjsAccount.md)\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`getAccount`](../../common/interfaces/EvmStateManagerInterface.md#getaccount)

***

### getAppliedKey()?

> `optional` **getAppliedKey**(`address`): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:132

#### Parameters

##### address

`Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`getAppliedKey`](../../common/interfaces/EvmStateManagerInterface.md#getappliedkey)

***

### getContractCode()

> **getContractCode**(`address`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:119

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`getContractCode`](../../common/interfaces/EvmStateManagerInterface.md#getcontractcode)

***

### getContractCodeSize()?

> `optional` **getContractCodeSize**(`address`): `Promise`\<`number`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:120

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`Promise`\<`number`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`getContractCodeSize`](../../common/interfaces/EvmStateManagerInterface.md#getcontractcodesize)

***

### getContractStorage()

> **getContractStorage**(`address`, `key`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:121

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

##### key

`Uint8Array`

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`getContractStorage`](../../common/interfaces/EvmStateManagerInterface.md#getcontractstorage)

***

### getProof()

> **getProof**(`address`, `storageSlots`?): `Promise`\<`Proof`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:143

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

##### storageSlots?

`Uint8Array`\<`ArrayBufferLike`\>[]

#### Returns

`Promise`\<`Proof`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`getProof`](../../common/interfaces/EvmStateManagerInterface.md#getproof)

***

### getStateRoot()

> **getStateRoot**(): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:127

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`getStateRoot`](../../common/interfaces/EvmStateManagerInterface.md#getstateroot)

***

### hasStateRoot()

> **hasStateRoot**(`root`): `Promise`\<`boolean`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:130

#### Parameters

##### root

`Uint8Array`

#### Returns

`Promise`\<`boolean`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`hasStateRoot`](../../common/interfaces/EvmStateManagerInterface.md#hasstateroot)

***

### modifyAccountFields()

> **modifyAccountFields**(`address`, `accountFields`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:117

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

##### accountFields

`Partial`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`modifyAccountFields`](../../common/interfaces/EvmStateManagerInterface.md#modifyaccountfields)

***

### putAccount()

> **putAccount**(`address`, `account`?): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:115

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

##### account?

[`EthjsAccount`](../../utils/classes/EthjsAccount.md)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`putAccount`](../../common/interfaces/EvmStateManagerInterface.md#putaccount)

***

### putContractCode()

> **putContractCode**(`address`, `value`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:118

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

##### value

`Uint8Array`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`putContractCode`](../../common/interfaces/EvmStateManagerInterface.md#putcontractcode)

***

### putContractStorage()

> **putContractStorage**(`address`, `key`, `value`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:122

#### Parameters

##### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

##### key

`Uint8Array`

##### value

`Uint8Array`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`putContractStorage`](../../common/interfaces/EvmStateManagerInterface.md#putcontractstorage)

***

### revert()

> **revert**(): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:126

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`revert`](../../common/interfaces/EvmStateManagerInterface.md#revert)

***

### saveStateRoot()

> **saveStateRoot**(`root`, `state`): `void`

Defined in: packages/state/dist/index.d.ts:150

**`Experimental`**

Saves a state root to the state root mapping
THis API is considered unstable

#### Parameters

##### root

`Uint8Array`

##### state

[`TevmState`](../../index/type-aliases/TevmState.md)

#### Returns

`void`

***

### setStateRoot()

> **setStateRoot**(`stateRoot`, `clearCache`?): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:128

#### Parameters

##### stateRoot

`Uint8Array`

##### clearCache?

`boolean`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`setStateRoot`](../../common/interfaces/EvmStateManagerInterface.md#setstateroot)

***

### shallowCopy()

> **shallowCopy**(`downlevelCaches`?): [`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md)

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:144

#### Parameters

##### downlevelCaches?

`boolean`

#### Returns

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md)

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`shallowCopy`](../../common/interfaces/EvmStateManagerInterface.md#shallowcopy)
