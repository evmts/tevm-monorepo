[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / AnvilSetStorageAtParams

# Type Alias: AnvilSetStorageAtParams

> **AnvilSetStorageAtParams** = `object`

Params for `anvil_setStorageAt` handler

## Properties

| Property | Modifier | Type | Description |
| ------ | ------ | ------ | ------ |
| <a id="address"></a> `address` | `readonly` | [`Address`](Address.md) | The address to set the storage for |
| <a id="position"></a> `position` | `readonly` | [`Hex`](Hex.md) \| `BigInt` | The position in storage to set |
| <a id="value"></a> `value` | `readonly` | [`Hex`](Hex.md) \| `BigInt` | The value to set |
