[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [utils](../README.md) / Withdrawal

# Class: Withdrawal

## Constructors

### Constructor

> **new Withdrawal**(`index`, `validatorIndex`, `address`, `amount`): `Withdrawal`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `index` | `bigint` |
| `validatorIndex` | `bigint` |
| `address` | [`EthjsAddress`](EthjsAddress.md) |
| `amount` | `bigint` |

#### Returns

`Withdrawal`

## Properties

| Property | Modifier | Type |
| ------ | ------ | ------ |
| <a id="address"></a> `address` | `readonly` | [`EthjsAddress`](EthjsAddress.md) |
| <a id="amount"></a> `amount` | `readonly` | `bigint` |
| <a id="index"></a> `index` | `readonly` | `bigint` |
| <a id="validatorindex"></a> `validatorIndex` | `readonly` | `bigint` |

## Methods

### raw()

> **raw**(): `WithdrawalBytes`

#### Returns

`WithdrawalBytes`

***

### toJSON()

> **toJSON**(): [`JsonRpcWithdrawal`](../interfaces/JsonRpcWithdrawal.md)

#### Returns

[`JsonRpcWithdrawal`](../interfaces/JsonRpcWithdrawal.md)

***

### toValue()

> **toValue**(): `object`

#### Returns

`object`

##### address

> **address**: `Uint8Array`

##### amount

> **amount**: `bigint`

##### index

> **index**: `bigint`

##### validatorIndex

> **validatorIndex**: `bigint`

***

### fromWithdrawalData()

> `static` **fromWithdrawalData**(`withdrawalData`): `Withdrawal`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `withdrawalData` | [`WithdrawalData`](../type-aliases/WithdrawalData.md) |

#### Returns

`Withdrawal`
