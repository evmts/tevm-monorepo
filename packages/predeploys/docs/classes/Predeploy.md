[@tevm/predeploys](../README.md) / [Exports](../modules.md) / Predeploy

# Class: Predeploy\<TName, THumanReadableAbi\>

Type of predeploy contract for tevm

## Type parameters

| Name | Type |
| :------ | :------ |
| `TName` | extends `string` |
| `THumanReadableAbi` | extends readonly `string`[] |

## Table of contents

### Constructors

- [constructor](Predeploy.md#constructor)

### Properties

- [address](Predeploy.md#address)
- [contract](Predeploy.md#contract)

### Methods

- [ethjsAddress](Predeploy.md#ethjsaddress)
- [predeploy](Predeploy.md#predeploy)

## Constructors

### constructor

• **new Predeploy**\<`TName`, `THumanReadableAbi`\>(): [`Predeploy`](Predeploy.md)\<`TName`, `THumanReadableAbi`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TName` | extends `string` |
| `THumanReadableAbi` | extends readonly `string`[] |

#### Returns

[`Predeploy`](Predeploy.md)\<`TName`, `THumanReadableAbi`\>

## Properties

### address

• `Readonly` `Abstract` **address**: \`0x$\{string}\`

#### Defined in

[Predeploy.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/predeploys/src/Predeploy.ts#L13)

___

### contract

• `Readonly` `Abstract` **contract**: `Script`\<`TName`, `THumanReadableAbi`\>

#### Defined in

[Predeploy.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/predeploys/src/Predeploy.ts#L12)

## Methods

### ethjsAddress

▸ **ethjsAddress**(): `Address`

#### Returns

`Address`

#### Defined in

[Predeploy.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/predeploys/src/Predeploy.ts#L14)

___

### predeploy

▸ **predeploy**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `address` | `Address` |

#### Defined in

[Predeploy.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/predeploys/src/Predeploy.ts#L15)
