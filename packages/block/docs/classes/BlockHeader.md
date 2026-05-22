[**@tevm/block**](../README.md)

***

[@tevm/block](../globals.md) / BlockHeader

# Class: BlockHeader

Defined in: [packages/block/src/header.ts:41](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L41)

An object that represents the block header.

## Constructors

### Constructor

> **new BlockHeader**(`headerData`, `opts`): `BlockHeader`

Defined in: [packages/block/src/header.ts:148](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L148)

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

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="basefeepergas"></a> `baseFeePerGas?` | `readonly` | `bigint` | - | [packages/block/src/header.ts:57](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L57) |
| <a id="blobgasused"></a> `blobGasUsed?` | `readonly` | `bigint` | - | [packages/block/src/header.ts:59](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L59) |
| <a id="cache"></a> `cache` | `protected` | `HeaderCache` | - | [packages/block/src/header.ts:68](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L68) |
| <a id="coinbase"></a> `coinbase` | `readonly` | `Address` | - | [packages/block/src/header.ts:44](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L44) |
| <a id="common"></a> `common` | `readonly` | `object` | - | [packages/block/src/header.ts:64](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L64) |
| `common.blockExplorers?` | `public` | `object` | Collection of block explorers | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:15 |
| `common.blockExplorers.default` | `public` | `ChainBlockExplorer` | - | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:17 |
| `common.blockTime?` | `public` | `number` | Block time in milliseconds. | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:20 |
| `common.contracts?` | `public` | `object` | Collection of contracts | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:22 |
| `common.contracts.ensRegistry?` | `public` | `ChainContract` | - | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:27 |
| `common.contracts.ensUniversalResolver?` | `public` | `ChainContract` | - | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:28 |
| `common.contracts.erc6492Verifier?` | `public` | `ChainContract` | - | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:30 |
| `common.contracts.multicall3?` | `public` | `ChainContract` | - | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:29 |
| `common.copy` | `public` | () => \{ blockExplorers?: \{ \[key: string\]: ChainBlockExplorer; default: ChainBlockExplorer; \} \| undefined; blockTime?: number \| undefined; contracts?: \{ ...; \} \| undefined; ... 16 more ...; copy: () =\> ...; \} | - | packages/common/types/Common.d.ts:28 |
| `common.custom?` | `public` | `Record`\<`string`, `unknown`\> | Custom chain data. **Deprecated** use `.extend` instead. | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:59 |
| `common.ensTlds?` | `public` | readonly `string`[] | Collection of ENS TLDs for the chain. | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:33 |
| `common.ethjsCommon` | `public` | `Common` | - | packages/common/types/Common.d.ts:27 |
| `common.experimental_preconfirmationTime?` | `public` | `number` | Preconfirmation time in milliseconds. | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:41 |
| `common.extendSchema?` | `public` | `Record`\<`string`, `unknown`\> | Extend schema. | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:61 |
| `common.fees?` | `public` | `ChainFees`\<`ChainFormatters` \| `undefined`\> | Modifies how fees are derived. | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:63 |
| `common.formatters?` | `public` | `ChainFormatters` | Modifies how data is formatted and typed (e.g. blocks and transactions) | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:65 |
| `common.id` | `public` | `number` | ID in number form | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:35 |
| `common.name` | `public` | `string` | Human-readable name | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:37 |
| `common.nativeCurrency` | `public` | `ChainNativeCurrency` | Currency used by chain | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:39 |
| `common.prepareTransactionRequest?` | `public` | `PrepareTransactionRequestFn` \| \[`PrepareTransactionRequestFn`, `object`\] | Function to prepare a transaction request. Runs before the transaction is filled. | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:67 |
| `common.rpcUrls` | `public` | `object` | Collection of RPC endpoints | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:43 |
| `common.rpcUrls.default` | `public` | `ChainRpcUrls` | - | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:45 |
| `common.serializers?` | `public` | `ChainSerializers`\<`ChainFormatters` \| `undefined`, `TransactionSerializable`\> | Modifies how data is serialized (e.g. transactions). | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:81 |
| `common.sourceId?` | `public` | `number` | Source Chain ID (ie. the L1 chain) | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:48 |
| `common.testnet?` | `public` | `boolean` | Flag for test networks | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:50 |
| `common.verifyHash?` | `public` | `ChainVerifyHashFn` | Chain-specific signature verification. | node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/chain.d.ts:83 |
| <a id="difficulty"></a> `difficulty` | `readonly` | `bigint` | - | [packages/block/src/header.ts:49](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L49) |
| <a id="excessblobgas"></a> `excessBlobGas?` | `readonly` | `bigint` | - | [packages/block/src/header.ts:60](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L60) |
| <a id="extradata"></a> `extraData` | `readonly` | `Uint8Array` | - | [packages/block/src/header.ts:54](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L54) |
| <a id="gaslimit"></a> `gasLimit` | `readonly` | `bigint` | - | [packages/block/src/header.ts:51](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L51) |
| <a id="gasused"></a> `gasUsed` | `readonly` | `bigint` | - | [packages/block/src/header.ts:52](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L52) |
| <a id="keccakfunction"></a> `keccakFunction` | `protected` | (`msg`) => `Uint8Array` | - | [packages/block/src/header.ts:66](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L66) |
| <a id="logsbloom"></a> `logsBloom` | `readonly` | `Uint8Array` | - | [packages/block/src/header.ts:48](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L48) |
| <a id="mixhash"></a> `mixHash` | `readonly` | `Uint8Array` | - | [packages/block/src/header.ts:55](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L55) |
| <a id="nonce"></a> `nonce` | `readonly` | `Uint8Array` | - | [packages/block/src/header.ts:56](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L56) |
| <a id="number"></a> `number` | `readonly` | `bigint` | - | [packages/block/src/header.ts:50](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L50) |
| <a id="parentbeaconblockroot"></a> `parentBeaconBlockRoot?` | `readonly` | `Uint8Array`\<`ArrayBufferLike`\> | - | [packages/block/src/header.ts:61](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L61) |
| <a id="parenthash"></a> `parentHash` | `readonly` | `Uint8Array` | - | [packages/block/src/header.ts:42](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L42) |
| <a id="receipttrie"></a> `receiptTrie` | `readonly` | `Uint8Array` | - | [packages/block/src/header.ts:47](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L47) |
| <a id="requestsroot"></a> `requestsRoot?` | `readonly` | `Uint8Array`\<`ArrayBufferLike`\> | - | [packages/block/src/header.ts:62](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L62) |
| <a id="stateroot"></a> `stateRoot` | `readonly` | `Uint8Array` | - | [packages/block/src/header.ts:45](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L45) |
| <a id="timestamp"></a> `timestamp` | `readonly` | `bigint` | - | [packages/block/src/header.ts:53](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L53) |
| <a id="transactionstrie"></a> `transactionsTrie` | `readonly` | `Uint8Array` | - | [packages/block/src/header.ts:46](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L46) |
| <a id="unclehash"></a> `uncleHash` | `readonly` | `Uint8Array` | - | [packages/block/src/header.ts:43](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L43) |
| <a id="withdrawalsroot"></a> `withdrawalsRoot?` | `readonly` | `Uint8Array`\<`ArrayBufferLike`\> | - | [packages/block/src/header.ts:58](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L58) |

