[**@tevm/chains**](../README.md) • **Docs**

***

[@tevm/chains](../globals.md) / tevmDevnet

# Variable: tevmDevnet

> `const` **tevmDevnet**: [`TevmChainCommon`](../type-aliases/TevmChainCommon.md)\<`object`\>

The default chain if no fork url is passed

## Type declaration

### blockExplorers

> **blockExplorers**: `undefined` \| `object`

Collection of block explorers

### contracts

> **contracts**: `undefined` \| `object`

Collection of contracts

### custom

> **custom**: `undefined` \| `Record`\<`string`, `unknown`\>

Custom chain data.

### fees

> **fees**: `undefined` \| `ChainFees`\<`undefined`\>

Modifies how fees are derived.

### formatters

> **formatters**: `object`

Modifies how chain data structures (ie. Blocks, Transactions, etc)
are formatted & typed.

### formatters.block

> `readonly` **block**: `object`

### formatters.block.exclude

> **exclude**: `undefined` \| []

### formatters.block.format()

> **format**: (`args`) => `object`

#### Parameters

• **args**: `Assign`\<`ExactPartial`\<`RpcBlock`\<`BlockTag`, `boolean`, `RpcTransaction`\<`boolean`\>\>\>, `OpStackRpcBlockOverrides` & `object`\>

#### Returns

`object`

##### baseFeePerGas

> **baseFeePerGas**: `null` \| `bigint`

##### blobGasUsed

> **blobGasUsed**: `bigint`

##### difficulty

> **difficulty**: `bigint`

##### excessBlobGas

> **excessBlobGas**: `bigint`

##### extraData

