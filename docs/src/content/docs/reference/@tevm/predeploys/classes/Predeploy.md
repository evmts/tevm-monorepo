---
editUrl: false
next: false
prev: false
title: "Predeploy"
---

Type of predeploy contract for tevm

## Type parameters

• **TName** extends `string`

• **THumanReadableAbi** extends readonly `string`[]

## Constructors

### new Predeploy(undefined)

> **new Predeploy**\<`TName`, `THumanReadableAbi`\>(): [`Predeploy`](/reference/tevm/predeploys/classes/predeploy/)\<`TName`, `THumanReadableAbi`\>

#### Returns

[`Predeploy`](/reference/tevm/predeploys/classes/predeploy/)\<`TName`, `THumanReadableAbi`\>

## Properties

### address

> **`abstract`** **`readonly`** **address**: ```0x${string}```

#### Source

[Predeploy.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/predeploys/src/Predeploy.ts#L12)

***

### contract

> **`abstract`** **`readonly`** **contract**: [`Script`](/reference/contract/type-aliases/script/)\<`TName`, `THumanReadableAbi`\>

#### Source

[Predeploy.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/predeploys/src/Predeploy.ts#L11)

## Methods

### ethjsAddress()

> **`protected`** **`readonly`** **ethjsAddress**(): [`EthjsAddress`](/reference/utils/classes/ethjsaddress/)

#### Returns

[`EthjsAddress`](/reference/utils/classes/ethjsaddress/)

#### Source

[Predeploy.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/predeploys/src/Predeploy.ts#L13)

***

### predeploy()

> **`readonly`** **predeploy**(): `object`

#### Returns

`object`

##### address

> **address**: [`EthjsAddress`](/reference/utils/classes/ethjsaddress/)

#### Source

[Predeploy.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/predeploys/src/Predeploy.ts#L14)
