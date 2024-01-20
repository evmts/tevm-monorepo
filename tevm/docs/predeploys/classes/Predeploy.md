**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [predeploys](../README.md) > Predeploy

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

vm/predeploys/dist/index.d.ts:10

***

### `abstract` contract

> **`readonly`** **`abstract`** **contract**: [`Script`](../../contract/type-aliases/Script.md)\<`TName`, `THumanReadableAbi`\>

#### Source

vm/predeploys/dist/index.d.ts:9

***

### ethjsAddress

> **`protected`** **`readonly`** **ethjsAddress**: () => `Address`

#### Source

vm/predeploys/dist/index.d.ts:11

***

### predeploy

> **`readonly`** **predeploy**: () => `object`

#### Returns

> ##### address
>
> > **address**: `Address`
>

#### Source

vm/predeploys/dist/index.d.ts:12

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
