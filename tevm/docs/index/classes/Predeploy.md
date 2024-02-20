**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [index](../README.md) > Predeploy

# Class: `abstract` Predeploy`<TName, THumanReadableAbi>`

Type of predeploy contract for tevm

## Type parameters

▪ **TName** extends `string`

▪ **THumanReadableAbi** extends readonly `string`[]

## Constructors

### new Predeploy()

> **new Predeploy**\<`TName`, `THumanReadableAbi`\>(): [`Predeploy`](Predeploy.md)\<`TName`, `THumanReadableAbi`\>

## Properties

### `abstract` address

> **`readonly`** **`abstract`** **address**: \`0x${string}\`

#### Source

packages/predeploys/types/Predeploy.d.ts:9

***

### `abstract` contract

> **`readonly`** **`abstract`** **contract**: [`Script`](../type-aliases/Script.md)\<`TName`, `THumanReadableAbi`\>

#### Source

packages/predeploys/types/Predeploy.d.ts:8

***

### ethjsAddress

> **`protected`** **`readonly`** **ethjsAddress**: () => [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Source

packages/predeploys/types/Predeploy.d.ts:10

***

### predeploy

> **`readonly`** **predeploy**: () => `object`

#### Returns

> ##### address
>
> > **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)
>

#### Source

packages/predeploys/types/Predeploy.d.ts:11

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
