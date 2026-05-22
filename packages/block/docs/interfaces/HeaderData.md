[**@tevm/block**](../README.md)

***

[@tevm/block](../globals.md) / HeaderData

# Interface: HeaderData

Defined in: [packages/block/src/types.ts:168](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L168)

A block header's data.

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="basefeepergas"></a> `baseFeePerGas?` | `string` \| `number` \| `bigint` \| `Uint8Array`\<`ArrayBufferLike`\> | [packages/block/src/types.ts:184](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L184) |
| <a id="blobgasused"></a> `blobGasUsed?` | `string` \| `number` \| `bigint` \| `Uint8Array`\<`ArrayBufferLike`\> | [packages/block/src/types.ts:186](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L186) |
| <a id="coinbase"></a> `coinbase?` | `string` \| `Address` \| `Uint8Array`\<`ArrayBufferLike`\> | [packages/block/src/types.ts:171](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L171) |
| <a id="difficulty"></a> `difficulty?` | `string` \| `number` \| `bigint` \| `Uint8Array`\<`ArrayBufferLike`\> | [packages/block/src/types.ts:176](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L176) |
| <a id="excessblobgas"></a> `excessBlobGas?` | `string` \| `number` \| `bigint` \| `Uint8Array`\<`ArrayBufferLike`\> | [packages/block/src/types.ts:187](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L187) |
| <a id="extradata"></a> `extraData?` | `string` \| `number` \| `bigint` \| `number`[] \| `Uint8Array`\<`ArrayBufferLike`\> \| `TransformableToBytes` | [packages/block/src/types.ts:181](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L181) |
| <a id="gaslimit"></a> `gasLimit?` | `string` \| `number` \| `bigint` \| `Uint8Array`\<`ArrayBufferLike`\> | [packages/block/src/types.ts:178](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L178) |
| <a id="gasused"></a> `gasUsed?` | `string` \| `number` \| `bigint` \| `Uint8Array`\<`ArrayBufferLike`\> | [packages/block/src/types.ts:179](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L179) |
| <a id="logsbloom"></a> `logsBloom?` | `string` \| `number` \| `bigint` \| `number`[] \| `Uint8Array`\<`ArrayBufferLike`\> \| `TransformableToBytes` | [packages/block/src/types.ts:175](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L175) |
| <a id="mixhash"></a> `mixHash?` | `string` \| `number` \| `bigint` \| `number`[] \| `Uint8Array`\<`ArrayBufferLike`\> \| `TransformableToBytes` | [packages/block/src/types.ts:182](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L182) |
| <a id="nonce"></a> `nonce?` | `string` \| `number` \| `bigint` \| `number`[] \| `Uint8Array`\<`ArrayBufferLike`\> \| `TransformableToBytes` | [packages/block/src/types.ts:183](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L183) |
| <a id="number"></a> `number?` | `string` \| `number` \| `bigint` \| `Uint8Array`\<`ArrayBufferLike`\> | [packages/block/src/types.ts:177](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L177) |
| <a id="parentbeaconblockroot"></a> `parentBeaconBlockRoot?` | `string` \| `number` \| `bigint` \| `number`[] \| `Uint8Array`\<`ArrayBufferLike`\> \| `TransformableToBytes` | [packages/block/src/types.ts:188](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L188) |
| <a id="parenthash"></a> `parentHash?` | `string` \| `number` \| `bigint` \| `number`[] \| `Uint8Array`\<`ArrayBufferLike`\> \| `TransformableToBytes` | [packages/block/src/types.ts:169](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L169) |
| <a id="receipttrie"></a> `receiptTrie?` | `string` \| `number` \| `bigint` \| `number`[] \| `Uint8Array`\<`ArrayBufferLike`\> \| `TransformableToBytes` | [packages/block/src/types.ts:174](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L174) |
| <a id="requestsroot"></a> `requestsRoot?` | `string` \| `number` \| `bigint` \| `number`[] \| `Uint8Array`\<`ArrayBufferLike`\> \| `TransformableToBytes` | [packages/block/src/types.ts:189](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L189) |
| <a id="stateroot"></a> `stateRoot?` | `string` \| `number` \| `bigint` \| `number`[] \| `Uint8Array`\<`ArrayBufferLike`\> \| `TransformableToBytes` | [packages/block/src/types.ts:172](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L172) |
| <a id="timestamp"></a> `timestamp?` | `string` \| `number` \| `bigint` \| `Uint8Array`\<`ArrayBufferLike`\> | [packages/block/src/types.ts:180](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L180) |
| <a id="transactionstrie"></a> `transactionsTrie?` | `string` \| `number` \| `bigint` \| `number`[] \| `Uint8Array`\<`ArrayBufferLike`\> \| `TransformableToBytes` | [packages/block/src/types.ts:173](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L173) |
| <a id="unclehash"></a> `uncleHash?` | `string` \| `number` \| `bigint` \| `number`[] \| `Uint8Array`\<`ArrayBufferLike`\> \| `TransformableToBytes` | [packages/block/src/types.ts:170](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L170) |
| <a id="withdrawalsroot"></a> `withdrawalsRoot?` | `string` \| `number` \| `bigint` \| `number`[] \| `Uint8Array`\<`ArrayBufferLike`\> \| `TransformableToBytes` | [packages/block/src/types.ts:185](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L185) |
