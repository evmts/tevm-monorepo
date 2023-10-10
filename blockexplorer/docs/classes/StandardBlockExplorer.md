[@evmts/blockexplorer](../README.md) / [Exports](../modules.md) / StandardBlockExplorer

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

• **new StandardBlockExplorer**(`options`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`BlockExplorerOptions`](../interfaces/BlockExplorerOptions.md) | The options for the BlockExplorer. |

#### Defined in

blockExplorer.js:182

## Properties

### chainId

• **chainId**: `number`

#### Defined in

blockExplorer.js:185

___

### name

• **name**: `string`

#### Defined in

blockExplorer.js:183

___

### safeBlockExplorer

• **safeBlockExplorer**: [`SafeStandardBlockExplorer`](SafeStandardBlockExplorer.md)

#### Defined in

blockExplorer.js:186

___

### url

• **url**: `string`

#### Defined in

blockExplorer.js:184

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
  if (txUrl instanceof etherscan.ERRORS.InvalidHexStringError) {
    console.log('InvalidHexStringError')
  }
}
 
 console.log('InvalidHexStringError')
 }
 ```

#### Defined in

blockExplorer.js:172

## Methods

### getAddressUrl

▸ **getAddressUrl**(`address`): `string`

Retrieves the address URL for a given address.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | \`0x${string}\` | The address. |

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

blockExplorer.js:239

___

### getBlockUrl

▸ **getBlockUrl**(`blockHash`): `string`

Retrieves the block URL for a given block hash.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockHash` | \`0x${string}\` | The block hash in hexadecimal format. |

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

blockExplorer.js:221

___

### getTxUrl

▸ **getTxUrl**(`txId`): `string`

Retrieves the transaction URL for a given transaction ID.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `txId` | \`0x${string}\` | The transaction ID in hexadecimal format. |

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

blockExplorer.js:203
