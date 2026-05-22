[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [block](../README.md) / BlockHeader

# Class: BlockHeader

An object that represents the block header.

## Constructors

### Constructor

> **new BlockHeader**(`headerData`, `opts`): `BlockHeader`

This constructor takes the values, validates them, assigns them and freezes the object.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `headerData` | [`HeaderData`](../interfaces/HeaderData.md) |
| `opts` | [`BlockOptions`](../interfaces/BlockOptions.md) |

#### Returns

`BlockHeader`

#### Deprecated

Use the public static factory methods to assist in creating a Header object from
varying data types. For a default empty header, use [BlockHeader.fromHeaderData](#fromheaderdata).

## Properties

| Property | Modifier | Type | Description |
| ------ | ------ | ------ | ------ |
| <a id="basefeepergas"></a> `baseFeePerGas?` | `readonly` | `bigint` | - |
| <a id="blobgasused"></a> `blobGasUsed?` | `readonly` | `bigint` | - |
| <a id="cache"></a> `cache` | `protected` | `HeaderCache` | - |
| <a id="coinbase"></a> `coinbase` | `readonly` | [`EthjsAddress`](../../utils/classes/EthjsAddress.md) | - |
| <a id="common"></a> `common` | `readonly` | `object` | - |
| `common.blockExplorers?` | `public` | `object` | Collection of block explorers |
| `common.blockExplorers.default` | `public` | `ChainBlockExplorer` | - |
| `common.blockTime?` | `public` | `number` | Block time in milliseconds. |
| `common.contracts?` | `public` | `object` | Collection of contracts |
| `common.contracts.ensRegistry?` | `public` | `ChainContract` | - |
| `common.contracts.ensUniversalResolver?` | `public` | `ChainContract` | - |
| `common.contracts.erc6492Verifier?` | `public` | `ChainContract` | - |
| `common.contracts.multicall3?` | `public` | `ChainContract` | - |
| `common.copy` | `public` | () => \{ blockExplorers?: \{ \[key: string\]: ChainBlockExplorer; default: ChainBlockExplorer; \} \| undefined; blockTime?: number \| undefined; contracts?: \{ ...; \} \| undefined; ... 16 more ...; copy: () =\> ...; \} | - |
| `common.custom?` | `public` | `Record`\<`string`, `unknown`\> | Custom chain data. **Deprecated** use `.extend` instead. |
| `common.ensTlds?` | `public` | readonly `string`[] | Collection of ENS TLDs for the chain. |
| `common.ethjsCommon` | `public` | `Common` | - |
| `common.experimental_preconfirmationTime?` | `public` | `number` | Preconfirmation time in milliseconds. |
| `common.extendSchema?` | `public` | `Record`\<`string`, `unknown`\> | Extend schema. |
| `common.fees?` | `public` | `ChainFees`\<`ChainFormatters` \| `undefined`\> | Modifies how fees are derived. |
| `common.formatters?` | `public` | `ChainFormatters` | Modifies how data is formatted and typed (e.g. blocks and transactions) |
| `common.id` | `public` | `number` | ID in number form |
| `common.name` | `public` | `string` | Human-readable name |
| `common.nativeCurrency` | `public` | `ChainNativeCurrency` | Currency used by chain |
| `common.prepareTransactionRequest?` | `public` | `PrepareTransactionRequestFn` \| \[`PrepareTransactionRequestFn`, `object`\] | Function to prepare a transaction request. Runs before the transaction is filled. |
| `common.rpcUrls` | `public` | `object` | Collection of RPC endpoints |
| `common.rpcUrls.default` | `public` | `ChainRpcUrls` | - |
| `common.serializers?` | `public` | `ChainSerializers`\<`ChainFormatters` \| `undefined`, `TransactionSerializable`\> | Modifies how data is serialized (e.g. transactions). |
| `common.sourceId?` | `public` | `number` | Source Chain ID (ie. the L1 chain) |
| `common.testnet?` | `public` | `boolean` | Flag for test networks |
| `common.verifyHash?` | `public` | `ChainVerifyHashFn` | Chain-specific signature verification. |
| <a id="difficulty"></a> `difficulty` | `readonly` | `bigint` | - |
| <a id="excessblobgas"></a> `excessBlobGas?` | `readonly` | `bigint` | - |
| <a id="extradata"></a> `extraData` | `readonly` | `Uint8Array` | - |
| <a id="gaslimit"></a> `gasLimit` | `readonly` | `bigint` | - |
| <a id="gasused"></a> `gasUsed` | `readonly` | `bigint` | - |
| <a id="keccakfunction"></a> `keccakFunction` | `protected` | (`msg`) => `Uint8Array` | - |
| <a id="logsbloom"></a> `logsBloom` | `readonly` | `Uint8Array` | - |
| <a id="mixhash"></a> `mixHash` | `readonly` | `Uint8Array` | - |
| <a id="nonce"></a> `nonce` | `readonly` | `Uint8Array` | - |
| <a id="number"></a> `number` | `readonly` | `bigint` | - |
| <a id="parentbeaconblockroot"></a> `parentBeaconBlockRoot?` | `readonly` | `Uint8Array`\<`ArrayBufferLike`\> | - |
| <a id="parenthash"></a> `parentHash` | `readonly` | `Uint8Array` | - |
| <a id="receipttrie"></a> `receiptTrie` | `readonly` | `Uint8Array` | - |
| <a id="requestsroot"></a> `requestsRoot?` | `readonly` | `Uint8Array`\<`ArrayBufferLike`\> | - |
| <a id="stateroot"></a> `stateRoot` | `readonly` | `Uint8Array` | - |
| <a id="timestamp"></a> `timestamp` | `readonly` | `bigint` | - |
| <a id="transactionstrie"></a> `transactionsTrie` | `readonly` | `Uint8Array` | - |
| <a id="unclehash"></a> `uncleHash` | `readonly` | `Uint8Array` | - |
| <a id="withdrawalsroot"></a> `withdrawalsRoot?` | `readonly` | `Uint8Array`\<`ArrayBufferLike`\> | - |

## Accessors

### prevRandao

#### Get Signature

> **get** **prevRandao**(): `Uint8Array`\<`ArrayBufferLike`\>

EIP-4399: After merge to PoS, `mixHash` supplanted as `prevRandao`

##### Returns

`Uint8Array`\<`ArrayBufferLike`\>

## Methods

### \_consensusFormatValidation()

> `protected` **\_consensusFormatValidation**(): `void`

Checks static parameters related to consensus algorithm

#### Returns

`void`

#### Throws

if any check fails

***

### \_genericFormatValidation()

> `protected` **\_genericFormatValidation**(): `void`

Validates correct buffer lengths, throws if invalid.

#### Returns

`void`

***

### \_requireClique()

> `protected` **\_requireClique**(`name`): `void`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |

#### Returns

`void`

***

### \_validateDAOExtraData()

> `protected` **\_validateDAOExtraData**(): `void`

Validates extra data is DAO_ExtraData for DAO_ForceExtraDataRange blocks after DAO
activation block (see: https://blog.slock.it/hard-fork-specification-24b889e70703)

#### Returns

`void`

***

### calcDataFee()

> **calcDataFee**(`numBlobs`): `bigint`

Returns the total fee for blob gas spent for including blobs in block.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `numBlobs` | `number` | number of blobs in the transaction/block |

#### Returns

`bigint`

the total blob gas fee for numBlobs blobs

***

### calcNextBaseFee()

> **calcNextBaseFee**(): `bigint`

Calculates the base fee for a potential next block

#### Returns

`bigint`

***

### calcNextBlobGasPrice()

> **calcNextBlobGasPrice**(): `bigint`

Calculate the blob gas price of the block built on top of this one

#### Returns

`bigint`

The blob gas price

***

### calcNextExcessBlobGas()

> **calcNextExcessBlobGas**(): `bigint`

Calculates the excess blob gas for next (hopefully) post EIP 4844 block.

#### Returns

`bigint`

***

### cliqueEpochTransitionSigners()

> **cliqueEpochTransitionSigners**(): [`EthjsAddress`](../../utils/classes/EthjsAddress.md)[]

Returns a list of signers
(only clique PoA, throws otherwise)

This function throws if not called on an epoch
transition block and should therefore be used
in conjunction with [BlockHeader.cliqueIsEpochTransition](#cliqueisepochtransition)

#### Returns

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)[]

***

### cliqueExtraSeal()

> **cliqueExtraSeal**(): `Uint8Array`

Returns extra seal data
(only clique PoA, throws otherwise)

#### Returns

`Uint8Array`

***

### cliqueExtraVanity()

> **cliqueExtraVanity**(): `Uint8Array`

Returns extra vanity data
(only clique PoA, throws otherwise)

#### Returns

`Uint8Array`

***

### cliqueIsEpochTransition()

> **cliqueIsEpochTransition**(): `boolean`

Checks if the block header is an epoch transition
header (only clique PoA, throws otherwise)

#### Returns

`boolean`

***

### cliqueSigHash()

> **cliqueSigHash**(): `Uint8Array`\<`ArrayBufferLike`\>

PoA clique signature hash without the seal.

#### Returns

`Uint8Array`\<`ArrayBufferLike`\>

***

### cliqueSigner()

> **cliqueSigner**(): [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

Returns the signer address

#### Returns

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

***

### cliqueVerifySignature()

> **cliqueVerifySignature**(`signerList`): `boolean`

Verifies the signature of the block (last 65 bytes of extraData field)
(only clique PoA, throws otherwise)

 Method throws if signature is invalid

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `signerList` | [`EthjsAddress`](../../utils/classes/EthjsAddress.md)[] |

#### Returns

`boolean`

***

### errorStr()

> **errorStr**(): `string`

Return a compact error string representation of the object

#### Returns

`string`

***

### ethashCanonicalDifficulty()

> **ethashCanonicalDifficulty**(`parentBlockHeader`): `bigint`

Returns the canonical difficulty for this block.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `parentBlockHeader` | `BlockHeader` | the header from the parent `Block` of this header |

#### Returns

`bigint`

***

### getBlobGasPrice()

> **getBlobGasPrice**(): `bigint`

Returns the price per unit of blob gas for a blob transaction in the current/pending block

#### Returns

`bigint`

the price in gwei per unit of blob gas spent

***

### hash()

> **hash**(): `Uint8Array`

Returns the hash of the block header.

#### Returns

`Uint8Array`

***

### isGenesis()

> **isGenesis**(): `boolean`

Checks if the block header is a genesis header.

#### Returns

`boolean`

***

### raw()

> **raw**(): [`BlockHeaderBytes`](../type-aliases/BlockHeaderBytes.md)

Returns a Uint8Array Array of the raw Bytes in this header, in order.

#### Returns

[`BlockHeaderBytes`](../type-aliases/BlockHeaderBytes.md)

***

### serialize()

> **serialize**(): `Uint8Array`

Returns the rlp encoding of the block header.

#### Returns

`Uint8Array`

***

### toJSON()

> **toJSON**(): [`JsonHeader`](../interfaces/JsonHeader.md)

Returns the block header in JSON format.

#### Returns

[`JsonHeader`](../interfaces/JsonHeader.md)

***

### validateGasLimit()

> **validateGasLimit**(`parentBlockHeader`): `void`

Validates if the block gasLimit remains in the boundaries set by the protocol.
Throws if out of bounds.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `parentBlockHeader` | `BlockHeader` | the header from the parent `Block` of this header |

#### Returns

`void`

***

### fromHeaderData()

> `static` **fromHeaderData**(`headerData`, `opts`): `BlockHeader`

Static constructor to create a block header from a header data dictionary

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `headerData` | [`HeaderData`](../interfaces/HeaderData.md) | - |
| `opts` | [`BlockOptions`](../interfaces/BlockOptions.md) | - |

#### Returns

`BlockHeader`

***

### fromRLPSerializedHeader()

> `static` **fromRLPSerializedHeader**(`serializedHeaderData`, `opts`): `BlockHeader`

Static constructor to create a block header from a RLP-serialized header

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `serializedHeaderData` | `Uint8Array` | - |
| `opts` | [`BlockOptions`](../interfaces/BlockOptions.md) | - |

#### Returns

`BlockHeader`

***

### fromValuesArray()

> `static` **fromValuesArray**(`values`, `opts`): `BlockHeader`

Static constructor to create a block header from an array of Bytes values

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `values` | [`BlockHeaderBytes`](../type-aliases/BlockHeaderBytes.md) | - |
| `opts` | [`BlockOptions`](../interfaces/BlockOptions.md) | - |

#### Returns

`BlockHeader`
