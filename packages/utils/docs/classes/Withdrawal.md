[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / Withdrawal

# Class: Withdrawal

Defined in: zevm/npm/zevm/dist/util.d.ts:223

## Constructors

### Constructor

> **new Withdrawal**(`index`, `validatorIndex`, `address`, `amount`): `Withdrawal`

Defined in: zevm/npm/zevm/dist/util.d.ts:228

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

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="address"></a> `address` | `readonly` | [`EthjsAddress`](EthjsAddress.md) | zevm/npm/zevm/dist/util.d.ts:226 |
| <a id="amount"></a> `amount` | `readonly` | `bigint` | zevm/npm/zevm/dist/util.d.ts:227 |
| <a id="index"></a> `index` | `readonly` | `bigint` | zevm/npm/zevm/dist/util.d.ts:224 |
| <a id="validatorindex"></a> `validatorIndex` | `readonly` | `bigint` | zevm/npm/zevm/dist/util.d.ts:225 |

## Methods

### raw()

> **raw**(): `WithdrawalBytes`

Defined in: zevm/npm/zevm/dist/util.d.ts:230

#### Returns

`WithdrawalBytes`

***

### toJSON()

> **toJSON**(): [`JsonRpcWithdrawal`](../interfaces/JsonRpcWithdrawal.md)

Defined in: zevm/npm/zevm/dist/util.d.ts:237

#### Returns

[`JsonRpcWithdrawal`](../interfaces/JsonRpcWithdrawal.md)

***

### toValue()

> **toValue**(): `object`

Defined in: zevm/npm/zevm/dist/util.d.ts:231

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

Defined in: zevm/npm/zevm/dist/util.d.ts:229

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `withdrawalData` | [`WithdrawalData`](../type-aliases/WithdrawalData.md) |

#### Returns

`Withdrawal`
