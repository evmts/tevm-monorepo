**@tevm/block** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > BlockHeader

# Class: BlockHeader

An object that represents the block header.

## Constructors

### new BlockHeader(headerData, opts)

> **new BlockHeader**(`headerData`, `opts`): [`BlockHeader`](BlockHeader.md)

This constructor takes the values, validates them, assigns them and freezes the object.

#### Parameters

▪ **headerData**: [`HeaderData`](../interfaces/HeaderData.md)

▪ **opts**: [`BlockOptions`](../interfaces/BlockOptions.md)

#### Returns

#### Deprecated

Use the public static factory methods to assist in creating a Header object from
varying data types. For a default empty header, use [BlockHeader.fromHeaderData](BlockHeader.md#fromheaderdata).

#### Source

[header.ts:148](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L148)

## Properties

### baseFeePerGas

> **`readonly`** **baseFeePerGas**?: `bigint`

#### Source

[header.ts:58](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L58)

***

### blobGasUsed

> **`readonly`** **blobGasUsed**?: `bigint`

#### Source

[header.ts:60](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L60)

***

### cache

> **`protected`** **cache**: `HeaderCache`

#### Source

[header.ts:69](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L69)

***

### coinbase

> **`readonly`** **coinbase**: `Address`

#### Source

[header.ts:45](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L45)

***

### common

> **`readonly`** **common**: `Common`

#### Source

[header.ts:65](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L65)

***

### difficulty

> **`readonly`** **difficulty**: `bigint`

#### Source

[header.ts:50](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L50)

***

### excessBlobGas

> **`readonly`** **excessBlobGas**?: `bigint`

#### Source

[header.ts:61](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L61)

***

### extraData

> **`readonly`** **extraData**: `Uint8Array`

#### Source

[header.ts:55](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L55)

***

### gasLimit

> **`readonly`** **gasLimit**: `bigint`

#### Source

[header.ts:52](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L52)

***

### gasUsed

> **`readonly`** **gasUsed**: `bigint`

#### Source

[header.ts:53](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L53)

***

### keccakFunction

> **`protected`** **keccakFunction**: (`msg`) => `Uint8Array`

#### Parameters

▪ **msg**: `Uint8Array`

#### Source

[header.ts:67](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L67)

***

### logsBloom

> **`readonly`** **logsBloom**: `Uint8Array`

#### Source

[header.ts:49](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L49)

***

### mixHash

> **`readonly`** **mixHash**: `Uint8Array`

#### Source

[header.ts:56](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L56)

***

### nonce

> **`readonly`** **nonce**: `Uint8Array`

#### Source

[header.ts:57](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L57)

***

### number

> **`readonly`** **number**: `bigint`

#### Source

[header.ts:51](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L51)

***

### parentBeaconBlockRoot

> **`readonly`** **parentBeaconBlockRoot**?: `Uint8Array`

#### Source

[header.ts:62](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L62)

***

### parentHash

> **`readonly`** **parentHash**: `Uint8Array`

#### Source

[header.ts:43](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L43)

***

### receiptTrie

> **`readonly`** **receiptTrie**: `Uint8Array`

#### Source

[header.ts:48](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L48)

***

### requestsRoot

> **`readonly`** **requestsRoot**?: `Uint8Array`

#### Source

[header.ts:63](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L63)

***

### stateRoot

> **`readonly`** **stateRoot**: `Uint8Array`

#### Source

[header.ts:46](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L46)

***

### timestamp

> **`readonly`** **timestamp**: `bigint`

#### Source

[header.ts:54](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L54)

***

### transactionsTrie

> **`readonly`** **transactionsTrie**: `Uint8Array`

#### Source

[header.ts:47](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L47)

***

### uncleHash

> **`readonly`** **uncleHash**: `Uint8Array`

#### Source

[header.ts:44](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L44)

***

### withdrawalsRoot

> **`readonly`** **withdrawalsRoot**?: `Uint8Array`

#### Source

[header.ts:59](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L59)

## Accessors

### prevRandao

> **`get`** **prevRandao**(): `Uint8Array`

EIP-4399: After merge to PoS, `mixHash` supplanted as `prevRandao`

#### Source

[header.ts:76](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L76)

## Methods

### \_consensusFormatValidation()

> **`protected`** **\_consensusFormatValidation**(): `void`

Checks static parameters related to consensus algorithm

#### Returns

#### Throws

if any check fails

#### Source

[header.ts:399](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L399)

***

### \_genericFormatValidation()

> **`protected`** **\_genericFormatValidation**(): `void`

Validates correct buffer lengths, throws if invalid.

#### Source

[header.ts:312](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L312)

***

### \_getBlobGasPrice()

> **`private`** **\_getBlobGasPrice**(`excessBlobGas`): `bigint`

Returns the blob gas price depending upon the `excessBlobGas` value

#### Parameters

▪ **excessBlobGas**: `bigint`

#### Source

[header.ts:567](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L567)

***

### \_requireClique()

> **`protected`** **\_requireClique**(`name`): `void`

#### Parameters

▪ **name**: `string`

#### Source

[header.ts:682](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L682)

***

### \_validateDAOExtraData()

> **`protected`** **\_validateDAOExtraData**(): `void`

Validates extra data is DAO_ExtraData for DAO_ForceExtraDataRange blocks after DAO
activation block (see: https://blog.slock.it/hard-fork-specification-24b889e70703)

#### Source

[header.ts:926](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L926)

***

### calcDataFee()

> **calcDataFee**(`numBlobs`): `bigint`

Returns the total fee for blob gas spent for including blobs in block.

#### Parameters

▪ **numBlobs**: `number`

number of blobs in the transaction/block

#### Returns

the total blob gas fee for numBlobs blobs

#### Source

[header.ts:581](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L581)

***

### calcNextBaseFee()

> **calcNextBaseFee**(): `bigint`

Calculates the base fee for a potential next block

#### Source

[header.ts:522](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L522)

***

### calcNextBlobGasPrice()

> **calcNextBlobGasPrice**(): `bigint`

Calculate the blob gas price of the block built on top of this one

#### Returns

The blob gas price

#### Source

[header.ts:607](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L607)

***

### calcNextExcessBlobGas()

> **calcNextExcessBlobGas**(): `bigint`

Calculates the excess blob gas for next (hopefully) post EIP 4844 block.

#### Source

[header.ts:592](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L592)

***

### cliqueEpochTransitionSigners()

> **cliqueEpochTransitionSigners**(): `Address`[]

Returns a list of signers
(only clique PoA, throws otherwise)

This function throws if not called on an epoch
transition block and should therefore be used
in conjunction with [BlockHeader.cliqueIsEpochTransition](BlockHeader.md#cliqueisepochtransition)

#### Source

[header.ts:825](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L825)

***

### cliqueExtraSeal()

> **cliqueExtraSeal**(): `Uint8Array`

Returns extra seal data
(only clique PoA, throws otherwise)

#### Source

[header.ts:795](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L795)

***

### cliqueExtraVanity()

> **cliqueExtraVanity**(): `Uint8Array`

Returns extra vanity data
(only clique PoA, throws otherwise)

#### Source

[header.ts:786](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L786)

***

### cliqueIsEpochTransition()

> **cliqueIsEpochTransition**(): `boolean`

Checks if the block header is an epoch transition
header (only clique PoA, throws otherwise)

#### Source

[header.ts:774](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L774)

***

### cliqueSigHash()

> **cliqueSigHash**(): `Uint8Array`

PoA clique signature hash without the seal.

#### Source

[header.ts:763](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L763)

***

### cliqueSigner()

> **cliqueSigner**(): `Address`

Returns the signer address

#### Source

[header.ts:862](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L862)

***

### cliqueVerifySignature()

> **cliqueVerifySignature**(`signerList`): `boolean`

Verifies the signature of the block (last 65 bytes of extraData field)
(only clique PoA, throws otherwise)

 Method throws if signature is invalid

#### Parameters

▪ **signerList**: `Address`[]

#### Source

[header.ts:850](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L850)

***

### errorStr()

> **errorStr**(): `string`

Return a compact error string representation of the object

#### Source

[header.ts:948](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L948)

***

### ethashCanonicalDifficulty()

> **ethashCanonicalDifficulty**(`parentBlockHeader`): `bigint`

Returns the canonical difficulty for this block.

#### Parameters

▪ **parentBlockHeader**: [`BlockHeader`](BlockHeader.md)

the header from the parent `Block` of this header

#### Source

[header.ts:694](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L694)

***

### getBlobGasPrice()

> **getBlobGasPrice**(): `bigint`

Returns the price per unit of blob gas for a blob transaction in the current/pending block

#### Returns

the price in gwei per unit of blob gas spent

#### Source

[header.ts:556](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L556)

***

### hash()

> **hash**(): `Uint8Array`

Returns the hash of the block header.

#### Source

[header.ts:665](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L665)

***

### isGenesis()

> **isGenesis**(): `boolean`

Checks if the block header is a genesis header.

#### Source

[header.ts:678](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L678)

***

### raw()

> **raw**(): [`BlockHeaderBytes`](../type-aliases/BlockHeaderBytes.md)

Returns a Uint8Array Array of the raw Bytes in this header, in order.

#### Source

[header.ts:614](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L614)

***

### serialize()

> **serialize**(): `Uint8Array`

Returns the rlp encoding of the block header.

#### Source

[header.ts:879](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L879)

***

### toJSON()

> **toJSON**(): [`JsonHeader`](../interfaces/JsonHeader.md)

Returns the block header in JSON format.

#### Source

[header.ts:886](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L886)

***

### validateGasLimit()

> **validateGasLimit**(`parentBlockHeader`): `void`

Validates if the block gasLimit remains in the boundaries set by the protocol.
Throws if out of bounds.

#### Parameters

▪ **parentBlockHeader**: [`BlockHeader`](BlockHeader.md)

the header from the parent `Block` of this header

#### Source

[header.ts:483](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L483)

***

### fromHeaderData()

> **`static`** **fromHeaderData**(`headerData`, `opts`): [`BlockHeader`](BlockHeader.md)

Static constructor to create a block header from a header data dictionary

#### Parameters

▪ **headerData**: [`HeaderData`](../interfaces/HeaderData.md)

▪ **opts**: [`BlockOptions`](../interfaces/BlockOptions.md)

#### Source

[header.ts:90](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L90)

***

### fromRLPSerializedHeader()

> **`static`** **fromRLPSerializedHeader**(`serializedHeaderData`, `opts`): [`BlockHeader`](BlockHeader.md)

Static constructor to create a block header from a RLP-serialized header

#### Parameters

▪ **serializedHeaderData**: `Uint8Array`

▪ **opts**: [`BlockOptions`](../interfaces/BlockOptions.md)

#### Source

[header.ts:100](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L100)

***

### fromValuesArray()

> **`static`** **fromValuesArray**(`values`, `opts`): [`BlockHeader`](BlockHeader.md)

Static constructor to create a block header from an array of Bytes values

#### Parameters

▪ **values**: [`BlockHeaderBytes`](../type-aliases/BlockHeaderBytes.md)

▪ **opts**: [`BlockOptions`](../interfaces/BlockOptions.md)

#### Source

[header.ts:114](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L114)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
