[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [state](../README.md) / StateManager

# Interface: StateManager

## Extends

- `Omit`\<[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md), `"getAccount"` \| `"putAccount"` \| `"modifyAccountFields"` \| `"shallowCopy"` \| `"initBinaryTreeExecutionWitness"`\>

## Properties

| Property | Type | Description | Inherited from |
| ------ | ------ | ------ | ------ |
| <a id="_basestate"></a> `_baseState` | [`BaseState`](../type-aliases/BaseState.md) | The internal state representation | - |
| <a id="checkchunkwitnesspresent"></a> `checkChunkWitnessPresent?` | (`contract`, `programCounter`) => `Promise`\<`boolean`\> | - | [`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`checkChunkWitnessPresent`](../../common/interfaces/EvmStateManagerInterface.md#checkchunkwitnesspresent) |
| <a id="getaccountaddresses"></a> `getAccountAddresses` | () => `Set`\<`` `0x${string}` ``\> | Returns contract addresses | - |
| <a id="getappliedkey"></a> `getAppliedKey?` | (`address`) => `Uint8Array` | - | [`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`getAppliedKey`](../../common/interfaces/EvmStateManagerInterface.md#getappliedkey) |
| <a id="originalstoragecache"></a> `originalStorageCache` | `object` | - | [`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`originalStorageCache`](../../common/interfaces/EvmStateManagerInterface.md#originalstoragecache) |
| `originalStorageCache.clear` | `void` | - | - |
| `originalStorageCache.get` | `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\> | - | - |
| <a id="ready"></a> `ready` | () => `Promise`\<`true`\> | - | - |
| <a id="verifybinarytreepoststate"></a> `verifyBinaryTreePostState?` | (`accessWitness`) => `Promise`\<`boolean`\> | - | [`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`verifyBinaryTreePostState`](../../common/interfaces/EvmStateManagerInterface.md#verifybinarytreepoststate) |

## Methods

### checkpoint()

> **checkpoint**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`checkpoint`](../../common/interfaces/EvmStateManagerInterface.md#checkpoint)

***

### clearCaches()

> **clearCaches**(): `void`

Resets all internal caches

#### Returns

`void`

#### Overrides

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`clearCaches`](../../common/interfaces/EvmStateManagerInterface.md#clearcaches)

***

### clearContractStorage()

> **clearContractStorage**(`address`): `Promise`\<`void`\>

Clears all storage entries for the account

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `address` | [`EthjsAddress`](../../utils/classes/EthjsAddress.md) |

#### Returns

`Promise`\<`void`\>

***

### clearStorage()

> **clearStorage**(`address`): `Promise`\<`void`\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `address` | `Address` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`clearStorage`](../../common/interfaces/EvmStateManagerInterface.md#clearstorage)

***

### commit()

> **commit**(`createNewStateRoot?`): `Promise`\<`void`\>

Commits the current state.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `createNewStateRoot?` | `boolean` | **`Experimental`** Whether to create a new state root Defaults to true. This api is not stable |

#### Returns

`Promise`\<`void`\>

#### Overrides

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`commit`](../../common/interfaces/EvmStateManagerInterface.md#commit)

***

### deepCopy()

> **deepCopy**(): `Promise`\<`StateManager`\>

Returns a new instance of the ForkStateManager with the same opts and all storage copied over

#### Returns

`Promise`\<`StateManager`\>

***

### deleteAccount()

> **deleteAccount**(`address`): `Promise`\<`void`\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `address` | `Address` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`deleteAccount`](../../common/interfaces/EvmStateManagerInterface.md#deleteaccount)

***

### dumpCanonicalGenesis()

> **dumpCanonicalGenesis**(): `Promise`\<[`TevmState`](../../index/type-aliases/TevmState.md)\>

Dumps the state of the state manager as a [TevmState](../../index/type-aliases/TevmState.md)

#### Returns

`Promise`\<[`TevmState`](../../index/type-aliases/TevmState.md)\>

***

### dumpStorage()

> **dumpStorage**(`address`): `Promise`\<[`StorageDump`](../../common/interfaces/StorageDump.md)\>

Dumps storage based on the input

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `address` | [`EthjsAddress`](../../utils/classes/EthjsAddress.md) |

#### Returns

`Promise`\<[`StorageDump`](../../common/interfaces/StorageDump.md)\>

#### Overrides

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`dumpStorage`](../../common/interfaces/EvmStateManagerInterface.md#dumpstorage)

***

### dumpStorageRange()

> **dumpStorageRange**(`address`, `startKey`, `limit`): `Promise`\<[`StorageRange`](../../common/interfaces/StorageRange.md)\>

Dumps a range of storage values

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `address` | [`EthjsAddress`](../../utils/classes/EthjsAddress.md) |
| `startKey` | `bigint` |
| `limit` | `number` |

#### Returns

`Promise`\<[`StorageRange`](../../common/interfaces/StorageRange.md)\>

#### Overrides

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`dumpStorageRange`](../../common/interfaces/EvmStateManagerInterface.md#dumpstoragerange)

***

### generateCanonicalGenesis()

> **generateCanonicalGenesis**(`state`): `Promise`\<`void`\>

Loads a state from a given state root

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `state` | [`TevmState`](../../index/type-aliases/TevmState.md) |

#### Returns

`Promise`\<`void`\>

#### Overrides

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`generateCanonicalGenesis`](../../common/interfaces/EvmStateManagerInterface.md#generatecanonicalgenesis)

***

### getAccount()

> **getAccount**(`address`): `Promise`\<[`EthjsAccount`](../../utils/classes/EthjsAccount.md) \| `undefined`\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `address` | [`EthjsAddress`](../../utils/classes/EthjsAddress.md) |

#### Returns

`Promise`\<[`EthjsAccount`](../../utils/classes/EthjsAccount.md) \| `undefined`\>

***

### getCode()

> **getCode**(`address`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `address` | `Address` |

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`getCode`](../../common/interfaces/EvmStateManagerInterface.md#getcode)

***

### getCodeSize()

> **getCodeSize**(`address`): `Promise`\<`number`\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `address` | `Address` |

#### Returns

`Promise`\<`number`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`getCodeSize`](../../common/interfaces/EvmStateManagerInterface.md#getcodesize)

***

### getProof()

> **getProof**(`address`, `storageSlots?`): `Promise`\<`Proof`\>

Get an EIP-1186 proof from the provider

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `address` | [`EthjsAddress`](../../utils/classes/EthjsAddress.md) | The address to get proof for |
| `storageSlots?` | `Uint8Array`\<`ArrayBufferLike`\>[] | Storage slots to include in the proof |

#### Returns

`Promise`\<`Proof`\>

The account and storage proof

***

### getStateRoot()

> **getStateRoot**(): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`getStateRoot`](../../common/interfaces/EvmStateManagerInterface.md#getstateroot)

***

### getStorage()

> **getStorage**(`address`, `key`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `address` | `Address` |
| `key` | `Uint8Array` |

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`getStorage`](../../common/interfaces/EvmStateManagerInterface.md#getstorage)

***

### hasStateRoot()

> **hasStateRoot**(`root`): `Promise`\<`boolean`\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `root` | `Uint8Array` |

#### Returns

`Promise`\<`boolean`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`hasStateRoot`](../../common/interfaces/EvmStateManagerInterface.md#hasstateroot)

***

### modifyAccountFields()

> **modifyAccountFields**(`address`, `accountFields`): `Promise`\<`void`\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `address` | [`EthjsAddress`](../../utils/classes/EthjsAddress.md) |
| `accountFields` | [`AccountFields`](../../common/type-aliases/AccountFields.md) |

#### Returns

`Promise`\<`void`\>

***

### putAccount()

> **putAccount**(`address`, `account?`): `Promise`\<`void`\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `address` | [`EthjsAddress`](../../utils/classes/EthjsAddress.md) |
| `account?` | [`EthjsAccount`](../../utils/classes/EthjsAccount.md) |

#### Returns

`Promise`\<`void`\>

***

### putCode()

> **putCode**(`address`, `value`): `Promise`\<`void`\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `address` | `Address` |
| `value` | `Uint8Array` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`putCode`](../../common/interfaces/EvmStateManagerInterface.md#putcode)

***

### putStorage()

> **putStorage**(`address`, `key`, `value`): `Promise`\<`void`\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `address` | `Address` |
| `key` | `Uint8Array` |
| `value` | `Uint8Array` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`putStorage`](../../common/interfaces/EvmStateManagerInterface.md#putstorage)

***

### revert()

> **revert**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`revert`](../../common/interfaces/EvmStateManagerInterface.md#revert)

***

### saveStateRoot()

> **saveStateRoot**(`root`, `state`): `void`

**`Experimental`**

Saves a state root to the state root mapping
THis API is considered unstable

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `root` | `Uint8Array` |
| `state` | [`TevmState`](../../index/type-aliases/TevmState.md) |

#### Returns

`void`

***

### setStateRoot()

> **setStateRoot**(`stateRoot`, `clearCache?`): `Promise`\<`void`\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `stateRoot` | `Uint8Array` |
| `clearCache?` | `boolean` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`EvmStateManagerInterface`](../../common/interfaces/EvmStateManagerInterface.md).[`setStateRoot`](../../common/interfaces/EvmStateManagerInterface.md#setstateroot)

***

### shallowCopy()

> **shallowCopy**(): `StateManager`

#### Returns

`StateManager`
