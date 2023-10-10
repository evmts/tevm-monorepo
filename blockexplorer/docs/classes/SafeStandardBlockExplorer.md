[@evmts/blockexplorer](../README.md) / [Exports](../modules.md) / SafeStandardBlockExplorer

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

- [constructor](SafeStandardBlockExplorer.md#constructor)

### Properties

- [chainId](SafeStandardBlockExplorer.md#chainid)
- [name](SafeStandardBlockExplorer.md#name)
- [url](SafeStandardBlockExplorer.md#url)
- [ERRORS](SafeStandardBlockExplorer.md#errors)

### Methods

- [getAddressUrl](SafeStandardBlockExplorer.md#getaddressurl)
- [getBlockUrl](SafeStandardBlockExplorer.md#getblockurl)
- [getTxUrl](SafeStandardBlockExplorer.md#gettxurl)

## Constructors

### constructor

• **new SafeStandardBlockExplorer**(`options`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`BlockExplorerOptions`](../interfaces/BlockExplorerOptions.md) | The options for the BlockExplorer. |

#### Defined in

blockExplorer.js:60

## Properties

### chainId

• **chainId**: `number`

#### Defined in

blockExplorer.js:63

___

### name

• **name**: `string`

#### Defined in

blockExplorer.js:61

___

### url

• **url**: `string`

#### Defined in

blockExplorer.js:62

___

### ERRORS

▪ `Static` **ERRORS**: `Object`

Possible Error states of the Effects

Can be used to handle errors in a typesafe way

#### Defined in

blockExplorer.js:50

## Methods

### getAddressUrl

▸ **getAddressUrl**(`address`): `Effect`<`never`, `InvalidUrlError` \| `InvalidAddressError`, `string`\>

Safely retrieves the address URL for a given address.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | \`0x${string}\` | The address. |

#### Returns

`Effect`<`never`, `InvalidUrlError` \| `InvalidAddressError`, `string`\>

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

blockExplorer.js:124

___

### getBlockUrl

▸ **getBlockUrl**(`blockHash`): `Effect`<`never`, `InvalidUrlError` \| `InvalidHexStringError`, `string`\>

Safely retrieves the block URL for a given block hash.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockHash` | \`0x${string}\` | The block hash in hexadecimal format. |

#### Returns

`Effect`<`never`, `InvalidUrlError` \| `InvalidHexStringError`, `string`\>

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

blockExplorer.js:102

___

### getTxUrl

▸ **getTxUrl**(`txId`): `Effect`<`never`, `InvalidUrlError` \| `InvalidHexStringError`, `string`\>

Safely retrieves the transaction URL for a given transaction ID.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `txId` | \`0x${string}\` | The transaction ID in hexadecimal format. |

#### Returns

`Effect`<`never`, `InvalidUrlError` \| `InvalidHexStringError`, `string`\>

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

blockExplorer.js:80
