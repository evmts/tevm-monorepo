[@tevm/predeploys](../README.md) / [Modules](../modules.md) / Predeploy

# Class: Predeploy\<TName, THumanReadableAbi, TBytecode, TDeployedBytecode\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `TName` | extends `string` |
| `THumanReadableAbi` | extends readonly `string`[] |
| `TBytecode` | extends \`0x$\{string}\` \| `undefined` |
| `TDeployedBytecode` | extends \`0x$\{string}\` \| `undefined` |

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

• **new Predeploy**\<`TName`, `THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`\>(): [`Predeploy`](Predeploy.md)\<`TName`, `THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TName` | extends `string` |
| `THumanReadableAbi` | extends readonly `string`[] |
| `TBytecode` | extends `undefined` \| \`0x$\{string}\` |
| `TDeployedBytecode` | extends `undefined` \| \`0x$\{string}\` |

#### Returns

[`Predeploy`](Predeploy.md)\<`TName`, `THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`\>

## Properties

### address

• `Readonly` `Abstract` **address**: \`0x$\{string}\`

#### Defined in

[definePredeploy.ts:28](https://github.com/evmts/tevm-monorepo/blob/main/vm/predeploys/src/definePredeploy.ts#L28)

___

### contract

• `Readonly` `Abstract` **contract**: `TevmContract`\<`TName`, `THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`\>

#### Defined in

[definePredeploy.ts:22](https://github.com/evmts/tevm-monorepo/blob/main/vm/predeploys/src/definePredeploy.ts#L22)

## Methods

### ethjsAddress

▸ **ethjsAddress**(): `Address`

#### Returns

`Address`

#### Defined in

[definePredeploy.ts:29](https://github.com/evmts/tevm-monorepo/blob/main/vm/predeploys/src/definePredeploy.ts#L29)

___

### predeploy

▸ **predeploy**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `address` | `Address` |

#### Defined in

[definePredeploy.ts:30](https://github.com/evmts/tevm-monorepo/blob/main/vm/predeploys/src/definePredeploy.ts#L30)
