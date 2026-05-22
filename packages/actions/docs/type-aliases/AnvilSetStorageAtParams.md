[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / AnvilSetStorageAtParams

# Type Alias: AnvilSetStorageAtParams

> **AnvilSetStorageAtParams** = `object`

Defined in: [packages/actions/src/anvil/AnvilParams.ts:160](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilParams.ts#L160)

Params for `anvil_setStorageAt` handler

## Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="address"></a> `address` | `readonly` | [`Address`](Address.md) | The address to set the storage for | [packages/actions/src/anvil/AnvilParams.ts:164](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilParams.ts#L164) |
| <a id="position"></a> `position` | `readonly` | [`Hex`](Hex.md) \| `BigInt` | The position in storage to set | [packages/actions/src/anvil/AnvilParams.ts:168](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilParams.ts#L168) |
| <a id="value"></a> `value` | `readonly` | [`Hex`](Hex.md) \| `BigInt` | The value to set | [packages/actions/src/anvil/AnvilParams.ts:172](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilParams.ts#L172) |
