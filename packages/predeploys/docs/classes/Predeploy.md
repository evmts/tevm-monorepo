**@tevm/predeploys** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > Predeploy

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

[Predeploy.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/predeploys/src/Predeploy.ts#L9)

***

### `abstract` contract

> **`readonly`** **`abstract`** **contract**: `Script`\<`TName`, `THumanReadableAbi`\>

#### Source

[Predeploy.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/predeploys/src/Predeploy.ts#L8)

## Methods

### ethjsAddress()

> **`protected`** **`readonly`** **ethjsAddress**(): `Address`

#### Source

[Predeploy.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/predeploys/src/Predeploy.ts#L10)

***

### predeploy()

> **`readonly`** **predeploy**(): `object`

#### Returns

> ##### address
>
> > **address**: `Address`
>

#### Source

[Predeploy.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/predeploys/src/Predeploy.ts#L11)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
