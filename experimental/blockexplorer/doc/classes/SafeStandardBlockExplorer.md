**@tevm/blockexplorer** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > SafeStandardBlockExplorer

# Class: SafeStandardBlockExplorer

Utility for interacting with a block explorer via [Effect.ts](

Initiate with any compliant block explorer for utils like generating the url for a transaction, block, or address.

## Example

```ts
import { Effect } from 'effect'
const etherscan = new SafeStandardBlockExplorer(
  name: 'Etherscan',
  url: 'https://etherscan.io',
  chainId: 1,
)
const txUrlEffect = etherscan.getTxUrl('0x1234')
````

## Constructors

### new SafeStandardBlockExplorer(options)

> **new SafeStandardBlockExplorer**(`options`): [`SafeStandardBlockExplorer`](SafeStandardBlockExplorer.md)

#### Parameters

▪ **options**: [`BlockExplorerOptions`](../interfaces/BlockExplorerOptions.md)

The options for the BlockExplorer.

#### Source

[blockExplorer.js:60](https://github.com/evmts/tevm-monorepo/blob/main/experimental/blockexplorer/src/blockExplorer.js#L60)

## Properties

### chainId

> **chainId**: `number`

#### Source

[blockExplorer.js:63](https://github.com/evmts/tevm-monorepo/blob/main/experimental/blockexplorer/src/blockExplorer.js#L63)

***

### name

> **name**: `string`

#### Source

[blockExplorer.js:61](https://github.com/evmts/tevm-monorepo/blob/main/experimental/blockexplorer/src/blockExplorer.js#L61)

***

### url

> **url**: `string`

#### Source

[blockExplorer.js:62](https://github.com/evmts/tevm-monorepo/blob/main/experimental/blockexplorer/src/blockExplorer.js#L62)

***

### ERRORS

> **`static`** **ERRORS**: `Object`

Possible Error states of the Effects

Can be used to handle errors in a typesafe way

#### Source

[blockExplorer.js:50](https://github.com/evmts/tevm-monorepo/blob/main/experimental/blockexplorer/src/blockExplorer.js#L50)

## Methods

### getAddressUrl()

> **getAddressUrl**(`address`): `Effect`\<`never`, `InvalidUrlError` \| `InvalidAddressError`, `string`\>

Safely retrieves the address URL for a given address.

#### Parameters

▪ **address**: \`0x${string}\`

The address.

#### Returns

An effect that resolves to the address URL.

#### Example

```ts
const etherscan = new StandardBlockExplorer(
  name: 'Etherscan',
  url: 'https://etherscan.io',
  chainId: 1,
)
const addressUrl = etherscan.getAddressUrl('0x1234')
```

#### Source

[blockExplorer.js:129](https://github.com/evmts/tevm-monorepo/blob/main/experimental/blockexplorer/src/blockExplorer.js#L129)

***

### getBlockUrl()

> **getBlockUrl**(`blockHash`): `Effect`\<`never`, `InvalidUrlError` \| `InvalidBytesError`, `string`\>

Safely retrieves the block URL for a given block hash.

#### Parameters

▪ **blockHash**: \`0x${string}\`

The block hash in hexadecimal format.

#### Returns

An effect that resolves to the block URL.

#### Example

```ts
const etherscan = new StandardBlockExplorer(
name: 'Etherscan',
url: 'https://etherscan.io',
chainId: 1,
)
const blockUrl = etherscan.getBlockUrl('0x1234')
```

#### Source

[blockExplorer.js:104](https://github.com/evmts/tevm-monorepo/blob/main/experimental/blockexplorer/src/blockExplorer.js#L104)

***

### getTxUrl()

> **getTxUrl**(`txId`): `Effect`\<`never`, `InvalidUrlError` \| `InvalidBytesError`, `string`\>

Safely retrieves the transaction URL for a given transaction ID.

#### Parameters

▪ **txId**: \`0x${string}\`

The transaction ID in hexadecimal format.

#### Returns

An effect that resolves to the transaction URL.

#### Example

```ts
const etherscan = new StandardBlockExplorer(
 name: 'Etherscan',
 url: 'https://etherscan.io',
 chainId: 1,
 )
 const txUrl = etherscan.getTxUrl('0x1234')
 ```

#### Source

[blockExplorer.js:80](https://github.com/evmts/tevm-monorepo/blob/main/experimental/blockexplorer/src/blockExplorer.js#L80)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
