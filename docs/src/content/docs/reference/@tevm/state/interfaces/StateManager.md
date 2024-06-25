---
editUrl: false
next: false
prev: false
title: "StateManager"
---

## Extends

- [`EvmStateManagerInterface`](/reference/tevm/common/interfaces/evmstatemanagerinterface/)

## Properties

### \_baseState

> **\_baseState**: [`BaseState`](/reference/tevm/state/type-aliases/basestate/)

The internal state representation

#### Defined in

[packages/state/src/StateManager.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L10)

***

### getAccountAddresses()

> **getAccountAddresses**: () => \`0x$\{string\}\`[]

Returns contract addresses

#### Returns

\`0x$\{string\}\`[]

#### Defined in

[packages/state/src/StateManager.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L15)

***

### originalStorageCache

> **originalStorageCache**: `object`

#### clear()

##### Returns

`void`

#### get()

##### Parameters

• **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

• **key**: `Uint8Array`

##### Returns

`Promise`\<`Uint8Array`\>

#### Inherited from

[`EvmStateManagerInterface`](/reference/tevm/common/interfaces/evmstatemanagerinterface/).[`originalStorageCache`](/reference/tevm/common/interfaces/evmstatemanagerinterface/#originalstoragecache)

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:73

***

### ready()

> **ready**: () => `Promise`\<`true`\>

#### Returns

`Promise`\<`true`\>

#### Defined in

[packages/state/src/StateManager.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L11)

## Methods

### checkpoint()

> **checkpoint**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](/reference/tevm/common/interfaces/evmstatemanagerinterface/).[`checkpoint`](/reference/tevm/common/interfaces/evmstatemanagerinterface/#checkpoint)

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:62

***

### clearCaches()

> **clearCaches**(): `void`

Resets all internal caches

#### Returns

`void`

#### Defined in

[packages/state/src/StateManager.ts:27](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L27)

***

### clearContractStorage()

> **clearContractStorage**(`address`): `Promise`\<`void`\>

#### Parameters

• **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](/reference/tevm/common/interfaces/evmstatemanagerinterface/).[`clearContractStorage`](/reference/tevm/common/interfaces/evmstatemanagerinterface/#clearcontractstorage)

#### Defined in

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

:::caution[Experimental]
This API should not be used in production and may be trimmed from a public release.
:::

#### Returns

`Promise`\<`void`\>

#### Overrides

[`EvmStateManagerInterface`](/reference/tevm/common/interfaces/evmstatemanagerinterface/).[`commit`](/reference/tevm/common/interfaces/evmstatemanagerinterface/#commit)

#### Defined in

[packages/state/src/StateManager.ts:37](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L37)

***

### deepCopy()

> **deepCopy**(): `Promise`\<[`StateManager`](/reference/tevm/state/interfaces/statemanager/)\>

Returns a new instance of the ForkStateManager with the same opts and all storage copied over

#### Returns

`Promise`\<[`StateManager`](/reference/tevm/state/interfaces/statemanager/)\>

#### Defined in

[packages/state/src/StateManager.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L19)

***

### deleteAccount()

> **deleteAccount**(`address`): `Promise`\<`void`\>

#### Parameters

• **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](/reference/tevm/common/interfaces/evmstatemanagerinterface/).[`deleteAccount`](/reference/tevm/common/interfaces/evmstatemanagerinterface/#deleteaccount)

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:55

***

### dumpCanonicalGenesis()

> **dumpCanonicalGenesis**(): `Promise`\<[`TevmState`](/reference/tevm/state/type-aliases/tevmstate/)\>

Dumps the state of the state manager as a [TevmState](../../../../../../../reference/tevm/state/type-aliases/tevmstate)

#### Returns

`Promise`\<[`TevmState`](/reference/tevm/state/type-aliases/tevmstate/)\>

#### Defined in

[packages/state/src/StateManager.ts:23](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L23)

***

### dumpStorage()

> **dumpStorage**(`address`): `Promise`\<[`StorageDump`](/reference/tevm/common/interfaces/storagedump/)\>

#### Parameters

• **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Returns

`Promise`\<[`StorageDump`](/reference/tevm/common/interfaces/storagedump/)\>

#### Inherited from

[`EvmStateManagerInterface`](/reference/tevm/common/interfaces/evmstatemanagerinterface/).[`dumpStorage`](/reference/tevm/common/interfaces/evmstatemanagerinterface/#dumpstorage)

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:77

***

### dumpStorageRange()

> **dumpStorageRange**(`address`, `startKey`, `limit`): `Promise`\<[`StorageRange`](/reference/tevm/common/interfaces/storagerange/)\>

#### Parameters

• **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

• **startKey**: `bigint`

• **limit**: `number`

#### Returns

`Promise`\<[`StorageRange`](/reference/tevm/common/interfaces/storagerange/)\>

#### Inherited from

[`EvmStateManagerInterface`](/reference/tevm/common/interfaces/evmstatemanagerinterface/).[`dumpStorageRange`](/reference/tevm/common/interfaces/evmstatemanagerinterface/#dumpstoragerange)

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:78

***

### generateCanonicalGenesis()

> **generateCanonicalGenesis**(`initState`): `Promise`\<`void`\>

#### Parameters

• **initState**: `any`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](/reference/tevm/common/interfaces/evmstatemanagerinterface/).[`generateCanonicalGenesis`](/reference/tevm/common/interfaces/evmstatemanagerinterface/#generatecanonicalgenesis)

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:79

***

### getAccount()

> **getAccount**(`address`): `Promise`\<`undefined` \| [`EthjsAccount`](/reference/tevm/utils/classes/ethjsaccount/)\>

#### Parameters

• **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Returns

`Promise`\<`undefined` \| [`EthjsAccount`](/reference/tevm/utils/classes/ethjsaccount/)\>

#### Inherited from

[`EvmStateManagerInterface`](/reference/tevm/common/interfaces/evmstatemanagerinterface/).[`getAccount`](/reference/tevm/common/interfaces/evmstatemanagerinterface/#getaccount)

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:53

***

### getAppliedKey()?

> `optional` **getAppliedKey**(`address`): `Uint8Array`

#### Parameters

• **address**: `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

