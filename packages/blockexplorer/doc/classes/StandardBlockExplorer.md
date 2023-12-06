[@tevm/blockexplorer](../README.md) / [Exports](../modules.md) / StandardBlockExplorer

# Class: StandardBlockExplorer

Type of utility for interacting with a block explorer

Initiate with any compliant block explorer for utils like generating the url for a transaction, block, or address.

**`Example`**

```ts
const etherscan: BlockExplorer = new StandardBlockExplorer(
  name: 'Etherscan',
  url: 'https://etherscan.io',
  chainId: 1,
)
const txUrl = etherscan.getTxUrl('0x1234')
```

## Table of contents

### Constructors

- [constructor](StandardBlockExplorer.md#constructor)

### Properties

- [chainId](StandardBlockExplorer.md#chainid)
- [name](StandardBlockExplorer.md#name)
- [safeBlockExplorer](StandardBlockExplorer.md#safeblockexplorer)
- [url](StandardBlockExplorer.md#url)
- [ERRORS](StandardBlockExplorer.md#errors)

### Methods

- [getAddressUrl](StandardBlockExplorer.md#getaddressurl)
- [getBlockUrl](StandardBlockExplorer.md#getblockurl)
- [getTxUrl](StandardBlockExplorer.md#gettxurl)

## Constructors

### constructor

• **new StandardBlockExplorer**(`options`): [`StandardBlockExplorer`](StandardBlockExplorer.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`BlockExplorerOptions`](../interfaces/BlockExplorerOptions.md) | The options for the BlockExplorer. |

#### Returns

[`StandardBlockExplorer`](StandardBlockExplorer.md)

#### Defined in

[blockExplorer.js:190](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockexplorer/src/blockExplorer.js#L190)

## Properties

### chainId

• **chainId**: `number`

#### Defined in

[blockExplorer.js:193](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockexplorer/src/blockExplorer.js#L193)

___

### name

• **name**: `string`

#### Defined in

[blockExplorer.js:191](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockexplorer/src/blockExplorer.js#L191)

___

### safeBlockExplorer

• **safeBlockExplorer**: [`SafeStandardBlockExplorer`](SafeStandardBlockExplorer.md)

#### Defined in

[blockExplorer.js:194](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockexplorer/src/blockExplorer.js#L194)

___

### url

• **url**: `string`

#### Defined in

[blockExplorer.js:192](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockexplorer/src/blockExplorer.js#L192)

___

### ERRORS

▪ `Static` **ERRORS**: `Object`

Possible Error states of the Effects

Can be used to handle errors in a typesafe way

**`Example`**

```ts
let url: string
try {
  url = etherscan.getTxUrl('0x1234')
} catch(e) {
  if (txUrl instanceof etherscan.ERRORS.InvalidBytesError) {
    console.log('InvalidBytesError')
  }
}

 console.log('InvalidBytesError')
 }
 ```

#### Defined in

[blockExplorer.js:180](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockexplorer/src/blockExplorer.js#L180)

## Methods

### getAddressUrl

▸ **getAddressUrl**(`address`): `string`

Retrieves the address URL for a given address.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | \`0x$\{string}\` | The address. |

#### Returns

`string`

The address URL.

**`Example`**

```ts
const etherscan = new StandardBlockExplorer(
 name: 'Etherscan',
 url: 'https://etherscan.io',
 chainId: 1,
 )
 const addressUrl = etherscan.getAddressUrl('0x1234')
 ```

#### Defined in

[blockExplorer.js:247](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockexplorer/src/blockExplorer.js#L247)

___

### getBlockUrl

▸ **getBlockUrl**(`blockHash`): `string`

Retrieves the block URL for a given block hash.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockHash` | \`0x$\{string}\` | The block hash in hexadecimal format. |

#### Returns

`string`

The block URL.

**`Example`**

```ts
const etherscan = new StandardBlockExplorer(
  name: 'Etherscan',
  url: 'https://etherscan.io',
  chainId: 1,
)
const blockUrl = etherscan.getBlockUrl('0x1234')
```

#### Defined in

[blockExplorer.js:229](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockexplorer/src/blockExplorer.js#L229)

___

### getTxUrl

▸ **getTxUrl**(`txId`): `string`

Retrieves the transaction URL for a given transaction ID.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `txId` | \`0x$\{string}\` | The transaction ID in hexadecimal format. |

#### Returns

`string`

The transaction URL.

**`Example`**

```ts
const etherscan = new StandardBlockExplorer(
  name: 'Etherscan',
  url: 'https://etherscan.io',
  chainId: 1,
)
const txUrl = etherscan.getTxUrl('0x1234')
```

#### Defined in

[blockExplorer.js:211](https://github.com/evmts/tevm-monorepo/blob/main/packages/blockexplorer/src/blockExplorer.js#L211)
