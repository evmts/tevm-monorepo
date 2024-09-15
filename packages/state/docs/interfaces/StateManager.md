[**@tevm/state**](../README.md) • **Docs**

***

[@tevm/state](../globals.md) / StateManager

# Interface: StateManager

## Extends

- `EVMStateManagerInterface`

## Properties

### \_baseState

> **\_baseState**: [`BaseState`](../type-aliases/BaseState.md)

The internal state representation

#### Defined in

[packages/state/src/StateManager.ts:10](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L10)

***

### getAccountAddresses()

> **getAccountAddresses**: () => `Set`\<\`0x$\{string\}\`\>

Returns contract addresses

#### Returns

`Set`\<\`0x$\{string\}\`\>

#### Defined in

[packages/state/src/StateManager.ts:15](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L15)

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

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:136

***

### ready()

> **ready**: () => `Promise`\<`true`\>

#### Returns

`Promise`\<`true`\>

#### Defined in

[packages/state/src/StateManager.ts:11](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L11)

## Methods

### checkChunkWitnessPresent()?

> `optional` **checkChunkWitnessPresent**(`contract`, `programCounter`): `Promise`\<`boolean`\>

#### Parameters

• **contract**: `Address`

• **programCounter**: `number`

#### Returns

`Promise`\<`boolean`\>

#### Inherited from

`EvmStateManagerInterface.checkChunkWitnessPresent`

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:133

***

### checkpoint()

> **checkpoint**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EvmStateManagerInterface.checkpoint`

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:124

***

### clearCaches()

> **clearCaches**(): `void`

Resets all internal caches

#### Returns

`void`

#### Defined in

[packages/state/src/StateManager.ts:27](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L27)

***

### clearContractStorage()

> **clearContractStorage**(`address`): `Promise`\<`void`\>

#### Parameters

• **address**: `Address`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EvmStateManagerInterface.clearContractStorage`

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:123

***

### commit()

> **commit**(`createNewStateRoot`?): `Promise`\<`void`\>

Commits the current state.

#### Parameters

• **createNewStateRoot?**: `boolean`

**`Experimental`**

Whether to create a new state root
Defaults to true.
This api is not stable

#### Returns

`Promise`\<`void`\>

#### Overrides

`EvmStateManagerInterface.commit`

#### Defined in

[packages/state/src/StateManager.ts:37](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L37)

***

### deepCopy()

> **deepCopy**(): `Promise`\<[`StateManager`](StateManager.md)\>

Returns a new instance of the ForkStateManager with the same opts and all storage copied over

#### Returns

`Promise`\<[`StateManager`](StateManager.md)\>

#### Defined in

[packages/state/src/StateManager.ts:19](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L19)

***

### deleteAccount()

> **deleteAccount**(`address`): `Promise`\<`void`\>

#### Parameters

• **address**: `Address`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EvmStateManagerInterface.deleteAccount`

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:116

***

### dumpCanonicalGenesis()

> **dumpCanonicalGenesis**(): `Promise`\<[`TevmState`](../type-aliases/TevmState.md)\>

Dumps the state of the state manager as a [TevmState](../type-aliases/TevmState.md)

#### Returns

`Promise`\<[`TevmState`](../type-aliases/TevmState.md)\>

#### Defined in

[packages/state/src/StateManager.ts:23](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L23)

***

### dumpStorage()

> **dumpStorage**(`address`): `Promise`\<`StorageDump`\>

#### Parameters

• **address**: `Address`

#### Returns

`Promise`\<`StorageDump`\>

#### Inherited from

`EvmStateManagerInterface.dumpStorage`

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:140

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

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:141

***

### generateCanonicalGenesis()

> **generateCanonicalGenesis**(`initState`): `Promise`\<`void`\>

#### Parameters

• **initState**: `any`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EvmStateManagerInterface.generateCanonicalGenesis`

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:142

***

### getAccount()

> **getAccount**(`address`): `Promise`\<`undefined` \| `Account`\>

#### Parameters

• **address**: `Address`

#### Returns

`Promise`\<`undefined` \| `Account`\>

#### Inherited from

`EvmStateManagerInterface.getAccount`

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:114

***

### getAppliedKey()?

> `optional` **getAppliedKey**(`address`): `Uint8Array`

#### Parameters

• **address**: `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

`EvmStateManagerInterface.getAppliedKey`

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:132

***

### getContractCode()

> **getContractCode**(`address`): `Promise`\<`Uint8Array`\>

#### Parameters

• **address**: `Address`

#### Returns

`Promise`\<`Uint8Array`\>

#### Inherited from

`EvmStateManagerInterface.getContractCode`

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:119

***

### getContractCodeSize()?

> `optional` **getContractCodeSize**(`address`): `Promise`\<`number`\>

#### Parameters

• **address**: `Address`

#### Returns

`Promise`\<`number`\>

#### Inherited from

`EvmStateManagerInterface.getContractCodeSize`

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:120

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

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:121

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

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:143

***

### getStateRoot()

> **getStateRoot**(): `Promise`\<`Uint8Array`\>

#### Returns

`Promise`\<`Uint8Array`\>

#### Inherited from

`EvmStateManagerInterface.getStateRoot`

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:127

***

### hasStateRoot()

> **hasStateRoot**(`root`): `Promise`\<`boolean`\>

#### Parameters

• **root**: `Uint8Array`

#### Returns

`Promise`\<`boolean`\>

#### Inherited from

`EvmStateManagerInterface.hasStateRoot`

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:130

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

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:117

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

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:115

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

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:118

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

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:122

***

### revert()

> **revert**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EvmStateManagerInterface.revert`

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:126

***

### saveStateRoot()

> **saveStateRoot**(`root`, `state`): `void`

**`Experimental`**

Saves a state root to the state root mapping
THis API is considered unstable

#### Parameters

• **root**: `Uint8Array`

• **state**: [`TevmState`](../type-aliases/TevmState.md)

#### Returns

`void`

#### Defined in

[packages/state/src/StateManager.ts:33](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L33)

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

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:128

***

### shallowCopy()

> **shallowCopy**(`downlevelCaches`?): `EVMStateManagerInterface`

#### Parameters

• **downlevelCaches?**: `boolean`

#### Returns

`EVMStateManagerInterface`

#### Inherited from

`EvmStateManagerInterface.shallowCopy`

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.4.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:144
