**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [state](../README.md) > StateManager

# Interface: StateManager

The core data structure powering the state manager internally

## Extends

- `EVMStateManagerInterface`.[`BaseState`](../type-aliases/BaseState.md)

## Properties

### \_caches

> **\_caches**: [`StateCache`](../type-aliases/StateCache.md)

#### Inherited from

BaseState.\_caches

#### Source

packages/state/types/BaseState.d.ts:14

***

### \_currentStateRoot

> **\_currentStateRoot**: `Uint8Array`

#### Inherited from

BaseState.\_currentStateRoot

#### Source

packages/state/types/BaseState.d.ts:12

***

### \_options

> **\_options**: [`StateOptions`](../../index/type-aliases/StateOptions.md)

#### Inherited from

BaseState.\_options

#### Source

packages/state/types/BaseState.d.ts:13

***

### \_stateRoots

> **\_stateRoots**: [`StateRoots`](../type-aliases/StateRoots.md)

Mapping of hashes to State roots

#### Inherited from

BaseState.\_stateRoots

#### Source

packages/state/types/BaseState.d.ts:11

***

### getAccountAddresses

> **getAccountAddresses**: () => \`0x${string}\`[]

Returns contract addresses

#### Source

packages/state/types/StateManager.d.ts:9

***

### originalStorageCache

> **originalStorageCache**: `object`

#### Type declaration

##### clear()

##### get()

###### Parameters

▪ **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

▪ **key**: `Uint8Array`

#### Inherited from

EvmStateManagerInterface.originalStorageCache

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:73

***

### ready

> **ready**: () => `Promise`\<`true`\>

#### Inherited from

BaseState.ready

#### Source

packages/state/types/BaseState.d.ts:7

## Methods

### checkpoint()

> **checkpoint**(): `Promise`\<`void`\>

#### Inherited from

EvmStateManagerInterface.checkpoint

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:62

***

### clearCaches()

> **clearCaches**(): `void`

Resets all internal caches

#### Source

packages/state/types/StateManager.d.ts:21

***

### clearContractStorage()

> **clearContractStorage**(`address`): `Promise`\<`void`\>

#### Parameters

▪ **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Inherited from

EvmStateManagerInterface.clearContractStorage

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:61

***

### commit()

> **commit**(): `Promise`\<`void`\>

#### Inherited from

EvmStateManagerInterface.commit

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:63

***

### deepCopy()

> **deepCopy**(): `Promise`\<[`StateManager`](StateManager.md)\>

Returns a new instance of the ForkStateManager with the same opts and all storage copied over

#### Source

packages/state/types/StateManager.d.ts:13

***

### deleteAccount()

> **deleteAccount**(`address`): `Promise`\<`void`\>

#### Parameters

▪ **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Inherited from

EvmStateManagerInterface.deleteAccount

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:55

***

### dumpCanonicalGenesis()

> **dumpCanonicalGenesis**(): `Promise`\<[`TevmState`](../../index/type-aliases/TevmState.md)\>

Dumps the state of the state manager as a [TevmState](../../index/type-aliases/TevmState.md)

#### Source

packages/state/types/StateManager.d.ts:17

***

### dumpStorage()

> **dumpStorage**(`address`): `Promise`\<`StorageDump`\>

#### Parameters

▪ **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Inherited from

EvmStateManagerInterface.dumpStorage

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:77

***

### dumpStorageRange()

> **dumpStorageRange**(`address`, `startKey`, `limit`): `Promise`\<`StorageRange`\>

#### Parameters

▪ **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

▪ **startKey**: `bigint`

▪ **limit**: `number`

#### Inherited from

EvmStateManagerInterface.dumpStorageRange

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:78

***

### generateCanonicalGenesis()

> **generateCanonicalGenesis**(`initState`): `Promise`\<`void`\>

#### Parameters

▪ **initState**: `any`

#### Inherited from

EvmStateManagerInterface.generateCanonicalGenesis

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:79

***

### getAccount()

> **getAccount**(`address`): `Promise`\<`undefined` \| [`EthjsAccount`](../../utils/classes/EthjsAccount.md)\>

#### Parameters

▪ **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Inherited from

EvmStateManagerInterface.getAccount

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:53

***

### getAppliedKey()

> **`optional`** **getAppliedKey**(`address`): `Uint8Array`

#### Parameters

▪ **address**: `Uint8Array`

#### Inherited from

EvmStateManagerInterface.getAppliedKey

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:70

***

### getContractCode()

> **getContractCode**(`address`): `Promise`\<`Uint8Array`\>

#### Parameters

▪ **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Inherited from

EvmStateManagerInterface.getContractCode

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:58

***

### getContractStorage()

> **getContractStorage**(`address`, `key`): `Promise`\<`Uint8Array`\>

#### Parameters

▪ **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

▪ **key**: `Uint8Array`

#### Inherited from

EvmStateManagerInterface.getContractStorage

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:59

***

### getProof()

> **getProof**(`address`, `storageSlots`?): `Promise`\<`Proof`\>

#### Parameters

▪ **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

▪ **storageSlots?**: `Uint8Array`[]

#### Inherited from

EvmStateManagerInterface.getProof

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:80

***

### getStateRoot()

> **getStateRoot**(): `Promise`\<`Uint8Array`\>

#### Inherited from

EvmStateManagerInterface.getStateRoot

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:65

***

### hasStateRoot()

> **hasStateRoot**(`root`): `Promise`\<`boolean`\>

#### Parameters

▪ **root**: `Uint8Array`

#### Inherited from

EvmStateManagerInterface.hasStateRoot

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:68

***

### modifyAccountFields()

> **modifyAccountFields**(`address`, `accountFields`): `Promise`\<`void`\>

#### Parameters

▪ **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

▪ **accountFields**: `Partial`\<`Pick`\<[`EthjsAccount`](../../utils/classes/EthjsAccount.md), `"nonce"` \| `"balance"` \| `"storageRoot"` \| `"codeHash"`\>\>

#### Inherited from

EvmStateManagerInterface.modifyAccountFields

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:56

***

### putAccount()

> **putAccount**(`address`, `account`?): `Promise`\<`void`\>

#### Parameters

▪ **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

▪ **account?**: [`EthjsAccount`](../../utils/classes/EthjsAccount.md)

#### Inherited from

EvmStateManagerInterface.putAccount

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:54

***

### putContractCode()

> **putContractCode**(`address`, `value`): `Promise`\<`void`\>

#### Parameters

▪ **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

▪ **value**: `Uint8Array`

#### Inherited from

EvmStateManagerInterface.putContractCode

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:57

***

### putContractStorage()

> **putContractStorage**(`address`, `key`, `value`): `Promise`\<`void`\>

#### Parameters

▪ **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

▪ **key**: `Uint8Array`

▪ **value**: `Uint8Array`

#### Inherited from

EvmStateManagerInterface.putContractStorage

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:60

***

### revert()

> **revert**(): `Promise`\<`void`\>

#### Inherited from

EvmStateManagerInterface.revert

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:64

***

### setStateRoot()

> **setStateRoot**(`stateRoot`, `clearCache`?): `Promise`\<`void`\>

#### Parameters

▪ **stateRoot**: `Uint8Array`

▪ **clearCache?**: `boolean`

#### Inherited from

EvmStateManagerInterface.setStateRoot

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:66

***

### shallowCopy()

> **shallowCopy**(`downlevelCaches`?): `EVMStateManagerInterface`

#### Parameters

▪ **downlevelCaches?**: `boolean`

#### Inherited from

EvmStateManagerInterface.shallowCopy

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:81

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
