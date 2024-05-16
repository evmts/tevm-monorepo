[**@tevm/predeploys**](../README.md) • **Docs**

***

[@tevm/predeploys](../globals.md) / Predeploy

# Class: `abstract` Predeploy\<TName, THumanReadableAbi\>

Type of predeploy contract for tevm

## Type parameters

• **TName** *extends* `string`

• **THumanReadableAbi** *extends* readonly `string`[]

## Constructors

### new Predeploy()

> **new Predeploy**\<`TName`, `THumanReadableAbi`\>(): [`Predeploy`](Predeploy.md)\<`TName`, `THumanReadableAbi`\>

#### Returns

[`Predeploy`](Predeploy.md)\<`TName`, `THumanReadableAbi`\>

## Properties

### address

> `readonly` `abstract` **address**: \`0x$\{string\}\`

#### Source

[Predeploy.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/predeploys/src/Predeploy.ts#L9)

***

### contract

> `readonly` `abstract` **contract**: `Script`\<`TName`, `THumanReadableAbi`\>

#### Source

[Predeploy.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/predeploys/src/Predeploy.ts#L8)

## Methods

### ethjsAddress()

> `protected` `readonly` **ethjsAddress**(): `Address`

#### Returns

`Address`

#### Source

[Predeploy.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/predeploys/src/Predeploy.ts#L10)

***

### predeploy()

> `readonly` **predeploy**(): `object`

#### Returns

`object`

##### address

> **address**: `Address`

#### Source

[Predeploy.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/predeploys/src/Predeploy.ts#L11)
