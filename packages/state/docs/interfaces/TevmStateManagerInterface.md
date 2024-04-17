**@tevm/state** • [Readme](../README.md) \| [API](../globals.md)

***

[@tevm/state](../README.md) / TevmStateManagerInterface

# Interface: TevmStateManagerInterface

## Extends

- `EVMStateManagerInterface`

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

• **address**: `Address`

• **key**: `Uint8Array`

##### Returns

`Promise`\<`Uint8Array`\>

#### Inherited from

`EvmStateManagerInterface.originalStorageCache`

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:73

## Methods

### checkpoint()

> **checkpoint**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EvmStateManagerInterface.checkpoint`

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:62

***

### clearContractStorage()

> **clearContractStorage**(`address`): `Promise`\<`void`\>

#### Parameters

• **address**: `Address`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EvmStateManagerInterface.clearContractStorage`

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:61

***

### commit()

> **commit**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EvmStateManagerInterface.commit`

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:63

***

### deleteAccount()

> **deleteAccount**(`address`): `Promise`\<`void`\>

#### Parameters

• **address**: `Address`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EvmStateManagerInterface.deleteAccount`

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:55

***

### dumpStorage()

> **dumpStorage**(`address`): `Promise`\<`StorageDump`\>

#### Parameters

• **address**: `Address`

#### Returns

`Promise`\<`StorageDump`\>

#### Inherited from

`EvmStateManagerInterface.dumpStorage`

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:77

***

### dumpStorageRange()

> **dumpStorageRange**(`address`, `startKey`, `limit`): `Promise`\<`StorageRange`\>

#### Parameters

• **address**: `Address`

• **startKey**: `bigint`

• **limit**: `number`

#### Returns

`Promise`\<`StorageRange`\>

#### Inherited from

`EvmStateManagerInterface.dumpStorageRange`

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

`EvmStateManagerInterface.generateCanonicalGenesis`

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:79

***

### getAccount()

> **getAccount**(`address`): `Promise`\<`undefined` \| `Account`\>

#### Parameters

• **address**: `Address`

#### Returns

`Promise`\<`undefined` \| `Account`\>

#### Inherited from

`EvmStateManagerInterface.getAccount`

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

`EvmStateManagerInterface.getAppliedKey`

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:70

***

### getContractCode()

> **getContractCode**(`address`): `Promise`\<`Uint8Array`\>

#### Parameters

• **address**: `Address`

#### Returns

`Promise`\<`Uint8Array`\>

#### Inherited from

`EvmStateManagerInterface.getContractCode`

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:58

***

### getContractStorage()

> **getContractStorage**(`address`, `key`): `Promise`\<`Uint8Array`\>

#### Parameters

• **address**: `Address`

• **key**: `Uint8Array`

#### Returns

`Promise`\<`Uint8Array`\>

#### Inherited from

`EvmStateManagerInterface.getContractStorage`

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:59

***

### getProof()

> **getProof**(`address`, `storageSlots`?): `Promise`\<`Proof`\>

#### Parameters

• **address**: `Address`

• **storageSlots?**: `Uint8Array`[]

#### Returns

`Promise`\<`Proof`\>

#### Inherited from

`EvmStateManagerInterface.getProof`

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:80

***

### getStateRoot()

> **getStateRoot**(): `Promise`\<`Uint8Array`\>

#### Returns

`Promise`\<`Uint8Array`\>

#### Inherited from

`EvmStateManagerInterface.getStateRoot`

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

`EvmStateManagerInterface.hasStateRoot`

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:68

***

### modifyAccountFields()

> **modifyAccountFields**(`address`, `accountFields`): `Promise`\<`void`\>

#### Parameters

• **address**: `Address`

• **accountFields**: `Partial`\<`Pick`\<`Account`, `"nonce"` \| `"balance"` \| `"storageRoot"` \| `"codeHash"`\>\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EvmStateManagerInterface.modifyAccountFields`

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:56

***

### putAccount()

> **putAccount**(`address`, `account`?): `Promise`\<`void`\>

#### Parameters

• **address**: `Address`

• **account?**: `Account`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EvmStateManagerInterface.putAccount`

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:54

***

### putContractCode()

> **putContractCode**(`address`, `value`): `Promise`\<`void`\>

#### Parameters

• **address**: `Address`

• **value**: `Uint8Array`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EvmStateManagerInterface.putContractCode`

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:57

***

### putContractStorage()

> **putContractStorage**(`address`, `key`, `value`): `Promise`\<`void`\>

#### Parameters

• **address**: `Address`

• **key**: `Uint8Array`

• **value**: `Uint8Array`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EvmStateManagerInterface.putContractStorage`

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:60

***

### revert()

> **revert**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EvmStateManagerInterface.revert`

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

`EvmStateManagerInterface.setStateRoot`

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:66

***

### shallowCopy()

> **shallowCopy**(`downlevelCaches`?): `EVMStateManagerInterface`

#### Parameters

• **downlevelCaches?**: `boolean`

#### Returns

`EVMStateManagerInterface`

#### Inherited from

`EvmStateManagerInterface.shallowCopy`

#### Source

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:81
