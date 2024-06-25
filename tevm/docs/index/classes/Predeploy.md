[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / Predeploy

# Class: Predeploy\<TName, THumanReadableAbi\>

Type of predeploy contract for tevm

## Type Parameters

• **TName** *extends* `string`

• **THumanReadableAbi** *extends* readonly `string`[]

## Constructors

### new Predeploy()

> **new Predeploy**\<`TName`, `THumanReadableAbi`\>(`contract`): [`Predeploy`](Predeploy.md)\<`TName`, `THumanReadableAbi`\>

#### Parameters

• **contract**: [`Contract`](../type-aliases/Contract.md)\<`TName`, `THumanReadableAbi`, \`0x$\{string\}\`, \`0x$\{string\}\`, \`0x$\{string\}\`\>

#### Returns

[`Predeploy`](Predeploy.md)\<`TName`, `THumanReadableAbi`\>

#### Defined in

packages/predeploys/types/Predeploy.d.ts:8

## Properties

### contract

> `readonly` **contract**: [`Contract`](../type-aliases/Contract.md)\<`TName`, `THumanReadableAbi`, \`0x$\{string\}\`, \`0x$\{string\}\`, \`0x$\{string\}\`\>

#### Defined in

packages/predeploys/types/Predeploy.d.ts:7

***

### ethjsAddress()

> `protected` `readonly` **ethjsAddress**: () => [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Defined in

packages/predeploys/types/Predeploy.d.ts:9

***

### predeploy()

> `readonly` **predeploy**: () => `object`

#### Returns

`object`

##### address

> **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Defined in

packages/predeploys/types/Predeploy.d.ts:10
