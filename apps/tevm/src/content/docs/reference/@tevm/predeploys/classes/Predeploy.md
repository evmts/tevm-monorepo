---
editUrl: false
next: false
prev: false
title: "Predeploy"
---

Type of predeploy contract for tevm

## Type parameters

▪ **TName** extends `string`

▪ **THumanReadableAbi** extends readonly `string`[]

## Constructors

### new Predeploy(undefined)

> **new Predeploy**\<`TName`, `THumanReadableAbi`\>(): [`Predeploy`](/reference/tevm/predeploys/classes/predeploy/)\<`TName`, `THumanReadableAbi`\>

## Properties

### `abstract` address

> **`abstract`** **`readonly`** **address**: \`0x${string}\`

#### Source

[Predeploy.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/predeploys/src/Predeploy.ts#L13)

***

### `abstract` contract

> **`abstract`** **`readonly`** **contract**: [`Script`](/reference/tevm/contract/type-aliases/script/)\<`TName`, `THumanReadableAbi`\>

#### Source

[Predeploy.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/predeploys/src/Predeploy.ts#L12)

## Methods

### ethjsAddress()

> **`protected`** **`readonly`** **ethjsAddress**(): `Address`

#### Source

[Predeploy.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/predeploys/src/Predeploy.ts#L14)

***

### predeploy()

> **`readonly`** **predeploy**(): `object`

#### Returns

> ##### address
>
> > **address**: `Address`
>

#### Source

[Predeploy.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/predeploys/src/Predeploy.ts#L15)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