## Accessors

### prevRandao

#### Get Signature

> **get** **prevRandao**(): `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [packages/block/src/header.ts:75](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L75)

EIP-4399: After merge to PoS, `mixHash` supplanted as `prevRandao`

##### Returns

`Uint8Array`\<`ArrayBufferLike`\>

## Methods

### \_consensusFormatValidation()

> `protected` **\_consensusFormatValidation**(): `void`

Defined in: [packages/block/src/header.ts:395](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L395)

Checks static parameters related to consensus algorithm

#### Returns

`void`

#### Throws

if any check fails

***

### \_genericFormatValidation()

> `protected` **\_genericFormatValidation**(): `void`

Defined in: [packages/block/src/header.ts:308](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L308)

Validates correct buffer lengths, throws if invalid.

#### Returns

`void`

***

### \_requireClique()

> `protected` **\_requireClique**(`name`): `void`

Defined in: [packages/block/src/header.ts:675](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L675)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |

#### Returns

`void`

***

### \_validateDAOExtraData()

> `protected` **\_validateDAOExtraData**(): `void`

Defined in: [packages/block/src/header.ts:931](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L931)

Validates extra data is DAO_ExtraData for DAO_ForceExtraDataRange blocks after DAO
activation block (see: https://blog.slock.it/hard-fork-specification-24b889e70703)

#### Returns

`void`

***

### calcDataFee()

> **calcDataFee**(`numBlobs`): `bigint`

Defined in: [packages/block/src/header.ts:574](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L574)

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

Defined in: [packages/block/src/header.ts:515](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L515)

Calculates the base fee for a potential next block

#### Returns

`bigint`

***

### calcNextBlobGasPrice()

> **calcNextBlobGasPrice**(): `bigint`

Defined in: [packages/block/src/header.ts:600](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L600)

Calculate the blob gas price of the block built on top of this one

#### Returns

`bigint`

The blob gas price

***

### calcNextExcessBlobGas()

> **calcNextExcessBlobGas**(): `bigint`

Defined in: [packages/block/src/header.ts:585](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L585)

Calculates the excess blob gas for next (hopefully) post EIP 4844 block.

#### Returns

`bigint`

***

### cliqueEpochTransitionSigners()

> **cliqueEpochTransitionSigners**(): `Address`[]

Defined in: [packages/block/src/header.ts:830](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L830)

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

Defined in: [packages/block/src/header.ts:788](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L788)

Returns extra seal data
(only clique PoA, throws otherwise)

#### Returns

`Uint8Array`

***

### cliqueExtraVanity()

> **cliqueExtraVanity**(): `Uint8Array`

Defined in: [packages/block/src/header.ts:779](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L779)

Returns extra vanity data
(only clique PoA, throws otherwise)

#### Returns

`Uint8Array`

***

### cliqueIsEpochTransition()

> **cliqueIsEpochTransition**(): `boolean`

Defined in: [packages/block/src/header.ts:767](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L767)

Checks if the block header is an epoch transition
header (only clique PoA, throws otherwise)

#### Returns

`boolean`

***

### cliqueSigHash()

> **cliqueSigHash**(): `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [packages/block/src/header.ts:756](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L756)

