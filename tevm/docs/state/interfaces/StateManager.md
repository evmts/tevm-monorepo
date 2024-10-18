[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [state](../README.md) / StateManager

# Interface: StateManager

## Extends

- [`StateManagerInterface`](../../common/interfaces/StateManagerInterface.md)

## Properties

### \_baseState

> **\_baseState**: [`BaseState`](../type-aliases/BaseState.md)

The internal state representation

#### Defined in

packages/state/dist/index.d.ts:127

***

### getAccountAddresses()

> **getAccountAddresses**: () => `Set`\<\`0x$\{string\}\`\>

Returns contract addresses

#### Returns

`Set`\<\`0x$\{string\}\`\>

#### Defined in

packages/state/dist/index.d.ts:132

***

### originalStorageCache

> **originalStorageCache**: `object`

#### clear()

##### Returns

`void`

#### get()

##### Parameters

• **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

• **key**: `Uint8Array`

##### Returns

`Promise`\<`Uint8Array`\>

#### Inherited from

[`StateManagerInterface`](../../common/interfaces/StateManagerInterface.md).[`originalStorageCache`](../../common/interfaces/StateManagerInterface.md#originalstoragecache)

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:136

***

### ready()

> **ready**: () => `Promise`\<`true`\>

#### Returns

`Promise`\<`true`\>

#### Defined in

packages/state/dist/index.d.ts:128

## Methods

### checkChunkWitnessPresent()?

> `optional` **checkChunkWitnessPresent**(`contract`, `programCounter`): `Promise`\<`boolean`\>

#### Parameters

• **contract**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

• **programCounter**: `number`

#### Returns

`Promise`\<`boolean`\>

#### Inherited from

[`StateManagerInterface`](../../common/interfaces/StateManagerInterface.md).[`checkChunkWitnessPresent`](../../common/interfaces/StateManagerInterface.md#checkchunkwitnesspresent)

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:133

***

### checkpoint()

> **checkpoint**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`StateManagerInterface`](../../common/interfaces/StateManagerInterface.md).[`checkpoint`](../../common/interfaces/StateManagerInterface.md#checkpoint)

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:124

***

### clearCaches()

> **clearCaches**(): `void`

Resets all internal caches

#### Returns

`void`

#### Defined in

packages/state/dist/index.d.ts:144

***

### clearContractStorage()

> **clearContractStorage**(`address`): `Promise`\<`void`\>

#### Parameters

• **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`StateManagerInterface`](../../common/interfaces/StateManagerInterface.md).[`clearContractStorage`](../../common/interfaces/StateManagerInterface.md#clearcontractstorage)

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:123

***

### commit()

> **commit**(`createNewStateRoot`?): `Promise`\<`void`\>

Commits the current state.

#### Parameters

• **createNewStateRoot?**: `boolean`

**`Experimental`**

Whether to create a new state root
Defaults to true.
This api is not stable

#### Returns

`Promise`\<`void`\>

#### Overrides

[`StateManagerInterface`](../../common/interfaces/StateManagerInterface.md).[`commit`](../../common/interfaces/StateManagerInterface.md#commit)

#### Defined in

packages/state/dist/index.d.ts:154

***

### deepCopy()

> **deepCopy**(): `Promise`\<[`StateManager`](StateManager.md)\>

Returns a new instance of the ForkStateManager with the same opts and all storage copied over

#### Returns

`Promise`\<[`StateManager`](StateManager.md)\>

#### Defined in

packages/state/dist/index.d.ts:136

***

### deleteAccount()

> **deleteAccount**(`address`): `Promise`\<`void`\>

#### Parameters

• **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`StateManagerInterface`](../../common/interfaces/StateManagerInterface.md).[`deleteAccount`](../../common/interfaces/StateManagerInterface.md#deleteaccount)

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:116

***

### dumpCanonicalGenesis()

> **dumpCanonicalGenesis**(): `Promise`\<[`TevmState`](../../index/type-aliases/TevmState.md)\>

Dumps the state of the state manager as a [TevmState](../../index/type-aliases/TevmState.md)

#### Returns

`Promise`\<[`TevmState`](../../index/type-aliases/TevmState.md)\>

#### Defined in

packages/state/dist/index.d.ts:140

***

### dumpStorage()

> **dumpStorage**(`address`): `Promise`\<[`StorageDump`](../../common/interfaces/StorageDump.md)\>

#### Parameters

• **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`Promise`\<[`StorageDump`](../../common/interfaces/StorageDump.md)\>

#### Inherited from

[`StateManagerInterface`](../../common/interfaces/StateManagerInterface.md).[`dumpStorage`](../../common/interfaces/StateManagerInterface.md#dumpstorage)

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:140

***

### dumpStorageRange()

> **dumpStorageRange**(`address`, `startKey`, `limit`): `Promise`\<[`StorageRange`](../../common/interfaces/StorageRange.md)\>

#### Parameters

• **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

• **startKey**: `bigint`

• **limit**: `number`

#### Returns

`Promise`\<[`StorageRange`](../../common/interfaces/StorageRange.md)\>

#### Inherited from

[`StateManagerInterface`](../../common/interfaces/StateManagerInterface.md).[`dumpStorageRange`](../../common/interfaces/StateManagerInterface.md#dumpstoragerange)

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:141

***

### generateCanonicalGenesis()

> **generateCanonicalGenesis**(`initState`): `Promise`\<`void`\>

#### Parameters

• **initState**: `any`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`StateManagerInterface`](../../common/interfaces/StateManagerInterface.md).[`generateCanonicalGenesis`](../../common/interfaces/StateManagerInterface.md#generatecanonicalgenesis)

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:142

***

### getAccount()

> **getAccount**(`address`): `Promise`\<`undefined` \| [`EthjsAccount`](../../utils/classes/EthjsAccount.md)\>

#### Parameters

• **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`Promise`\<`undefined` \| [`EthjsAccount`](../../utils/classes/EthjsAccount.md)\>

#### Inherited from

[`StateManagerInterface`](../../common/interfaces/StateManagerInterface.md).[`getAccount`](../../common/interfaces/StateManagerInterface.md#getaccount)

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:114

***

### getAppliedKey()?

> `optional` **getAppliedKey**(`address`): `Uint8Array`

#### Parameters

• **address**: `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

[`StateManagerInterface`](../../common/interfaces/StateManagerInterface.md).[`getAppliedKey`](../../common/interfaces/StateManagerInterface.md#getappliedkey)

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:132

***

### getContractCode()

> **getContractCode**(`address`): `Promise`\<`Uint8Array`\>

#### Parameters

• **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`Promise`\<`Uint8Array`\>

#### Inherited from

[`StateManagerInterface`](../../common/interfaces/StateManagerInterface.md).[`getContractCode`](../../common/interfaces/StateManagerInterface.md#getcontractcode)

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:119

***

### getContractCodeSize()?

> `optional` **getContractCodeSize**(`address`): `Promise`\<`number`\>

#### Parameters

• **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`Promise`\<`number`\>

#### Inherited from

[`StateManagerInterface`](../../common/interfaces/StateManagerInterface.md).[`getContractCodeSize`](../../common/interfaces/StateManagerInterface.md#getcontractcodesize)

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:120

***

### getContractStorage()

> **getContractStorage**(`address`, `key`): `Promise`\<`Uint8Array`\>

#### Parameters

• **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

• **key**: `Uint8Array`

#### Returns

`Promise`\<`Uint8Array`\>

#### Inherited from

[`StateManagerInterface`](../../common/interfaces/StateManagerInterface.md).[`getContractStorage`](../../common/interfaces/StateManagerInterface.md#getcontractstorage)

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:121

***

### getProof()

> **getProof**(`address`, `storageSlots`?): `Promise`\<`Proof`\>

#### Parameters

• **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

• **storageSlots?**: `Uint8Array`[]

#### Returns

`Promise`\<`Proof`\>

#### Inherited from

[`StateManagerInterface`](../../common/interfaces/StateManagerInterface.md).[`getProof`](../../common/interfaces/StateManagerInterface.md#getproof)

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:143

***

### getStateRoot()

> **getStateRoot**(): `Promise`\<`Uint8Array`\>

#### Returns

`Promise`\<`Uint8Array`\>

#### Inherited from

[`StateManagerInterface`](../../common/interfaces/StateManagerInterface.md).[`getStateRoot`](../../common/interfaces/StateManagerInterface.md#getstateroot)

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:127

***

### hasStateRoot()

> **hasStateRoot**(`root`): `Promise`\<`boolean`\>

#### Parameters

• **root**: `Uint8Array`

#### Returns

`Promise`\<`boolean`\>

#### Inherited from

[`StateManagerInterface`](../../common/interfaces/StateManagerInterface.md).[`hasStateRoot`](../../common/interfaces/StateManagerInterface.md#hasstateroot)

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:130

***

### modifyAccountFields()

> **modifyAccountFields**(`address`, `accountFields`): `Promise`\<`void`\>

#### Parameters

• **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

• **accountFields**: `Partial`\<`Pick`\<[`EthjsAccount`](../../utils/classes/EthjsAccount.md), `"nonce"` \| `"balance"` \| `"storageRoot"` \| `"codeHash"`\>\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`StateManagerInterface`](../../common/interfaces/StateManagerInterface.md).[`modifyAccountFields`](../../common/interfaces/StateManagerInterface.md#modifyaccountfields)

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:117

***

### putAccount()

> **putAccount**(`address`, `account`?): `Promise`\<`void`\>

#### Parameters

• **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

• **account?**: [`EthjsAccount`](../../utils/classes/EthjsAccount.md)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`StateManagerInterface`](../../common/interfaces/StateManagerInterface.md).[`putAccount`](../../common/interfaces/StateManagerInterface.md#putaccount)

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:115

***

### putContractCode()

> **putContractCode**(`address`, `value`): `Promise`\<`void`\>

#### Parameters

• **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

• **value**: `Uint8Array`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`StateManagerInterface`](../../common/interfaces/StateManagerInterface.md).[`putContractCode`](../../common/interfaces/StateManagerInterface.md#putcontractcode)

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:118

***

### putContractStorage()

> **putContractStorage**(`address`, `key`, `value`): `Promise`\<`void`\>

#### Parameters

• **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

• **key**: `Uint8Array`

• **value**: `Uint8Array`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`StateManagerInterface`](../../common/interfaces/StateManagerInterface.md).[`putContractStorage`](../../common/interfaces/StateManagerInterface.md#putcontractstorage)

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:122

***

### revert()

> **revert**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`StateManagerInterface`](../../common/interfaces/StateManagerInterface.md).[`revert`](../../common/interfaces/StateManagerInterface.md#revert)

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:126

***

### saveStateRoot()

> **saveStateRoot**(`root`, `state`): `void`

**`Experimental`**

Saves a state root to the state root mapping
THis API is considered unstable

#### Parameters

• **root**: `Uint8Array`

• **state**: [`TevmState`](../../index/type-aliases/TevmState.md)

#### Returns

`void`

#### Defined in

packages/state/dist/index.d.ts:150

***

### setStateRoot()

> **setStateRoot**(`stateRoot`, `clearCache`?): `Promise`\<`void`\>

#### Parameters

• **stateRoot**: `Uint8Array`

• **clearCache?**: `boolean`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`StateManagerInterface`](../../common/interfaces/StateManagerInterface.md).[`setStateRoot`](../../common/interfaces/StateManagerInterface.md#setstateroot)

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:128

***

### shallowCopy()

> **shallowCopy**(`downlevelCaches`?): [`StateManagerInterface`](../../common/interfaces/StateManagerInterface.md)

#### Parameters

• **downlevelCaches?**: `boolean`

#### Returns

[`StateManagerInterface`](../../common/interfaces/StateManagerInterface.md)

#### Inherited from

[`StateManagerInterface`](../../common/interfaces/StateManagerInterface.md).[`shallowCopy`](../../common/interfaces/StateManagerInterface.md#shallowcopy)

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:144
