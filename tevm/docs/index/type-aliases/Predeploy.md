[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / Predeploy

# Type Alias: Predeploy\<TName, THumanReadableAbi\>

> **Predeploy**\<`TName`, `THumanReadableAbi`\> = `object`

Type of predeploy contract for tevm

## Type Parameters

| Type Parameter |
| ------ |
| `TName` *extends* `string` |
| `THumanReadableAbi` *extends* readonly `string`[] |

## Properties

| Property | Modifier | Type |
| ------ | ------ | ------ |
| <a id="contract"></a> `contract` | `readonly` | [`Contract`](Contract.md)\<`TName`, `THumanReadableAbi`, [`Address`](Address.md), [`Hex`](Hex.md), [`Hex`](Hex.md)\> |
| <a id="predeploy"></a> `predeploy` | `readonly` | () => `object` |
