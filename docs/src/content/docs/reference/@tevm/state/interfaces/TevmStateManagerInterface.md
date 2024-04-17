---
editUrl: false
next: false
prev: false
title: "TevmStateManagerInterface"
---

## Extends

- [`EvmStateManagerInterface`](/reference/common/interfaces/evmstatemanagerinterface/)

## Properties

### getAccountAddresses()

> **getAccountAddresses**: () => ```0x${string}```[]

#### Returns

```0x${string}```[]

#### Source

[packages/state/src/TevmStateManagerInterface.ts:5](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/TevmStateManagerInterface.ts#L5)

***

### originalStorageCache

> **originalStorageCache**: `object`

#### clear()

##### Returns

`void`

#### get()

##### Parameters

• **address**: [`EthjsAddress`](/reference/utils/classes/ethjsaddress/)

• **key**: `Uint8Array`

##### Returns

`Promise`\<`Uint8Array`\>

#### Inherited from

[`EvmStateManagerInterface`](/reference/common/interfaces/evmstatemanagerinterface/).[`originalStorageCache`](/reference/common/interfaces/evmstatemanagerinterface/#originalstoragecache)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:73

## Methods

### checkpoint()

> **checkpoint**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](/reference/common/interfaces/evmstatemanagerinterface/).[`checkpoint`](/reference/common/interfaces/evmstatemanagerinterface/#checkpoint)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:62

***

### clearContractStorage()

> **clearContractStorage**(`address`): `Promise`\<`void`\>

#### Parameters

• **address**: [`EthjsAddress`](/reference/utils/classes/ethjsaddress/)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](/reference/common/interfaces/evmstatemanagerinterface/).[`clearContractStorage`](/reference/common/interfaces/evmstatemanagerinterface/#clearcontractstorage)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:61

***

### commit()

> **commit**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](/reference/common/interfaces/evmstatemanagerinterface/).[`commit`](/reference/common/interfaces/evmstatemanagerinterface/#commit)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:63

***

### deleteAccount()

> **deleteAccount**(`address`): `Promise`\<`void`\>

#### Parameters

• **address**: [`EthjsAddress`](/reference/utils/classes/ethjsaddress/)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](/reference/common/interfaces/evmstatemanagerinterface/).[`deleteAccount`](/reference/common/interfaces/evmstatemanagerinterface/#deleteaccount)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:55

***

### dumpStorage()

> **dumpStorage**(`address`): `Promise`\<[`StorageDump`](/reference/common/interfaces/storagedump/)\>

#### Parameters

• **address**: [`EthjsAddress`](/reference/utils/classes/ethjsaddress/)

#### Returns

`Promise`\<[`StorageDump`](/reference/common/interfaces/storagedump/)\>

#### Inherited from

[`EvmStateManagerInterface`](/reference/common/interfaces/evmstatemanagerinterface/).[`dumpStorage`](/reference/common/interfaces/evmstatemanagerinterface/#dumpstorage)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:77

***

### dumpStorageRange()

> **dumpStorageRange**(`address`, `startKey`, `limit`): `Promise`\<[`StorageRange`](/reference/common/interfaces/storagerange/)\>

#### Parameters

• **address**: [`EthjsAddress`](/reference/utils/classes/ethjsaddress/)

• **startKey**: `bigint`

• **limit**: `number`

#### Returns

`Promise`\<[`StorageRange`](/reference/common/interfaces/storagerange/)\>

#### Inherited from

[`EvmStateManagerInterface`](/reference/common/interfaces/evmstatemanagerinterface/).[`dumpStorageRange`](/reference/common/interfaces/evmstatemanagerinterface/#dumpstoragerange)

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

[`EvmStateManagerInterface`](/reference/common/interfaces/evmstatemanagerinterface/).[`generateCanonicalGenesis`](/reference/common/interfaces/evmstatemanagerinterface/#generatecanonicalgenesis)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:79

***

### getAccount()

> **getAccount**(`address`): `Promise`\<`undefined` \| [`EthjsAccount`](/reference/utils/classes/ethjsaccount/)\>

#### Parameters

• **address**: [`EthjsAddress`](/reference/utils/classes/ethjsaddress/)

#### Returns

`Promise`\<`undefined` \| [`EthjsAccount`](/reference/utils/classes/ethjsaccount/)\>

#### Inherited from

[`EvmStateManagerInterface`](/reference/common/interfaces/evmstatemanagerinterface/).[`getAccount`](/reference/common/interfaces/evmstatemanagerinterface/#getaccount)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:53

***

### getAppliedKey()?

> **`optional`** **getAppliedKey**(`address`): `Uint8Array`

#### Parameters

• **address**: `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

[`EvmStateManagerInterface`](/reference/common/interfaces/evmstatemanagerinterface/).[`getAppliedKey`](/reference/common/interfaces/evmstatemanagerinterface/#getappliedkey)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:70

***

### getContractCode()

> **getContractCode**(`address`): `Promise`\<`Uint8Array`\>

#### Parameters

• **address**: [`EthjsAddress`](/reference/utils/classes/ethjsaddress/)

#### Returns

`Promise`\<`Uint8Array`\>

#### Inherited from

[`EvmStateManagerInterface`](/reference/common/interfaces/evmstatemanagerinterface/).[`getContractCode`](/reference/common/interfaces/evmstatemanagerinterface/#getcontractcode)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:58

***

### getContractStorage()

> **getContractStorage**(`address`, `key`): `Promise`\<`Uint8Array`\>

#### Parameters

• **address**: [`EthjsAddress`](/reference/utils/classes/ethjsaddress/)

• **key**: `Uint8Array`

#### Returns

`Promise`\<`Uint8Array`\>

#### Inherited from

[`EvmStateManagerInterface`](/reference/common/interfaces/evmstatemanagerinterface/).[`getContractStorage`](/reference/common/interfaces/evmstatemanagerinterface/#getcontractstorage)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:59

***

### getProof()

> **getProof**(`address`, `storageSlots`?): `Promise`\<`Proof`\>

#### Parameters

• **address**: [`EthjsAddress`](/reference/utils/classes/ethjsaddress/)

• **storageSlots?**: `Uint8Array`[]

#### Returns

`Promise`\<`Proof`\>

#### Inherited from

[`EvmStateManagerInterface`](/reference/common/interfaces/evmstatemanagerinterface/).[`getProof`](/reference/common/interfaces/evmstatemanagerinterface/#getproof)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:80

***

### getStateRoot()

> **getStateRoot**(): `Promise`\<`Uint8Array`\>

#### Returns

`Promise`\<`Uint8Array`\>

#### Inherited from

[`EvmStateManagerInterface`](/reference/common/interfaces/evmstatemanagerinterface/).[`getStateRoot`](/reference/common/interfaces/evmstatemanagerinterface/#getstateroot)

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

[`EvmStateManagerInterface`](/reference/common/interfaces/evmstatemanagerinterface/).[`hasStateRoot`](/reference/common/interfaces/evmstatemanagerinterface/#hasstateroot)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:68

***

### modifyAccountFields()

> **modifyAccountFields**(`address`, `accountFields`): `Promise`\<`void`\>

#### Parameters

• **address**: [`EthjsAddress`](/reference/utils/classes/ethjsaddress/)

• **accountFields**: `Partial`\<`Pick`\<[`EthjsAccount`](/reference/utils/classes/ethjsaccount/), `"nonce"` \| `"balance"` \| `"storageRoot"` \| `"codeHash"`\>\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](/reference/common/interfaces/evmstatemanagerinterface/).[`modifyAccountFields`](/reference/common/interfaces/evmstatemanagerinterface/#modifyaccountfields)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:56

***

### putAccount()

> **putAccount**(`address`, `account`?): `Promise`\<`void`\>

#### Parameters

• **address**: [`EthjsAddress`](/reference/utils/classes/ethjsaddress/)

• **account?**: [`EthjsAccount`](/reference/utils/classes/ethjsaccount/)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](/reference/common/interfaces/evmstatemanagerinterface/).[`putAccount`](/reference/common/interfaces/evmstatemanagerinterface/#putaccount)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:54

***

### putContractCode()

> **putContractCode**(`address`, `value`): `Promise`\<`void`\>

#### Parameters

• **address**: [`EthjsAddress`](/reference/utils/classes/ethjsaddress/)

• **value**: `Uint8Array`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](/reference/common/interfaces/evmstatemanagerinterface/).[`putContractCode`](/reference/common/interfaces/evmstatemanagerinterface/#putcontractcode)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:57

***

### putContractStorage()

> **putContractStorage**(`address`, `key`, `value`): `Promise`\<`void`\>

#### Parameters

• **address**: [`EthjsAddress`](/reference/utils/classes/ethjsaddress/)

• **key**: `Uint8Array`

• **value**: `Uint8Array`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](/reference/common/interfaces/evmstatemanagerinterface/).[`putContractStorage`](/reference/common/interfaces/evmstatemanagerinterface/#putcontractstorage)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:60

***

### revert()

> **revert**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](/reference/common/interfaces/evmstatemanagerinterface/).[`revert`](/reference/common/interfaces/evmstatemanagerinterface/#revert)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:64

***

### setStateRoot()

> **setStateRoot**(`stateRoot`, `clearCache`?): `Promise`\<`void`\>

#### Parameters

• **stateRoot**: `Uint8Array`

• **clearCache?**: `boolean`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](/reference/common/interfaces/evmstatemanagerinterface/).[`setStateRoot`](/reference/common/interfaces/evmstatemanagerinterface/#setstateroot)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:66

***

### shallowCopy()

> **shallowCopy**(`downlevelCaches`?): [`EvmStateManagerInterface`](/reference/common/interfaces/evmstatemanagerinterface/)

#### Parameters

• **downlevelCaches?**: `boolean`

#### Returns

[`EvmStateManagerInterface`](/reference/common/interfaces/evmstatemanagerinterface/)

#### Inherited from

[`EvmStateManagerInterface`](/reference/common/interfaces/evmstatemanagerinterface/).[`shallowCopy`](/reference/common/interfaces/evmstatemanagerinterface/#shallowcopy)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:81
