**@tevm/block** • [Readme](../README.md) \| [API](../globals.md)

***

[@tevm/block](../README.md) / BlockHeader

# Class: BlockHeader

An object that represents the block header.

## Constructors

### new BlockHeader(headerData, opts)

> **new BlockHeader**(`headerData`, `opts`?): [`BlockHeader`](BlockHeader.md)

This constructor takes the values, validates them, assigns them and freezes the object.

#### Parameters

• **headerData**: `HeaderData`

• **opts?**: `BlockOptions`

#### Returns

[`BlockHeader`](BlockHeader.md)

#### Deprecated

Use the public static factory methods to assist in creating a Header object from
varying data types. For a default empty header, use [BlockHeader.fromHeaderData](BlockHeader.md#fromheaderdata).

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:66

## Properties

### \_getBlobGasPrice

> **`private`** **\_getBlobGasPrice**: `any`

Returns the blob gas price depending upon the `excessBlobGas` value

#### Param

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:96

***

### baseFeePerGas?

> **`optional`** **`readonly`** **baseFeePerGas**: `bigint`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:26

***

### blobGasUsed?

> **`optional`** **`readonly`** **blobGasUsed**: `bigint`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:28

***

### cache

> **`protected`** **cache**: `HeaderCache`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:33

***

### coinbase

> **`readonly`** **coinbase**: `Address`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:13

***

### common

> **`readonly`** **common**: `Common`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:31

***

### difficulty

> **`readonly`** **difficulty**: `bigint`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:18

***

### excessBlobGas?

> **`optional`** **`readonly`** **excessBlobGas**: `bigint`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:29

***

### extraData

> **`readonly`** **extraData**: `Uint8Array`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:23

***

### gasLimit

> **`readonly`** **gasLimit**: `bigint`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:20

***

### gasUsed

> **`readonly`** **gasUsed**: `bigint`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:21

***

### keccakFunction()

> **`protected`** **keccakFunction**: (`msg`) => `Uint8Array`

#### Parameters

• **msg**: `Uint8Array`

#### Returns

`Uint8Array`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:32

***

### logsBloom

> **`readonly`** **logsBloom**: `Uint8Array`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:17

***

### mixHash

> **`readonly`** **mixHash**: `Uint8Array`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:24

***

### nonce

> **`readonly`** **nonce**: `Uint8Array`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:25

***

### number

> **`readonly`** **number**: `bigint`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:19

***

### parentBeaconBlockRoot?

> **`optional`** **`readonly`** **parentBeaconBlockRoot**: `Uint8Array`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:30

***

### parentHash

> **`readonly`** **parentHash**: `Uint8Array`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:11

***

### receiptTrie

> **`readonly`** **receiptTrie**: `Uint8Array`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:16

***

### stateRoot

> **`readonly`** **stateRoot**: `Uint8Array`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:14

***

### timestamp

> **`readonly`** **timestamp**: `bigint`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:22

***

### transactionsTrie

> **`readonly`** **transactionsTrie**: `Uint8Array`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:15

***

### uncleHash

> **`readonly`** **uncleHash**: `Uint8Array`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:12

***

### withdrawalsRoot?

> **`optional`** **`readonly`** **withdrawalsRoot**: `Uint8Array`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:27

## Accessors

### prevRandao

> **`get`** **prevRandao**(): `Uint8Array`

EIP-4399: After merge to PoS, `mixHash` supplanted as `prevRandao`

#### Returns

`Uint8Array`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:37

## Methods

### \_consensusFormatValidation()

> **`protected`** **\_consensusFormatValidation**(): `void`

Checks static parameters related to consensus algorithm

#### Returns

`void`

#### Throws

if any check fails

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:75

***

### \_genericFormatValidation()

> **`protected`** **\_genericFormatValidation**(): `void`

Validates correct buffer lengths, throws if invalid.

#### Returns

`void`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:70

***

### \_requireClique()

> **`protected`** **\_requireClique**(`name`): `void`

#### Parameters

• **name**: `string`

#### Returns

`void`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:125

***

### \_validateDAOExtraData()

> **`protected`** **\_validateDAOExtraData**(): `void`

Validates extra data is DAO_ExtraData for DAO_ForceExtraDataRange blocks after DAO
activation block (see: https://blog.slock.it/hard-fork-specification-24b889e70703)

#### Returns

`void`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:189

***

### calcDataFee()

> **calcDataFee**(`numBlobs`): `bigint`

Returns the total fee for blob gas spent for including blobs in block.

#### Parameters

• **numBlobs**: `number`

number of blobs in the transaction/block

#### Returns

`bigint`

the total blob gas fee for numBlobs blobs

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:103

***

### calcNextBaseFee()

> **calcNextBaseFee**(): `bigint`

Calculates the base fee for a potential next block

#### Returns

`bigint`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:86

***

### calcNextBlobGasPrice()

> **calcNextBlobGasPrice**(): `bigint`

Calculate the blob gas price of the block built on top of this one

#### Returns

`bigint`

The blob gas price

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:112

***

### calcNextExcessBlobGas()

> **calcNextExcessBlobGas**(): `bigint`

Calculates the excess blob gas for next (hopefully) post EIP 4844 block.

#### Returns

`bigint`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:107

***

### cliqueEpochTransitionSigners()

> **cliqueEpochTransitionSigners**(): `Address`[]

Returns a list of signers
(only clique PoA, throws otherwise)

This function throws if not called on an epoch
transition block and should therefore be used
in conjunction with [BlockHeader.cliqueIsEpochTransition](BlockHeader.md#cliqueisepochtransition)

#### Returns

`Address`[]

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:165

***

### cliqueExtraSeal()

> **cliqueExtraSeal**(): `Uint8Array`

Returns extra seal data
(only clique PoA, throws otherwise)

#### Returns

`Uint8Array`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:150

***

### cliqueExtraVanity()

> **cliqueExtraVanity**(): `Uint8Array`

Returns extra vanity data
(only clique PoA, throws otherwise)

#### Returns

`Uint8Array`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:145

***

### cliqueIsEpochTransition()

> **cliqueIsEpochTransition**(): `boolean`

Checks if the block header is an epoch transition
header (only clique PoA, throws otherwise)

#### Returns

`boolean`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:140

***

### cliqueSigHash()

> **cliqueSigHash**(): `Uint8Array`

PoA clique signature hash without the seal.

#### Returns

`Uint8Array`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:135

***

### cliqueSigner()

> **cliqueSigner**(): `Address`

Returns the signer address

#### Returns

`Address`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:176

***

### cliqueVerifySignature()

> **cliqueVerifySignature**(`signerList`): `boolean`

Verifies the signature of the block (last 65 bytes of extraData field)
(only clique PoA, throws otherwise)

 Method throws if signature is invalid

#### Parameters

• **signerList**: `Address`[]

#### Returns

`boolean`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:172

***

### errorStr()

> **errorStr**(): `string`

Return a compact error string representation of the object

#### Returns

`string`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:193

***

### ethashCanonicalDifficulty()

> **ethashCanonicalDifficulty**(`parentBlockHeader`): `bigint`

Returns the canonical difficulty for this block.

#### Parameters

• **parentBlockHeader**: [`BlockHeader`](BlockHeader.md)

the header from the parent `Block` of this header

#### Returns

`bigint`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:131

***

### getBlobGasPrice()

> **getBlobGasPrice**(): `bigint`

Returns the price per unit of blob gas for a blob transaction in the current/pending block

#### Returns

`bigint`

the price in gwei per unit of blob gas spent

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:91

***

### hash()

> **hash**(): `Uint8Array`

Returns the hash of the block header.

#### Returns

`Uint8Array`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:120

***

### isGenesis()

> **isGenesis**(): `boolean`

Checks if the block header is a genesis header.

#### Returns

`boolean`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:124

***

### raw()

> **raw**(): `BlockHeaderBytes`

Returns a Uint8Array Array of the raw Bytes in this header, in order.

#### Returns

`BlockHeaderBytes`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:116

***

### serialize()

> **serialize**(): `Uint8Array`

Returns the rlp encoding of the block header.

#### Returns

`Uint8Array`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:180

***

### toJSON()

> **toJSON**(): `JsonHeader`

Returns the block header in JSON format.

#### Returns

`JsonHeader`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:184

***

### validateGasLimit()

> **validateGasLimit**(`parentBlockHeader`): `void`

Validates if the block gasLimit remains in the boundaries set by the protocol.
Throws if out of bounds.

#### Parameters

• **parentBlockHeader**: [`BlockHeader`](BlockHeader.md)

the header from the parent `Block` of this header

#### Returns

`void`

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:82

***

### fromHeaderData()

> **`static`** **fromHeaderData**(`headerData`?, `opts`?): [`BlockHeader`](BlockHeader.md)

Static constructor to create a block header from a header data dictionary

#### Parameters

• **headerData?**: `HeaderData`

• **opts?**: `BlockOptions`

#### Returns

[`BlockHeader`](BlockHeader.md)

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:44

***

### fromRLPSerializedHeader()

> **`static`** **fromRLPSerializedHeader**(`serializedHeaderData`, `opts`?): [`BlockHeader`](BlockHeader.md)

Static constructor to create a block header from a RLP-serialized header

#### Parameters

• **serializedHeaderData**: `Uint8Array`

• **opts?**: `BlockOptions`

#### Returns

[`BlockHeader`](BlockHeader.md)

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:51

***

### fromValuesArray()

> **`static`** **fromValuesArray**(`values`, `opts`?): [`BlockHeader`](BlockHeader.md)

Static constructor to create a block header from an array of Bytes values

#### Parameters

• **values**: `BlockHeaderBytes`

• **opts?**: `BlockOptions`

#### Returns

[`BlockHeader`](BlockHeader.md)

#### Source

node\_modules/.pnpm/@ethereumjs+block@5.2.0/node\_modules/@ethereumjs/block/dist/esm/header.d.ts:58
