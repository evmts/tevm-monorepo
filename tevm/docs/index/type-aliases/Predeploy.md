[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / Predeploy

# Type Alias: Predeploy\<TName, THumanReadableAbi\>

> **Predeploy**\<`TName`, `THumanReadableAbi`\> = `object`

Defined in: packages/predeploys/types/Predeploy.d.ts:6

Type of predeploy contract for tevm

## Type Parameters

### TName

`TName` *extends* `string`

### THumanReadableAbi

`THumanReadableAbi` *extends* readonly `string`[]

## Properties

### contract

> `readonly` **contract**: [`Contract`](Contract.md)\<`TName`, `THumanReadableAbi`, [`Address`](Address.md), [`Hex`](Hex.md), [`Hex`](Hex.md)\>

Defined in: packages/predeploys/types/Predeploy.d.ts:7

***

### predeploy()

> `readonly` **predeploy**: () => `object`

Defined in: packages/predeploys/types/Predeploy.d.ts:8

#### Returns

`object`

##### address

> **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)
