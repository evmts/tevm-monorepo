[tevm](../README.md) / [Modules](../modules.md) / [index](../modules/index.md) / Predeploy

# Class: Predeploy\<TName, THumanReadableAbi\>

[index](../modules/index.md).Predeploy

Type of predeploy contract for tevm

## Type parameters

| Name | Type |
| :------ | :------ |
| `TName` | extends `string` |
| `THumanReadableAbi` | extends readonly `string`[] |

## Table of contents

### Constructors

- [constructor](index.Predeploy.md#constructor)

### Properties

- [address](index.Predeploy.md#address)
- [contract](index.Predeploy.md#contract)
- [ethjsAddress](index.Predeploy.md#ethjsaddress)
- [predeploy](index.Predeploy.md#predeploy)

## Constructors

### constructor

• **new Predeploy**\<`TName`, `THumanReadableAbi`\>(): [`Predeploy`](index.Predeploy.md)\<`TName`, `THumanReadableAbi`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TName` | extends `string` |
| `THumanReadableAbi` | extends readonly `string`[] |

#### Returns

[`Predeploy`](index.Predeploy.md)\<`TName`, `THumanReadableAbi`\>

## Properties

### address

• `Readonly` `Abstract` **address**: \`0x$\{string}\`

#### Defined in

evmts-monorepo/packages/predeploys/types/Predeploy.d.ts:9

___

### contract

• `Readonly` `Abstract` **contract**: [`Script`](../modules/index.md#script)\<`TName`, `THumanReadableAbi`\>

#### Defined in

evmts-monorepo/packages/predeploys/types/Predeploy.d.ts:8

___

### ethjsAddress

• `Protected` `Readonly` **ethjsAddress**: () => [`EthjsAddress`](utils.EthjsAddress.md)

#### Type declaration

▸ (): [`EthjsAddress`](utils.EthjsAddress.md)

##### Returns

[`EthjsAddress`](utils.EthjsAddress.md)

#### Defined in

evmts-monorepo/packages/predeploys/types/Predeploy.d.ts:10

___

### predeploy

• `Readonly` **predeploy**: () => \{ `address`: [`EthjsAddress`](utils.EthjsAddress.md)  }

#### Type declaration

▸ (): `Object`

##### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `address` | [`EthjsAddress`](utils.EthjsAddress.md) |

#### Defined in

evmts-monorepo/packages/predeploys/types/Predeploy.d.ts:11
