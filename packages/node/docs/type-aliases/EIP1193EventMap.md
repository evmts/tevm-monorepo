[**@tevm/node**](../README.md)

***

[@tevm/node](../globals.md) / EIP1193EventMap

# Type Alias: EIP1193EventMap

> **EIP1193EventMap** = `object`

Defined in: [packages/node/src/EIP1193EventEmitterTypes.ts:34](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/EIP1193EventEmitterTypes.ts#L34)

## Methods

### accountsChanged()

> **accountsChanged**(`accounts`): `void`

Defined in: [packages/node/src/EIP1193EventEmitterTypes.ts:35](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/EIP1193EventEmitterTypes.ts#L35)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `accounts` | `` `0x${string}` ``[] |

#### Returns

`void`

***

### chainChanged()

> **chainChanged**(`chainId`): `void`

Defined in: [packages/node/src/EIP1193EventEmitterTypes.ts:36](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/EIP1193EventEmitterTypes.ts#L36)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `chainId` | `string` |

#### Returns

`void`

***

### connect()

> **connect**(`connectInfo`): `void`

Defined in: [packages/node/src/EIP1193EventEmitterTypes.ts:37](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/EIP1193EventEmitterTypes.ts#L37)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `connectInfo` | [`ProviderConnectInfo`](ProviderConnectInfo.md) |

#### Returns

`void`

***

### disconnect()

> **disconnect**(`error`): `void`

Defined in: [packages/node/src/EIP1193EventEmitterTypes.ts:38](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/EIP1193EventEmitterTypes.ts#L38)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | [`ProviderRpcError`](../classes/ProviderRpcError.md) |

#### Returns

`void`

***

### message()

> **message**(`message`): `void`

Defined in: [packages/node/src/EIP1193EventEmitterTypes.ts:39](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/EIP1193EventEmitterTypes.ts#L39)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | [`ProviderMessage`](ProviderMessage.md) |

#### Returns

`void`

***

### newBlock()

> **newBlock**(`block`): `void`

Defined in: [packages/node/src/EIP1193EventEmitterTypes.ts:44](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/EIP1193EventEmitterTypes.ts#L44)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `block` | `Block` |

#### Returns

`void`

***

### newLog()

> **newLog**(`log`): `void`

Defined in: [packages/node/src/EIP1193EventEmitterTypes.ts:45](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/EIP1193EventEmitterTypes.ts#L45)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `log` | `ReceiptLog` |

#### Returns

`void`

***

### newPendingTransaction()

> **newPendingTransaction**(`tx`): `void`

Defined in: [packages/node/src/EIP1193EventEmitterTypes.ts:42](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/EIP1193EventEmitterTypes.ts#L42)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `tx` | `TypedTransaction` \| `ImpersonatedTx` |

#### Returns

`void`

***

### newReceipt()

> **newReceipt**(`receipt`): `void`

Defined in: [packages/node/src/EIP1193EventEmitterTypes.ts:43](https://github.com/evmts/tevm-monorepo/blob/main/packages/node/src/EIP1193EventEmitterTypes.ts#L43)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `receipt` | `TxReceipt` |

#### Returns

`void`
