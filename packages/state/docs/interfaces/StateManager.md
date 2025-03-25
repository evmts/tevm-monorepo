[**@tevm/state**](../README.md)

***

[@tevm/state](../globals.md) / StateManager

# Interface: StateManager

Defined in: [packages/state/src/StateManager.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L6)

## Extends

- `EVMStateManagerInterface`

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

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:136

#### clear()

##### Returns

`void`

#### get()

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

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:133

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

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:124

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

***

### clearContractStorage()

> **clearContractStorage**(`address`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:123

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EvmStateManagerInterface.clearContractStorage`

***

### commit()

> **commit**(`createNewStateRoot`?): `Promise`\<`void`\>

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

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:116

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

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:140

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`StorageDump`\>

#### Inherited from

`EvmStateManagerInterface.dumpStorage`

***

### dumpStorageRange()

> **dumpStorageRange**(`address`, `startKey`, `limit`): `Promise`\<`StorageRange`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:141

#### Parameters

##### address

`Address`

##### startKey

`bigint`

##### limit

`number`

#### Returns

`Promise`\<`StorageRange`\>

#### Inherited from

`EvmStateManagerInterface.dumpStorageRange`

***

### generateCanonicalGenesis()

> **generateCanonicalGenesis**(`initState`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:142

#### Parameters

##### initState

`any`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EvmStateManagerInterface.generateCanonicalGenesis`

***

### getAccount()

> **getAccount**(`address`): `Promise`\<`undefined` \| `Account`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:114

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

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:132

#### Parameters

##### address

`Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

`EvmStateManagerInterface.getAppliedKey`

***

### getContractCode()

> **getContractCode**(`address`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:119

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Inherited from

`EvmStateManagerInterface.getContractCode`

***

### getContractCodeSize()?

> `optional` **getContractCodeSize**(`address`): `Promise`\<`number`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:120

#### Parameters

##### address

`Address`

#### Returns

`Promise`\<`number`\>

#### Inherited from

`EvmStateManagerInterface.getContractCodeSize`

***

### getContractStorage()

> **getContractStorage**(`address`, `key`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:121

#### Parameters

##### address

`Address`

##### key

`Uint8Array`

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Inherited from

`EvmStateManagerInterface.getContractStorage`

***

### getProof()

> **getProof**(`address`, `storageSlots`?): `Promise`\<`Proof`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:143

#### Parameters

##### address

`Address`

##### storageSlots?

`Uint8Array`\<`ArrayBufferLike`\>[]

#### Returns

`Promise`\<`Proof`\>

#### Inherited from

`EvmStateManagerInterface.getProof`

***

### getStateRoot()

> **getStateRoot**(): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:127

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

#### Inherited from

`EvmStateManagerInterface.getStateRoot`

***

### hasStateRoot()

> **hasStateRoot**(`root`): `Promise`\<`boolean`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:130

#### Parameters

##### root

`Uint8Array`

#### Returns

`Promise`\<`boolean`\>

#### Inherited from

`EvmStateManagerInterface.hasStateRoot`

***

### modifyAccountFields()

> **modifyAccountFields**(`address`, `accountFields`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:117

#### Parameters

##### address

`Address`

##### accountFields

`Partial`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EvmStateManagerInterface.modifyAccountFields`

***

### putAccount()

> **putAccount**(`address`, `account`?): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:115

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

### putContractCode()

> **putContractCode**(`address`, `value`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:118

#### Parameters

##### address

`Address`

##### value

`Uint8Array`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EvmStateManagerInterface.putContractCode`

***

### putContractStorage()

> **putContractStorage**(`address`, `key`, `value`): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:122

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

`EvmStateManagerInterface.putContractStorage`

***

### revert()

> **revert**(): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:126

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

> **setStateRoot**(`stateRoot`, `clearCache`?): `Promise`\<`void`\>

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:128

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

> **shallowCopy**(`downlevelCaches`?): `EVMStateManagerInterface`

Defined in: node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:144

#### Parameters

##### downlevelCaches?

`boolean`

#### Returns

`EVMStateManagerInterface`

#### Inherited from

`EvmStateManagerInterface.shallowCopy`
