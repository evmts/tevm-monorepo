---
editUrl: false
next: false
prev: false
title: "TevmStateManagerInterface"
---

## Extends

- [`EvmStateManagerInterface`](/reference/tevm/common/interfaces/evmstatemanagerinterface/)

## Properties

### getAccountAddresses

> **getAccountAddresses**: () => \`0x${string}\`[]

#### Source

[packages/state/src/TevmStateManagerInterface.ts:5](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/TevmStateManagerInterface.ts#L5)

***

### originalStorageCache

> **originalStorageCache**: `object`

#### Type declaration

##### clear()

##### get()

###### Parameters

▪ **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

▪ **key**: `Uint8Array`

#### Inherited from

[`EvmStateManagerInterface`](/reference/tevm/common/interfaces/evmstatemanagerinterface/).[`originalStorageCache`](/reference/tevm/common/interfaces/evmstatemanagerinterface/#originalstoragecache)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:73

## Methods

### checkpoint()

> **checkpoint**(): `Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](/reference/tevm/common/interfaces/evmstatemanagerinterface/).[`checkpoint`](/reference/tevm/common/interfaces/evmstatemanagerinterface/#checkpoint)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:62

***

### clearContractStorage()

> **clearContractStorage**(`address`): `Promise`\<`void`\>

#### Parameters

▪ **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Inherited from

[`EvmStateManagerInterface`](/reference/tevm/common/interfaces/evmstatemanagerinterface/).[`clearContractStorage`](/reference/tevm/common/interfaces/evmstatemanagerinterface/#clearcontractstorage)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:61

***

### commit()

> **commit**(): `Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](/reference/tevm/common/interfaces/evmstatemanagerinterface/).[`commit`](/reference/tevm/common/interfaces/evmstatemanagerinterface/#commit)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:63

***

### deleteAccount()

> **deleteAccount**(`address`): `Promise`\<`void`\>

#### Parameters

▪ **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Inherited from

[`EvmStateManagerInterface`](/reference/tevm/common/interfaces/evmstatemanagerinterface/).[`deleteAccount`](/reference/tevm/common/interfaces/evmstatemanagerinterface/#deleteaccount)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:55

***

### dumpStorage()

> **dumpStorage**(`address`): `Promise`\<[`StorageDump`](/reference/tevm/common/interfaces/storagedump/)\>

#### Parameters

▪ **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Inherited from

[`EvmStateManagerInterface`](/reference/tevm/common/interfaces/evmstatemanagerinterface/).[`dumpStorage`](/reference/tevm/common/interfaces/evmstatemanagerinterface/#dumpstorage)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:77

***

### dumpStorageRange()

> **dumpStorageRange**(`address`, `startKey`, `limit`): `Promise`\<[`StorageRange`](/reference/tevm/common/interfaces/storagerange/)\>

#### Parameters

▪ **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

▪ **startKey**: `bigint`

▪ **limit**: `number`

#### Inherited from

[`EvmStateManagerInterface`](/reference/tevm/common/interfaces/evmstatemanagerinterface/).[`dumpStorageRange`](/reference/tevm/common/interfaces/evmstatemanagerinterface/#dumpstoragerange)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:78

***

### generateCanonicalGenesis()

> **generateCanonicalGenesis**(`initState`): `Promise`\<`void`\>

#### Parameters

▪ **initState**: `any`

#### Inherited from

[`EvmStateManagerInterface`](/reference/tevm/common/interfaces/evmstatemanagerinterface/).[`generateCanonicalGenesis`](/reference/tevm/common/interfaces/evmstatemanagerinterface/#generatecanonicalgenesis)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:79

***

### getAccount()

> **getAccount**(`address`): `Promise`\<`undefined` \| [`EthjsAccount`](/reference/tevm/utils/classes/ethjsaccount/)\>

#### Parameters

▪ **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Inherited from

[`EvmStateManagerInterface`](/reference/tevm/common/interfaces/evmstatemanagerinterface/).[`getAccount`](/reference/tevm/common/interfaces/evmstatemanagerinterface/#getaccount)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:53

***

### getAppliedKey()

> **`optional`** **getAppliedKey**(`address`): `Uint8Array`

#### Parameters

▪ **address**: `Uint8Array`

#### Inherited from

[`EvmStateManagerInterface`](/reference/tevm/common/interfaces/evmstatemanagerinterface/).[`getAppliedKey`](/reference/tevm/common/interfaces/evmstatemanagerinterface/#getappliedkey)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:70

***

### getContractCode()

> **getContractCode**(`address`): `Promise`\<`Uint8Array`\>

#### Parameters

▪ **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Inherited from

[`EvmStateManagerInterface`](/reference/tevm/common/interfaces/evmstatemanagerinterface/).[`getContractCode`](/reference/tevm/common/interfaces/evmstatemanagerinterface/#getcontractcode)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:58

***

### getContractStorage()

> **getContractStorage**(`address`, `key`): `Promise`\<`Uint8Array`\>

#### Parameters

▪ **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

▪ **key**: `Uint8Array`

#### Inherited from

[`EvmStateManagerInterface`](/reference/tevm/common/interfaces/evmstatemanagerinterface/).[`getContractStorage`](/reference/tevm/common/interfaces/evmstatemanagerinterface/#getcontractstorage)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:59

***

### getProof()

> **getProof**(`address`, `storageSlots`?): `Promise`\<`Proof`\>

#### Parameters

▪ **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

▪ **storageSlots?**: `Uint8Array`[]

#### Inherited from

[`EvmStateManagerInterface`](/reference/tevm/common/interfaces/evmstatemanagerinterface/).[`getProof`](/reference/tevm/common/interfaces/evmstatemanagerinterface/#getproof)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:80

***

### getStateRoot()

> **getStateRoot**(): `Promise`\<`Uint8Array`\>

#### Inherited from

[`EvmStateManagerInterface`](/reference/tevm/common/interfaces/evmstatemanagerinterface/).[`getStateRoot`](/reference/tevm/common/interfaces/evmstatemanagerinterface/#getstateroot)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:65

***

### hasStateRoot()

> **hasStateRoot**(`root`): `Promise`\<`boolean`\>

#### Parameters

▪ **root**: `Uint8Array`

#### Inherited from

[`EvmStateManagerInterface`](/reference/tevm/common/interfaces/evmstatemanagerinterface/).[`hasStateRoot`](/reference/tevm/common/interfaces/evmstatemanagerinterface/#hasstateroot)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:68

***

### modifyAccountFields()

> **modifyAccountFields**(`address`, `accountFields`): `Promise`\<`void`\>

#### Parameters

▪ **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

▪ **accountFields**: `Partial`\<`Pick`\<[`EthjsAccount`](/reference/tevm/utils/classes/ethjsaccount/), `"nonce"` \| `"balance"` \| `"storageRoot"` \| `"codeHash"`\>\>

#### Inherited from

[`EvmStateManagerInterface`](/reference/tevm/common/interfaces/evmstatemanagerinterface/).[`modifyAccountFields`](/reference/tevm/common/interfaces/evmstatemanagerinterface/#modifyaccountfields)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:56

***

### putAccount()

> **putAccount**(`address`, `account`?): `Promise`\<`void`\>

#### Parameters

▪ **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

▪ **account?**: [`EthjsAccount`](/reference/tevm/utils/classes/ethjsaccount/)

#### Inherited from

[`EvmStateManagerInterface`](/reference/tevm/common/interfaces/evmstatemanagerinterface/).[`putAccount`](/reference/tevm/common/interfaces/evmstatemanagerinterface/#putaccount)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:54

***

### putContractCode()

> **putContractCode**(`address`, `value`): `Promise`\<`void`\>

#### Parameters

▪ **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

▪ **value**: `Uint8Array`

#### Inherited from

[`EvmStateManagerInterface`](/reference/tevm/common/interfaces/evmstatemanagerinterface/).[`putContractCode`](/reference/tevm/common/interfaces/evmstatemanagerinterface/#putcontractcode)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:57

***

### putContractStorage()

> **putContractStorage**(`address`, `key`, `value`): `Promise`\<`void`\>

#### Parameters

▪ **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

▪ **key**: `Uint8Array`

▪ **value**: `Uint8Array`

#### Inherited from

[`EvmStateManagerInterface`](/reference/tevm/common/interfaces/evmstatemanagerinterface/).[`putContractStorage`](/reference/tevm/common/interfaces/evmstatemanagerinterface/#putcontractstorage)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:60

***

### revert()

> **revert**(): `Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](/reference/tevm/common/interfaces/evmstatemanagerinterface/).[`revert`](/reference/tevm/common/interfaces/evmstatemanagerinterface/#revert)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:64

***

### setStateRoot()

> **setStateRoot**(`stateRoot`, `clearCache`?): `Promise`\<`void`\>

#### Parameters

▪ **stateRoot**: `Uint8Array`

▪ **clearCache?**: `boolean`

#### Inherited from

[`EvmStateManagerInterface`](/reference/tevm/common/interfaces/evmstatemanagerinterface/).[`setStateRoot`](/reference/tevm/common/interfaces/evmstatemanagerinterface/#setstateroot)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:66

***

### shallowCopy()

> **shallowCopy**(`downlevelCaches`?): [`EvmStateManagerInterface`](/reference/tevm/common/interfaces/evmstatemanagerinterface/)

#### Parameters

▪ **downlevelCaches?**: `boolean`

#### Inherited from

[`EvmStateManagerInterface`](/reference/tevm/common/interfaces/evmstatemanagerinterface/).[`shallowCopy`](/reference/tevm/common/interfaces/evmstatemanagerinterface/#shallowcopy)

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:81

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
