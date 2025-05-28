[**@tevm/state**](../README.md)

***

[@tevm/state](../globals.md) / StateManager

# Interface: StateManager

Defined in: [packages/state/src/StateManager.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L6)

## Extends

- `StateManagerInterface`

## Properties

### \_baseState

> **\_baseState**: [`BaseState`](../type-aliases/BaseState.md)

Defined in: [packages/state/src/StateManager.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L10)

The internal state representation

***

### getAccountAddresses()

> **getAccountAddresses**: () => `Set`\<`` `0x${string}` ``\>

Defined in: [packages/state/src/StateManager.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L15)

Returns contract addresses

#### Returns

`Set`\<`` `0x${string}` ``\>

***

### originalStorageCache

> **originalStorageCache**: `object`

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:164

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

`EvmStateManagerInterface.originalStorageCache`

***

### ready()

> **ready**: () => `Promise`\<`true`\>

Defined in: [packages/state/src/StateManager.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L11)

#### Returns

`Promise`\<`true`\>

## Methods

### checkChunkWitnessPresent()?

> `optional` **checkChunkWitnessPresent**(`contract`, `programCounter`): `Promise`\<`boolean`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:173

#### Parameters

##### contract

`Address`

##### programCounter

`number`

#### Returns

`Promise`\<`boolean`\>

#### Inherited from

`EvmStateManagerInterface.checkChunkWitnessPresent`

***

### checkpoint()

> **checkpoint**(): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:156

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EvmStateManagerInterface.checkpoint`

***

### clearCaches()

> **clearCaches**(): `void`

Defined in: [packages/state/src/StateManager.ts:27](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L27)

Resets all internal caches

#### Returns

`void`

#### Overrides

`EvmStateManagerInterface.clearCaches`

***

### clearContractStorage()

> **clearContractStorage**(`address`): `Promise`\<`void`\>

Defined in: [packages/state/src/StateManager.ts:49](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L49)

Clears all storage entries for the account

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`void`\>

***

### clearStorage()

> **clearStorage**(`address`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:155

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EvmStateManagerInterface.clearStorage`

***

### commit()

> **commit**(`createNewStateRoot?`): `Promise`\<`void`\>

Defined in: [packages/state/src/StateManager.ts:37](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L37)

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

`EvmStateManagerInterface.commit`

***

### deepCopy()

> **deepCopy**(): `Promise`\<`StateManager`\>

Defined in: [packages/state/src/StateManager.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L19)

Returns a new instance of the ForkStateManager with the same opts and all storage copied over

#### Returns

`Promise`\<`StateManager`\>

***

### deleteAccount()