> **extraData**: \`0x$\{string\}\`

##### gasLimit

> **gasLimit**: `bigint`

##### gasUsed

> **gasUsed**: `bigint`

##### hash

> **hash**: `null` \| \`0x$\{string\}\`

##### logsBloom

> **logsBloom**: `null` \| \`0x$\{string\}\`

##### miner

> **miner**: \`0x$\{string\}\`

##### mixHash

> **mixHash**: \`0x$\{string\}\`

##### nonce

> **nonce**: `null` \| \`0x$\{string\}\`

##### number

> **number**: `null` \| `bigint`

##### parentHash

> **parentHash**: \`0x$\{string\}\`

##### receiptsRoot

> **receiptsRoot**: \`0x$\{string\}\`

##### sealFields

> **sealFields**: \`0x$\{string\}\`[]

##### sha3Uncles

> **sha3Uncles**: \`0x$\{string\}\`

##### size

> **size**: `bigint`

##### stateRoot

> **stateRoot**: \`0x$\{string\}\`

##### timestamp

> **timestamp**: `bigint`

##### totalDifficulty

> **totalDifficulty**: `null` \| `bigint`

##### transactions

> **transactions**: \`0x$\{string\}\`[] \| `OpStackTransaction`\<`boolean`\>[]

##### transactionsRoot

> **transactionsRoot**: \`0x$\{string\}\`

##### uncles

> **uncles**: \`0x$\{string\}\`[]

##### withdrawals?

> `optional` **withdrawals**: `Withdrawal`[]

##### withdrawalsRoot?

> `optional` **withdrawalsRoot**: \`0x$\{string\}\`

### formatters.block.type

> **type**: `"block"`

### formatters.transaction

> `readonly` **transaction**: `object`

### formatters.transaction.exclude

> **exclude**: `undefined` \| []

### formatters.transaction.format()

> **format**: (`args`) => `object` \| `object` \| `object` \| `object` \| `object` \| `object` \| `object` \| `object` \| `object` \| `object`

#### Parameters

• **args**: `object` & `Omit`\<`PartialBy`\<`object`, `"yParity"`\>, `"typeHex"`\> & `object` \| `object` & `Omit`\<`TransactionBase`\<\`0x$\{string\}\`, \`0x$\{string\}\`, `boolean`\>, `"typeHex"`\> & `FeeValuesEIP1559`\<\`0x$\{string\}\`\> & `object` \| `object` & `Omit`\<`PartialBy`\<`object`, `"yParity"`\>, `"typeHex"`\> & `object` \| `object` & `Omit`\<`PartialBy`\<`object`, `"yParity"`\>, `"typeHex"`\> & `object` \| `object` & `Omit`\<`PartialBy`\<`object`, `"yParity"`\>, `"typeHex"`\> & `object` \| `object` & `Omit`\<`TransactionBase`\<\`0x$\{string\}\`, \`0x$\{string\}\`, `boolean`\>, `"typeHex"`\> & `FeeValuesEIP1559`\<\`0x$\{string\}\`\> & `object` \| `object` & `Omit`\<`PartialBy`\<`object`, `"yParity"`\>, `"typeHex"`\> & `object` \| `object` & `Omit`\<`PartialBy`\<`object`, `"yParity"`\>, `"typeHex"`\> & `object` \| `object` & `Omit`\<`PartialBy`\<`object`, `"yParity"`\>, `"typeHex"`\> & `object` \| `object` & `Omit`\<`TransactionBase`\<\`0x$\{string\}\`, \`0x$\{string\}\`, `boolean`\>, `"typeHex"`\> & `FeeValuesEIP1559`\<\`0x$\{string\}\`\> & `object` \| `object` & `Omit`\<`PartialBy`\<`object`, `"yParity"`\>, `"typeHex"`\> & `object` \| `object` & `Omit`\<`PartialBy`\<`object`, `"yParity"`\>, `"typeHex"`\> & `object` \| `object` & `Omit`\<`PartialBy`\<`object`, `"yParity"`\>, `"typeHex"`\> & `object` \| `object` & `Omit`\<`PartialBy`\<`object`, `"yParity"`\>, `"typeHex"`\> & `object` \| `object` & `Omit`\<`TransactionBase`\<\`0x$\{string\}\`, \`0x$\{string\}\`, `boolean`\>, `"typeHex"`\> & `FeeValuesEIP1559`\<\`0x$\{string\}\`\> & `object`

#### Returns

`object` \| `object` \| `object` \| `object` \| `object` \| `object` \| `object` \| `object` \| `object` \| `object`

### formatters.transaction.type

> **type**: `"transaction"`

### formatters.transactionReceipt

> `readonly` **transactionReceipt**: `object`

### formatters.transactionReceipt.exclude

> **exclude**: `undefined` \| []

### formatters.transactionReceipt.format()

> **format**: (`args`) => `object`

#### Parameters

• **args**: `Assign`\<`ExactPartial`\<`RpcTransactionReceipt`\>, `OpStackRpcTransactionReceiptOverrides`\>

#### Returns

`object`

##### blobGasPrice?

> `optional` **blobGasPrice**: `bigint`

##### blobGasUsed?

> `optional` **blobGasUsed**: `bigint`

##### blockHash

> **blockHash**: \`0x$\{string\}\`

##### blockNumber

> **blockNumber**: `bigint`

##### contractAddress

> **contractAddress**: `undefined` \| `null` \| \`0x$\{string\}\`

##### cumulativeGasUsed

> **cumulativeGasUsed**: `bigint`

##### effectiveGasPrice

> **effectiveGasPrice**: `bigint`

##### from

> **from**: \`0x$\{string\}\`

##### gasUsed

> **gasUsed**: `bigint`

##### l1Fee

> **l1Fee**: `null` \| `bigint`

##### l1FeeScalar

> **l1FeeScalar**: `null` \| `number`

##### l1GasPrice

> **l1GasPrice**: `null` \| `bigint`

##### l1GasUsed

> **l1GasUsed**: `null` \| `bigint`

##### logs

> **logs**: `Log`\<`bigint`, `number`, `false`, `undefined`, `undefined`, `undefined`, `undefined`\>[]

##### logsBloom

> **logsBloom**: \`0x$\{string\}\`

##### root?

> `optional` **root**: \`0x$\{string\}\`

##### status

> **status**: `"success"` \| `"reverted"`

##### to

> **to**: `null` \| \`0x$\{string\}\`

##### transactionHash

> **transactionHash**: \`0x$\{string\}\`

##### transactionIndex

> **transactionIndex**: `number`

##### type

> **type**: `TransactionType`

### formatters.transactionReceipt.type

> **type**: `"transactionReceipt"`

### id

> **id**: `900`

ID in number form

### name

> **name**: `"tevm-devnet"`

Human-readable name

### nativeCurrency

> **nativeCurrency**: `object`

Currency used by chain

### nativeCurrency.decimals

> `readonly` **decimals**: `18`

### nativeCurrency.name

> `readonly` **name**: `"Ether"`

### nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

### rpcUrls

> **rpcUrls**: `object`

Collection of RPC endpoints

### rpcUrls.default

> `readonly` **default**: `object`

### rpcUrls.default.http

> `readonly` **http**: readonly [`"http://127.0.0.1:8545"`]

### rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly [`"ws://127.0.0.1:8545"`]

### serializers

> **serializers**: `object`

Modifies how data (ie. Transactions) is serialized.

### serializers.transaction()

> `readonly` **transaction**: (`transaction`, `signature`?) => \`0x02$\{string\}\` \| \`0x01$\{string\}\` \| \`0x03$\{string\}\` \| `TransactionSerializedLegacy` \| \`0x7e$\{string\}\`

#### Parameters

• **transaction**: `OpStackTransactionSerializable`

• **signature?**: `Signature`

#### Returns

\`0x02$\{string\}\` \| \`0x01$\{string\}\` \| \`0x03$\{string\}\` \| `TransactionSerializedLegacy` \| \`0x7e$\{string\}\`

### sourceId?

> `optional` **sourceId**: `number`

Source Chain ID (ie. the L1 chain)

### testnet

> **testnet**: `true`

Flag for test networks

## Source

[packages/chains/src/index.ts:53](https://github.com/evmts/tevm-monorepo/blob/main/packages/chains/src/index.ts#L53)