[`EvmStateManagerInterface`](/reference/tevm/common/interfaces/evmstatemanagerinterface/).[`getAppliedKey`](/reference/tevm/common/interfaces/evmstatemanagerinterface/#getappliedkey)

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:70

***

### getContractCode()

> **getContractCode**(`address`): `Promise`\<`Uint8Array`\>

#### Parameters

• **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Returns

`Promise`\<`Uint8Array`\>

#### Inherited from

[`EvmStateManagerInterface`](/reference/tevm/common/interfaces/evmstatemanagerinterface/).[`getContractCode`](/reference/tevm/common/interfaces/evmstatemanagerinterface/#getcontractcode)

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:58

***

### getContractStorage()

> **getContractStorage**(`address`, `key`): `Promise`\<`Uint8Array`\>

#### Parameters

• **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

• **key**: `Uint8Array`

#### Returns

`Promise`\<`Uint8Array`\>

#### Inherited from

[`EvmStateManagerInterface`](/reference/tevm/common/interfaces/evmstatemanagerinterface/).[`getContractStorage`](/reference/tevm/common/interfaces/evmstatemanagerinterface/#getcontractstorage)

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:59

***

### getProof()

> **getProof**(`address`, `storageSlots`?): `Promise`\<`Proof`\>

#### Parameters

• **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

• **storageSlots?**: `Uint8Array`[]

#### Returns

`Promise`\<`Proof`\>

#### Inherited from

[`EvmStateManagerInterface`](/reference/tevm/common/interfaces/evmstatemanagerinterface/).[`getProof`](/reference/tevm/common/interfaces/evmstatemanagerinterface/#getproof)

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:80

***

### getStateRoot()

> **getStateRoot**(): `Promise`\<`Uint8Array`\>

#### Returns

`Promise`\<`Uint8Array`\>

#### Inherited from

[`EvmStateManagerInterface`](/reference/tevm/common/interfaces/evmstatemanagerinterface/).[`getStateRoot`](/reference/tevm/common/interfaces/evmstatemanagerinterface/#getstateroot)

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:65

***

### hasStateRoot()

> **hasStateRoot**(`root`): `Promise`\<`boolean`\>

#### Parameters

• **root**: `Uint8Array`

#### Returns

`Promise`\<`boolean`\>

#### Inherited from

[`EvmStateManagerInterface`](/reference/tevm/common/interfaces/evmstatemanagerinterface/).[`hasStateRoot`](/reference/tevm/common/interfaces/evmstatemanagerinterface/#hasstateroot)

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:68

***

### modifyAccountFields()

> **modifyAccountFields**(`address`, `accountFields`): `Promise`\<`void`\>

#### Parameters

• **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

• **accountFields**: `Partial`\<`Pick`\<[`EthjsAccount`](/reference/tevm/utils/classes/ethjsaccount/), `"nonce"` \| `"balance"` \| `"storageRoot"` \| `"codeHash"`\>\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](/reference/tevm/common/interfaces/evmstatemanagerinterface/).[`modifyAccountFields`](/reference/tevm/common/interfaces/evmstatemanagerinterface/#modifyaccountfields)

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:56

***

### putAccount()

> **putAccount**(`address`, `account`?): `Promise`\<`void`\>

#### Parameters

• **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

• **account?**: [`EthjsAccount`](/reference/tevm/utils/classes/ethjsaccount/)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](/reference/tevm/common/interfaces/evmstatemanagerinterface/).[`putAccount`](/reference/tevm/common/interfaces/evmstatemanagerinterface/#putaccount)

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:54

***

### putContractCode()

> **putContractCode**(`address`, `value`): `Promise`\<`void`\>

#### Parameters

• **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

• **value**: `Uint8Array`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](/reference/tevm/common/interfaces/evmstatemanagerinterface/).[`putContractCode`](/reference/tevm/common/interfaces/evmstatemanagerinterface/#putcontractcode)

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:57

***

### putContractStorage()

> **putContractStorage**(`address`, `key`, `value`): `Promise`\<`void`\>

#### Parameters

• **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

• **key**: `Uint8Array`

• **value**: `Uint8Array`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](/reference/tevm/common/interfaces/evmstatemanagerinterface/).[`putContractStorage`](/reference/tevm/common/interfaces/evmstatemanagerinterface/#putcontractstorage)

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:60

***

### revert()

> **revert**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](/reference/tevm/common/interfaces/evmstatemanagerinterface/).[`revert`](/reference/tevm/common/interfaces/evmstatemanagerinterface/#revert)

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:64

***

### saveStateRoot()

> **saveStateRoot**(`root`, `state`): `void`

Saves a state root to the state root mapping
THis API is considered unstable

:::caution[Experimental]
This API should not be used in production and may be trimmed from a public release.
:::

#### Parameters

• **root**: `Uint8Array`

• **state**: [`TevmState`](/reference/tevm/state/type-aliases/tevmstate/)

#### Returns

`void`

#### Defined in

[packages/state/src/StateManager.ts:33](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L33)

***

### setStateRoot()

> **setStateRoot**(`stateRoot`, `clearCache`?): `Promise`\<`void`\>

#### Parameters

• **stateRoot**: `Uint8Array`

• **clearCache?**: `boolean`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](/reference/tevm/common/interfaces/evmstatemanagerinterface/).[`setStateRoot`](/reference/tevm/common/interfaces/evmstatemanagerinterface/#setstateroot)

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:66

***

### shallowCopy()

> **shallowCopy**(`downlevelCaches`?): [`EvmStateManagerInterface`](/reference/tevm/common/interfaces/evmstatemanagerinterface/)

#### Parameters

• **downlevelCaches?**: `boolean`

#### Returns

[`EvmStateManagerInterface`](/reference/tevm/common/interfaces/evmstatemanagerinterface/)

#### Inherited from

[`EvmStateManagerInterface`](/reference/tevm/common/interfaces/evmstatemanagerinterface/).[`shallowCopy`](/reference/tevm/common/interfaces/evmstatemanagerinterface/#shallowcopy)

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:81
