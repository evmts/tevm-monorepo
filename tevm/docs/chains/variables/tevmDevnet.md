[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [chains](../README.md) / tevmDevnet

# Variable: tevmDevnet

> `const` **tevmDevnet**: [`TevmChainCommon`](../type-aliases/TevmChainCommon.md)\<`object`\>

The default chain if no fork url is passed

## Type declaration

### blockExplorers

> **blockExplorers**: `object` \| `undefined`

### contracts

> **contracts**: `object` \| `undefined`

### custom

> **custom**: `Record`\<`string`, `unknown`\> \| `undefined`

### fees

> **fees**: `ChainFees` \| `undefined`

### formatters

> **formatters**: `object`

### formatters.block

> `readonly` **block**: `object`

### formatters.block.exclude

> **exclude**: [] \| `undefined`

### formatters.block.format()

> **format**: (`args`) => `object`

#### Parameters

• **args**: `Assign`

#### Returns

`object`

##### baseFeePerGas

> **baseFeePerGas**: `bigint` \| `null`

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

> **hash**: \`0x$\{string\}\` \| `null`

##### logsBloom

> **logsBloom**: \`0x$\{string\}\` \| `null`

##### miner

> **miner**: \`0x$\{string\}\`

##### mixHash

> **mixHash**: \`0x$\{string\}\`

##### nonce

> **nonce**: \`0x$\{string\}\` \| `null`

##### number

> **number**: `bigint` \| `null`

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

> **totalDifficulty**: `bigint` \| `null`

##### transactions

> **transactions**: \`0x$\{string\}\`[] \| `OpStackTransaction`[]

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

> **exclude**: [] \| `undefined`

### formatters.transaction.format()

> **format**: (`args`) => `object` \| `object` \| `object` \| `object` \| `object` \| `object` \| `object` \| `object` \| `object` \| `object`

#### Parameters

• **args**: `object` & `Omit` & `object` \| `object` & `Omit`\<`TransactionBase`, `"typeHex"`\> & `FeeValuesEIP1559` & `object` \| `object` & `Omit` & `object` \| `object` & `Omit` & `object` \| `object` & `Omit` & `object` \| `object` & `Omit`\<`TransactionBase`, `"typeHex"`\> & `FeeValuesEIP1559` & `object` \| `object` & `Omit` & `object` \| `object` & `Omit` & `object` \| `object` & `Omit` & `object` \| `object` & `Omit`\<`TransactionBase`, `"typeHex"`\> & `FeeValuesEIP1559` & `object` \| `object` & `Omit` & `object` \| `object` & `Omit` & `object` \| `object` & `Omit` & `object` \| `object` & `Omit` & `object` \| `object` & `Omit`\<`TransactionBase`, `"typeHex"`\> & `FeeValuesEIP1559` & `object`

#### Returns

`object` \| `object` \| `object` \| `object` \| `object` \| `object` \| `object` \| `object` \| `object` \| `object`

### formatters.transaction.type

> **type**: `"transaction"`

### formatters.transactionReceipt

> `readonly` **transactionReceipt**: `object`

### formatters.transactionReceipt.exclude

> **exclude**: [] \| `undefined`

### formatters.transactionReceipt.format()

> **format**: (`args`) => `object`

#### Parameters

• **args**: `Assign`

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

> **contractAddress**: \`0x$\{string\}\` \| `null` \| `undefined`

##### cumulativeGasUsed

> **cumulativeGasUsed**: `bigint`

##### effectiveGasPrice

> **effectiveGasPrice**: `bigint`

##### from

> **from**: \`0x$\{string\}\`

##### gasUsed

> **gasUsed**: `bigint`

##### l1Fee

> **l1Fee**: `bigint` \| `null`

##### l1FeeScalar

> **l1FeeScalar**: `number` \| `null`

##### l1GasPrice

> **l1GasPrice**: `bigint` \| `null`

##### l1GasUsed

> **l1GasUsed**: `bigint` \| `null`

##### logs

> **logs**: `Log`[]

##### logsBloom

> **logsBloom**: \`0x$\{string\}\`

##### root?

> `optional` **root**: \`0x$\{string\}\`

##### status

> **status**: `"success"` \| `"reverted"`

##### to

> **to**: \`0x$\{string\}\` \| `null`

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

### name

> **name**: `"tevm-devnet"`

### nativeCurrency

> **nativeCurrency**: `object`

### nativeCurrency.decimals

> `readonly` **decimals**: `18`

### nativeCurrency.name

> `readonly` **name**: `"Ether"`

### nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

### rpcUrls

> **rpcUrls**: `object`

### rpcUrls.default

> `readonly` **default**: `object`

### rpcUrls.default.http

> `readonly` **http**: readonly [`"http://127.0.0.1:8545"`]

### rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly [`"ws://127.0.0.1:8545"`]

### serializers

> **serializers**: `object`

### serializers.transaction

> `readonly` **transaction**: `serializeTransactionOpStack`

### sourceId?

> `optional` **sourceId**: `number`

### testnet

> **testnet**: `true`

## Source

packages/chains/types/index.d.ts:22
