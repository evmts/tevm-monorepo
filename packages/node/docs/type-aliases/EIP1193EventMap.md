[**@tevm/node**](../README.md)

***

[@tevm/node](../globals.md) / EIP1193EventMap

# Type Alias: EIP1193EventMap

> **EIP1193EventMap** = `object`

Defined in: [packages/node/src/EIP1193EventEmitterTypes.ts:32](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/EIP1193EventEmitterTypes.ts#L32)

## Methods

### accountsChanged()

> **accountsChanged**(`accounts`): `void`

Defined in: [packages/node/src/EIP1193EventEmitterTypes.ts:33](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/EIP1193EventEmitterTypes.ts#L33)

#### Parameters

##### accounts

`` `0x${string}` ``[]

#### Returns

`void`

***

### chainChanged()

> **chainChanged**(`chainId`): `void`

Defined in: [packages/node/src/EIP1193EventEmitterTypes.ts:34](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/EIP1193EventEmitterTypes.ts#L34)

#### Parameters

##### chainId

`string`

#### Returns

`void`

***

### connect()

> **connect**(`connectInfo`): `void`

Defined in: [packages/node/src/EIP1193EventEmitterTypes.ts:35](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/EIP1193EventEmitterTypes.ts#L35)

#### Parameters

##### connectInfo

[`ProviderConnectInfo`](ProviderConnectInfo.md)

#### Returns

`void`

***

### disconnect()

> **disconnect**(`error`): `void`

Defined in: [packages/node/src/EIP1193EventEmitterTypes.ts:36](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/EIP1193EventEmitterTypes.ts#L36)

#### Parameters

##### error

[`ProviderRpcError`](../classes/ProviderRpcError.md)

#### Returns

`void`

***

### message()

> **message**(`message`): `void`

Defined in: [packages/node/src/EIP1193EventEmitterTypes.ts:37](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/EIP1193EventEmitterTypes.ts#L37)

#### Parameters

##### message

[`ProviderMessage`](ProviderMessage.md)

#### Returns

`void`

***

### newBlock()

> **newBlock**(`block`): `void`

Defined in: [packages/node/src/EIP1193EventEmitterTypes.ts:42](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/EIP1193EventEmitterTypes.ts#L42)

#### Parameters

##### block

`Block`

#### Returns

`void`

***

### newLog()

> **newLog**(`log`): `void`

Defined in: [packages/node/src/EIP1193EventEmitterTypes.ts:43](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/EIP1193EventEmitterTypes.ts#L43)

#### Parameters

##### log

`Log`\<`bigint`, `number`, `false`, `undefined`, `undefined`, `undefined`, `undefined`\>

#### Returns

`void`

***

### newPendingTransaction()

> **newPendingTransaction**(`tx`): `void`

Defined in: [packages/node/src/EIP1193EventEmitterTypes.ts:40](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/EIP1193EventEmitterTypes.ts#L40)

#### Parameters

##### tx

`TypedTransaction` | `ImpersonatedTx`

#### Returns

`void`

***

### newReceipt()

> **newReceipt**(`receipt`): `void`

Defined in: [packages/node/src/EIP1193EventEmitterTypes.ts:41](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/EIP1193EventEmitterTypes.ts#L41)

#### Parameters

##### receipt

`TxReceipt`

#### Returns

`void`
