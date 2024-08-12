[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / Predeploy

# Type Alias: Predeploy\<TName, THumanReadableAbi\>

> **Predeploy**\<`TName`, `THumanReadableAbi`\>: `object`

Type of predeploy contract for tevm

## Type Parameters

• **TName** *extends* `string`

• **THumanReadableAbi** *extends* readonly `string`[]

## Type declaration

### contract

> `readonly` **contract**: [`Contract`](Contract.md)\<`TName`, `THumanReadableAbi`, [`Address`](Address.md), [`Hex`](Hex.md), [`Hex`](Hex.md)\>

### predeploy()

> `readonly` **predeploy**: () => `object`

#### Returns

`object`

##### address

> **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

## Defined in

packages/predeploys/types/Predeploy.d.ts:6
