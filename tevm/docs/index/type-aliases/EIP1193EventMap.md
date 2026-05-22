[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / EIP1193EventMap

# Type Alias: EIP1193EventMap

> **EIP1193EventMap** = `object`

## Methods

### accountsChanged()

> **accountsChanged**(`accounts`): `void`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `accounts` | `` `0x${string}` ``[] |

#### Returns

`void`

***

### chainChanged()

> **chainChanged**(`chainId`): `void`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `chainId` | `string` |

#### Returns

`void`

***

### connect()

> **connect**(`connectInfo`): `void`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `connectInfo` | [`ProviderConnectInfo`](ProviderConnectInfo.md) |

#### Returns

`void`

***

### disconnect()

> **disconnect**(`error`): `void`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | [`ProviderRpcError`](../classes/ProviderRpcError.md) |

#### Returns

`void`

***

### message()

> **message**(`message`): `void`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | [`ProviderMessage`](ProviderMessage.md) |

#### Returns

`void`

***

### newBlock()

> **newBlock**(`block`): `void`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `block` | [`Block`](../../block/classes/Block.md) |

#### Returns

`void`

***

### newLog()

> **newLog**(`log`): `void`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `log` | [`EthjsLog`](../../utils/type-aliases/EthjsLog.md) |

#### Returns

`void`

***

### newPendingTransaction()

> **newPendingTransaction**(`tx`): `void`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `tx` | [`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md) \| [`ImpersonatedTx`](../../txpool/interfaces/ImpersonatedTx.md) |

#### Returns

`void`

***

### newReceipt()

> **newReceipt**(`receipt`): `void`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `receipt` | [`TxReceipt`](../../receipt-manager/type-aliases/TxReceipt.md) |

#### Returns

`void`
