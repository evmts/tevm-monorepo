[**@tevm/block**](../README.md) • **Docs**

***

[@tevm/block](../globals.md) / BlockHeader

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

[header.ts:148](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L148)

## Properties

### baseFeePerGas?

> `readonly` `optional` **baseFeePerGas**: `bigint`

#### Defined in

[header.ts:58](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L58)

***

### blobGasUsed?

> `readonly` `optional` **blobGasUsed**: `bigint`

#### Defined in

[header.ts:60](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L60)

***

### cache

> `protected` **cache**: `HeaderCache`

#### Defined in

[header.ts:69](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L69)

***

### coinbase

> `readonly` **coinbase**: `Address`

#### Defined in

[header.ts:45](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L45)

***

### common

> `readonly` **common**: `Common`

#### Defined in

[header.ts:65](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L65)

***

### difficulty

> `readonly` **difficulty**: `bigint`

#### Defined in

[header.ts:50](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L50)

***

### excessBlobGas?

> `readonly` `optional` **excessBlobGas**: `bigint`

#### Defined in

[header.ts:61](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L61)

***

### extraData

> `readonly` **extraData**: `Uint8Array`

#### Defined in

[header.ts:55](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L55)

***

### gasLimit

> `readonly` **gasLimit**: `bigint`

#### Defined in

[header.ts:52](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L52)

***

### gasUsed

> `readonly` **gasUsed**: `bigint`

#### Defined in

[header.ts:53](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L53)

***

### keccakFunction()

> `protected` **keccakFunction**: (`msg`) => `Uint8Array`

#### Parameters

• **msg**: `Uint8Array`

#### Returns

`Uint8Array`

#### Defined in

[header.ts:67](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L67)

***

### logsBloom

> `readonly` **logsBloom**: `Uint8Array`

#### Defined in

[header.ts:49](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L49)

***

### mixHash

> `readonly` **mixHash**: `Uint8Array`

#### Defined in

[header.ts:56](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L56)

***

### nonce

> `readonly` **nonce**: `Uint8Array`

#### Defined in

[header.ts:57](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L57)

***

### number

> `readonly` **number**: `bigint`

#### Defined in

[header.ts:51](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L51)

***

### parentBeaconBlockRoot?

> `readonly` `optional` **parentBeaconBlockRoot**: `Uint8Array`

#### Defined in

[header.ts:62](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L62)

***

### parentHash

> `readonly` **parentHash**: `Uint8Array`

#### Defined in

[header.ts:43](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L43)

***

### receiptTrie

> `readonly` **receiptTrie**: `Uint8Array`

#### Defined in

[header.ts:48](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L48)

***

### requestsRoot?

> `readonly` `optional` **requestsRoot**: `Uint8Array`

#### Defined in

[header.ts:63](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L63)

***

### stateRoot

> `readonly` **stateRoot**: `Uint8Array`

#### Defined in

[header.ts:46](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L46)

***

### timestamp

> `readonly` **timestamp**: `bigint`

#### Defined in

[header.ts:54](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L54)

***

### transactionsTrie

> `readonly` **transactionsTrie**: `Uint8Array`

#### Defined in

[header.ts:47](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L47)

***

### uncleHash

> `readonly` **uncleHash**: `Uint8Array`

#### Defined in

[header.ts:44](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L44)

***

### withdrawalsRoot?

> `readonly` `optional` **withdrawalsRoot**: `Uint8Array`

#### Defined in

[header.ts:59](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L59)

## Accessors

### prevRandao

> `get` **prevRandao**(): `Uint8Array`

EIP-4399: After merge to PoS, `mixHash` supplanted as `prevRandao`

#### Returns

`Uint8Array`

#### Defined in

[header.ts:76](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L76)

## Methods

### \_consensusFormatValidation()

> `protected` **\_consensusFormatValidation**(): `void`

Checks static parameters related to consensus algorithm

#### Returns

`void`

#### Throws

if any check fails

#### Defined in

[header.ts:397](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L397)

***

### \_genericFormatValidation()

> `protected` **\_genericFormatValidation**(): `void`

Validates correct buffer lengths, throws if invalid.

#### Returns

`void`

#### Defined in

[header.ts:310](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L310)

***

### \_requireClique()

> `protected` **\_requireClique**(`name`): `void`

#### Parameters

