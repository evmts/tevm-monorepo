[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [utils](../README.md) / Withdrawal

# Class: Withdrawal

Defined in: zevm/npm/zevm/dist/util.d.ts:223

## Constructors

### Constructor

> **new Withdrawal**(`index`, `validatorIndex`, `address`, `amount`): `Withdrawal`

Defined in: zevm/npm/zevm/dist/util.d.ts:228

#### Parameters

##### index

`bigint`

##### validatorIndex

`bigint`

##### address

[`EthjsAddress`](EthjsAddress.md)

##### amount

`bigint`

#### Returns

`Withdrawal`

## Properties

### address

> `readonly` **address**: [`EthjsAddress`](EthjsAddress.md)

Defined in: zevm/npm/zevm/dist/util.d.ts:226

***

### amount

> `readonly` **amount**: `bigint`

Defined in: zevm/npm/zevm/dist/util.d.ts:227

***

### index

> `readonly` **index**: `bigint`

Defined in: zevm/npm/zevm/dist/util.d.ts:224

***

### validatorIndex

> `readonly` **validatorIndex**: `bigint`

Defined in: zevm/npm/zevm/dist/util.d.ts:225

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

##### withdrawalData

[`WithdrawalData`](../type-aliases/WithdrawalData.md)

#### Returns

`Withdrawal`
