[**@tevm/predeploys**](../README.md) • **Docs**

***

[@tevm/predeploys](../globals.md) / Predeploy

# Class: Predeploy\<TName, THumanReadableAbi\>

Type of predeploy contract for tevm

## Type Parameters

• **TName** *extends* `string`

• **THumanReadableAbi** *extends* readonly `string`[]

## Constructors

### new Predeploy()

> **new Predeploy**\<`TName`, `THumanReadableAbi`\>(`contract`): [`Predeploy`](Predeploy.md)\<`TName`, `THumanReadableAbi`\>

#### Parameters

• **contract**: `Contract`\<`TName`, `THumanReadableAbi`, \`0x$\{string\}\`, \`0x$\{string\}\`, \`0x$\{string\}\`\>

#### Returns

[`Predeploy`](Predeploy.md)\<`TName`, `THumanReadableAbi`\>

#### Defined in

[Predeploy.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/predeploys/src/Predeploy.ts#L8)

## Properties

### contract

> `readonly` **contract**: `Contract`\<`TName`, `THumanReadableAbi`, \`0x$\{string\}\`, \`0x$\{string\}\`, \`0x$\{string\}\`\>

#### Defined in

[Predeploy.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/predeploys/src/Predeploy.ts#L8)

## Methods

### ethjsAddress()

> `protected` `readonly` **ethjsAddress**(): `Address`

#### Returns

`Address`

#### Defined in

[Predeploy.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/predeploys/src/Predeploy.ts#L9)

***

### predeploy()

> `readonly` **predeploy**(): `object`

#### Returns

`object`

##### address

> **address**: `Address`

#### Defined in

[Predeploy.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/predeploys/src/Predeploy.ts#L10)