PoA clique signature hash without the seal.

#### Returns

`Uint8Array`\<`ArrayBufferLike`\>

***

### cliqueSigner()

> **cliqueSigner**(): `Address`

Defined in: [packages/block/src/header.ts:867](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L867)

Returns the signer address

#### Returns

`Address`

***

### cliqueVerifySignature()

> **cliqueVerifySignature**(`signerList`): `boolean`

Defined in: [packages/block/src/header.ts:855](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L855)

Verifies the signature of the block (last 65 bytes of extraData field)
(only clique PoA, throws otherwise)

 Method throws if signature is invalid

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `signerList` | `Address`[] |

#### Returns

`boolean`

***

### errorStr()

> **errorStr**(): `string`

Defined in: [packages/block/src/header.ts:953](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L953)

Return a compact error string representation of the object

#### Returns

`string`

***

### ethashCanonicalDifficulty()

> **ethashCanonicalDifficulty**(`parentBlockHeader`): `bigint`

Defined in: [packages/block/src/header.ts:687](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L687)

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

Defined in: [packages/block/src/header.ts:549](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L549)

Returns the price per unit of blob gas for a blob transaction in the current/pending block

#### Returns

`bigint`

the price in gwei per unit of blob gas spent

***

### hash()

> **hash**(): `Uint8Array`

Defined in: [packages/block/src/header.ts:658](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L658)

Returns the hash of the block header.

#### Returns

`Uint8Array`

***

### isGenesis()

> **isGenesis**(): `boolean`

Defined in: [packages/block/src/header.ts:671](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L671)

Checks if the block header is a genesis header.

#### Returns

`boolean`

***

### raw()

> **raw**(): [`BlockHeaderBytes`](../type-aliases/BlockHeaderBytes.md)

Defined in: [packages/block/src/header.ts:607](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L607)

Returns a Uint8Array Array of the raw Bytes in this header, in order.

#### Returns

[`BlockHeaderBytes`](../type-aliases/BlockHeaderBytes.md)

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: [packages/block/src/header.ts:884](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L884)

Returns the rlp encoding of the block header.

#### Returns

`Uint8Array`

***

### toJSON()

> **toJSON**(): [`JsonHeader`](../interfaces/JsonHeader.md)

Defined in: [packages/block/src/header.ts:891](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L891)

Returns the block header in JSON format.

#### Returns

[`JsonHeader`](../interfaces/JsonHeader.md)

***

### validateGasLimit()

> **validateGasLimit**(`parentBlockHeader`): `void`

Defined in: [packages/block/src/header.ts:479](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L479)

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

Defined in: [packages/block/src/header.ts:89](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L89)

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

Defined in: [packages/block/src/header.ts:99](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L99)

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

Defined in: [packages/block/src/header.ts:113](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/header.ts#L113)

Static constructor to create a block header from an array of Bytes values

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `values` | [`BlockHeaderBytes`](../type-aliases/BlockHeaderBytes.md) | - |
| `opts` | [`BlockOptions`](../interfaces/BlockOptions.md) | - |

#### Returns

`BlockHeader`
