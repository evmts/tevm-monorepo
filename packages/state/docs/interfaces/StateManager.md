[**@tevm/state**](../README.md)

***

[@tevm/state](../globals.md) / StateManager

# Interface: StateManager

Defined in: [tevm-monorepo/packages/state/src/StateManager.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L8)

## Extends

- `Omit`\<`EvmStateManagerInterface`, `"getAccount"` \| `"putAccount"` \| `"modifyAccountFields"` \| `"shallowCopy"` \| `"initBinaryTreeExecutionWitness"`\>

## Properties

| Property | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="_basestate"></a> `_baseState` | [`BaseState`](../type-aliases/BaseState.md) | The internal state representation | - | [tevm-monorepo/packages/state/src/StateManager.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L16) |
| <a id="checkchunkwitnesspresent"></a> `checkChunkWitnessPresent?` | (`contract`, `programCounter`) => `Promise`\<`boolean`\> | - | `Omit.checkChunkWitnessPresent` | tevm-monorepo/node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:127 |
| <a id="getaccountaddresses"></a> `getAccountAddresses` | () => `Set`\<`` `0x${string}` ``\> | Returns contract addresses | - | [tevm-monorepo/packages/state/src/StateManager.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L21) |
| <a id="getappliedkey"></a> `getAppliedKey?` | (`address`) => `Uint8Array` | - | `Omit.getAppliedKey` | tevm-monorepo/node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:128 |
| <a id="originalstoragecache"></a> `originalStorageCache` | `object` | - | `Omit.originalStorageCache` | tevm-monorepo/node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:120 |
| `originalStorageCache.clear` | `void` | - | - | tevm-monorepo/node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:122 |
| `originalStorageCache.get` | `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\> | - | - | tevm-monorepo/node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:121 |
| <a id="ready"></a> `ready` | () => `Promise`\<`true`\> | - | - | [tevm-monorepo/packages/state/src/StateManager.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L17) |
| <a id="verifybinarytreepoststate"></a> `verifyBinaryTreePostState?` | (`accessWitness`) => `Promise`\<`boolean`\> | - | `Omit.verifyBinaryTreePostState` | tevm-monorepo/node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:126 |

## Methods

### checkpoint()

> **checkpoint**(): `Promise`\<`void`\>

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:112

#### Returns

`Promise`\<`void`\>

#### Inherited from

`Omit.checkpoint`

***

### clearCaches()

> **clearCaches**(): `void`

Defined in: [tevm-monorepo/packages/state/src/StateManager.ts:37](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L37)

Resets all internal caches

#### Returns

`void`

#### Overrides

`Omit.clearCaches`

***

### clearContractStorage()

> **clearContractStorage**(`address`): `Promise`\<`void`\>

Defined in: [tevm-monorepo/packages/state/src/StateManager.ts:59](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L59)

Clears all storage entries for the account

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `address` | `Address` |

#### Returns

`Promise`\<`void`\>

***

### clearStorage()

> **clearStorage**(`address`): `Promise`\<`void`\>

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:111

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `address` | `Address` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

`Omit.clearStorage`

***

### commit()

> **commit**(`createNewStateRoot?`): `Promise`\<`void`\>

Defined in: [tevm-monorepo/packages/state/src/StateManager.ts:47](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L47)

Commits the current state.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `createNewStateRoot?` | `boolean` | **`Experimental`** Whether to create a new state root Defaults to true. This api is not stable |

#### Returns

`Promise`\<`void`\>

#### Overrides

`Omit.commit`

***

### deepCopy()

> **deepCopy**(): `Promise`\<`StateManager`\>

Defined in: [tevm-monorepo/packages/state/src/StateManager.ts:28](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L28)

Returns a new instance of the ForkStateManager with the same opts and all storage copied over

#### Returns

`Promise`\<`StateManager`\>

***

### deleteAccount()

> **deleteAccount**(`address`): `Promise`\<`void`\>

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:104

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `address` | `Address` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

`Omit.deleteAccount`

***

### dumpCanonicalGenesis()

> **dumpCanonicalGenesis**(): `Promise`\<[`TevmState`](../type-aliases/TevmState.md)\>

Defined in: [tevm-monorepo/packages/state/src/StateManager.ts:33](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L33)

Dumps the state of the state manager as a [TevmState](../type-aliases/TevmState.md)

#### Returns

`Promise`\<[`TevmState`](../type-aliases/TevmState.md)\>

***

### dumpStorage()

> **dumpStorage**(`address`): `Promise`\<`StorageDump`\>

Defined in: [tevm-monorepo/packages/state/src/StateManager.ts:63](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L63)

Dumps storage based on the input

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `address` | `Address` |

#### Returns

`Promise`\<`StorageDump`\>

#### Overrides

`Omit.dumpStorage`

***

### dumpStorageRange()

> **dumpStorageRange**(`address`, `startKey`, `limit`): `Promise`\<`StorageRange`\>

Defined in: [tevm-monorepo/packages/state/src/StateManager.ts:67](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L67)

Dumps a range of storage values

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `address` | `Address` |
| `startKey` | `bigint` |
| `limit` | `number` |

#### Returns

`Promise`\<`StorageRange`\>

#### Overrides

`Omit.dumpStorageRange`

***

### generateCanonicalGenesis()

> **generateCanonicalGenesis**(`state`): `Promise`\<`void`\>

Defined in: [tevm-monorepo/packages/state/src/StateManager.ts:75](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L75)

Loads a state from a given state root

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `state` | [`TevmState`](../type-aliases/TevmState.md) |

#### Returns

`Promise`\<`void`\>

#### Overrides

`Omit.generateCanonicalGenesis`

***

### getAccount()

> **getAccount**(`address`): `Promise`\<`Account` \| `undefined`\>

Defined in: [tevm-monorepo/packages/state/src/StateManager.ts:22](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L22)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `address` | `Address` |

#### Returns

`Promise`\<`Account` \| `undefined`\>

***

### getCode()

> **getCode**(`address`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:107

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `address` | `Address` |

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Inherited from

`Omit.getCode`

***

### getCodeSize()

> **getCodeSize**(`address`): `Promise`\<`number`\>

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:108

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `address` | `Address` |

#### Returns

`Promise`\<`number`\>

#### Inherited from

`Omit.getCodeSize`

***

### getProof()

> **getProof**(`address`, `storageSlots?`): `Promise`\<`Proof`\>

Defined in: [tevm-monorepo/packages/state/src/StateManager.ts:82](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L82)

Get an EIP-1186 proof from the provider

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `address` | `Address` | The address to get proof for |
| `storageSlots?` | `Uint8Array`\<`ArrayBufferLike`\>[] | Storage slots to include in the proof |

#### Returns

`Promise`\<`Proof`\>

The account and storage proof

***

### getStateRoot()

> **getStateRoot**(): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:115

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Inherited from

`Omit.getStateRoot`

***

### getStorage()

> **getStorage**(`address`, `key`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:109

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `address` | `Address` |
| `key` | `Uint8Array` |

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Inherited from

`Omit.getStorage`

***

### hasStateRoot()

> **hasStateRoot**(`root`): `Promise`\<`boolean`\>

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:117

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `root` | `Uint8Array` |

#### Returns

`Promise`\<`boolean`\>

#### Inherited from

`Omit.hasStateRoot`

***

### modifyAccountFields()

> **modifyAccountFields**(`address`, `accountFields`): `Promise`\<`void`\>

Defined in: [tevm-monorepo/packages/state/src/StateManager.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L24)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `address` | `Address` |
| `accountFields` | `AccountFields` |

#### Returns

`Promise`\<`void`\>

***

### putAccount()

> **putAccount**(`address`, `account?`): `Promise`\<`void`\>

Defined in: [tevm-monorepo/packages/state/src/StateManager.ts:23](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L23)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `address` | `Address` |
| `account?` | `Account` |

#### Returns

`Promise`\<`void`\>

***

### putCode()

> **putCode**(`address`, `value`): `Promise`\<`void`\>

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:106

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `address` | `Address` |
| `value` | `Uint8Array` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

`Omit.putCode`

***

### putStorage()

> **putStorage**(`address`, `key`, `value`): `Promise`\<`void`\>

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:110

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `address` | `Address` |
| `key` | `Uint8Array` |
| `value` | `Uint8Array` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

`Omit.putStorage`

***

### revert()

> **revert**(): `Promise`\<`void`\>

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:114

#### Returns

`Promise`\<`void`\>

#### Inherited from

`Omit.revert`

***

### saveStateRoot()

> **saveStateRoot**(`root`, `state`): `void`

Defined in: [tevm-monorepo/packages/state/src/StateManager.ts:43](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L43)

**`Experimental`**

Saves a state root to the state root mapping
THis API is considered unstable

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `root` | `Uint8Array` |
| `state` | [`TevmState`](../type-aliases/TevmState.md) |

#### Returns

`void`

***

### setStateRoot()

> **setStateRoot**(`stateRoot`, `clearCache?`): `Promise`\<`void`\>

Defined in: tevm-monorepo/node\_modules/.pnpm/@ethereumjs+common@10.1.1/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:116

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `stateRoot` | `Uint8Array` |
| `clearCache?` | `boolean` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

`Omit.setStateRoot`

***

### shallowCopy()

> **shallowCopy**(): `StateManager`

Defined in: [tevm-monorepo/packages/state/src/StateManager.ts:29](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L29)

#### Returns

`StateManager`
