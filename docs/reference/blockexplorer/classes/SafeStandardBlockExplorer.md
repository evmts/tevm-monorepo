[@evmts/blockexplorer](/reference/blockexplorer/README.md) / [Exports](/reference/blockexplorer/modules.md) / SafeStandardBlockExplorer

# Class: SafeStandardBlockExplorer

Utility for interacting with a block explorer via [Effect.ts](

Initiate with any compliant block explorer for utils like generating the url for a transaction, block, or address.

**`Example`**

```ts
import { Effect } from 'effect'
const etherscan = new SafeStandardBlockExplorer(
  name: 'Etherscan',
  url: 'https://etherscan.io',
  chainId: 1,
)
const txUrlEffect = etherscan.getTxUrl('0x1234')
````

## Table of contents

### Constructors

- [constructor](/reference/blockexplorer/classes/SafeStandardBlockExplorer.md#constructor)

### Properties

- [chainId](/reference/blockexplorer/classes/SafeStandardBlockExplorer.md#chainid)
- [name](/reference/blockexplorer/classes/SafeStandardBlockExplorer.md#name)
- [url](/reference/blockexplorer/classes/SafeStandardBlockExplorer.md#url)
- [ERRORS](/reference/blockexplorer/classes/SafeStandardBlockExplorer.md#errors)

### Methods

- [getAddressUrl](/reference/blockexplorer/classes/SafeStandardBlockExplorer.md#getaddressurl)
- [getBlockUrl](/reference/blockexplorer/classes/SafeStandardBlockExplorer.md#getblockurl)
- [getTxUrl](/reference/blockexplorer/classes/SafeStandardBlockExplorer.md#gettxurl)

## Constructors

### constructor

• **new SafeStandardBlockExplorer**(`options`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`BlockExplorerOptions`](/reference/blockexplorer/interfaces/BlockExplorerOptions.md) | The options for the BlockExplorer. |

#### Defined in

[blockExplorer.js:60](https://github.com/evmts/evmts-monorepo/blob/main/blockexplorer/src/blockExplorer.js#L60)

## Properties

### chainId

• **chainId**: `number`

#### Defined in

[blockExplorer.js:63](https://github.com/evmts/evmts-monorepo/blob/main/blockexplorer/src/blockExplorer.js#L63)

___

### name

• **name**: `string`

#### Defined in

[blockExplorer.js:61](https://github.com/evmts/evmts-monorepo/blob/main/blockexplorer/src/blockExplorer.js#L61)

___

### url

• **url**: `string`

#### Defined in

[blockExplorer.js:62](https://github.com/evmts/evmts-monorepo/blob/main/blockexplorer/src/blockExplorer.js#L62)

___

### ERRORS

▪ `Static` **ERRORS**: `Object`

Possible Error states of the Effects

Can be used to handle errors in a typesafe way

#### Defined in

[blockExplorer.js:50](https://github.com/evmts/evmts-monorepo/blob/main/blockexplorer/src/blockExplorer.js#L50)

## Methods

### getAddressUrl

▸ **getAddressUrl**(`address`): `Effect`<`never`, `InvalidAddressError` \| `InvalidUrlError`, `string`\>

Safely retrieves the address URL for a given address.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | \`0x${string}\` | The address. |

#### Returns

`Effect`<`never`, `InvalidAddressError` \| `InvalidUrlError`, `string`\>

An effect that resolves to the address URL.

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

[blockExplorer.js:129](https://github.com/evmts/evmts-monorepo/blob/main/blockexplorer/src/blockExplorer.js#L129)

___

### getBlockUrl

▸ **getBlockUrl**(`blockHash`): `Effect`<`never`, `InvalidBytesError` \| `InvalidUrlError`, `string`\>

Safely retrieves the block URL for a given block hash.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockHash` | \`0x${string}\` | The block hash in hexadecimal format. |

#### Returns

`Effect`<`never`, `InvalidBytesError` \| `InvalidUrlError`, `string`\>

An effect that resolves to the block URL.

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

[blockExplorer.js:104](https://github.com/evmts/evmts-monorepo/blob/main/blockexplorer/src/blockExplorer.js#L104)

___

### getTxUrl

▸ **getTxUrl**(`txId`): `Effect`<`never`, `InvalidBytesError` \| `InvalidUrlError`, `string`\>

Safely retrieves the transaction URL for a given transaction ID.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `txId` | \`0x${string}\` | The transaction ID in hexadecimal format. |

#### Returns

`Effect`<`never`, `InvalidBytesError` \| `InvalidUrlError`, `string`\>

An effect that resolves to the transaction URL.

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

[blockExplorer.js:80](https://github.com/evmts/evmts-monorepo/blob/main/blockexplorer/src/blockExplorer.js#L80)
