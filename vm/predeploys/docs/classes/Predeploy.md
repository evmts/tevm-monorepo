**@tevm/predeploys** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > Predeploy

# Class: `abstract` Predeploy`<TName, THumanReadableAbi>`

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

[definePredeploy.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/vm/predeploys/src/definePredeploy.ts#L19)

***

### `abstract` contract

> **`readonly`** **`abstract`** **contract**: `Script`\<`TName`, `THumanReadableAbi`\>

#### Source

[definePredeploy.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/vm/predeploys/src/definePredeploy.ts#L18)

## Methods

### ethjsAddress()

> **`protected`** **`readonly`** **ethjsAddress**(): `Address`

#### Source

[definePredeploy.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/vm/predeploys/src/definePredeploy.ts#L20)

***

### predeploy()

> **`readonly`** **predeploy**(): `object`

#### Returns

> ##### address
>
> > **address**: `Address`
>

#### Source

[definePredeploy.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/vm/predeploys/src/definePredeploy.ts#L21)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
