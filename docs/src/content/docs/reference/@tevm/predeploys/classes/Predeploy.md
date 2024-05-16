---
editUrl: false
next: false
prev: false
title: "Predeploy"
---

Type of predeploy contract for tevm

## Type parameters

• **TName** *extends* `string`

• **THumanReadableAbi** *extends* readonly `string`[]

## Constructors

### new Predeploy()

> **new Predeploy**\<`TName`, `THumanReadableAbi`\>(): [`Predeploy`](/reference/tevm/predeploys/classes/predeploy/)\<`TName`, `THumanReadableAbi`\>

#### Returns

[`Predeploy`](/reference/tevm/predeploys/classes/predeploy/)\<`TName`, `THumanReadableAbi`\>

## Properties

### address

> `abstract` `readonly` **address**: \`0x$\{string\}\`

#### Source

[Predeploy.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/predeploys/src/Predeploy.ts#L9)

***

### contract

> `abstract` `readonly` **contract**: [`Script`](/reference/tevm/contract/type-aliases/script/)\<`TName`, `THumanReadableAbi`\>

#### Source

[Predeploy.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/predeploys/src/Predeploy.ts#L8)

## Methods

### ethjsAddress()

> `protected` `readonly` **ethjsAddress**(): [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Returns

[`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Source

[Predeploy.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/predeploys/src/Predeploy.ts#L10)

***

### predeploy()

> `readonly` **predeploy**(): `object`

#### Returns

`object`

##### address

> **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Source

[Predeploy.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/predeploys/src/Predeploy.ts#L11)
