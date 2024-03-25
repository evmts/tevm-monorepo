[@tevm/block](../README.md) / [Exports](../modules.md) / BlockHeader

# Class: BlockHeader

An object that represents the block header.

## Table of contents

### Constructors

- [constructor](BlockHeader.md#constructor)

### Properties

- [\_getBlobGasPrice](BlockHeader.md#_getblobgasprice)
- [baseFeePerGas](BlockHeader.md#basefeepergas)
- [blobGasUsed](BlockHeader.md#blobgasused)
- [cache](BlockHeader.md#cache)
- [coinbase](BlockHeader.md#coinbase)
- [common](BlockHeader.md#common)
- [difficulty](BlockHeader.md#difficulty)
- [excessBlobGas](BlockHeader.md#excessblobgas)
- [extraData](BlockHeader.md#extradata)
- [gasLimit](BlockHeader.md#gaslimit)
- [gasUsed](BlockHeader.md#gasused)
- [keccakFunction](BlockHeader.md#keccakfunction)
- [logsBloom](BlockHeader.md#logsbloom)
- [mixHash](BlockHeader.md#mixhash)
- [nonce](BlockHeader.md#nonce)
- [number](BlockHeader.md#number)
- [parentBeaconBlockRoot](BlockHeader.md#parentbeaconblockroot)
- [parentHash](BlockHeader.md#parenthash)
- [receiptTrie](BlockHeader.md#receipttrie)
- [stateRoot](BlockHeader.md#stateroot)
- [timestamp](BlockHeader.md#timestamp)
- [transactionsTrie](BlockHeader.md#transactionstrie)
- [uncleHash](BlockHeader.md#unclehash)
- [withdrawalsRoot](BlockHeader.md#withdrawalsroot)

### Accessors

- [prevRandao](BlockHeader.md#prevrandao)

### Methods

- [\_consensusFormatValidation](BlockHeader.md#_consensusformatvalidation)
- [\_genericFormatValidation](BlockHeader.md#_genericformatvalidation)
- [\_requireClique](BlockHeader.md#_requireclique)
- [\_validateDAOExtraData](BlockHeader.md#_validatedaoextradata)
- [calcDataFee](BlockHeader.md#calcdatafee)
- [calcNextBaseFee](BlockHeader.md#calcnextbasefee)
- [calcNextBlobGasPrice](BlockHeader.md#calcnextblobgasprice)
- [calcNextExcessBlobGas](BlockHeader.md#calcnextexcessblobgas)
- [cliqueEpochTransitionSigners](BlockHeader.md#cliqueepochtransitionsigners)
- [cliqueExtraSeal](BlockHeader.md#cliqueextraseal)
- [cliqueExtraVanity](BlockHeader.md#cliqueextravanity)
- [cliqueIsEpochTransition](BlockHeader.md#cliqueisepochtransition)
- [cliqueSigHash](BlockHeader.md#cliquesighash)
- [cliqueSigner](BlockHeader.md#cliquesigner)
- [cliqueVerifySignature](BlockHeader.md#cliqueverifysignature)
- [errorStr](BlockHeader.md#errorstr)
- [ethashCanonicalDifficulty](BlockHeader.md#ethashcanonicaldifficulty)
- [getBlobGasPrice](BlockHeader.md#getblobgasprice)
- [hash](BlockHeader.md#hash)
- [isGenesis](BlockHeader.md#isgenesis)
- [raw](BlockHeader.md#raw)
- [serialize](BlockHeader.md#serialize)
- [toJSON](BlockHeader.md#tojson)
- [validateGasLimit](BlockHeader.md#validategaslimit)
- [fromHeaderData](BlockHeader.md#fromheaderdata)
- [fromRLPSerializedHeader](BlockHeader.md#fromrlpserializedheader)
- [fromValuesArray](BlockHeader.md#fromvaluesarray)

## Constructors

### constructor

• **new BlockHeader**(`headerData`, `opts?`): [`BlockHeader`](BlockHeader.md)

This constructor takes the values, validates them, assigns them and freezes the object.

#### Parameters

| Name | Type |
| :------ | :------ |
| `headerData` | `HeaderData` |
| `opts?` | `BlockOptions` |

#### Returns

[`BlockHeader`](BlockHeader.md)

**`Deprecated`**

Use the public static factory methods to assist in creating a Header object from
varying data types. For a default empty header, use [BlockHeader.fromHeaderData](BlockHeader.md#fromheaderdata).

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:66

## Properties

### \_getBlobGasPrice

• `Private` **\_getBlobGasPrice**: `any`

Returns the blob gas price depending upon the `excessBlobGas` value

**`Param`**

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:96

___

### baseFeePerGas

• `Optional` `Readonly` **baseFeePerGas**: `bigint`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:26

___

### blobGasUsed

• `Optional` `Readonly` **blobGasUsed**: `bigint`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:28

___

### cache

• `Protected` **cache**: `HeaderCache`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:33

___

### coinbase

• `Readonly` **coinbase**: `Address`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:13

___

### common

• `Readonly` **common**: `Common`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:31

___

### difficulty

• `Readonly` **difficulty**: `bigint`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:18

___

### excessBlobGas

• `Optional` `Readonly` **excessBlobGas**: `bigint`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:29

___

### extraData

• `Readonly` **extraData**: `Uint8Array`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:23

___

### gasLimit

• `Readonly` **gasLimit**: `bigint`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:20

___

### gasUsed

• `Readonly` **gasUsed**: `bigint`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:21

___

### keccakFunction

• `Protected` **keccakFunction**: (`msg`: `Uint8Array`) => `Uint8Array`

#### Type declaration

▸ (`msg`): `Uint8Array`

##### Parameters

| Name | Type |
| :------ | :------ |
| `msg` | `Uint8Array` |

##### Returns

`Uint8Array`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:32

___

### logsBloom

• `Readonly` **logsBloom**: `Uint8Array`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:17

___

### mixHash

• `Readonly` **mixHash**: `Uint8Array`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:24

___

### nonce

• `Readonly` **nonce**: `Uint8Array`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:25

___

### number

• `Readonly` **number**: `bigint`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:19

___

### parentBeaconBlockRoot

• `Optional` `Readonly` **parentBeaconBlockRoot**: `Uint8Array`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:30

___

### parentHash

• `Readonly` **parentHash**: `Uint8Array`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:11

___

### receiptTrie

• `Readonly` **receiptTrie**: `Uint8Array`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:16

___

### stateRoot

• `Readonly` **stateRoot**: `Uint8Array`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:14

___

### timestamp

• `Readonly` **timestamp**: `bigint`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:22

___

### transactionsTrie

• `Readonly` **transactionsTrie**: `Uint8Array`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:15

___

### uncleHash

• `Readonly` **uncleHash**: `Uint8Array`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:12

___

### withdrawalsRoot

• `Optional` `Readonly` **withdrawalsRoot**: `Uint8Array`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:27

## Accessors

### prevRandao

• `get` **prevRandao**(): `Uint8Array`

EIP-4399: After merge to PoS, `mixHash` supplanted as `prevRandao`

#### Returns

`Uint8Array`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:37

## Methods

### \_consensusFormatValidation

▸ **_consensusFormatValidation**(): `void`

Checks static parameters related to consensus algorithm

#### Returns

`void`

**`Throws`**

if any check fails

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:75

___

### \_genericFormatValidation

▸ **_genericFormatValidation**(): `void`

Validates correct buffer lengths, throws if invalid.

#### Returns

`void`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:70

___

### \_requireClique

▸ **_requireClique**(`name`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`void`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:125

___

### \_validateDAOExtraData

▸ **_validateDAOExtraData**(): `void`

Validates extra data is DAO_ExtraData for DAO_ForceExtraDataRange blocks after DAO
activation block (see: https://blog.slock.it/hard-fork-specification-24b889e70703)

#### Returns

`void`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:189

___

### calcDataFee

▸ **calcDataFee**(`numBlobs`): `bigint`

Returns the total fee for blob gas spent for including blobs in block.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `numBlobs` | `number` | number of blobs in the transaction/block |

#### Returns

`bigint`

the total blob gas fee for numBlobs blobs

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:103

___

### calcNextBaseFee

▸ **calcNextBaseFee**(): `bigint`

Calculates the base fee for a potential next block

#### Returns

`bigint`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:86

___

### calcNextBlobGasPrice

▸ **calcNextBlobGasPrice**(): `bigint`

Calculate the blob gas price of the block built on top of this one

#### Returns

`bigint`

The blob gas price

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:112

___

### calcNextExcessBlobGas

▸ **calcNextExcessBlobGas**(): `bigint`

Calculates the excess blob gas for next (hopefully) post EIP 4844 block.

#### Returns

`bigint`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:107

___

### cliqueEpochTransitionSigners

▸ **cliqueEpochTransitionSigners**(): `Address`[]

Returns a list of signers
(only clique PoA, throws otherwise)

This function throws if not called on an epoch
transition block and should therefore be used
in conjunction with [BlockHeader.cliqueIsEpochTransition](BlockHeader.md#cliqueisepochtransition)

#### Returns

`Address`[]

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:165

___

### cliqueExtraSeal

▸ **cliqueExtraSeal**(): `Uint8Array`

Returns extra seal data
(only clique PoA, throws otherwise)

#### Returns

`Uint8Array`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:150

___

### cliqueExtraVanity

▸ **cliqueExtraVanity**(): `Uint8Array`

Returns extra vanity data
(only clique PoA, throws otherwise)

#### Returns

`Uint8Array`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:145

___

### cliqueIsEpochTransition

▸ **cliqueIsEpochTransition**(): `boolean`

Checks if the block header is an epoch transition
header (only clique PoA, throws otherwise)

#### Returns

`boolean`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:140

___

### cliqueSigHash

▸ **cliqueSigHash**(): `Uint8Array`

PoA clique signature hash without the seal.

#### Returns

`Uint8Array`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:135

___

### cliqueSigner

▸ **cliqueSigner**(): `Address`

Returns the signer address

#### Returns

`Address`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:176

___

### cliqueVerifySignature

▸ **cliqueVerifySignature**(`signerList`): `boolean`

Verifies the signature of the block (last 65 bytes of extraData field)
(only clique PoA, throws otherwise)

 Method throws if signature is invalid

#### Parameters

| Name | Type |
| :------ | :------ |
| `signerList` | `Address`[] |

#### Returns

`boolean`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:172

___

### errorStr

▸ **errorStr**(): `string`

Return a compact error string representation of the object

#### Returns

`string`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:193

___

### ethashCanonicalDifficulty

▸ **ethashCanonicalDifficulty**(`parentBlockHeader`): `bigint`

Returns the canonical difficulty for this block.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `parentBlockHeader` | [`BlockHeader`](BlockHeader.md) | the header from the parent `Block` of this header |

#### Returns

`bigint`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:131

___

### getBlobGasPrice

▸ **getBlobGasPrice**(): `bigint`

Returns the price per unit of blob gas for a blob transaction in the current/pending block

#### Returns

`bigint`

the price in gwei per unit of blob gas spent

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:91

___

### hash

▸ **hash**(): `Uint8Array`

Returns the hash of the block header.

#### Returns

`Uint8Array`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:120

___

### isGenesis

▸ **isGenesis**(): `boolean`

Checks if the block header is a genesis header.

#### Returns

`boolean`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:124

___

### raw

▸ **raw**(): `BlockHeaderBytes`

Returns a Uint8Array Array of the raw Bytes in this header, in order.

#### Returns

`BlockHeaderBytes`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:116

___

### serialize

▸ **serialize**(): `Uint8Array`

Returns the rlp encoding of the block header.

#### Returns

`Uint8Array`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:180

___

### toJSON

▸ **toJSON**(): `JsonHeader`

Returns the block header in JSON format.

#### Returns

`JsonHeader`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:184

___

### validateGasLimit

▸ **validateGasLimit**(`parentBlockHeader`): `void`

Validates if the block gasLimit remains in the boundaries set by the protocol.
Throws if out of bounds.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `parentBlockHeader` | [`BlockHeader`](BlockHeader.md) | the header from the parent `Block` of this header |

#### Returns

`void`

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:82

___

### fromHeaderData

▸ **fromHeaderData**(`headerData?`, `opts?`): [`BlockHeader`](BlockHeader.md)

Static constructor to create a block header from a header data dictionary

#### Parameters

| Name | Type |
| :------ | :------ |
| `headerData?` | `HeaderData` |
| `opts?` | `BlockOptions` |

#### Returns

[`BlockHeader`](BlockHeader.md)

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:44

___

### fromRLPSerializedHeader

▸ **fromRLPSerializedHeader**(`serializedHeaderData`, `opts?`): [`BlockHeader`](BlockHeader.md)

Static constructor to create a block header from a RLP-serialized header

#### Parameters

| Name | Type |
| :------ | :------ |
| `serializedHeaderData` | `Uint8Array` |
| `opts?` | `BlockOptions` |

#### Returns

[`BlockHeader`](BlockHeader.md)

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:51

___

### fromValuesArray

▸ **fromValuesArray**(`values`, `opts?`): [`BlockHeader`](BlockHeader.md)

Static constructor to create a block header from an array of Bytes values

#### Parameters

| Name | Type |
| :------ | :------ |
| `values` | `BlockHeaderBytes` |
| `opts?` | `BlockOptions` |

#### Returns

[`BlockHeader`](BlockHeader.md)

#### Defined in

node_modules/.pnpm/@ethereumjs+block@5.2.0/node_modules/@ethereumjs/block/dist/esm/header.d.ts:58
