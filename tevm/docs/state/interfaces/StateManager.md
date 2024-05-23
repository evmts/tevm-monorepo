[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [state](../README.md) / StateManager

# Interface: StateManager

## Extends

- [`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md)

## Properties

### \_baseState

> **\_baseState**: [`BaseState`](../type-aliases/BaseState.md)

The internal state representation

#### Source

packages/state/dist/index.d.ts:119

***

### getAccountAddresses()

> **getAccountAddresses**: () => \`0x$\{string\}\`[]

Returns contract addresses

#### Returns

\`0x$\{string\}\`[]

#### Source

packages/state/dist/index.d.ts:124

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

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`originalStorageCache`](../../common/interfaces/EvmStateManagerInterface.md#originalstoragecache)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:73

***

### ready()

> **ready**: () => `Promise`\<`true`\>

#### Returns

`Promise`\<`true`\>

#### Source

packages/state/dist/index.d.ts:120

## Methods

### checkpoint()

> **checkpoint**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`checkpoint`](../../common/interfaces/EvmStateManagerInterface.md#checkpoint)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:62

***

### clearCaches()

> **clearCaches**(): `void`

Resets all internal caches

#### Returns

`void`

#### Source

packages/state/dist/index.d.ts:136

***

### clearContractStorage()

> **clearContractStorage**(`address`): `Promise`\<`void`\>

#### Parameters

• **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`clearContractStorage`](../../common/interfaces/EvmStateManagerInterface.md#clearcontractstorage)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:61

***

### commit()

> **commit**(`createNewStateRoot`?): `Promise`\<`void`\>

Commits the current state.

#### Parameters

• **createNewStateRoot?**: `boolean`

Whether to create a new state root
Defaults to true.
This api is not stable

#### Returns

`Promise`\<`void`\>

#### Overrides

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`commit`](../../common/interfaces/EvmStateManagerInterface.md#commit)

#### Source

packages/state/dist/index.d.ts:146

***

### deepCopy()

> **deepCopy**(): `Promise`\<[`StateManager`](StateManager.md)\>

Returns a new instance of the ForkStateManager with the same opts and all storage copied over

#### Returns

`Promise`\<[`StateManager`](StateManager.md)\>

#### Source

packages/state/dist/index.d.ts:128

***

### deleteAccount()

> **deleteAccount**(`address`): `Promise`\<`void`\>

#### Parameters

• **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`deleteAccount`](../../common/interfaces/EvmStateManagerInterface.md#deleteaccount)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:55

***

### dumpCanonicalGenesis()

> **dumpCanonicalGenesis**(): `Promise`\<[`TevmState`](../../index/type-aliases/TevmState.md)\>

Dumps the state of the state manager as a [TevmState](../../index/type-aliases/TevmState.md)

#### Returns

`Promise`\<[`TevmState`](../../index/type-aliases/TevmState.md)\>

#### Source

packages/state/dist/index.d.ts:132

***

### dumpStorage()

> **dumpStorage**(`address`): `Promise`\<[`StorageDump`](../../common/interfaces/StorageDump.md)\>

#### Parameters

• **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`Promise`\<[`StorageDump`](../../common/interfaces/StorageDump.md)\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`dumpStorage`](../../common/interfaces/EvmStateManagerInterface.md#dumpstorage)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:77

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

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`dumpStorageRange`](../../common/interfaces/EvmStateManagerInterface.md#dumpstoragerange)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:78

***

### generateCanonicalGenesis()

> **generateCanonicalGenesis**(`initState`): `Promise`\<`void`\>

#### Parameters

• **initState**: `any`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`generateCanonicalGenesis`](../../common/interfaces/EvmStateManagerInterface.md#generatecanonicalgenesis)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:79

***

### getAccount()

> **getAccount**(`address`): `Promise`\<`undefined` \| [`EthjsAccount`](../../utils/classes/EthjsAccount.md)\>

#### Parameters

• **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`Promise`\<`undefined` \| [`EthjsAccount`](../../utils/classes/EthjsAccount.md)\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`getAccount`](../../common/interfaces/EvmStateManagerInterface.md#getaccount)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:53

***

### getAppliedKey()?

> `optional` **getAppliedKey**(`address`): `Uint8Array`

#### Parameters

• **address**: `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`getAppliedKey`](../../common/interfaces/EvmStateManagerInterface.md#getappliedkey)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:70

***

### getContractCode()

> **getContractCode**(`address`): `Promise`\<`Uint8Array`\>

#### Parameters

• **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`Promise`\<`Uint8Array`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`getContractCode`](../../common/interfaces/EvmStateManagerInterface.md#getcontractcode)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:58

***

### getContractStorage()

> **getContractStorage**(`address`, `key`): `Promise`\<`Uint8Array`\>

#### Parameters

• **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

• **key**: `Uint8Array`

#### Returns

`Promise`\<`Uint8Array`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`getContractStorage`](../../common/interfaces/EvmStateManagerInterface.md#getcontractstorage)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:59

***

### getProof()

> **getProof**(`address`, `storageSlots`?): `Promise`\<`Proof`\>

#### Parameters

• **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

• **storageSlots?**: `Uint8Array`[]

#### Returns

`Promise`\<`Proof`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`getProof`](../../common/interfaces/EvmStateManagerInterface.md#getproof)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:80

***

### getStateRoot()

> **getStateRoot**(): `Promise`\<`Uint8Array`\>

#### Returns

`Promise`\<`Uint8Array`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`getStateRoot`](../../common/interfaces/EvmStateManagerInterface.md#getstateroot)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:65

***

### hasStateRoot()

> **hasStateRoot**(`root`): `Promise`\<`boolean`\>

#### Parameters

• **root**: `Uint8Array`

#### Returns

`Promise`\<`boolean`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`hasStateRoot`](../../common/interfaces/EvmStateManagerInterface.md#hasstateroot)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:68

***

### modifyAccountFields()

> **modifyAccountFields**(`address`, `accountFields`): `Promise`\<`void`\>

#### Parameters

• **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

• **accountFields**: `Partial`\<`Pick`\<[`EthjsAccount`](../../utils/classes/EthjsAccount.md), `"nonce"` \| `"balance"` \| `"storageRoot"` \| `"codeHash"`\>\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`modifyAccountFields`](../../common/interfaces/EvmStateManagerInterface.md#modifyaccountfields)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:56

***

### putAccount()

> **putAccount**(`address`, `account`?): `Promise`\<`void`\>

#### Parameters

• **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

• **account?**: [`EthjsAccount`](../../utils/classes/EthjsAccount.md)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`putAccount`](../../common/interfaces/EvmStateManagerInterface.md#putaccount)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:54

***

### putContractCode()

> **putContractCode**(`address`, `value`): `Promise`\<`void`\>

#### Parameters

• **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

• **value**: `Uint8Array`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`putContractCode`](../../common/interfaces/EvmStateManagerInterface.md#putcontractcode)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:57

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

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`putContractStorage`](../../common/interfaces/EvmStateManagerInterface.md#putcontractstorage)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:60

***

### revert()

> **revert**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`revert`](../../common/interfaces/EvmStateManagerInterface.md#revert)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:64

***

### saveStateRoot()

`Experimental`

> **saveStateRoot**(`root`, `state`): `void`

Saves a state root to the state root mapping
THis API is considered unstable

#### Parameters

• **root**: `Uint8Array`

• **state**: [`TevmState`](../../index/type-aliases/TevmState.md)

#### Returns

`void`

#### Source

packages/state/dist/index.d.ts:142

***

### setStateRoot()

> **setStateRoot**(`stateRoot`, `clearCache`?): `Promise`\<`void`\>

#### Parameters

• **stateRoot**: `Uint8Array`

• **clearCache?**: `boolean`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`setStateRoot`](../../common/interfaces/EvmStateManagerInterface.md#setstateroot)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:66

***

### shallowCopy()

> **shallowCopy**(`downlevelCaches`?): [`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md)

#### Parameters

• **downlevelCaches?**: `boolean`

#### Returns

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md)

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`shallowCopy`](../../common/interfaces/EvmStateManagerInterface.md#shallowcopy)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:81
