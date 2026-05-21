[**@tevm/state**](../README.md)

***

[@tevm/state](../globals.md) / StateManager

# Interface: StateManager

Defined in: [tevm-monorepo/packages/state/src/StateManager.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L8)

## Extends

- `Omit`\<`EvmStateManagerInterface`, `"getAccount"` \| `"putAccount"` \| `"modifyAccountFields"` \| `"shallowCopy"`\>

## Properties

### \_baseState

> **\_baseState**: [`BaseState`](../type-aliases/BaseState.md)

Defined in: [tevm-monorepo/packages/state/src/StateManager.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L13)

The internal state representation

***

### checkChunkWitnessPresent?

> `optional` **checkChunkWitnessPresent?**: (`contract`, `programCounter`) => `Promise`\<`boolean`\>

#### Parameters

##### contract

`Address`

##### programCounter

`number`

#### Returns

`Promise`\<`boolean`\>

#### Inherited from

`Omit.checkChunkWitnessPresent`

***

### getAccountAddresses

> **getAccountAddresses**: () => `Set`\<`` `0x${string}` ``\>

Defined in: [tevm-monorepo/packages/state/src/StateManager.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L18)

Returns contract addresses

#### Returns

`Set`\<`` `0x${string}` ``\>

***

### getAppliedKey?

> `optional` **getAppliedKey?**: (`address`) => `Uint8Array`

#### Parameters

##### address

`Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

`Omit.getAppliedKey`

***

### originalStorageCache

> **originalStorageCache**: `object`

#### clear()

> **clear**(): `void`

##### Returns

`void`

#### get()

> **get**(`address`, `key`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

##### Parameters

###### address

`Address`

###### key

`Uint8Array`

##### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Inherited from

`Omit.originalStorageCache`

***

### ready

> **ready**: () => `Promise`\<`true`\>

Defined in: [tevm-monorepo/packages/state/src/StateManager.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L14)

#### Returns

`Promise`\<`true`\>

***

### verifyBinaryTreePostState?

> `optional` **verifyBinaryTreePostState?**: (`accessWitness`) => `Promise`\<`boolean`\>

#### Parameters

##### accessWitness

`BinaryTreeAccessWitnessInterface`

#### Returns

`Promise`\<`boolean`\>

#### Inherited from

`Omit.verifyBinaryTreePostState`

## Methods

### checkpoint()

> **checkpoint**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

`Omit.checkpoint`

***

### clearCaches()

> **clearCaches**(): `void`

Defined in: [tevm-monorepo/packages/state/src/StateManager.ts:34](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L34)

Resets all internal caches

#### Returns

`void`

#### Overrides

`Omit.clearCaches`

***

### clearContractStorage()

> **clearContractStorage**(`address`): `Promise`\<`void`\>

Defined in: [tevm-monorepo/packages/state/src/StateManager.ts:56](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L56)

Clears all storage entries for the account

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`void`\>

***

### clearStorage()

> **clearStorage**(`address`): `Promise`\<`void`\>

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`Omit.clearStorage`

***

### commit()

> **commit**(`createNewStateRoot?`): `Promise`\<`void`\>

Defined in: [tevm-monorepo/packages/state/src/StateManager.ts:44](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L44)

Commits the current state.

#### Parameters

##### createNewStateRoot?

`boolean`

**`Experimental`**

Whether to create a new state root
Defaults to true.
This api is not stable

#### Returns

`Promise`\<`void`\>

#### Overrides

`Omit.commit`

***

### deepCopy()

> **deepCopy**(): `Promise`\<`StateManager`\>

Defined in: [tevm-monorepo/packages/state/src/StateManager.ts:25](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L25)

Returns a new instance of the ForkStateManager with the same opts and all storage copied over

#### Returns

`Promise`\<`StateManager`\>

***

### deleteAccount()

> **deleteAccount**(`address`): `Promise`\<`void`\>

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`Omit.deleteAccount`

***

### dumpCanonicalGenesis()

> **dumpCanonicalGenesis**(): `Promise`\<[`TevmState`](../type-aliases/TevmState.md)\>

Defined in: [tevm-monorepo/packages/state/src/StateManager.ts:30](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L30)

Dumps the state of the state manager as a [TevmState](../type-aliases/TevmState.md)

#### Returns

`Promise`\<[`TevmState`](../type-aliases/TevmState.md)\>

***

### dumpStorage()

> **dumpStorage**(`address`): `Promise`\<`StorageDump`\>

Defined in: [tevm-monorepo/packages/state/src/StateManager.ts:60](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L60)

Dumps storage based on the input

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`StorageDump`\>

#### Overrides

`Omit.dumpStorage`

***

### dumpStorageRange()

> **dumpStorageRange**(`address`, `startKey`, `limit`): `Promise`\<`StorageRange`\>

Defined in: [tevm-monorepo/packages/state/src/StateManager.ts:64](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L64)

Dumps a range of storage values

#### Parameters

##### address

`Address`

##### startKey

`bigint`

##### limit

`number`

#### Returns

`Promise`\<`StorageRange`\>

#### Overrides

`Omit.dumpStorageRange`

***

### generateCanonicalGenesis()

> **generateCanonicalGenesis**(`state`): `Promise`\<`void`\>

Defined in: [tevm-monorepo/packages/state/src/StateManager.ts:72](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L72)

Loads a state from a given state root

#### Parameters

##### state

[`TevmState`](../type-aliases/TevmState.md)

#### Returns

`Promise`\<`void`\>

#### Overrides

`Omit.generateCanonicalGenesis`

***

### getAccount()

> **getAccount**(`address`): `Promise`\<`Account` \| `undefined`\>

Defined in: [tevm-monorepo/packages/state/src/StateManager.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L19)

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`Account` \| `undefined`\>

***

### getCode()

> **getCode**(`address`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Inherited from

`Omit.getCode`

***

### getCodeSize()

> **getCodeSize**(`address`): `Promise`\<`number`\>

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`number`\>

#### Inherited from

`Omit.getCodeSize`

***

### getProof()

> **getProof**(`address`, `storageSlots?`): `Promise`\<`Proof`\>

Defined in: [tevm-monorepo/packages/state/src/StateManager.ts:79](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L79)

Get an EIP-1186 proof from the provider

#### Parameters

##### address

`Address`

The address to get proof for

##### storageSlots?

`Uint8Array`\<`ArrayBufferLike`\>[]

Storage slots to include in the proof

#### Returns

`Promise`\<`Proof`\>

The account and storage proof

***

### getStateRoot()

> **getStateRoot**(): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Inherited from

`Omit.getStateRoot`

***

### getStorage()

> **getStorage**(`address`, `key`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Parameters

##### address

`Address`

##### key

`Uint8Array`

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Inherited from

`Omit.getStorage`

***

### hasStateRoot()

> **hasStateRoot**(`root`): `Promise`\<`boolean`\>

#### Parameters

##### root

`Uint8Array`

#### Returns

`Promise`\<`boolean`\>

#### Inherited from

`Omit.hasStateRoot`

***

### modifyAccountFields()

> **modifyAccountFields**(`address`, `accountFields`): `Promise`\<`void`\>

Defined in: [tevm-monorepo/packages/state/src/StateManager.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L21)

#### Parameters

##### address

`Address`

##### accountFields

`AccountFields`

#### Returns

`Promise`\<`void`\>

***

### putAccount()

> **putAccount**(`address`, `account?`): `Promise`\<`void`\>

Defined in: [tevm-monorepo/packages/state/src/StateManager.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L20)

#### Parameters

##### address

`Address`

##### account?

`Account`

#### Returns

`Promise`\<`void`\>

***

### putCode()

> **putCode**(`address`, `value`): `Promise`\<`void`\>

#### Parameters

##### address

`Address`

##### value

`Uint8Array`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`Omit.putCode`

***

### putStorage()

> **putStorage**(`address`, `key`, `value`): `Promise`\<`void`\>

#### Parameters

##### address

`Address`

##### key

`Uint8Array`

##### value

`Uint8Array`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`Omit.putStorage`

***

### revert()

> **revert**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

`Omit.revert`

***

### saveStateRoot()

> **saveStateRoot**(`root`, `state`): `void`

Defined in: [tevm-monorepo/packages/state/src/StateManager.ts:40](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L40)

**`Experimental`**

Saves a state root to the state root mapping
THis API is considered unstable

#### Parameters

##### root

`Uint8Array`

##### state

[`TevmState`](../type-aliases/TevmState.md)

#### Returns

`void`

***

### setStateRoot()

> **setStateRoot**(`stateRoot`, `clearCache?`): `Promise`\<`void`\>

#### Parameters

##### stateRoot

`Uint8Array`

##### clearCache?

`boolean`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`Omit.setStateRoot`

***

### shallowCopy()

> **shallowCopy**(): `StateManager`

Defined in: [tevm-monorepo/packages/state/src/StateManager.ts:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L26)

#### Returns

`StateManager`
