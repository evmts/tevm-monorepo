[**@tevm/block**](../README.md)

***

[@tevm/block](../globals.md) / BlockHeader

# Class: BlockHeader

Defined in: [packages/block/src/header.ts:37](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L37)

An object that represents the block header.

## Constructors

### Constructor

> **new BlockHeader**(`headerData`, `opts`): `BlockHeader`

Defined in: [packages/block/src/header.ts:143](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L143)

This constructor takes the values, validates them, assigns them and freezes the object.

#### Parameters

##### headerData

[`HeaderData`](../interfaces/HeaderData.md)

##### opts

[`BlockOptions`](../interfaces/BlockOptions.md)

#### Returns

`BlockHeader`

#### Deprecated

Use the public static factory methods to assist in creating a Header object from
varying data types. For a default empty header, use [BlockHeader.fromHeaderData](#fromheaderdata).

## Properties

### baseFeePerGas?

> `readonly` `optional` **baseFeePerGas?**: `bigint`

Defined in: [packages/block/src/header.ts:53](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L53)

***

### blobGasUsed?

> `readonly` `optional` **blobGasUsed?**: `bigint`

Defined in: [packages/block/src/header.ts:55](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L55)

***

### cache

> `protected` **cache**: `HeaderCache`

Defined in: [packages/block/src/header.ts:64](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L64)

***

### coinbase

> `readonly` **coinbase**: `Address`

Defined in: [packages/block/src/header.ts:40](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L40)

***

### common

> `readonly` **common**: `object`

Defined in: [packages/block/src/header.ts:60](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L60)

#### blockExplorers?

> `optional` **blockExplorers?**: `object`

Collection of block explorers

##### Index Signature

\[`key`: `string`\]: `ChainBlockExplorer`

##### blockExplorers.default

> **default**: `ChainBlockExplorer`

#### blockTime?

> `optional` **blockTime?**: `number`

Block time in milliseconds.

#### contracts?

> `optional` **contracts?**: `object`

Collection of contracts

##### Index Signature

\[`key`: `string`\]: `ChainContract` \| \{\[`sourceId`: `number`\]: `ChainContract` \| `undefined`; \} \| `undefined`

##### contracts.ensRegistry?

> `optional` **ensRegistry?**: `ChainContract`

##### contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver?**: `ChainContract`

##### contracts.erc6492Verifier?

> `optional` **erc6492Verifier?**: `ChainContract`

##### contracts.multicall3?

> `optional` **multicall3?**: `ChainContract`

#### copy

> **copy**: () => \{ blockExplorers?: \{ \[key: string\]: ChainBlockExplorer; default: ChainBlockExplorer; \} \| undefined; blockTime?: number \| undefined; contracts?: \{ ...; \} \| undefined; ... 16 more ...; copy: () =\> ...; \}

##### Returns

\{ blockExplorers?: \{ \[key: string\]: ChainBlockExplorer; default: ChainBlockExplorer; \} \| undefined; blockTime?: number \| undefined; contracts?: \{ ...; \} \| undefined; ... 16 more ...; copy: () =\> ...; \}

#### ~~custom?~~

> `optional` **custom?**: `Record`\<`string`, `unknown`\>

Custom chain data.

##### Deprecated

use `.extend` instead.

#### ensTlds?

> `optional` **ensTlds?**: readonly `string`[]

Collection of ENS TLDs for the chain.

#### ethjsCommon

> **ethjsCommon**: `Common`

#### experimental\_preconfirmationTime?

> `optional` **experimental\_preconfirmationTime?**: `number`

Preconfirmation time in milliseconds.

#### extendSchema?

> `optional` **extendSchema?**: `Record`\<`string`, `unknown`\>

Extend schema.

#### fees?

> `optional` **fees?**: `ChainFees`\<`ChainFormatters` \| `undefined`\>

Modifies how fees are derived.

#### formatters?

> `optional` **formatters?**: `ChainFormatters`

Modifies how data is formatted and typed (e.g. blocks and transactions)

#### id

> **id**: `number`

ID in number form

#### name

> **name**: `string`

Human-readable name

#### nativeCurrency

> **nativeCurrency**: `ChainNativeCurrency`

Currency used by chain

#### prepareTransactionRequest?

> `optional` **prepareTransactionRequest?**: `PrepareTransactionRequestFn` \| \[`PrepareTransactionRequestFn`, `object`\]

Function to prepare a transaction request. Runs before the transaction is filled.

#### rpcUrls

> **rpcUrls**: `object`

Collection of RPC endpoints

##### Index Signature

\[`key`: `string`\]: `ChainRpcUrls`

##### rpcUrls.default

> **default**: `ChainRpcUrls`

#### serializers?

> `optional` **serializers?**: `ChainSerializers`\<`ChainFormatters` \| `undefined`, `TransactionSerializable`\>

Modifies how data is serialized (e.g. transactions).

#### sourceId?

> `optional` **sourceId?**: `number`

Source Chain ID (ie. the L1 chain)

#### testnet?

> `optional` **testnet?**: `boolean`

Flag for test networks

#### verifyHash?

> `optional` **verifyHash?**: `ChainVerifyHashFn`

Chain-specific signature verification.

***

### difficulty

> `readonly` **difficulty**: `bigint`

Defined in: [packages/block/src/header.ts:45](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L45)

***

### excessBlobGas?

> `readonly` `optional` **excessBlobGas?**: `bigint`

Defined in: [packages/block/src/header.ts:56](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L56)

***

### extraData

> `readonly` **extraData**: `Uint8Array`

Defined in: [packages/block/src/header.ts:50](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L50)

***

### gasLimit

> `readonly` **gasLimit**: `bigint`

Defined in: [packages/block/src/header.ts:47](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L47)

***

### gasUsed

> `readonly` **gasUsed**: `bigint`

Defined in: [packages/block/src/header.ts:48](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L48)

***

### keccakFunction

> `protected` **keccakFunction**: (`msg`) => `Uint8Array`

Defined in: [packages/block/src/header.ts:62](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L62)

#### Parameters

##### msg

`Uint8Array`

#### Returns

`Uint8Array`

***

### logsBloom

> `readonly` **logsBloom**: `Uint8Array`

Defined in: [packages/block/src/header.ts:44](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L44)

***

### mixHash

> `readonly` **mixHash**: `Uint8Array`

Defined in: [packages/block/src/header.ts:51](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L51)

***

### nonce

> `readonly` **nonce**: `Uint8Array`

Defined in: [packages/block/src/header.ts:52](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L52)

***

### number

> `readonly` **number**: `bigint`

Defined in: [packages/block/src/header.ts:46](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L46)

***

### parentBeaconBlockRoot?

> `readonly` `optional` **parentBeaconBlockRoot?**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [packages/block/src/header.ts:57](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L57)

***

### parentHash

> `readonly` **parentHash**: `Uint8Array`

Defined in: [packages/block/src/header.ts:38](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L38)

***

### receiptTrie

> `readonly` **receiptTrie**: `Uint8Array`

Defined in: [packages/block/src/header.ts:43](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L43)

***

### requestsRoot?

> `readonly` `optional` **requestsRoot?**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [packages/block/src/header.ts:58](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L58)

***

### stateRoot

> `readonly` **stateRoot**: `Uint8Array`

Defined in: [packages/block/src/header.ts:41](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L41)

***

### timestamp

> `readonly` **timestamp**: `bigint`

Defined in: [packages/block/src/header.ts:49](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L49)

***

### transactionsTrie

> `readonly` **transactionsTrie**: `Uint8Array`

Defined in: [packages/block/src/header.ts:42](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L42)

***

### uncleHash

> `readonly` **uncleHash**: `Uint8Array`

Defined in: [packages/block/src/header.ts:39](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L39)

***

### withdrawalsRoot?

> `readonly` `optional` **withdrawalsRoot?**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [packages/block/src/header.ts:54](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L54)

## Accessors

### prevRandao

#### Get Signature

> **get** **prevRandao**(): `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [packages/block/src/header.ts:71](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L71)

EIP-4399: After merge to PoS, `mixHash` supplanted as `prevRandao`

##### Returns

`Uint8Array`\<`ArrayBufferLike`\>

## Methods

### \_consensusFormatValidation()

> `protected` **\_consensusFormatValidation**(): `void`

Defined in: [packages/block/src/header.ts:390](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L390)

Checks static parameters related to consensus algorithm

#### Returns

`void`

#### Throws

if any check fails

***

### \_genericFormatValidation()

> `protected` **\_genericFormatValidation**(): `void`

Defined in: [packages/block/src/header.ts:303](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L303)

Validates correct buffer lengths, throws if invalid.

#### Returns

`void`

***

### \_requireClique()

> `protected` **\_requireClique**(`name`): `void`

Defined in: [packages/block/src/header.ts:670](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L670)

#### Parameters

##### name

`string`

#### Returns

`void`

***

### \_validateDAOExtraData()

> `protected` **\_validateDAOExtraData**(): `void`

Defined in: [packages/block/src/header.ts:926](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L926)

Validates extra data is DAO_ExtraData for DAO_ForceExtraDataRange blocks after DAO
activation block (see: https://blog.slock.it/hard-fork-specification-24b889e70703)

#### Returns

`void`

***

### calcDataFee()

> **calcDataFee**(`numBlobs`): `bigint`

Defined in: [packages/block/src/header.ts:569](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L569)

Returns the total fee for blob gas spent for including blobs in block.

#### Parameters

##### numBlobs

`number`

number of blobs in the transaction/block

#### Returns

`bigint`

the total blob gas fee for numBlobs blobs

***

### calcNextBaseFee()

> **calcNextBaseFee**(): `bigint`

Defined in: [packages/block/src/header.ts:510](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L510)

Calculates the base fee for a potential next block

#### Returns

`bigint`

***

### calcNextBlobGasPrice()

> **calcNextBlobGasPrice**(): `bigint`

Defined in: [packages/block/src/header.ts:595](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L595)

Calculate the blob gas price of the block built on top of this one

#### Returns

`bigint`

The blob gas price

***

### calcNextExcessBlobGas()

> **calcNextExcessBlobGas**(): `bigint`

Defined in: [packages/block/src/header.ts:580](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L580)

Calculates the excess blob gas for next (hopefully) post EIP 4844 block.

#### Returns

`bigint`

***

### cliqueEpochTransitionSigners()

> **cliqueEpochTransitionSigners**(): `Address`[]

Defined in: [packages/block/src/header.ts:825](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L825)

Returns a list of signers
(only clique PoA, throws otherwise)

This function throws if not called on an epoch
transition block and should therefore be used
in conjunction with [BlockHeader.cliqueIsEpochTransition](#cliqueisepochtransition)

#### Returns

`Address`[]

***

### cliqueExtraSeal()

> **cliqueExtraSeal**(): `Uint8Array`

Defined in: [packages/block/src/header.ts:783](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L783)

Returns extra seal data
(only clique PoA, throws otherwise)

#### Returns

`Uint8Array`

***

### cliqueExtraVanity()

> **cliqueExtraVanity**(): `Uint8Array`

Defined in: [packages/block/src/header.ts:774](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L774)

Returns extra vanity data
(only clique PoA, throws otherwise)

#### Returns

`Uint8Array`

***

### cliqueIsEpochTransition()

> **cliqueIsEpochTransition**(): `boolean`

Defined in: [packages/block/src/header.ts:762](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L762)

Checks if the block header is an epoch transition
header (only clique PoA, throws otherwise)

#### Returns

`boolean`

***

### cliqueSigHash()

> **cliqueSigHash**(): `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [packages/block/src/header.ts:751](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L751)

PoA clique signature hash without the seal.

#### Returns

`Uint8Array`\<`ArrayBufferLike`\>

***

### cliqueSigner()

> **cliqueSigner**(): `Address`

Defined in: [packages/block/src/header.ts:862](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L862)

Returns the signer address

#### Returns

`Address`

***

### cliqueVerifySignature()

> **cliqueVerifySignature**(`signerList`): `boolean`

Defined in: [packages/block/src/header.ts:850](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L850)

Verifies the signature of the block (last 65 bytes of extraData field)
(only clique PoA, throws otherwise)

 Method throws if signature is invalid

#### Parameters

##### signerList

`Address`[]

#### Returns

`boolean`

***

### errorStr()

> **errorStr**(): `string`

Defined in: [packages/block/src/header.ts:948](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L948)

Return a compact error string representation of the object

#### Returns

`string`

***

### ethashCanonicalDifficulty()

> **ethashCanonicalDifficulty**(`parentBlockHeader`): `bigint`

Defined in: [packages/block/src/header.ts:682](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L682)

Returns the canonical difficulty for this block.

#### Parameters

##### parentBlockHeader

`BlockHeader`

the header from the parent `Block` of this header

#### Returns

`bigint`

***

### getBlobGasPrice()

> **getBlobGasPrice**(): `bigint`

Defined in: [packages/block/src/header.ts:544](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L544)

Returns the price per unit of blob gas for a blob transaction in the current/pending block

#### Returns

`bigint`

the price in gwei per unit of blob gas spent

***

### hash()

> **hash**(): `Uint8Array`

Defined in: [packages/block/src/header.ts:653](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L653)

Returns the hash of the block header.

#### Returns

`Uint8Array`

***

### isGenesis()

> **isGenesis**(): `boolean`

Defined in: [packages/block/src/header.ts:666](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L666)

Checks if the block header is a genesis header.

#### Returns

`boolean`

***

### raw()

> **raw**(): [`BlockHeaderBytes`](../type-aliases/BlockHeaderBytes.md)

Defined in: [packages/block/src/header.ts:602](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L602)

Returns a Uint8Array Array of the raw Bytes in this header, in order.

#### Returns

[`BlockHeaderBytes`](../type-aliases/BlockHeaderBytes.md)

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: [packages/block/src/header.ts:879](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L879)

Returns the rlp encoding of the block header.

#### Returns

`Uint8Array`

***

### toJSON()

> **toJSON**(): [`JsonHeader`](../interfaces/JsonHeader.md)

Defined in: [packages/block/src/header.ts:886](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L886)

Returns the block header in JSON format.

#### Returns

[`JsonHeader`](../interfaces/JsonHeader.md)

***

### validateGasLimit()

> **validateGasLimit**(`parentBlockHeader`): `void`

Defined in: [packages/block/src/header.ts:474](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L474)

Validates if the block gasLimit remains in the boundaries set by the protocol.
Throws if out of bounds.

#### Parameters

##### parentBlockHeader

`BlockHeader`

the header from the parent `Block` of this header

#### Returns

`void`

***

### fromHeaderData()

> `static` **fromHeaderData**(`headerData`, `opts`): `BlockHeader`

Defined in: [packages/block/src/header.ts:85](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L85)

Static constructor to create a block header from a header data dictionary

#### Parameters

##### headerData

[`HeaderData`](../interfaces/HeaderData.md)

##### opts

[`BlockOptions`](../interfaces/BlockOptions.md)

#### Returns

`BlockHeader`

***

### fromRLPSerializedHeader()

> `static` **fromRLPSerializedHeader**(`serializedHeaderData`, `opts`): `BlockHeader`

Defined in: [packages/block/src/header.ts:95](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L95)

Static constructor to create a block header from a RLP-serialized header

#### Parameters

##### serializedHeaderData

`Uint8Array`

##### opts

[`BlockOptions`](../interfaces/BlockOptions.md)

#### Returns

`BlockHeader`

***

### fromValuesArray()

> `static` **fromValuesArray**(`values`, `opts`): `BlockHeader`

Defined in: [packages/block/src/header.ts:109](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L109)

Static constructor to create a block header from an array of Bytes values

#### Parameters

##### values

[`BlockHeaderBytes`](../type-aliases/BlockHeaderBytes.md)

##### opts

[`BlockOptions`](../interfaces/BlockOptions.md)

#### Returns

`BlockHeader`
