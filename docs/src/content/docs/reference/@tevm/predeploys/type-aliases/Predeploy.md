---
editUrl: false
next: false
prev: false
title: "Predeploy"
---

> **Predeploy**\<`TName`, `THumanReadableAbi`\>: `object`

Type of predeploy contract for tevm

## Type Parameters

• **TName** *extends* `string`

• **THumanReadableAbi** *extends* readonly `string`[]

## Type declaration

### contract

> `readonly` **contract**: [`Contract`](/reference/tevm/contract/type-aliases/contract/)\<`TName`, `THumanReadableAbi`, [`Address`](/reference/tevm/utils/type-aliases/address/), [`Hex`](/reference/tevm/utils/type-aliases/hex/), [`Hex`](/reference/tevm/utils/type-aliases/hex/)\>

### predeploy()

> `readonly` **predeploy**: () => `object`

#### Returns

`object`

##### address

> **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

## Defined in

[Predeploy.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/predeploys/src/Predeploy.ts#L7)
