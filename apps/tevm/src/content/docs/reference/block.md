### Block

Ƭ **Block**: `Object`

Header information of an ethereum block

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `baseFeePerGas?` | `bigint` | (Optional) The base fee per gas in the block, introduced in EIP-1559 for dynamic transaction fee calculation. |
| `blobGasPrice?` | `bigint` | The gas price for the block; may be undefined in blocks after EIP-1559. |
| `coinbase` | `Address` | The address of the miner or validator who mined or validated the block. |
| `difficulty` | `bigint` | The difficulty level of the block (relevant in PoW chains). |
| `gasLimit` | `bigint` | The gas limit for the block, i.e., the maximum amount of gas that can be used by the transactions in the block. |
| `number` | `bigint` | The block number (height) in the blockchain. |
| `timestamp` | `bigint` | The timestamp at which the block was mined or validated. |

#### Defined in

[common/Block.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/common/Block.ts#L6)

___

### BlockResult

Ƭ **BlockResult**: `Object`

The type returned by block related
json rpc procedures

#### Type declaration

| Name | Type |
| :------ | :------ |
| `difficulty` | `Hex` |
| `extraData` | `Hex` |
| `gasLimit` | `Hex` |
| `gasUsed` | `Hex` |
| `hash` | `Hex` |
| `logsBloom` | `Hex` |
| `miner` | `Hex` |
| `nonce` | `Hex` |
| `number` | `Hex` |
| `parentHash` | `Hex` |
| `sha3Uncles` | `Hex` |
| `size` | `Hex` |
| `stateRoot` | `Hex` |
| `timestamp` | `Hex` |
| `totalDifficulty` | `Hex` |
| `transactions` | `Hex`[] |
| `transactionsRoot` | `Hex` |
| `uncles` | `Hex`[] |

#### Defined in

[common/BlockResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/common/BlockResult.ts#L7)

___
