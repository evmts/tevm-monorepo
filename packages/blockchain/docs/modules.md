[@tevm/blockchain](README.md) / Exports

# @tevm/blockchain

## Table of contents

### Enumerations

- [Event](enums/Event.md)

### Classes

- [Chain](classes/Chain.md)
- [ReceiptsManager](classes/ReceiptsManager.md)
- [TevmBlock](classes/TevmBlock.md)
- [TevmBlockchain](classes/TevmBlockchain.md)

### Functions

- [createBlockchain](modules.md#createblockchain)

## Functions

### createBlockchain

▸ **createBlockchain**(`options`): `Promise`\<[`TevmBlockchain`](classes/TevmBlockchain.md)\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `options` | `Object` | `undefined` |
| `options.blockTag` | `bigint` \| `BlockTag` \| \`0x$\{string}\` | `'latest'` |
| `options.common` | `Common` | `undefined` |
| `options.forkUrl` | `undefined` \| `string` | `undefined` |

#### Returns

`Promise`\<[`TevmBlockchain`](classes/TevmBlockchain.md)\>

#### Defined in

[packages/blockchain/src/createBlockchain.js:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockchain/src/createBlockchain.js#L14)
