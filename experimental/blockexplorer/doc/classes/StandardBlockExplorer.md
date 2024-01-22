**@tevm/blockexplorer** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > StandardBlockExplorer

# Class: StandardBlockExplorer

Type of utility for interacting with a block explorer

Initiate with any compliant block explorer for utils like generating the url for a transaction, block, or address.

## Example

```ts
const etherscan: BlockExplorer = new StandardBlockExplorer(
  name: 'Etherscan',
  url: 'https://etherscan.io',
  chainId: 1,
)
const txUrl = etherscan.getTxUrl('0x1234')
```

## Constructors

### new StandardBlockExplorer(options)

> **new StandardBlockExplorer**(`options`): [`StandardBlockExplorer`](StandardBlockExplorer.md)

#### Parameters

▪ **options**: [`BlockExplorerOptions`](../interfaces/BlockExplorerOptions.md)

The options for the BlockExplorer.

#### Source

[blockExplorer.js:190](https://github.com/evmts/tevm-monorepo/blob/main/experimental/blockexplorer/src/blockExplorer.js#L190)

## Properties

### chainId

> **chainId**: `number`

#### Source

[blockExplorer.js:193](https://github.com/evmts/tevm-monorepo/blob/main/experimental/blockexplorer/src/blockExplorer.js#L193)

***

### name

> **name**: `string`

#### Source

[blockExplorer.js:191](https://github.com/evmts/tevm-monorepo/blob/main/experimental/blockexplorer/src/blockExplorer.js#L191)

***

### safeBlockExplorer

> **safeBlockExplorer**: [`SafeStandardBlockExplorer`](SafeStandardBlockExplorer.md)

#### Source

[blockExplorer.js:194](https://github.com/evmts/tevm-monorepo/blob/main/experimental/blockexplorer/src/blockExplorer.js#L194)

***

### url

> **url**: `string`

#### Source

[blockExplorer.js:192](https://github.com/evmts/tevm-monorepo/blob/main/experimental/blockexplorer/src/blockExplorer.js#L192)

***

### ERRORS

> **`static`** **ERRORS**: `Object`

Possible Error states of the Effects

Can be used to handle errors in a typesafe way

#### Example

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

#### Source

[blockExplorer.js:180](https://github.com/evmts/tevm-monorepo/blob/main/experimental/blockexplorer/src/blockExplorer.js#L180)

## Methods

### getAddressUrl()

> **getAddressUrl**(`address`): `string`

Retrieves the address URL for a given address.

#### Parameters

▪ **address**: \`0x${string}\`

The address.

#### Returns

The address URL.

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

[blockExplorer.js:247](https://github.com/evmts/tevm-monorepo/blob/main/experimental/blockexplorer/src/blockExplorer.js#L247)

***

### getBlockUrl()

> **getBlockUrl**(`blockHash`): `string`

Retrieves the block URL for a given block hash.

#### Parameters

▪ **blockHash**: \`0x${string}\`

The block hash in hexadecimal format.

#### Returns

The block URL.

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

[blockExplorer.js:229](https://github.com/evmts/tevm-monorepo/blob/main/experimental/blockexplorer/src/blockExplorer.js#L229)

***

### getTxUrl()

> **getTxUrl**(`txId`): `string`

Retrieves the transaction URL for a given transaction ID.

#### Parameters

▪ **txId**: \`0x${string}\`

The transaction ID in hexadecimal format.

#### Returns

The transaction URL.

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

[blockExplorer.js:211](https://github.com/evmts/tevm-monorepo/blob/main/experimental/blockexplorer/src/blockExplorer.js#L211)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
