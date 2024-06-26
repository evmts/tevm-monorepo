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

[packages/state/src/StateManager.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L10)

***

### getAccountAddresses()

> **getAccountAddresses**: () => \`0x$\{string\}\`[]

Returns contract addresses

#### Returns

\`0x$\{string\}\`[]

#### Defined in

[packages/state/src/StateManager.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L15)

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

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:73

***

### ready()

> **ready**: () => `Promise`\<`true`\>

#### Returns

`Promise`\<`true`\>

#### Defined in

[packages/state/src/StateManager.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L11)

## Methods

### checkpoint()

> **checkpoint**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EvmStateManagerInterface.checkpoint`

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:62

***

### clearCaches()

> **clearCaches**(): `void`

Resets all internal caches

#### Returns

`void`

#### Defined in

[packages/state/src/StateManager.ts:27](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L27)

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

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:61

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

[packages/state/src/StateManager.ts:37](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L37)

***

### deepCopy()

> **deepCopy**(): `Promise`\<[`StateManager`](StateManager.md)\>

Returns a new instance of the ForkStateManager with the same opts and all storage copied over

#### Returns

`Promise`\<[`StateManager`](StateManager.md)\>

#### Defined in

[packages/state/src/StateManager.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L19)

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

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:55

***

### dumpCanonicalGenesis()

> **dumpCanonicalGenesis**(): `Promise`\<[`TevmState`](../type-aliases/TevmState.md)\>

Dumps the state of the state manager as a [TevmState](../type-aliases/TevmState.md)

#### Returns

`Promise`\<[`TevmState`](../type-aliases/TevmState.md)\>

#### Defined in

[packages/state/src/StateManager.ts:23](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L23)

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

#### Defined in

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

#### Defined in

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

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:53

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

#### Defined in

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

#### Defined in

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

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:80

***

### getStateRoot()

> **getStateRoot**(): `Promise`\<`Uint8Array`\>

#### Returns

`Promise`\<`Uint8Array`\>

#### Inherited from

`EvmStateManagerInterface.getStateRoot`

#### Defined in

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

#### Defined in

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

#### Defined in

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

#### Defined in

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

#### Defined in

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

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:60

***

### revert()

> **revert**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

`EvmStateManagerInterface.revert`

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:64

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

[packages/state/src/StateManager.ts:33](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/StateManager.ts#L33)

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

#### Defined in

node\_modules/.pnpm/@ethereumjs+common@4.3.0/node\_modules/@ethereumjs/common/dist/esm/interfaces.d.ts:81
