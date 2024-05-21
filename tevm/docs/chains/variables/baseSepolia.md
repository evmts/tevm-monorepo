[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [chains](../README.md) / baseSepolia

# Variable: baseSepolia

> `const` **baseSepolia**: [`TevmChainCommon`](../type-aliases/TevmChainCommon.md)\<`object`\>

## Type declaration

### blockExplorers

> **blockExplorers**: `object`

### blockExplorers.default

> `readonly` **default**: `object`

### blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://api-sepolia.basescan.org/api"`

### blockExplorers.default.name

> `readonly` **name**: `"Basescan"`

### blockExplorers.default.url

> `readonly` **url**: `"https://sepolia.basescan.org"`

### contracts

> **contracts**: `object`

### contracts.gasPriceOracle

> `readonly` **gasPriceOracle**: `object`

### contracts.gasPriceOracle.address

> `readonly` **address**: `"0x420000000000000000000000000000000000000F"`

### contracts.l1Block

> `readonly` **l1Block**: `object`

### contracts.l1Block.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000015"`

### contracts.l1StandardBridge

> `readonly` **l1StandardBridge**: `object`

### contracts.l1StandardBridge.11155111

> `readonly` **11155111**: `object`

### contracts.l1StandardBridge.11155111.address

> `readonly` **address**: `"0xfd0Bf71F60660E2f608ed56e1659C450eB113120"`

### contracts.l1StandardBridge.11155111.blockCreated

> `readonly` **blockCreated**: `4446677`

### contracts.l2CrossDomainMessenger

> `readonly` **l2CrossDomainMessenger**: `object`

### contracts.l2CrossDomainMessenger.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000007"`

### contracts.l2Erc721Bridge

> `readonly` **l2Erc721Bridge**: `object`

### contracts.l2Erc721Bridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000014"`

### contracts.l2OutputOracle

> `readonly` **l2OutputOracle**: `object`

### contracts.l2OutputOracle.11155111

> `readonly` **11155111**: `object`

### contracts.l2OutputOracle.11155111.address

> `readonly` **address**: `"0x84457ca9D0163FbC4bbfe4Dfbb20ba46e48DF254"`

### contracts.l2StandardBridge

> `readonly` **l2StandardBridge**: `object`

### contracts.l2StandardBridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000010"`

### contracts.l2ToL1MessagePasser

> `readonly` **l2ToL1MessagePasser**: `object`

### contracts.l2ToL1MessagePasser.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000016"`

### contracts.multicall3

> `readonly` **multicall3**: `object`

### contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

### contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `1059647`

### contracts.portal

> `readonly` **portal**: `object`

### contracts.portal.11155111

> `readonly` **11155111**: `object`

### contracts.portal.11155111.address

> `readonly` **address**: `"0x49f53e41452c74589e85ca1677426ba426459e85"`

### contracts.portal.11155111.blockCreated

> `readonly` **blockCreated**: `4446677`

### custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

### fees?

> `optional` **fees**: `ChainFees`

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

> **id**: `84532`

### name

> **name**: `"Base Sepolia"`

### nativeCurrency

> **nativeCurrency**: `object`

### nativeCurrency.decimals

> `readonly` **decimals**: `18`

### nativeCurrency.name

> `readonly` **name**: `"Sepolia Ether"`

### nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

### network

> `readonly` **network**: `"base-sepolia"`

### rpcUrls

> **rpcUrls**: `object`

### rpcUrls.default

> `readonly` **default**: `object`

### rpcUrls.default.http

> `readonly` **http**: readonly [`"https://sepolia.base.org"`]

### serializers

> **serializers**: `object`

### serializers.transaction

> `readonly` **transaction**: `serializeTransactionOpStack`

### sourceId

> **sourceId**: `11155111`

### testnet

> **testnet**: `true`

## Source

packages/chains/types/index.d.ts:4416
