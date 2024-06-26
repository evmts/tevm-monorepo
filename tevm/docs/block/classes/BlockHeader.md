[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [block](../README.md) / BlockHeader

# Class: BlockHeader

An object that represents the block header.

## Constructors

### new BlockHeader()

> **new BlockHeader**(`headerData`, `opts`): [`BlockHeader`](BlockHeader.md)

This constructor takes the values, validates them, assigns them and freezes the object.

#### Parameters

• **headerData**: [`HeaderData`](../interfaces/HeaderData.md)

• **opts**: [`BlockOptions`](../interfaces/BlockOptions.md)

#### Returns

[`BlockHeader`](BlockHeader.md)

#### Deprecated

Use the public static factory methods to assist in creating a Header object from
varying data types. For a default empty header, use [BlockHeader.fromHeaderData](BlockHeader.md#fromheaderdata).

#### Defined in

packages/block/types/header.d.ts:67

## Properties

### baseFeePerGas?

> `readonly` `optional` **baseFeePerGas**: `bigint`

#### Defined in

packages/block/types/header.d.ts:26

***

### blobGasUsed?

> `readonly` `optional` **blobGasUsed**: `bigint`

#### Defined in

packages/block/types/header.d.ts:28

***

### cache

> `protected` **cache**: `HeaderCache`

#### Defined in

packages/block/types/header.d.ts:34

***

### coinbase

> `readonly` **coinbase**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Defined in

packages/block/types/header.d.ts:13

***

### common

> `readonly` **common**: [`Common`](../../common/type-aliases/Common.md)

#### Defined in

packages/block/types/header.d.ts:32

***

### difficulty

> `readonly` **difficulty**: `bigint`

#### Defined in

packages/block/types/header.d.ts:18

***

### excessBlobGas?

> `readonly` `optional` **excessBlobGas**: `bigint`

#### Defined in

packages/block/types/header.d.ts:29

***

### extraData

> `readonly` **extraData**: `Uint8Array`

#### Defined in

packages/block/types/header.d.ts:23

***

### gasLimit

> `readonly` **gasLimit**: `bigint`

#### Defined in

packages/block/types/header.d.ts:20

***

### gasUsed

> `readonly` **gasUsed**: `bigint`

#### Defined in

packages/block/types/header.d.ts:21

***

### keccakFunction()

> `protected` **keccakFunction**: (`msg`) => `Uint8Array`

#### Parameters

• **msg**: `Uint8Array`

#### Returns

`Uint8Array`

#### Defined in

packages/block/types/header.d.ts:33

***

### logsBloom

> `readonly` **logsBloom**: `Uint8Array`

#### Defined in

packages/block/types/header.d.ts:17

***

### mixHash

> `readonly` **mixHash**: `Uint8Array`

#### Defined in

packages/block/types/header.d.ts:24

***

### nonce

> `readonly` **nonce**: `Uint8Array`

#### Defined in

packages/block/types/header.d.ts:25

***

### number

> `readonly` **number**: `bigint`

#### Defined in

packages/block/types/header.d.ts:19

***

### parentBeaconBlockRoot?

> `readonly` `optional` **parentBeaconBlockRoot**: `Uint8Array`

#### Defined in

packages/block/types/header.d.ts:30

***

### parentHash

> `readonly` **parentHash**: `Uint8Array`

#### Defined in

packages/block/types/header.d.ts:11

***

### receiptTrie

> `readonly` **receiptTrie**: `Uint8Array`

#### Defined in

packages/block/types/header.d.ts:16

***

### requestsRoot?

> `readonly` `optional` **requestsRoot**: `Uint8Array`

#### Defined in

packages/block/types/header.d.ts:31

***

### stateRoot

> `readonly` **stateRoot**: `Uint8Array`

#### Defined in

packages/block/types/header.d.ts:14

***

### timestamp

> `readonly` **timestamp**: `bigint`

#### Defined in

packages/block/types/header.d.ts:22

***

### transactionsTrie

> `readonly` **transactionsTrie**: `Uint8Array`

#### Defined in

packages/block/types/header.d.ts:15

***

### uncleHash

> `readonly` **uncleHash**: `Uint8Array`

#### Defined in

packages/block/types/header.d.ts:12

***

### withdrawalsRoot?

> `readonly` `optional` **withdrawalsRoot**: `Uint8Array`

#### Defined in

packages/block/types/header.d.ts:27

## Accessors

### prevRandao

> `get` **prevRandao**(): `Uint8Array`

EIP-4399: After merge to PoS, `mixHash` supplanted as `prevRandao`

#### Returns

`Uint8Array`

#### Defined in

packages/block/types/header.d.ts:38

## Methods

### \_consensusFormatValidation()

> `protected` **\_consensusFormatValidation**(): `void`

Checks static parameters related to consensus algorithm

#### Returns

`void`

#### Throws

if any check fails

#### Defined in

packages/block/types/header.d.ts:76

***

### \_genericFormatValidation()

> `protected` **\_genericFormatValidation**(): `void`

Validates correct buffer lengths, throws if invalid.

#### Returns

`void`

#### Defined in

packages/block/types/header.d.ts:71

***

### \_requireClique()

> `protected` **\_requireClique**(`name`): `void`

#### Parameters

• **name**: `string`

#### Returns

`void`

#### Defined in

packages/block/types/header.d.ts:126

***

### \_validateDAOExtraData()

> `protected` **\_validateDAOExtraData**(): `void`

Validates extra data is DAO_ExtraData for DAO_ForceExtraDataRange blocks after DAO
activation block (see: https://blog.slock.it/hard-fork-specification-24b889e70703)

#### Returns

`void`

#### Defined in

packages/block/types/header.d.ts:190

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

#### Defined in

packages/block/types/header.d.ts:104

***

### calcNextBaseFee()

> **calcNextBaseFee**(): `bigint`

Calculates the base fee for a potential next block

#### Returns

`bigint`

#### Defined in

packages/block/types/header.d.ts:87

***

### calcNextBlobGasPrice()

> **calcNextBlobGasPrice**(): `bigint`

Calculate the blob gas price of the block built on top of this one

#### Returns

`bigint`

The blob gas price

#### Defined in

packages/block/types/header.d.ts:113

***

### calcNextExcessBlobGas()

> **calcNextExcessBlobGas**(): `bigint`

Calculates the excess blob gas for next (hopefully) post EIP 4844 block.

#### Returns

`bigint`

#### Defined in

packages/block/types/header.d.ts:108

***

### cliqueEpochTransitionSigners()

> **cliqueEpochTransitionSigners**(): [`EthjsAddress`](../../utils/classes/EthjsAddress.md)[]

Returns a list of signers
(only clique PoA, throws otherwise)

This function throws if not called on an epoch
transition block and should therefore be used
in conjunction with [BlockHeader.cliqueIsEpochTransition](BlockHeader.md#cliqueisepochtransition)

#### Returns

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)[]

#### Defined in

packages/block/types/header.d.ts:166

***

### cliqueExtraSeal()

> **cliqueExtraSeal**(): `Uint8Array`

Returns extra seal data
(only clique PoA, throws otherwise)

#### Returns

`Uint8Array`

#### Defined in

packages/block/types/header.d.ts:151

***

### cliqueExtraVanity()

> **cliqueExtraVanity**(): `Uint8Array`

Returns extra vanity data
(only clique PoA, throws otherwise)

#### Returns

`Uint8Array`

#### Defined in

packages/block/types/header.d.ts:146

***

### cliqueIsEpochTransition()

> **cliqueIsEpochTransition**(): `boolean`

Checks if the block header is an epoch transition
header (only clique PoA, throws otherwise)

#### Returns

`boolean`

#### Defined in

packages/block/types/header.d.ts:141

***

### cliqueSigHash()

> **cliqueSigHash**(): `Uint8Array`

PoA clique signature hash without the seal.

#### Returns

`Uint8Array`

#### Defined in

packages/block/types/header.d.ts:136

***

### cliqueSigner()

> **cliqueSigner**(): [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

Returns the signer address

#### Returns

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Defined in

packages/block/types/header.d.ts:177

***

### cliqueVerifySignature()

> **cliqueVerifySignature**(`signerList`): `boolean`

Verifies the signature of the block (last 65 bytes of extraData field)
(only clique PoA, throws otherwise)

 Method throws if signature is invalid

#### Parameters

• **signerList**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)[]

#### Returns

`boolean`

#### Defined in

packages/block/types/header.d.ts:173

***

### errorStr()

> **errorStr**(): `string`

Return a compact error string representation of the object

#### Returns

`string`

#### Defined in

packages/block/types/header.d.ts:194

***

### ethashCanonicalDifficulty()

> **ethashCanonicalDifficulty**(`parentBlockHeader`): `bigint`

Returns the canonical difficulty for this block.

#### Parameters

• **parentBlockHeader**: [`BlockHeader`](BlockHeader.md)

the header from the parent `Block` of this header

#### Returns

`bigint`

#### Defined in

packages/block/types/header.d.ts:132

***

### getBlobGasPrice()

> **getBlobGasPrice**(): `bigint`

Returns the price per unit of blob gas for a blob transaction in the current/pending block

#### Returns

`bigint`

the price in gwei per unit of blob gas spent

#### Defined in

packages/block/types/header.d.ts:92

***

### hash()

> **hash**(): `Uint8Array`

Returns the hash of the block header.

#### Returns

`Uint8Array`

#### Defined in

packages/block/types/header.d.ts:121

***

### isGenesis()

> **isGenesis**(): `boolean`

Checks if the block header is a genesis header.

#### Returns

`boolean`

#### Defined in

packages/block/types/header.d.ts:125

***

### raw()

> **raw**(): [`BlockHeaderBytes`](../type-aliases/BlockHeaderBytes.md)

Returns a Uint8Array Array of the raw Bytes in this header, in order.

#### Returns

[`BlockHeaderBytes`](../type-aliases/BlockHeaderBytes.md)

#### Defined in

packages/block/types/header.d.ts:117

***

### serialize()

> **serialize**(): `Uint8Array`

Returns the rlp encoding of the block header.

#### Returns

`Uint8Array`

#### Defined in

packages/block/types/header.d.ts:181

***

### toJSON()

> **toJSON**(): [`JsonHeader`](../interfaces/JsonHeader.md)

Returns the block header in JSON format.

#### Returns

[`JsonHeader`](../interfaces/JsonHeader.md)

#### Defined in

packages/block/types/header.d.ts:185

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

#### Defined in

packages/block/types/header.d.ts:83

***

### fromHeaderData()

> `static` **fromHeaderData**(`headerData`, `opts`): [`BlockHeader`](BlockHeader.md)

Static constructor to create a block header from a header data dictionary

#### Parameters

• **headerData**: [`HeaderData`](../interfaces/HeaderData.md)

• **opts**: [`BlockOptions`](../interfaces/BlockOptions.md)

#### Returns

[`BlockHeader`](BlockHeader.md)

#### Defined in

packages/block/types/header.d.ts:45

***

### fromRLPSerializedHeader()

> `static` **fromRLPSerializedHeader**(`serializedHeaderData`, `opts`): [`BlockHeader`](BlockHeader.md)

Static constructor to create a block header from a RLP-serialized header

#### Parameters

• **serializedHeaderData**: `Uint8Array`

• **opts**: [`BlockOptions`](../interfaces/BlockOptions.md)

#### Returns

[`BlockHeader`](BlockHeader.md)

#### Defined in

packages/block/types/header.d.ts:52

***

### fromValuesArray()

> `static` **fromValuesArray**(`values`, `opts`): [`BlockHeader`](BlockHeader.md)

Static constructor to create a block header from an array of Bytes values

#### Parameters

• **values**: [`BlockHeaderBytes`](../type-aliases/BlockHeaderBytes.md)

• **opts**: [`BlockOptions`](../interfaces/BlockOptions.md)

#### Returns

[`BlockHeader`](BlockHeader.md)

#### Defined in

packages/block/types/header.d.ts:59
