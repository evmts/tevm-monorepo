---
editUrl: false
next: false
prev: false
title: "Predeploy"
---

Type of predeploy contract for tevm

## Type Parameters

• **TName** *extends* `string`

• **THumanReadableAbi** *extends* readonly `string`[]

## Constructors

### new Predeploy()

> **new Predeploy**\<`TName`, `THumanReadableAbi`\>(`contract`): [`Predeploy`](/reference/tevm/predeploys/classes/predeploy/)\<`TName`, `THumanReadableAbi`\>

#### Parameters

• **contract**: [`Contract`](/reference/tevm/contract/type-aliases/contract/)\<`TName`, `THumanReadableAbi`, \`0x$\{string\}\`, \`0x$\{string\}\`, \`0x$\{string\}\`\>

#### Returns

[`Predeploy`](/reference/tevm/predeploys/classes/predeploy/)\<`TName`, `THumanReadableAbi`\>

#### Defined in

[Predeploy.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/predeploys/src/Predeploy.ts#L8)

## Properties

### contract

> `readonly` **contract**: [`Contract`](/reference/tevm/contract/type-aliases/contract/)\<`TName`, `THumanReadableAbi`, \`0x$\{string\}\`, \`0x$\{string\}\`, \`0x$\{string\}\`\>

#### Defined in

[Predeploy.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/predeploys/src/Predeploy.ts#L8)

## Methods

### ethjsAddress()

> `protected` `readonly` **ethjsAddress**(): [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Returns

[`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Defined in

[Predeploy.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/predeploys/src/Predeploy.ts#L9)

***

### predeploy()

> `readonly` **predeploy**(): `object`

#### Returns

`object`

##### address

> **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Defined in

[Predeploy.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/predeploys/src/Predeploy.ts#L10)
