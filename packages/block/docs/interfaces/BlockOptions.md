[**@tevm/block**](../README.md)

***

[@tevm/block](../globals.md) / BlockOptions

# Interface: BlockOptions

Defined in: [packages/block/src/types.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L12)

An object to set to which blockchain the blocks and their headers belong. This could be specified
using a Common object, or `chain` and `hardfork`. Defaults to mainnet without specifying a
hardfork.

## Properties

### calcDifficultyFromHeader?

> `optional` **calcDifficultyFromHeader**: [`BlockHeader`](../classes/BlockHeader.md)

Defined in: [packages/block/src/types.ts:43](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L43)

If a preceding [BlockHeader](../classes/BlockHeader.md) (usually the parent header) is given the preceding
header will be used to calculate the difficulty for this block and the calculated
difficulty takes precedence over a provided static `difficulty` value.

Note that this option has no effect on networks other than PoW/Ethash networks
(respectively also deactivates on the Merge HF switching to PoS/Casper).

***

### cliqueSigner?

> `optional` **cliqueSigner**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [packages/block/src/types.ts:60](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L60)

Provide a clique signer's privateKey to seal this block.
Will throw if provided on a non-PoA chain.

***

### common

> **common**: `object`

Defined in: [packages/block/src/types.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L24)

A Common object defining the chain and the hardfork a block/block header belongs to.

Object will be internally copied so that tx behavior don't incidentally
change on future HF changes.

Default: Common object set to `mainnet` and the HF currently defined as the default
hardfork in the Common class.

Current default hardfork: `merge`

#### blockExplorers?

> `optional` **blockExplorers**: `object`

Collection of block explorers

##### Index Signature

\[`key`: `string`\]: `ChainBlockExplorer`

##### blockExplorers.default

> **default**: `ChainBlockExplorer`

#### contracts?

> `optional` **contracts**: `object`

Collection of contracts

##### Index Signature

\[`key`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

##### contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

##### contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

##### contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

##### contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### copy()

> **copy**: () => \{ blockExplorers?: \{ \[key: string\]: ChainBlockExplorer; default: ChainBlockExplorer; \} \| undefined; contracts?: \{ \[x: string\]: ChainContract \| \{ ...; \} \| undefined; ensRegistry?: ChainContract \| undefined; ensUniversalResolver?: ChainContract \| undefined; multicall3?: ChainContract \| undefined; universalSignatureVer...

##### Returns

\{ blockExplorers?: \{ \[key: string\]: ChainBlockExplorer; default: ChainBlockExplorer; \} \| undefined; contracts?: \{ \[x: string\]: ChainContract \| \{ ...; \} \| undefined; ensRegistry?: ChainContract \| undefined; ensUniversalResolver?: ChainContract \| undefined; multicall3?: ChainContract \| undefined; universalSignatureVer...

#### custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

Custom chain data.

#### ethjsCommon

> **ethjsCommon**: `Common`

#### fees?

> `optional` **fees**: `ChainFees`\<`undefined` \| `ChainFormatters`\>

Modifies how fees are derived.

#### formatters?

> `optional` **formatters**: `ChainFormatters`

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

#### rpcUrls

> **rpcUrls**: `object`

Collection of RPC endpoints

##### Index Signature

\[`key`: `string`\]: `ChainRpcUrls`

##### rpcUrls.default

> **default**: `ChainRpcUrls`

#### serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined` \| `ChainFormatters`, `TransactionSerializable`\>

Modifies how data is serialized (e.g. transactions).

#### sourceId?

> `optional` **sourceId**: `number`

Source Chain ID (ie. the L1 chain)

#### testnet?

> `optional` **testnet**: `boolean`

Flag for test networks

***

### executionWitness?

> `optional` **executionWitness**: [`VerkleExecutionWitness`](VerkleExecutionWitness.md)

Defined in: [packages/block/src/types.ts:66](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L66)

***

### freeze?

> `optional` **freeze**: `boolean`

Defined in: [packages/block/src/types.ts:55](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L55)

A block object by default gets frozen along initialization. This gives you
strong additional security guarantees on the consistency of the block parameters.
It also enables block hash caching when the `hash()` method is called multiple times.

If you need to deactivate the block freeze - e.g. because you want to subclass block and
add additional properties - it is strongly encouraged that you do the freeze yourself
within your code instead.

Default: true

***

### setHardfork?

> `optional` **setHardfork**: `boolean` \| `BigIntLike`

Defined in: [packages/block/src/types.ts:34](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L34)

Set the hardfork either by timestamp (for HFs from Shanghai onwards) or by block number
for older Hfs.

Additionally it is possible to pass in a specific TD value to support live-Merge-HF
transitions. Note that this should only be needed in very rare and specific scenarios.

Default: `false` (HF is set to whatever default HF is set by the Common instance)

***

### skipConsensusFormatValidation?

> `optional` **skipConsensusFormatValidation**: `boolean`

Defined in: [packages/block/src/types.ts:64](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L64)

Skip consensus format validation checks on header if set. Defaults to false.