> **deleteAccount**(`address`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:148

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EvmStateManagerInterface.deleteAccount`

***

### dumpCanonicalGenesis()

> **dumpCanonicalGenesis**(): `Promise`\<[`TevmState`](../type-aliases/TevmState.md)\>

Defined in: [packages/state/src/StateManager.ts:23](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L23)

Dumps the state of the state manager as a [TevmState](../type-aliases/TevmState.md)

#### Returns

`Promise`\<[`TevmState`](../type-aliases/TevmState.md)\>

***

### dumpStorage()

> **dumpStorage**(`address`): `Promise`\<`StorageDump`\>

Defined in: [packages/state/src/StateManager.ts:53](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L53)

Dumps storage based on the input

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`StorageDump`\>

#### Overrides

`EvmStateManagerInterface.dumpStorage`

***

### dumpStorageRange()

> **dumpStorageRange**(`address`, `startKey`, `limit`): `Promise`\<`StorageRange`\>

Defined in: [packages/state/src/StateManager.ts:57](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L57)

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

`EvmStateManagerInterface.dumpStorageRange`

***

### generateCanonicalGenesis()

> **generateCanonicalGenesis**(`state`): `Promise`\<`void`\>

Defined in: [packages/state/src/StateManager.ts:65](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L65)

Loads a state from a given state root

#### Parameters

##### state

[`TevmState`](../type-aliases/TevmState.md)

#### Returns

`Promise`\<`void`\>

#### Overrides

`EvmStateManagerInterface.generateCanonicalGenesis`

***

### getAccount()

> **getAccount**(`address`): `Promise`\<`undefined` \| `Account`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:146

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`undefined` \| `Account`\>

#### Inherited from

`EvmStateManagerInterface.getAccount`

***

### getAppliedKey()?

> `optional` **getAppliedKey**(`address`): `Uint8Array`

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:174

#### Parameters

##### address

`Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

`EvmStateManagerInterface.getAppliedKey`

***

### getCode()

> **getCode**(`address`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:151

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Inherited from

`EvmStateManagerInterface.getCode`

***

### getCodeSize()

> **getCodeSize**(`address`): `Promise`\<`number`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:152

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`number`\>

#### Inherited from

`EvmStateManagerInterface.getCodeSize`

***

### getProof()

> **getProof**(`address`, `storageSlots?`): `Promise`\<`Proof`\>

Defined in: [packages/state/src/StateManager.ts:72](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L72)

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

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:159

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Inherited from

`EvmStateManagerInterface.getStateRoot`

***

### getStorage()

> **getStorage**(`address`, `key`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:153

#### Parameters

##### address

`Address`

##### key

`Uint8Array`

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Inherited from

`EvmStateManagerInterface.getStorage`

***

### hasStateRoot()

> **hasStateRoot**(`root`): `Promise`\<`boolean`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:161

#### Parameters

##### root

`Uint8Array`

#### Returns

`Promise`\<`boolean`\>

#### Inherited from

`EvmStateManagerInterface.hasStateRoot`

***

### initBinaryTreeExecutionWitness()?

> `optional` **initBinaryTreeExecutionWitness**(`blockNum`, `executionWitness?`): `void`

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:171

#### Parameters

##### blockNum

`bigint`

##### executionWitness?

`null` | `BinaryTreeExecutionWitness`

#### Returns

`void`

#### Inherited from

`EvmStateManagerInterface.initBinaryTreeExecutionWitness`

***

### initVerkleExecutionWitness()?

> `optional` **initVerkleExecutionWitness**(`blockNum`, `executionWitness?`): `void`

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:169

#### Parameters

##### blockNum

`bigint`

##### executionWitness?

`null` | `VerkleExecutionWitness`

#### Returns

`void`

#### Inherited from

`EvmStateManagerInterface.initVerkleExecutionWitness`

***

### modifyAccountFields()

> **modifyAccountFields**(`address`, `accountFields`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:149

#### Parameters

##### address

`Address`

##### accountFields

`AccountFields`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EvmStateManagerInterface.modifyAccountFields`

***

### putAccount()

> **putAccount**(`address`, `account?`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:147

#### Parameters

##### address

`Address`

##### account?

`Account`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EvmStateManagerInterface.putAccount`

***

### putCode()

> **putCode**(`address`, `value`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:150

#### Parameters

##### address

`Address`

##### value

`Uint8Array`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EvmStateManagerInterface.putCode`

***

### putStorage()

> **putStorage**(`address`, `key`, `value`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:154

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

`EvmStateManagerInterface.putStorage`

***

### revert()

> **revert**(): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:158

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EvmStateManagerInterface.revert`

***

### saveStateRoot()

> **saveStateRoot**(`root`, `state`): `void`

Defined in: [packages/state/src/StateManager.ts:33](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L33)

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

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:160

#### Parameters

##### stateRoot

`Uint8Array`

##### clearCache?

`boolean`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EvmStateManagerInterface.setStateRoot`

***

### shallowCopy()

> **shallowCopy**(`downlevelCaches?`): `StateManagerInterface`

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:176

#### Parameters

##### downlevelCaches?

`boolean`

#### Returns

`StateManagerInterface`

#### Inherited from

`EvmStateManagerInterface.shallowCopy`

***

### verifyBinaryTreePostState()?

> `optional` **verifyBinaryTreePostState**(`accessWitness`): `Promise`\<`boolean`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:172

#### Parameters

##### accessWitness

`BinaryTreeAccessWitnessInterface`

#### Returns

`Promise`\<`boolean`\>

#### Inherited from

`EvmStateManagerInterface.verifyBinaryTreePostState`

***

### verifyVerklePostState()?

> `optional` **verifyVerklePostState**(`accessWitness`): `Promise`\<`boolean`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@10.0.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:170

#### Parameters

##### accessWitness

`VerkleAccessWitnessInterface`

#### Returns

`Promise`\<`boolean`\>

#### Inherited from

`EvmStateManagerInterface.verifyVerklePostState`