• **name**: `string`

#### Returns

`void`

#### Defined in

[header.ts:680](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L680)

***

### \_validateDAOExtraData()

> `protected` **\_validateDAOExtraData**(): `void`

Validates extra data is DAO_ExtraData for DAO_ForceExtraDataRange blocks after DAO
activation block (see: https://blog.slock.it/hard-fork-specification-24b889e70703)

#### Returns

`void`

#### Defined in

[header.ts:924](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L924)

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

[header.ts:579](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L579)

***

### calcNextBaseFee()

> **calcNextBaseFee**(): `bigint`

Calculates the base fee for a potential next block

#### Returns

`bigint`

#### Defined in

[header.ts:520](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L520)

***

### calcNextBlobGasPrice()

> **calcNextBlobGasPrice**(): `bigint`

Calculate the blob gas price of the block built on top of this one

#### Returns

`bigint`

The blob gas price

#### Defined in

[header.ts:605](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L605)

***

### calcNextExcessBlobGas()

> **calcNextExcessBlobGas**(): `bigint`

Calculates the excess blob gas for next (hopefully) post EIP 4844 block.

#### Returns

`bigint`

#### Defined in

[header.ts:590](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L590)

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

#### Defined in

[header.ts:823](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L823)

***

### cliqueExtraSeal()

> **cliqueExtraSeal**(): `Uint8Array`

Returns extra seal data
(only clique PoA, throws otherwise)

#### Returns

`Uint8Array`

#### Defined in

[header.ts:793](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L793)

***

### cliqueExtraVanity()

> **cliqueExtraVanity**(): `Uint8Array`

Returns extra vanity data
(only clique PoA, throws otherwise)

#### Returns

`Uint8Array`

#### Defined in

[header.ts:784](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L784)

***

### cliqueIsEpochTransition()

> **cliqueIsEpochTransition**(): `boolean`

Checks if the block header is an epoch transition
header (only clique PoA, throws otherwise)

#### Returns

`boolean`

#### Defined in

[header.ts:772](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L772)

***

### cliqueSigHash()

> **cliqueSigHash**(): `Uint8Array`

PoA clique signature hash without the seal.

#### Returns

`Uint8Array`

#### Defined in

[header.ts:761](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L761)

***

### cliqueSigner()

> **cliqueSigner**(): `Address`

Returns the signer address

#### Returns

`Address`

#### Defined in

[header.ts:860](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L860)

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

#### Defined in

[header.ts:848](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L848)

***

### errorStr()

> **errorStr**(): `string`

Return a compact error string representation of the object

#### Returns

`string`

#### Defined in

[header.ts:946](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L946)

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

[header.ts:692](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L692)

***

### getBlobGasPrice()

> **getBlobGasPrice**(): `bigint`

Returns the price per unit of blob gas for a blob transaction in the current/pending block

#### Returns

`bigint`

the price in gwei per unit of blob gas spent

#### Defined in

[header.ts:554](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L554)

***

### hash()

> **hash**(): `Uint8Array`

Returns the hash of the block header.

#### Returns

`Uint8Array`

#### Defined in

[header.ts:663](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L663)

***

### isGenesis()

> **isGenesis**(): `boolean`

Checks if the block header is a genesis header.

#### Returns

`boolean`

#### Defined in

[header.ts:676](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L676)

***

### raw()

> **raw**(): [`BlockHeaderBytes`](../type-aliases/BlockHeaderBytes.md)

Returns a Uint8Array Array of the raw Bytes in this header, in order.

#### Returns

[`BlockHeaderBytes`](../type-aliases/BlockHeaderBytes.md)

#### Defined in

[header.ts:612](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L612)

***

### serialize()

> **serialize**(): `Uint8Array`

Returns the rlp encoding of the block header.

#### Returns

`Uint8Array`

#### Defined in

[header.ts:877](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L877)

***

### toJSON()

> **toJSON**(): [`JsonHeader`](../interfaces/JsonHeader.md)

Returns the block header in JSON format.

#### Returns

[`JsonHeader`](../interfaces/JsonHeader.md)

#### Defined in

[header.ts:884](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L884)

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

[header.ts:481](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L481)

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

[header.ts:90](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L90)

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

[header.ts:100](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L100)

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

[header.ts:114](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/block/src/header.ts#L114)
