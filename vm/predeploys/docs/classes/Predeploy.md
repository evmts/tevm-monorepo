[@tevm/predeploys](../README.md) / [Modules](../modules.md) / Predeploy

# Class: Predeploy\<TName, THumanReadableAbi\>

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

[definePredeploy.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/vm/predeploys/src/definePredeploy.ts#L19)

___

### contract

• `Readonly` `Abstract` **contract**: `Script`\<`TName`, `THumanReadableAbi`\>

#### Defined in

[definePredeploy.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/vm/predeploys/src/definePredeploy.ts#L18)

## Methods

### ethjsAddress

▸ **ethjsAddress**(): `Address`

#### Returns

`Address`

#### Defined in

[definePredeploy.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/vm/predeploys/src/definePredeploy.ts#L20)

___

### predeploy

▸ **predeploy**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `address` | `Address` |

#### Defined in

[definePredeploy.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/vm/predeploys/src/definePredeploy.ts#L21)
