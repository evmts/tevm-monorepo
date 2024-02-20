---
editUrl: false
next: false
prev: false
title: "TevmStateManagerInterface"
---

## Extends

- `EVMStateManagerInterface`

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

EVMStateManagerInterface.originalStorageCache

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.1.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:72

## Methods

### checkpoint()

> **checkpoint**(): `Promise`\<`void`\>

#### Inherited from

EVMStateManagerInterface.checkpoint

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.1.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:62

***

### clearContractStorage()

> **clearContractStorage**(`address`): `Promise`\<`void`\>

#### Parameters

▪ **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Inherited from

EVMStateManagerInterface.clearContractStorage

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.1.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:61

***

### commit()

> **commit**(): `Promise`\<`void`\>

#### Inherited from

EVMStateManagerInterface.commit

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.1.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:63

***

### deleteAccount()

> **deleteAccount**(`address`): `Promise`\<`void`\>

#### Parameters

▪ **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Inherited from

EVMStateManagerInterface.deleteAccount

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.1.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:55

***

### dumpStorage()

> **dumpStorage**(`address`): `Promise`\<`StorageDump`\>

#### Parameters

▪ **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Inherited from

EVMStateManagerInterface.dumpStorage

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.1.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:76

***

### dumpStorageRange()

> **dumpStorageRange**(`address`, `startKey`, `limit`): `Promise`\<`StorageRange`\>

#### Parameters

▪ **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

▪ **startKey**: `bigint`

▪ **limit**: `number`

#### Inherited from

EVMStateManagerInterface.dumpStorageRange

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.1.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:77

***

### generateCanonicalGenesis()

> **generateCanonicalGenesis**(`initState`): `Promise`\<`void`\>

#### Parameters

▪ **initState**: `any`

#### Inherited from

EVMStateManagerInterface.generateCanonicalGenesis

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.1.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:78

***

### getAccount()

> **getAccount**(`address`): `Promise`\<`undefined` \| [`EthjsAccount`](/reference/tevm/utils/classes/ethjsaccount/)\>

#### Parameters

▪ **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Inherited from

EVMStateManagerInterface.getAccount

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.1.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:53

***

### getContractCode()

> **getContractCode**(`address`): `Promise`\<`Uint8Array`\>

#### Parameters

▪ **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Inherited from

EVMStateManagerInterface.getContractCode

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.1.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:58

***

### getContractStorage()

> **getContractStorage**(`address`, `key`): `Promise`\<`Uint8Array`\>

#### Parameters

▪ **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

▪ **key**: `Uint8Array`

#### Inherited from

EVMStateManagerInterface.getContractStorage

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.1.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:59

***

### getProof()

> **getProof**(`address`, `storageSlots`?): `Promise`\<`Proof`\>

#### Parameters

▪ **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

▪ **storageSlots?**: `Uint8Array`[]

#### Inherited from

EVMStateManagerInterface.getProof

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.1.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:79

***

### getStateRoot()

> **getStateRoot**(): `Promise`\<`Uint8Array`\>

#### Inherited from

EVMStateManagerInterface.getStateRoot

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.1.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:65

***

### hasStateRoot()

> **hasStateRoot**(`root`): `Promise`\<`boolean`\>

#### Parameters

▪ **root**: `Uint8Array`

#### Inherited from

EVMStateManagerInterface.hasStateRoot

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.1.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:68

***

### modifyAccountFields()

> **modifyAccountFields**(`address`, `accountFields`): `Promise`\<`void`\>

#### Parameters

▪ **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

▪ **accountFields**: `Partial`\<`Pick`\<[`EthjsAccount`](/reference/tevm/utils/classes/ethjsaccount/), `"nonce"` \| `"balance"` \| `"storageRoot"` \| `"codeHash"`\>\>

#### Inherited from

EVMStateManagerInterface.modifyAccountFields

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.1.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:56

***

### putAccount()

> **putAccount**(`address`, `account`?): `Promise`\<`void`\>

#### Parameters

▪ **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

▪ **account?**: [`EthjsAccount`](/reference/tevm/utils/classes/ethjsaccount/)

#### Inherited from

EVMStateManagerInterface.putAccount

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.1.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:54

***

### putContractCode()

> **putContractCode**(`address`, `value`): `Promise`\<`void`\>

#### Parameters

▪ **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

▪ **value**: `Uint8Array`

#### Inherited from

EVMStateManagerInterface.putContractCode

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.1.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:57

***

### putContractStorage()

> **putContractStorage**(`address`, `key`, `value`): `Promise`\<`void`\>

#### Parameters

▪ **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

▪ **key**: `Uint8Array`

▪ **value**: `Uint8Array`

#### Inherited from

EVMStateManagerInterface.putContractStorage

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.1.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:60

***

### revert()

> **revert**(): `Promise`\<`void`\>

#### Inherited from

EVMStateManagerInterface.revert

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.1.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:64

***

### setStateRoot()

> **setStateRoot**(`stateRoot`, `clearCache`?): `Promise`\<`void`\>

#### Parameters

▪ **stateRoot**: `Uint8Array`

▪ **clearCache?**: `boolean`

#### Inherited from

EVMStateManagerInterface.setStateRoot

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.1.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:66

***

### shallowCopy()

> **shallowCopy**(`downlevelCaches`?): `EVMStateManagerInterface`

#### Parameters

▪ **downlevelCaches?**: `boolean`

#### Inherited from

EVMStateManagerInterface.shallowCopy

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.1.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:80

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
