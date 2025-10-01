[**@tevm/whatsabi**](../README.md)

***

[@tevm/whatsabi](../globals.md) / knownChains

# Variable: knownChains

> `const` **knownChains**: `object`

Defined in: [bundler-packages/whatsabi/src/knownChains.js:6](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/whatsabi/src/knownChains.js#L6)

## Type Declaration

### 1

> **1**: `object` = `chains.mainnet`

#### 1.blockExplorers

> **blockExplorers**: `object`

#### 1.blockExplorers.default

> `readonly` **default**: `object`

#### 1.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://api.etherscan.io/api"`

#### 1.blockExplorers.default.name

> `readonly` **name**: `"Etherscan"`

#### 1.blockExplorers.default.url

> `readonly` **url**: `"https://etherscan.io"`

#### 1.contracts

> **contracts**: `object`

#### 1.contracts.ensRegistry

> `readonly` **ensRegistry**: `object`

#### 1.contracts.ensRegistry.address

> `readonly` **address**: `"0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"`

#### 1.contracts.ensUniversalResolver

> `readonly` **ensUniversalResolver**: `object`

#### 1.contracts.ensUniversalResolver.address

> `readonly` **address**: `"0xce01f8eee7E479C928F8919abD53E553a36CeF67"`

#### 1.contracts.ensUniversalResolver.blockCreated

> `readonly` **blockCreated**: `19258213`

#### 1.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 1.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 1.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `14353601`

#### 1.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 1.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 1.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 1.formatters?

> `optional` **formatters**: `undefined`

#### 1.id

> **id**: `1`

#### 1.name

> **name**: `"Ethereum"`

#### 1.nativeCurrency

> **nativeCurrency**: `object`

#### 1.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 1.nativeCurrency.name

> `readonly` **name**: `"Ether"`

#### 1.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 1.rpcUrls

> **rpcUrls**: `object`

#### 1.rpcUrls.default

> `readonly` **default**: `object`

#### 1.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://eth.merkle.io"`\]

#### 1.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 1.sourceId?

> `optional` **sourceId**: `number`

#### 1.testnet?

> `optional` **testnet**: `boolean`

### 10

> **10**: `object` = `chains.optimism`

#### 10.blockExplorers

> **blockExplorers**: `object`

#### 10.blockExplorers.default

> `readonly` **default**: `object`

#### 10.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://api-optimistic.etherscan.io/api"`

#### 10.blockExplorers.default.name

> `readonly` **name**: `"Optimism Explorer"`

#### 10.blockExplorers.default.url

> `readonly` **url**: `"https://optimistic.etherscan.io"`

#### 10.contracts

> **contracts**: `object`

#### 10.contracts.disputeGameFactory

> `readonly` **disputeGameFactory**: `object`

#### 10.contracts.disputeGameFactory.1

> `readonly` **1**: `object`

#### 10.contracts.disputeGameFactory.1.address

> `readonly` **address**: `"0xe5965Ab5962eDc7477C8520243A95517CD252fA9"`

#### 10.contracts.gasPriceOracle

> `readonly` **gasPriceOracle**: `object`

#### 10.contracts.gasPriceOracle.address

> `readonly` **address**: `"0x420000000000000000000000000000000000000F"`

#### 10.contracts.l1Block

> `readonly` **l1Block**: `object`

#### 10.contracts.l1Block.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000015"`

#### 10.contracts.l1StandardBridge

> `readonly` **l1StandardBridge**: `object`

#### 10.contracts.l1StandardBridge.1

> `readonly` **1**: `object`

#### 10.contracts.l1StandardBridge.1.address

> `readonly` **address**: `"0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"`

#### 10.contracts.l2CrossDomainMessenger

> `readonly` **l2CrossDomainMessenger**: `object`

#### 10.contracts.l2CrossDomainMessenger.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000007"`

#### 10.contracts.l2Erc721Bridge

> `readonly` **l2Erc721Bridge**: `object`

#### 10.contracts.l2Erc721Bridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000014"`

#### 10.contracts.l2OutputOracle

> `readonly` **l2OutputOracle**: `object`

#### 10.contracts.l2OutputOracle.1

> `readonly` **1**: `object`

#### 10.contracts.l2OutputOracle.1.address

> `readonly` **address**: `"0xdfe97868233d1aa22e815a266982f2cf17685a27"`

#### 10.contracts.l2StandardBridge

> `readonly` **l2StandardBridge**: `object`

#### 10.contracts.l2StandardBridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000010"`

#### 10.contracts.l2ToL1MessagePasser

> `readonly` **l2ToL1MessagePasser**: `object`

#### 10.contracts.l2ToL1MessagePasser.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000016"`

#### 10.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 10.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 10.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `4286263`

#### 10.contracts.portal

> `readonly` **portal**: `object`

#### 10.contracts.portal.1

> `readonly` **1**: `object`

#### 10.contracts.portal.1.address

> `readonly` **address**: `"0xbEb5Fc579115071764c7423A4f12eDde41f106Ed"`

#### 10.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 10.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 10.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 10.formatters

> **formatters**: `object`

#### 10.formatters.block

> `readonly` **block**: `object`

#### 10.formatters.block.exclude

> **exclude**: `undefined` \| \[\]

#### 10.formatters.block.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`OpStackRpcBlock`\<`BlockTag`, `boolean`\>

##### Returns

`object`

###### baseFeePerGas

> **baseFeePerGas**: `null` \| `bigint`

###### blobGasUsed

> **blobGasUsed**: `bigint`

###### difficulty

> **difficulty**: `bigint`

###### excessBlobGas

> **excessBlobGas**: `bigint`

###### extraData

> **extraData**: `` `0x${string}` ``

###### gasLimit

> **gasLimit**: `bigint`

###### gasUsed

> **gasUsed**: `bigint`

###### hash

> **hash**: `null` \| `` `0x${string}` ``

###### logsBloom

> **logsBloom**: `null` \| `` `0x${string}` ``

###### miner

> **miner**: `` `0x${string}` ``

###### mixHash

> **mixHash**: `` `0x${string}` ``

###### nonce

> **nonce**: `null` \| `` `0x${string}` ``

###### number

> **number**: `null` \| `bigint`

###### parentBeaconBlockRoot?

> `optional` **parentBeaconBlockRoot**: `` `0x${string}` ``

###### parentHash

> **parentHash**: `` `0x${string}` ``

###### receiptsRoot

> **receiptsRoot**: `` `0x${string}` ``

###### sealFields

> **sealFields**: `` `0x${string}` ``[]

###### sha3Uncles

> **sha3Uncles**: `` `0x${string}` ``

###### size

> **size**: `bigint`

###### stateRoot

> **stateRoot**: `` `0x${string}` ``

###### timestamp

> **timestamp**: `bigint`

###### totalDifficulty

> **totalDifficulty**: `null` \| `bigint`

###### transactions

> **transactions**: `` `0x${string}` ``[] \| `OpStackTransaction`\<`boolean`\>[]

###### transactionsRoot

> **transactionsRoot**: `` `0x${string}` ``

###### uncles

> **uncles**: `` `0x${string}` ``[]

###### withdrawals?

> `optional` **withdrawals**: `Withdrawal`[]

###### withdrawalsRoot?

> `optional` **withdrawalsRoot**: `` `0x${string}` ``

#### 10.formatters.block.type

> **type**: `"block"`

#### 10.formatters.transaction

> `readonly` **transaction**: `object`

#### 10.formatters.transaction.exclude

> **exclude**: `undefined` \| \[\]

#### 10.formatters.transaction.format()

> **format**: (`args`) => \{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

##### Parameters

###### args

`OpStackRpcTransaction`\<`boolean`\>

##### Returns

\{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

#### 10.formatters.transaction.type

> **type**: `"transaction"`

#### 10.formatters.transactionReceipt

> `readonly` **transactionReceipt**: `object`

#### 10.formatters.transactionReceipt.exclude

> **exclude**: `undefined` \| \[\]

#### 10.formatters.transactionReceipt.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`OpStackRpcTransactionReceipt`

##### Returns

`object`

###### blobGasPrice?

> `optional` **blobGasPrice**: `bigint`

###### blobGasUsed?

> `optional` **blobGasUsed**: `bigint`

###### blockHash

> **blockHash**: `` `0x${string}` ``

###### blockNumber

> **blockNumber**: `bigint`

###### contractAddress

> **contractAddress**: `undefined` \| `null` \| `` `0x${string}` ``

###### cumulativeGasUsed

> **cumulativeGasUsed**: `bigint`

###### effectiveGasPrice

> **effectiveGasPrice**: `bigint`

###### from

> **from**: `` `0x${string}` ``

###### gasUsed

> **gasUsed**: `bigint`

###### l1Fee

> **l1Fee**: `null` \| `bigint`

###### l1FeeScalar

> **l1FeeScalar**: `null` \| `number`

###### l1GasPrice

> **l1GasPrice**: `null` \| `bigint`

###### l1GasUsed

> **l1GasUsed**: `null` \| `bigint`

###### logs

> **logs**: `Log`\<`bigint`, `number`, `false`, `undefined`, `undefined`, `undefined`, `undefined`\>[]

###### logsBloom

> **logsBloom**: `` `0x${string}` ``

###### root?

> `optional` **root**: `` `0x${string}` ``

###### status

> **status**: `"success"` \| `"reverted"`

###### to

> **to**: `null` \| `` `0x${string}` ``

###### transactionHash

> **transactionHash**: `` `0x${string}` ``

###### transactionIndex

> **transactionIndex**: `number`

###### type

> **type**: `TransactionType`

#### 10.formatters.transactionReceipt.type

> **type**: `"transactionReceipt"`

#### 10.id

> **id**: `10`

#### 10.name

> **name**: `"OP Mainnet"`

#### 10.nativeCurrency

> **nativeCurrency**: `object`

#### 10.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 10.nativeCurrency.name

> `readonly` **name**: `"Ether"`

#### 10.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 10.rpcUrls

> **rpcUrls**: `object`

#### 10.rpcUrls.default

> `readonly` **default**: `object`

#### 10.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://mainnet.optimism.io"`\]

#### 10.serializers

> **serializers**: `object`

#### 10.serializers.transaction()

> `readonly` **transaction**: (`transaction`, `signature?`) => `` `0x02${string}` `` \| `` `0x01${string}` `` \| `` `0x03${string}` `` \| `` `0x04${string}` `` \| `TransactionSerializedLegacy` \| `` `0x7e${string}` ``

##### Parameters

###### transaction

`OpStackTransactionSerializable`

###### signature?

`Signature`

##### Returns

`` `0x02${string}` `` \| `` `0x01${string}` `` \| `` `0x03${string}` `` \| `` `0x04${string}` `` \| `TransactionSerializedLegacy` \| `` `0x7e${string}` ``

#### 10.sourceId

> **sourceId**: `1`

#### 10.testnet?

> `optional` **testnet**: `boolean`

### 100

> **100**: `object` = `chains.gnosis`

#### 100.blockExplorers

> **blockExplorers**: `object`

#### 100.blockExplorers.default

> `readonly` **default**: `object`

#### 100.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://api.gnosisscan.io/api"`

#### 100.blockExplorers.default.name

> `readonly` **name**: `"Gnosisscan"`

#### 100.blockExplorers.default.url

> `readonly` **url**: `"https://gnosisscan.io"`

#### 100.contracts

> **contracts**: `object`

#### 100.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 100.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 100.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `21022491`

#### 100.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 100.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 100.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 100.formatters?

> `optional` **formatters**: `undefined`

#### 100.id

> **id**: `100`

#### 100.name

> **name**: `"Gnosis"`

#### 100.nativeCurrency

> **nativeCurrency**: `object`

#### 100.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 100.nativeCurrency.name

> `readonly` **name**: `"xDAI"`

#### 100.nativeCurrency.symbol

> `readonly` **symbol**: `"XDAI"`

#### 100.rpcUrls

> **rpcUrls**: `object`

#### 100.rpcUrls.default

> `readonly` **default**: `object`

#### 100.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.gnosischain.com"`\]

#### 100.rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly \[`"wss://rpc.gnosischain.com/wss"`\]

#### 100.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 100.sourceId?

> `optional` **sourceId**: `number`

#### 100.testnet?

> `optional` **testnet**: `boolean`

### 100009

> **100009**: `object` = `chains.vechain`

#### 100009.blockExplorers

> **blockExplorers**: `object`

#### 100009.blockExplorers.default

> `readonly` **default**: `object`

#### 100009.blockExplorers.default.name

> `readonly` **name**: `"Vechain Explorer"`

#### 100009.blockExplorers.default.url

> `readonly` **url**: `"https://explore.vechain.org"`

#### 100009.blockExplorers.vechainStats

> `readonly` **vechainStats**: `object`

#### 100009.blockExplorers.vechainStats.name

> `readonly` **name**: `"Vechain Stats"`

#### 100009.blockExplorers.vechainStats.url

> `readonly` **url**: `"https://vechainstats.com"`

#### 100009.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 100009.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 100009.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 100009.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 100009.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 100009.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 100009.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 100009.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 100009.formatters?

> `optional` **formatters**: `undefined`

#### 100009.id

> **id**: `100009`

#### 100009.name

> **name**: `"Vechain"`

#### 100009.nativeCurrency

> **nativeCurrency**: `object`

#### 100009.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 100009.nativeCurrency.name

> `readonly` **name**: `"VeChain"`

#### 100009.nativeCurrency.symbol

> `readonly` **symbol**: `"VET"`

#### 100009.rpcUrls

> **rpcUrls**: `object`

#### 100009.rpcUrls.default

> `readonly` **default**: `object`

#### 100009.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://mainnet.vechain.org"`\]

#### 100009.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 100009.sourceId?

> `optional` **sourceId**: `number`

#### 100009.testnet?

> `optional` **testnet**: `boolean`

### 1004

> **1004**: `object` = `chains.ektaTestnet`

#### 1004.blockExplorers

> **blockExplorers**: `object`

#### 1004.blockExplorers.default

> `readonly` **default**: `object`

#### 1004.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://test.ektascan.io/api"`

#### 1004.blockExplorers.default.name

> `readonly` **name**: `"Test Ektascan"`

#### 1004.blockExplorers.default.url

> `readonly` **url**: `"https://test.ektascan.io"`

#### 1004.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 1004.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 1004.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 1004.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 1004.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 1004.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 1004.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 1004.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 1004.formatters?

> `optional` **formatters**: `undefined`

#### 1004.id

> **id**: `1004`

#### 1004.name

> **name**: `"Ekta Testnet"`

#### 1004.nativeCurrency

> **nativeCurrency**: `object`

#### 1004.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 1004.nativeCurrency.name

> `readonly` **name**: `"EKTA"`

#### 1004.nativeCurrency.symbol

> `readonly` **symbol**: `"EKTA"`

#### 1004.rpcUrls

> **rpcUrls**: `object`

#### 1004.rpcUrls.default

> `readonly` **default**: `object`

#### 1004.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://test.ekta.io:8545"`\]

#### 1004.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 1004.sourceId?

> `optional` **sourceId**: `number`

#### 1004.testnet

> **testnet**: `true`

### 1039

> **1039**: `object` = `chains.bronos`

#### 1039.blockExplorers

> **blockExplorers**: `object`

#### 1039.blockExplorers.default

> `readonly` **default**: `object`

#### 1039.blockExplorers.default.name

> `readonly` **name**: `"BronoScan"`

#### 1039.blockExplorers.default.url

> `readonly` **url**: `"https://broscan.bronos.org"`

#### 1039.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 1039.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 1039.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 1039.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 1039.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 1039.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 1039.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 1039.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 1039.formatters?

> `optional` **formatters**: `undefined`

#### 1039.id

> **id**: `1039`

#### 1039.name

> **name**: `"Bronos"`

#### 1039.nativeCurrency

> **nativeCurrency**: `object`

#### 1039.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 1039.nativeCurrency.name

> `readonly` **name**: `"BRO"`

#### 1039.nativeCurrency.symbol

> `readonly` **symbol**: `"BRO"`

#### 1039.rpcUrls

> **rpcUrls**: `object`

#### 1039.rpcUrls.default

> `readonly` **default**: `object`

#### 1039.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://evm.bronos.org"`\]

#### 1039.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 1039.sourceId?

> `optional` **sourceId**: `number`

#### 1039.testnet?

> `optional` **testnet**: `boolean`

### 105105

> **105105**: `object` = `chains.stratis`

#### 105105.blockExplorers

> **blockExplorers**: `object`

#### 105105.blockExplorers.default

> `readonly` **default**: `object`

#### 105105.blockExplorers.default.name

> `readonly` **name**: `"Stratis Explorer"`

#### 105105.blockExplorers.default.url

> `readonly` **url**: `"https://explorer.stratisevm.com"`

#### 105105.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 105105.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 105105.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 105105.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 105105.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 105105.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 105105.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 105105.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 105105.formatters?

> `optional` **formatters**: `undefined`

#### 105105.id

> **id**: `105105`

#### 105105.name

> **name**: `"Stratis Mainnet"`

#### 105105.nativeCurrency

> **nativeCurrency**: `object`

#### 105105.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 105105.nativeCurrency.name

> `readonly` **name**: `"Stratis"`

#### 105105.nativeCurrency.symbol

> `readonly` **symbol**: `"STRAX"`

#### 105105.network

> `readonly` **network**: `"stratis"`

#### 105105.rpcUrls

> **rpcUrls**: `object`

#### 105105.rpcUrls.default

> `readonly` **default**: `object`

#### 105105.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.stratisevm.com"`\]

#### 105105.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 105105.sourceId?

> `optional` **sourceId**: `number`

#### 105105.testnet?

> `optional` **testnet**: `boolean`

### 1088

> **1088**: `object` = `chains.metis`

#### 1088.blockExplorers

> **blockExplorers**: `object`

#### 1088.blockExplorers.default

> `readonly` **default**: `object`

#### 1088.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://api.routescan.io/v2/network/mainnet/evm/1088/etherscan/api"`

#### 1088.blockExplorers.default.name

> `readonly` **name**: `"Metis Explorer"`

#### 1088.blockExplorers.default.url

> `readonly` **url**: `"https://explorer.metis.io"`

#### 1088.contracts

> **contracts**: `object`

#### 1088.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 1088.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 1088.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `2338552`

#### 1088.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 1088.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 1088.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 1088.formatters?

> `optional` **formatters**: `undefined`

#### 1088.id

> **id**: `1088`

#### 1088.name

> **name**: `"Metis"`

#### 1088.nativeCurrency

> **nativeCurrency**: `object`

#### 1088.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 1088.nativeCurrency.name

> `readonly` **name**: `"Metis"`

#### 1088.nativeCurrency.symbol

> `readonly` **symbol**: `"METIS"`

#### 1088.rpcUrls

> **rpcUrls**: `object`

#### 1088.rpcUrls.default

> `readonly` **default**: `object`

#### 1088.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://metis.rpc.hypersync.xyz"`, `"https://metis-pokt.nodies.app"`, `"https://api.blockeden.xyz/metis/67nCBdZQSH9z3YqDDjdm"`, `"https://metis-andromeda.rpc.thirdweb.com"`, `"https://metis-andromeda.gateway.tenderly.co"`, `"https://metis.api.onfinality.io/public"`, `"https://andromeda.metis.io/?owner=1088"`, `"https://metis-mainnet.public.blastapi.io"`\]

#### 1088.rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly \[`"wss://metis-rpc.publicnode.com"`, `"wss://metis.drpc.org"`\]

#### 1088.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 1088.sourceId?

> `optional` **sourceId**: `number`

#### 1088.testnet?

> `optional` **testnet**: `boolean`

### 109

> **109**: `object` = `chains.shibarium`

#### 109.blockExplorers

> **blockExplorers**: `object`

#### 109.blockExplorers.default

> `readonly` **default**: `object`

#### 109.blockExplorers.default.name

> `readonly` **name**: `"Blockscout"`

#### 109.blockExplorers.default.url

> `readonly` **url**: `"https://shibariumscan.io"`

#### 109.contracts

> **contracts**: `object`

#### 109.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 109.contracts.multicall3.address

> `readonly` **address**: `"0x864Bf681ADD6052395188A89101A1B37d3B4C961"`

#### 109.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `265900`

#### 109.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 109.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 109.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 109.formatters?

> `optional` **formatters**: `undefined`

#### 109.id

> **id**: `109`

#### 109.name

> **name**: `"Shibarium"`

#### 109.nativeCurrency

> **nativeCurrency**: `object`

#### 109.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 109.nativeCurrency.name

> `readonly` **name**: `"Bone"`

#### 109.nativeCurrency.symbol

> `readonly` **symbol**: `"BONE"`

#### 109.network

> `readonly` **network**: `"shibarium"`

#### 109.rpcUrls

> **rpcUrls**: `object`

#### 109.rpcUrls.default

> `readonly` **default**: `object`

#### 109.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.shibrpc.com"`\]

#### 109.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 109.sourceId?

> `optional` **sourceId**: `number`

#### 109.testnet?

> `optional` **testnet**: `boolean`

### 1111

> **1111**: `object` = `chains.wemix`

#### 1111.blockExplorers

> **blockExplorers**: `object`

#### 1111.blockExplorers.default

> `readonly` **default**: `object`

#### 1111.blockExplorers.default.name

> `readonly` **name**: `"wemixExplorer"`

#### 1111.blockExplorers.default.url

> `readonly` **url**: `"https://explorer.wemix.com"`

#### 1111.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 1111.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 1111.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 1111.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 1111.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 1111.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 1111.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 1111.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 1111.formatters?

> `optional` **formatters**: `undefined`

#### 1111.id

> **id**: `1111`

#### 1111.name

> **name**: `"WEMIX"`

#### 1111.nativeCurrency

> **nativeCurrency**: `object`

#### 1111.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 1111.nativeCurrency.name

> `readonly` **name**: `"WEMIX"`

#### 1111.nativeCurrency.symbol

> `readonly` **symbol**: `"WEMIX"`

#### 1111.network

> `readonly` **network**: `"wemix-mainnet"`

#### 1111.rpcUrls

> **rpcUrls**: `object`

#### 1111.rpcUrls.default

> `readonly` **default**: `object`

#### 1111.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://api.wemix.com"`\]

#### 1111.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 1111.sourceId?

> `optional` **sourceId**: `number`

#### 1111.testnet?

> `optional` **testnet**: `boolean`

### 111188

> **111188**: `object` = `chains.real`

#### 111188.blockExplorers

> **blockExplorers**: `object`

#### 111188.blockExplorers.default

> `readonly` **default**: `object`

#### 111188.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://explorer.re.al/api/v2"`

#### 111188.blockExplorers.default.name

> `readonly` **name**: `"re.al Explorer"`

#### 111188.blockExplorers.default.url

> `readonly` **url**: `"https://explorer.re.al"`

#### 111188.contracts

> **contracts**: `object`

#### 111188.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 111188.contracts.multicall3.address

> `readonly` **address**: `"0xcA11bde05977b3631167028862bE2a173976CA11"`

#### 111188.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `695`

#### 111188.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 111188.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 111188.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 111188.formatters?

> `optional` **formatters**: `undefined`

#### 111188.id

> **id**: `111188`

#### 111188.name

> **name**: `"re.al"`

#### 111188.nativeCurrency

> **nativeCurrency**: `object`

#### 111188.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 111188.nativeCurrency.name

> `readonly` **name**: `"reETH"`

#### 111188.nativeCurrency.symbol

> `readonly` **symbol**: `"reETH"`

#### 111188.rpcUrls

> **rpcUrls**: `object`

#### 111188.rpcUrls.default

> `readonly` **default**: `object`

#### 111188.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.realforreal.gelato.digital"`\]

#### 111188.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 111188.sourceId?

> `optional` **sourceId**: `number`

#### 111188.testnet?

> `optional` **testnet**: `boolean`

### 11155111

> **11155111**: `object` = `chains.sepolia`

#### 11155111.blockExplorers

> **blockExplorers**: `object`

#### 11155111.blockExplorers.default

> `readonly` **default**: `object`

#### 11155111.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://api-sepolia.etherscan.io/api"`

#### 11155111.blockExplorers.default.name

> `readonly` **name**: `"Etherscan"`

#### 11155111.blockExplorers.default.url

> `readonly` **url**: `"https://sepolia.etherscan.io"`

#### 11155111.contracts

> **contracts**: `object`

#### 11155111.contracts.ensRegistry

> `readonly` **ensRegistry**: `object`

#### 11155111.contracts.ensRegistry.address

> `readonly` **address**: `"0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"`

#### 11155111.contracts.ensUniversalResolver

> `readonly` **ensUniversalResolver**: `object`

#### 11155111.contracts.ensUniversalResolver.address

> `readonly` **address**: `"0xc8Af999e38273D658BE1b921b88A9Ddf005769cC"`

#### 11155111.contracts.ensUniversalResolver.blockCreated

> `readonly` **blockCreated**: `5317080`

#### 11155111.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 11155111.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 11155111.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `751532`

#### 11155111.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 11155111.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 11155111.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 11155111.formatters?

> `optional` **formatters**: `undefined`

#### 11155111.id

> **id**: `11155111`

#### 11155111.name

> **name**: `"Sepolia"`

#### 11155111.nativeCurrency

> **nativeCurrency**: `object`

#### 11155111.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 11155111.nativeCurrency.name

> `readonly` **name**: `"Sepolia Ether"`

#### 11155111.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 11155111.rpcUrls

> **rpcUrls**: `object`

#### 11155111.rpcUrls.default

> `readonly` **default**: `object`

#### 11155111.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://sepolia.drpc.org"`\]

#### 11155111.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 11155111.sourceId?

> `optional` **sourceId**: `number`

#### 11155111.testnet

> **testnet**: `true`

### 11155420

> **11155420**: `object` = `chains.optimismSepolia`

#### 11155420.blockExplorers

> **blockExplorers**: `object`

#### 11155420.blockExplorers.default

> `readonly` **default**: `object`

#### 11155420.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://optimism-sepolia.blockscout.com/api"`

#### 11155420.blockExplorers.default.name

> `readonly` **name**: `"Blockscout"`

#### 11155420.blockExplorers.default.url

> `readonly` **url**: `"https://optimism-sepolia.blockscout.com"`

#### 11155420.contracts

> **contracts**: `object`

#### 11155420.contracts.disputeGameFactory

> `readonly` **disputeGameFactory**: `object`

#### 11155420.contracts.disputeGameFactory.11155111

> `readonly` **11155111**: `object`

#### 11155420.contracts.disputeGameFactory.11155111.address

> `readonly` **address**: `"0x05F9613aDB30026FFd634f38e5C4dFd30a197Fa1"`

#### 11155420.contracts.gasPriceOracle

> `readonly` **gasPriceOracle**: `object`

#### 11155420.contracts.gasPriceOracle.address

> `readonly` **address**: `"0x420000000000000000000000000000000000000F"`

#### 11155420.contracts.l1Block

> `readonly` **l1Block**: `object`

#### 11155420.contracts.l1Block.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000015"`

#### 11155420.contracts.l1StandardBridge

> `readonly` **l1StandardBridge**: `object`

#### 11155420.contracts.l1StandardBridge.11155111

> `readonly` **11155111**: `object`

#### 11155420.contracts.l1StandardBridge.11155111.address

> `readonly` **address**: `"0xFBb0621E0B23b5478B630BD55a5f21f67730B0F1"`

#### 11155420.contracts.l2CrossDomainMessenger

> `readonly` **l2CrossDomainMessenger**: `object`

#### 11155420.contracts.l2CrossDomainMessenger.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000007"`

#### 11155420.contracts.l2Erc721Bridge

> `readonly` **l2Erc721Bridge**: `object`

#### 11155420.contracts.l2Erc721Bridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000014"`

#### 11155420.contracts.l2OutputOracle

> `readonly` **l2OutputOracle**: `object`

#### 11155420.contracts.l2OutputOracle.11155111

> `readonly` **11155111**: `object`

#### 11155420.contracts.l2OutputOracle.11155111.address

> `readonly` **address**: `"0x90E9c4f8a994a250F6aEfd61CAFb4F2e895D458F"`

#### 11155420.contracts.l2StandardBridge

> `readonly` **l2StandardBridge**: `object`

#### 11155420.contracts.l2StandardBridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000010"`

#### 11155420.contracts.l2ToL1MessagePasser

> `readonly` **l2ToL1MessagePasser**: `object`

#### 11155420.contracts.l2ToL1MessagePasser.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000016"`

#### 11155420.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 11155420.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 11155420.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `1620204`

#### 11155420.contracts.portal

> `readonly` **portal**: `object`

#### 11155420.contracts.portal.11155111

> `readonly` **11155111**: `object`

#### 11155420.contracts.portal.11155111.address

> `readonly` **address**: `"0x16Fc5058F25648194471939df75CF27A2fdC48BC"`

#### 11155420.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 11155420.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 11155420.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 11155420.formatters

> **formatters**: `object`

#### 11155420.formatters.block

> `readonly` **block**: `object`

#### 11155420.formatters.block.exclude

> **exclude**: `undefined` \| \[\]

#### 11155420.formatters.block.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`OpStackRpcBlock`\<`BlockTag`, `boolean`\>

##### Returns

`object`

###### baseFeePerGas

> **baseFeePerGas**: `null` \| `bigint`

###### blobGasUsed

> **blobGasUsed**: `bigint`

###### difficulty

> **difficulty**: `bigint`

###### excessBlobGas

> **excessBlobGas**: `bigint`

###### extraData

> **extraData**: `` `0x${string}` ``

###### gasLimit

> **gasLimit**: `bigint`

###### gasUsed

> **gasUsed**: `bigint`

###### hash

> **hash**: `null` \| `` `0x${string}` ``

###### logsBloom

> **logsBloom**: `null` \| `` `0x${string}` ``

###### miner

> **miner**: `` `0x${string}` ``

###### mixHash

> **mixHash**: `` `0x${string}` ``

###### nonce

> **nonce**: `null` \| `` `0x${string}` ``

###### number

> **number**: `null` \| `bigint`

###### parentBeaconBlockRoot?

> `optional` **parentBeaconBlockRoot**: `` `0x${string}` ``

###### parentHash

> **parentHash**: `` `0x${string}` ``

###### receiptsRoot

> **receiptsRoot**: `` `0x${string}` ``

###### sealFields

> **sealFields**: `` `0x${string}` ``[]

###### sha3Uncles

> **sha3Uncles**: `` `0x${string}` ``

###### size

> **size**: `bigint`

###### stateRoot

> **stateRoot**: `` `0x${string}` ``

###### timestamp

> **timestamp**: `bigint`

###### totalDifficulty

> **totalDifficulty**: `null` \| `bigint`

###### transactions

> **transactions**: `` `0x${string}` ``[] \| `OpStackTransaction`\<`boolean`\>[]

###### transactionsRoot

> **transactionsRoot**: `` `0x${string}` ``

###### uncles

> **uncles**: `` `0x${string}` ``[]

###### withdrawals?

> `optional` **withdrawals**: `Withdrawal`[]

###### withdrawalsRoot?

> `optional` **withdrawalsRoot**: `` `0x${string}` ``

#### 11155420.formatters.block.type

> **type**: `"block"`

#### 11155420.formatters.transaction

> `readonly` **transaction**: `object`

#### 11155420.formatters.transaction.exclude

> **exclude**: `undefined` \| \[\]

#### 11155420.formatters.transaction.format()

> **format**: (`args`) => \{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

##### Parameters

###### args

`OpStackRpcTransaction`\<`boolean`\>

##### Returns

\{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

#### 11155420.formatters.transaction.type

> **type**: `"transaction"`

#### 11155420.formatters.transactionReceipt

> `readonly` **transactionReceipt**: `object`

#### 11155420.formatters.transactionReceipt.exclude

> **exclude**: `undefined` \| \[\]

#### 11155420.formatters.transactionReceipt.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`OpStackRpcTransactionReceipt`

##### Returns

`object`

###### blobGasPrice?

> `optional` **blobGasPrice**: `bigint`

###### blobGasUsed?

> `optional` **blobGasUsed**: `bigint`

###### blockHash

> **blockHash**: `` `0x${string}` ``

###### blockNumber

> **blockNumber**: `bigint`

###### contractAddress

> **contractAddress**: `undefined` \| `null` \| `` `0x${string}` ``

###### cumulativeGasUsed

> **cumulativeGasUsed**: `bigint`

###### effectiveGasPrice

> **effectiveGasPrice**: `bigint`

###### from

> **from**: `` `0x${string}` ``

###### gasUsed

> **gasUsed**: `bigint`

###### l1Fee

> **l1Fee**: `null` \| `bigint`

###### l1FeeScalar

> **l1FeeScalar**: `null` \| `number`

###### l1GasPrice

> **l1GasPrice**: `null` \| `bigint`

###### l1GasUsed

> **l1GasUsed**: `null` \| `bigint`

###### logs

> **logs**: `Log`\<`bigint`, `number`, `false`, `undefined`, `undefined`, `undefined`, `undefined`\>[]

###### logsBloom

> **logsBloom**: `` `0x${string}` ``

###### root?

> `optional` **root**: `` `0x${string}` ``

###### status

> **status**: `"success"` \| `"reverted"`

###### to

> **to**: `null` \| `` `0x${string}` ``

###### transactionHash

> **transactionHash**: `` `0x${string}` ``

###### transactionIndex

> **transactionIndex**: `number`

###### type

> **type**: `TransactionType`

#### 11155420.formatters.transactionReceipt.type

> **type**: `"transactionReceipt"`

#### 11155420.id

> **id**: `11155420`

#### 11155420.name

> **name**: `"OP Sepolia"`

#### 11155420.nativeCurrency

> **nativeCurrency**: `object`

#### 11155420.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 11155420.nativeCurrency.name

> `readonly` **name**: `"Sepolia Ether"`

#### 11155420.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 11155420.rpcUrls

> **rpcUrls**: `object`

#### 11155420.rpcUrls.default

> `readonly` **default**: `object`

#### 11155420.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://sepolia.optimism.io"`\]

#### 11155420.serializers

> **serializers**: `object`

#### 11155420.serializers.transaction()

> `readonly` **transaction**: (`transaction`, `signature?`) => `` `0x02${string}` `` \| `` `0x01${string}` `` \| `` `0x03${string}` `` \| `` `0x04${string}` `` \| `TransactionSerializedLegacy` \| `` `0x7e${string}` ``

##### Parameters

###### transaction

`OpStackTransactionSerializable`

###### signature?

`Signature`

##### Returns

`` `0x02${string}` `` \| `` `0x01${string}` `` \| `` `0x03${string}` `` \| `` `0x04${string}` `` \| `TransactionSerializedLegacy` \| `` `0x7e${string}` ``

#### 11155420.sourceId

> **sourceId**: `11155111`

#### 11155420.testnet

> **testnet**: `true`

### 111557560

> **111557560**: `object` = `chains.cyberTestnet`

#### 111557560.blockExplorers

> **blockExplorers**: `object`

#### 111557560.blockExplorers.default

> `readonly` **default**: `object`

#### 111557560.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://testnet.cyberscan.co/api"`

#### 111557560.blockExplorers.default.name

> `readonly` **name**: `"Blockscout"`

#### 111557560.blockExplorers.default.url

> `readonly` **url**: `"https://testnet.cyberscan.co"`

#### 111557560.contracts

> **contracts**: `object`

#### 111557560.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 111557560.contracts.multicall3.address

> `readonly` **address**: `"0xffc391F0018269d4758AEA1a144772E8FB99545E"`

#### 111557560.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `304545`

#### 111557560.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 111557560.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 111557560.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 111557560.formatters?

> `optional` **formatters**: `undefined`

#### 111557560.id

> **id**: `111557560`

#### 111557560.name

> **name**: `"Cyber Testnet"`

#### 111557560.nativeCurrency

> **nativeCurrency**: `object`

#### 111557560.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 111557560.nativeCurrency.name

> `readonly` **name**: `"Ether"`

#### 111557560.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 111557560.rpcUrls

> **rpcUrls**: `object`

#### 111557560.rpcUrls.default

> `readonly` **default**: `object`

#### 111557560.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://cyber-testnet.alt.technology"`\]

#### 111557560.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 111557560.sourceId?

> `optional` **sourceId**: `number`

#### 111557560.testnet

> **testnet**: `true`

### 1116

> **1116**: `object` = `chains.coreDao`

#### 1116.blockExplorers

> **blockExplorers**: `object`

#### 1116.blockExplorers.default

> `readonly` **default**: `object`

#### 1116.blockExplorers.default.name

> `readonly` **name**: `"CoreDao"`

#### 1116.blockExplorers.default.url

> `readonly` **url**: `"https://scan.coredao.org"`

#### 1116.contracts

> **contracts**: `object`

#### 1116.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 1116.contracts.multicall3.address

> `readonly` **address**: `"0xcA11bde05977b3631167028862bE2a173976CA11"`

#### 1116.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `11907934`

#### 1116.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 1116.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 1116.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 1116.formatters?

> `optional` **formatters**: `undefined`

#### 1116.id

> **id**: `1116`

#### 1116.name

> **name**: `"Core Dao"`

#### 1116.nativeCurrency

> **nativeCurrency**: `object`

#### 1116.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 1116.nativeCurrency.name

> `readonly` **name**: `"Core"`

#### 1116.nativeCurrency.symbol

> `readonly` **symbol**: `"CORE"`

#### 1116.rpcUrls

> **rpcUrls**: `object`

#### 1116.rpcUrls.default

> `readonly` **default**: `object`

#### 1116.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.coredao.org"`\]

#### 1116.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 1116.sourceId?

> `optional` **sourceId**: `number`

#### 1116.testnet

> **testnet**: `false`

### 11235

> **11235**: `object` = `chains.haqqMainnet`

#### 11235.blockExplorers

> **blockExplorers**: `object`

#### 11235.blockExplorers.default

> `readonly` **default**: `object`

#### 11235.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://explorer.haqq.network/api"`

#### 11235.blockExplorers.default.name

> `readonly` **name**: `"HAQQ Explorer"`

#### 11235.blockExplorers.default.url

> `readonly` **url**: `"https://explorer.haqq.network"`

#### 11235.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 11235.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 11235.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 11235.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 11235.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 11235.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 11235.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 11235.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 11235.formatters?

> `optional` **formatters**: `undefined`

#### 11235.id

> **id**: `11235`

#### 11235.name

> **name**: `"HAQQ Mainnet"`

#### 11235.nativeCurrency

> **nativeCurrency**: `object`

#### 11235.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 11235.nativeCurrency.name

> `readonly` **name**: `"Islamic Coin"`

#### 11235.nativeCurrency.symbol

> `readonly` **symbol**: `"ISLM"`

#### 11235.rpcUrls

> **rpcUrls**: `object`

#### 11235.rpcUrls.default

> `readonly` **default**: `object`

#### 11235.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.eth.haqq.network"`\]

#### 11235.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 11235.sourceId?

> `optional` **sourceId**: `number`

#### 11235.testnet?

> `optional` **testnet**: `boolean`

### 11297108099

> **11297108099**: `object` = `chains.palmTestnet`

#### 11297108099.blockExplorers

> **blockExplorers**: `object`

#### 11297108099.blockExplorers.default

> `readonly` **default**: `object`

#### 11297108099.blockExplorers.default.name

> `readonly` **name**: `"Chainlens"`

#### 11297108099.blockExplorers.default.url

> `readonly` **url**: `"https://palm.chainlens.com"`

#### 11297108099.contracts

> **contracts**: `object`

#### 11297108099.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 11297108099.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 11297108099.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `15429248`

#### 11297108099.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 11297108099.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 11297108099.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 11297108099.formatters?

> `optional` **formatters**: `undefined`

#### 11297108099.id

> **id**: `11297108099`

#### 11297108099.name

> **name**: `"Palm Testnet"`

#### 11297108099.nativeCurrency

> **nativeCurrency**: `object`

#### 11297108099.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 11297108099.nativeCurrency.name

> `readonly` **name**: `"PALM"`

#### 11297108099.nativeCurrency.symbol

> `readonly` **symbol**: `"PALM"`

#### 11297108099.rpcUrls

> **rpcUrls**: `object`

#### 11297108099.rpcUrls.default

> `readonly` **default**: `object`

#### 11297108099.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://palm-mainnet.public.blastapi.io"`\]

#### 11297108099.rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly \[`"wss://palm-mainnet.public.blastapi.io"`\]

#### 11297108099.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 11297108099.sourceId?

> `optional` **sourceId**: `number`

#### 11297108099.testnet

> **testnet**: `true`

### 11297108109

> **11297108109**: `object` = `chains.palm`

#### 11297108109.blockExplorers

> **blockExplorers**: `object`

#### 11297108109.blockExplorers.default

> `readonly` **default**: `object`

#### 11297108109.blockExplorers.default.name

> `readonly` **name**: `"Chainlens"`

#### 11297108109.blockExplorers.default.url

> `readonly` **url**: `"https://palm.chainlens.com"`

#### 11297108109.contracts

> **contracts**: `object`

#### 11297108109.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 11297108109.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 11297108109.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `15429248`

#### 11297108109.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 11297108109.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 11297108109.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 11297108109.formatters?

> `optional` **formatters**: `undefined`

#### 11297108109.id

> **id**: `11297108109`

#### 11297108109.name

> **name**: `"Palm"`

#### 11297108109.nativeCurrency

> **nativeCurrency**: `object`

#### 11297108109.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 11297108109.nativeCurrency.name

> `readonly` **name**: `"PALM"`

#### 11297108109.nativeCurrency.symbol

> `readonly` **symbol**: `"PALM"`

#### 11297108109.rpcUrls

> **rpcUrls**: `object`

#### 11297108109.rpcUrls.default

> `readonly` **default**: `object`

#### 11297108109.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://palm-mainnet.public.blastapi.io"`\]

#### 11297108109.rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly \[`"wss://palm-mainnet.public.blastapi.io"`\]

#### 11297108109.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 11297108109.sourceId?

> `optional` **sourceId**: `number`

#### 11297108109.testnet?

> `optional` **testnet**: `boolean`

### 1130

> **1130**: `object` = `chains.defichainEvm`

#### 1130.blockExplorers

> **blockExplorers**: `object`

#### 1130.blockExplorers.default

> `readonly` **default**: `object`

#### 1130.blockExplorers.default.name

> `readonly` **name**: `"DeFiScan"`

#### 1130.blockExplorers.default.url

> `readonly` **url**: `"https://meta.defiscan.live"`

#### 1130.contracts

> **contracts**: `object`

#### 1130.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 1130.contracts.multicall3.address

> `readonly` **address**: `"0xcA11bde05977b3631167028862bE2a173976CA11"`

#### 1130.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `137852`

#### 1130.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 1130.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 1130.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 1130.formatters?

> `optional` **formatters**: `undefined`

#### 1130.id

> **id**: `1130`

#### 1130.name

> **name**: `"DeFiChain EVM Mainnet"`

#### 1130.nativeCurrency

> **nativeCurrency**: `object`

#### 1130.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 1130.nativeCurrency.name

> `readonly` **name**: `"DeFiChain"`

#### 1130.nativeCurrency.symbol

> `readonly` **symbol**: `"DFI"`

#### 1130.network

> `readonly` **network**: `"defichain-evm"`

#### 1130.rpcUrls

> **rpcUrls**: `object`

#### 1130.rpcUrls.default

> `readonly` **default**: `object`

#### 1130.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://eth.mainnet.ocean.jellyfishsdk.com"`\]

#### 1130.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 1130.sourceId?

> `optional` **sourceId**: `number`

#### 1130.testnet?

> `optional` **testnet**: `boolean`

### 1135

> **1135**: `object` = `chains.lisk`

#### 1135.blockExplorers

> **blockExplorers**: `object`

#### 1135.blockExplorers.default

> `readonly` **default**: `object`

#### 1135.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://blockscout.lisk.com/api"`

#### 1135.blockExplorers.default.name

> `readonly` **name**: `"Blockscout"`

#### 1135.blockExplorers.default.url

> `readonly` **url**: `"https://blockscout.lisk.com"`

#### 1135.contracts

> **contracts**: `object`

#### 1135.contracts.gasPriceOracle

> `readonly` **gasPriceOracle**: `object`

#### 1135.contracts.gasPriceOracle.address

> `readonly` **address**: `"0x420000000000000000000000000000000000000F"`

#### 1135.contracts.l1Block

> `readonly` **l1Block**: `object`

#### 1135.contracts.l1Block.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000015"`

#### 1135.contracts.l1StandardBridge

> `readonly` **l1StandardBridge**: `object`

#### 1135.contracts.l1StandardBridge.1

> `readonly` **1**: `object`

#### 1135.contracts.l1StandardBridge.1.address

> `readonly` **address**: `"0x2658723Bf70c7667De6B25F99fcce13A16D25d08"`

#### 1135.contracts.l2CrossDomainMessenger

> `readonly` **l2CrossDomainMessenger**: `object`

#### 1135.contracts.l2CrossDomainMessenger.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000007"`

#### 1135.contracts.l2Erc721Bridge

> `readonly` **l2Erc721Bridge**: `object`

#### 1135.contracts.l2Erc721Bridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000014"`

#### 1135.contracts.l2OutputOracle

> `readonly` **l2OutputOracle**: `object`

#### 1135.contracts.l2OutputOracle.1

> `readonly` **1**: `object`

#### 1135.contracts.l2OutputOracle.1.address

> `readonly` **address**: `"0x113cB99283AF242Da0A0C54347667edF531Aa7d6"`

#### 1135.contracts.l2StandardBridge

> `readonly` **l2StandardBridge**: `object`

#### 1135.contracts.l2StandardBridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000010"`

#### 1135.contracts.l2ToL1MessagePasser

> `readonly` **l2ToL1MessagePasser**: `object`

#### 1135.contracts.l2ToL1MessagePasser.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000016"`

#### 1135.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 1135.contracts.multicall3.address

> `readonly` **address**: `"0xA9d71E1dd7ca26F26e656E66d6AA81ed7f745bf0"`

#### 1135.contracts.portal

> `readonly` **portal**: `object`

#### 1135.contracts.portal.1

> `readonly` **1**: `object`

#### 1135.contracts.portal.1.address

> `readonly` **address**: `"0x26dB93F8b8b4f7016240af62F7730979d353f9A7"`

#### 1135.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 1135.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 1135.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 1135.formatters

> **formatters**: `object`

#### 1135.formatters.block

> `readonly` **block**: `object`

#### 1135.formatters.block.exclude

> **exclude**: `undefined` \| \[\]

#### 1135.formatters.block.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`OpStackRpcBlock`\<`BlockTag`, `boolean`\>

##### Returns

`object`

###### baseFeePerGas

> **baseFeePerGas**: `null` \| `bigint`

###### blobGasUsed

> **blobGasUsed**: `bigint`

###### difficulty

> **difficulty**: `bigint`

###### excessBlobGas

> **excessBlobGas**: `bigint`

###### extraData

> **extraData**: `` `0x${string}` ``

###### gasLimit

> **gasLimit**: `bigint`

###### gasUsed

> **gasUsed**: `bigint`

###### hash

> **hash**: `null` \| `` `0x${string}` ``

###### logsBloom

> **logsBloom**: `null` \| `` `0x${string}` ``

###### miner

> **miner**: `` `0x${string}` ``

###### mixHash

> **mixHash**: `` `0x${string}` ``

###### nonce

> **nonce**: `null` \| `` `0x${string}` ``

###### number

> **number**: `null` \| `bigint`

###### parentBeaconBlockRoot?

> `optional` **parentBeaconBlockRoot**: `` `0x${string}` ``

###### parentHash

> **parentHash**: `` `0x${string}` ``

###### receiptsRoot

> **receiptsRoot**: `` `0x${string}` ``

###### sealFields

> **sealFields**: `` `0x${string}` ``[]

###### sha3Uncles

> **sha3Uncles**: `` `0x${string}` ``

###### size

> **size**: `bigint`

###### stateRoot

> **stateRoot**: `` `0x${string}` ``

###### timestamp

> **timestamp**: `bigint`

###### totalDifficulty

> **totalDifficulty**: `null` \| `bigint`

###### transactions

> **transactions**: `` `0x${string}` ``[] \| `OpStackTransaction`\<`boolean`\>[]

###### transactionsRoot

> **transactionsRoot**: `` `0x${string}` ``

###### uncles

> **uncles**: `` `0x${string}` ``[]

###### withdrawals?

> `optional` **withdrawals**: `Withdrawal`[]

###### withdrawalsRoot?

> `optional` **withdrawalsRoot**: `` `0x${string}` ``

#### 1135.formatters.block.type

> **type**: `"block"`

#### 1135.formatters.transaction

> `readonly` **transaction**: `object`

#### 1135.formatters.transaction.exclude

> **exclude**: `undefined` \| \[\]

#### 1135.formatters.transaction.format()

> **format**: (`args`) => \{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

##### Parameters

###### args

`OpStackRpcTransaction`\<`boolean`\>

##### Returns

\{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

#### 1135.formatters.transaction.type

> **type**: `"transaction"`

#### 1135.formatters.transactionReceipt

> `readonly` **transactionReceipt**: `object`

#### 1135.formatters.transactionReceipt.exclude

> **exclude**: `undefined` \| \[\]

#### 1135.formatters.transactionReceipt.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`OpStackRpcTransactionReceipt`

##### Returns

`object`

###### blobGasPrice?

> `optional` **blobGasPrice**: `bigint`

###### blobGasUsed?

> `optional` **blobGasUsed**: `bigint`

###### blockHash

> **blockHash**: `` `0x${string}` ``

###### blockNumber

> **blockNumber**: `bigint`

###### contractAddress

> **contractAddress**: `undefined` \| `null` \| `` `0x${string}` ``

###### cumulativeGasUsed

> **cumulativeGasUsed**: `bigint`

###### effectiveGasPrice

> **effectiveGasPrice**: `bigint`

###### from

> **from**: `` `0x${string}` ``

###### gasUsed

> **gasUsed**: `bigint`

###### l1Fee

> **l1Fee**: `null` \| `bigint`

###### l1FeeScalar

> **l1FeeScalar**: `null` \| `number`

###### l1GasPrice

> **l1GasPrice**: `null` \| `bigint`

###### l1GasUsed

> **l1GasUsed**: `null` \| `bigint`

###### logs

> **logs**: `Log`\<`bigint`, `number`, `false`, `undefined`, `undefined`, `undefined`, `undefined`\>[]

###### logsBloom

> **logsBloom**: `` `0x${string}` ``

###### root?

> `optional` **root**: `` `0x${string}` ``

###### status

> **status**: `"success"` \| `"reverted"`

###### to

> **to**: `null` \| `` `0x${string}` ``

###### transactionHash

> **transactionHash**: `` `0x${string}` ``

###### transactionIndex

> **transactionIndex**: `number`

###### type

> **type**: `TransactionType`

#### 1135.formatters.transactionReceipt.type

> **type**: `"transactionReceipt"`

#### 1135.id

> **id**: `1135`

#### 1135.name

> **name**: `"Lisk"`

#### 1135.nativeCurrency

> **nativeCurrency**: `object`

#### 1135.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 1135.nativeCurrency.name

> `readonly` **name**: `"Ether"`

#### 1135.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 1135.network

> `readonly` **network**: `"lisk"`

#### 1135.rpcUrls

> **rpcUrls**: `object`

#### 1135.rpcUrls.default

> `readonly` **default**: `object`

#### 1135.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.api.lisk.com"`\]

#### 1135.serializers

> **serializers**: `object`

#### 1135.serializers.transaction()

> `readonly` **transaction**: (`transaction`, `signature?`) => `` `0x02${string}` `` \| `` `0x01${string}` `` \| `` `0x03${string}` `` \| `` `0x04${string}` `` \| `TransactionSerializedLegacy` \| `` `0x7e${string}` ``

##### Parameters

###### transaction

`OpStackTransactionSerializable`

###### signature?

`Signature`

##### Returns

`` `0x02${string}` `` \| `` `0x01${string}` `` \| `` `0x03${string}` `` \| `` `0x04${string}` `` \| `TransactionSerializedLegacy` \| `` `0x7e${string}` ``

#### 1135.sourceId

> **sourceId**: `1`

#### 1135.testnet?

> `optional` **testnet**: `boolean`

### 114

> **114**: `object` = `chains.flareTestnet`

#### 114.blockExplorers

> **blockExplorers**: `object`

#### 114.blockExplorers.default

> `readonly` **default**: `object`

#### 114.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://coston2-explorer.flare.network/api"`

#### 114.blockExplorers.default.name

> `readonly` **name**: `"Coston2 Explorer"`

#### 114.blockExplorers.default.url

> `readonly` **url**: `"https://coston2-explorer.flare.network"`

#### 114.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 114.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 114.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 114.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 114.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 114.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 114.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 114.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 114.formatters?

> `optional` **formatters**: `undefined`

#### 114.id

> **id**: `114`

#### 114.name

> **name**: `"Flare Testnet Coston2"`

#### 114.nativeCurrency

> **nativeCurrency**: `object`

#### 114.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 114.nativeCurrency.name

> `readonly` **name**: `"Coston2 Flare"`

#### 114.nativeCurrency.symbol

> `readonly` **symbol**: `"C2FLR"`

#### 114.rpcUrls

> **rpcUrls**: `object`

#### 114.rpcUrls.default

> `readonly` **default**: `object`

#### 114.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://coston2-api.flare.network/ext/C/rpc"`\]

#### 114.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 114.sourceId?

> `optional` **sourceId**: `number`

#### 114.testnet

> **testnet**: `true`

### 11501

> **11501**: `object` = `chains.bevmMainnet`

#### 11501.blockExplorers

> **blockExplorers**: `object`

#### 11501.blockExplorers.default

> `readonly` **default**: `object`

#### 11501.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://scan-mainnet-api.bevm.io/api"`

#### 11501.blockExplorers.default.name

> `readonly` **name**: `"Bevmscan"`

#### 11501.blockExplorers.default.url

> `readonly` **url**: `"https://scan-mainnet.bevm.io"`

#### 11501.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 11501.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 11501.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 11501.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 11501.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 11501.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 11501.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 11501.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 11501.formatters?

> `optional` **formatters**: `undefined`

#### 11501.id

> **id**: `11501`

#### 11501.name

> **name**: `"BEVM Mainnet"`

#### 11501.nativeCurrency

> **nativeCurrency**: `object`

#### 11501.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 11501.nativeCurrency.name

> `readonly` **name**: `"Bitcoin"`

#### 11501.nativeCurrency.symbol

> `readonly` **symbol**: `"BTC"`

#### 11501.rpcUrls

> **rpcUrls**: `object`

#### 11501.rpcUrls.default

> `readonly` **default**: `object`

#### 11501.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc-mainnet-1.bevm.io"`\]

#### 11501.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 11501.sourceId?

> `optional` **sourceId**: `number`

#### 11501.testnet?

> `optional` **testnet**: `boolean`

### 122

> **122**: `object` = `chains.fuse`

#### 122.blockExplorers

> **blockExplorers**: `object`

#### 122.blockExplorers.default

> `readonly` **default**: `object`

#### 122.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://explorer.fuse.io/api"`

#### 122.blockExplorers.default.name

> `readonly` **name**: `"Fuse Explorer"`

#### 122.blockExplorers.default.url

> `readonly` **url**: `"https://explorer.fuse.io"`

#### 122.contracts

> **contracts**: `object`

#### 122.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 122.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 122.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `16146628`

#### 122.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 122.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 122.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 122.formatters?

> `optional` **formatters**: `undefined`

#### 122.id

> **id**: `122`

#### 122.name

> **name**: `"Fuse"`

#### 122.nativeCurrency

> **nativeCurrency**: `object`

#### 122.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 122.nativeCurrency.name

> `readonly` **name**: `"Fuse"`

#### 122.nativeCurrency.symbol

> `readonly` **symbol**: `"FUSE"`

#### 122.rpcUrls

> **rpcUrls**: `object`

#### 122.rpcUrls.default

> `readonly` **default**: `object`

#### 122.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.fuse.io"`\]

#### 122.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 122.sourceId?

> `optional` **sourceId**: `number`

#### 122.testnet?

> `optional` **testnet**: `boolean`

### 123

> **123**: `object` = `chains.fuseSparknet`

#### 123.blockExplorers

> **blockExplorers**: `object`

#### 123.blockExplorers.default

> `readonly` **default**: `object`

#### 123.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://explorer.fusespark.io/api"`

#### 123.blockExplorers.default.name

> `readonly` **name**: `"Sparkent Explorer"`

#### 123.blockExplorers.default.url

> `readonly` **url**: `"https://explorer.fusespark.io"`

#### 123.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 123.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 123.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 123.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 123.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 123.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 123.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 123.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 123.formatters?

> `optional` **formatters**: `undefined`

#### 123.id

> **id**: `123`

#### 123.name

> **name**: `"Fuse Sparknet"`

#### 123.nativeCurrency

> **nativeCurrency**: `object`

#### 123.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 123.nativeCurrency.name

> `readonly` **name**: `"Spark"`

#### 123.nativeCurrency.symbol

> `readonly` **symbol**: `"SPARK"`

#### 123.rpcUrls

> **rpcUrls**: `object`

#### 123.rpcUrls.default

> `readonly` **default**: `object`

#### 123.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.fusespark.io"`\]

#### 123.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 123.sourceId?

> `optional` **sourceId**: `number`

#### 123.testnet?

> `optional` **testnet**: `boolean`

### 12306

> **12306**: `object` = `chains.fibo`

#### 12306.blockExplorers

> **blockExplorers**: `object`

#### 12306.blockExplorers.default

> `readonly` **default**: `object`

#### 12306.blockExplorers.default.name

> `readonly` **name**: `"FiboScan"`

#### 12306.blockExplorers.default.url

> `readonly` **url**: `"https://scan.fibochain.org"`

#### 12306.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 12306.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 12306.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 12306.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 12306.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 12306.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 12306.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 12306.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 12306.formatters?

> `optional` **formatters**: `undefined`

#### 12306.id

> **id**: `12306`

#### 12306.name

> **name**: `"Fibo Chain"`

#### 12306.nativeCurrency

> **nativeCurrency**: `object`

#### 12306.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 12306.nativeCurrency.name

> `readonly` **name**: `"fibo"`

#### 12306.nativeCurrency.symbol

> `readonly` **symbol**: `"FIBO"`

#### 12306.rpcUrls

> **rpcUrls**: `object`

#### 12306.rpcUrls.default

> `readonly` **default**: `object`

#### 12306.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://network.hzroc.art"`\]

#### 12306.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 12306.sourceId?

> `optional` **sourceId**: `number`

#### 12306.testnet?

> `optional` **testnet**: `boolean`

### 12324

> **12324**: `object` = `chains.l3x`

#### 12324.blockExplorers

> **blockExplorers**: `object`

#### 12324.blockExplorers.default

> `readonly` **default**: `object`

#### 12324.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://explorer.l3x.com/api/v2"`

#### 12324.blockExplorers.default.name

> `readonly` **name**: `"L3X Mainnet Explorer"`

#### 12324.blockExplorers.default.url

> `readonly` **url**: `"https://explorer.l3x.com"`

#### 12324.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 12324.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 12324.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 12324.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 12324.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 12324.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 12324.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 12324.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 12324.formatters?

> `optional` **formatters**: `undefined`

#### 12324.id

> **id**: `12324`

#### 12324.name

> **name**: `"L3X Protocol"`

#### 12324.nativeCurrency

> **nativeCurrency**: `object`

#### 12324.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 12324.nativeCurrency.name

> `readonly` **name**: `"Ether"`

#### 12324.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 12324.rpcUrls

> **rpcUrls**: `object`

#### 12324.rpcUrls.default

> `readonly` **default**: `object`

#### 12324.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc-mainnet.l3x.com"`\]

#### 12324.rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly \[`"wss://rpc-mainnet.l3x.com"`\]

#### 12324.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 12324.sourceId?

> `optional` **sourceId**: `number`

#### 12324.testnet

> **testnet**: `false`

### 12325

> **12325**: `object` = `chains.l3xTestnet`

#### 12325.blockExplorers

> **blockExplorers**: `object`

#### 12325.blockExplorers.default

> `readonly` **default**: `object`

#### 12325.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://explorer-testnet.l3x.com/api/v2"`

#### 12325.blockExplorers.default.name

> `readonly` **name**: `"L3X Testnet Explorer"`

#### 12325.blockExplorers.default.url

> `readonly` **url**: `"https://explorer-testnet.l3x.com"`

#### 12325.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 12325.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 12325.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 12325.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 12325.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 12325.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 12325.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 12325.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 12325.formatters?

> `optional` **formatters**: `undefined`

#### 12325.id

> **id**: `12325`

#### 12325.name

> **name**: `"L3X Protocol Testnet"`

#### 12325.nativeCurrency

> **nativeCurrency**: `object`

#### 12325.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 12325.nativeCurrency.name

> `readonly` **name**: `"Ether"`

#### 12325.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 12325.rpcUrls

> **rpcUrls**: `object`

#### 12325.rpcUrls.default

> `readonly` **default**: `object`

#### 12325.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc-testnet.l3x.com"`\]

#### 12325.rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly \[`"wss://rpc-testnet.l3x.com"`\]

#### 12325.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 12325.sourceId?

> `optional` **sourceId**: `number`

#### 12325.testnet

> **testnet**: `true`

### 12553

> **12553**: `object` = `chains.rss3`

#### 12553.blockExplorers

> **blockExplorers**: `object`

#### 12553.blockExplorers.default

> `readonly` **default**: `object`

#### 12553.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://scan.rss3.io/api"`

#### 12553.blockExplorers.default.name

> `readonly` **name**: `"RSS3 VSL Mainnet Scan"`

#### 12553.blockExplorers.default.url

> `readonly` **url**: `"https://scan.rss3.io"`

#### 12553.contracts

> **contracts**: `object`

#### 12553.contracts.gasPriceOracle

> `readonly` **gasPriceOracle**: `object`

#### 12553.contracts.gasPriceOracle.address

> `readonly` **address**: `"0x420000000000000000000000000000000000000F"`

#### 12553.contracts.l1Block

> `readonly` **l1Block**: `object`

#### 12553.contracts.l1Block.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000015"`

#### 12553.contracts.l1StandardBridge

> `readonly` **l1StandardBridge**: `object`

#### 12553.contracts.l1StandardBridge.1

> `readonly` **1**: `object`

#### 12553.contracts.l1StandardBridge.1.address

> `readonly` **address**: `"0x4cbab69108Aa72151EDa5A3c164eA86845f18438"`

#### 12553.contracts.l2CrossDomainMessenger

> `readonly` **l2CrossDomainMessenger**: `object`

#### 12553.contracts.l2CrossDomainMessenger.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000007"`

#### 12553.contracts.l2Erc721Bridge

> `readonly` **l2Erc721Bridge**: `object`

#### 12553.contracts.l2Erc721Bridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000014"`

#### 12553.contracts.l2OutputOracle

> `readonly` **l2OutputOracle**: `object`

#### 12553.contracts.l2OutputOracle.1

> `readonly` **1**: `object`

#### 12553.contracts.l2OutputOracle.1.address

> `readonly` **address**: `"0xE6f24d2C32B3109B18ed33cF08eFb490b1e09C10"`

#### 12553.contracts.l2StandardBridge

> `readonly` **l2StandardBridge**: `object`

#### 12553.contracts.l2StandardBridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000010"`

#### 12553.contracts.l2ToL1MessagePasser

> `readonly` **l2ToL1MessagePasser**: `object`

#### 12553.contracts.l2ToL1MessagePasser.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000016"`

#### 12553.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 12553.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 12553.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `14193`

#### 12553.contracts.portal

> `readonly` **portal**: `object`

#### 12553.contracts.portal.1

> `readonly` **1**: `object`

#### 12553.contracts.portal.1.address

> `readonly` **address**: `"0x6A12432491bbbE8d3babf75F759766774C778Db4"`

#### 12553.contracts.portal.1.blockCreated

> `readonly` **blockCreated**: `19387057`

#### 12553.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 12553.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 12553.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 12553.formatters

> **formatters**: `object`

#### 12553.formatters.block

> `readonly` **block**: `object`

#### 12553.formatters.block.exclude

> **exclude**: `undefined` \| \[\]

#### 12553.formatters.block.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`OpStackRpcBlock`\<`BlockTag`, `boolean`\>

##### Returns

`object`

###### baseFeePerGas

> **baseFeePerGas**: `null` \| `bigint`

###### blobGasUsed

> **blobGasUsed**: `bigint`

###### difficulty

> **difficulty**: `bigint`

###### excessBlobGas

> **excessBlobGas**: `bigint`

###### extraData

> **extraData**: `` `0x${string}` ``

###### gasLimit

> **gasLimit**: `bigint`

###### gasUsed

> **gasUsed**: `bigint`

###### hash

> **hash**: `null` \| `` `0x${string}` ``

###### logsBloom

> **logsBloom**: `null` \| `` `0x${string}` ``

###### miner

> **miner**: `` `0x${string}` ``

###### mixHash

> **mixHash**: `` `0x${string}` ``

###### nonce

> **nonce**: `null` \| `` `0x${string}` ``

###### number

> **number**: `null` \| `bigint`

###### parentBeaconBlockRoot?

> `optional` **parentBeaconBlockRoot**: `` `0x${string}` ``

###### parentHash

> **parentHash**: `` `0x${string}` ``

###### receiptsRoot

> **receiptsRoot**: `` `0x${string}` ``

###### sealFields

> **sealFields**: `` `0x${string}` ``[]

###### sha3Uncles

> **sha3Uncles**: `` `0x${string}` ``

###### size

> **size**: `bigint`

###### stateRoot

> **stateRoot**: `` `0x${string}` ``

###### timestamp

> **timestamp**: `bigint`

###### totalDifficulty

> **totalDifficulty**: `null` \| `bigint`

###### transactions

> **transactions**: `` `0x${string}` ``[] \| `OpStackTransaction`\<`boolean`\>[]

###### transactionsRoot

> **transactionsRoot**: `` `0x${string}` ``

###### uncles

> **uncles**: `` `0x${string}` ``[]

###### withdrawals?

> `optional` **withdrawals**: `Withdrawal`[]

###### withdrawalsRoot?

> `optional` **withdrawalsRoot**: `` `0x${string}` ``

#### 12553.formatters.block.type

> **type**: `"block"`

#### 12553.formatters.transaction

> `readonly` **transaction**: `object`

#### 12553.formatters.transaction.exclude

> **exclude**: `undefined` \| \[\]

#### 12553.formatters.transaction.format()

> **format**: (`args`) => \{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

##### Parameters

###### args

`OpStackRpcTransaction`\<`boolean`\>

##### Returns

\{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

#### 12553.formatters.transaction.type

> **type**: `"transaction"`

#### 12553.formatters.transactionReceipt

> `readonly` **transactionReceipt**: `object`

#### 12553.formatters.transactionReceipt.exclude

> **exclude**: `undefined` \| \[\]

#### 12553.formatters.transactionReceipt.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`OpStackRpcTransactionReceipt`

##### Returns

`object`

###### blobGasPrice?

> `optional` **blobGasPrice**: `bigint`

###### blobGasUsed?

> `optional` **blobGasUsed**: `bigint`

###### blockHash

> **blockHash**: `` `0x${string}` ``

###### blockNumber

> **blockNumber**: `bigint`

###### contractAddress

> **contractAddress**: `undefined` \| `null` \| `` `0x${string}` ``

###### cumulativeGasUsed

> **cumulativeGasUsed**: `bigint`

###### effectiveGasPrice

> **effectiveGasPrice**: `bigint`

###### from

> **from**: `` `0x${string}` ``

###### gasUsed

> **gasUsed**: `bigint`

###### l1Fee

> **l1Fee**: `null` \| `bigint`

###### l1FeeScalar

> **l1FeeScalar**: `null` \| `number`

###### l1GasPrice

> **l1GasPrice**: `null` \| `bigint`

###### l1GasUsed

> **l1GasUsed**: `null` \| `bigint`

###### logs

> **logs**: `Log`\<`bigint`, `number`, `false`, `undefined`, `undefined`, `undefined`, `undefined`\>[]

###### logsBloom

> **logsBloom**: `` `0x${string}` ``

###### root?

> `optional` **root**: `` `0x${string}` ``

###### status

> **status**: `"success"` \| `"reverted"`

###### to

> **to**: `null` \| `` `0x${string}` ``

###### transactionHash

> **transactionHash**: `` `0x${string}` ``

###### transactionIndex

> **transactionIndex**: `number`

###### type

> **type**: `TransactionType`

#### 12553.formatters.transactionReceipt.type

> **type**: `"transactionReceipt"`

#### 12553.id

> **id**: `12553`

#### 12553.name

> **name**: `"RSS3 VSL Mainnet"`

#### 12553.nativeCurrency

> **nativeCurrency**: `object`

#### 12553.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 12553.nativeCurrency.name

> `readonly` **name**: `"RSS3"`

#### 12553.nativeCurrency.symbol

> `readonly` **symbol**: `"RSS3"`

#### 12553.rpcUrls

> **rpcUrls**: `object`

#### 12553.rpcUrls.default

> `readonly` **default**: `object`

#### 12553.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.rss3.io"`\]

#### 12553.serializers

> **serializers**: `object`

#### 12553.serializers.transaction()

> `readonly` **transaction**: (`transaction`, `signature?`) => `` `0x02${string}` `` \| `` `0x01${string}` `` \| `` `0x03${string}` `` \| `` `0x04${string}` `` \| `TransactionSerializedLegacy` \| `` `0x7e${string}` ``

##### Parameters

###### transaction

`OpStackTransactionSerializable`

###### signature?

`Signature`

##### Returns

`` `0x02${string}` `` \| `` `0x01${string}` `` \| `` `0x03${string}` `` \| `` `0x04${string}` `` \| `TransactionSerializedLegacy` \| `` `0x7e${string}` ``

#### 12553.sourceId

> **sourceId**: `1`

#### 12553.testnet?

> `optional` **testnet**: `boolean`

### 1281

> **1281**: `object` = `chains.moonbeamDev`

#### 1281.blockExplorers?

> `optional` **blockExplorers**: `object`

##### Index Signature

\[`key`: `string`\]: `object`

#### 1281.blockExplorers.default

> **default**: `object`

#### 1281.blockExplorers.default.apiUrl?

> `optional` **apiUrl**: `string`

#### 1281.blockExplorers.default.name

> **name**: `string`

#### 1281.blockExplorers.default.url

> **url**: `string`

#### 1281.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 1281.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 1281.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 1281.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 1281.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 1281.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 1281.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 1281.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 1281.formatters?

> `optional` **formatters**: `undefined`

#### 1281.id

> **id**: `1281`

#### 1281.name

> **name**: `"Moonbeam Development Node"`

#### 1281.nativeCurrency

> **nativeCurrency**: `object`

#### 1281.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 1281.nativeCurrency.name

> `readonly` **name**: `"DEV"`

#### 1281.nativeCurrency.symbol

> `readonly` **symbol**: `"DEV"`

#### 1281.rpcUrls

> **rpcUrls**: `object`

#### 1281.rpcUrls.default

> `readonly` **default**: `object`

#### 1281.rpcUrls.default.http

> `readonly` **http**: readonly \[`"http://127.0.0.1:9944"`\]

#### 1281.rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly \[`"wss://127.0.0.1:9944"`\]

#### 1281.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 1281.sourceId?

> `optional` **sourceId**: `number`

#### 1281.testnet?

> `optional` **testnet**: `boolean`

### 1285

> **1285**: `object` = `chains.moonriver`

#### 1285.blockExplorers

> **blockExplorers**: `object`

#### 1285.blockExplorers.default

> `readonly` **default**: `object`

#### 1285.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://api-moonriver.moonscan.io/api"`

#### 1285.blockExplorers.default.name

> `readonly` **name**: `"Moonscan"`

#### 1285.blockExplorers.default.url

> `readonly` **url**: `"https://moonriver.moonscan.io"`

#### 1285.contracts

> **contracts**: `object`

#### 1285.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 1285.contracts.multicall3.address

> `readonly` **address**: `"0xcA11bde05977b3631167028862bE2a173976CA11"`

#### 1285.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `1597904`

#### 1285.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 1285.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 1285.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 1285.formatters?

> `optional` **formatters**: `undefined`

#### 1285.id

> **id**: `1285`

#### 1285.name

> **name**: `"Moonriver"`

#### 1285.nativeCurrency

> **nativeCurrency**: `object`

#### 1285.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 1285.nativeCurrency.name

> `readonly` **name**: `"MOVR"`

#### 1285.nativeCurrency.symbol

> `readonly` **symbol**: `"MOVR"`

#### 1285.rpcUrls

> **rpcUrls**: `object`

#### 1285.rpcUrls.default

> `readonly` **default**: `object`

#### 1285.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://moonriver.public.blastapi.io"`\]

#### 1285.rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly \[`"wss://moonriver.public.blastapi.io"`\]

#### 1285.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 1285.sourceId?

> `optional` **sourceId**: `number`

#### 1285.testnet

> **testnet**: `false`

### 1313161554

> **1313161554**: `object` = `chains.aurora`

#### 1313161554.blockExplorers

> **blockExplorers**: `object`

#### 1313161554.blockExplorers.default

> `readonly` **default**: `object`

#### 1313161554.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://aurorascan.dev/api"`

#### 1313161554.blockExplorers.default.name

> `readonly` **name**: `"Aurorascan"`

#### 1313161554.blockExplorers.default.url

> `readonly` **url**: `"https://aurorascan.dev"`

#### 1313161554.contracts

> **contracts**: `object`

#### 1313161554.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 1313161554.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 1313161554.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `62907816`

#### 1313161554.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 1313161554.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 1313161554.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 1313161554.formatters?

> `optional` **formatters**: `undefined`

#### 1313161554.id

> **id**: `1313161554`

#### 1313161554.name

> **name**: `"Aurora"`

#### 1313161554.nativeCurrency

> **nativeCurrency**: `object`

#### 1313161554.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 1313161554.nativeCurrency.name

> `readonly` **name**: `"Ether"`

#### 1313161554.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 1313161554.rpcUrls

> **rpcUrls**: `object`

#### 1313161554.rpcUrls.default

> `readonly` **default**: `object`

#### 1313161554.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://mainnet.aurora.dev"`\]

#### 1313161554.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 1313161554.sourceId?

> `optional` **sourceId**: `number`

#### 1313161554.testnet?

> `optional` **testnet**: `boolean`

### 1328

> **1328**: `object` = `chains.seiTestnet`

#### 1328.blockExplorers

> **blockExplorers**: `object`

#### 1328.blockExplorers.default

> `readonly` **default**: `object`

#### 1328.blockExplorers.default.name

> `readonly` **name**: `"Seitrace"`

#### 1328.blockExplorers.default.url

> `readonly` **url**: `"https://seitrace.com"`

#### 1328.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 1328.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 1328.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 1328.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 1328.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 1328.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 1328.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 1328.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 1328.formatters?

> `optional` **formatters**: `undefined`

#### 1328.id

> **id**: `1328`

#### 1328.name

> **name**: `"Sei Testnet"`

#### 1328.nativeCurrency

> **nativeCurrency**: `object`

#### 1328.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 1328.nativeCurrency.name

> `readonly` **name**: `"Sei"`

#### 1328.nativeCurrency.symbol

> `readonly` **symbol**: `"SEI"`

#### 1328.rpcUrls

> **rpcUrls**: `object`

#### 1328.rpcUrls.default

> `readonly` **default**: `object`

#### 1328.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://evm-rpc-testnet.sei-apis.com"`\]

#### 1328.rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly \[`"wss://evm-ws-testnet.sei-apis.com"`\]

#### 1328.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 1328.sourceId?

> `optional` **sourceId**: `number`

#### 1328.testnet

> **testnet**: `true`

### 1329

> **1329**: `object` = `chains.sei`

#### 1329.blockExplorers

> **blockExplorers**: `object`

#### 1329.blockExplorers.default

> `readonly` **default**: `object`

#### 1329.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://seitrace.com/pacific-1/api"`

#### 1329.blockExplorers.default.name

> `readonly` **name**: `"Seitrace"`

#### 1329.blockExplorers.default.url

> `readonly` **url**: `"https://seitrace.com"`

#### 1329.contracts

> **contracts**: `object`

#### 1329.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 1329.contracts.multicall3.address

> `readonly` **address**: `"0xcA11bde05977b3631167028862bE2a173976CA11"`

#### 1329.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 1329.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 1329.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 1329.formatters?

> `optional` **formatters**: `undefined`

#### 1329.id

> **id**: `1329`

#### 1329.name

> **name**: `"Sei Network"`

#### 1329.nativeCurrency

> **nativeCurrency**: `object`

#### 1329.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 1329.nativeCurrency.name

> `readonly` **name**: `"Sei"`

#### 1329.nativeCurrency.symbol

> `readonly` **symbol**: `"SEI"`

#### 1329.rpcUrls

> **rpcUrls**: `object`

#### 1329.rpcUrls.default

> `readonly` **default**: `object`

#### 1329.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://evm-rpc.sei-apis.com/"`\]

#### 1329.rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly \[`"wss://evm-ws.sei-apis.com/"`\]

#### 1329.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 1329.sourceId?

> `optional` **sourceId**: `number`

#### 1329.testnet?

> `optional` **testnet**: `boolean`

### 13337

> **13337**: `object` = `chains.beamTestnet`

#### 13337.blockExplorers

> **blockExplorers**: `object`

#### 13337.blockExplorers.default

> `readonly` **default**: `object`

#### 13337.blockExplorers.default.name

> `readonly` **name**: `"Beam Explorer"`

#### 13337.blockExplorers.default.url

> `readonly` **url**: `"https://subnets-test.avax.network/beam"`

#### 13337.contracts

> **contracts**: `object`

#### 13337.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 13337.contracts.multicall3.address

> `readonly` **address**: `"0x9bf49b704ee2a095b95c1f2d4eb9010510c41c9e"`

#### 13337.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `3`

#### 13337.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 13337.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 13337.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 13337.formatters?

> `optional` **formatters**: `undefined`

#### 13337.id

> **id**: `13337`

#### 13337.name

> **name**: `"Beam Testnet"`

#### 13337.nativeCurrency

> **nativeCurrency**: `object`

#### 13337.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 13337.nativeCurrency.name

> `readonly` **name**: `"Beam"`

#### 13337.nativeCurrency.symbol

> `readonly` **symbol**: `"BEAM"`

#### 13337.network

> `readonly` **network**: `"beam"`

#### 13337.rpcUrls

> **rpcUrls**: `object`

#### 13337.rpcUrls.default

> `readonly` **default**: `object`

#### 13337.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://build.onbeam.com/rpc/testnet"`\]

#### 13337.rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly \[`"wss://build.onbeam.com/ws/testnet"`\]

#### 13337.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 13337.sourceId?

> `optional` **sourceId**: `number`

#### 13337.testnet

> **testnet**: `true`

### 1337

> **1337**: `object` = `chains.localhost`

#### 1337.blockExplorers?

> `optional` **blockExplorers**: `object`

##### Index Signature

\[`key`: `string`\]: `object`

#### 1337.blockExplorers.default

> **default**: `object`

#### 1337.blockExplorers.default.apiUrl?

> `optional` **apiUrl**: `string`

#### 1337.blockExplorers.default.name

> **name**: `string`

#### 1337.blockExplorers.default.url

> **url**: `string`

#### 1337.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 1337.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 1337.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 1337.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 1337.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 1337.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 1337.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 1337.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 1337.formatters?

> `optional` **formatters**: `undefined`

#### 1337.id

> **id**: `1337`

#### 1337.name

> **name**: `"Localhost"`

#### 1337.nativeCurrency

> **nativeCurrency**: `object`

#### 1337.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 1337.nativeCurrency.name

> `readonly` **name**: `"Ether"`

#### 1337.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 1337.rpcUrls

> **rpcUrls**: `object`

#### 1337.rpcUrls.default

> `readonly` **default**: `object`

#### 1337.rpcUrls.default.http

> `readonly` **http**: readonly \[`"http://127.0.0.1:8545"`\]

#### 1337.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 1337.sourceId?

> `optional` **sourceId**: `number`

#### 1337.testnet?

> `optional` **testnet**: `boolean`

### 1337803

> **1337803**: `object` = `chains.zhejiang`

#### 1337803.blockExplorers

> **blockExplorers**: `object`

#### 1337803.blockExplorers.default

> `readonly` **default**: `object`

#### 1337803.blockExplorers.default.name

> `readonly` **name**: `"Beaconchain"`

#### 1337803.blockExplorers.default.url

> `readonly` **url**: `"https://zhejiang.beaconcha.in"`

#### 1337803.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 1337803.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 1337803.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 1337803.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 1337803.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 1337803.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 1337803.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 1337803.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 1337803.formatters?

> `optional` **formatters**: `undefined`

#### 1337803.id

> **id**: `1337803`

#### 1337803.name

> **name**: `"Zhejiang"`

#### 1337803.nativeCurrency

> **nativeCurrency**: `object`

#### 1337803.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 1337803.nativeCurrency.name

> `readonly` **name**: `"Zhejiang Ether"`

#### 1337803.nativeCurrency.symbol

> `readonly` **symbol**: `"ZhejETH"`

#### 1337803.rpcUrls

> **rpcUrls**: `object`

#### 1337803.rpcUrls.default

> `readonly` **default**: `object`

#### 1337803.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.zhejiang.ethpandaops.io"`\]

#### 1337803.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 1337803.sourceId?

> `optional` **sourceId**: `number`

#### 1337803.testnet

> **testnet**: `true`

### 13381

> **13381**: `object` = `chains.phoenix`

#### 13381.blockExplorers

> **blockExplorers**: `object`

#### 13381.blockExplorers.default

> `readonly` **default**: `object`

#### 13381.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://phoenixplorer.com/api"`

#### 13381.blockExplorers.default.name

> `readonly` **name**: `"Phoenixplorer"`

#### 13381.blockExplorers.default.url

> `readonly` **url**: `"https://phoenixplorer.com"`

#### 13381.contracts

> **contracts**: `object`

#### 13381.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 13381.contracts.multicall3.address

> `readonly` **address**: `"0x498cF757a575cFF2c2Ed9f532f56Efa797f86442"`

#### 13381.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `5620192`

#### 13381.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 13381.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 13381.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 13381.formatters?

> `optional` **formatters**: `undefined`

#### 13381.id

> **id**: `13381`

#### 13381.name

> **name**: `"Phoenix Blockchain"`

#### 13381.nativeCurrency

> **nativeCurrency**: `object`

#### 13381.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 13381.nativeCurrency.name

> `readonly` **name**: `"Phoenix"`

#### 13381.nativeCurrency.symbol

> `readonly` **symbol**: `"PHX"`

#### 13381.rpcUrls

> **rpcUrls**: `object`

#### 13381.rpcUrls.default

> `readonly` **default**: `object`

#### 13381.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.phoenixplorer.com"`\]

#### 13381.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 13381.sourceId?

> `optional` **sourceId**: `number`

#### 13381.testnet?

> `optional` **testnet**: `boolean`

### 1350216234

> **1350216234**: `object` = `chains.skaleTitan`

#### 1350216234.blockExplorers

> **blockExplorers**: `object`

#### 1350216234.blockExplorers.default

> `readonly` **default**: `object`

#### 1350216234.blockExplorers.default.name

> `readonly` **name**: `"SKALE Explorer"`

#### 1350216234.blockExplorers.default.url

> `readonly` **url**: `"https://parallel-stormy-spica.explorer.mainnet.skalenodes.com"`

#### 1350216234.contracts

> **contracts**: `object`

#### 1350216234.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 1350216234.contracts.multicall3.address

> `readonly` **address**: `"0xcA11bde05977b3631167028862bE2a173976CA11"`

#### 1350216234.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `2076458`

#### 1350216234.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 1350216234.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 1350216234.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 1350216234.formatters?

> `optional` **formatters**: `undefined`

#### 1350216234.id

> **id**: `1350216234`

#### 1350216234.name

> **name**: `"SKALE Titan Hub"`

#### 1350216234.nativeCurrency

> **nativeCurrency**: `object`

#### 1350216234.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 1350216234.nativeCurrency.name

> `readonly` **name**: `"sFUEL"`

#### 1350216234.nativeCurrency.symbol

> `readonly` **symbol**: `"sFUEL"`

#### 1350216234.rpcUrls

> **rpcUrls**: `object`

#### 1350216234.rpcUrls.default

> `readonly` **default**: `object`

#### 1350216234.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://mainnet.skalenodes.com/v1/parallel-stormy-spica"`\]

#### 1350216234.rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly \[`"wss://mainnet.skalenodes.com/v1/ws/parallel-stormy-spica"`\]

#### 1350216234.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 1350216234.sourceId?

> `optional` **sourceId**: `number`

#### 1350216234.testnet?

> `optional` **testnet**: `boolean`

### 137

> **137**: `object` = `chains.polygon`

#### 137.blockExplorers

> **blockExplorers**: `object`

#### 137.blockExplorers.default

> `readonly` **default**: `object`

#### 137.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://api.polygonscan.com/api"`

#### 137.blockExplorers.default.name

> `readonly` **name**: `"PolygonScan"`

#### 137.blockExplorers.default.url

> `readonly` **url**: `"https://polygonscan.com"`

#### 137.contracts

> **contracts**: `object`

#### 137.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 137.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 137.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `25770160`

#### 137.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 137.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 137.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 137.formatters?

> `optional` **formatters**: `undefined`

#### 137.id

> **id**: `137`

#### 137.name

> **name**: `"Polygon"`

#### 137.nativeCurrency

> **nativeCurrency**: `object`

#### 137.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 137.nativeCurrency.name

> `readonly` **name**: `"POL"`

#### 137.nativeCurrency.symbol

> `readonly` **symbol**: `"POL"`

#### 137.rpcUrls

> **rpcUrls**: `object`

#### 137.rpcUrls.default

> `readonly` **default**: `object`

#### 137.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://polygon-rpc.com"`\]

#### 137.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 137.sourceId?

> `optional` **sourceId**: `number`

#### 137.testnet?

> `optional` **testnet**: `boolean`

### 14

> **14**: `object` = `chains.flare`

#### 14.blockExplorers

> **blockExplorers**: `object`

#### 14.blockExplorers.default

> `readonly` **default**: `object`

#### 14.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://flare-explorer.flare.network/api"`

#### 14.blockExplorers.default.name

> `readonly` **name**: `"Flare Explorer"`

#### 14.blockExplorers.default.url

> `readonly` **url**: `"https://flare-explorer.flare.network"`

#### 14.contracts

> **contracts**: `object`

#### 14.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 14.contracts.multicall3.address

> `readonly` **address**: `"0xcA11bde05977b3631167028862bE2a173976CA11"`

#### 14.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `3002461`

#### 14.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 14.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 14.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 14.formatters?

> `optional` **formatters**: `undefined`

#### 14.id

> **id**: `14`

#### 14.name

> **name**: `"Flare Mainnet"`

#### 14.nativeCurrency

> **nativeCurrency**: `object`

#### 14.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 14.nativeCurrency.name

> `readonly` **name**: `"Flare"`

#### 14.nativeCurrency.symbol

> `readonly` **symbol**: `"FLR"`

#### 14.rpcUrls

> **rpcUrls**: `object`

#### 14.rpcUrls.default

> `readonly` **default**: `object`

#### 14.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://flare-api.flare.network/ext/C/rpc"`\]

#### 14.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 14.sourceId?

> `optional` **sourceId**: `number`

#### 14.testnet?

> `optional` **testnet**: `boolean`

### 148

> **148**: `object` = `chains.shimmer`

#### 148.blockExplorers

> **blockExplorers**: `object`

#### 148.blockExplorers.default

> `readonly` **default**: `object`

#### 148.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://explorer.evm.shimmer.network/api"`

#### 148.blockExplorers.default.name

> `readonly` **name**: `"Shimmer Network Explorer"`

#### 148.blockExplorers.default.url

> `readonly` **url**: `"https://explorer.evm.shimmer.network"`

#### 148.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 148.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 148.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 148.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 148.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 148.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 148.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 148.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 148.formatters?

> `optional` **formatters**: `undefined`

#### 148.id

> **id**: `148`

#### 148.name

> **name**: `"Shimmer"`

#### 148.nativeCurrency

> **nativeCurrency**: `object`

#### 148.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 148.nativeCurrency.name

> `readonly` **name**: `"Shimmer"`

#### 148.nativeCurrency.symbol

> `readonly` **symbol**: `"SMR"`

#### 148.network

> `readonly` **network**: `"shimmer"`

#### 148.rpcUrls

> **rpcUrls**: `object`

#### 148.rpcUrls.default

> `readonly` **default**: `object`

#### 148.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://json-rpc.evm.shimmer.network"`\]

#### 148.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 148.sourceId?

> `optional` **sourceId**: `number`

#### 148.testnet?

> `optional` **testnet**: `boolean`

### 1482601649

> **1482601649**: `object` = `chains.skaleNebula`

#### 1482601649.blockExplorers

> **blockExplorers**: `object`

#### 1482601649.blockExplorers.default

> `readonly` **default**: `object`

#### 1482601649.blockExplorers.default.name

> `readonly` **name**: `"SKALE Explorer"`

#### 1482601649.blockExplorers.default.url

> `readonly` **url**: `"https://green-giddy-denebola.explorer.mainnet.skalenodes.com"`

#### 1482601649.contracts

> **contracts**: `object`

#### 1482601649.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 1482601649.contracts.multicall3.address

> `readonly` **address**: `"0xcA11bde05977b3631167028862bE2a173976CA11"`

#### 1482601649.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `2372986`

#### 1482601649.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 1482601649.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 1482601649.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 1482601649.formatters?

> `optional` **formatters**: `undefined`

#### 1482601649.id

> **id**: `1482601649`

#### 1482601649.name

> **name**: `"SKALE Nebula Hub"`

#### 1482601649.nativeCurrency

> **nativeCurrency**: `object`

#### 1482601649.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 1482601649.nativeCurrency.name

> `readonly` **name**: `"sFUEL"`

#### 1482601649.nativeCurrency.symbol

> `readonly` **symbol**: `"sFUEL"`

#### 1482601649.rpcUrls

> **rpcUrls**: `object`

#### 1482601649.rpcUrls.default

> `readonly` **default**: `object`

#### 1482601649.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://mainnet.skalenodes.com/v1/green-giddy-denebola"`\]

#### 1482601649.rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly \[`"wss://mainnet.skalenodes.com/v1/ws/green-giddy-denebola"`\]

#### 1482601649.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 1482601649.sourceId?

> `optional` **sourceId**: `number`

#### 1482601649.testnet?

> `optional` **testnet**: `boolean`

### 15557

> **15557**: `object` = `chains.eosTestnet`

#### 15557.blockExplorers

> **blockExplorers**: `object`

#### 15557.blockExplorers.default

> `readonly` **default**: `object`

#### 15557.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://explorer.testnet.evm.eosnetwork.com/api"`

#### 15557.blockExplorers.default.name

> `readonly` **name**: `"EOS EVM Testnet Explorer"`

#### 15557.blockExplorers.default.url

> `readonly` **url**: `"https://explorer.testnet.evm.eosnetwork.com"`

#### 15557.contracts

> **contracts**: `object`

#### 15557.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 15557.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 15557.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `9067940`

#### 15557.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 15557.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 15557.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 15557.formatters?

> `optional` **formatters**: `undefined`

#### 15557.id

> **id**: `15557`

#### 15557.name

> **name**: `"EOS EVM Testnet"`

#### 15557.nativeCurrency

> **nativeCurrency**: `object`

#### 15557.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 15557.nativeCurrency.name

> `readonly` **name**: `"EOS"`

#### 15557.nativeCurrency.symbol

> `readonly` **symbol**: `"EOS"`

#### 15557.rpcUrls

> **rpcUrls**: `object`

#### 15557.rpcUrls.default

> `readonly` **default**: `object`

#### 15557.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://api.testnet.evm.eosnetwork.com"`\]

#### 15557.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 15557.sourceId?

> `optional` **sourceId**: `number`

#### 15557.testnet

> **testnet**: `true`

### 1559

> **1559**: `object` = `chains.tenet`

#### 1559.blockExplorers

> **blockExplorers**: `object`

#### 1559.blockExplorers.default

> `readonly` **default**: `object`

#### 1559.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://tenetscan.io/api"`

#### 1559.blockExplorers.default.name

> `readonly` **name**: `"TenetScan Mainnet"`

#### 1559.blockExplorers.default.url

> `readonly` **url**: `"https://tenetscan.io"`

#### 1559.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 1559.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 1559.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 1559.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 1559.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 1559.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 1559.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 1559.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 1559.formatters?

> `optional` **formatters**: `undefined`

#### 1559.id

> **id**: `1559`

#### 1559.name

> **name**: `"Tenet"`

#### 1559.nativeCurrency

> **nativeCurrency**: `object`

#### 1559.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 1559.nativeCurrency.name

> `readonly` **name**: `"TENET"`

#### 1559.nativeCurrency.symbol

> `readonly` **symbol**: `"TENET"`

#### 1559.network

> `readonly` **network**: `"tenet-mainnet"`

#### 1559.rpcUrls

> **rpcUrls**: `object`

#### 1559.rpcUrls.default

> `readonly` **default**: `object`

#### 1559.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.tenet.org"`\]

#### 1559.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 1559.sourceId?

> `optional` **sourceId**: `number`

#### 1559.testnet

> **testnet**: `false`

### 1663

> **1663**: `object` = `chains.gobi`

#### 1663.blockExplorers

> **blockExplorers**: `object`

#### 1663.blockExplorers.default

> `readonly` **default**: `object`

#### 1663.blockExplorers.default.name

> `readonly` **name**: `"Gobi Explorer"`

#### 1663.blockExplorers.default.url

> `readonly` **url**: `"https://gobi-explorer.horizen.io"`

#### 1663.contracts

> **contracts**: `object`

#### 1663.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 1663.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 1663.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 1663.formatters?

> `optional` **formatters**: `undefined`

#### 1663.id

> **id**: `1663`

#### 1663.name

> **name**: `"Horizen Gobi Testnet"`

#### 1663.nativeCurrency

> **nativeCurrency**: `object`

#### 1663.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 1663.nativeCurrency.name

> `readonly` **name**: `"Test ZEN"`

#### 1663.nativeCurrency.symbol

> `readonly` **symbol**: `"tZEN"`

#### 1663.rpcUrls

> **rpcUrls**: `object`

#### 1663.rpcUrls.default

> `readonly` **default**: `object`

#### 1663.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://gobi-testnet.horizenlabs.io/ethv1"`\]

#### 1663.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 1663.sourceId?

> `optional` **sourceId**: `number`

#### 1663.testnet

> **testnet**: `true`

### 1666600000

> **1666600000**: `object` = `chains.harmonyOne`

#### 1666600000.blockExplorers

> **blockExplorers**: `object`

#### 1666600000.blockExplorers.default

> `readonly` **default**: `object`

#### 1666600000.blockExplorers.default.name

> `readonly` **name**: `"Harmony Explorer"`

#### 1666600000.blockExplorers.default.url

> `readonly` **url**: `"https://explorer.harmony.one"`

#### 1666600000.contracts

> **contracts**: `object`

#### 1666600000.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 1666600000.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 1666600000.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `24185753`

#### 1666600000.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 1666600000.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 1666600000.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 1666600000.formatters?

> `optional` **formatters**: `undefined`

#### 1666600000.id

> **id**: `1666600000`

#### 1666600000.name

> **name**: `"Harmony One"`

#### 1666600000.nativeCurrency

> **nativeCurrency**: `object`

#### 1666600000.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 1666600000.nativeCurrency.name

> `readonly` **name**: `"Harmony"`

#### 1666600000.nativeCurrency.symbol

> `readonly` **symbol**: `"ONE"`

#### 1666600000.rpcUrls

> **rpcUrls**: `object`

#### 1666600000.rpcUrls.default

> `readonly` **default**: `object`

#### 1666600000.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://1666600000.rpc.thirdweb.com"`\]

#### 1666600000.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 1666600000.sourceId?

> `optional` **sourceId**: `number`

#### 1666600000.testnet?

> `optional` **testnet**: `boolean`

### 167000

> **167000**: `object` = `chains.taiko`

#### 167000.blockExplorers

> **blockExplorers**: `object`

#### 167000.blockExplorers.default

> `readonly` **default**: `object`

#### 167000.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://api.taikoscan.io/api"`

#### 167000.blockExplorers.default.name

> `readonly` **name**: `"Taikoscan"`

#### 167000.blockExplorers.default.url

> `readonly` **url**: `"https://taikoscan.io"`

#### 167000.contracts

> **contracts**: `object`

#### 167000.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 167000.contracts.multicall3.address

> `readonly` **address**: `"0xcb2436774C3e191c85056d248EF4260ce5f27A9D"`

#### 167000.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 167000.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 167000.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 167000.formatters?

> `optional` **formatters**: `undefined`

#### 167000.id

> **id**: `167000`

#### 167000.name

> **name**: `"Taiko Mainnet"`

#### 167000.nativeCurrency

> **nativeCurrency**: `object`

#### 167000.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 167000.nativeCurrency.name

> `readonly` **name**: `"Ether"`

#### 167000.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 167000.rpcUrls

> **rpcUrls**: `object`

#### 167000.rpcUrls.default

> `readonly` **default**: `object`

#### 167000.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.mainnet.taiko.xyz"`\]

#### 167000.rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly \[`"wss://ws.mainnet.taiko.xyz"`\]

#### 167000.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 167000.sourceId?

> `optional` **sourceId**: `number`

#### 167000.testnet?

> `optional` **testnet**: `boolean`

### 167007

> **167007**: `object` = `chains.taikoJolnir`

#### 167007.blockExplorers

> **blockExplorers**: `object`

#### 167007.blockExplorers.default

> `readonly` **default**: `object`

#### 167007.blockExplorers.default.name

> `readonly` **name**: `"blockscout"`

#### 167007.blockExplorers.default.url

> `readonly` **url**: `"https://explorer.jolnir.taiko.xyz"`

#### 167007.contracts

> **contracts**: `object`

#### 167007.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 167007.contracts.multicall3.address

> `readonly` **address**: `"0xcA11bde05977b3631167028862bE2a173976CA11"`

#### 167007.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `732706`

#### 167007.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 167007.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 167007.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 167007.formatters?

> `optional` **formatters**: `undefined`

#### 167007.id

> **id**: `167007`

#### 167007.name

> **name**: `"Taiko Jolnir (Alpha-5 Testnet)"`

#### 167007.nativeCurrency

> **nativeCurrency**: `object`

#### 167007.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 167007.nativeCurrency.name

> `readonly` **name**: `"Ether"`

#### 167007.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 167007.rpcUrls

> **rpcUrls**: `object`

#### 167007.rpcUrls.default

> `readonly` **default**: `object`

#### 167007.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.jolnir.taiko.xyz"`\]

#### 167007.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 167007.sourceId?

> `optional` **sourceId**: `number`

#### 167007.testnet

> **testnet**: `true`

### 167008

> **167008**: `object` = `chains.taikoKatla`

#### 167008.blockExplorers

> **blockExplorers**: `object`

#### 167008.blockExplorers.default

> `readonly` **default**: `object`

#### 167008.blockExplorers.default.name

> `readonly` **name**: `"blockscout"`

#### 167008.blockExplorers.default.url

> `readonly` **url**: `"https://explorer.katla.taiko.xyz"`

#### 167008.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 167008.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 167008.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 167008.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 167008.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 167008.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 167008.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 167008.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 167008.formatters?

> `optional` **formatters**: `undefined`

#### 167008.id

> **id**: `167008`

#### 167008.name

> **name**: `"Taiko Katla (Alpha-6 Testnet)"`

#### 167008.nativeCurrency

> **nativeCurrency**: `object`

#### 167008.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 167008.nativeCurrency.name

> `readonly` **name**: `"Ether"`

#### 167008.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 167008.network

> `readonly` **network**: `"tko-katla"`

#### 167008.rpcUrls

> **rpcUrls**: `object`

#### 167008.rpcUrls.default

> `readonly` **default**: `object`

#### 167008.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.katla.taiko.xyz"`\]

#### 167008.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 167008.sourceId?

> `optional` **sourceId**: `number`

#### 167008.testnet?

> `optional` **testnet**: `boolean`

### 167009

> **167009**: `object` = `chains.taikoHekla`

#### 167009.blockExplorers

> **blockExplorers**: `object`

#### 167009.blockExplorers.default

> `readonly` **default**: `object`

#### 167009.blockExplorers.default.name

> `readonly` **name**: `"Taikoscan"`

#### 167009.blockExplorers.default.url

> `readonly` **url**: `"https://hekla.taikoscan.network"`

#### 167009.contracts

> **contracts**: `object`

#### 167009.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 167009.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 167009.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `59757`

#### 167009.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 167009.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 167009.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 167009.formatters?

> `optional` **formatters**: `undefined`

#### 167009.id

> **id**: `167009`

#### 167009.name

> **name**: `"Taiko Hekla L2"`

#### 167009.nativeCurrency

> **nativeCurrency**: `object`

#### 167009.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 167009.nativeCurrency.name

> `readonly` **name**: `"Ether"`

#### 167009.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 167009.rpcUrls

> **rpcUrls**: `object`

#### 167009.rpcUrls.default

> `readonly` **default**: `object`

#### 167009.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.hekla.taiko.xyz"`\]

#### 167009.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 167009.sourceId?

> `optional` **sourceId**: `number`

#### 167009.testnet

> **testnet**: `true`

### 168587773

> **168587773**: `object` = `chains.blastSepolia`

#### 168587773.blockExplorers

> **blockExplorers**: `object`

#### 168587773.blockExplorers.default

> `readonly` **default**: `object`

#### 168587773.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://api-sepolia.blastscan.io/api"`

#### 168587773.blockExplorers.default.name

> `readonly` **name**: `"Blastscan"`

#### 168587773.blockExplorers.default.url

> `readonly` **url**: `"https://sepolia.blastscan.io"`

#### 168587773.contracts

> **contracts**: `object`

#### 168587773.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 168587773.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 168587773.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `756690`

#### 168587773.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 168587773.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 168587773.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 168587773.formatters?

> `optional` **formatters**: `undefined`

#### 168587773.id

> **id**: `168587773`

#### 168587773.name

> **name**: `"Blast Sepolia"`

#### 168587773.nativeCurrency

> **nativeCurrency**: `object`

#### 168587773.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 168587773.nativeCurrency.name

> `readonly` **name**: `"Ether"`

#### 168587773.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 168587773.rpcUrls

> **rpcUrls**: `object`

#### 168587773.rpcUrls.default

> `readonly` **default**: `object`

#### 168587773.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://sepolia.blast.io"`\]

#### 168587773.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 168587773.sourceId

> **sourceId**: `11155111`

#### 168587773.testnet

> **testnet**: `true`

### 169

> **169**: `object` = `chains.manta`

#### 169.blockExplorers

> **blockExplorers**: `object`

#### 169.blockExplorers.default

> `readonly` **default**: `object`

#### 169.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://pacific-explorer.manta.network/api"`

#### 169.blockExplorers.default.name

> `readonly` **name**: `"Manta Explorer"`

#### 169.blockExplorers.default.url

> `readonly` **url**: `"https://pacific-explorer.manta.network"`

#### 169.contracts

> **contracts**: `object`

#### 169.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 169.contracts.multicall3.address

> `readonly` **address**: `"0xcA11bde05977b3631167028862bE2a173976CA11"`

#### 169.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `332890`

#### 169.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 169.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 169.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 169.formatters?

> `optional` **formatters**: `undefined`

#### 169.id

> **id**: `169`

#### 169.name

> **name**: `"Manta Pacific Mainnet"`

#### 169.nativeCurrency

> **nativeCurrency**: `object`

#### 169.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 169.nativeCurrency.name

> `readonly` **name**: `"ETH"`

#### 169.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 169.network

> `readonly` **network**: `"manta"`

#### 169.rpcUrls

> **rpcUrls**: `object`

#### 169.rpcUrls.default

> `readonly` **default**: `object`

#### 169.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://pacific-rpc.manta.network/http"`\]

#### 169.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 169.sourceId?

> `optional` **sourceId**: `number`

#### 169.testnet?

> `optional` **testnet**: `boolean`

### 17000

> **17000**: `object` = `chains.holesky`

#### 17000.blockExplorers

> **blockExplorers**: `object`

#### 17000.blockExplorers.default

> `readonly` **default**: `object`

#### 17000.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://api-holesky.etherscan.io/api"`

#### 17000.blockExplorers.default.name

> `readonly` **name**: `"Etherscan"`

#### 17000.blockExplorers.default.url

> `readonly` **url**: `"https://holesky.etherscan.io"`

#### 17000.contracts

> **contracts**: `object`

#### 17000.contracts.ensRegistry

> `readonly` **ensRegistry**: `object`

#### 17000.contracts.ensRegistry.address

> `readonly` **address**: `"0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"`

#### 17000.contracts.ensRegistry.blockCreated

> `readonly` **blockCreated**: `801613`

#### 17000.contracts.ensUniversalResolver

> `readonly` **ensUniversalResolver**: `object`

#### 17000.contracts.ensUniversalResolver.address

> `readonly` **address**: `"0xa6AC935D4971E3CD133b950aE053bECD16fE7f3b"`

#### 17000.contracts.ensUniversalResolver.blockCreated

> `readonly` **blockCreated**: `973484`

#### 17000.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 17000.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 17000.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `77`

#### 17000.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 17000.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 17000.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 17000.formatters?

> `optional` **formatters**: `undefined`

#### 17000.id

> **id**: `17000`

#### 17000.name

> **name**: `"Holesky"`

#### 17000.nativeCurrency

> **nativeCurrency**: `object`

#### 17000.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 17000.nativeCurrency.name

> `readonly` **name**: `"Holesky Ether"`

#### 17000.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 17000.rpcUrls

> **rpcUrls**: `object`

#### 17000.rpcUrls.default

> `readonly` **default**: `object`

#### 17000.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://ethereum-holesky-rpc.publicnode.com"`\]

#### 17000.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 17000.sourceId?

> `optional` **sourceId**: `number`

#### 17000.testnet

> **testnet**: `true`

### 1729

> **1729**: `object` = `chains.reyaNetwork`

#### 1729.blockExplorers

> **blockExplorers**: `object`

#### 1729.blockExplorers.default

> `readonly` **default**: `object`

#### 1729.blockExplorers.default.name

> `readonly` **name**: `"Reya Network Explorer"`

#### 1729.blockExplorers.default.url

> `readonly` **url**: `"https://explorer.reya.network"`

#### 1729.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 1729.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 1729.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 1729.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 1729.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 1729.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 1729.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 1729.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 1729.formatters?

> `optional` **formatters**: `undefined`

#### 1729.id

> **id**: `1729`

#### 1729.name

> **name**: `"Reya Network"`

#### 1729.nativeCurrency

> **nativeCurrency**: `object`

#### 1729.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 1729.nativeCurrency.name

> `readonly` **name**: `"Ether"`

#### 1729.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 1729.rpcUrls

> **rpcUrls**: `object`

#### 1729.rpcUrls.default

> `readonly` **default**: `object`

#### 1729.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.reya.network"`\]

#### 1729.rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly \[`"wss://ws.reya.network"`\]

#### 1729.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 1729.sourceId?

> `optional` **sourceId**: `number`

#### 1729.testnet

> **testnet**: `false`

### 1750

> **1750**: `object` = `chains.metalL2`

#### 1750.blockExplorers

> **blockExplorers**: `object`

#### 1750.blockExplorers.default

> `readonly` **default**: `object`

#### 1750.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://explorer.metall2.com/api"`

#### 1750.blockExplorers.default.name

> `readonly` **name**: `"Explorer"`

#### 1750.blockExplorers.default.url

> `readonly` **url**: `"https://explorer.metall2.com"`

#### 1750.contracts

> **contracts**: `object`

#### 1750.contracts.gasPriceOracle

> `readonly` **gasPriceOracle**: `object`

#### 1750.contracts.gasPriceOracle.address

> `readonly` **address**: `"0x420000000000000000000000000000000000000F"`

#### 1750.contracts.l1Block

> `readonly` **l1Block**: `object`

#### 1750.contracts.l1Block.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000015"`

#### 1750.contracts.l1StandardBridge

> `readonly` **l1StandardBridge**: `object`

#### 1750.contracts.l1StandardBridge.1

> `readonly` **1**: `object`

#### 1750.contracts.l1StandardBridge.1.address

> `readonly` **address**: `"0x6d0f65D59b55B0FEC5d2d15365154DcADC140BF3"`

#### 1750.contracts.l2CrossDomainMessenger

> `readonly` **l2CrossDomainMessenger**: `object`

#### 1750.contracts.l2CrossDomainMessenger.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000007"`

#### 1750.contracts.l2Erc721Bridge

> `readonly` **l2Erc721Bridge**: `object`

#### 1750.contracts.l2Erc721Bridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000014"`

#### 1750.contracts.l2OutputOracle

> `readonly` **l2OutputOracle**: `object`

#### 1750.contracts.l2OutputOracle.1

> `readonly` **1**: `object`

#### 1750.contracts.l2OutputOracle.1.address

> `readonly` **address**: `"0x3B1F7aDa0Fcc26B13515af752Dd07fB1CAc11426"`

#### 1750.contracts.l2StandardBridge

> `readonly` **l2StandardBridge**: `object`

#### 1750.contracts.l2StandardBridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000010"`

#### 1750.contracts.l2ToL1MessagePasser

> `readonly` **l2ToL1MessagePasser**: `object`

#### 1750.contracts.l2ToL1MessagePasser.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000016"`

#### 1750.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 1750.contracts.multicall3.address

> `readonly` **address**: `"0xcA11bde05977b3631167028862bE2a173976CA11"`

#### 1750.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `0`

#### 1750.contracts.portal

> `readonly` **portal**: `object`

#### 1750.contracts.portal.1

> `readonly` **1**: `object`

#### 1750.contracts.portal.1.address

> `readonly` **address**: `"0x3F37aBdE2C6b5B2ed6F8045787Df1ED1E3753956"`

#### 1750.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 1750.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 1750.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 1750.formatters

> **formatters**: `object`

#### 1750.formatters.block

> `readonly` **block**: `object`

#### 1750.formatters.block.exclude

> **exclude**: `undefined` \| \[\]

#### 1750.formatters.block.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`OpStackRpcBlock`\<`BlockTag`, `boolean`\>

##### Returns

`object`

###### baseFeePerGas

> **baseFeePerGas**: `null` \| `bigint`

###### blobGasUsed

> **blobGasUsed**: `bigint`

###### difficulty

> **difficulty**: `bigint`

###### excessBlobGas

> **excessBlobGas**: `bigint`

###### extraData

> **extraData**: `` `0x${string}` ``

###### gasLimit

> **gasLimit**: `bigint`

###### gasUsed

> **gasUsed**: `bigint`

###### hash

> **hash**: `null` \| `` `0x${string}` ``

###### logsBloom

> **logsBloom**: `null` \| `` `0x${string}` ``

###### miner

> **miner**: `` `0x${string}` ``

###### mixHash

> **mixHash**: `` `0x${string}` ``

###### nonce

> **nonce**: `null` \| `` `0x${string}` ``

###### number

> **number**: `null` \| `bigint`

###### parentBeaconBlockRoot?

> `optional` **parentBeaconBlockRoot**: `` `0x${string}` ``

###### parentHash

> **parentHash**: `` `0x${string}` ``

###### receiptsRoot

> **receiptsRoot**: `` `0x${string}` ``

###### sealFields

> **sealFields**: `` `0x${string}` ``[]

###### sha3Uncles

> **sha3Uncles**: `` `0x${string}` ``

###### size

> **size**: `bigint`

###### stateRoot

> **stateRoot**: `` `0x${string}` ``

###### timestamp

> **timestamp**: `bigint`

###### totalDifficulty

> **totalDifficulty**: `null` \| `bigint`

###### transactions

> **transactions**: `` `0x${string}` ``[] \| `OpStackTransaction`\<`boolean`\>[]

###### transactionsRoot

> **transactionsRoot**: `` `0x${string}` ``

###### uncles

> **uncles**: `` `0x${string}` ``[]

###### withdrawals?

> `optional` **withdrawals**: `Withdrawal`[]

###### withdrawalsRoot?

> `optional` **withdrawalsRoot**: `` `0x${string}` ``

#### 1750.formatters.block.type

> **type**: `"block"`

#### 1750.formatters.transaction

> `readonly` **transaction**: `object`

#### 1750.formatters.transaction.exclude

> **exclude**: `undefined` \| \[\]

#### 1750.formatters.transaction.format()

> **format**: (`args`) => \{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

##### Parameters

###### args

`OpStackRpcTransaction`\<`boolean`\>

##### Returns

\{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

#### 1750.formatters.transaction.type

> **type**: `"transaction"`

#### 1750.formatters.transactionReceipt

> `readonly` **transactionReceipt**: `object`

#### 1750.formatters.transactionReceipt.exclude

> **exclude**: `undefined` \| \[\]

#### 1750.formatters.transactionReceipt.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`OpStackRpcTransactionReceipt`

##### Returns

`object`

###### blobGasPrice?

> `optional` **blobGasPrice**: `bigint`

###### blobGasUsed?

> `optional` **blobGasUsed**: `bigint`

###### blockHash

> **blockHash**: `` `0x${string}` ``

###### blockNumber

> **blockNumber**: `bigint`

###### contractAddress

> **contractAddress**: `undefined` \| `null` \| `` `0x${string}` ``

###### cumulativeGasUsed

> **cumulativeGasUsed**: `bigint`

###### effectiveGasPrice

> **effectiveGasPrice**: `bigint`

###### from

> **from**: `` `0x${string}` ``

###### gasUsed

> **gasUsed**: `bigint`

###### l1Fee

> **l1Fee**: `null` \| `bigint`

###### l1FeeScalar

> **l1FeeScalar**: `null` \| `number`

###### l1GasPrice

> **l1GasPrice**: `null` \| `bigint`

###### l1GasUsed

> **l1GasUsed**: `null` \| `bigint`

###### logs

> **logs**: `Log`\<`bigint`, `number`, `false`, `undefined`, `undefined`, `undefined`, `undefined`\>[]

###### logsBloom

> **logsBloom**: `` `0x${string}` ``

###### root?

> `optional` **root**: `` `0x${string}` ``

###### status

> **status**: `"success"` \| `"reverted"`

###### to

> **to**: `null` \| `` `0x${string}` ``

###### transactionHash

> **transactionHash**: `` `0x${string}` ``

###### transactionIndex

> **transactionIndex**: `number`

###### type

> **type**: `TransactionType`

#### 1750.formatters.transactionReceipt.type

> **type**: `"transactionReceipt"`

#### 1750.id

> **id**: `1750`

#### 1750.name

> **name**: `"Metal L2"`

#### 1750.nativeCurrency

> **nativeCurrency**: `object`

#### 1750.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 1750.nativeCurrency.name

> `readonly` **name**: `"Ether"`

#### 1750.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 1750.rpcUrls

> **rpcUrls**: `object`

#### 1750.rpcUrls.default

> `readonly` **default**: `object`

#### 1750.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.metall2.com"`\]

#### 1750.rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly \[`"wss://rpc.metall2.com"`\]

#### 1750.serializers

> **serializers**: `object`

#### 1750.serializers.transaction()

> `readonly` **transaction**: (`transaction`, `signature?`) => `` `0x02${string}` `` \| `` `0x01${string}` `` \| `` `0x03${string}` `` \| `` `0x04${string}` `` \| `TransactionSerializedLegacy` \| `` `0x7e${string}` ``

##### Parameters

###### transaction

`OpStackTransactionSerializable`

###### signature?

`Signature`

##### Returns

`` `0x02${string}` `` \| `` `0x01${string}` `` \| `` `0x03${string}` `` \| `` `0x04${string}` `` \| `TransactionSerializedLegacy` \| `` `0x7e${string}` ``

#### 1750.sourceId

> **sourceId**: `1`

#### 1750.testnet?

> `optional` **testnet**: `boolean`

### 17777

> **17777**: `object` = `chains.eos`

#### 17777.blockExplorers

> **blockExplorers**: `object`

#### 17777.blockExplorers.default

> `readonly` **default**: `object`

#### 17777.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://explorer.evm.eosnetwork.com/api"`

#### 17777.blockExplorers.default.name

> `readonly` **name**: `"EOS EVM Explorer"`

#### 17777.blockExplorers.default.url

> `readonly` **url**: `"https://explorer.evm.eosnetwork.com"`

#### 17777.contracts

> **contracts**: `object`

#### 17777.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 17777.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 17777.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `7943933`

#### 17777.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 17777.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 17777.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 17777.formatters?

> `optional` **formatters**: `undefined`

#### 17777.id

> **id**: `17777`

#### 17777.name

> **name**: `"EOS EVM"`

#### 17777.nativeCurrency

> **nativeCurrency**: `object`

#### 17777.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 17777.nativeCurrency.name

> `readonly` **name**: `"EOS"`

#### 17777.nativeCurrency.symbol

> `readonly` **symbol**: `"EOS"`

#### 17777.rpcUrls

> **rpcUrls**: `object`

#### 17777.rpcUrls.default

> `readonly` **default**: `object`

#### 17777.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://api.evm.eosnetwork.com"`\]

#### 17777.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 17777.sourceId?

> `optional` **sourceId**: `number`

#### 17777.testnet?

> `optional` **testnet**: `boolean`

### 18233

> **18233**: `object` = `chains.unreal`

#### 18233.blockExplorers

> **blockExplorers**: `object`

#### 18233.blockExplorers.default

> `readonly` **default**: `object`

#### 18233.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://unreal.blockscout.com/api/v2"`

#### 18233.blockExplorers.default.name

> `readonly` **name**: `"Unreal Explorer"`

#### 18233.blockExplorers.default.url

> `readonly` **url**: `"https://unreal.blockscout.com"`

#### 18233.contracts

> **contracts**: `object`

#### 18233.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 18233.contracts.multicall3.address

> `readonly` **address**: `"0x8b6B0e60D8CD84898Ea8b981065A12F876eA5677"`

#### 18233.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `1745`

#### 18233.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 18233.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 18233.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 18233.formatters?

> `optional` **formatters**: `undefined`

#### 18233.id

> **id**: `18233`

#### 18233.name

> **name**: `"Unreal"`

#### 18233.nativeCurrency

> **nativeCurrency**: `object`

#### 18233.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 18233.nativeCurrency.name

> `readonly` **name**: `"reETH"`

#### 18233.nativeCurrency.symbol

> `readonly` **symbol**: `"reETH"`

#### 18233.rpcUrls

> **rpcUrls**: `object`

#### 18233.rpcUrls.default

> `readonly` **default**: `object`

#### 18233.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.unreal-orbit.gelato.digital"`\]

#### 18233.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 18233.sourceId?

> `optional` **sourceId**: `number`

#### 18233.testnet

> **testnet**: `true`

### 19

> **19**: `object` = `chains.songbird`

#### 19.blockExplorers

> **blockExplorers**: `object`

#### 19.blockExplorers.default

> `readonly` **default**: `object`

#### 19.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://songbird-explorer.flare.network/api"`

#### 19.blockExplorers.default.name

> `readonly` **name**: `"Songbird Explorer"`

#### 19.blockExplorers.default.url

> `readonly` **url**: `"https://songbird-explorer.flare.network"`

#### 19.contracts

> **contracts**: `object`

#### 19.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 19.contracts.multicall3.address

> `readonly` **address**: `"0xcA11bde05977b3631167028862bE2a173976CA11"`

#### 19.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `13382504`

#### 19.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 19.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 19.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 19.formatters?

> `optional` **formatters**: `undefined`

#### 19.id

> **id**: `19`

#### 19.name

> **name**: `"Songbird Canary-Network"`

#### 19.nativeCurrency

> **nativeCurrency**: `object`

#### 19.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 19.nativeCurrency.name

> `readonly` **name**: `"Songbird"`

#### 19.nativeCurrency.symbol

> `readonly` **symbol**: `"SGB"`

#### 19.rpcUrls

> **rpcUrls**: `object`

#### 19.rpcUrls.default

> `readonly` **default**: `object`

#### 19.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://songbird-api.flare.network/ext/C/rpc"`\]

#### 19.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 19.sourceId?

> `optional` **sourceId**: `number`

#### 19.testnet?

> `optional` **testnet**: `boolean`

### 195

> **195**: `object` = `chains.x1Testnet`

#### 195.blockExplorers

> **blockExplorers**: `object`

#### 195.blockExplorers.default

> `readonly` **default**: `object`

#### 195.blockExplorers.default.name

> `readonly` **name**: `"OKLink"`

#### 195.blockExplorers.default.url

> `readonly` **url**: `"https://www.oklink.com/xlayer-test"`

#### 195.contracts

> **contracts**: `object`

#### 195.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 195.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 195.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `624344`

#### 195.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 195.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 195.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 195.formatters?

> `optional` **formatters**: `undefined`

#### 195.id

> **id**: `195`

#### 195.name

> **name**: `"X1 Testnet"`

#### 195.nativeCurrency

> **nativeCurrency**: `object`

#### 195.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 195.nativeCurrency.name

> `readonly` **name**: `"OKB"`

#### 195.nativeCurrency.symbol

> `readonly` **symbol**: `"OKB"`

#### 195.rpcUrls

> **rpcUrls**: `object`

#### 195.rpcUrls.default

> `readonly` **default**: `object`

#### 195.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://xlayertestrpc.okx.com"`\]

#### 195.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 195.sourceId?

> `optional` **sourceId**: `number`

#### 195.testnet

> **testnet**: `true`

### 196

> **196**: `object` = `chains.xLayer`

#### 196.blockExplorers

> **blockExplorers**: `object`

#### 196.blockExplorers.default

> `readonly` **default**: `object`

#### 196.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://www.oklink.com/api/v5/explorer/xlayer/api"`

#### 196.blockExplorers.default.name

> `readonly` **name**: `"OKLink"`

#### 196.blockExplorers.default.url

> `readonly` **url**: `"https://www.oklink.com/xlayer"`

#### 196.contracts

> **contracts**: `object`

#### 196.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 196.contracts.multicall3.address

> `readonly` **address**: `"0xcA11bde05977b3631167028862bE2a173976CA11"`

#### 196.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `47416`

#### 196.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 196.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 196.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 196.formatters?

> `optional` **formatters**: `undefined`

#### 196.id

> **id**: `196`

#### 196.name

> **name**: `"X Layer Mainnet"`

#### 196.nativeCurrency

> **nativeCurrency**: `object`

#### 196.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 196.nativeCurrency.name

> `readonly` **name**: `"OKB"`

#### 196.nativeCurrency.symbol

> `readonly` **symbol**: `"OKB"`

#### 196.rpcUrls

> **rpcUrls**: `object`

#### 196.rpcUrls.default

> `readonly` **default**: `object`

#### 196.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.xlayer.tech"`\]

#### 196.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 196.sourceId?

> `optional` **sourceId**: `number`

#### 196.testnet?

> `optional` **testnet**: `boolean`

### 199

> **199**: `object` = `chains.bitTorrent`

#### 199.blockExplorers

> **blockExplorers**: `object`

#### 199.blockExplorers.default

> `readonly` **default**: `object`

#### 199.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://api.bttcscan.com/api"`

#### 199.blockExplorers.default.name

> `readonly` **name**: `"Bttcscan"`

#### 199.blockExplorers.default.url

> `readonly` **url**: `"https://bttcscan.com"`

#### 199.contracts

> **contracts**: `object`

#### 199.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 199.contracts.multicall3.address

> `readonly` **address**: `"0xcA11bde05977b3631167028862bE2a173976CA11"`

#### 199.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `31078552`

#### 199.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 199.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 199.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 199.formatters?

> `optional` **formatters**: `undefined`

#### 199.id

> **id**: `199`

#### 199.name

> **name**: `"BitTorrent"`

#### 199.nativeCurrency

> **nativeCurrency**: `object`

#### 199.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 199.nativeCurrency.name

> `readonly` **name**: `"BitTorrent"`

#### 199.nativeCurrency.symbol

> `readonly` **symbol**: `"BTT"`

#### 199.network

> `readonly` **network**: `"bittorrent-chain-mainnet"`

#### 199.rpcUrls

> **rpcUrls**: `object`

#### 199.rpcUrls.default

> `readonly` **default**: `object`

#### 199.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.bittorrentchain.io"`\]

#### 199.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 199.sourceId?

> `optional` **sourceId**: `number`

#### 199.testnet?

> `optional` **testnet**: `boolean`

### 1994

> **1994**: `object` = `chains.ekta`

#### 1994.blockExplorers

> **blockExplorers**: `object`

#### 1994.blockExplorers.default

> `readonly` **default**: `object`

#### 1994.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://ektascan.io/api"`

#### 1994.blockExplorers.default.name

> `readonly` **name**: `"Ektascan"`

#### 1994.blockExplorers.default.url

> `readonly` **url**: `"https://ektascan.io"`

#### 1994.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 1994.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 1994.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 1994.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 1994.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 1994.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 1994.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 1994.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 1994.formatters?

> `optional` **formatters**: `undefined`

#### 1994.id

> **id**: `1994`

#### 1994.name

> **name**: `"Ekta"`

#### 1994.nativeCurrency

> **nativeCurrency**: `object`

#### 1994.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 1994.nativeCurrency.name

> `readonly` **name**: `"EKTA"`

#### 1994.nativeCurrency.symbol

> `readonly` **symbol**: `"EKTA"`

#### 1994.rpcUrls

> **rpcUrls**: `object`

#### 1994.rpcUrls.default

> `readonly` **default**: `object`

#### 1994.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://main.ekta.io"`\]

#### 1994.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 1994.sourceId?

> `optional` **sourceId**: `number`

#### 1994.testnet?

> `optional` **testnet**: `boolean`

### 2000

> **2000**: `object` = `chains.dogechain`

#### 2000.blockExplorers

> **blockExplorers**: `object`

#### 2000.blockExplorers.default

> `readonly` **default**: `object`

#### 2000.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://explorer.dogechain.dog/api"`

#### 2000.blockExplorers.default.name

> `readonly` **name**: `"DogeChainExplorer"`

#### 2000.blockExplorers.default.url

> `readonly` **url**: `"https://explorer.dogechain.dog"`

#### 2000.contracts

> **contracts**: `object`

#### 2000.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 2000.contracts.multicall3.address

> `readonly` **address**: `"0x68a8609a60a008EFA633dfdec592c03B030cC508"`

#### 2000.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `25384031`

#### 2000.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 2000.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 2000.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 2000.formatters?

> `optional` **formatters**: `undefined`

#### 2000.id

> **id**: `2000`

#### 2000.name

> **name**: `"Dogechain"`

#### 2000.nativeCurrency

> **nativeCurrency**: `object`

#### 2000.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 2000.nativeCurrency.name

> `readonly` **name**: `"Wrapped Dogecoin"`

#### 2000.nativeCurrency.symbol

> `readonly` **symbol**: `"WDOGE"`

#### 2000.rpcUrls

> **rpcUrls**: `object`

#### 2000.rpcUrls.default

> `readonly` **default**: `object`

#### 2000.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.dogechain.dog"`\]

#### 2000.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 2000.sourceId?

> `optional` **sourceId**: `number`

#### 2000.testnet?

> `optional` **testnet**: `boolean`

### 200810

> **200810**: `object` = `chains.btrTestnet`

#### 200810.blockExplorers

> **blockExplorers**: `object`

#### 200810.blockExplorers.default

> `readonly` **default**: `object`

#### 200810.blockExplorers.default.name

> `readonly` **name**: `"Bitlayer(BTR) Scan"`

#### 200810.blockExplorers.default.url

> `readonly` **url**: `"https://testnet.btrscan.com"`

#### 200810.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 200810.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 200810.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 200810.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 200810.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 200810.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 200810.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 200810.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 200810.formatters?

> `optional` **formatters**: `undefined`

#### 200810.id

> **id**: `200810`

#### 200810.name

> **name**: `"Bitlayer Testnet"`

#### 200810.nativeCurrency

> **nativeCurrency**: `object`

#### 200810.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 200810.nativeCurrency.name

> `readonly` **name**: `"Bitcoin"`

#### 200810.nativeCurrency.symbol

> `readonly` **symbol**: `"BTC"`

#### 200810.rpcUrls

> **rpcUrls**: `object`

#### 200810.rpcUrls.default

> `readonly` **default**: `object`

#### 200810.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://testnet-rpc.bitlayer.org"`\]

#### 200810.rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly \[`"wss://testnet-ws.bitlayer.org"`, `"wss://testnet-ws.bitlayer-rpc.com"`\]

#### 200810.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 200810.sourceId?

> `optional` **sourceId**: `number`

#### 200810.testnet

> **testnet**: `true`

### 200901

> **200901**: `object` = `chains.btr`

#### 200901.blockExplorers

> **blockExplorers**: `object`

#### 200901.blockExplorers.default

> `readonly` **default**: `object`

#### 200901.blockExplorers.default.name

> `readonly` **name**: `"Bitlayer(BTR) Scan"`

#### 200901.blockExplorers.default.url

> `readonly` **url**: `"https://www.btrscan.com"`

#### 200901.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 200901.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 200901.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 200901.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 200901.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 200901.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 200901.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 200901.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 200901.formatters?

> `optional` **formatters**: `undefined`

#### 200901.id

> **id**: `200901`

#### 200901.name

> **name**: `"Bitlayer"`

#### 200901.nativeCurrency

> **nativeCurrency**: `object`

#### 200901.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 200901.nativeCurrency.name

> `readonly` **name**: `"Bitcoin"`

#### 200901.nativeCurrency.symbol

> `readonly` **symbol**: `"BTC"`

#### 200901.rpcUrls

> **rpcUrls**: `object`

#### 200901.rpcUrls.default

> `readonly` **default**: `object`

#### 200901.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.bitlayer.org"`, `"https://rpc.bitlayer-rpc.com"`\]

#### 200901.rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly \[`"wss://ws.bitlayer.org"`, `"wss://ws.bitlayer-rpc.com"`\]

#### 200901.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 200901.sourceId?

> `optional` **sourceId**: `number`

#### 200901.testnet?

> `optional` **testnet**: `boolean`

### 2020

> **2020**: `object` = `chains.ronin`

#### 2020.blockExplorers

> **blockExplorers**: `object`

#### 2020.blockExplorers.default

> `readonly` **default**: `object`

#### 2020.blockExplorers.default.name

> `readonly` **name**: `"Ronin Explorer"`

#### 2020.blockExplorers.default.url

> `readonly` **url**: `"https://app.roninchain.com"`

#### 2020.contracts

> **contracts**: `object`

#### 2020.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 2020.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 2020.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `26023535`

#### 2020.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 2020.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 2020.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 2020.formatters?

> `optional` **formatters**: `undefined`

#### 2020.id

> **id**: `2020`

#### 2020.name

> **name**: `"Ronin"`

#### 2020.nativeCurrency

> **nativeCurrency**: `object`

#### 2020.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 2020.nativeCurrency.name

> `readonly` **name**: `"RON"`

#### 2020.nativeCurrency.symbol

> `readonly` **symbol**: `"RON"`

#### 2020.rpcUrls

> **rpcUrls**: `object`

#### 2020.rpcUrls.default

> `readonly` **default**: `object`

#### 2020.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://api.roninchain.com/rpc"`\]

#### 2020.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 2020.sourceId?

> `optional` **sourceId**: `number`

#### 2020.testnet?

> `optional` **testnet**: `boolean`

### 2021

> **2021**: `object` = `chains.edgeware`

#### 2021.blockExplorers

> **blockExplorers**: `object`

#### 2021.blockExplorers.default

> `readonly` **default**: `object`

#### 2021.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://edgscan.live/api"`

#### 2021.blockExplorers.default.name

> `readonly` **name**: `"Edgscan by Bharathcoorg"`

#### 2021.blockExplorers.default.url

> `readonly` **url**: `"https://edgscan.live"`

#### 2021.contracts

> **contracts**: `object`

#### 2021.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 2021.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 2021.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `18117872`

#### 2021.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 2021.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 2021.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 2021.formatters?

> `optional` **formatters**: `undefined`

#### 2021.id

> **id**: `2021`

#### 2021.name

> **name**: `"Edgeware EdgeEVM Mainnet"`

#### 2021.nativeCurrency

> **nativeCurrency**: `object`

#### 2021.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 2021.nativeCurrency.name

> `readonly` **name**: `"Edgeware"`

#### 2021.nativeCurrency.symbol

> `readonly` **symbol**: `"EDG"`

#### 2021.rpcUrls

> **rpcUrls**: `object`

#### 2021.rpcUrls.default

> `readonly` **default**: `object`

#### 2021.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://edgeware-evm.jelliedowl.net"`\]

#### 2021.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 2021.sourceId?

> `optional` **sourceId**: `number`

#### 2021.testnet?

> `optional` **testnet**: `boolean`

### 2026

> **2026**: `object` = `chains.edgeless`

#### 2026.blockExplorers

> **blockExplorers**: `object`

#### 2026.blockExplorers.default

> `readonly` **default**: `object`

#### 2026.blockExplorers.default.name

> `readonly` **name**: `"Edgeless Explorer"`

#### 2026.blockExplorers.default.url

> `readonly` **url**: `"https://explorer.edgeless.network"`

#### 2026.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 2026.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 2026.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 2026.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 2026.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 2026.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 2026.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 2026.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 2026.formatters?

> `optional` **formatters**: `undefined`

#### 2026.id

> **id**: `2026`

#### 2026.name

> **name**: `"Edgeless Network"`

#### 2026.nativeCurrency

> **nativeCurrency**: `object`

#### 2026.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 2026.nativeCurrency.name

> `readonly` **name**: `"Edgeless Wrapped ETH"`

#### 2026.nativeCurrency.symbol

> `readonly` **symbol**: `"EwETH"`

#### 2026.rpcUrls

> **rpcUrls**: `object`

#### 2026.rpcUrls.default

> `readonly` **default**: `object`

#### 2026.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.edgeless.network/http"`\]

#### 2026.rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly \[`"wss://rpc.edgeless.network/ws"`\]

#### 2026.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 2026.sourceId?

> `optional` **sourceId**: `number`

#### 2026.testnet?

> `optional` **testnet**: `boolean`

### 204

> **204**: `object` = `chains.opBNB`

#### 204.blockExplorers

> **blockExplorers**: `object`

#### 204.blockExplorers.default

> `readonly` **default**: `object`

#### 204.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://api-opbnb.bscscan.com/api"`

#### 204.blockExplorers.default.name

> `readonly` **name**: `"opBNB (BSCScan)"`

#### 204.blockExplorers.default.url

> `readonly` **url**: `"https://opbnb.bscscan.com"`

#### 204.contracts

> **contracts**: `object`

#### 204.contracts.gasPriceOracle

> `readonly` **gasPriceOracle**: `object`

#### 204.contracts.gasPriceOracle.address

> `readonly` **address**: `"0x420000000000000000000000000000000000000F"`

#### 204.contracts.l1Block

> `readonly` **l1Block**: `object`

#### 204.contracts.l1Block.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000015"`

#### 204.contracts.l1StandardBridge

> `readonly` **l1StandardBridge**: `object`

#### 204.contracts.l1StandardBridge.56

> `readonly` **56**: `object`

#### 204.contracts.l1StandardBridge.56.address

> `readonly` **address**: `"0xF05F0e4362859c3331Cb9395CBC201E3Fa6757Ea"`

#### 204.contracts.l2CrossDomainMessenger

> `readonly` **l2CrossDomainMessenger**: `object`

#### 204.contracts.l2CrossDomainMessenger.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000007"`

#### 204.contracts.l2Erc721Bridge

> `readonly` **l2Erc721Bridge**: `object`

#### 204.contracts.l2Erc721Bridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000014"`

#### 204.contracts.l2OutputOracle

> `readonly` **l2OutputOracle**: `object`

#### 204.contracts.l2OutputOracle.56

> `readonly` **56**: `object`

#### 204.contracts.l2OutputOracle.56.address

> `readonly` **address**: `"0x153CAB79f4767E2ff862C94aa49573294B13D169"`

#### 204.contracts.l2StandardBridge

> `readonly` **l2StandardBridge**: `object`

#### 204.contracts.l2StandardBridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000010"`

#### 204.contracts.l2ToL1MessagePasser

> `readonly` **l2ToL1MessagePasser**: `object`

#### 204.contracts.l2ToL1MessagePasser.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000016"`

#### 204.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 204.contracts.multicall3.address

> `readonly` **address**: `"0xcA11bde05977b3631167028862bE2a173976CA11"`

#### 204.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `512881`

#### 204.contracts.portal

> `readonly` **portal**: `object`

#### 204.contracts.portal.56

> `readonly` **56**: `object`

#### 204.contracts.portal.56.address

> `readonly` **address**: `"0x1876EA7702C0ad0C6A2ae6036DE7733edfBca519"`

#### 204.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 204.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 204.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 204.formatters?

> `optional` **formatters**: `undefined`

#### 204.id

> **id**: `204`

#### 204.name

> **name**: `"opBNB"`

#### 204.nativeCurrency

> **nativeCurrency**: `object`

#### 204.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 204.nativeCurrency.name

> `readonly` **name**: `"BNB"`

#### 204.nativeCurrency.symbol

> `readonly` **symbol**: `"BNB"`

#### 204.rpcUrls

> **rpcUrls**: `object`

#### 204.rpcUrls.default

> `readonly` **default**: `object`

#### 204.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://opbnb-mainnet-rpc.bnbchain.org"`\]

#### 204.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 204.sourceId

> **sourceId**: `56`

#### 204.testnet?

> `optional` **testnet**: `boolean`

### 2046399126

> **2046399126**: `object` = `chains.skaleEuropa`

#### 2046399126.blockExplorers

> **blockExplorers**: `object`

#### 2046399126.blockExplorers.default

> `readonly` **default**: `object`

#### 2046399126.blockExplorers.default.name

> `readonly` **name**: `"SKALE Explorer"`

#### 2046399126.blockExplorers.default.url

> `readonly` **url**: `"https://elated-tan-skat.explorer.mainnet.skalenodes.com"`

#### 2046399126.contracts

> **contracts**: `object`

#### 2046399126.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 2046399126.contracts.multicall3.address

> `readonly` **address**: `"0xcA11bde05977b3631167028862bE2a173976CA11"`

#### 2046399126.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `3113495`

#### 2046399126.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 2046399126.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 2046399126.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 2046399126.formatters?

> `optional` **formatters**: `undefined`

#### 2046399126.id

> **id**: `2046399126`

#### 2046399126.name

> **name**: `"SKALE Europa Hub"`

#### 2046399126.nativeCurrency

> **nativeCurrency**: `object`

#### 2046399126.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 2046399126.nativeCurrency.name

> `readonly` **name**: `"sFUEL"`

#### 2046399126.nativeCurrency.symbol

> `readonly` **symbol**: `"sFUEL"`

#### 2046399126.rpcUrls

> **rpcUrls**: `object`

#### 2046399126.rpcUrls.default

> `readonly` **default**: `object`

#### 2046399126.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://mainnet.skalenodes.com/v1/elated-tan-skat"`\]

#### 2046399126.rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly \[`"wss://mainnet.skalenodes.com/v1/ws/elated-tan-skat"`\]

#### 2046399126.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 2046399126.sourceId?

> `optional` **sourceId**: `number`

#### 2046399126.testnet?

> `optional` **testnet**: `boolean`

### 205205

> **205205**: `object` = `chains.auroria`

#### 205205.blockExplorers

> **blockExplorers**: `object`

#### 205205.blockExplorers.default

> `readonly` **default**: `object`

#### 205205.blockExplorers.default.name

> `readonly` **name**: `"Auroria Testnet Explorer"`

#### 205205.blockExplorers.default.url

> `readonly` **url**: `"https://auroria.explorer.stratisevm.com"`

#### 205205.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 205205.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 205205.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 205205.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 205205.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 205205.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 205205.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 205205.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 205205.formatters?

> `optional` **formatters**: `undefined`

#### 205205.id

> **id**: `205205`

#### 205205.name

> **name**: `"Auroria Testnet"`

#### 205205.nativeCurrency

> **nativeCurrency**: `object`

#### 205205.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 205205.nativeCurrency.name

> `readonly` **name**: `"Auroria Stratis"`

#### 205205.nativeCurrency.symbol

> `readonly` **symbol**: `"tSTRAX"`

#### 205205.network

> `readonly` **network**: `"auroria"`

#### 205205.rpcUrls

> **rpcUrls**: `object`

#### 205205.rpcUrls.default

> `readonly` **default**: `object`

#### 205205.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://auroria.rpc.stratisevm.com"`\]

#### 205205.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 205205.sourceId?

> `optional` **sourceId**: `number`

#### 205205.testnet

> **testnet**: `true`

### 2139927552

> **2139927552**: `object` = `chains.skaleExorde`

#### 2139927552.blockExplorers

> **blockExplorers**: `object`

#### 2139927552.blockExplorers.default

> `readonly` **default**: `object`

#### 2139927552.blockExplorers.default.name

> `readonly` **name**: `"SKALE Explorer"`

#### 2139927552.blockExplorers.default.url

> `readonly` **url**: `"https://light-vast-diphda.explorer.mainnet.skalenodes.com"`

#### 2139927552.contracts

> **contracts**: `object`

#### 2139927552.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 2139927552.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 2139927552.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 2139927552.formatters?

> `optional` **formatters**: `undefined`

#### 2139927552.id

> **id**: `2139927552`

#### 2139927552.name

> **name**: `"Exorde Network"`

#### 2139927552.nativeCurrency

> **nativeCurrency**: `object`

#### 2139927552.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 2139927552.nativeCurrency.name

> `readonly` **name**: `"sFUEL"`

#### 2139927552.nativeCurrency.symbol

> `readonly` **symbol**: `"sFUEL"`

#### 2139927552.rpcUrls

> **rpcUrls**: `object`

#### 2139927552.rpcUrls.default

> `readonly` **default**: `object`

#### 2139927552.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://mainnet.skalenodes.com/v1/light-vast-diphda"`\]

#### 2139927552.rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly \[`"wss://mainnet.skalenodes.com/v1/ws/light-vast-diphda"`\]

#### 2139927552.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 2139927552.sourceId?

> `optional` **sourceId**: `number`

#### 2139927552.testnet?

> `optional` **testnet**: `boolean`

### 2221

> **2221**: `object` = `chains.kavaTestnet`

#### 2221.blockExplorers

> **blockExplorers**: `object`

#### 2221.blockExplorers.default

> `readonly` **default**: `object`

#### 2221.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://testnet.kavascan.com/api"`

#### 2221.blockExplorers.default.name

> `readonly` **name**: `"Kava EVM Testnet Explorer"`

#### 2221.blockExplorers.default.url

> `readonly` **url**: `"https://testnet.kavascan.com/"`

#### 2221.contracts

> **contracts**: `object`

#### 2221.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 2221.contracts.multicall3.address

> `readonly` **address**: `"0xDf1D724A7166261eEB015418fe8c7679BBEa7fd6"`

#### 2221.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `7242179`

#### 2221.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 2221.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 2221.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 2221.formatters?

> `optional` **formatters**: `undefined`

#### 2221.id

> **id**: `2221`

#### 2221.name

> **name**: `"Kava EVM Testnet"`

#### 2221.nativeCurrency

> **nativeCurrency**: `object`

#### 2221.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 2221.nativeCurrency.name

> `readonly` **name**: `"Kava"`

#### 2221.nativeCurrency.symbol

> `readonly` **symbol**: `"KAVA"`

#### 2221.network

> `readonly` **network**: `"kava-testnet"`

#### 2221.rpcUrls

> **rpcUrls**: `object`

#### 2221.rpcUrls.default

> `readonly` **default**: `object`

#### 2221.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://evm.testnet.kava.io"`\]

#### 2221.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 2221.sourceId?

> `optional` **sourceId**: `number`

#### 2221.testnet

> **testnet**: `true`

### 2222

> **2222**: `object` = `chains.kava`

#### 2222.blockExplorers

> **blockExplorers**: `object`

#### 2222.blockExplorers.default

> `readonly` **default**: `object`

#### 2222.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://kavascan.com/api"`

#### 2222.blockExplorers.default.name

> `readonly` **name**: `"Kava EVM Explorer"`

#### 2222.blockExplorers.default.url

> `readonly` **url**: `"https://kavascan.com"`

#### 2222.contracts

> **contracts**: `object`

#### 2222.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 2222.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 2222.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `3661165`

#### 2222.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 2222.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 2222.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 2222.formatters?

> `optional` **formatters**: `undefined`

#### 2222.id

> **id**: `2222`

#### 2222.name

> **name**: `"Kava EVM"`

#### 2222.nativeCurrency

> **nativeCurrency**: `object`

#### 2222.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 2222.nativeCurrency.name

> `readonly` **name**: `"Kava"`

#### 2222.nativeCurrency.symbol

> `readonly` **symbol**: `"KAVA"`

#### 2222.network

> `readonly` **network**: `"kava-mainnet"`

#### 2222.rpcUrls

> **rpcUrls**: `object`

#### 2222.rpcUrls.default

> `readonly` **default**: `object`

#### 2222.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://evm.kava.io"`\]

#### 2222.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 2222.sourceId?

> `optional` **sourceId**: `number`

#### 2222.testnet

> **testnet**: `false`

### 22222

> **22222**: `object` = `chains.nautilus`

#### 22222.blockExplorers

> **blockExplorers**: `object`

#### 22222.blockExplorers.default

> `readonly` **default**: `object`

#### 22222.blockExplorers.default.name

> `readonly` **name**: `"NautScan"`

#### 22222.blockExplorers.default.url

> `readonly` **url**: `"https://nautscan.com"`

#### 22222.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 22222.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 22222.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 22222.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 22222.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 22222.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 22222.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 22222.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 22222.formatters?

> `optional` **formatters**: `undefined`

#### 22222.id

> **id**: `22222`

#### 22222.name

> **name**: `"Nautilus Mainnet"`

#### 22222.nativeCurrency

> **nativeCurrency**: `object`

#### 22222.nativeCurrency.decimals

> `readonly` **decimals**: `9`

#### 22222.nativeCurrency.name

> `readonly` **name**: `"ZBC"`

#### 22222.nativeCurrency.symbol

> `readonly` **symbol**: `"ZBC"`

#### 22222.rpcUrls

> **rpcUrls**: `object`

#### 22222.rpcUrls.default

> `readonly` **default**: `object`

#### 22222.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://api.nautilus.nautchain.xyz"`\]

#### 22222.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 22222.sourceId?

> `optional` **sourceId**: `number`

#### 22222.testnet?

> `optional` **testnet**: `boolean`

### 23294

> **23294**: `object` = `chains.sapphire`

#### 23294.blockExplorers

> **blockExplorers**: `object`

#### 23294.blockExplorers.default

> `readonly` **default**: `object`

#### 23294.blockExplorers.default.name

> `readonly` **name**: `"Oasis Explorer"`

#### 23294.blockExplorers.default.url

> `readonly` **url**: `"https://explorer.oasis.io/mainnet/sapphire"`

#### 23294.contracts

> **contracts**: `object`

#### 23294.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 23294.contracts.multicall3.address

> `readonly` **address**: `"0xcA11bde05977b3631167028862bE2a173976CA11"`

#### 23294.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `734531`

#### 23294.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 23294.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 23294.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 23294.formatters?

> `optional` **formatters**: `undefined`

#### 23294.id

> **id**: `23294`

#### 23294.name

> **name**: `"Oasis Sapphire"`

#### 23294.nativeCurrency

> **nativeCurrency**: `object`

#### 23294.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 23294.nativeCurrency.name

> `readonly` **name**: `"Sapphire Rose"`

#### 23294.nativeCurrency.symbol

> `readonly` **symbol**: `"ROSE"`

#### 23294.network

> `readonly` **network**: `"sapphire"`

#### 23294.rpcUrls

> **rpcUrls**: `object`

#### 23294.rpcUrls.default

> `readonly` **default**: `object`

#### 23294.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://sapphire.oasis.io"`\]

#### 23294.rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly \[`"wss://sapphire.oasis.io/ws"`\]

#### 23294.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 23294.sourceId?

> `optional` **sourceId**: `number`

#### 23294.testnet?

> `optional` **testnet**: `boolean`

### 2331

> **2331**: `object` = `chains.rss3Sepolia`

#### 2331.blockExplorers

> **blockExplorers**: `object`

#### 2331.blockExplorers.default

> `readonly` **default**: `object`

#### 2331.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://scan.testnet.rss3.io/api"`

#### 2331.blockExplorers.default.name

> `readonly` **name**: `"RSS3 VSL Sepolia Testnet Scan"`

#### 2331.blockExplorers.default.url

> `readonly` **url**: `"https://scan.testnet.rss3.io"`

#### 2331.contracts

> **contracts**: `object`

#### 2331.contracts.gasPriceOracle

> `readonly` **gasPriceOracle**: `object`

#### 2331.contracts.gasPriceOracle.address

> `readonly` **address**: `"0x420000000000000000000000000000000000000F"`

#### 2331.contracts.l1Block

> `readonly` **l1Block**: `object`

#### 2331.contracts.l1Block.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000015"`

#### 2331.contracts.l1StandardBridge

> `readonly` **l1StandardBridge**: `object`

#### 2331.contracts.l1StandardBridge.11155111

> `readonly` **11155111**: `object`

#### 2331.contracts.l1StandardBridge.11155111.address

> `readonly` **address**: `"0xdDD29bb63B0839FB1cE0eE439Ff027738595D07B"`

#### 2331.contracts.l2CrossDomainMessenger

> `readonly` **l2CrossDomainMessenger**: `object`

#### 2331.contracts.l2CrossDomainMessenger.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000007"`

#### 2331.contracts.l2Erc721Bridge

> `readonly` **l2Erc721Bridge**: `object`

#### 2331.contracts.l2Erc721Bridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000014"`

#### 2331.contracts.l2OutputOracle

> `readonly` **l2OutputOracle**: `object`

#### 2331.contracts.l2OutputOracle.11155111

> `readonly` **11155111**: `object`

#### 2331.contracts.l2OutputOracle.11155111.address

> `readonly` **address**: `"0xDb5c46C3Eaa6Ed6aE8b2379785DF7dd029C0dC81"`

#### 2331.contracts.l2StandardBridge

> `readonly` **l2StandardBridge**: `object`

#### 2331.contracts.l2StandardBridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000010"`

#### 2331.contracts.l2ToL1MessagePasser

> `readonly` **l2ToL1MessagePasser**: `object`

#### 2331.contracts.l2ToL1MessagePasser.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000016"`

#### 2331.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 2331.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 2331.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `55697`

#### 2331.contracts.portal

> `readonly` **portal**: `object`

#### 2331.contracts.portal.11155111

> `readonly` **11155111**: `object`

#### 2331.contracts.portal.11155111.address

> `readonly` **address**: `"0xcBD77E8E1E7F06B25baDe67142cdE82652Da7b57"`

#### 2331.contracts.portal.11155111.blockCreated

> `readonly` **blockCreated**: `5345035`

#### 2331.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 2331.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 2331.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 2331.formatters

> **formatters**: `object`

#### 2331.formatters.block

> `readonly` **block**: `object`

#### 2331.formatters.block.exclude

> **exclude**: `undefined` \| \[\]

#### 2331.formatters.block.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`OpStackRpcBlock`\<`BlockTag`, `boolean`\>

##### Returns

`object`

###### baseFeePerGas

> **baseFeePerGas**: `null` \| `bigint`

###### blobGasUsed

> **blobGasUsed**: `bigint`

###### difficulty

> **difficulty**: `bigint`

###### excessBlobGas

> **excessBlobGas**: `bigint`

###### extraData

> **extraData**: `` `0x${string}` ``

###### gasLimit

> **gasLimit**: `bigint`

###### gasUsed

> **gasUsed**: `bigint`

###### hash

> **hash**: `null` \| `` `0x${string}` ``

###### logsBloom

> **logsBloom**: `null` \| `` `0x${string}` ``

###### miner

> **miner**: `` `0x${string}` ``

###### mixHash

> **mixHash**: `` `0x${string}` ``

###### nonce

> **nonce**: `null` \| `` `0x${string}` ``

###### number

> **number**: `null` \| `bigint`

###### parentBeaconBlockRoot?

> `optional` **parentBeaconBlockRoot**: `` `0x${string}` ``

###### parentHash

> **parentHash**: `` `0x${string}` ``

###### receiptsRoot

> **receiptsRoot**: `` `0x${string}` ``

###### sealFields

> **sealFields**: `` `0x${string}` ``[]

###### sha3Uncles

> **sha3Uncles**: `` `0x${string}` ``

###### size

> **size**: `bigint`

###### stateRoot

> **stateRoot**: `` `0x${string}` ``

###### timestamp

> **timestamp**: `bigint`

###### totalDifficulty

> **totalDifficulty**: `null` \| `bigint`

###### transactions

> **transactions**: `` `0x${string}` ``[] \| `OpStackTransaction`\<`boolean`\>[]

###### transactionsRoot

> **transactionsRoot**: `` `0x${string}` ``

###### uncles

> **uncles**: `` `0x${string}` ``[]

###### withdrawals?

> `optional` **withdrawals**: `Withdrawal`[]

###### withdrawalsRoot?

> `optional` **withdrawalsRoot**: `` `0x${string}` ``

#### 2331.formatters.block.type

> **type**: `"block"`

#### 2331.formatters.transaction

> `readonly` **transaction**: `object`

#### 2331.formatters.transaction.exclude

> **exclude**: `undefined` \| \[\]

#### 2331.formatters.transaction.format()

> **format**: (`args`) => \{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

##### Parameters

###### args

`OpStackRpcTransaction`\<`boolean`\>

##### Returns

\{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

#### 2331.formatters.transaction.type

> **type**: `"transaction"`

#### 2331.formatters.transactionReceipt

> `readonly` **transactionReceipt**: `object`

#### 2331.formatters.transactionReceipt.exclude

> **exclude**: `undefined` \| \[\]

#### 2331.formatters.transactionReceipt.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`OpStackRpcTransactionReceipt`

##### Returns

`object`

###### blobGasPrice?

> `optional` **blobGasPrice**: `bigint`

###### blobGasUsed?

> `optional` **blobGasUsed**: `bigint`

###### blockHash

> **blockHash**: `` `0x${string}` ``

###### blockNumber

> **blockNumber**: `bigint`

###### contractAddress

> **contractAddress**: `undefined` \| `null` \| `` `0x${string}` ``

###### cumulativeGasUsed

> **cumulativeGasUsed**: `bigint`

###### effectiveGasPrice

> **effectiveGasPrice**: `bigint`

###### from

> **from**: `` `0x${string}` ``

###### gasUsed

> **gasUsed**: `bigint`

###### l1Fee

> **l1Fee**: `null` \| `bigint`

###### l1FeeScalar

> **l1FeeScalar**: `null` \| `number`

###### l1GasPrice

> **l1GasPrice**: `null` \| `bigint`

###### l1GasUsed

> **l1GasUsed**: `null` \| `bigint`

###### logs

> **logs**: `Log`\<`bigint`, `number`, `false`, `undefined`, `undefined`, `undefined`, `undefined`\>[]

###### logsBloom

> **logsBloom**: `` `0x${string}` ``

###### root?

> `optional` **root**: `` `0x${string}` ``

###### status

> **status**: `"success"` \| `"reverted"`

###### to

> **to**: `null` \| `` `0x${string}` ``

###### transactionHash

> **transactionHash**: `` `0x${string}` ``

###### transactionIndex

> **transactionIndex**: `number`

###### type

> **type**: `TransactionType`

#### 2331.formatters.transactionReceipt.type

> **type**: `"transactionReceipt"`

#### 2331.id

> **id**: `2331`

#### 2331.name

> **name**: `"RSS3 VSL Sepolia Testnet"`

#### 2331.nativeCurrency

> **nativeCurrency**: `object`

#### 2331.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 2331.nativeCurrency.name

> `readonly` **name**: `"RSS3"`

#### 2331.nativeCurrency.symbol

> `readonly` **symbol**: `"RSS3"`

#### 2331.rpcUrls

> **rpcUrls**: `object`

#### 2331.rpcUrls.default

> `readonly` **default**: `object`

#### 2331.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.testnet.rss3.io"`\]

#### 2331.serializers

> **serializers**: `object`

#### 2331.serializers.transaction()

> `readonly` **transaction**: (`transaction`, `signature?`) => `` `0x02${string}` `` \| `` `0x01${string}` `` \| `` `0x03${string}` `` \| `` `0x04${string}` `` \| `TransactionSerializedLegacy` \| `` `0x7e${string}` ``

##### Parameters

###### transaction

`OpStackTransactionSerializable`

###### signature?

`Signature`

##### Returns

`` `0x02${string}` `` \| `` `0x01${string}` `` \| `` `0x03${string}` `` \| `` `0x04${string}` `` \| `TransactionSerializedLegacy` \| `` `0x7e${string}` ``

#### 2331.sourceId

> **sourceId**: `11155111`

#### 2331.testnet

> **testnet**: `true`

### 240

> **240**: `object` = `chains.nexilix`

#### 240.blockExplorers

> **blockExplorers**: `object`

#### 240.blockExplorers.default

> `readonly` **default**: `object`

#### 240.blockExplorers.default.name

> `readonly` **name**: `"NexilixScan"`

#### 240.blockExplorers.default.url

> `readonly` **url**: `"https://scan.nexilix.com"`

#### 240.contracts

> **contracts**: `object`

#### 240.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 240.contracts.multicall3.address

> `readonly` **address**: `"0x58381c8e2BF9d0C2C4259cA14BdA9Afe02831244"`

#### 240.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `74448`

#### 240.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 240.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 240.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 240.formatters?

> `optional` **formatters**: `undefined`

#### 240.id

> **id**: `240`

#### 240.name

> **name**: `"Nexilix Smart Chain"`

#### 240.nativeCurrency

> **nativeCurrency**: `object`

#### 240.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 240.nativeCurrency.name

> `readonly` **name**: `"Nexilix"`

#### 240.nativeCurrency.symbol

> `readonly` **symbol**: `"NEXILIX"`

#### 240.rpcUrls

> **rpcUrls**: `object`

#### 240.rpcUrls.default

> `readonly` **default**: `object`

#### 240.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpcurl.pos.nexilix.com"`\]

#### 240.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 240.sourceId?

> `optional` **sourceId**: `number`

#### 240.testnet?

> `optional` **testnet**: `boolean`

### 242

> **242**: `object` = `chains.plinga`

#### 242.blockExplorers

> **blockExplorers**: `object`

#### 242.blockExplorers.default

> `readonly` **default**: `object`

#### 242.blockExplorers.default.name

> `readonly` **name**: `"Plgscan"`

#### 242.blockExplorers.default.url

> `readonly` **url**: `"https://www.plgscan.com"`

#### 242.contracts

> **contracts**: `object`

#### 242.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 242.contracts.multicall3.address

> `readonly` **address**: `"0x0989576160f2e7092908BB9479631b901060b6e4"`

#### 242.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `204489`

#### 242.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 242.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 242.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 242.formatters?

> `optional` **formatters**: `undefined`

#### 242.id

> **id**: `242`

#### 242.name

> **name**: `"Plinga"`

#### 242.nativeCurrency

> **nativeCurrency**: `object`

#### 242.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 242.nativeCurrency.name

> `readonly` **name**: `"Plinga"`

#### 242.nativeCurrency.symbol

> `readonly` **symbol**: `"PLINGA"`

#### 242.rpcUrls

> **rpcUrls**: `object`

#### 242.rpcUrls.default

> `readonly` **default**: `object`

#### 242.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpcurl.mainnet.plgchain.com"`\]

#### 242.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 242.sourceId?

> `optional` **sourceId**: `number`

#### 242.testnet?

> `optional` **testnet**: `boolean`

### 245022926

> **245022926**: `object` = `chains.neonDevnet`

#### 245022926.blockExplorers

> **blockExplorers**: `object`

#### 245022926.blockExplorers.default

> `readonly` **default**: `object`

#### 245022926.blockExplorers.default.name

> `readonly` **name**: `"Neonscan"`

#### 245022926.blockExplorers.default.url

> `readonly` **url**: `"https://devnet.neonscan.org"`

#### 245022926.contracts

> **contracts**: `object`

#### 245022926.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 245022926.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 245022926.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `205206112`

#### 245022926.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 245022926.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 245022926.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 245022926.formatters?

> `optional` **formatters**: `undefined`

#### 245022926.id

> **id**: `245022926`

#### 245022926.name

> **name**: `"Neon EVM DevNet"`

#### 245022926.nativeCurrency

> **nativeCurrency**: `object`

#### 245022926.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 245022926.nativeCurrency.name

> `readonly` **name**: `"NEON"`

#### 245022926.nativeCurrency.symbol

> `readonly` **symbol**: `"NEON"`

#### 245022926.rpcUrls

> **rpcUrls**: `object`

#### 245022926.rpcUrls.default

> `readonly` **default**: `object`

#### 245022926.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://devnet.neonevm.org"`\]

#### 245022926.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 245022926.sourceId?

> `optional` **sourceId**: `number`

#### 245022926.testnet

> **testnet**: `true`

### 245022934

> **245022934**: `object` = `chains.neonMainnet`

#### 245022934.blockExplorers

> **blockExplorers**: `object`

#### 245022934.blockExplorers.default

> `readonly` **default**: `object`

#### 245022934.blockExplorers.default.name

> `readonly` **name**: `"Neonscan"`

#### 245022934.blockExplorers.default.url

> `readonly` **url**: `"https://neonscan.org"`

#### 245022934.contracts

> **contracts**: `object`

#### 245022934.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 245022934.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 245022934.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `206545524`

#### 245022934.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 245022934.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 245022934.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 245022934.formatters?

> `optional` **formatters**: `undefined`

#### 245022934.id

> **id**: `245022934`

#### 245022934.name

> **name**: `"Neon EVM MainNet"`

#### 245022934.nativeCurrency

> **nativeCurrency**: `object`

#### 245022934.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 245022934.nativeCurrency.name

> `readonly` **name**: `"NEON"`

#### 245022934.nativeCurrency.symbol

> `readonly` **symbol**: `"NEON"`

#### 245022934.network

> `readonly` **network**: `"neonMainnet"`

#### 245022934.rpcUrls

> **rpcUrls**: `object`

#### 245022934.rpcUrls.default

> `readonly` **default**: `object`

#### 245022934.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://neon-proxy-mainnet.solana.p2p.org"`\]

#### 245022934.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 245022934.sourceId?

> `optional` **sourceId**: `number`

#### 245022934.testnet

> **testnet**: `false`

### 248

> **248**: `object` = `chains.oasys`

#### 248.blockExplorers

> **blockExplorers**: `object`

#### 248.blockExplorers.default

> `readonly` **default**: `object`

#### 248.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://scan.oasys.games/api"`

#### 248.blockExplorers.default.name

> `readonly` **name**: `"OasysScan"`

#### 248.blockExplorers.default.url

> `readonly` **url**: `"https://scan.oasys.games"`

#### 248.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 248.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 248.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 248.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 248.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 248.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 248.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 248.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 248.formatters?

> `optional` **formatters**: `undefined`

#### 248.id

> **id**: `248`

#### 248.name

> **name**: `"Oasys"`

#### 248.nativeCurrency

> **nativeCurrency**: `object`

#### 248.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 248.nativeCurrency.name

> `readonly` **name**: `"Oasys"`

#### 248.nativeCurrency.symbol

> `readonly` **symbol**: `"OAS"`

#### 248.rpcUrls

> **rpcUrls**: `object`

#### 248.rpcUrls.default

> `readonly` **default**: `object`

#### 248.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.mainnet.oasys.games"`\]

#### 248.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 248.sourceId?

> `optional` **sourceId**: `number`

#### 248.testnet?

> `optional` **testnet**: `boolean`

### 25

> **25**: `object` = `chains.cronos`

#### 25.blockExplorers

> **blockExplorers**: `object`

#### 25.blockExplorers.default

> `readonly` **default**: `object`

#### 25.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://explorer-api.cronos.org/mainnet/api"`

#### 25.blockExplorers.default.name

> `readonly` **name**: `"Cronos Explorer"`

#### 25.blockExplorers.default.url

> `readonly` **url**: `"https://explorer.cronos.org"`

#### 25.contracts

> **contracts**: `object`

#### 25.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 25.contracts.multicall3.address

> `readonly` **address**: `"0xcA11bde05977b3631167028862bE2a173976CA11"`

#### 25.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `1963112`

#### 25.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 25.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 25.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 25.formatters?

> `optional` **formatters**: `undefined`

#### 25.id

> **id**: `25`

#### 25.name

> **name**: `"Cronos Mainnet"`

#### 25.nativeCurrency

> **nativeCurrency**: `object`

#### 25.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 25.nativeCurrency.name

> `readonly` **name**: `"Cronos"`

#### 25.nativeCurrency.symbol

> `readonly` **symbol**: `"CRO"`

#### 25.rpcUrls

> **rpcUrls**: `object`

#### 25.rpcUrls.default

> `readonly` **default**: `object`

#### 25.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://evm.cronos.org"`\]

#### 25.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 25.sourceId?

> `optional` **sourceId**: `number`

#### 25.testnet?

> `optional` **testnet**: `boolean`

### 250

> **250**: `object` = `chains.fantom`

#### 250.blockExplorers

> **blockExplorers**: `object`

#### 250.blockExplorers.default

> `readonly` **default**: `object`

#### 250.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://api.ftmscan.com/api"`

#### 250.blockExplorers.default.name

> `readonly` **name**: `"FTMScan"`

#### 250.blockExplorers.default.url

> `readonly` **url**: `"https://ftmscan.com"`

#### 250.contracts

> **contracts**: `object`

#### 250.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 250.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 250.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `33001987`

#### 250.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 250.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 250.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 250.formatters?

> `optional` **formatters**: `undefined`

#### 250.id

> **id**: `250`

#### 250.name

> **name**: `"Fantom"`

#### 250.nativeCurrency

> **nativeCurrency**: `object`

#### 250.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 250.nativeCurrency.name

> `readonly` **name**: `"Fantom"`

#### 250.nativeCurrency.symbol

> `readonly` **symbol**: `"FTM"`

#### 250.rpcUrls

> **rpcUrls**: `object`

#### 250.rpcUrls.default

> `readonly` **default**: `object`

#### 250.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://250.rpc.thirdweb.com"`\]

#### 250.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 250.sourceId?

> `optional` **sourceId**: `number`

#### 250.testnet?

> `optional` **testnet**: `boolean`

### 252

> **252**: `object` = `chains.fraxtal`

#### 252.blockExplorers

> **blockExplorers**: `object`

#### 252.blockExplorers.default

> `readonly` **default**: `object`

#### 252.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://api.fraxscan.com/api"`

#### 252.blockExplorers.default.name

> `readonly` **name**: `"fraxscan"`

#### 252.blockExplorers.default.url

> `readonly` **url**: `"https://fraxscan.com"`

#### 252.contracts

> **contracts**: `object`

#### 252.contracts.gasPriceOracle

> `readonly` **gasPriceOracle**: `object`

#### 252.contracts.gasPriceOracle.address

> `readonly` **address**: `"0x420000000000000000000000000000000000000F"`

#### 252.contracts.l1Block

> `readonly` **l1Block**: `object`

#### 252.contracts.l1Block.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000015"`

#### 252.contracts.l1StandardBridge

> `readonly` **l1StandardBridge**: `object`

#### 252.contracts.l1StandardBridge.1

> `readonly` **1**: `object`

#### 252.contracts.l1StandardBridge.1.address

> `readonly` **address**: `"0x34C0bD5877A5Ee7099D0f5688D65F4bB9158BDE2"`

#### 252.contracts.l1StandardBridge.1.blockCreated

> `readonly` **blockCreated**: `19135323`

#### 252.contracts.l2CrossDomainMessenger

> `readonly` **l2CrossDomainMessenger**: `object`

#### 252.contracts.l2CrossDomainMessenger.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000007"`

#### 252.contracts.l2Erc721Bridge

> `readonly` **l2Erc721Bridge**: `object`

#### 252.contracts.l2Erc721Bridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000014"`

#### 252.contracts.l2OutputOracle

> `readonly` **l2OutputOracle**: `object`

#### 252.contracts.l2OutputOracle.1

> `readonly` **1**: `object`

#### 252.contracts.l2OutputOracle.1.address

> `readonly` **address**: `"0x66CC916Ed5C6C2FA97014f7D1cD141528Ae171e4"`

#### 252.contracts.l2StandardBridge

> `readonly` **l2StandardBridge**: `object`

#### 252.contracts.l2StandardBridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000010"`

#### 252.contracts.l2ToL1MessagePasser

> `readonly` **l2ToL1MessagePasser**: `object`

#### 252.contracts.l2ToL1MessagePasser.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000016"`

#### 252.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 252.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 252.contracts.portal

> `readonly` **portal**: `object`

#### 252.contracts.portal.1

> `readonly` **1**: `object`

#### 252.contracts.portal.1.address

> `readonly` **address**: `"0x36cb65c1967A0Fb0EEE11569C51C2f2aA1Ca6f6D"`

#### 252.contracts.portal.1.blockCreated

> `readonly` **blockCreated**: `19135323`

#### 252.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 252.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 252.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 252.formatters

> **formatters**: `object`

#### 252.formatters.block

> `readonly` **block**: `object`

#### 252.formatters.block.exclude

> **exclude**: `undefined` \| \[\]

#### 252.formatters.block.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`OpStackRpcBlock`\<`BlockTag`, `boolean`\>

##### Returns

`object`

###### baseFeePerGas

> **baseFeePerGas**: `null` \| `bigint`

###### blobGasUsed

> **blobGasUsed**: `bigint`

###### difficulty

> **difficulty**: `bigint`

###### excessBlobGas

> **excessBlobGas**: `bigint`

###### extraData

> **extraData**: `` `0x${string}` ``

###### gasLimit

> **gasLimit**: `bigint`

###### gasUsed

> **gasUsed**: `bigint`

###### hash

> **hash**: `null` \| `` `0x${string}` ``

###### logsBloom

> **logsBloom**: `null` \| `` `0x${string}` ``

###### miner

> **miner**: `` `0x${string}` ``

###### mixHash

> **mixHash**: `` `0x${string}` ``

###### nonce

> **nonce**: `null` \| `` `0x${string}` ``

###### number

> **number**: `null` \| `bigint`

###### parentBeaconBlockRoot?

> `optional` **parentBeaconBlockRoot**: `` `0x${string}` ``

###### parentHash

> **parentHash**: `` `0x${string}` ``

###### receiptsRoot

> **receiptsRoot**: `` `0x${string}` ``

###### sealFields

> **sealFields**: `` `0x${string}` ``[]

###### sha3Uncles

> **sha3Uncles**: `` `0x${string}` ``

###### size

> **size**: `bigint`

###### stateRoot

> **stateRoot**: `` `0x${string}` ``

###### timestamp

> **timestamp**: `bigint`

###### totalDifficulty

> **totalDifficulty**: `null` \| `bigint`

###### transactions

> **transactions**: `` `0x${string}` ``[] \| `OpStackTransaction`\<`boolean`\>[]

###### transactionsRoot

> **transactionsRoot**: `` `0x${string}` ``

###### uncles

> **uncles**: `` `0x${string}` ``[]

###### withdrawals?

> `optional` **withdrawals**: `Withdrawal`[]

###### withdrawalsRoot?

> `optional` **withdrawalsRoot**: `` `0x${string}` ``

#### 252.formatters.block.type

> **type**: `"block"`

#### 252.formatters.transaction

> `readonly` **transaction**: `object`

#### 252.formatters.transaction.exclude

> **exclude**: `undefined` \| \[\]

#### 252.formatters.transaction.format()

> **format**: (`args`) => \{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

##### Parameters

###### args

`OpStackRpcTransaction`\<`boolean`\>

##### Returns

\{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

#### 252.formatters.transaction.type

> **type**: `"transaction"`

#### 252.formatters.transactionReceipt

> `readonly` **transactionReceipt**: `object`

#### 252.formatters.transactionReceipt.exclude

> **exclude**: `undefined` \| \[\]

#### 252.formatters.transactionReceipt.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`OpStackRpcTransactionReceipt`

##### Returns

`object`

###### blobGasPrice?

> `optional` **blobGasPrice**: `bigint`

###### blobGasUsed?

> `optional` **blobGasUsed**: `bigint`

###### blockHash

> **blockHash**: `` `0x${string}` ``

###### blockNumber

> **blockNumber**: `bigint`

###### contractAddress

> **contractAddress**: `undefined` \| `null` \| `` `0x${string}` ``

###### cumulativeGasUsed

> **cumulativeGasUsed**: `bigint`

###### effectiveGasPrice

> **effectiveGasPrice**: `bigint`

###### from

> **from**: `` `0x${string}` ``

###### gasUsed

> **gasUsed**: `bigint`

###### l1Fee

> **l1Fee**: `null` \| `bigint`

###### l1FeeScalar

> **l1FeeScalar**: `null` \| `number`

###### l1GasPrice

> **l1GasPrice**: `null` \| `bigint`

###### l1GasUsed

> **l1GasUsed**: `null` \| `bigint`

###### logs

> **logs**: `Log`\<`bigint`, `number`, `false`, `undefined`, `undefined`, `undefined`, `undefined`\>[]

###### logsBloom

> **logsBloom**: `` `0x${string}` ``

###### root?

> `optional` **root**: `` `0x${string}` ``

###### status

> **status**: `"success"` \| `"reverted"`

###### to

> **to**: `null` \| `` `0x${string}` ``

###### transactionHash

> **transactionHash**: `` `0x${string}` ``

###### transactionIndex

> **transactionIndex**: `number`

###### type

> **type**: `TransactionType`

#### 252.formatters.transactionReceipt.type

> **type**: `"transactionReceipt"`

#### 252.id

> **id**: `252`

#### 252.name

> **name**: `"Fraxtal"`

#### 252.nativeCurrency

> **nativeCurrency**: `object`

#### 252.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 252.nativeCurrency.name

> `readonly` **name**: `"Frax"`

#### 252.nativeCurrency.symbol

> `readonly` **symbol**: `"FRAX"`

#### 252.rpcUrls

> **rpcUrls**: `object`

#### 252.rpcUrls.default

> `readonly` **default**: `object`

#### 252.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.frax.com"`\]

#### 252.serializers

> **serializers**: `object`

#### 252.serializers.transaction()

> `readonly` **transaction**: (`transaction`, `signature?`) => `` `0x02${string}` `` \| `` `0x01${string}` `` \| `` `0x03${string}` `` \| `` `0x04${string}` `` \| `TransactionSerializedLegacy` \| `` `0x7e${string}` ``

##### Parameters

###### transaction

`OpStackTransactionSerializable`

###### signature?

`Signature`

##### Returns

`` `0x02${string}` `` \| `` `0x01${string}` `` \| `` `0x03${string}` `` \| `` `0x04${string}` `` \| `TransactionSerializedLegacy` \| `` `0x7e${string}` ``

#### 252.sourceId

> **sourceId**: `1`

#### 252.testnet?

> `optional` **testnet**: `boolean`

### 2525

> **2525**: `object` = `chains.inEVM`

#### 2525.blockExplorers

> **blockExplorers**: `object`

#### 2525.blockExplorers.default

> `readonly` **default**: `object`

#### 2525.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://inevm.calderaexplorer.xyz/api/v2"`

#### 2525.blockExplorers.default.name

> `readonly` **name**: `"inEVM Explorer"`

#### 2525.blockExplorers.default.url

> `readonly` **url**: `"https://inevm.calderaexplorer.xyz"`

#### 2525.contracts

> **contracts**: `object`

#### 2525.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 2525.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 2525.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `118606`

#### 2525.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 2525.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 2525.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 2525.formatters?

> `optional` **formatters**: `undefined`

#### 2525.id

> **id**: `2525`

#### 2525.name

> **name**: `"inEVM Mainnet"`

#### 2525.nativeCurrency

> **nativeCurrency**: `object`

#### 2525.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 2525.nativeCurrency.name

> `readonly` **name**: `"Injective"`

#### 2525.nativeCurrency.symbol

> `readonly` **symbol**: `"INJ"`

#### 2525.rpcUrls

> **rpcUrls**: `object`

#### 2525.rpcUrls.default

> `readonly` **default**: `object`

#### 2525.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://mainnet.rpc.inevm.com/http"`\]

#### 2525.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 2525.sourceId?

> `optional` **sourceId**: `number`

#### 2525.testnet?

> `optional` **testnet**: `boolean`

### 255

> **255**: `object` = `chains.kroma`

#### 255.blockExplorers

> **blockExplorers**: `object`

#### 255.blockExplorers.default

> `readonly` **default**: `object`

#### 255.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://blockscout.kroma.network/api"`

#### 255.blockExplorers.default.name

> `readonly` **name**: `"Kroma Explorer"`

#### 255.blockExplorers.default.url

> `readonly` **url**: `"https://blockscout.kroma.network"`

#### 255.contracts

> **contracts**: `object`

#### 255.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 255.contracts.multicall3.address

> `readonly` **address**: `"0xcA11bde05977b3631167028862bE2a173976CA11"`

#### 255.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `16054868`

#### 255.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 255.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 255.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 255.formatters?

> `optional` **formatters**: `undefined`

#### 255.id

> **id**: `255`

#### 255.name

> **name**: `"Kroma"`

#### 255.nativeCurrency

> **nativeCurrency**: `object`

#### 255.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 255.nativeCurrency.name

> `readonly` **name**: `"ETH"`

#### 255.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 255.rpcUrls

> **rpcUrls**: `object`

#### 255.rpcUrls.default

> `readonly` **default**: `object`

#### 255.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://api.kroma.network"`\]

#### 255.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 255.sourceId?

> `optional` **sourceId**: `number`

#### 255.testnet

> **testnet**: `false`

### 2716446429837000

> **2716446429837000**: `object` = `chains.dchain`

#### 2716446429837000.blockExplorers

> **blockExplorers**: `object`

#### 2716446429837000.blockExplorers.default

> `readonly` **default**: `object`

#### 2716446429837000.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://api-dchain-2716446429837000-1.sagaexplorer.io/api"`

#### 2716446429837000.blockExplorers.default.name

> `readonly` **name**: `"Dchain Explorer"`

#### 2716446429837000.blockExplorers.default.url

> `readonly` **url**: `"https://dchain-2716446429837000-1.sagaexplorer.io"`

#### 2716446429837000.contracts

> **contracts**: `object`

#### 2716446429837000.contracts.gasPriceOracle

> `readonly` **gasPriceOracle**: `object`

#### 2716446429837000.contracts.gasPriceOracle.address

> `readonly` **address**: `"0x420000000000000000000000000000000000000F"`

#### 2716446429837000.contracts.l1Block

> `readonly` **l1Block**: `object`

#### 2716446429837000.contracts.l1Block.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000015"`

#### 2716446429837000.contracts.l2CrossDomainMessenger

> `readonly` **l2CrossDomainMessenger**: `object`

#### 2716446429837000.contracts.l2CrossDomainMessenger.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000007"`

#### 2716446429837000.contracts.l2Erc721Bridge

> `readonly` **l2Erc721Bridge**: `object`

#### 2716446429837000.contracts.l2Erc721Bridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000014"`

#### 2716446429837000.contracts.l2StandardBridge

> `readonly` **l2StandardBridge**: `object`

#### 2716446429837000.contracts.l2StandardBridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000010"`

#### 2716446429837000.contracts.l2ToL1MessagePasser

> `readonly` **l2ToL1MessagePasser**: `object`

#### 2716446429837000.contracts.l2ToL1MessagePasser.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000016"`

#### 2716446429837000.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 2716446429837000.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 2716446429837000.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 2716446429837000.formatters

> **formatters**: `object`

#### 2716446429837000.formatters.block

> `readonly` **block**: `object`

#### 2716446429837000.formatters.block.exclude

> **exclude**: `undefined` \| \[\]

#### 2716446429837000.formatters.block.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`OpStackRpcBlock`\<`BlockTag`, `boolean`\>

##### Returns

`object`

###### baseFeePerGas

> **baseFeePerGas**: `null` \| `bigint`

###### blobGasUsed

> **blobGasUsed**: `bigint`

###### difficulty

> **difficulty**: `bigint`

###### excessBlobGas

> **excessBlobGas**: `bigint`

###### extraData

> **extraData**: `` `0x${string}` ``

###### gasLimit

> **gasLimit**: `bigint`

###### gasUsed

> **gasUsed**: `bigint`

###### hash

> **hash**: `null` \| `` `0x${string}` ``

###### logsBloom

> **logsBloom**: `null` \| `` `0x${string}` ``

###### miner

> **miner**: `` `0x${string}` ``

###### mixHash

> **mixHash**: `` `0x${string}` ``

###### nonce

> **nonce**: `null` \| `` `0x${string}` ``

###### number

> **number**: `null` \| `bigint`

###### parentBeaconBlockRoot?

> `optional` **parentBeaconBlockRoot**: `` `0x${string}` ``

###### parentHash

> **parentHash**: `` `0x${string}` ``

###### receiptsRoot

> **receiptsRoot**: `` `0x${string}` ``

###### sealFields

> **sealFields**: `` `0x${string}` ``[]

###### sha3Uncles

> **sha3Uncles**: `` `0x${string}` ``

###### size

> **size**: `bigint`

###### stateRoot

> **stateRoot**: `` `0x${string}` ``

###### timestamp

> **timestamp**: `bigint`

###### totalDifficulty

> **totalDifficulty**: `null` \| `bigint`

###### transactions

> **transactions**: `` `0x${string}` ``[] \| `OpStackTransaction`\<`boolean`\>[]

###### transactionsRoot

> **transactionsRoot**: `` `0x${string}` ``

###### uncles

> **uncles**: `` `0x${string}` ``[]

###### withdrawals?

> `optional` **withdrawals**: `Withdrawal`[]

###### withdrawalsRoot?

> `optional` **withdrawalsRoot**: `` `0x${string}` ``

#### 2716446429837000.formatters.block.type

> **type**: `"block"`

#### 2716446429837000.formatters.transaction

> `readonly` **transaction**: `object`

#### 2716446429837000.formatters.transaction.exclude

> **exclude**: `undefined` \| \[\]

#### 2716446429837000.formatters.transaction.format()

> **format**: (`args`) => \{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

##### Parameters

###### args

`OpStackRpcTransaction`\<`boolean`\>

##### Returns

\{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

#### 2716446429837000.formatters.transaction.type

> **type**: `"transaction"`

#### 2716446429837000.formatters.transactionReceipt

> `readonly` **transactionReceipt**: `object`

#### 2716446429837000.formatters.transactionReceipt.exclude

> **exclude**: `undefined` \| \[\]

#### 2716446429837000.formatters.transactionReceipt.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`OpStackRpcTransactionReceipt`

##### Returns

`object`

###### blobGasPrice?

> `optional` **blobGasPrice**: `bigint`

###### blobGasUsed?

> `optional` **blobGasUsed**: `bigint`

###### blockHash

> **blockHash**: `` `0x${string}` ``

###### blockNumber

> **blockNumber**: `bigint`

###### contractAddress

> **contractAddress**: `undefined` \| `null` \| `` `0x${string}` ``

###### cumulativeGasUsed

> **cumulativeGasUsed**: `bigint`

###### effectiveGasPrice

> **effectiveGasPrice**: `bigint`

###### from

> **from**: `` `0x${string}` ``

###### gasUsed

> **gasUsed**: `bigint`

###### l1Fee

> **l1Fee**: `null` \| `bigint`

###### l1FeeScalar

> **l1FeeScalar**: `null` \| `number`

###### l1GasPrice

> **l1GasPrice**: `null` \| `bigint`

###### l1GasUsed

> **l1GasUsed**: `null` \| `bigint`

###### logs

> **logs**: `Log`\<`bigint`, `number`, `false`, `undefined`, `undefined`, `undefined`, `undefined`\>[]

###### logsBloom

> **logsBloom**: `` `0x${string}` ``

###### root?

> `optional` **root**: `` `0x${string}` ``

###### status

> **status**: `"success"` \| `"reverted"`

###### to

> **to**: `null` \| `` `0x${string}` ``

###### transactionHash

> **transactionHash**: `` `0x${string}` ``

###### transactionIndex

> **transactionIndex**: `number`

###### type

> **type**: `TransactionType`

#### 2716446429837000.formatters.transactionReceipt.type

> **type**: `"transactionReceipt"`

#### 2716446429837000.id

> **id**: `2716446429837000`

#### 2716446429837000.name

> **name**: `"Dchain"`

#### 2716446429837000.nativeCurrency

> **nativeCurrency**: `object`

#### 2716446429837000.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 2716446429837000.nativeCurrency.name

> `readonly` **name**: `"Ether"`

#### 2716446429837000.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 2716446429837000.rpcUrls

> **rpcUrls**: `object`

#### 2716446429837000.rpcUrls.default

> `readonly` **default**: `object`

#### 2716446429837000.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://dchain-2716446429837000-1.jsonrpc.sagarpc.io"`\]

#### 2716446429837000.serializers

> **serializers**: `object`

#### 2716446429837000.serializers.transaction()

> `readonly` **transaction**: (`transaction`, `signature?`) => `` `0x02${string}` `` \| `` `0x01${string}` `` \| `` `0x03${string}` `` \| `` `0x04${string}` `` \| `TransactionSerializedLegacy` \| `` `0x7e${string}` ``

##### Parameters

###### transaction

`OpStackTransactionSerializable`

###### signature?

`Signature`

##### Returns

`` `0x02${string}` `` \| `` `0x01${string}` `` \| `` `0x03${string}` `` \| `` `0x04${string}` `` \| `TransactionSerializedLegacy` \| `` `0x7e${string}` ``

#### 2716446429837000.sourceId?

> `optional` **sourceId**: `number`

#### 2716446429837000.testnet?

> `optional` **testnet**: `boolean`

### 2730

> **2730**: `object` = `chains.xrSepolia`

#### 2730.blockExplorers

> **blockExplorers**: `object`

#### 2730.blockExplorers.default

> `readonly` **default**: `object`

#### 2730.blockExplorers.default.name

> `readonly` **name**: `"Blockscout"`

#### 2730.blockExplorers.default.url

> `readonly` **url**: `"https://xr-sepolia-testnet.explorer.caldera.xyz"`

#### 2730.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 2730.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 2730.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 2730.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 2730.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 2730.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 2730.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 2730.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 2730.formatters?

> `optional` **formatters**: `undefined`

#### 2730.id

> **id**: `2730`

#### 2730.name

> **name**: `"XR Sepolia"`

#### 2730.nativeCurrency

> **nativeCurrency**: `object`

#### 2730.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 2730.nativeCurrency.name

> `readonly` **name**: `"tXR"`

#### 2730.nativeCurrency.symbol

> `readonly` **symbol**: `"tXR"`

#### 2730.rpcUrls

> **rpcUrls**: `object`

#### 2730.rpcUrls.default

> `readonly` **default**: `object`

#### 2730.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://xr-sepolia-testnet.rpc.caldera.xyz/http"`\]

#### 2730.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 2730.sourceId?

> `optional` **sourceId**: `number`

#### 2730.testnet

> **testnet**: `true`

### 278611351

> **278611351**: `object` = `chains.skaleRazor`

#### 278611351.blockExplorers

> **blockExplorers**: `object`

#### 278611351.blockExplorers.default

> `readonly` **default**: `object`

#### 278611351.blockExplorers.default.name

> `readonly` **name**: `"SKALE Explorer"`

#### 278611351.blockExplorers.default.url

> `readonly` **url**: `"https://turbulent-unique-scheat.explorer.mainnet.skalenodes.com"`

#### 278611351.contracts

> **contracts**: `object`

#### 278611351.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 278611351.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 278611351.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 278611351.formatters?

> `optional` **formatters**: `undefined`

#### 278611351.id

> **id**: `278611351`

#### 278611351.name

> **name**: "SKALE \| Razor Network"

#### 278611351.nativeCurrency

> **nativeCurrency**: `object`

#### 278611351.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 278611351.nativeCurrency.name

> `readonly` **name**: `"sFUEL"`

#### 278611351.nativeCurrency.symbol

> `readonly` **symbol**: `"sFUEL"`

#### 278611351.rpcUrls

> **rpcUrls**: `object`

#### 278611351.rpcUrls.default

> `readonly` **default**: `object`

#### 278611351.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://mainnet.skalenodes.com/v1/turbulent-unique-scheat"`\]

#### 278611351.rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly \[`"wss://mainnet.skalenodes.com/v1/ws/turbulent-unique-scheat"`\]

#### 278611351.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 278611351.sourceId?

> `optional` **sourceId**: `number`

#### 278611351.testnet?

> `optional` **testnet**: `boolean`

### 288

> **288**: `object` = `chains.boba`

#### 288.blockExplorers

> **blockExplorers**: `object`

#### 288.blockExplorers.default

> `readonly` **default**: `object`

#### 288.blockExplorers.default.name

> `readonly` **name**: `"BOBAScan"`

#### 288.blockExplorers.default.url

> `readonly` **url**: `"https://bobascan.com"`

#### 288.contracts

> **contracts**: `object`

#### 288.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 288.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 288.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `446859`

#### 288.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 288.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 288.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 288.formatters?

> `optional` **formatters**: `undefined`

#### 288.id

> **id**: `288`

#### 288.name

> **name**: `"Boba Network"`

#### 288.nativeCurrency

> **nativeCurrency**: `object`

#### 288.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 288.nativeCurrency.name

> `readonly` **name**: `"Ether"`

#### 288.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 288.rpcUrls

> **rpcUrls**: `object`

#### 288.rpcUrls.default

> `readonly` **default**: `object`

#### 288.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://mainnet.boba.network"`\]

#### 288.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 288.sourceId?

> `optional` **sourceId**: `number`

#### 288.testnet?

> `optional` **testnet**: `boolean`

### 28882

> **28882**: `object` = `chains.bobaSepolia`

#### 28882.blockExplorers

> **blockExplorers**: `object`

#### 28882.blockExplorers.default

> `readonly` **default**: `object`

#### 28882.blockExplorers.default.name

> `readonly` **name**: `"BOBAScan"`

#### 28882.blockExplorers.default.url

> `readonly` **url**: `"https://testnet.bobascan.com"`

#### 28882.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 28882.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 28882.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 28882.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 28882.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 28882.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 28882.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 28882.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 28882.formatters?

> `optional` **formatters**: `undefined`

#### 28882.id

> **id**: `28882`

#### 28882.name

> **name**: `"Boba Sepolia"`

#### 28882.nativeCurrency

> **nativeCurrency**: `object`

#### 28882.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 28882.nativeCurrency.name

> `readonly` **name**: `"Ether"`

#### 28882.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 28882.rpcUrls

> **rpcUrls**: `object`

#### 28882.rpcUrls.default

> `readonly` **default**: `object`

#### 28882.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://sepolia.boba.network"`\]

#### 28882.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 28882.sourceId?

> `optional` **sourceId**: `number`

#### 28882.testnet

> **testnet**: `true`

### 295

> **295**: `object` = `chains.hedera`

#### 295.blockExplorers

> **blockExplorers**: `object`

#### 295.blockExplorers.default

> `readonly` **default**: `object`

#### 295.blockExplorers.default.name

> `readonly` **name**: `"Hashscan"`

#### 295.blockExplorers.default.url

> `readonly` **url**: `"https://hashscan.io/mainnet"`

#### 295.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 295.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 295.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 295.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 295.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 295.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 295.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 295.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 295.formatters?

> `optional` **formatters**: `undefined`

#### 295.id

> **id**: `295`

#### 295.name

> **name**: `"Hedera Mainnet"`

#### 295.nativeCurrency

> **nativeCurrency**: `object`

#### 295.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 295.nativeCurrency.name

> `readonly` **name**: `"HBAR"`

#### 295.nativeCurrency.symbol

> `readonly` **symbol**: `"HBAR"`

#### 295.network

> `readonly` **network**: `"hedera-mainnet"`

#### 295.rpcUrls

> **rpcUrls**: `object`

#### 295.rpcUrls.default

> `readonly` **default**: `object`

#### 295.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://mainnet.hashio.io/api"`\]

#### 295.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 295.sourceId?

> `optional` **sourceId**: `number`

#### 295.testnet

> **testnet**: `false`

### 30

> **30**: `object` = `chains.rootstock`

#### 30.blockExplorers

> **blockExplorers**: `object`

#### 30.blockExplorers.default

> `readonly` **default**: `object`

#### 30.blockExplorers.default.name

> `readonly` **name**: `"RSK Explorer"`

#### 30.blockExplorers.default.url

> `readonly` **url**: `"https://explorer.rsk.co"`

#### 30.contracts

> **contracts**: `object`

#### 30.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 30.contracts.multicall3.address

> `readonly` **address**: `"0xcA11bde05977b3631167028862bE2a173976CA11"`

#### 30.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `4249540`

#### 30.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 30.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 30.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 30.formatters?

> `optional` **formatters**: `undefined`

#### 30.id

> **id**: `30`

#### 30.name

> **name**: `"Rootstock Mainnet"`

#### 30.nativeCurrency

> **nativeCurrency**: `object`

#### 30.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 30.nativeCurrency.name

> `readonly` **name**: `"Rootstock Bitcoin"`

#### 30.nativeCurrency.symbol

> `readonly` **symbol**: `"RBTC"`

#### 30.network

> `readonly` **network**: `"rootstock"`

#### 30.rpcUrls

> **rpcUrls**: `object`

#### 30.rpcUrls.default

> `readonly` **default**: `object`

#### 30.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://public-node.rsk.co"`\]

#### 30.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 30.sourceId?

> `optional` **sourceId**: `number`

#### 30.testnet?

> `optional` **testnet**: `boolean`

### 3109

> **3109**: `object` = `chains.satoshiVM`

#### 3109.blockExplorers

> **blockExplorers**: `object`

#### 3109.blockExplorers.default

> `readonly` **default**: `object`

#### 3109.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://svmscan.io/api"`

#### 3109.blockExplorers.default.name

> `readonly` **name**: `"blockscout"`

#### 3109.blockExplorers.default.url

> `readonly` **url**: `"https://svmscan.io"`

#### 3109.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 3109.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 3109.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 3109.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 3109.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 3109.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 3109.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 3109.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 3109.formatters?

> `optional` **formatters**: `undefined`

#### 3109.id

> **id**: `3109`

#### 3109.name

> **name**: `"SatoshiVM Alpha Mainnet"`

#### 3109.nativeCurrency

> **nativeCurrency**: `object`

#### 3109.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 3109.nativeCurrency.name

> `readonly` **name**: `"BTC"`

#### 3109.nativeCurrency.symbol

> `readonly` **symbol**: `"BTC"`

#### 3109.rpcUrls

> **rpcUrls**: `object`

#### 3109.rpcUrls.default

> `readonly` **default**: `object`

#### 3109.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://alpha-rpc-node-http.svmscan.io"`\]

#### 3109.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 3109.sourceId?

> `optional` **sourceId**: `number`

#### 3109.testnet?

> `optional` **testnet**: `boolean`

### 31337

> **31337**: `object` = `chains.hardhat`

#### 31337.blockExplorers?

> `optional` **blockExplorers**: `object`

##### Index Signature

\[`key`: `string`\]: `object`

#### 31337.blockExplorers.default

> **default**: `object`

#### 31337.blockExplorers.default.apiUrl?

> `optional` **apiUrl**: `string`

#### 31337.blockExplorers.default.name

> **name**: `string`

#### 31337.blockExplorers.default.url

> **url**: `string`

#### 31337.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 31337.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 31337.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 31337.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 31337.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 31337.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 31337.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 31337.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 31337.formatters?

> `optional` **formatters**: `undefined`

#### 31337.id

> **id**: `31337`

#### 31337.name

> **name**: `"Hardhat"`

#### 31337.nativeCurrency

> **nativeCurrency**: `object`

#### 31337.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 31337.nativeCurrency.name

> `readonly` **name**: `"Ether"`

#### 31337.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 31337.rpcUrls

> **rpcUrls**: `object`

#### 31337.rpcUrls.default

> `readonly` **default**: `object`

#### 31337.rpcUrls.default.http

> `readonly` **http**: readonly \[`"http://127.0.0.1:8545"`\]

#### 31337.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 31337.sourceId?

> `optional` **sourceId**: `number`

#### 31337.testnet?

> `optional` **testnet**: `boolean`

### 314

> **314**: `object` = `chains.filecoin`

#### 314.blockExplorers

> **blockExplorers**: `object`

#### 314.blockExplorers.default

> `readonly` **default**: `object`

#### 314.blockExplorers.default.name

> `readonly` **name**: `"Filfox"`

#### 314.blockExplorers.default.url

> `readonly` **url**: `"https://filfox.info/en"`

#### 314.contracts

> **contracts**: `object`

#### 314.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 314.contracts.multicall3.address

> `readonly` **address**: `"0xcA11bde05977b3631167028862bE2a173976CA11"`

#### 314.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `3328594`

#### 314.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 314.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 314.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 314.formatters?

> `optional` **formatters**: `undefined`

#### 314.id

> **id**: `314`

#### 314.name

> **name**: `"Filecoin Mainnet"`

#### 314.nativeCurrency

> **nativeCurrency**: `object`

#### 314.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 314.nativeCurrency.name

> `readonly` **name**: `"filecoin"`

#### 314.nativeCurrency.symbol

> `readonly` **symbol**: `"FIL"`

#### 314.rpcUrls

> **rpcUrls**: `object`

#### 314.rpcUrls.default

> `readonly` **default**: `object`

#### 314.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://api.node.glif.io/rpc/v1"`\]

#### 314.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 314.sourceId?

> `optional` **sourceId**: `number`

#### 314.testnet?

> `optional` **testnet**: `boolean`

### 321

> **321**: `object` = `chains.kcc`

#### 321.blockExplorers

> **blockExplorers**: `object`

#### 321.blockExplorers.default

> `readonly` **default**: `object`

#### 321.blockExplorers.default.name

> `readonly` **name**: `"KCC Explorer"`

#### 321.blockExplorers.default.url

> `readonly` **url**: `"https://explorer.kcc.io"`

#### 321.contracts

> **contracts**: `object`

#### 321.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 321.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 321.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `11760430`

#### 321.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 321.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 321.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 321.formatters?

> `optional` **formatters**: `undefined`

#### 321.id

> **id**: `321`

#### 321.name

> **name**: `"KCC Mainnet"`

#### 321.nativeCurrency

> **nativeCurrency**: `object`

#### 321.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 321.nativeCurrency.name

> `readonly` **name**: `"KCS"`

#### 321.nativeCurrency.symbol

> `readonly` **symbol**: `"KCS"`

#### 321.network

> `readonly` **network**: `"KCC Mainnet"`

#### 321.rpcUrls

> **rpcUrls**: `object`

#### 321.rpcUrls.default

> `readonly` **default**: `object`

#### 321.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://kcc-rpc.com"`\]

#### 321.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 321.sourceId?

> `optional` **sourceId**: `number`

#### 321.testnet

> **testnet**: `false`

### 324

> **324**: `object` = `chains.zkSync`

#### 324.blockExplorers

> **blockExplorers**: `object`

#### 324.blockExplorers.default

> `readonly` **default**: `object`

#### 324.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://api-era.zksync.network/api"`

#### 324.blockExplorers.default.name

> `readonly` **name**: `"Etherscan"`

#### 324.blockExplorers.default.url

> `readonly` **url**: `"https://era.zksync.network/"`

#### 324.blockExplorers.native

> `readonly` **native**: `object`

#### 324.blockExplorers.native.apiUrl

> `readonly` **apiUrl**: `"https://block-explorer-api.mainnet.zksync.io/api"`

#### 324.blockExplorers.native.name

> `readonly` **name**: `"ZKsync Explorer"`

#### 324.blockExplorers.native.url

> `readonly` **url**: `"https://explorer.zksync.io/"`

#### 324.contracts

> **contracts**: `object`

#### 324.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 324.contracts.multicall3.address

> `readonly` **address**: `"0xF9cda624FBC7e059355ce98a31693d299FACd963"`

#### 324.contracts.universalSignatureVerifier

> `readonly` **universalSignatureVerifier**: `object`

#### 324.contracts.universalSignatureVerifier.address

> `readonly` **address**: `"0xfB688330379976DA81eB64Fe4BF50d7401763B9C"`

#### 324.contracts.universalSignatureVerifier.blockCreated

> `readonly` **blockCreated**: `45659388`

#### 324.custom

> **custom**: `object`

#### 324.custom.getEip712Domain

> `readonly` **getEip712Domain**: `EIP712DomainFn`\<`ZksyncTransactionSerializable`, `ZksyncEIP712TransactionSignable`\>

#### 324.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 324.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 324.formatters

> **formatters**: `object`

#### 324.formatters.block

> `readonly` **block**: `object`

#### 324.formatters.block.exclude

> **exclude**: `undefined` \| \[\]

#### 324.formatters.block.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`ZksyncRpcBlock`\<`BlockTag`, `boolean`\>

##### Returns

`object`

###### baseFeePerGas

> **baseFeePerGas**: `null` \| `bigint`

###### blobGasUsed

> **blobGasUsed**: `bigint`

###### difficulty

> **difficulty**: `bigint`

###### excessBlobGas

> **excessBlobGas**: `bigint`

###### extraData

> **extraData**: `` `0x${string}` ``

###### gasLimit

> **gasLimit**: `bigint`

###### gasUsed

> **gasUsed**: `bigint`

###### hash

> **hash**: `null` \| `` `0x${string}` ``

###### l1BatchNumber

> **l1BatchNumber**: `null` \| `bigint`

###### l1BatchTimestamp

> **l1BatchTimestamp**: `null` \| `bigint`

###### logsBloom

> **logsBloom**: `null` \| `` `0x${string}` ``

###### miner

> **miner**: `` `0x${string}` ``

###### mixHash

> **mixHash**: `` `0x${string}` ``

###### nonce

> **nonce**: `null` \| `` `0x${string}` ``

###### number

> **number**: `null` \| `bigint`

###### parentBeaconBlockRoot?

> `optional` **parentBeaconBlockRoot**: `` `0x${string}` ``

###### parentHash

> **parentHash**: `` `0x${string}` ``

###### receiptsRoot

> **receiptsRoot**: `` `0x${string}` ``

###### sealFields

> **sealFields**: `` `0x${string}` ``[]

###### sha3Uncles

> **sha3Uncles**: `` `0x${string}` ``

###### size

> **size**: `bigint`

###### stateRoot

> **stateRoot**: `` `0x${string}` ``

###### timestamp

> **timestamp**: `bigint`

###### totalDifficulty

> **totalDifficulty**: `null` \| `bigint`

###### transactions

> **transactions**: `` `0x${string}` ``[] \| `ZksyncTransaction`\<`boolean`\>[]

###### transactionsRoot

> **transactionsRoot**: `` `0x${string}` ``

###### uncles

> **uncles**: `` `0x${string}` ``[]

###### withdrawals?

> `optional` **withdrawals**: `Withdrawal`[]

###### withdrawalsRoot?

> `optional` **withdrawalsRoot**: `` `0x${string}` ``

#### 324.formatters.block.type

> **type**: `"block"`

#### 324.formatters.transaction

> `readonly` **transaction**: `object`

#### 324.formatters.transaction.exclude

> **exclude**: `undefined` \| \[\]

#### 324.formatters.transaction.format()

> **format**: (`args`) => \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `l1BatchNumber`: `null` \| `bigint`; `l1BatchTxIndex`: `null` \| `bigint`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `l1BatchNumber`: `null` \| `bigint`; `l1BatchTxIndex`: `null` \| `bigint`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `l1BatchNumber`: `null` \| `bigint`; `l1BatchTxIndex`: `null` \| `bigint`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `l1BatchNumber`: `null` \| `bigint`; `l1BatchTxIndex`: `null` \| `bigint`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `l1BatchNumber`: `null` \| `bigint`; `l1BatchTxIndex`: `null` \| `bigint`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `l1BatchNumber`: `null` \| `bigint`; `l1BatchTxIndex`: `null` \| `bigint`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"priority"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `l1BatchNumber`: `null` \| `bigint`; `l1BatchTxIndex`: `null` \| `bigint`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"priority"` \| `"eip712"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

##### Parameters

###### args

`ZksyncRpcTransaction`\<`boolean`\>

##### Returns

\{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `l1BatchNumber`: `null` \| `bigint`; `l1BatchTxIndex`: `null` \| `bigint`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `l1BatchNumber`: `null` \| `bigint`; `l1BatchTxIndex`: `null` \| `bigint`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `l1BatchNumber`: `null` \| `bigint`; `l1BatchTxIndex`: `null` \| `bigint`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `l1BatchNumber`: `null` \| `bigint`; `l1BatchTxIndex`: `null` \| `bigint`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `l1BatchNumber`: `null` \| `bigint`; `l1BatchTxIndex`: `null` \| `bigint`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `l1BatchNumber`: `null` \| `bigint`; `l1BatchTxIndex`: `null` \| `bigint`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"priority"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `l1BatchNumber`: `null` \| `bigint`; `l1BatchTxIndex`: `null` \| `bigint`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"priority"` \| `"eip712"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

#### 324.formatters.transaction.type

> **type**: `"transaction"`

#### 324.formatters.transactionReceipt

> `readonly` **transactionReceipt**: `object`

#### 324.formatters.transactionReceipt.exclude

> **exclude**: `undefined` \| \[\]

#### 324.formatters.transactionReceipt.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`ZksyncRpcTransactionReceipt`

##### Returns

`object`

###### blobGasPrice?

> `optional` **blobGasPrice**: `bigint`

###### blobGasUsed?

> `optional` **blobGasUsed**: `bigint`

###### blockHash

> **blockHash**: `` `0x${string}` ``

###### blockNumber

> **blockNumber**: `bigint`

###### contractAddress

> **contractAddress**: `undefined` \| `null` \| `` `0x${string}` ``

###### cumulativeGasUsed

> **cumulativeGasUsed**: `bigint`

###### effectiveGasPrice

> **effectiveGasPrice**: `bigint`

###### from

> **from**: `` `0x${string}` ``

###### gasUsed

> **gasUsed**: `bigint`

###### l1BatchNumber

> **l1BatchNumber**: `null` \| `bigint`

###### l1BatchTxIndex

> **l1BatchTxIndex**: `null` \| `bigint`

###### l2ToL1Logs

> **l2ToL1Logs**: `ZksyncL2ToL1Log`[]

###### logs

> **logs**: `ZksyncLog`\<`bigint`, `number`, `boolean`, `undefined`, `undefined`, `undefined`, `undefined`\>[]

###### logsBloom

> **logsBloom**: `` `0x${string}` ``

###### root?

> `optional` **root**: `` `0x${string}` ``

###### status

> **status**: `"success"` \| `"reverted"`

###### to

> **to**: `null` \| `` `0x${string}` ``

###### transactionHash

> **transactionHash**: `` `0x${string}` ``

###### transactionIndex

> **transactionIndex**: `number`

###### type

> **type**: `ZksyncTransactionType`

#### 324.formatters.transactionReceipt.type

> **type**: `"transactionReceipt"`

#### 324.formatters.transactionRequest

> `readonly` **transactionRequest**: `object`

#### 324.formatters.transactionRequest.exclude

> **exclude**: `undefined` \| (`"gasPerPubdata"` \| `"paymaster"` \| `"factoryDeps"` \| `"paymasterInput"` \| `"customSignature"`)[]

#### 324.formatters.transactionRequest.format()

> **format**: (`args`) => \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobs?`: `undefined`; `blobVersionedHashes?`: `undefined`; `data?`: `` `0x${string}` ``; `eip712Meta?`: `undefined`; `from?`: `` `0x${string}` ``; `gas?`: `` `0x${string}` ``; `gasPrice?`: `` `0x${string}` ``; `kzg?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `nonce?`: `` `0x${string}` ``; `sidecars?`: `undefined`; `to?`: `null` \| `` `0x${string}` ``; `type?`: `"0x0"`; `value?`: `` `0x${string}` ``; \} \| \{ `accessList?`: `AccessList`; `authorizationList?`: `undefined`; `blobs?`: `undefined`; `blobVersionedHashes?`: `undefined`; `data?`: `` `0x${string}` ``; `eip712Meta?`: `undefined`; `from?`: `` `0x${string}` ``; `gas?`: `` `0x${string}` ``; `gasPrice?`: `` `0x${string}` ``; `kzg?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `nonce?`: `` `0x${string}` ``; `sidecars?`: `undefined`; `to?`: `null` \| `` `0x${string}` ``; `type?`: `"0x1"`; `value?`: `` `0x${string}` ``; \} \| \{ `accessList?`: `AccessList`; `authorizationList?`: `undefined`; `blobs?`: `undefined`; `blobVersionedHashes?`: `undefined`; `data?`: `` `0x${string}` ``; `eip712Meta?`: `undefined`; `from?`: `` `0x${string}` ``; `gas?`: `` `0x${string}` ``; `gasPrice?`: `undefined`; `kzg?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `` `0x${string}` ``; `maxPriorityFeePerGas?`: `` `0x${string}` ``; `nonce?`: `` `0x${string}` ``; `sidecars?`: `undefined`; `to?`: `null` \| `` `0x${string}` ``; `type?`: `"0x2"`; `value?`: `` `0x${string}` ``; \} \| \{ `accessList?`: `AccessList`; `authorizationList?`: `undefined`; `blobs`: readonly `` `0x${(...)}` ``[] \| readonly `ByteArray`[]; `blobVersionedHashes?`: readonly `` `0x${(...)}` ``[]; `data?`: `` `0x${string}` ``; `eip712Meta?`: `undefined`; `from?`: `` `0x${string}` ``; `gas?`: `` `0x${string}` ``; `gasPrice?`: `undefined`; `kzg?`: `Kzg`; `maxFeePerBlobGas`: `` `0x${string}` ``; `maxFeePerGas?`: `` `0x${string}` ``; `maxPriorityFeePerGas?`: `` `0x${string}` ``; `nonce?`: `` `0x${string}` ``; `sidecars?`: readonly `BlobSidecar`\<...\>[]; `to`: `null` \| `` `0x${string}` ``; `type?`: `"0x3"`; `value?`: `` `0x${string}` ``; \} \| \{ `accessList?`: `AccessList`; `authorizationList?`: `RpcAuthorizationList`; `blobs?`: `undefined`; `blobVersionedHashes?`: `undefined`; `data?`: `` `0x${string}` ``; `eip712Meta?`: `undefined`; `from?`: `` `0x${string}` ``; `gas?`: `` `0x${string}` ``; `gasPrice?`: `undefined`; `kzg?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `` `0x${string}` ``; `maxPriorityFeePerGas?`: `` `0x${string}` ``; `nonce?`: `` `0x${string}` ``; `sidecars?`: `undefined`; `to?`: `null` \| `` `0x${string}` ``; `type?`: `"0x4"`; `value?`: `` `0x${string}` ``; \} \| \{ `data?`: `` `0x${string}` ``; `eip712Meta`: `ZksyncEip712Meta`; `from?`: `` `0x${string}` ``; `gas?`: `` `0x${string}` ``; `gasPrice?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `` `0x${string}` ``; `maxPriorityFeePerGas?`: `` `0x${string}` ``; `nonce?`: `` `0x${string}` ``; `to?`: `null` \| `` `0x${string}` ``; `type`: `"0xff"` \| `"0x71"`; `value?`: `` `0x${string}` ``; \} & `object`

##### Parameters

###### args

`ZksyncTransactionRequest`\<`bigint`, `number`\>

##### Returns

\{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobs?`: `undefined`; `blobVersionedHashes?`: `undefined`; `data?`: `` `0x${string}` ``; `eip712Meta?`: `undefined`; `from?`: `` `0x${string}` ``; `gas?`: `` `0x${string}` ``; `gasPrice?`: `` `0x${string}` ``; `kzg?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `nonce?`: `` `0x${string}` ``; `sidecars?`: `undefined`; `to?`: `null` \| `` `0x${string}` ``; `type?`: `"0x0"`; `value?`: `` `0x${string}` ``; \} \| \{ `accessList?`: `AccessList`; `authorizationList?`: `undefined`; `blobs?`: `undefined`; `blobVersionedHashes?`: `undefined`; `data?`: `` `0x${string}` ``; `eip712Meta?`: `undefined`; `from?`: `` `0x${string}` ``; `gas?`: `` `0x${string}` ``; `gasPrice?`: `` `0x${string}` ``; `kzg?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `nonce?`: `` `0x${string}` ``; `sidecars?`: `undefined`; `to?`: `null` \| `` `0x${string}` ``; `type?`: `"0x1"`; `value?`: `` `0x${string}` ``; \} \| \{ `accessList?`: `AccessList`; `authorizationList?`: `undefined`; `blobs?`: `undefined`; `blobVersionedHashes?`: `undefined`; `data?`: `` `0x${string}` ``; `eip712Meta?`: `undefined`; `from?`: `` `0x${string}` ``; `gas?`: `` `0x${string}` ``; `gasPrice?`: `undefined`; `kzg?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `` `0x${string}` ``; `maxPriorityFeePerGas?`: `` `0x${string}` ``; `nonce?`: `` `0x${string}` ``; `sidecars?`: `undefined`; `to?`: `null` \| `` `0x${string}` ``; `type?`: `"0x2"`; `value?`: `` `0x${string}` ``; \} \| \{ `accessList?`: `AccessList`; `authorizationList?`: `undefined`; `blobs`: readonly `` `0x${(...)}` ``[] \| readonly `ByteArray`[]; `blobVersionedHashes?`: readonly `` `0x${(...)}` ``[]; `data?`: `` `0x${string}` ``; `eip712Meta?`: `undefined`; `from?`: `` `0x${string}` ``; `gas?`: `` `0x${string}` ``; `gasPrice?`: `undefined`; `kzg?`: `Kzg`; `maxFeePerBlobGas`: `` `0x${string}` ``; `maxFeePerGas?`: `` `0x${string}` ``; `maxPriorityFeePerGas?`: `` `0x${string}` ``; `nonce?`: `` `0x${string}` ``; `sidecars?`: readonly `BlobSidecar`\<...\>[]; `to`: `null` \| `` `0x${string}` ``; `type?`: `"0x3"`; `value?`: `` `0x${string}` ``; \} \| \{ `accessList?`: `AccessList`; `authorizationList?`: `RpcAuthorizationList`; `blobs?`: `undefined`; `blobVersionedHashes?`: `undefined`; `data?`: `` `0x${string}` ``; `eip712Meta?`: `undefined`; `from?`: `` `0x${string}` ``; `gas?`: `` `0x${string}` ``; `gasPrice?`: `undefined`; `kzg?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `` `0x${string}` ``; `maxPriorityFeePerGas?`: `` `0x${string}` ``; `nonce?`: `` `0x${string}` ``; `sidecars?`: `undefined`; `to?`: `null` \| `` `0x${string}` ``; `type?`: `"0x4"`; `value?`: `` `0x${string}` ``; \} \| \{ `data?`: `` `0x${string}` ``; `eip712Meta`: `ZksyncEip712Meta`; `from?`: `` `0x${string}` ``; `gas?`: `` `0x${string}` ``; `gasPrice?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `` `0x${string}` ``; `maxPriorityFeePerGas?`: `` `0x${string}` ``; `nonce?`: `` `0x${string}` ``; `to?`: `null` \| `` `0x${string}` ``; `type`: `"0xff"` \| `"0x71"`; `value?`: `` `0x${string}` ``; \} & `object`

#### 324.formatters.transactionRequest.type

> **type**: `"transactionRequest"`

#### 324.id

> **id**: `324`

#### 324.name

> **name**: `"ZKsync Era"`

#### 324.nativeCurrency

> **nativeCurrency**: `object`

#### 324.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 324.nativeCurrency.name

> `readonly` **name**: `"Ether"`

#### 324.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 324.network

> `readonly` **network**: `"zksync-era"`

#### 324.rpcUrls

> **rpcUrls**: `object`

#### 324.rpcUrls.default

> `readonly` **default**: `object`

#### 324.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://mainnet.era.zksync.io"`\]

#### 324.rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly \[`"wss://mainnet.era.zksync.io/ws"`\]

#### 324.serializers

> **serializers**: `object`

#### 324.serializers.transaction()

> `readonly` **transaction**: (`transaction`, `signature?`) => `` `0x02${string}` `` \| `` `0x01${string}` `` \| `` `0x03${string}` `` \| `` `0x04${string}` `` \| `TransactionSerializedLegacy` \| `` `0x71${string}` ``

##### Parameters

###### transaction

`ZksyncTransactionSerializable`

###### signature?

`Signature`

##### Returns

`` `0x02${string}` `` \| `` `0x01${string}` `` \| `` `0x03${string}` `` \| `` `0x04${string}` `` \| `TransactionSerializedLegacy` \| `` `0x71${string}` ``

#### 324.sourceId?

> `optional` **sourceId**: `number`

#### 324.testnet?

> `optional` **testnet**: `boolean`

### 32769

> **32769**: `object` = `chains.zilliqa`

#### 32769.blockExplorers

> **blockExplorers**: `object`

#### 32769.blockExplorers.default

> `readonly` **default**: `object`

#### 32769.blockExplorers.default.name

> `readonly` **name**: `"Ethernal"`

#### 32769.blockExplorers.default.url

> `readonly` **url**: `"https://evmx.zilliqa.com"`

#### 32769.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 32769.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 32769.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 32769.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 32769.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 32769.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 32769.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 32769.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 32769.formatters?

> `optional` **formatters**: `undefined`

#### 32769.id

> **id**: `32769`

#### 32769.name

> **name**: `"Zilliqa"`

#### 32769.nativeCurrency

> **nativeCurrency**: `object`

#### 32769.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 32769.nativeCurrency.name

> `readonly` **name**: `"Zilliqa"`

#### 32769.nativeCurrency.symbol

> `readonly` **symbol**: `"ZIL"`

#### 32769.network

> `readonly` **network**: `"zilliqa"`

#### 32769.rpcUrls

> **rpcUrls**: `object`

#### 32769.rpcUrls.default

> `readonly` **default**: `object`

#### 32769.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://api.zilliqa.com"`\]

#### 32769.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 32769.sourceId?

> `optional` **sourceId**: `number`

#### 32769.testnet

> **testnet**: `false`

### 33979

> **33979**: `object` = `chains.funkiMainnet`

#### 33979.blockExplorers

> **blockExplorers**: `object`

#### 33979.blockExplorers.default

> `readonly` **default**: `object`

#### 33979.blockExplorers.default.name

> `readonly` **name**: `"Funki Mainnet Explorer"`

#### 33979.blockExplorers.default.url

> `readonly` **url**: `"https://funkiscan.io"`

#### 33979.contracts

> **contracts**: `object`

#### 33979.contracts.gasPriceOracle

> `readonly` **gasPriceOracle**: `object`

#### 33979.contracts.gasPriceOracle.address

> `readonly` **address**: `"0x420000000000000000000000000000000000000F"`

#### 33979.contracts.l1Block

> `readonly` **l1Block**: `object`

#### 33979.contracts.l1Block.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000015"`

#### 33979.contracts.l2CrossDomainMessenger

> `readonly` **l2CrossDomainMessenger**: `object`

#### 33979.contracts.l2CrossDomainMessenger.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000007"`

#### 33979.contracts.l2Erc721Bridge

> `readonly` **l2Erc721Bridge**: `object`

#### 33979.contracts.l2Erc721Bridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000014"`

#### 33979.contracts.l2StandardBridge

> `readonly` **l2StandardBridge**: `object`

#### 33979.contracts.l2StandardBridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000010"`

#### 33979.contracts.l2ToL1MessagePasser

> `readonly` **l2ToL1MessagePasser**: `object`

#### 33979.contracts.l2ToL1MessagePasser.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000016"`

#### 33979.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 33979.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 33979.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 33979.formatters

> **formatters**: `object`

#### 33979.formatters.block

> `readonly` **block**: `object`

#### 33979.formatters.block.exclude

> **exclude**: `undefined` \| \[\]

#### 33979.formatters.block.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`OpStackRpcBlock`\<`BlockTag`, `boolean`\>

##### Returns

`object`

###### baseFeePerGas

> **baseFeePerGas**: `null` \| `bigint`

###### blobGasUsed

> **blobGasUsed**: `bigint`

###### difficulty

> **difficulty**: `bigint`

###### excessBlobGas

> **excessBlobGas**: `bigint`

###### extraData

> **extraData**: `` `0x${string}` ``

###### gasLimit

> **gasLimit**: `bigint`

###### gasUsed

> **gasUsed**: `bigint`

###### hash

> **hash**: `null` \| `` `0x${string}` ``

###### logsBloom

> **logsBloom**: `null` \| `` `0x${string}` ``

###### miner

> **miner**: `` `0x${string}` ``

###### mixHash

> **mixHash**: `` `0x${string}` ``

###### nonce

> **nonce**: `null` \| `` `0x${string}` ``

###### number

> **number**: `null` \| `bigint`

###### parentBeaconBlockRoot?

> `optional` **parentBeaconBlockRoot**: `` `0x${string}` ``

###### parentHash

> **parentHash**: `` `0x${string}` ``

###### receiptsRoot

> **receiptsRoot**: `` `0x${string}` ``

###### sealFields

> **sealFields**: `` `0x${string}` ``[]

###### sha3Uncles

> **sha3Uncles**: `` `0x${string}` ``

###### size

> **size**: `bigint`

###### stateRoot

> **stateRoot**: `` `0x${string}` ``

###### timestamp

> **timestamp**: `bigint`

###### totalDifficulty

> **totalDifficulty**: `null` \| `bigint`

###### transactions

> **transactions**: `` `0x${string}` ``[] \| `OpStackTransaction`\<`boolean`\>[]

###### transactionsRoot

> **transactionsRoot**: `` `0x${string}` ``

###### uncles

> **uncles**: `` `0x${string}` ``[]

###### withdrawals?

> `optional` **withdrawals**: `Withdrawal`[]

###### withdrawalsRoot?

> `optional` **withdrawalsRoot**: `` `0x${string}` ``

#### 33979.formatters.block.type

> **type**: `"block"`

#### 33979.formatters.transaction

> `readonly` **transaction**: `object`

#### 33979.formatters.transaction.exclude

> **exclude**: `undefined` \| \[\]

#### 33979.formatters.transaction.format()

> **format**: (`args`) => \{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

##### Parameters

###### args

`OpStackRpcTransaction`\<`boolean`\>

##### Returns

\{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

#### 33979.formatters.transaction.type

> **type**: `"transaction"`

#### 33979.formatters.transactionReceipt

> `readonly` **transactionReceipt**: `object`

#### 33979.formatters.transactionReceipt.exclude

> **exclude**: `undefined` \| \[\]

#### 33979.formatters.transactionReceipt.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`OpStackRpcTransactionReceipt`

##### Returns

`object`

###### blobGasPrice?

> `optional` **blobGasPrice**: `bigint`

###### blobGasUsed?

> `optional` **blobGasUsed**: `bigint`

###### blockHash

> **blockHash**: `` `0x${string}` ``

###### blockNumber

> **blockNumber**: `bigint`

###### contractAddress

> **contractAddress**: `undefined` \| `null` \| `` `0x${string}` ``

###### cumulativeGasUsed

> **cumulativeGasUsed**: `bigint`

###### effectiveGasPrice

> **effectiveGasPrice**: `bigint`

###### from

> **from**: `` `0x${string}` ``

###### gasUsed

> **gasUsed**: `bigint`

###### l1Fee

> **l1Fee**: `null` \| `bigint`

###### l1FeeScalar

> **l1FeeScalar**: `null` \| `number`

###### l1GasPrice

> **l1GasPrice**: `null` \| `bigint`

###### l1GasUsed

> **l1GasUsed**: `null` \| `bigint`

###### logs

> **logs**: `Log`\<`bigint`, `number`, `false`, `undefined`, `undefined`, `undefined`, `undefined`\>[]

###### logsBloom

> **logsBloom**: `` `0x${string}` ``

###### root?

> `optional` **root**: `` `0x${string}` ``

###### status

> **status**: `"success"` \| `"reverted"`

###### to

> **to**: `null` \| `` `0x${string}` ``

###### transactionHash

> **transactionHash**: `` `0x${string}` ``

###### transactionIndex

> **transactionIndex**: `number`

###### type

> **type**: `TransactionType`

#### 33979.formatters.transactionReceipt.type

> **type**: `"transactionReceipt"`

#### 33979.id

> **id**: `33979`

#### 33979.name

> **name**: `"Funki"`

#### 33979.nativeCurrency

> **nativeCurrency**: `object`

#### 33979.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 33979.nativeCurrency.name

> `readonly` **name**: `"Ether"`

#### 33979.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 33979.rpcUrls

> **rpcUrls**: `object`

#### 33979.rpcUrls.default

> `readonly` **default**: `object`

#### 33979.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc-mainnet.funkichain.com"`\]

#### 33979.serializers

> **serializers**: `object`

#### 33979.serializers.transaction()

> `readonly` **transaction**: (`transaction`, `signature?`) => `` `0x02${string}` `` \| `` `0x01${string}` `` \| `` `0x03${string}` `` \| `` `0x04${string}` `` \| `TransactionSerializedLegacy` \| `` `0x7e${string}` ``

##### Parameters

###### transaction

`OpStackTransactionSerializable`

###### signature?

`Signature`

##### Returns

`` `0x02${string}` `` \| `` `0x01${string}` `` \| `` `0x03${string}` `` \| `` `0x04${string}` `` \| `TransactionSerializedLegacy` \| `` `0x7e${string}` ``

#### 33979.sourceId

> **sourceId**: `1`

#### 33979.testnet?

> `optional` **testnet**: `boolean`

### 3397901

> **3397901**: `object` = `chains.funkiSepolia`

#### 3397901.blockExplorers

> **blockExplorers**: `object`

#### 3397901.blockExplorers.default

> `readonly` **default**: `object`

#### 3397901.blockExplorers.default.name

> `readonly` **name**: `"Funki Sepolia Sandbox Explorer"`

#### 3397901.blockExplorers.default.url

> `readonly` **url**: `"https://sepolia-sandbox.funkichain.com/"`

#### 3397901.contracts

> **contracts**: `object`

#### 3397901.contracts.gasPriceOracle

> `readonly` **gasPriceOracle**: `object`

#### 3397901.contracts.gasPriceOracle.address

> `readonly` **address**: `"0x420000000000000000000000000000000000000F"`

#### 3397901.contracts.l1Block

> `readonly` **l1Block**: `object`

#### 3397901.contracts.l1Block.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000015"`

#### 3397901.contracts.l2CrossDomainMessenger

> `readonly` **l2CrossDomainMessenger**: `object`

#### 3397901.contracts.l2CrossDomainMessenger.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000007"`

#### 3397901.contracts.l2Erc721Bridge

> `readonly` **l2Erc721Bridge**: `object`

#### 3397901.contracts.l2Erc721Bridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000014"`

#### 3397901.contracts.l2StandardBridge

> `readonly` **l2StandardBridge**: `object`

#### 3397901.contracts.l2StandardBridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000010"`

#### 3397901.contracts.l2ToL1MessagePasser

> `readonly` **l2ToL1MessagePasser**: `object`

#### 3397901.contracts.l2ToL1MessagePasser.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000016"`

#### 3397901.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 3397901.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 3397901.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `1620204`

#### 3397901.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 3397901.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 3397901.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 3397901.formatters

> **formatters**: `object`

#### 3397901.formatters.block

> `readonly` **block**: `object`

#### 3397901.formatters.block.exclude

> **exclude**: `undefined` \| \[\]

#### 3397901.formatters.block.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`OpStackRpcBlock`\<`BlockTag`, `boolean`\>

##### Returns

`object`

###### baseFeePerGas

> **baseFeePerGas**: `null` \| `bigint`

###### blobGasUsed

> **blobGasUsed**: `bigint`

###### difficulty

> **difficulty**: `bigint`

###### excessBlobGas

> **excessBlobGas**: `bigint`

###### extraData

> **extraData**: `` `0x${string}` ``

###### gasLimit

> **gasLimit**: `bigint`

###### gasUsed

> **gasUsed**: `bigint`

###### hash

> **hash**: `null` \| `` `0x${string}` ``

###### logsBloom

> **logsBloom**: `null` \| `` `0x${string}` ``

###### miner

> **miner**: `` `0x${string}` ``

###### mixHash

> **mixHash**: `` `0x${string}` ``

###### nonce

> **nonce**: `null` \| `` `0x${string}` ``

###### number

> **number**: `null` \| `bigint`

###### parentBeaconBlockRoot?

> `optional` **parentBeaconBlockRoot**: `` `0x${string}` ``

###### parentHash

> **parentHash**: `` `0x${string}` ``

###### receiptsRoot

> **receiptsRoot**: `` `0x${string}` ``

###### sealFields

> **sealFields**: `` `0x${string}` ``[]

###### sha3Uncles

> **sha3Uncles**: `` `0x${string}` ``

###### size

> **size**: `bigint`

###### stateRoot

> **stateRoot**: `` `0x${string}` ``

###### timestamp

> **timestamp**: `bigint`

###### totalDifficulty

> **totalDifficulty**: `null` \| `bigint`

###### transactions

> **transactions**: `` `0x${string}` ``[] \| `OpStackTransaction`\<`boolean`\>[]

###### transactionsRoot

> **transactionsRoot**: `` `0x${string}` ``

###### uncles

> **uncles**: `` `0x${string}` ``[]

###### withdrawals?

> `optional` **withdrawals**: `Withdrawal`[]

###### withdrawalsRoot?

> `optional` **withdrawalsRoot**: `` `0x${string}` ``

#### 3397901.formatters.block.type

> **type**: `"block"`

#### 3397901.formatters.transaction

> `readonly` **transaction**: `object`

#### 3397901.formatters.transaction.exclude

> **exclude**: `undefined` \| \[\]

#### 3397901.formatters.transaction.format()

> **format**: (`args`) => \{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

##### Parameters

###### args

`OpStackRpcTransaction`\<`boolean`\>

##### Returns

\{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

#### 3397901.formatters.transaction.type

> **type**: `"transaction"`

#### 3397901.formatters.transactionReceipt

> `readonly` **transactionReceipt**: `object`

#### 3397901.formatters.transactionReceipt.exclude

> **exclude**: `undefined` \| \[\]

#### 3397901.formatters.transactionReceipt.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`OpStackRpcTransactionReceipt`

##### Returns

`object`

###### blobGasPrice?

> `optional` **blobGasPrice**: `bigint`

###### blobGasUsed?

> `optional` **blobGasUsed**: `bigint`

###### blockHash

> **blockHash**: `` `0x${string}` ``

###### blockNumber

> **blockNumber**: `bigint`

###### contractAddress

> **contractAddress**: `undefined` \| `null` \| `` `0x${string}` ``

###### cumulativeGasUsed

> **cumulativeGasUsed**: `bigint`

###### effectiveGasPrice

> **effectiveGasPrice**: `bigint`

###### from

> **from**: `` `0x${string}` ``

###### gasUsed

> **gasUsed**: `bigint`

###### l1Fee

> **l1Fee**: `null` \| `bigint`

###### l1FeeScalar

> **l1FeeScalar**: `null` \| `number`

###### l1GasPrice

> **l1GasPrice**: `null` \| `bigint`

###### l1GasUsed

> **l1GasUsed**: `null` \| `bigint`

###### logs

> **logs**: `Log`\<`bigint`, `number`, `false`, `undefined`, `undefined`, `undefined`, `undefined`\>[]

###### logsBloom

> **logsBloom**: `` `0x${string}` ``

###### root?

> `optional` **root**: `` `0x${string}` ``

###### status

> **status**: `"success"` \| `"reverted"`

###### to

> **to**: `null` \| `` `0x${string}` ``

###### transactionHash

> **transactionHash**: `` `0x${string}` ``

###### transactionIndex

> **transactionIndex**: `number`

###### type

> **type**: `TransactionType`

#### 3397901.formatters.transactionReceipt.type

> **type**: `"transactionReceipt"`

#### 3397901.id

> **id**: `3397901`

#### 3397901.name

> **name**: `"Funki Sepolia Sandbox"`

#### 3397901.nativeCurrency

> **nativeCurrency**: `object`

#### 3397901.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 3397901.nativeCurrency.name

> `readonly` **name**: `"Ether"`

#### 3397901.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 3397901.network

> `readonly` **network**: `"funkiSepolia"`

#### 3397901.rpcUrls

> **rpcUrls**: `object`

#### 3397901.rpcUrls.default

> `readonly` **default**: `object`

#### 3397901.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://funki-testnet.alt.technology"`\]

#### 3397901.serializers

> **serializers**: `object`

#### 3397901.serializers.transaction()

> `readonly` **transaction**: (`transaction`, `signature?`) => `` `0x02${string}` `` \| `` `0x01${string}` `` \| `` `0x03${string}` `` \| `` `0x04${string}` `` \| `TransactionSerializedLegacy` \| `` `0x7e${string}` ``

##### Parameters

###### transaction

`OpStackTransactionSerializable`

###### signature?

`Signature`

##### Returns

`` `0x02${string}` `` \| `` `0x01${string}` `` \| `` `0x03${string}` `` \| `` `0x04${string}` `` \| `TransactionSerializedLegacy` \| `` `0x7e${string}` ``

#### 3397901.sourceId

> **sourceId**: `11155111`

#### 3397901.testnet

> **testnet**: `true`

### 34443

> **34443**: `object` = `chains.mode`

#### 34443.blockExplorers

> **blockExplorers**: `object`

#### 34443.blockExplorers.default

> `readonly` **default**: `object`

#### 34443.blockExplorers.default.name

> `readonly` **name**: `"Modescan"`

#### 34443.blockExplorers.default.url

> `readonly` **url**: `"https://modescan.io"`

#### 34443.contracts

> **contracts**: `object`

#### 34443.contracts.gasPriceOracle

> `readonly` **gasPriceOracle**: `object`

#### 34443.contracts.gasPriceOracle.address

> `readonly` **address**: `"0x420000000000000000000000000000000000000F"`

#### 34443.contracts.l1Block

> `readonly` **l1Block**: `object`

#### 34443.contracts.l1Block.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000015"`

#### 34443.contracts.l1StandardBridge

> `readonly` **l1StandardBridge**: `object`

#### 34443.contracts.l1StandardBridge.1

> `readonly` **1**: `object`

#### 34443.contracts.l1StandardBridge.1.address

> `readonly` **address**: `"0x735aDBbE72226BD52e818E7181953f42E3b0FF21"`

#### 34443.contracts.l2CrossDomainMessenger

> `readonly` **l2CrossDomainMessenger**: `object`

#### 34443.contracts.l2CrossDomainMessenger.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000007"`

#### 34443.contracts.l2Erc721Bridge

> `readonly` **l2Erc721Bridge**: `object`

#### 34443.contracts.l2Erc721Bridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000014"`

#### 34443.contracts.l2OutputOracle

> `readonly` **l2OutputOracle**: `object`

#### 34443.contracts.l2OutputOracle.1

> `readonly` **1**: `object`

#### 34443.contracts.l2OutputOracle.1.address

> `readonly` **address**: `"0x4317ba146D4933D889518a3e5E11Fe7a53199b04"`

#### 34443.contracts.l2StandardBridge

> `readonly` **l2StandardBridge**: `object`

#### 34443.contracts.l2StandardBridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000010"`

#### 34443.contracts.l2ToL1MessagePasser

> `readonly` **l2ToL1MessagePasser**: `object`

#### 34443.contracts.l2ToL1MessagePasser.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000016"`

#### 34443.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 34443.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 34443.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `2465882`

#### 34443.contracts.portal

> `readonly` **portal**: `object`

#### 34443.contracts.portal.1

> `readonly` **1**: `object`

#### 34443.contracts.portal.1.address

> `readonly` **address**: `"0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07"`

#### 34443.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 34443.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 34443.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 34443.formatters

> **formatters**: `object`

#### 34443.formatters.block

> `readonly` **block**: `object`

#### 34443.formatters.block.exclude

> **exclude**: `undefined` \| \[\]

#### 34443.formatters.block.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`OpStackRpcBlock`\<`BlockTag`, `boolean`\>

##### Returns

`object`

###### baseFeePerGas

> **baseFeePerGas**: `null` \| `bigint`

###### blobGasUsed

> **blobGasUsed**: `bigint`

###### difficulty

> **difficulty**: `bigint`

###### excessBlobGas

> **excessBlobGas**: `bigint`

###### extraData

> **extraData**: `` `0x${string}` ``

###### gasLimit

> **gasLimit**: `bigint`

###### gasUsed

> **gasUsed**: `bigint`

###### hash

> **hash**: `null` \| `` `0x${string}` ``

###### logsBloom

> **logsBloom**: `null` \| `` `0x${string}` ``

###### miner

> **miner**: `` `0x${string}` ``

###### mixHash

> **mixHash**: `` `0x${string}` ``

###### nonce

> **nonce**: `null` \| `` `0x${string}` ``

###### number

> **number**: `null` \| `bigint`

###### parentBeaconBlockRoot?

> `optional` **parentBeaconBlockRoot**: `` `0x${string}` ``

###### parentHash

> **parentHash**: `` `0x${string}` ``

###### receiptsRoot

> **receiptsRoot**: `` `0x${string}` ``

###### sealFields

> **sealFields**: `` `0x${string}` ``[]

###### sha3Uncles

> **sha3Uncles**: `` `0x${string}` ``

###### size

> **size**: `bigint`

###### stateRoot

> **stateRoot**: `` `0x${string}` ``

###### timestamp

> **timestamp**: `bigint`

###### totalDifficulty

> **totalDifficulty**: `null` \| `bigint`

###### transactions

> **transactions**: `` `0x${string}` ``[] \| `OpStackTransaction`\<`boolean`\>[]

###### transactionsRoot

> **transactionsRoot**: `` `0x${string}` ``

###### uncles

> **uncles**: `` `0x${string}` ``[]

###### withdrawals?

> `optional` **withdrawals**: `Withdrawal`[]

###### withdrawalsRoot?

> `optional` **withdrawalsRoot**: `` `0x${string}` ``

#### 34443.formatters.block.type

> **type**: `"block"`

#### 34443.formatters.transaction

> `readonly` **transaction**: `object`

#### 34443.formatters.transaction.exclude

> **exclude**: `undefined` \| \[\]

#### 34443.formatters.transaction.format()

> **format**: (`args`) => \{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

##### Parameters

###### args

`OpStackRpcTransaction`\<`boolean`\>

##### Returns

\{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

#### 34443.formatters.transaction.type

> **type**: `"transaction"`

#### 34443.formatters.transactionReceipt

> `readonly` **transactionReceipt**: `object`

#### 34443.formatters.transactionReceipt.exclude

> **exclude**: `undefined` \| \[\]

#### 34443.formatters.transactionReceipt.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`OpStackRpcTransactionReceipt`

##### Returns

`object`

###### blobGasPrice?

> `optional` **blobGasPrice**: `bigint`

###### blobGasUsed?

> `optional` **blobGasUsed**: `bigint`

###### blockHash

> **blockHash**: `` `0x${string}` ``

###### blockNumber

> **blockNumber**: `bigint`

###### contractAddress

> **contractAddress**: `undefined` \| `null` \| `` `0x${string}` ``

###### cumulativeGasUsed

> **cumulativeGasUsed**: `bigint`

###### effectiveGasPrice

> **effectiveGasPrice**: `bigint`

###### from

> **from**: `` `0x${string}` ``

###### gasUsed

> **gasUsed**: `bigint`

###### l1Fee

> **l1Fee**: `null` \| `bigint`

###### l1FeeScalar

> **l1FeeScalar**: `null` \| `number`

###### l1GasPrice

> **l1GasPrice**: `null` \| `bigint`

###### l1GasUsed

> **l1GasUsed**: `null` \| `bigint`

###### logs

> **logs**: `Log`\<`bigint`, `number`, `false`, `undefined`, `undefined`, `undefined`, `undefined`\>[]

###### logsBloom

> **logsBloom**: `` `0x${string}` ``

###### root?

> `optional` **root**: `` `0x${string}` ``

###### status

> **status**: `"success"` \| `"reverted"`

###### to

> **to**: `null` \| `` `0x${string}` ``

###### transactionHash

> **transactionHash**: `` `0x${string}` ``

###### transactionIndex

> **transactionIndex**: `number`

###### type

> **type**: `TransactionType`

#### 34443.formatters.transactionReceipt.type

> **type**: `"transactionReceipt"`

#### 34443.id

> **id**: `34443`

#### 34443.name

> **name**: `"Mode Mainnet"`

#### 34443.nativeCurrency

> **nativeCurrency**: `object`

#### 34443.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 34443.nativeCurrency.name

> `readonly` **name**: `"Ether"`

#### 34443.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 34443.rpcUrls

> **rpcUrls**: `object`

#### 34443.rpcUrls.default

> `readonly` **default**: `object`

#### 34443.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://mainnet.mode.network"`\]

#### 34443.serializers

> **serializers**: `object`

#### 34443.serializers.transaction()

> `readonly` **transaction**: (`transaction`, `signature?`) => `` `0x02${string}` `` \| `` `0x01${string}` `` \| `` `0x03${string}` `` \| `` `0x04${string}` `` \| `TransactionSerializedLegacy` \| `` `0x7e${string}` ``

##### Parameters

###### transaction

`OpStackTransactionSerializable`

###### signature?

`Signature`

##### Returns

`` `0x02${string}` `` \| `` `0x01${string}` `` \| `` `0x03${string}` `` \| `` `0x04${string}` `` \| `TransactionSerializedLegacy` \| `` `0x7e${string}` ``

#### 34443.sourceId

> **sourceId**: `1`

#### 34443.testnet?

> `optional` **testnet**: `boolean`

### 35441

> **35441**: `object` = `chains.qMainnet`

#### 35441.blockExplorers

> **blockExplorers**: `object`

#### 35441.blockExplorers.default

> `readonly` **default**: `object`

#### 35441.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://explorer.q.org/api"`

#### 35441.blockExplorers.default.name

> `readonly` **name**: `"Q Mainnet Explorer"`

#### 35441.blockExplorers.default.url

> `readonly` **url**: `"https://explorer.q.org"`

#### 35441.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 35441.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 35441.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 35441.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 35441.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 35441.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 35441.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 35441.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 35441.formatters?

> `optional` **formatters**: `undefined`

#### 35441.id

> **id**: `35441`

#### 35441.name

> **name**: `"Q Mainnet"`

#### 35441.nativeCurrency

> **nativeCurrency**: `object`

#### 35441.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 35441.nativeCurrency.name

> `readonly` **name**: `"Q"`

#### 35441.nativeCurrency.symbol

> `readonly` **symbol**: `"Q"`

#### 35441.rpcUrls

> **rpcUrls**: `object`

#### 35441.rpcUrls.default

> `readonly` **default**: `object`

#### 35441.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.q.org"`\]

#### 35441.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 35441.sourceId?

> `optional` **sourceId**: `number`

#### 35441.testnet?

> `optional` **testnet**: `boolean`

### 35443

> **35443**: `object` = `chains.qTestnet`

#### 35443.blockExplorers

> **blockExplorers**: `object`

#### 35443.blockExplorers.default

> `readonly` **default**: `object`

#### 35443.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://explorer.qtestnet.org/api"`

#### 35443.blockExplorers.default.name

> `readonly` **name**: `"Q Testnet Explorer"`

#### 35443.blockExplorers.default.url

> `readonly` **url**: `"https://explorer.qtestnet.org"`

#### 35443.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 35443.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 35443.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 35443.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 35443.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 35443.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 35443.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 35443.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 35443.formatters?

> `optional` **formatters**: `undefined`

#### 35443.id

> **id**: `35443`

#### 35443.name

> **name**: `"Q Testnet"`

#### 35443.nativeCurrency

> **nativeCurrency**: `object`

#### 35443.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 35443.nativeCurrency.name

> `readonly` **name**: `"Q"`

#### 35443.nativeCurrency.symbol

> `readonly` **symbol**: `"Q"`

#### 35443.rpcUrls

> **rpcUrls**: `object`

#### 35443.rpcUrls.default

> `readonly` **default**: `object`

#### 35443.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.qtestnet.org"`\]

#### 35443.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 35443.sourceId?

> `optional` **sourceId**: `number`

#### 35443.testnet

> **testnet**: `true`

### 369

> **369**: `object` = `chains.pulsechain`

#### 369.blockExplorers

> **blockExplorers**: `object`

#### 369.blockExplorers.default

> `readonly` **default**: `object`

#### 369.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://api.scan.pulsechain.com/api"`

#### 369.blockExplorers.default.name

> `readonly` **name**: `"PulseScan"`

#### 369.blockExplorers.default.url

> `readonly` **url**: `"https://scan.pulsechain.com"`

#### 369.contracts

> **contracts**: `object`

#### 369.contracts.ensRegistry

> `readonly` **ensRegistry**: `object`

#### 369.contracts.ensRegistry.address

> `readonly` **address**: `"0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"`

#### 369.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 369.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 369.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `14353601`

#### 369.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 369.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 369.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 369.formatters?

> `optional` **formatters**: `undefined`

#### 369.id

> **id**: `369`

#### 369.name

> **name**: `"PulseChain"`

#### 369.nativeCurrency

> **nativeCurrency**: `object`

#### 369.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 369.nativeCurrency.name

> `readonly` **name**: `"Pulse"`

#### 369.nativeCurrency.symbol

> `readonly` **symbol**: `"PLS"`

#### 369.rpcUrls

> **rpcUrls**: `object`

#### 369.rpcUrls.default

> `readonly` **default**: `object`

#### 369.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.pulsechain.com"`\]

#### 369.rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly \[`"wss://ws.pulsechain.com"`\]

#### 369.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 369.sourceId?

> `optional` **sourceId**: `number`

#### 369.testnet

> **testnet**: `false`

### 3737

> **3737**: `object` = `chains.crossbell`

#### 3737.blockExplorers

> **blockExplorers**: `object`

#### 3737.blockExplorers.default

> `readonly` **default**: `object`

#### 3737.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://scan.crossbell.io/api"`

#### 3737.blockExplorers.default.name

> `readonly` **name**: `"CrossScan"`

#### 3737.blockExplorers.default.url

> `readonly` **url**: `"https://scan.crossbell.io"`

#### 3737.contracts

> **contracts**: `object`

#### 3737.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 3737.contracts.multicall3.address

> `readonly` **address**: `"0xcA11bde05977b3631167028862bE2a173976CA11"`

#### 3737.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `38246031`

#### 3737.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 3737.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 3737.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 3737.formatters?

> `optional` **formatters**: `undefined`

#### 3737.id

> **id**: `3737`

#### 3737.name

> **name**: `"Crossbell"`

#### 3737.nativeCurrency

> **nativeCurrency**: `object`

#### 3737.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 3737.nativeCurrency.name

> `readonly` **name**: `"CSB"`

#### 3737.nativeCurrency.symbol

> `readonly` **symbol**: `"CSB"`

#### 3737.rpcUrls

> **rpcUrls**: `object`

#### 3737.rpcUrls.default

> `readonly` **default**: `object`

#### 3737.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.crossbell.io"`\]

#### 3737.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 3737.sourceId?

> `optional` **sourceId**: `number`

#### 3737.testnet?

> `optional` **testnet**: `boolean`

### 37714555429

> **37714555429**: `object` = `chains.xaiTestnet`

#### 37714555429.blockExplorers

> **blockExplorers**: `object`

#### 37714555429.blockExplorers.default

> `readonly` **default**: `object`

#### 37714555429.blockExplorers.default.name

> `readonly` **name**: `"Blockscout"`

#### 37714555429.blockExplorers.default.url

> `readonly` **url**: `"https://testnet-explorer-v2.xai-chain.net"`

#### 37714555429.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 37714555429.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 37714555429.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 37714555429.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 37714555429.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 37714555429.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 37714555429.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 37714555429.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 37714555429.formatters?

> `optional` **formatters**: `undefined`

#### 37714555429.id

> **id**: `37714555429`

#### 37714555429.name

> **name**: `"Xai Testnet"`

#### 37714555429.nativeCurrency

> **nativeCurrency**: `object`

#### 37714555429.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 37714555429.nativeCurrency.name

> `readonly` **name**: `"sXai"`

#### 37714555429.nativeCurrency.symbol

> `readonly` **symbol**: `"sXAI"`

#### 37714555429.rpcUrls

> **rpcUrls**: `object`

#### 37714555429.rpcUrls.default

> `readonly` **default**: `object`

#### 37714555429.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://testnet-v2.xai-chain.net/rpc"`\]

#### 37714555429.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 37714555429.sourceId?

> `optional` **sourceId**: `number`

#### 37714555429.testnet

> **testnet**: `true`

### 3776

> **3776**: `object` = `chains.astarZkEVM`

#### 3776.blockExplorers

> **blockExplorers**: `object`

#### 3776.blockExplorers.default

> `readonly` **default**: `object`

#### 3776.blockExplorers.default.name

> `readonly` **name**: `"Astar zkEVM Explorer"`

#### 3776.blockExplorers.default.url

> `readonly` **url**: `"https://astar-zkevm.explorer.startale.com"`

#### 3776.contracts

> **contracts**: `object`

#### 3776.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 3776.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 3776.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `93528`

#### 3776.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 3776.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 3776.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 3776.formatters?

> `optional` **formatters**: `undefined`

#### 3776.id

> **id**: `3776`

#### 3776.name

> **name**: `"Astar zkEVM"`

#### 3776.nativeCurrency

> **nativeCurrency**: `object`

#### 3776.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 3776.nativeCurrency.name

> `readonly` **name**: `"Ether"`

#### 3776.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 3776.network

> `readonly` **network**: `"AstarZkEVM"`

#### 3776.rpcUrls

> **rpcUrls**: `object`

#### 3776.rpcUrls.default

> `readonly` **default**: `object`

#### 3776.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc-zkevm.astar.network"`\]

#### 3776.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 3776.sourceId?

> `optional` **sourceId**: `number`

#### 3776.testnet

> **testnet**: `false`

### 3993

> **3993**: `object` = `chains.apexTestnet`

#### 3993.blockExplorers

> **blockExplorers**: `object`

#### 3993.blockExplorers.default

> `readonly` **default**: `object`

#### 3993.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://exp-testnet.apexlayer.xyz/api"`

#### 3993.blockExplorers.default.name

> `readonly` **name**: `"Blockscout"`

#### 3993.blockExplorers.default.url

> `readonly` **url**: `"https://exp-testnet.apexlayer.xyz"`

#### 3993.contracts

> **contracts**: `object`

#### 3993.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 3993.contracts.multicall3.address

> `readonly` **address**: `"0xf7642be33a6b18D16a995657adb5a68CD0438aE2"`

#### 3993.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `283775`

#### 3993.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 3993.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 3993.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 3993.formatters?

> `optional` **formatters**: `undefined`

#### 3993.id

> **id**: `3993`

#### 3993.name

> **name**: `"APEX Testnet"`

#### 3993.nativeCurrency

> **nativeCurrency**: `object`

#### 3993.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 3993.nativeCurrency.name

> `readonly` **name**: `"Ether"`

#### 3993.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 3993.rpcUrls

> **rpcUrls**: `object`

#### 3993.rpcUrls.default

> `readonly` **default**: `object`

#### 3993.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc-testnet.apexlayer.xyz"`\]

#### 3993.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 3993.sourceId?

> `optional` **sourceId**: `number`

#### 3993.testnet

> **testnet**: `true`

### 41144114

> **41144114**: `object` = `chains.otimDevnet`

#### 41144114.blockExplorers?

> `optional` **blockExplorers**: `object`

##### Index Signature

\[`key`: `string`\]: `object`

#### 41144114.blockExplorers.default

> **default**: `object`

#### 41144114.blockExplorers.default.apiUrl?

> `optional` **apiUrl**: `string`

#### 41144114.blockExplorers.default.name

> **name**: `string`

#### 41144114.blockExplorers.default.url

> **url**: `string`

#### 41144114.contracts

> **contracts**: `object`

#### 41144114.contracts.batchInvoker

> `readonly` **batchInvoker**: `object`

#### 41144114.contracts.batchInvoker.address

> `readonly` **address**: `"0x5FbDB2315678afecb367f032d93F642f64180aa3"`

#### 41144114.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 41144114.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 41144114.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 41144114.formatters?

> `optional` **formatters**: `undefined`

#### 41144114.id

> **id**: `41144114`

#### 41144114.name

> **name**: `"Otim Devnet"`

#### 41144114.nativeCurrency

> **nativeCurrency**: `object`

#### 41144114.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 41144114.nativeCurrency.name

> `readonly` **name**: `"ETH"`

#### 41144114.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 41144114.rpcUrls

> **rpcUrls**: `object`

#### 41144114.rpcUrls.default

> `readonly` **default**: `object`

#### 41144114.rpcUrls.default.http

> `readonly` **http**: readonly \[`"http://devnet.otim.xyz"`\]

#### 41144114.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 41144114.sourceId?

> `optional` **sourceId**: `number`

#### 41144114.testnet?

> `optional` **testnet**: `boolean`

### 42

> **42**: `object` = `chains.lukso`

#### 42.blockExplorers

> **blockExplorers**: `object`

#### 42.blockExplorers.default

> `readonly` **default**: `object`

#### 42.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://api.explorer.execution.mainnet.lukso.network/api"`

#### 42.blockExplorers.default.name

> `readonly` **name**: `"LUKSO Mainnet Explorer"`

#### 42.blockExplorers.default.url

> `readonly` **url**: `"https://explorer.execution.mainnet.lukso.network"`

#### 42.contracts

> **contracts**: `object`

#### 42.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 42.contracts.multicall3.address

> `readonly` **address**: `"0xcA11bde05977b3631167028862bE2a173976CA11"`

#### 42.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `468183`

#### 42.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 42.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 42.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 42.formatters?

> `optional` **formatters**: `undefined`

#### 42.id

> **id**: `42`

#### 42.name

> **name**: `"LUKSO"`

#### 42.nativeCurrency

> **nativeCurrency**: `object`

#### 42.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 42.nativeCurrency.name

> `readonly` **name**: `"LUKSO"`

#### 42.nativeCurrency.symbol

> `readonly` **symbol**: `"LYX"`

#### 42.network

> `readonly` **network**: `"lukso"`

#### 42.rpcUrls

> **rpcUrls**: `object`

#### 42.rpcUrls.default

> `readonly` **default**: `object`

#### 42.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.mainnet.lukso.network"`\]

#### 42.rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly \[`"wss://ws-rpc.mainnet.lukso.network"`\]

#### 42.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 42.sourceId?

> `optional` **sourceId**: `number`

#### 42.testnet?

> `optional` **testnet**: `boolean`

### 4200

> **4200**: `object` = `chains.merlin`

#### 4200.blockExplorers

> **blockExplorers**: `object`

#### 4200.blockExplorers.default

> `readonly` **default**: `object`

#### 4200.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://scan.merlinchain.io/api"`

#### 4200.blockExplorers.default.name

> `readonly` **name**: `"blockscout"`

#### 4200.blockExplorers.default.url

> `readonly` **url**: `"https://scan.merlinchain.io"`

#### 4200.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 4200.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 4200.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 4200.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 4200.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 4200.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 4200.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 4200.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 4200.formatters?

> `optional` **formatters**: `undefined`

#### 4200.id

> **id**: `4200`

#### 4200.name

> **name**: `"Merlin"`

#### 4200.nativeCurrency

> **nativeCurrency**: `object`

#### 4200.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 4200.nativeCurrency.name

> `readonly` **name**: `"BTC"`

#### 4200.nativeCurrency.symbol

> `readonly` **symbol**: `"BTC"`

#### 4200.rpcUrls

> **rpcUrls**: `object`

#### 4200.rpcUrls.default

> `readonly` **default**: `object`

#### 4200.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.merlinchain.io"`\]

#### 4200.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 4200.sourceId?

> `optional` **sourceId**: `number`

#### 4200.testnet?

> `optional` **testnet**: `boolean`

### 4202

> **4202**: `object` = `chains.liskSepolia`

#### 4202.blockExplorers

> **blockExplorers**: `object`

#### 4202.blockExplorers.default

> `readonly` **default**: `object`

#### 4202.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://sepolia-blockscout.lisk.com/api"`

#### 4202.blockExplorers.default.name

> `readonly` **name**: `"Blockscout"`

#### 4202.blockExplorers.default.url

> `readonly` **url**: `"https://sepolia-blockscout.lisk.com"`

#### 4202.contracts

> **contracts**: `object`

#### 4202.contracts.gasPriceOracle

> `readonly` **gasPriceOracle**: `object`

#### 4202.contracts.gasPriceOracle.address

> `readonly` **address**: `"0x420000000000000000000000000000000000000F"`

#### 4202.contracts.l1Block

> `readonly` **l1Block**: `object`

#### 4202.contracts.l1Block.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000015"`

#### 4202.contracts.l1StandardBridge

> `readonly` **l1StandardBridge**: `object`

#### 4202.contracts.l1StandardBridge.11155111

> `readonly` **11155111**: `object`

#### 4202.contracts.l1StandardBridge.11155111.address

> `readonly` **address**: `"0x1Fb30e446eA791cd1f011675E5F3f5311b70faF5"`

#### 4202.contracts.l2CrossDomainMessenger

> `readonly` **l2CrossDomainMessenger**: `object`

#### 4202.contracts.l2CrossDomainMessenger.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000007"`

#### 4202.contracts.l2Erc721Bridge

> `readonly` **l2Erc721Bridge**: `object`

#### 4202.contracts.l2Erc721Bridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000014"`

#### 4202.contracts.l2OutputOracle

> `readonly` **l2OutputOracle**: `object`

#### 4202.contracts.l2OutputOracle.11155111

> `readonly` **11155111**: `object`

#### 4202.contracts.l2OutputOracle.11155111.address

> `readonly` **address**: `"0xA0E35F56C318DE1bD5D9ca6A94Fe7e37C5663348"`

#### 4202.contracts.l2StandardBridge

> `readonly` **l2StandardBridge**: `object`

#### 4202.contracts.l2StandardBridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000010"`

#### 4202.contracts.l2ToL1MessagePasser

> `readonly` **l2ToL1MessagePasser**: `object`

#### 4202.contracts.l2ToL1MessagePasser.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000016"`

#### 4202.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 4202.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 4202.contracts.portal

> `readonly` **portal**: `object`

#### 4202.contracts.portal.11155111

> `readonly` **11155111**: `object`

#### 4202.contracts.portal.11155111.address

> `readonly` **address**: `"0xe3d90F21490686Ec7eF37BE788E02dfC12787264"`

#### 4202.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 4202.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 4202.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 4202.formatters

> **formatters**: `object`

#### 4202.formatters.block

> `readonly` **block**: `object`

#### 4202.formatters.block.exclude

> **exclude**: `undefined` \| \[\]

#### 4202.formatters.block.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`OpStackRpcBlock`\<`BlockTag`, `boolean`\>

##### Returns

`object`

###### baseFeePerGas

> **baseFeePerGas**: `null` \| `bigint`

###### blobGasUsed

> **blobGasUsed**: `bigint`

###### difficulty

> **difficulty**: `bigint`

###### excessBlobGas

> **excessBlobGas**: `bigint`

###### extraData

> **extraData**: `` `0x${string}` ``

###### gasLimit

> **gasLimit**: `bigint`

###### gasUsed

> **gasUsed**: `bigint`

###### hash

> **hash**: `null` \| `` `0x${string}` ``

###### logsBloom

> **logsBloom**: `null` \| `` `0x${string}` ``

###### miner

> **miner**: `` `0x${string}` ``

###### mixHash

> **mixHash**: `` `0x${string}` ``

###### nonce

> **nonce**: `null` \| `` `0x${string}` ``

###### number

> **number**: `null` \| `bigint`

###### parentBeaconBlockRoot?

> `optional` **parentBeaconBlockRoot**: `` `0x${string}` ``

###### parentHash

> **parentHash**: `` `0x${string}` ``

###### receiptsRoot

> **receiptsRoot**: `` `0x${string}` ``

###### sealFields

> **sealFields**: `` `0x${string}` ``[]

###### sha3Uncles

> **sha3Uncles**: `` `0x${string}` ``

###### size

> **size**: `bigint`

###### stateRoot

> **stateRoot**: `` `0x${string}` ``

###### timestamp

> **timestamp**: `bigint`

###### totalDifficulty

> **totalDifficulty**: `null` \| `bigint`

###### transactions

> **transactions**: `` `0x${string}` ``[] \| `OpStackTransaction`\<`boolean`\>[]

###### transactionsRoot

> **transactionsRoot**: `` `0x${string}` ``

###### uncles

> **uncles**: `` `0x${string}` ``[]

###### withdrawals?

> `optional` **withdrawals**: `Withdrawal`[]

###### withdrawalsRoot?

> `optional` **withdrawalsRoot**: `` `0x${string}` ``

#### 4202.formatters.block.type

> **type**: `"block"`

#### 4202.formatters.transaction

> `readonly` **transaction**: `object`

#### 4202.formatters.transaction.exclude

> **exclude**: `undefined` \| \[\]

#### 4202.formatters.transaction.format()

> **format**: (`args`) => \{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

##### Parameters

###### args

`OpStackRpcTransaction`\<`boolean`\>

##### Returns

\{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

#### 4202.formatters.transaction.type

> **type**: `"transaction"`

#### 4202.formatters.transactionReceipt

> `readonly` **transactionReceipt**: `object`

#### 4202.formatters.transactionReceipt.exclude

> **exclude**: `undefined` \| \[\]

#### 4202.formatters.transactionReceipt.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`OpStackRpcTransactionReceipt`

##### Returns

`object`

###### blobGasPrice?

> `optional` **blobGasPrice**: `bigint`

###### blobGasUsed?

> `optional` **blobGasUsed**: `bigint`

###### blockHash

> **blockHash**: `` `0x${string}` ``

###### blockNumber

> **blockNumber**: `bigint`

###### contractAddress

> **contractAddress**: `undefined` \| `null` \| `` `0x${string}` ``

###### cumulativeGasUsed

> **cumulativeGasUsed**: `bigint`

###### effectiveGasPrice

> **effectiveGasPrice**: `bigint`

###### from

> **from**: `` `0x${string}` ``

###### gasUsed

> **gasUsed**: `bigint`

###### l1Fee

> **l1Fee**: `null` \| `bigint`

###### l1FeeScalar

> **l1FeeScalar**: `null` \| `number`

###### l1GasPrice

> **l1GasPrice**: `null` \| `bigint`

###### l1GasUsed

> **l1GasUsed**: `null` \| `bigint`

###### logs

> **logs**: `Log`\<`bigint`, `number`, `false`, `undefined`, `undefined`, `undefined`, `undefined`\>[]

###### logsBloom

> **logsBloom**: `` `0x${string}` ``

###### root?

> `optional` **root**: `` `0x${string}` ``

###### status

> **status**: `"success"` \| `"reverted"`

###### to

> **to**: `null` \| `` `0x${string}` ``

###### transactionHash

> **transactionHash**: `` `0x${string}` ``

###### transactionIndex

> **transactionIndex**: `number`

###### type

> **type**: `TransactionType`

#### 4202.formatters.transactionReceipt.type

> **type**: `"transactionReceipt"`

#### 4202.id

> **id**: `4202`

#### 4202.name

> **name**: `"Lisk Sepolia"`

#### 4202.nativeCurrency

> **nativeCurrency**: `object`

#### 4202.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 4202.nativeCurrency.name

> `readonly` **name**: `"Sepolia Ether"`

#### 4202.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 4202.network

> `readonly` **network**: `"lisk-sepolia"`

#### 4202.rpcUrls

> **rpcUrls**: `object`

#### 4202.rpcUrls.default

> `readonly` **default**: `object`

#### 4202.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.sepolia-api.lisk.com"`\]

#### 4202.serializers

> **serializers**: `object`

#### 4202.serializers.transaction()

> `readonly` **transaction**: (`transaction`, `signature?`) => `` `0x02${string}` `` \| `` `0x01${string}` `` \| `` `0x03${string}` `` \| `` `0x04${string}` `` \| `TransactionSerializedLegacy` \| `` `0x7e${string}` ``

##### Parameters

###### transaction

`OpStackTransactionSerializable`

###### signature?

`Signature`

##### Returns

`` `0x02${string}` `` \| `` `0x01${string}` `` \| `` `0x03${string}` `` \| `` `0x04${string}` `` \| `TransactionSerializedLegacy` \| `` `0x7e${string}` ``

#### 4202.sourceId

> **sourceId**: `11155111`

#### 4202.testnet

> **testnet**: `true`

### 42161

> **42161**: `object` = `chains.arbitrum`

#### 42161.blockExplorers

> **blockExplorers**: `object`

#### 42161.blockExplorers.default

> `readonly` **default**: `object`

#### 42161.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://api.arbiscan.io/api"`

#### 42161.blockExplorers.default.name

> `readonly` **name**: `"Arbiscan"`

#### 42161.blockExplorers.default.url

> `readonly` **url**: `"https://arbiscan.io"`

#### 42161.contracts

> **contracts**: `object`

#### 42161.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 42161.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 42161.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `7654707`

#### 42161.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 42161.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 42161.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 42161.formatters?

> `optional` **formatters**: `undefined`

#### 42161.id

> **id**: `42161`

#### 42161.name

> **name**: `"Arbitrum One"`

#### 42161.nativeCurrency

> **nativeCurrency**: `object`

#### 42161.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 42161.nativeCurrency.name

> `readonly` **name**: `"Ether"`

#### 42161.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 42161.rpcUrls

> **rpcUrls**: `object`

#### 42161.rpcUrls.default

> `readonly` **default**: `object`

#### 42161.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://arb1.arbitrum.io/rpc"`\]

#### 42161.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 42161.sourceId?

> `optional` **sourceId**: `number`

#### 42161.testnet?

> `optional` **testnet**: `boolean`

### 42170

> **42170**: `object` = `chains.arbitrumNova`

#### 42170.blockExplorers

> **blockExplorers**: `object`

#### 42170.blockExplorers.default

> `readonly` **default**: `object`

#### 42170.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://api-nova.arbiscan.io/api"`

#### 42170.blockExplorers.default.name

> `readonly` **name**: `"Arbiscan"`

#### 42170.blockExplorers.default.url

> `readonly` **url**: `"https://nova.arbiscan.io"`

#### 42170.contracts

> **contracts**: `object`

#### 42170.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 42170.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 42170.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `1746963`

#### 42170.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 42170.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 42170.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 42170.formatters?

> `optional` **formatters**: `undefined`

#### 42170.id

> **id**: `42170`

#### 42170.name

> **name**: `"Arbitrum Nova"`

#### 42170.nativeCurrency

> **nativeCurrency**: `object`

#### 42170.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 42170.nativeCurrency.name

> `readonly` **name**: `"Ether"`

#### 42170.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 42170.rpcUrls

> **rpcUrls**: `object`

#### 42170.rpcUrls.default

> `readonly` **default**: `object`

#### 42170.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://nova.arbitrum.io/rpc"`\]

#### 42170.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 42170.sourceId?

> `optional` **sourceId**: `number`

#### 42170.testnet?

> `optional` **testnet**: `boolean`

### 42220

> **42220**: `object` = `chains.celo`

#### 42220.blockExplorers

> **blockExplorers**: `object`

#### 42220.blockExplorers.default

> `readonly` **default**: `object`

#### 42220.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://api.celoscan.io/api"`

#### 42220.blockExplorers.default.name

> `readonly` **name**: `"Celo Explorer"`

#### 42220.blockExplorers.default.url

> `readonly` **url**: `"https://celoscan.io"`

#### 42220.contracts

> **contracts**: `object`

#### 42220.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 42220.contracts.multicall3.address

> `readonly` **address**: `"0xcA11bde05977b3631167028862bE2a173976CA11"`

#### 42220.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `13112599`

#### 42220.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 42220.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 42220.fees

> **fees**: `ChainFees`\<\{ `block`: \{ `exclude`: `undefined` \| \[\]; `format`: (`args`) => `object`; `type`: `"block"`; \}; `transaction`: \{ `exclude`: `undefined` \| \[\]; `format`: (`args`) => \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `feeCurrency`: `null` \| `` `0x${string}` ``; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `gatewayFee?`: `undefined`; `gatewayFeeRecipient?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `feeCurrency`: `null` \| `` `0x${string}` ``; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `gatewayFee?`: `undefined`; `gatewayFeeRecipient?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `feeCurrency`: `null` \| `` `0x${string}` ``; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `gatewayFee?`: `undefined`; `gatewayFeeRecipient?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `feeCurrency`: `null` \| `` `0x${string}` ``; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `gatewayFee?`: `undefined`; `gatewayFeeRecipient?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `feeCurrency`: `null` \| `` `0x${string}` ``; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `gatewayFee?`: `undefined`; `gatewayFeeRecipient?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `feeCurrency`: `null` \| `` `0x${string}` ``; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `gatewayFee`: `null` \| `bigint`; `gatewayFeeRecipient`: `null` \| `` `0x${string}` ``; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"cip42"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `feeCurrency`: `null` \| `` `0x${string}` ``; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `gatewayFee?`: `undefined`; `gatewayFeeRecipient?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"cip64"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `undefined`; `feeCurrency?`: `undefined`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `gatewayFee?`: `undefined`; `gatewayFeeRecipient?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}; `type`: `"transaction"`; \}; `transactionRequest`: \{ `exclude`: `undefined` \| \[\]; `format`: (`args`) => \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobs?`: `undefined`; `blobVersionedHashes?`: `undefined`; `data?`: `` `0x${string}` ``; `feeCurrency?`: `` `0x${string}` ``; `from?`: `` `0x${string}` ``; `gas?`: `` `0x${string}` ``; `gasPrice?`: `` `0x${string}` ``; `kzg?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `nonce?`: `` `0x${string}` ``; `sidecars?`: `undefined`; `to?`: `null` \| `` `0x${string}` ``; `type?`: `"0x0"`; `value?`: `` `0x${string}` ``; \} \| \{ `accessList?`: `AccessList`; `authorizationList?`: `undefined`; `blobs?`: `undefined`; `blobVersionedHashes?`: `undefined`; `data?`: `` `0x${string}` ``; `feeCurrency?`: `` `0x${string}` ``; `from?`: `` `0x${string}` ``; `gas?`: `` `0x${string}` ``; `gasPrice?`: `` `0x${string}` ``; `kzg?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `nonce?`: `` `0x${string}` ``; `sidecars?`: `undefined`; `to?`: `null` \| `` `0x${string}` ``; `type?`: `"0x1"`; `value?`: `` `0x${string}` ``; \} \| \{ `accessList?`: `AccessList`; `authorizationList?`: `undefined`; `blobs?`: `undefined`; `blobVersionedHashes?`: `undefined`; `data?`: `` `0x${string}` ``; `feeCurrency?`: `` `0x${string}` ``; `from?`: `` `0x${string}` ``; `gas?`: `` `0x${string}` ``; `gasPrice?`: `undefined`; `kzg?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `` `0x${string}` ``; `maxPriorityFeePerGas?`: `` `0x${string}` ``; `nonce?`: `` `0x${string}` ``; `sidecars?`: `undefined`; `to?`: `null` \| `` `0x${string}` ``; `type?`: `"0x2"`; `value?`: `` `0x${string}` ``; \} \| \{ `accessList?`: `AccessList`; `authorizationList?`: `undefined`; `blobs`: readonly `` `0x${(...)}` ``[] \| readonly `ByteArray`[]; `blobVersionedHashes?`: readonly `` `0x${(...)}` ``[]; `data?`: `` `0x${string}` ``; `feeCurrency?`: `` `0x${string}` ``; `from?`: `` `0x${string}` ``; `gas?`: `` `0x${string}` ``; `gasPrice?`: `undefined`; `kzg?`: `Kzg`; `maxFeePerBlobGas`: `` `0x${string}` ``; `maxFeePerGas?`: `` `0x${string}` ``; `maxPriorityFeePerGas?`: `` `0x${string}` ``; `nonce?`: `` `0x${string}` ``; `sidecars?`: readonly `BlobSidecar`\<...\>[]; `to`: `null` \| `` `0x${string}` ``; `type?`: `"0x3"`; `value?`: `` `0x${string}` ``; \} \| \{ `accessList?`: `AccessList`; `authorizationList?`: `RpcAuthorizationList`; `blobs?`: `undefined`; `blobVersionedHashes?`: `undefined`; `data?`: `` `0x${string}` ``; `feeCurrency?`: `` `0x${string}` ``; `from?`: `` `0x${string}` ``; `gas?`: `` `0x${string}` ``; `gasPrice?`: `undefined`; `kzg?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `` `0x${string}` ``; `maxPriorityFeePerGas?`: `` `0x${string}` ``; `nonce?`: `` `0x${string}` ``; `sidecars?`: `undefined`; `to?`: `null` \| `` `0x${string}` ``; `type?`: `"0x4"`; `value?`: `` `0x${string}` ``; \} \| \{ `accessList?`: `AccessList`; `authorizationList?`: `undefined`; `blobs?`: `undefined`; `blobVersionedHashes?`: `undefined`; `data?`: `` `0x${string}` ``; `feeCurrency?`: `` `0x${string}` ``; `from?`: `` `0x${string}` ``; `gas?`: `` `0x${string}` ``; `gasPrice?`: `undefined`; `kzg?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `` `0x${string}` ``; `maxPriorityFeePerGas?`: `` `0x${string}` ``; `nonce?`: `` `0x${string}` ``; `sidecars?`: `undefined`; `to?`: `null` \| `` `0x${string}` ``; `type?`: `"0x7b"`; `value?`: `` `0x${string}` ``; \}; `type`: `"transactionRequest"`; \}; \}\>

#### 42220.formatters

> **formatters**: `object`

#### 42220.formatters.block

> `readonly` **block**: `object`

#### 42220.formatters.block.exclude

> **exclude**: `undefined` \| \[\]

#### 42220.formatters.block.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`CeloRpcBlock`\<`BlockTag`, `boolean`\>

##### Returns

`object`

###### baseFeePerGas

> **baseFeePerGas**: `null` \| `bigint`

###### blobGasUsed

> **blobGasUsed**: `bigint`

###### difficulty

> **difficulty**: `bigint`

###### excessBlobGas

> **excessBlobGas**: `bigint`

###### extraData

> **extraData**: `` `0x${string}` ``

###### gasLimit

> **gasLimit**: `bigint`

###### gasUsed

> **gasUsed**: `bigint`

###### hash

> **hash**: `null` \| `` `0x${string}` ``

###### logsBloom

> **logsBloom**: `null` \| `` `0x${string}` ``

###### miner

> **miner**: `` `0x${string}` ``

###### mixHash

> **mixHash**: `` `0x${string}` ``

###### nonce

> **nonce**: `null` \| `` `0x${string}` ``

###### number

> **number**: `null` \| `bigint`

###### parentBeaconBlockRoot?

> `optional` **parentBeaconBlockRoot**: `` `0x${string}` ``

###### parentHash

> **parentHash**: `` `0x${string}` ``

###### receiptsRoot

> **receiptsRoot**: `` `0x${string}` ``

###### sealFields

> **sealFields**: `` `0x${string}` ``[]

###### sha3Uncles

> **sha3Uncles**: `` `0x${string}` ``

###### size

> **size**: `bigint`

###### stateRoot

> **stateRoot**: `` `0x${string}` ``

###### timestamp

> **timestamp**: `bigint`

###### totalDifficulty

> **totalDifficulty**: `null` \| `bigint`

###### transactions

> **transactions**: `` `0x${string}` ``[] \| `CeloTransaction`\<`boolean`\>[]

###### transactionsRoot

> **transactionsRoot**: `` `0x${string}` ``

###### uncles

> **uncles**: `` `0x${string}` ``[]

###### withdrawals?

> `optional` **withdrawals**: `Withdrawal`[]

###### withdrawalsRoot?

> `optional` **withdrawalsRoot**: `` `0x${string}` ``

#### 42220.formatters.block.type

> **type**: `"block"`

#### 42220.formatters.transaction

> `readonly` **transaction**: `object`

#### 42220.formatters.transaction.exclude

> **exclude**: `undefined` \| \[\]

#### 42220.formatters.transaction.format()

> **format**: (`args`) => \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `feeCurrency`: `null` \| `` `0x${string}` ``; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `gatewayFee?`: `undefined`; `gatewayFeeRecipient?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `feeCurrency`: `null` \| `` `0x${string}` ``; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `gatewayFee?`: `undefined`; `gatewayFeeRecipient?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `feeCurrency`: `null` \| `` `0x${string}` ``; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `gatewayFee?`: `undefined`; `gatewayFeeRecipient?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `feeCurrency`: `null` \| `` `0x${string}` ``; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `gatewayFee?`: `undefined`; `gatewayFeeRecipient?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `feeCurrency`: `null` \| `` `0x${string}` ``; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `gatewayFee?`: `undefined`; `gatewayFeeRecipient?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `feeCurrency`: `null` \| `` `0x${string}` ``; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `gatewayFee`: `null` \| `bigint`; `gatewayFeeRecipient`: `null` \| `` `0x${string}` ``; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"cip42"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `feeCurrency`: `null` \| `` `0x${string}` ``; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `gatewayFee?`: `undefined`; `gatewayFeeRecipient?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"cip64"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `undefined`; `feeCurrency?`: `undefined`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `gatewayFee?`: `undefined`; `gatewayFeeRecipient?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

##### Parameters

###### args

`CeloRpcTransaction`\<`boolean`\>

##### Returns

\{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `feeCurrency`: `null` \| `` `0x${string}` ``; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `gatewayFee?`: `undefined`; `gatewayFeeRecipient?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `feeCurrency`: `null` \| `` `0x${string}` ``; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `gatewayFee?`: `undefined`; `gatewayFeeRecipient?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `feeCurrency`: `null` \| `` `0x${string}` ``; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `gatewayFee?`: `undefined`; `gatewayFeeRecipient?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `feeCurrency`: `null` \| `` `0x${string}` ``; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `gatewayFee?`: `undefined`; `gatewayFeeRecipient?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `feeCurrency`: `null` \| `` `0x${string}` ``; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `gatewayFee?`: `undefined`; `gatewayFeeRecipient?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `feeCurrency`: `null` \| `` `0x${string}` ``; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `gatewayFee`: `null` \| `bigint`; `gatewayFeeRecipient`: `null` \| `` `0x${string}` ``; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"cip42"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `feeCurrency`: `null` \| `` `0x${string}` ``; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `gatewayFee?`: `undefined`; `gatewayFeeRecipient?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"cip64"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `undefined`; `feeCurrency?`: `undefined`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `gatewayFee?`: `undefined`; `gatewayFeeRecipient?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

#### 42220.formatters.transaction.type

> **type**: `"transaction"`

#### 42220.formatters.transactionRequest

> `readonly` **transactionRequest**: `object`

#### 42220.formatters.transactionRequest.exclude

> **exclude**: `undefined` \| \[\]

#### 42220.formatters.transactionRequest.format()

> **format**: (`args`) => \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobs?`: `undefined`; `blobVersionedHashes?`: `undefined`; `data?`: `` `0x${string}` ``; `feeCurrency?`: `` `0x${string}` ``; `from?`: `` `0x${string}` ``; `gas?`: `` `0x${string}` ``; `gasPrice?`: `` `0x${string}` ``; `kzg?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `nonce?`: `` `0x${string}` ``; `sidecars?`: `undefined`; `to?`: `null` \| `` `0x${string}` ``; `type?`: `"0x0"`; `value?`: `` `0x${string}` ``; \} \| \{ `accessList?`: `AccessList`; `authorizationList?`: `undefined`; `blobs?`: `undefined`; `blobVersionedHashes?`: `undefined`; `data?`: `` `0x${string}` ``; `feeCurrency?`: `` `0x${string}` ``; `from?`: `` `0x${string}` ``; `gas?`: `` `0x${string}` ``; `gasPrice?`: `` `0x${string}` ``; `kzg?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `nonce?`: `` `0x${string}` ``; `sidecars?`: `undefined`; `to?`: `null` \| `` `0x${string}` ``; `type?`: `"0x1"`; `value?`: `` `0x${string}` ``; \} \| \{ `accessList?`: `AccessList`; `authorizationList?`: `undefined`; `blobs?`: `undefined`; `blobVersionedHashes?`: `undefined`; `data?`: `` `0x${string}` ``; `feeCurrency?`: `` `0x${string}` ``; `from?`: `` `0x${string}` ``; `gas?`: `` `0x${string}` ``; `gasPrice?`: `undefined`; `kzg?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `` `0x${string}` ``; `maxPriorityFeePerGas?`: `` `0x${string}` ``; `nonce?`: `` `0x${string}` ``; `sidecars?`: `undefined`; `to?`: `null` \| `` `0x${string}` ``; `type?`: `"0x2"`; `value?`: `` `0x${string}` ``; \} \| \{ `accessList?`: `AccessList`; `authorizationList?`: `undefined`; `blobs`: readonly `` `0x${string}` ``[] \| readonly `ByteArray`[]; `blobVersionedHashes?`: readonly `` `0x${string}` ``[]; `data?`: `` `0x${string}` ``; `feeCurrency?`: `` `0x${string}` ``; `from?`: `` `0x${string}` ``; `gas?`: `` `0x${string}` ``; `gasPrice?`: `undefined`; `kzg?`: `Kzg`; `maxFeePerBlobGas`: `` `0x${string}` ``; `maxFeePerGas?`: `` `0x${string}` ``; `maxPriorityFeePerGas?`: `` `0x${string}` ``; `nonce?`: `` `0x${string}` ``; `sidecars?`: readonly `BlobSidecar`\<`` `0x${(...)}` ``\>[]; `to`: `null` \| `` `0x${string}` ``; `type?`: `"0x3"`; `value?`: `` `0x${string}` ``; \} \| \{ `accessList?`: `AccessList`; `authorizationList?`: `RpcAuthorizationList`; `blobs?`: `undefined`; `blobVersionedHashes?`: `undefined`; `data?`: `` `0x${string}` ``; `feeCurrency?`: `` `0x${string}` ``; `from?`: `` `0x${string}` ``; `gas?`: `` `0x${string}` ``; `gasPrice?`: `undefined`; `kzg?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `` `0x${string}` ``; `maxPriorityFeePerGas?`: `` `0x${string}` ``; `nonce?`: `` `0x${string}` ``; `sidecars?`: `undefined`; `to?`: `null` \| `` `0x${string}` ``; `type?`: `"0x4"`; `value?`: `` `0x${string}` ``; \} \| \{ `accessList?`: `AccessList`; `authorizationList?`: `undefined`; `blobs?`: `undefined`; `blobVersionedHashes?`: `undefined`; `data?`: `` `0x${string}` ``; `feeCurrency?`: `` `0x${string}` ``; `from?`: `` `0x${string}` ``; `gas?`: `` `0x${string}` ``; `gasPrice?`: `undefined`; `kzg?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `` `0x${string}` ``; `maxPriorityFeePerGas?`: `` `0x${string}` ``; `nonce?`: `` `0x${string}` ``; `sidecars?`: `undefined`; `to?`: `null` \| `` `0x${string}` ``; `type?`: `"0x7b"`; `value?`: `` `0x${string}` ``; \}

##### Parameters

###### args

`CeloTransactionRequest`

##### Returns

\{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobs?`: `undefined`; `blobVersionedHashes?`: `undefined`; `data?`: `` `0x${string}` ``; `feeCurrency?`: `` `0x${string}` ``; `from?`: `` `0x${string}` ``; `gas?`: `` `0x${string}` ``; `gasPrice?`: `` `0x${string}` ``; `kzg?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `nonce?`: `` `0x${string}` ``; `sidecars?`: `undefined`; `to?`: `null` \| `` `0x${string}` ``; `type?`: `"0x0"`; `value?`: `` `0x${string}` ``; \} \| \{ `accessList?`: `AccessList`; `authorizationList?`: `undefined`; `blobs?`: `undefined`; `blobVersionedHashes?`: `undefined`; `data?`: `` `0x${string}` ``; `feeCurrency?`: `` `0x${string}` ``; `from?`: `` `0x${string}` ``; `gas?`: `` `0x${string}` ``; `gasPrice?`: `` `0x${string}` ``; `kzg?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `nonce?`: `` `0x${string}` ``; `sidecars?`: `undefined`; `to?`: `null` \| `` `0x${string}` ``; `type?`: `"0x1"`; `value?`: `` `0x${string}` ``; \} \| \{ `accessList?`: `AccessList`; `authorizationList?`: `undefined`; `blobs?`: `undefined`; `blobVersionedHashes?`: `undefined`; `data?`: `` `0x${string}` ``; `feeCurrency?`: `` `0x${string}` ``; `from?`: `` `0x${string}` ``; `gas?`: `` `0x${string}` ``; `gasPrice?`: `undefined`; `kzg?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `` `0x${string}` ``; `maxPriorityFeePerGas?`: `` `0x${string}` ``; `nonce?`: `` `0x${string}` ``; `sidecars?`: `undefined`; `to?`: `null` \| `` `0x${string}` ``; `type?`: `"0x2"`; `value?`: `` `0x${string}` ``; \} \| \{ `accessList?`: `AccessList`; `authorizationList?`: `undefined`; `blobs`: readonly `` `0x${string}` ``[] \| readonly `ByteArray`[]; `blobVersionedHashes?`: readonly `` `0x${string}` ``[]; `data?`: `` `0x${string}` ``; `feeCurrency?`: `` `0x${string}` ``; `from?`: `` `0x${string}` ``; `gas?`: `` `0x${string}` ``; `gasPrice?`: `undefined`; `kzg?`: `Kzg`; `maxFeePerBlobGas`: `` `0x${string}` ``; `maxFeePerGas?`: `` `0x${string}` ``; `maxPriorityFeePerGas?`: `` `0x${string}` ``; `nonce?`: `` `0x${string}` ``; `sidecars?`: readonly `BlobSidecar`\<`` `0x${(...)}` ``\>[]; `to`: `null` \| `` `0x${string}` ``; `type?`: `"0x3"`; `value?`: `` `0x${string}` ``; \} \| \{ `accessList?`: `AccessList`; `authorizationList?`: `RpcAuthorizationList`; `blobs?`: `undefined`; `blobVersionedHashes?`: `undefined`; `data?`: `` `0x${string}` ``; `feeCurrency?`: `` `0x${string}` ``; `from?`: `` `0x${string}` ``; `gas?`: `` `0x${string}` ``; `gasPrice?`: `undefined`; `kzg?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `` `0x${string}` ``; `maxPriorityFeePerGas?`: `` `0x${string}` ``; `nonce?`: `` `0x${string}` ``; `sidecars?`: `undefined`; `to?`: `null` \| `` `0x${string}` ``; `type?`: `"0x4"`; `value?`: `` `0x${string}` ``; \} \| \{ `accessList?`: `AccessList`; `authorizationList?`: `undefined`; `blobs?`: `undefined`; `blobVersionedHashes?`: `undefined`; `data?`: `` `0x${string}` ``; `feeCurrency?`: `` `0x${string}` ``; `from?`: `` `0x${string}` ``; `gas?`: `` `0x${string}` ``; `gasPrice?`: `undefined`; `kzg?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `` `0x${string}` ``; `maxPriorityFeePerGas?`: `` `0x${string}` ``; `nonce?`: `` `0x${string}` ``; `sidecars?`: `undefined`; `to?`: `null` \| `` `0x${string}` ``; `type?`: `"0x7b"`; `value?`: `` `0x${string}` ``; \}

#### 42220.formatters.transactionRequest.type

> **type**: `"transactionRequest"`

#### 42220.id

> **id**: `42220`

#### 42220.name

> **name**: `"Celo"`

#### 42220.nativeCurrency

> **nativeCurrency**: `object`

#### 42220.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 42220.nativeCurrency.name

> `readonly` **name**: `"CELO"`

#### 42220.nativeCurrency.symbol

> `readonly` **symbol**: `"CELO"`

#### 42220.rpcUrls

> **rpcUrls**: `object`

#### 42220.rpcUrls.default

> `readonly` **default**: `object`

#### 42220.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://forno.celo.org"`\]

#### 42220.serializers

> **serializers**: `object`

#### 42220.serializers.transaction()

> `readonly` **transaction**: (`transaction`, `signature?`) => `` `0x02${string}` `` \| `` `0x01${string}` `` \| `` `0x03${string}` `` \| `` `0x04${string}` `` \| `TransactionSerializedLegacy` \| `` `0x7e${string}` `` \| `` `0x7b${string}` ``

##### Parameters

###### transaction

`CeloTransactionSerializable`

###### signature?

`Signature`

##### Returns

`` `0x02${string}` `` \| `` `0x01${string}` `` \| `` `0x03${string}` `` \| `` `0x04${string}` `` \| `TransactionSerializedLegacy` \| `` `0x7e${string}` `` \| `` `0x7b${string}` ``

#### 42220.sourceId?

> `optional` **sourceId**: `number`

#### 42220.testnet

> **testnet**: `false`

### 424

> **424**: `object` = `chains.pgn`

#### 424.blockExplorers

> **blockExplorers**: `object`

#### 424.blockExplorers.default

> `readonly` **default**: `object`

#### 424.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://explorer.publicgoods.network/api"`

#### 424.blockExplorers.default.name

> `readonly` **name**: `"PGN Explorer"`

#### 424.blockExplorers.default.url

> `readonly` **url**: `"https://explorer.publicgoods.network"`

#### 424.contracts

> **contracts**: `object`

#### 424.contracts.l1StandardBridge

> `readonly` **l1StandardBridge**: `object`

#### 424.contracts.l1StandardBridge.1

> `readonly` **1**: `object`

#### 424.contracts.l1StandardBridge.1.address

> `readonly` **address**: `"0xD0204B9527C1bA7bD765Fa5CCD9355d38338272b"`

#### 424.contracts.l2OutputOracle

> `readonly` **l2OutputOracle**: `object`

#### 424.contracts.l2OutputOracle.1

> `readonly` **1**: `object`

#### 424.contracts.l2OutputOracle.1.address

> `readonly` **address**: `"0x9E6204F750cD866b299594e2aC9eA824E2e5f95c"`

#### 424.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 424.contracts.multicall3.address

> `readonly` **address**: `"0xcA11bde05977b3631167028862bE2a173976CA11"`

#### 424.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `3380209`

#### 424.contracts.portal

> `readonly` **portal**: `object`

#### 424.contracts.portal.1

> `readonly` **1**: `object`

#### 424.contracts.portal.1.address

> `readonly` **address**: `"0xb26Fd985c5959bBB382BAFdD0b879E149e48116c"`

#### 424.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 424.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 424.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 424.formatters

> **formatters**: `object`

#### 424.formatters.block

> `readonly` **block**: `object`

#### 424.formatters.block.exclude

> **exclude**: `undefined` \| \[\]

#### 424.formatters.block.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`OpStackRpcBlock`\<`BlockTag`, `boolean`\>

##### Returns

`object`

###### baseFeePerGas

> **baseFeePerGas**: `null` \| `bigint`

###### blobGasUsed

> **blobGasUsed**: `bigint`

###### difficulty

> **difficulty**: `bigint`

###### excessBlobGas

> **excessBlobGas**: `bigint`

###### extraData

> **extraData**: `` `0x${string}` ``

###### gasLimit

> **gasLimit**: `bigint`

###### gasUsed

> **gasUsed**: `bigint`

###### hash

> **hash**: `null` \| `` `0x${string}` ``

###### logsBloom

> **logsBloom**: `null` \| `` `0x${string}` ``

###### miner

> **miner**: `` `0x${string}` ``

###### mixHash

> **mixHash**: `` `0x${string}` ``

###### nonce

> **nonce**: `null` \| `` `0x${string}` ``

###### number

> **number**: `null` \| `bigint`

###### parentBeaconBlockRoot?

> `optional` **parentBeaconBlockRoot**: `` `0x${string}` ``

###### parentHash

> **parentHash**: `` `0x${string}` ``

###### receiptsRoot

> **receiptsRoot**: `` `0x${string}` ``

###### sealFields

> **sealFields**: `` `0x${string}` ``[]

###### sha3Uncles

> **sha3Uncles**: `` `0x${string}` ``

###### size

> **size**: `bigint`

###### stateRoot

> **stateRoot**: `` `0x${string}` ``

###### timestamp

> **timestamp**: `bigint`

###### totalDifficulty

> **totalDifficulty**: `null` \| `bigint`

###### transactions

> **transactions**: `` `0x${string}` ``[] \| `OpStackTransaction`\<`boolean`\>[]

###### transactionsRoot

> **transactionsRoot**: `` `0x${string}` ``

###### uncles

> **uncles**: `` `0x${string}` ``[]

###### withdrawals?

> `optional` **withdrawals**: `Withdrawal`[]

###### withdrawalsRoot?

> `optional` **withdrawalsRoot**: `` `0x${string}` ``

#### 424.formatters.block.type

> **type**: `"block"`

#### 424.formatters.transaction

> `readonly` **transaction**: `object`

#### 424.formatters.transaction.exclude

> **exclude**: `undefined` \| \[\]

#### 424.formatters.transaction.format()

> **format**: (`args`) => \{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

##### Parameters

###### args

`OpStackRpcTransaction`\<`boolean`\>

##### Returns

\{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

#### 424.formatters.transaction.type

> **type**: `"transaction"`

#### 424.formatters.transactionReceipt

> `readonly` **transactionReceipt**: `object`

#### 424.formatters.transactionReceipt.exclude

> **exclude**: `undefined` \| \[\]

#### 424.formatters.transactionReceipt.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`OpStackRpcTransactionReceipt`

##### Returns

`object`

###### blobGasPrice?

> `optional` **blobGasPrice**: `bigint`

###### blobGasUsed?

> `optional` **blobGasUsed**: `bigint`

###### blockHash

> **blockHash**: `` `0x${string}` ``

###### blockNumber

> **blockNumber**: `bigint`

###### contractAddress

> **contractAddress**: `undefined` \| `null` \| `` `0x${string}` ``

###### cumulativeGasUsed

> **cumulativeGasUsed**: `bigint`

###### effectiveGasPrice

> **effectiveGasPrice**: `bigint`

###### from

> **from**: `` `0x${string}` ``

###### gasUsed

> **gasUsed**: `bigint`

###### l1Fee

> **l1Fee**: `null` \| `bigint`

###### l1FeeScalar

> **l1FeeScalar**: `null` \| `number`

###### l1GasPrice

> **l1GasPrice**: `null` \| `bigint`

###### l1GasUsed

> **l1GasUsed**: `null` \| `bigint`

###### logs

> **logs**: `Log`\<`bigint`, `number`, `false`, `undefined`, `undefined`, `undefined`, `undefined`\>[]

###### logsBloom

> **logsBloom**: `` `0x${string}` ``

###### root?

> `optional` **root**: `` `0x${string}` ``

###### status

> **status**: `"success"` \| `"reverted"`

###### to

> **to**: `null` \| `` `0x${string}` ``

###### transactionHash

> **transactionHash**: `` `0x${string}` ``

###### transactionIndex

> **transactionIndex**: `number`

###### type

> **type**: `TransactionType`

#### 424.formatters.transactionReceipt.type

> **type**: `"transactionReceipt"`

#### 424.id

> **id**: `424`

#### 424.name

> **name**: `"PGN"`

#### 424.nativeCurrency

> **nativeCurrency**: `object`

#### 424.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 424.nativeCurrency.name

> `readonly` **name**: `"Ether"`

#### 424.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 424.network

> `readonly` **network**: `"pgn"`

#### 424.rpcUrls

> **rpcUrls**: `object`

#### 424.rpcUrls.default

> `readonly` **default**: `object`

#### 424.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.publicgoods.network"`\]

#### 424.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 424.sourceId

> **sourceId**: `1`

#### 424.testnet?

> `optional` **testnet**: `boolean`

### 4242

> **4242**: `object` = `chains.nexi`

#### 4242.blockExplorers

> **blockExplorers**: `object`

#### 4242.blockExplorers.default

> `readonly` **default**: `object`

#### 4242.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://www.nexiscan.com/api"`

#### 4242.blockExplorers.default.name

> `readonly` **name**: `"NexiScan"`

#### 4242.blockExplorers.default.url

> `readonly` **url**: `"https://www.nexiscan.com"`

#### 4242.contracts

> **contracts**: `object`

#### 4242.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 4242.contracts.multicall3.address

> `readonly` **address**: `"0x0277A46Cc69A57eE3A6C8c158bA874832F718B8E"`

#### 4242.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `25770160`

#### 4242.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 4242.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 4242.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 4242.formatters?

> `optional` **formatters**: `undefined`

#### 4242.id

> **id**: `4242`

#### 4242.name

> **name**: `"Nexi"`

#### 4242.nativeCurrency

> **nativeCurrency**: `object`

#### 4242.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 4242.nativeCurrency.name

> `readonly` **name**: `"Nexi"`

#### 4242.nativeCurrency.symbol

> `readonly` **symbol**: `"NEXI"`

#### 4242.rpcUrls

> **rpcUrls**: `object`

#### 4242.rpcUrls.default

> `readonly` **default**: `object`

#### 4242.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.chain.nexi.technology"`\]

#### 4242.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 4242.sourceId?

> `optional` **sourceId**: `number`

#### 4242.testnet?

> `optional` **testnet**: `boolean`

### 42766

> **42766**: `object` = `chains.zkFair`

#### 42766.blockExplorers

> **blockExplorers**: `object`

#### 42766.blockExplorers.default

> `readonly` **default**: `object`

#### 42766.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://scan.zkfair.io/api"`

#### 42766.blockExplorers.default.name

> `readonly` **name**: `"zkFair Explorer"`

#### 42766.blockExplorers.default.url

> `readonly` **url**: `"https://scan.zkfair.io"`

#### 42766.contracts

> **contracts**: `object`

#### 42766.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 42766.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 42766.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `6090959`

#### 42766.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 42766.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 42766.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 42766.formatters?

> `optional` **formatters**: `undefined`

#### 42766.id

> **id**: `42766`

#### 42766.name

> **name**: `"ZKFair Mainnet"`

#### 42766.nativeCurrency

> **nativeCurrency**: `object`

#### 42766.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 42766.nativeCurrency.name

> `readonly` **name**: `"USD Coin"`

#### 42766.nativeCurrency.symbol

> `readonly` **symbol**: `"USDC"`

#### 42766.network

> `readonly` **network**: `"zkfair-mainnet"`

#### 42766.rpcUrls

> **rpcUrls**: `object`

#### 42766.rpcUrls.default

> `readonly` **default**: `object`

#### 42766.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.zkfair.io"`\]

#### 42766.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 42766.sourceId?

> `optional` **sourceId**: `number`

#### 42766.testnet

> **testnet**: `false`

### 42793

> **42793**: `object` = `chains.etherlink`

#### 42793.blockExplorers

> **blockExplorers**: `object`

#### 42793.blockExplorers.default

> `readonly` **default**: `object`

#### 42793.blockExplorers.default.name

> `readonly` **name**: `"Etherlink"`

#### 42793.blockExplorers.default.url

> `readonly` **url**: `"https://explorer.etherlink.com"`

#### 42793.contracts

> **contracts**: `object`

#### 42793.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 42793.contracts.multicall3.address

> `readonly` **address**: `"0xcA11bde05977b3631167028862bE2a173976CA11"`

#### 42793.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `33899`

#### 42793.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 42793.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 42793.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 42793.formatters?

> `optional` **formatters**: `undefined`

#### 42793.id

> **id**: `42793`

#### 42793.name

> **name**: `"Etherlink"`

#### 42793.nativeCurrency

> **nativeCurrency**: `object`

#### 42793.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 42793.nativeCurrency.name

> `readonly` **name**: `"Tez"`

#### 42793.nativeCurrency.symbol

> `readonly` **symbol**: `"XTZ"`

#### 42793.rpcUrls

> **rpcUrls**: `object`

#### 42793.rpcUrls.default

> `readonly` **default**: `object`

#### 42793.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://node.mainnet.etherlink.com"`\]

#### 42793.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 42793.sourceId?

> `optional` **sourceId**: `number`

#### 42793.testnet?

> `optional` **testnet**: `boolean`

### 43114

> **43114**: `object` = `chains.avalanche`

#### 43114.blockExplorers

> **blockExplorers**: `object`

#### 43114.blockExplorers.default

> `readonly` **default**: `object`

#### 43114.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://api.snowtrace.io"`

#### 43114.blockExplorers.default.name

> `readonly` **name**: `"SnowTrace"`

#### 43114.blockExplorers.default.url

> `readonly` **url**: `"https://snowtrace.io"`

#### 43114.contracts

> **contracts**: `object`

#### 43114.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 43114.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 43114.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `11907934`

#### 43114.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 43114.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 43114.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 43114.formatters?

> `optional` **formatters**: `undefined`

#### 43114.id

> **id**: `43114`

#### 43114.name

> **name**: `"Avalanche"`

#### 43114.nativeCurrency

> **nativeCurrency**: `object`

#### 43114.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 43114.nativeCurrency.name

> `readonly` **name**: `"Avalanche"`

#### 43114.nativeCurrency.symbol

> `readonly` **symbol**: `"AVAX"`

#### 43114.rpcUrls

> **rpcUrls**: `object`

#### 43114.rpcUrls.default

> `readonly` **default**: `object`

#### 43114.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://api.avax.network/ext/bc/C/rpc"`\]

#### 43114.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 43114.sourceId?

> `optional` **sourceId**: `number`

#### 43114.testnet?

> `optional` **testnet**: `boolean`

### 4337

> **4337**: `object` = `chains.beam`

#### 4337.blockExplorers

> **blockExplorers**: `object`

#### 4337.blockExplorers.default

> `readonly` **default**: `object`

#### 4337.blockExplorers.default.name

> `readonly` **name**: `"Beam Explorer"`

#### 4337.blockExplorers.default.url

> `readonly` **url**: `"https://subnets.avax.network/beam"`

#### 4337.contracts

> **contracts**: `object`

#### 4337.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 4337.contracts.multicall3.address

> `readonly` **address**: `"0x4956f15efdc3dc16645e90cc356eafa65ffc65ec"`

#### 4337.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `1`

#### 4337.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 4337.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 4337.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 4337.formatters?

> `optional` **formatters**: `undefined`

#### 4337.id

> **id**: `4337`

#### 4337.name

> **name**: `"Beam"`

#### 4337.nativeCurrency

> **nativeCurrency**: `object`

#### 4337.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 4337.nativeCurrency.name

> `readonly` **name**: `"Beam"`

#### 4337.nativeCurrency.symbol

> `readonly` **symbol**: `"BEAM"`

#### 4337.network

> `readonly` **network**: `"beam"`

#### 4337.rpcUrls

> **rpcUrls**: `object`

#### 4337.rpcUrls.default

> `readonly` **default**: `object`

#### 4337.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://build.onbeam.com/rpc"`\]

#### 4337.rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly \[`"wss://build.onbeam.com/ws"`\]

#### 4337.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 4337.sourceId?

> `optional` **sourceId**: `number`

#### 4337.testnet?

> `optional` **testnet**: `boolean`

### 44

> **44**: `object` = `chains.crab`

#### 44.blockExplorers

> **blockExplorers**: `object`

#### 44.blockExplorers.default

> `readonly` **default**: `object`

#### 44.blockExplorers.default.name

> `readonly` **name**: `"Blockscout"`

#### 44.blockExplorers.default.url

> `readonly` **url**: `"https://crab-scan.darwinia.network"`

#### 44.contracts

> **contracts**: `object`

#### 44.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 44.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 44.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `3032593`

#### 44.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 44.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 44.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 44.formatters?

> `optional` **formatters**: `undefined`

#### 44.id

> **id**: `44`

#### 44.name

> **name**: `"Crab Network"`

#### 44.nativeCurrency

> **nativeCurrency**: `object`

#### 44.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 44.nativeCurrency.name

> `readonly` **name**: `"Crab Network Native Token"`

#### 44.nativeCurrency.symbol

> `readonly` **symbol**: `"CRAB"`

#### 44.rpcUrls

> **rpcUrls**: `object`

#### 44.rpcUrls.default

> `readonly` **default**: `object`

#### 44.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://crab-rpc.darwinia.network"`\]

#### 44.rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly \[`"wss://crab-rpc.darwinia.network"`\]

#### 44.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 44.sourceId?

> `optional` **sourceId**: `number`

#### 44.testnet?

> `optional` **testnet**: `boolean`

### 46

> **46**: `object` = `chains.darwinia`

#### 46.blockExplorers

> **blockExplorers**: `object`

#### 46.blockExplorers.default

> `readonly` **default**: `object`

#### 46.blockExplorers.default.name

> `readonly` **name**: `"Explorer"`

#### 46.blockExplorers.default.url

> `readonly` **url**: `"https://explorer.darwinia.network"`

#### 46.contracts

> **contracts**: `object`

#### 46.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 46.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 46.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `69420`

#### 46.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 46.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 46.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 46.formatters?

> `optional` **formatters**: `undefined`

#### 46.id

> **id**: `46`

#### 46.name

> **name**: `"Darwinia Network"`

#### 46.nativeCurrency

> **nativeCurrency**: `object`

#### 46.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 46.nativeCurrency.name

> `readonly` **name**: `"RING"`

#### 46.nativeCurrency.symbol

> `readonly` **symbol**: `"RING"`

#### 46.rpcUrls

> **rpcUrls**: `object`

#### 46.rpcUrls.default

> `readonly` **default**: `object`

#### 46.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.darwinia.network"`\]

#### 46.rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly \[`"wss://rpc.darwinia.network"`\]

#### 46.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 46.sourceId?

> `optional` **sourceId**: `number`

#### 46.testnet?

> `optional` **testnet**: `boolean`

### 463

> **463**: `object` = `chains.areonNetwork`

#### 463.blockExplorers

> **blockExplorers**: `object`

#### 463.blockExplorers.default

> `readonly` **default**: `object`

#### 463.blockExplorers.default.name

> `readonly` **name**: `"Areonscan"`

#### 463.blockExplorers.default.url

> `readonly` **url**: `"https://areonscan.com"`

#### 463.contracts

> **contracts**: `object`

#### 463.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 463.contracts.multicall3.address

> `readonly` **address**: `"0xcA11bde05977b3631167028862bE2a173976CA11"`

#### 463.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `353286`

#### 463.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 463.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 463.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 463.formatters?

> `optional` **formatters**: `undefined`

#### 463.id

> **id**: `463`

#### 463.name

> **name**: `"Areon Network"`

#### 463.nativeCurrency

> **nativeCurrency**: `object`

#### 463.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 463.nativeCurrency.name

> `readonly` **name**: `"AREA"`

#### 463.nativeCurrency.symbol

> `readonly` **symbol**: `"AREA"`

#### 463.rpcUrls

> **rpcUrls**: `object`

#### 463.rpcUrls.default

> `readonly` **default**: `object`

#### 463.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://mainnet-rpc.areon.network"`\]

#### 463.rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly \[`"wss://mainnet-ws.areon.network"`\]

#### 463.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 463.sourceId?

> `optional` **sourceId**: `number`

#### 463.testnet

> **testnet**: `false`

### 4689

> **4689**: `object` = `chains.iotex`

#### 4689.blockExplorers

> **blockExplorers**: `object`

#### 4689.blockExplorers.default

> `readonly` **default**: `object`

#### 4689.blockExplorers.default.name

> `readonly` **name**: `"IoTeXScan"`

#### 4689.blockExplorers.default.url

> `readonly` **url**: `"https://iotexscan.io"`

#### 4689.contracts

> **contracts**: `object`

#### 4689.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 4689.contracts.multicall3.address

> `readonly` **address**: `"0xcA11bde05977b3631167028862bE2a173976CA11"`

#### 4689.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `22163670`

#### 4689.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 4689.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 4689.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 4689.formatters?

> `optional` **formatters**: `undefined`

#### 4689.id

> **id**: `4689`

#### 4689.name

> **name**: `"IoTeX"`

#### 4689.nativeCurrency

> **nativeCurrency**: `object`

#### 4689.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 4689.nativeCurrency.name

> `readonly` **name**: `"IoTeX"`

#### 4689.nativeCurrency.symbol

> `readonly` **symbol**: `"IOTX"`

#### 4689.rpcUrls

> **rpcUrls**: `object`

#### 4689.rpcUrls.default

> `readonly` **default**: `object`

#### 4689.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://babel-api.mainnet.iotex.io"`\]

#### 4689.rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly \[`"wss://babel-api.mainnet.iotex.io"`\]

#### 4689.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 4689.sourceId?

> `optional` **sourceId**: `number`

#### 4689.testnet?

> `optional` **testnet**: `boolean`

### 4759

> **4759**: `object` = `chains.mevTestnet`

#### 4759.blockExplorers

> **blockExplorers**: `object`

#### 4759.blockExplorers.default

> `readonly` **default**: `object`

#### 4759.blockExplorers.default.name

> `readonly` **name**: `"Explorer"`

#### 4759.blockExplorers.default.url

> `readonly` **url**: `"https://testnet.meversescan.io/"`

#### 4759.contracts

> **contracts**: `object`

#### 4759.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 4759.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 4759.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `64371115`

#### 4759.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 4759.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 4759.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 4759.formatters?

> `optional` **formatters**: `undefined`

#### 4759.id

> **id**: `4759`

#### 4759.name

> **name**: `"MEVerse Chain Testnet"`

#### 4759.nativeCurrency

> **nativeCurrency**: `object`

#### 4759.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 4759.nativeCurrency.name

> `readonly` **name**: `"MEVerse"`

#### 4759.nativeCurrency.symbol

> `readonly` **symbol**: `"MEV"`

#### 4759.rpcUrls

> **rpcUrls**: `object`

#### 4759.rpcUrls.default

> `readonly` **default**: `object`

#### 4759.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.meversetestnet.io"`\]

#### 4759.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 4759.sourceId?

> `optional` **sourceId**: `number`

#### 4759.testnet

> **testnet**: `true`

### 4777

> **4777**: `object` = `chains.bxnTestnet`

#### 4777.blockExplorers

> **blockExplorers**: `object`

#### 4777.blockExplorers.default

> `readonly` **default**: `object`

#### 4777.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://testnet-explorer.blackfort.network/api"`

#### 4777.blockExplorers.default.name

> `readonly` **name**: `"Blockscout"`

#### 4777.blockExplorers.default.url

> `readonly` **url**: `"https://testnet-explorer.blackfort.network"`

#### 4777.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 4777.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 4777.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 4777.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 4777.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 4777.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 4777.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 4777.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 4777.formatters?

> `optional` **formatters**: `undefined`

#### 4777.id

> **id**: `4777`

#### 4777.name

> **name**: `"BlackFort Exchange Network Testnet"`

#### 4777.nativeCurrency

> **nativeCurrency**: `object`

#### 4777.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 4777.nativeCurrency.name

> `readonly` **name**: `"BlackFort Testnet Token"`

#### 4777.nativeCurrency.symbol

> `readonly` **symbol**: `"TBXN"`

#### 4777.rpcUrls

> **rpcUrls**: `object`

#### 4777.rpcUrls.default

> `readonly` **default**: `object`

#### 4777.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://testnet.blackfort.network/rpc"`\]

#### 4777.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 4777.sourceId?

> `optional` **sourceId**: `number`

#### 4777.testnet

> **testnet**: `true`

### 4999

> **4999**: `object` = `chains.bxn`

#### 4999.blockExplorers

> **blockExplorers**: `object`

#### 4999.blockExplorers.default

> `readonly` **default**: `object`

#### 4999.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://explorer.blackfort.network/api"`

#### 4999.blockExplorers.default.name

> `readonly` **name**: `"Blockscout"`

#### 4999.blockExplorers.default.url

> `readonly` **url**: `"https://explorer.blackfort.network"`

#### 4999.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 4999.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 4999.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 4999.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 4999.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 4999.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 4999.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 4999.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 4999.formatters?

> `optional` **formatters**: `undefined`

#### 4999.id

> **id**: `4999`

#### 4999.name

> **name**: `"BlackFort Exchange Network"`

#### 4999.nativeCurrency

> **nativeCurrency**: `object`

#### 4999.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 4999.nativeCurrency.name

> `readonly` **name**: `"BlackFort Token"`

#### 4999.nativeCurrency.symbol

> `readonly` **symbol**: `"BXN"`

#### 4999.rpcUrls

> **rpcUrls**: `object`

#### 4999.rpcUrls.default

> `readonly` **default**: `object`

#### 4999.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://mainnet.blackfort.network/rpc"`\]

#### 4999.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 4999.sourceId?

> `optional` **sourceId**: `number`

#### 4999.testnet?

> `optional` **testnet**: `boolean`

### 5

> **5**: `object` = `chains.goerli`

#### 5.blockExplorers

> **blockExplorers**: `object`

#### 5.blockExplorers.default

> `readonly` **default**: `object`

#### 5.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://api-goerli.etherscan.io/api"`

#### 5.blockExplorers.default.name

> `readonly` **name**: `"Etherscan"`

#### 5.blockExplorers.default.url

> `readonly` **url**: `"https://goerli.etherscan.io"`

#### 5.contracts

> **contracts**: `object`

#### 5.contracts.ensRegistry

> `readonly` **ensRegistry**: `object`

#### 5.contracts.ensRegistry.address

> `readonly` **address**: `"0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"`

#### 5.contracts.ensUniversalResolver

> `readonly` **ensUniversalResolver**: `object`

#### 5.contracts.ensUniversalResolver.address

> `readonly` **address**: `"0xfc4AC75C46C914aF5892d6d3eFFcebD7917293F1"`

#### 5.contracts.ensUniversalResolver.blockCreated

> `readonly` **blockCreated**: `10339206`

#### 5.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 5.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 5.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `6507670`

#### 5.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 5.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 5.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 5.formatters?

> `optional` **formatters**: `undefined`

#### 5.id

> **id**: `5`

#### 5.name

> **name**: `"Goerli"`

#### 5.nativeCurrency

> **nativeCurrency**: `object`

#### 5.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 5.nativeCurrency.name

> `readonly` **name**: `"Goerli Ether"`

#### 5.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 5.rpcUrls

> **rpcUrls**: `object`

#### 5.rpcUrls.default

> `readonly` **default**: `object`

#### 5.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://5.rpc.thirdweb.com"`\]

#### 5.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 5.sourceId?

> `optional` **sourceId**: `number`

#### 5.testnet

> **testnet**: `true`

### 50

> **50**: `object` = `chains.xdc`

#### 50.blockExplorers

> **blockExplorers**: `object`

#### 50.blockExplorers.default

> `readonly` **default**: `object`

#### 50.blockExplorers.default.name

> `readonly` **name**: `"XDCScan"`

#### 50.blockExplorers.default.url

> `readonly` **url**: `"https://xdcscan.com"`

#### 50.contracts

> **contracts**: `object`

#### 50.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 50.contracts.multicall3.address

> `readonly` **address**: `"0x0B1795ccA8E4eC4df02346a082df54D437F8D9aF"`

#### 50.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `75884020`

#### 50.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 50.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 50.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 50.formatters?

> `optional` **formatters**: `undefined`

#### 50.id

> **id**: `50`

#### 50.name

> **name**: `"XDC Network"`

#### 50.nativeCurrency

> **nativeCurrency**: `object`

#### 50.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 50.nativeCurrency.name

> `readonly` **name**: `"XDC"`

#### 50.nativeCurrency.symbol

> `readonly` **symbol**: `"XDC"`

#### 50.rpcUrls

> **rpcUrls**: `object`

#### 50.rpcUrls.default

> `readonly` **default**: `object`

#### 50.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.xdcrpc.com"`\]

#### 50.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 50.sourceId?

> `optional` **sourceId**: `number`

#### 50.testnet?

> `optional` **testnet**: `boolean`

### 5000

> **5000**: `object` = `chains.mantle`

#### 5000.blockExplorers

> **blockExplorers**: `object`

#### 5000.blockExplorers.default

> `readonly` **default**: `object`

#### 5000.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://api.mantlescan.xyz/api"`

#### 5000.blockExplorers.default.name

> `readonly` **name**: `"Mantle Explorer"`

#### 5000.blockExplorers.default.url

> `readonly` **url**: `"https://mantlescan.xyz/"`

#### 5000.contracts

> **contracts**: `object`

#### 5000.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 5000.contracts.multicall3.address

> `readonly` **address**: `"0xcA11bde05977b3631167028862bE2a173976CA11"`

#### 5000.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `304717`

#### 5000.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 5000.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 5000.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 5000.formatters?

> `optional` **formatters**: `undefined`

#### 5000.id

> **id**: `5000`

#### 5000.name

> **name**: `"Mantle"`

#### 5000.nativeCurrency

> **nativeCurrency**: `object`

#### 5000.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 5000.nativeCurrency.name

> `readonly` **name**: `"MNT"`

#### 5000.nativeCurrency.symbol

> `readonly` **symbol**: `"MNT"`

#### 5000.rpcUrls

> **rpcUrls**: `object`

#### 5000.rpcUrls.default

> `readonly` **default**: `object`

#### 5000.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.mantle.xyz"`\]

#### 5000.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 5000.sourceId?

> `optional` **sourceId**: `number`

#### 5000.testnet?

> `optional` **testnet**: `boolean`

### 50005

> **50005**: `object` = `chains.yooldoVerse`

#### 50005.blockExplorers

> **blockExplorers**: `object`

#### 50005.blockExplorers.default

> `readonly` **default**: `object`

#### 50005.blockExplorers.default.name

> `readonly` **name**: `"Yooldo Verse Explorer"`

#### 50005.blockExplorers.default.url

> `readonly` **url**: `"https://explorer.yooldo-verse.xyz"`

#### 50005.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 50005.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 50005.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 50005.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 50005.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 50005.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 50005.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 50005.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 50005.formatters?

> `optional` **formatters**: `undefined`

#### 50005.id

> **id**: `50005`

#### 50005.name

> **name**: `"Yooldo Verse"`

#### 50005.nativeCurrency

> **nativeCurrency**: `object`

#### 50005.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 50005.nativeCurrency.name

> `readonly` **name**: `"OAS"`

#### 50005.nativeCurrency.symbol

> `readonly` **symbol**: `"OAS"`

#### 50005.rpcUrls

> **rpcUrls**: `object`

#### 50005.rpcUrls.default

> `readonly` **default**: `object`

#### 50005.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.yooldo-verse.xyz"`\]

#### 50005.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 50005.sourceId?

> `optional` **sourceId**: `number`

#### 50005.testnet?

> `optional` **testnet**: `boolean`

### 51

> **51**: `object` = `chains.xdcTestnet`

#### 51.blockExplorers

> **blockExplorers**: `object`

#### 51.blockExplorers.default

> `readonly` **default**: `object`

#### 51.blockExplorers.default.name

> `readonly` **name**: `"XDCScan"`

#### 51.blockExplorers.default.url

> `readonly` **url**: `"https://testnet.xdcscan.com"`

#### 51.contracts

> **contracts**: `object`

#### 51.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 51.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 51.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `59765389`

#### 51.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 51.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 51.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 51.formatters?

> `optional` **formatters**: `undefined`

#### 51.id

> **id**: `51`

#### 51.name

> **name**: `"Apothem Network"`

#### 51.nativeCurrency

> **nativeCurrency**: `object`

#### 51.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 51.nativeCurrency.name

> `readonly` **name**: `"TXDC"`

#### 51.nativeCurrency.symbol

> `readonly` **symbol**: `"TXDC"`

#### 51.rpcUrls

> **rpcUrls**: `object`

#### 51.rpcUrls.default

> `readonly` **default**: `object`

#### 51.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://erpc.apothem.network"`\]

#### 51.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 51.sourceId?

> `optional` **sourceId**: `number`

#### 51.testnet?

> `optional` **testnet**: `boolean`

### 5112

> **5112**: `object` = `chains.ham`

#### 5112.blockExplorers

> **blockExplorers**: `object`

#### 5112.blockExplorers.default

> `readonly` **default**: `object`

#### 5112.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://explorer.ham.fun/api/v2"`

#### 5112.blockExplorers.default.name

> `readonly` **name**: `"Ham Chain Explorer"`

#### 5112.blockExplorers.default.url

> `readonly` **url**: `"https://explorer.ham.fun"`

#### 5112.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 5112.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 5112.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 5112.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 5112.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 5112.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 5112.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 5112.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 5112.formatters?

> `optional` **formatters**: `undefined`

#### 5112.id

> **id**: `5112`

#### 5112.name

> **name**: `"Ham"`

#### 5112.nativeCurrency

> **nativeCurrency**: `object`

#### 5112.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 5112.nativeCurrency.name

> `readonly` **name**: `"Ham"`

#### 5112.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 5112.rpcUrls

> **rpcUrls**: `object`

#### 5112.rpcUrls.default

> `readonly` **default**: `object`

#### 5112.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.ham.fun"`\]

#### 5112.rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly \[`"wss://rpc.ham.fun"`\]

#### 5112.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 5112.sourceId?

> `optional` **sourceId**: `number`

#### 5112.testnet?

> `optional` **testnet**: `boolean`

### 5165

> **5165**: `object` = `chains.bahamut`

#### 5165.blockExplorers

> **blockExplorers**: `object`

#### 5165.blockExplorers.default

> `readonly` **default**: `object`

#### 5165.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://www.ftnscan.com/api"`

#### 5165.blockExplorers.default.name

> `readonly` **name**: `"Ftnscan"`

#### 5165.blockExplorers.default.url

> `readonly` **url**: `"https://www.ftnscan.com"`

#### 5165.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 5165.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 5165.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 5165.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 5165.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 5165.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 5165.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 5165.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 5165.formatters?

> `optional` **formatters**: `undefined`

#### 5165.id

> **id**: `5165`

#### 5165.name

> **name**: `"Bahamut"`

#### 5165.nativeCurrency

> **nativeCurrency**: `object`

#### 5165.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 5165.nativeCurrency.name

> `readonly` **name**: `"Fasttoken"`

#### 5165.nativeCurrency.symbol

> `readonly` **symbol**: `"FTN"`

#### 5165.network

> `readonly` **network**: `"bahamut"`

#### 5165.rpcUrls

> **rpcUrls**: `object`

#### 5165.rpcUrls.default

> `readonly` **default**: `object`

#### 5165.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc1.bahamut.io"`, `"https://bahamut-rpc.publicnode.com"`, `"https://rpc2.bahamut.io"`\]

#### 5165.rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly \[`"wss://ws1.sahara.bahamutchain.com"`, `"wss://bahamut-rpc.publicnode.com"`, `"wss://ws2.sahara.bahamutchain.com"`\]

#### 5165.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 5165.sourceId?

> `optional` **sourceId**: `number`

#### 5165.testnet?

> `optional` **testnet**: `boolean`

### 534352

> **534352**: `object` = `chains.scroll`

#### 534352.blockExplorers

> **blockExplorers**: `object`

#### 534352.blockExplorers.default

> `readonly` **default**: `object`

#### 534352.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://api.scrollscan.com/api"`

#### 534352.blockExplorers.default.name

> `readonly` **name**: `"Scrollscan"`

#### 534352.blockExplorers.default.url

> `readonly` **url**: `"https://scrollscan.com"`

#### 534352.contracts

> **contracts**: `object`

#### 534352.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 534352.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 534352.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `14`

#### 534352.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 534352.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 534352.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 534352.formatters?

> `optional` **formatters**: `undefined`

#### 534352.id

> **id**: `534352`

#### 534352.name

> **name**: `"Scroll"`

#### 534352.nativeCurrency

> **nativeCurrency**: `object`

#### 534352.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 534352.nativeCurrency.name

> `readonly` **name**: `"Ether"`

#### 534352.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 534352.rpcUrls

> **rpcUrls**: `object`

#### 534352.rpcUrls.default

> `readonly` **default**: `object`

#### 534352.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.scroll.io"`\]

#### 534352.rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly \[`"wss://wss-rpc.scroll.io/ws"`\]

#### 534352.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 534352.sourceId?

> `optional` **sourceId**: `number`

#### 534352.testnet

> **testnet**: `false`

### 53935

> **53935**: `object` = `chains.dfk`

#### 53935.blockExplorers

> **blockExplorers**: `object`

#### 53935.blockExplorers.default

> `readonly` **default**: `object`

#### 53935.blockExplorers.default.name

> `readonly` **name**: `"DFKSubnetScan"`

#### 53935.blockExplorers.default.url

> `readonly` **url**: `"https://subnets.avax.network/defi-kingdoms"`

#### 53935.contracts

> **contracts**: `object`

#### 53935.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 53935.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 53935.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `14790551`

#### 53935.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 53935.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 53935.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 53935.formatters?

> `optional` **formatters**: `undefined`

#### 53935.id

> **id**: `53935`

#### 53935.name

> **name**: `"DFK Chain"`

#### 53935.nativeCurrency

> **nativeCurrency**: `object`

#### 53935.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 53935.nativeCurrency.name

> `readonly` **name**: `"Jewel"`

#### 53935.nativeCurrency.symbol

> `readonly` **symbol**: `"JEWEL"`

#### 53935.rpcUrls

> **rpcUrls**: `object`

#### 53935.rpcUrls.default

> `readonly` **default**: `object`

#### 53935.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"`\]

#### 53935.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 53935.sourceId?

> `optional` **sourceId**: `number`

#### 53935.testnet?

> `optional` **testnet**: `boolean`

### 545

> **545**: `object` = `chains.flowTestnet`

#### 545.blockExplorers

> **blockExplorers**: `object`

#### 545.blockExplorers.default

> `readonly` **default**: `object`

#### 545.blockExplorers.default.name

> `readonly` **name**: `"Flow Diver"`

#### 545.blockExplorers.default.url

> `readonly` **url**: `"https://evm-testnet.flowscan.io"`

#### 545.contracts

> **contracts**: `object`

#### 545.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 545.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 545.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `137518`

#### 545.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 545.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 545.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 545.formatters?

> `optional` **formatters**: `undefined`

#### 545.id

> **id**: `545`

#### 545.name

> **name**: `"Flow EVM Testnet"`

#### 545.nativeCurrency

> **nativeCurrency**: `object`

#### 545.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 545.nativeCurrency.name

> `readonly` **name**: `"Flow"`

#### 545.nativeCurrency.symbol

> `readonly` **symbol**: `"FLOW"`

#### 545.rpcUrls

> **rpcUrls**: `object`

#### 545.rpcUrls.default

> `readonly` **default**: `object`

#### 545.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://testnet.evm.nodes.onflow.org"`\]

#### 545.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 545.sourceId?

> `optional` **sourceId**: `number`

#### 545.testnet

> **testnet**: `true`

### 56

> **56**: `object` = `chains.bsc`

#### 56.blockExplorers

> **blockExplorers**: `object`

#### 56.blockExplorers.default

> `readonly` **default**: `object`

#### 56.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://api.bscscan.com/api"`

#### 56.blockExplorers.default.name

> `readonly` **name**: `"BscScan"`

#### 56.blockExplorers.default.url

> `readonly` **url**: `"https://bscscan.com"`

#### 56.contracts

> **contracts**: `object`

#### 56.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 56.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 56.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `15921452`

#### 56.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 56.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 56.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 56.formatters?

> `optional` **formatters**: `undefined`

#### 56.id

> **id**: `56`

#### 56.name

> **name**: `"BNB Smart Chain"`

#### 56.nativeCurrency

> **nativeCurrency**: `object`

#### 56.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 56.nativeCurrency.name

> `readonly` **name**: `"BNB"`

#### 56.nativeCurrency.symbol

> `readonly` **symbol**: `"BNB"`

#### 56.rpcUrls

> **rpcUrls**: `object`

#### 56.rpcUrls.default

> `readonly` **default**: `object`

#### 56.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://56.rpc.thirdweb.com"`\]

#### 56.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 56.sourceId?

> `optional` **sourceId**: `number`

#### 56.testnet?

> `optional` **testnet**: `boolean`

### 57

> **57**: `object` = `chains.syscoin`

#### 57.blockExplorers

> **blockExplorers**: `object`

#### 57.blockExplorers.default

> `readonly` **default**: `object`

#### 57.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://explorer.syscoin.org/api"`

#### 57.blockExplorers.default.name

> `readonly` **name**: `"SyscoinExplorer"`

#### 57.blockExplorers.default.url

> `readonly` **url**: `"https://explorer.syscoin.org"`

#### 57.contracts

> **contracts**: `object`

#### 57.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 57.contracts.multicall3.address

> `readonly` **address**: `"0xcA11bde05977b3631167028862bE2a173976CA11"`

#### 57.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `287139`

#### 57.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 57.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 57.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 57.formatters?

> `optional` **formatters**: `undefined`

#### 57.id

> **id**: `57`

#### 57.name

> **name**: `"Syscoin Mainnet"`

#### 57.nativeCurrency

> **nativeCurrency**: `object`

#### 57.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 57.nativeCurrency.name

> `readonly` **name**: `"Syscoin"`

#### 57.nativeCurrency.symbol

> `readonly` **symbol**: `"SYS"`

#### 57.rpcUrls

> **rpcUrls**: `object`

#### 57.rpcUrls.default

> `readonly` **default**: `object`

#### 57.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.syscoin.org"`\]

#### 57.rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly \[`"wss://rpc.syscoin.org/wss"`\]

#### 57.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 57.sourceId?

> `optional` **sourceId**: `number`

#### 57.testnet?

> `optional` **testnet**: `boolean`

### 570

> **570**: `object` = `chains.rollux`

#### 570.blockExplorers

> **blockExplorers**: `object`

#### 570.blockExplorers.default

> `readonly` **default**: `object`

#### 570.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://explorer.rollux.com/api"`

#### 570.blockExplorers.default.name

> `readonly` **name**: `"RolluxExplorer"`

#### 570.blockExplorers.default.url

> `readonly` **url**: `"https://explorer.rollux.com"`

#### 570.contracts

> **contracts**: `object`

#### 570.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 570.contracts.multicall3.address

> `readonly` **address**: `"0xcA11bde05977b3631167028862bE2a173976CA11"`

#### 570.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `119222`

#### 570.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 570.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 570.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 570.formatters?

> `optional` **formatters**: `undefined`

#### 570.id

> **id**: `570`

#### 570.name

> **name**: `"Rollux Mainnet"`

#### 570.nativeCurrency

> **nativeCurrency**: `object`

#### 570.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 570.nativeCurrency.name

> `readonly` **name**: `"Syscoin"`

#### 570.nativeCurrency.symbol

> `readonly` **symbol**: `"SYS"`

#### 570.rpcUrls

> **rpcUrls**: `object`

#### 570.rpcUrls.default

> `readonly` **default**: `object`

#### 570.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.rollux.com"`\]

#### 570.rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly \[`"wss://rpc.rollux.com/wss"`\]

#### 570.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 570.sourceId?

> `optional` **sourceId**: `number`

#### 570.testnet?

> `optional` **testnet**: `boolean`

### 571

> **571**: `object` = `chains.metachain`

#### 571.blockExplorers

> **blockExplorers**: `object`

#### 571.blockExplorers.default

> `readonly` **default**: `object`

#### 571.blockExplorers.default.name

> `readonly` **name**: `"MetaExplorer"`

#### 571.blockExplorers.default.url

> `readonly` **url**: `"https://explorer.metatime.com"`

#### 571.contracts

> **contracts**: `object`

#### 571.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 571.contracts.multicall3.address

> `readonly` **address**: `"0x0000000000000000000000000000000000003001"`

#### 571.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `0`

#### 571.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 571.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 571.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 571.formatters?

> `optional` **formatters**: `undefined`

#### 571.id

> **id**: `571`

#### 571.name

> **name**: `"MetaChain Mainnet"`

#### 571.nativeCurrency

> **nativeCurrency**: `object`

#### 571.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 571.nativeCurrency.name

> `readonly` **name**: `"Metatime Coin"`

#### 571.nativeCurrency.symbol

> `readonly` **symbol**: `"MTC"`

#### 571.rpcUrls

> **rpcUrls**: `object`

#### 571.rpcUrls.default

> `readonly` **default**: `object`

#### 571.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.metatime.com"`\]

#### 571.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 571.sourceId?

> `optional` **sourceId**: `number`

#### 571.testnet?

> `optional` **testnet**: `boolean`

### 58008

> **58008**: `object` = `chains.pgnTestnet`

#### 58008.blockExplorers

> **blockExplorers**: `object`

#### 58008.blockExplorers.default

> `readonly` **default**: `object`

#### 58008.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://explorer.sepolia.publicgoods.network/api"`

#### 58008.blockExplorers.default.name

> `readonly` **name**: `"PGN Testnet Explorer"`

#### 58008.blockExplorers.default.url

> `readonly` **url**: `"https://explorer.sepolia.publicgoods.network"`

#### 58008.contracts

> **contracts**: `object`

#### 58008.contracts.l1StandardBridge

> `readonly` **l1StandardBridge**: `object`

#### 58008.contracts.l1StandardBridge.11155111

> `readonly` **11155111**: `object`

#### 58008.contracts.l1StandardBridge.11155111.address

> `readonly` **address**: `"0xFaE6abCAF30D23e233AC7faF747F2fC3a5a6Bfa3"`

#### 58008.contracts.l2OutputOracle

> `readonly` **l2OutputOracle**: `object`

#### 58008.contracts.l2OutputOracle.11155111

> `readonly` **11155111**: `object`

#### 58008.contracts.l2OutputOracle.11155111.address

> `readonly` **address**: `"0xD5bAc3152ffC25318F848B3DD5dA6C85171BaEEe"`

#### 58008.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 58008.contracts.multicall3.address

> `readonly` **address**: `"0xcA11bde05977b3631167028862bE2a173976CA11"`

#### 58008.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `3754925`

#### 58008.contracts.portal

> `readonly` **portal**: `object`

#### 58008.contracts.portal.11155111

> `readonly` **11155111**: `object`

#### 58008.contracts.portal.11155111.address

> `readonly` **address**: `"0xF04BdD5353Bb0EFF6CA60CfcC78594278eBfE179"`

#### 58008.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 58008.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 58008.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 58008.formatters

> **formatters**: `object`

#### 58008.formatters.block

> `readonly` **block**: `object`

#### 58008.formatters.block.exclude

> **exclude**: `undefined` \| \[\]

#### 58008.formatters.block.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`OpStackRpcBlock`\<`BlockTag`, `boolean`\>

##### Returns

`object`

###### baseFeePerGas

> **baseFeePerGas**: `null` \| `bigint`

###### blobGasUsed

> **blobGasUsed**: `bigint`

###### difficulty

> **difficulty**: `bigint`

###### excessBlobGas

> **excessBlobGas**: `bigint`

###### extraData

> **extraData**: `` `0x${string}` ``

###### gasLimit

> **gasLimit**: `bigint`

###### gasUsed

> **gasUsed**: `bigint`

###### hash

> **hash**: `null` \| `` `0x${string}` ``

###### logsBloom

> **logsBloom**: `null` \| `` `0x${string}` ``

###### miner

> **miner**: `` `0x${string}` ``

###### mixHash

> **mixHash**: `` `0x${string}` ``

###### nonce

> **nonce**: `null` \| `` `0x${string}` ``

###### number

> **number**: `null` \| `bigint`

###### parentBeaconBlockRoot?

> `optional` **parentBeaconBlockRoot**: `` `0x${string}` ``

###### parentHash

> **parentHash**: `` `0x${string}` ``

###### receiptsRoot

> **receiptsRoot**: `` `0x${string}` ``

###### sealFields

> **sealFields**: `` `0x${string}` ``[]

###### sha3Uncles

> **sha3Uncles**: `` `0x${string}` ``

###### size

> **size**: `bigint`

###### stateRoot

> **stateRoot**: `` `0x${string}` ``

###### timestamp

> **timestamp**: `bigint`

###### totalDifficulty

> **totalDifficulty**: `null` \| `bigint`

###### transactions

> **transactions**: `` `0x${string}` ``[] \| `OpStackTransaction`\<`boolean`\>[]

###### transactionsRoot

> **transactionsRoot**: `` `0x${string}` ``

###### uncles

> **uncles**: `` `0x${string}` ``[]

###### withdrawals?

> `optional` **withdrawals**: `Withdrawal`[]

###### withdrawalsRoot?

> `optional` **withdrawalsRoot**: `` `0x${string}` ``

#### 58008.formatters.block.type

> **type**: `"block"`

#### 58008.formatters.transaction

> `readonly` **transaction**: `object`

#### 58008.formatters.transaction.exclude

> **exclude**: `undefined` \| \[\]

#### 58008.formatters.transaction.format()

> **format**: (`args`) => \{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

##### Parameters

###### args

`OpStackRpcTransaction`\<`boolean`\>

##### Returns

\{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

#### 58008.formatters.transaction.type

> **type**: `"transaction"`

#### 58008.formatters.transactionReceipt

> `readonly` **transactionReceipt**: `object`

#### 58008.formatters.transactionReceipt.exclude

> **exclude**: `undefined` \| \[\]

#### 58008.formatters.transactionReceipt.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`OpStackRpcTransactionReceipt`

##### Returns

`object`

###### blobGasPrice?

> `optional` **blobGasPrice**: `bigint`

###### blobGasUsed?

> `optional` **blobGasUsed**: `bigint`

###### blockHash

> **blockHash**: `` `0x${string}` ``

###### blockNumber

> **blockNumber**: `bigint`

###### contractAddress

> **contractAddress**: `undefined` \| `null` \| `` `0x${string}` ``

###### cumulativeGasUsed

> **cumulativeGasUsed**: `bigint`

###### effectiveGasPrice

> **effectiveGasPrice**: `bigint`

###### from

> **from**: `` `0x${string}` ``

###### gasUsed

> **gasUsed**: `bigint`

###### l1Fee

> **l1Fee**: `null` \| `bigint`

###### l1FeeScalar

> **l1FeeScalar**: `null` \| `number`

###### l1GasPrice

> **l1GasPrice**: `null` \| `bigint`

###### l1GasUsed

> **l1GasUsed**: `null` \| `bigint`

###### logs

> **logs**: `Log`\<`bigint`, `number`, `false`, `undefined`, `undefined`, `undefined`, `undefined`\>[]

###### logsBloom

> **logsBloom**: `` `0x${string}` ``

###### root?

> `optional` **root**: `` `0x${string}` ``

###### status

> **status**: `"success"` \| `"reverted"`

###### to

> **to**: `null` \| `` `0x${string}` ``

###### transactionHash

> **transactionHash**: `` `0x${string}` ``

###### transactionIndex

> **transactionIndex**: `number`

###### type

> **type**: `TransactionType`

#### 58008.formatters.transactionReceipt.type

> **type**: `"transactionReceipt"`

#### 58008.id

> **id**: `58008`

#### 58008.name

> **name**: `"PGN "`

#### 58008.nativeCurrency

> **nativeCurrency**: `object`

#### 58008.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 58008.nativeCurrency.name

> `readonly` **name**: `"Ether"`

#### 58008.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 58008.network

> `readonly` **network**: `"pgn-testnet"`

#### 58008.rpcUrls

> **rpcUrls**: `object`

#### 58008.rpcUrls.default

> `readonly` **default**: `object`

#### 58008.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://sepolia.publicgoods.network"`\]

#### 58008.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 58008.sourceId

> **sourceId**: `11155111`

#### 58008.testnet

> **testnet**: `true`

### 59140

> **59140**: `object` = `chains.lineaGoerli`

#### 59140.blockExplorers

> **blockExplorers**: `object`

#### 59140.blockExplorers.default

> `readonly` **default**: `object`

#### 59140.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://api-goerli.lineascan.build/api"`

#### 59140.blockExplorers.default.name

> `readonly` **name**: `"Etherscan"`

#### 59140.blockExplorers.default.url

> `readonly` **url**: `"https://goerli.lineascan.build"`

#### 59140.contracts

> **contracts**: `object`

#### 59140.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 59140.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 59140.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `498623`

#### 59140.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 59140.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 59140.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 59140.formatters?

> `optional` **formatters**: `undefined`

#### 59140.id

> **id**: `59140`

#### 59140.name

> **name**: `"Linea Goerli Testnet"`

#### 59140.nativeCurrency

> **nativeCurrency**: `object`

#### 59140.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 59140.nativeCurrency.name

> `readonly` **name**: `"Linea Ether"`

#### 59140.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 59140.rpcUrls

> **rpcUrls**: `object`

#### 59140.rpcUrls.default

> `readonly` **default**: `object`

#### 59140.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.goerli.linea.build"`\]

#### 59140.rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly \[`"wss://rpc.goerli.linea.build"`\]

#### 59140.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 59140.sourceId?

> `optional` **sourceId**: `number`

#### 59140.testnet

> **testnet**: `true`

### 59144

> **59144**: `object` = `chains.linea`

#### 59144.blockExplorers

> **blockExplorers**: `object`

#### 59144.blockExplorers.default

> `readonly` **default**: `object`

#### 59144.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://api.lineascan.build/api"`

#### 59144.blockExplorers.default.name

> `readonly` **name**: `"Etherscan"`

#### 59144.blockExplorers.default.url

> `readonly` **url**: `"https://lineascan.build"`

#### 59144.contracts

> **contracts**: `object`

#### 59144.contracts.ensRegistry

> `readonly` **ensRegistry**: `object`

#### 59144.contracts.ensRegistry.address

> `readonly` **address**: `"0x50130b669B28C339991d8676FA73CF122a121267"`

#### 59144.contracts.ensRegistry.blockCreated

> `readonly` **blockCreated**: `6682888`

#### 59144.contracts.ensUniversalResolver

> `readonly` **ensUniversalResolver**: `object`

#### 59144.contracts.ensUniversalResolver.address

> `readonly` **address**: `"0x3aA974fb3f8C1E02796048BDCdeD79e9D53a6965"`

#### 59144.contracts.ensUniversalResolver.blockCreated

> `readonly` **blockCreated**: `6683000`

#### 59144.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 59144.contracts.multicall3.address

> `readonly` **address**: `"0xcA11bde05977b3631167028862bE2a173976CA11"`

#### 59144.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `42`

#### 59144.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 59144.ensTlds

> **ensTlds**: readonly \[`".linea.eth"`\]

#### 59144.fees

> **fees**: `object`

#### 59144.fees.estimateFeesPerGas()

> `readonly` **estimateFeesPerGas**: (`__namedParameters`) => `Promise`\<`null` \| `EstimateFeesPerGasReturnType`\>

##### Parameters

###### \_\_namedParameters

`ChainEstimateFeesPerGasFnParameters`\<`undefined` \| `ChainFormatters`\>

##### Returns

`Promise`\<`null` \| `EstimateFeesPerGasReturnType`\>

#### 59144.fees.maxPriorityFeePerGas()

> `readonly` **maxPriorityFeePerGas**: (`__namedParameters`) => `Promise`\<`null` \| `bigint`\>

##### Parameters

###### \_\_namedParameters

`ChainFeesFnParameters`\<`undefined` \| `ChainFormatters`\>

##### Returns

`Promise`\<`null` \| `bigint`\>

#### 59144.formatters?

> `optional` **formatters**: `undefined`

#### 59144.id

> **id**: `59144`

#### 59144.name

> **name**: `"Linea Mainnet"`

#### 59144.nativeCurrency

> **nativeCurrency**: `object`

#### 59144.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 59144.nativeCurrency.name

> `readonly` **name**: `"Linea Ether"`

#### 59144.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 59144.rpcUrls

> **rpcUrls**: `object`

#### 59144.rpcUrls.default

> `readonly` **default**: `object`

#### 59144.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.linea.build"`\]

#### 59144.rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly \[`"wss://rpc.linea.build"`\]

#### 59144.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 59144.sourceId?

> `optional` **sourceId**: `number`

#### 59144.testnet

> **testnet**: `false`

### 592

> **592**: `object` = `chains.astar`

#### 592.blockExplorers

> **blockExplorers**: `object`

#### 592.blockExplorers.default

> `readonly` **default**: `object`

#### 592.blockExplorers.default.name

> `readonly` **name**: `"Astar Subscan"`

#### 592.blockExplorers.default.url

> `readonly` **url**: `"https://astar.subscan.io"`

#### 592.contracts

> **contracts**: `object`

#### 592.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 592.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 592.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `761794`

#### 592.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 592.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 592.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 592.formatters?

> `optional` **formatters**: `undefined`

#### 592.id

> **id**: `592`

#### 592.name

> **name**: `"Astar"`

#### 592.nativeCurrency

> **nativeCurrency**: `object`

#### 592.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 592.nativeCurrency.name

> `readonly` **name**: `"Astar"`

#### 592.nativeCurrency.symbol

> `readonly` **symbol**: `"ASTR"`

#### 592.network

> `readonly` **network**: `"astar-mainnet"`

#### 592.rpcUrls

> **rpcUrls**: `object`

#### 592.rpcUrls.default

> `readonly` **default**: `object`

#### 592.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://astar.api.onfinality.io/public"`\]

#### 592.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 592.sourceId?

> `optional` **sourceId**: `number`

#### 592.testnet

> **testnet**: `false`

### 595

> **595**: `object` = `chains.mandala`

#### 595.blockExplorers

> **blockExplorers**: `object`

#### 595.blockExplorers.default

> `readonly` **default**: `object`

#### 595.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://blockscout.mandala.aca-staging.network/api"`

#### 595.blockExplorers.default.name

> `readonly` **name**: `"Mandala Blockscout"`

#### 595.blockExplorers.default.url

> `readonly` **url**: `"https://blockscout.mandala.aca-staging.network"`

#### 595.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 595.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 595.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 595.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 595.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 595.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 595.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 595.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 595.formatters?

> `optional` **formatters**: `undefined`

#### 595.id

> **id**: `595`

#### 595.name

> **name**: `"Mandala TC9"`

#### 595.nativeCurrency

> **nativeCurrency**: `object`

#### 595.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 595.nativeCurrency.name

> `readonly` **name**: `"Mandala"`

#### 595.nativeCurrency.symbol

> `readonly` **symbol**: `"mACA"`

#### 595.network

> `readonly` **network**: `"mandala"`

#### 595.rpcUrls

> **rpcUrls**: `object`

#### 595.rpcUrls.default

> `readonly` **default**: `object`

#### 595.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://eth-rpc-tc9.aca-staging.network"`\]

#### 595.rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly \[`"wss://eth-rpc-tc9.aca-staging.network"`\]

#### 595.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 595.sourceId?

> `optional` **sourceId**: `number`

#### 595.testnet

> **testnet**: `true`

### 599

> **599**: `object` = `chains.metisGoerli`

#### 599.blockExplorers

> **blockExplorers**: `object`

#### 599.blockExplorers.default

> `readonly` **default**: `object`

#### 599.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://goerli.explorer.metisdevops.link/api"`

#### 599.blockExplorers.default.name

> `readonly` **name**: `"Metis Goerli Explorer"`

#### 599.blockExplorers.default.url

> `readonly` **url**: `"https://goerli.explorer.metisdevops.link"`

#### 599.contracts

> **contracts**: `object`

#### 599.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 599.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 599.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `1006207`

#### 599.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 599.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 599.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 599.formatters?

> `optional` **formatters**: `undefined`

#### 599.id

> **id**: `599`

#### 599.name

> **name**: `"Metis Goerli"`

#### 599.nativeCurrency

> **nativeCurrency**: `object`

#### 599.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 599.nativeCurrency.name

> `readonly` **name**: `"Metis Goerli"`

#### 599.nativeCurrency.symbol

> `readonly` **symbol**: `"METIS"`

#### 599.rpcUrls

> **rpcUrls**: `object`

#### 599.rpcUrls.default

> `readonly` **default**: `object`

#### 599.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://goerli.gateway.metisdevops.link"`\]

#### 599.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 599.sourceId?

> `optional` **sourceId**: `number`

#### 599.testnet?

> `optional` **testnet**: `boolean`

### 6038361

> **6038361**: `object` = `chains.astarZkyoto`

#### 6038361.blockExplorers

> **blockExplorers**: `object`

#### 6038361.blockExplorers.default

> `readonly` **default**: `object`

#### 6038361.blockExplorers.default.name

> `readonly` **name**: `"zKyoto Explorer"`

#### 6038361.blockExplorers.default.url

> `readonly` **url**: `"https://zkyoto.explorer.startale.com"`

#### 6038361.contracts

> **contracts**: `object`

#### 6038361.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 6038361.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 6038361.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `196153`

#### 6038361.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 6038361.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 6038361.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 6038361.formatters?

> `optional` **formatters**: `undefined`

#### 6038361.id

> **id**: `6038361`

#### 6038361.name

> **name**: `"Astar zkEVM Testnet zKyoto"`

#### 6038361.nativeCurrency

> **nativeCurrency**: `object`

#### 6038361.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 6038361.nativeCurrency.name

> `readonly` **name**: `"Ether"`

#### 6038361.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 6038361.network

> `readonly` **network**: `"zKyoto"`

#### 6038361.rpcUrls

> **rpcUrls**: `object`

#### 6038361.rpcUrls.default

> `readonly` **default**: `object`

#### 6038361.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.startale.com/zkyoto"`\]

#### 6038361.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 6038361.sourceId?

> `optional` **sourceId**: `number`

#### 6038361.testnet

> **testnet**: `true`

### 60808

> **60808**: `object` = `chains.bob`

#### 60808.blockExplorers

> **blockExplorers**: `object`

#### 60808.blockExplorers.default

> `readonly` **default**: `object`

#### 60808.blockExplorers.default.name

> `readonly` **name**: `"BOB Explorer"`

#### 60808.blockExplorers.default.url

> `readonly` **url**: `"https://explorer.gobob.xyz"`

#### 60808.contracts

> **contracts**: `object`

#### 60808.contracts.gasPriceOracle

> `readonly` **gasPriceOracle**: `object`

#### 60808.contracts.gasPriceOracle.address

> `readonly` **address**: `"0x420000000000000000000000000000000000000F"`

#### 60808.contracts.l1Block

> `readonly` **l1Block**: `object`

#### 60808.contracts.l1Block.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000015"`

#### 60808.contracts.l2CrossDomainMessenger

> `readonly` **l2CrossDomainMessenger**: `object`

#### 60808.contracts.l2CrossDomainMessenger.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000007"`

#### 60808.contracts.l2Erc721Bridge

> `readonly` **l2Erc721Bridge**: `object`

#### 60808.contracts.l2Erc721Bridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000014"`

#### 60808.contracts.l2OutputOracle

> `readonly` **l2OutputOracle**: `object`

#### 60808.contracts.l2OutputOracle.1

> `readonly` **1**: `object`

#### 60808.contracts.l2OutputOracle.1.address

> `readonly` **address**: `"0xdDa53E23f8a32640b04D7256e651C1db98dB11C1"`

#### 60808.contracts.l2OutputOracle.1.blockCreated

> `readonly` **blockCreated**: `4462615`

#### 60808.contracts.l2StandardBridge

> `readonly` **l2StandardBridge**: `object`

#### 60808.contracts.l2StandardBridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000010"`

#### 60808.contracts.l2ToL1MessagePasser

> `readonly` **l2ToL1MessagePasser**: `object`

#### 60808.contracts.l2ToL1MessagePasser.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000016"`

#### 60808.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 60808.contracts.multicall3.address

> `readonly` **address**: `"0xcA11bde05977b3631167028862bE2a173976CA11"`

#### 60808.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `23131`

#### 60808.contracts.portal

> `readonly` **portal**: `object`

#### 60808.contracts.portal.1

> `readonly` **1**: `object`

#### 60808.contracts.portal.1.address

> `readonly` **address**: `"0x8AdeE124447435fE03e3CD24dF3f4cAE32E65a3E"`

#### 60808.contracts.portal.1.blockCreated

> `readonly` **blockCreated**: `4462615`

#### 60808.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 60808.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 60808.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 60808.formatters

> **formatters**: `object`

#### 60808.formatters.block

> `readonly` **block**: `object`

#### 60808.formatters.block.exclude

> **exclude**: `undefined` \| \[\]

#### 60808.formatters.block.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`OpStackRpcBlock`\<`BlockTag`, `boolean`\>

##### Returns

`object`

###### baseFeePerGas

> **baseFeePerGas**: `null` \| `bigint`

###### blobGasUsed

> **blobGasUsed**: `bigint`

###### difficulty

> **difficulty**: `bigint`

###### excessBlobGas

> **excessBlobGas**: `bigint`

###### extraData

> **extraData**: `` `0x${string}` ``

###### gasLimit

> **gasLimit**: `bigint`

###### gasUsed

> **gasUsed**: `bigint`

###### hash

> **hash**: `null` \| `` `0x${string}` ``

###### logsBloom

> **logsBloom**: `null` \| `` `0x${string}` ``

###### miner

> **miner**: `` `0x${string}` ``

###### mixHash

> **mixHash**: `` `0x${string}` ``

###### nonce

> **nonce**: `null` \| `` `0x${string}` ``

###### number

> **number**: `null` \| `bigint`

###### parentBeaconBlockRoot?

> `optional` **parentBeaconBlockRoot**: `` `0x${string}` ``

###### parentHash

> **parentHash**: `` `0x${string}` ``

###### receiptsRoot

> **receiptsRoot**: `` `0x${string}` ``

###### sealFields

> **sealFields**: `` `0x${string}` ``[]

###### sha3Uncles

> **sha3Uncles**: `` `0x${string}` ``

###### size

> **size**: `bigint`

###### stateRoot

> **stateRoot**: `` `0x${string}` ``

###### timestamp

> **timestamp**: `bigint`

###### totalDifficulty

> **totalDifficulty**: `null` \| `bigint`

###### transactions

> **transactions**: `` `0x${string}` ``[] \| `OpStackTransaction`\<`boolean`\>[]

###### transactionsRoot

> **transactionsRoot**: `` `0x${string}` ``

###### uncles

> **uncles**: `` `0x${string}` ``[]

###### withdrawals?

> `optional` **withdrawals**: `Withdrawal`[]

###### withdrawalsRoot?

> `optional` **withdrawalsRoot**: `` `0x${string}` ``

#### 60808.formatters.block.type

> **type**: `"block"`

#### 60808.formatters.transaction

> `readonly` **transaction**: `object`

#### 60808.formatters.transaction.exclude

> **exclude**: `undefined` \| \[\]

#### 60808.formatters.transaction.format()

> **format**: (`args`) => \{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

##### Parameters

###### args

`OpStackRpcTransaction`\<`boolean`\>

##### Returns

\{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

#### 60808.formatters.transaction.type

> **type**: `"transaction"`

#### 60808.formatters.transactionReceipt

> `readonly` **transactionReceipt**: `object`

#### 60808.formatters.transactionReceipt.exclude

> **exclude**: `undefined` \| \[\]

#### 60808.formatters.transactionReceipt.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`OpStackRpcTransactionReceipt`

##### Returns

`object`

###### blobGasPrice?

> `optional` **blobGasPrice**: `bigint`

###### blobGasUsed?

> `optional` **blobGasUsed**: `bigint`

###### blockHash

> **blockHash**: `` `0x${string}` ``

###### blockNumber

> **blockNumber**: `bigint`

###### contractAddress

> **contractAddress**: `undefined` \| `null` \| `` `0x${string}` ``

###### cumulativeGasUsed

> **cumulativeGasUsed**: `bigint`

###### effectiveGasPrice

> **effectiveGasPrice**: `bigint`

###### from

> **from**: `` `0x${string}` ``

###### gasUsed

> **gasUsed**: `bigint`

###### l1Fee

> **l1Fee**: `null` \| `bigint`

###### l1FeeScalar

> **l1FeeScalar**: `null` \| `number`

###### l1GasPrice

> **l1GasPrice**: `null` \| `bigint`

###### l1GasUsed

> **l1GasUsed**: `null` \| `bigint`

###### logs

> **logs**: `Log`\<`bigint`, `number`, `false`, `undefined`, `undefined`, `undefined`, `undefined`\>[]

###### logsBloom

> **logsBloom**: `` `0x${string}` ``

###### root?

> `optional` **root**: `` `0x${string}` ``

###### status

> **status**: `"success"` \| `"reverted"`

###### to

> **to**: `null` \| `` `0x${string}` ``

###### transactionHash

> **transactionHash**: `` `0x${string}` ``

###### transactionIndex

> **transactionIndex**: `number`

###### type

> **type**: `TransactionType`

#### 60808.formatters.transactionReceipt.type

> **type**: `"transactionReceipt"`

#### 60808.id

> **id**: `60808`

#### 60808.name

> **name**: `"BOB"`

#### 60808.nativeCurrency

> **nativeCurrency**: `object`

#### 60808.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 60808.nativeCurrency.name

> `readonly` **name**: `"ETH"`

#### 60808.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 60808.rpcUrls

> **rpcUrls**: `object`

#### 60808.rpcUrls.default

> `readonly` **default**: `object`

#### 60808.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.gobob.xyz"`\]

#### 60808.rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly \[`"wss://rpc.gobob.xyz"`\]

#### 60808.serializers

> **serializers**: `object`

#### 60808.serializers.transaction()

> `readonly` **transaction**: (`transaction`, `signature?`) => `` `0x02${string}` `` \| `` `0x01${string}` `` \| `` `0x03${string}` `` \| `` `0x04${string}` `` \| `TransactionSerializedLegacy` \| `` `0x7e${string}` ``

##### Parameters

###### transaction

`OpStackTransactionSerializable`

###### signature?

`Signature`

##### Returns

`` `0x02${string}` `` \| `` `0x01${string}` `` \| `` `0x03${string}` `` \| `` `0x04${string}` `` \| `TransactionSerializedLegacy` \| `` `0x7e${string}` ``

#### 60808.sourceId

> **sourceId**: `1`

#### 60808.testnet?

> `optional` **testnet**: `boolean`

### 61

> **61**: `object` = `chains.classic`

#### 61.blockExplorers

> **blockExplorers**: `object`

#### 61.blockExplorers.default

> `readonly` **default**: `object`

#### 61.blockExplorers.default.name

> `readonly` **name**: `"Blockscout"`

#### 61.blockExplorers.default.url

> `readonly` **url**: `"https://blockscout.com/etc/mainnet"`

#### 61.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 61.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 61.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 61.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 61.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 61.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 61.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 61.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 61.formatters?

> `optional` **formatters**: `undefined`

#### 61.id

> **id**: `61`

#### 61.name

> **name**: `"Ethereum Classic"`

#### 61.nativeCurrency

> **nativeCurrency**: `object`

#### 61.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 61.nativeCurrency.name

> `readonly` **name**: `"ETC"`

#### 61.nativeCurrency.symbol

> `readonly` **symbol**: `"ETC"`

#### 61.rpcUrls

> **rpcUrls**: `object`

#### 61.rpcUrls.default

> `readonly` **default**: `object`

#### 61.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://etc.rivet.link"`\]

#### 61.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 61.sourceId?

> `optional` **sourceId**: `number`

#### 61.testnet?

> `optional` **testnet**: `boolean`

### 66

> **66**: `object` = `chains.okc`

#### 66.blockExplorers

> **blockExplorers**: `object`

#### 66.blockExplorers.default

> `readonly` **default**: `object`

#### 66.blockExplorers.default.name

> `readonly` **name**: `"oklink"`

#### 66.blockExplorers.default.url

> `readonly` **url**: `"https://www.oklink.com/okc"`

#### 66.contracts

> **contracts**: `object`

#### 66.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 66.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 66.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `10364792`

#### 66.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 66.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 66.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 66.formatters?

> `optional` **formatters**: `undefined`

#### 66.id

> **id**: `66`

#### 66.name

> **name**: `"OKC"`

#### 66.nativeCurrency

> **nativeCurrency**: `object`

#### 66.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 66.nativeCurrency.name

> `readonly` **name**: `"OKT"`

#### 66.nativeCurrency.symbol

> `readonly` **symbol**: `"OKT"`

#### 66.rpcUrls

> **rpcUrls**: `object`

#### 66.rpcUrls.default

> `readonly` **default**: `object`

#### 66.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://exchainrpc.okex.org"`\]

#### 66.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 66.sourceId?

> `optional` **sourceId**: `number`

#### 66.testnet?

> `optional` **testnet**: `boolean`

### 660279

> **660279**: `object` = `chains.xai`

#### 660279.blockExplorers

> **blockExplorers**: `object`

#### 660279.blockExplorers.default

> `readonly` **default**: `object`

#### 660279.blockExplorers.default.name

> `readonly` **name**: `"Blockscout"`

#### 660279.blockExplorers.default.url

> `readonly` **url**: `"https://explorer.xai-chain.net"`

#### 660279.contracts

> **contracts**: `object`

#### 660279.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 660279.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 660279.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `222549`

#### 660279.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 660279.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 660279.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 660279.formatters?

> `optional` **formatters**: `undefined`

#### 660279.id

> **id**: `660279`

#### 660279.name

> **name**: `"Xai Mainnet"`

#### 660279.nativeCurrency

> **nativeCurrency**: `object`

#### 660279.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 660279.nativeCurrency.name

> `readonly` **name**: `"Xai"`

#### 660279.nativeCurrency.symbol

> `readonly` **symbol**: `"XAI"`

#### 660279.rpcUrls

> **rpcUrls**: `object`

#### 660279.rpcUrls.default

> `readonly` **default**: `object`

#### 660279.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://xai-chain.net/rpc"`\]

#### 660279.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 660279.sourceId?

> `optional` **sourceId**: `number`

#### 660279.testnet

> **testnet**: `false`

### 666666666

> **666666666**: `object` = `chains.degen`

#### 666666666.blockExplorers

> **blockExplorers**: `object`

#### 666666666.blockExplorers.default

> `readonly` **default**: `object`

#### 666666666.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://explorer.degen.tips/api/v2"`

#### 666666666.blockExplorers.default.name

> `readonly` **name**: `"Degen Chain Explorer"`

#### 666666666.blockExplorers.default.url

> `readonly` **url**: `"https://explorer.degen.tips"`

#### 666666666.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 666666666.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 666666666.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 666666666.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 666666666.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 666666666.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 666666666.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 666666666.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 666666666.formatters?

> `optional` **formatters**: `undefined`

#### 666666666.id

> **id**: `666666666`

#### 666666666.name

> **name**: `"Degen"`

#### 666666666.nativeCurrency

> **nativeCurrency**: `object`

#### 666666666.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 666666666.nativeCurrency.name

> `readonly` **name**: `"Degen"`

#### 666666666.nativeCurrency.symbol

> `readonly` **symbol**: `"DEGEN"`

#### 666666666.rpcUrls

> **rpcUrls**: `object`

#### 666666666.rpcUrls.default

> `readonly` **default**: `object`

#### 666666666.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.degen.tips"`\]

#### 666666666.rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly \[`"wss://rpc.degen.tips"`\]

#### 666666666.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 666666666.sourceId?

> `optional` **sourceId**: `number`

#### 666666666.testnet?

> `optional` **testnet**: `boolean`

### 686

> **686**: `object` = `chains.karura`

#### 686.blockExplorers

> **blockExplorers**: `object`

#### 686.blockExplorers.default

> `readonly` **default**: `object`

#### 686.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://blockscout.karura.network/api"`

#### 686.blockExplorers.default.name

> `readonly` **name**: `"Karura Blockscout"`

#### 686.blockExplorers.default.url

> `readonly` **url**: `"https://blockscout.karura.network"`

#### 686.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 686.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 686.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 686.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 686.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 686.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 686.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 686.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 686.formatters?

> `optional` **formatters**: `undefined`

#### 686.id

> **id**: `686`

#### 686.name

> **name**: `"Karura"`

#### 686.nativeCurrency

> **nativeCurrency**: `object`

#### 686.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 686.nativeCurrency.name

> `readonly` **name**: `"Karura"`

#### 686.nativeCurrency.symbol

> `readonly` **symbol**: `"KAR"`

#### 686.network

> `readonly` **network**: `"karura"`

#### 686.rpcUrls

> **rpcUrls**: `object`

#### 686.rpcUrls.default

> `readonly` **default**: `object`

#### 686.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://eth-rpc-karura.aca-api.network"`\]

#### 686.rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly \[`"wss://eth-rpc-karura.aca-api.network"`\]

#### 686.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 686.sourceId?

> `optional` **sourceId**: `number`

#### 686.testnet

> **testnet**: `false`

### 690

> **690**: `object` = `chains.redstone`

#### 690.blockExplorers

> **blockExplorers**: `object`

#### 690.blockExplorers.default

> `readonly` **default**: `object`

#### 690.blockExplorers.default.name

> `readonly` **name**: `"Blockscout"`

#### 690.blockExplorers.default.url

> `readonly` **url**: `"https://explorer.redstone.xyz"`

#### 690.contracts

> **contracts**: `object`

#### 690.contracts.gasPriceOracle

> `readonly` **gasPriceOracle**: `object`

#### 690.contracts.gasPriceOracle.address

> `readonly` **address**: `"0x420000000000000000000000000000000000000F"`

#### 690.contracts.l1Block

> `readonly` **l1Block**: `object`

#### 690.contracts.l1Block.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000015"`

#### 690.contracts.l1StandardBridge

> `readonly` **l1StandardBridge**: `object`

#### 690.contracts.l1StandardBridge.1

> `readonly` **1**: `object`

#### 690.contracts.l1StandardBridge.1.address

> `readonly` **address**: `"0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69"`

#### 690.contracts.l1StandardBridge.1.blockCreated

> `readonly` **blockCreated**: `19578331`

#### 690.contracts.l2CrossDomainMessenger

> `readonly` **l2CrossDomainMessenger**: `object`

#### 690.contracts.l2CrossDomainMessenger.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000007"`

#### 690.contracts.l2Erc721Bridge

> `readonly` **l2Erc721Bridge**: `object`

#### 690.contracts.l2Erc721Bridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000014"`

#### 690.contracts.l2OutputOracle

> `readonly` **l2OutputOracle**: `object`

#### 690.contracts.l2OutputOracle.1

> `readonly` **1**: `object`

#### 690.contracts.l2OutputOracle.1.address

> `readonly` **address**: `"0xa426A052f657AEEefc298b3B5c35a470e4739d69"`

#### 690.contracts.l2OutputOracle.1.blockCreated

> `readonly` **blockCreated**: `19578337`

#### 690.contracts.l2StandardBridge

> `readonly` **l2StandardBridge**: `object`

#### 690.contracts.l2StandardBridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000010"`

#### 690.contracts.l2ToL1MessagePasser

> `readonly` **l2ToL1MessagePasser**: `object`

#### 690.contracts.l2ToL1MessagePasser.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000016"`

#### 690.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 690.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 690.contracts.portal

> `readonly` **portal**: `object`

#### 690.contracts.portal.1

> `readonly` **1**: `object`

#### 690.contracts.portal.1.address

> `readonly` **address**: `"0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae"`

#### 690.contracts.portal.1.blockCreated

> `readonly` **blockCreated**: `19578329`

#### 690.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 690.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 690.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 690.formatters

> **formatters**: `object`

#### 690.formatters.block

> `readonly` **block**: `object`

#### 690.formatters.block.exclude

> **exclude**: `undefined` \| \[\]

#### 690.formatters.block.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`OpStackRpcBlock`\<`BlockTag`, `boolean`\>

##### Returns

`object`

###### baseFeePerGas

> **baseFeePerGas**: `null` \| `bigint`

###### blobGasUsed

> **blobGasUsed**: `bigint`

###### difficulty

> **difficulty**: `bigint`

###### excessBlobGas

> **excessBlobGas**: `bigint`

###### extraData

> **extraData**: `` `0x${string}` ``

###### gasLimit

> **gasLimit**: `bigint`

###### gasUsed

> **gasUsed**: `bigint`

###### hash

> **hash**: `null` \| `` `0x${string}` ``

###### logsBloom

> **logsBloom**: `null` \| `` `0x${string}` ``

###### miner

> **miner**: `` `0x${string}` ``

###### mixHash

> **mixHash**: `` `0x${string}` ``

###### nonce

> **nonce**: `null` \| `` `0x${string}` ``

###### number

> **number**: `null` \| `bigint`

###### parentBeaconBlockRoot?

> `optional` **parentBeaconBlockRoot**: `` `0x${string}` ``

###### parentHash

> **parentHash**: `` `0x${string}` ``

###### receiptsRoot

> **receiptsRoot**: `` `0x${string}` ``

###### sealFields

> **sealFields**: `` `0x${string}` ``[]

###### sha3Uncles

> **sha3Uncles**: `` `0x${string}` ``

###### size

> **size**: `bigint`

###### stateRoot

> **stateRoot**: `` `0x${string}` ``

###### timestamp

> **timestamp**: `bigint`

###### totalDifficulty

> **totalDifficulty**: `null` \| `bigint`

###### transactions

> **transactions**: `` `0x${string}` ``[] \| `OpStackTransaction`\<`boolean`\>[]

###### transactionsRoot

> **transactionsRoot**: `` `0x${string}` ``

###### uncles

> **uncles**: `` `0x${string}` ``[]

###### withdrawals?

> `optional` **withdrawals**: `Withdrawal`[]

###### withdrawalsRoot?

> `optional` **withdrawalsRoot**: `` `0x${string}` ``

#### 690.formatters.block.type

> **type**: `"block"`

#### 690.formatters.transaction

> `readonly` **transaction**: `object`

#### 690.formatters.transaction.exclude

> **exclude**: `undefined` \| \[\]

#### 690.formatters.transaction.format()

> **format**: (`args`) => \{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

##### Parameters

###### args

`OpStackRpcTransaction`\<`boolean`\>

##### Returns

\{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

#### 690.formatters.transaction.type

> **type**: `"transaction"`

#### 690.formatters.transactionReceipt

> `readonly` **transactionReceipt**: `object`

#### 690.formatters.transactionReceipt.exclude

> **exclude**: `undefined` \| \[\]

#### 690.formatters.transactionReceipt.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`OpStackRpcTransactionReceipt`

##### Returns

`object`

###### blobGasPrice?

> `optional` **blobGasPrice**: `bigint`

###### blobGasUsed?

> `optional` **blobGasUsed**: `bigint`

###### blockHash

> **blockHash**: `` `0x${string}` ``

###### blockNumber

> **blockNumber**: `bigint`

###### contractAddress

> **contractAddress**: `undefined` \| `null` \| `` `0x${string}` ``

###### cumulativeGasUsed

> **cumulativeGasUsed**: `bigint`

###### effectiveGasPrice

> **effectiveGasPrice**: `bigint`

###### from

> **from**: `` `0x${string}` ``

###### gasUsed

> **gasUsed**: `bigint`

###### l1Fee

> **l1Fee**: `null` \| `bigint`

###### l1FeeScalar

> **l1FeeScalar**: `null` \| `number`

###### l1GasPrice

> **l1GasPrice**: `null` \| `bigint`

###### l1GasUsed

> **l1GasUsed**: `null` \| `bigint`

###### logs

> **logs**: `Log`\<`bigint`, `number`, `false`, `undefined`, `undefined`, `undefined`, `undefined`\>[]

###### logsBloom

> **logsBloom**: `` `0x${string}` ``

###### root?

> `optional` **root**: `` `0x${string}` ``

###### status

> **status**: `"success"` \| `"reverted"`

###### to

> **to**: `null` \| `` `0x${string}` ``

###### transactionHash

> **transactionHash**: `` `0x${string}` ``

###### transactionIndex

> **transactionIndex**: `number`

###### type

> **type**: `TransactionType`

#### 690.formatters.transactionReceipt.type

> **type**: `"transactionReceipt"`

#### 690.id

> **id**: `690`

#### 690.name

> **name**: `"Redstone"`

#### 690.nativeCurrency

> **nativeCurrency**: `object`

#### 690.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 690.nativeCurrency.name

> `readonly` **name**: `"Ether"`

#### 690.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 690.rpcUrls

> **rpcUrls**: `object`

#### 690.rpcUrls.default

> `readonly` **default**: `object`

#### 690.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.redstonechain.com"`\]

#### 690.rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly \[`"wss://rpc.redstonechain.com"`\]

#### 690.serializers

> **serializers**: `object`

#### 690.serializers.transaction()

> `readonly` **transaction**: (`transaction`, `signature?`) => `` `0x02${string}` `` \| `` `0x01${string}` `` \| `` `0x03${string}` `` \| `` `0x04${string}` `` \| `TransactionSerializedLegacy` \| `` `0x7e${string}` ``

##### Parameters

###### transaction

`OpStackTransactionSerializable`

###### signature?

`Signature`

##### Returns

`` `0x02${string}` `` \| `` `0x01${string}` `` \| `` `0x03${string}` `` \| `` `0x04${string}` `` \| `TransactionSerializedLegacy` \| `` `0x7e${string}` ``

#### 690.sourceId

> **sourceId**: `1`

#### 690.testnet?

> `optional` **testnet**: `boolean`

### 7

> **7**: `object` = `chains.thaiChain`

#### 7.blockExplorers

> **blockExplorers**: `object`

#### 7.blockExplorers.default

> `readonly` **default**: `object`

#### 7.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://exp.thaichain.org/api"`

#### 7.blockExplorers.default.name

> `readonly` **name**: `"Blockscout"`

#### 7.blockExplorers.default.url

> `readonly` **url**: `"https://exp.thaichain.org"`

#### 7.contracts

> **contracts**: `object`

#### 7.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 7.contracts.multicall3.address

> `readonly` **address**: `"0x0DaD6130e832c21719C5CE3bae93454E16A84826"`

#### 7.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `4806386`

#### 7.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 7.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 7.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 7.formatters?

> `optional` **formatters**: `undefined`

#### 7.id

> **id**: `7`

#### 7.name

> **name**: `"ThaiChain"`

#### 7.nativeCurrency

> **nativeCurrency**: `object`

#### 7.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 7.nativeCurrency.name

> `readonly` **name**: `"TCH"`

#### 7.nativeCurrency.symbol

> `readonly` **symbol**: `"TCH"`

#### 7.rpcUrls

> **rpcUrls**: `object`

#### 7.rpcUrls.default

> `readonly` **default**: `object`

#### 7.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.thaichain.org"`\]

#### 7.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 7.sourceId?

> `optional` **sourceId**: `number`

#### 7.testnet

> **testnet**: `false`

### 7000

> **7000**: `object` = `chains.zetachain`

#### 7000.blockExplorers

> **blockExplorers**: `object`

#### 7000.blockExplorers.default

> `readonly` **default**: `object`

#### 7000.blockExplorers.default.name

> `readonly` **name**: `"ZetaScan"`

#### 7000.blockExplorers.default.url

> `readonly` **url**: `"https://explorer.zetachain.com"`

#### 7000.contracts

> **contracts**: `object`

#### 7000.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 7000.contracts.multicall3.address

> `readonly` **address**: `"0xcA11bde05977b3631167028862bE2a173976CA11"`

#### 7000.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `1632781`

#### 7000.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 7000.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 7000.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 7000.formatters?

> `optional` **formatters**: `undefined`

#### 7000.id

> **id**: `7000`

#### 7000.name

> **name**: `"ZetaChain"`

#### 7000.nativeCurrency

> **nativeCurrency**: `object`

#### 7000.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 7000.nativeCurrency.name

> `readonly` **name**: `"Zeta"`

#### 7000.nativeCurrency.symbol

> `readonly` **symbol**: `"ZETA"`

#### 7000.rpcUrls

> **rpcUrls**: `object`

#### 7000.rpcUrls.default

> `readonly` **default**: `object`

#### 7000.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://zetachain-evm.blockpi.network/v1/rpc/public"`\]

#### 7000.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 7000.sourceId?

> `optional` **sourceId**: `number`

#### 7000.testnet

> **testnet**: `false`

### 701

> **701**: `object` = `chains.koi`

#### 701.blockExplorers

> **blockExplorers**: `object`

#### 701.blockExplorers.default

> `readonly` **default**: `object`

#### 701.blockExplorers.default.name

> `readonly` **name**: `"Blockscout"`

#### 701.blockExplorers.default.url

> `readonly` **url**: `"https://koi-scan.darwinia.network"`

#### 701.contracts

> **contracts**: `object`

#### 701.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 701.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 701.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `180001`

#### 701.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 701.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 701.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 701.formatters?

> `optional` **formatters**: `undefined`

#### 701.id

> **id**: `701`

#### 701.name

> **name**: `"Koi Network"`

#### 701.nativeCurrency

> **nativeCurrency**: `object`

#### 701.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 701.nativeCurrency.name

> `readonly` **name**: `"Koi Network Native Token"`

#### 701.nativeCurrency.symbol

> `readonly` **symbol**: `"KRING"`

#### 701.rpcUrls

> **rpcUrls**: `object`

#### 701.rpcUrls.default

> `readonly` **default**: `object`

#### 701.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://koi-rpc.darwinia.network"`\]

#### 701.rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly \[`"wss://koi-rpc.darwinia.network"`\]

#### 701.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 701.sourceId?

> `optional` **sourceId**: `number`

#### 701.testnet

> **testnet**: `true`

### 713715

> **713715**: `object` = `chains.seiDevnet`

#### 713715.blockExplorers

> **blockExplorers**: `object`

#### 713715.blockExplorers.default

> `readonly` **default**: `object`

#### 713715.blockExplorers.default.name

> `readonly` **name**: `"Seitrace"`

#### 713715.blockExplorers.default.url

> `readonly` **url**: `"https://seitrace.com"`

#### 713715.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 713715.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 713715.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 713715.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 713715.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 713715.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 713715.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 713715.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 713715.formatters?

> `optional` **formatters**: `undefined`

#### 713715.id

> **id**: `713715`

#### 713715.name

> **name**: `"Sei Devnet"`

#### 713715.nativeCurrency

> **nativeCurrency**: `object`

#### 713715.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 713715.nativeCurrency.name

> `readonly` **name**: `"Sei"`

#### 713715.nativeCurrency.symbol

> `readonly` **symbol**: `"SEI"`

#### 713715.rpcUrls

> **rpcUrls**: `object`

#### 713715.rpcUrls.default

> `readonly` **default**: `object`

#### 713715.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://evm-rpc-arctic-1.sei-apis.com"`\]

#### 713715.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 713715.sourceId?

> `optional` **sourceId**: `number`

#### 713715.testnet

> **testnet**: `true`

### 721

> **721**: `object` = `chains.lycan`

#### 721.blockExplorers

> **blockExplorers**: `object`

#### 721.blockExplorers.default

> `readonly` **default**: `object`

#### 721.blockExplorers.default.name

> `readonly` **name**: `"Lycan Explorer"`

#### 721.blockExplorers.default.url

> `readonly` **url**: `"https://explorer.lycanchain.com"`

#### 721.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 721.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 721.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 721.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 721.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 721.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 721.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 721.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 721.formatters?

> `optional` **formatters**: `undefined`

#### 721.id

> **id**: `721`

#### 721.name

> **name**: `"Lycan"`

#### 721.nativeCurrency

> **nativeCurrency**: `object`

#### 721.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 721.nativeCurrency.name

> `readonly` **name**: `"Lycan"`

#### 721.nativeCurrency.symbol

> `readonly` **symbol**: `"LYC"`

#### 721.rpcUrls

> **rpcUrls**: `object`

#### 721.rpcUrls.default

> `readonly` **default**: `object`

#### 721.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.lycanchain.com"`, `"https://us-east.lycanchain.com"`, `"https://us-west.lycanchain.com"`, `"https://eu-north.lycanchain.com"`, `"https://eu-west.lycanchain.com"`, `"https://asia-southeast.lycanchain.com"`\]

#### 721.rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly \[`"wss://rpc.lycanchain.com"`, `"wss://us-east.lycanchain.com"`, `"wss://us-west.lycanchain.com"`, `"wss://eu-north.lycanchain.com"`, `"wss://eu-west.lycanchain.com"`, `"wss://asia-southeast.lycanchain.com"`\]

#### 721.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 721.sourceId?

> `optional` **sourceId**: `number`

#### 721.testnet?

> `optional` **testnet**: `boolean`

### 7332

> **7332**: `object` = `chains.eon`

#### 7332.blockExplorers

> **blockExplorers**: `object`

#### 7332.blockExplorers.default

> `readonly` **default**: `object`

#### 7332.blockExplorers.default.name

> `readonly` **name**: `"EON Explorer"`

#### 7332.blockExplorers.default.url

> `readonly` **url**: `"https://eon-explorer.horizenlabs.io"`

#### 7332.contracts

> **contracts**: `object`

#### 7332.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 7332.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 7332.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 7332.formatters?

> `optional` **formatters**: `undefined`

#### 7332.id

> **id**: `7332`

#### 7332.name

> **name**: `"Horizen EON"`

#### 7332.nativeCurrency

> **nativeCurrency**: `object`

#### 7332.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 7332.nativeCurrency.name

> `readonly` **name**: `"ZEN"`

#### 7332.nativeCurrency.symbol

> `readonly` **symbol**: `"ZEN"`

#### 7332.rpcUrls

> **rpcUrls**: `object`

#### 7332.rpcUrls.default

> `readonly` **default**: `object`

#### 7332.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://eon-rpc.horizenlabs.io/ethv1"`\]

#### 7332.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 7332.sourceId?

> `optional` **sourceId**: `number`

#### 7332.testnet?

> `optional` **testnet**: `boolean`

### 747

> **747**: `object` = `chains.flowMainnet`

#### 747.blockExplorers

> **blockExplorers**: `object`

#### 747.blockExplorers.default

> `readonly` **default**: `object`

#### 747.blockExplorers.default.name

> `readonly` **name**: `"Mainnet Explorer"`

#### 747.blockExplorers.default.url

> `readonly` **url**: `"https://evm.flowscan.io"`

#### 747.contracts

> **contracts**: `object`

#### 747.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 747.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 747.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `6205`

#### 747.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 747.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 747.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 747.formatters?

> `optional` **formatters**: `undefined`

#### 747.id

> **id**: `747`

#### 747.name

> **name**: `"Flow EVM Mainnet"`

#### 747.nativeCurrency

> **nativeCurrency**: `object`

#### 747.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 747.nativeCurrency.name

> `readonly` **name**: `"Flow"`

#### 747.nativeCurrency.symbol

> `readonly` **symbol**: `"FLOW"`

#### 747.rpcUrls

> **rpcUrls**: `object`

#### 747.rpcUrls.default

> `readonly` **default**: `object`

#### 747.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://mainnet.evm.nodes.onflow.org"`\]

#### 747.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 747.sourceId?

> `optional` **sourceId**: `number`

#### 747.testnet?

> `optional` **testnet**: `boolean`

### 7518

> **7518**: `object` = `chains.mev`

#### 7518.blockExplorers

> **blockExplorers**: `object`

#### 7518.blockExplorers.default

> `readonly` **default**: `object`

#### 7518.blockExplorers.default.name

> `readonly` **name**: `"Explorer"`

#### 7518.blockExplorers.default.url

> `readonly` **url**: `"https://www.meversescan.io"`

#### 7518.contracts

> **contracts**: `object`

#### 7518.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 7518.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 7518.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `86881340`

#### 7518.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 7518.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 7518.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 7518.formatters?

> `optional` **formatters**: `undefined`

#### 7518.id

> **id**: `7518`

#### 7518.name

> **name**: `"MEVerse Chain Mainnet"`

#### 7518.nativeCurrency

> **nativeCurrency**: `object`

#### 7518.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 7518.nativeCurrency.name

> `readonly` **name**: `"MEVerse"`

#### 7518.nativeCurrency.symbol

> `readonly` **symbol**: `"MEV"`

#### 7518.rpcUrls

> **rpcUrls**: `object`

#### 7518.rpcUrls.default

> `readonly` **default**: `object`

#### 7518.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.meversemainnet.io"`\]

#### 7518.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 7518.sourceId?

> `optional` **sourceId**: `number`

#### 7518.testnet?

> `optional` **testnet**: `boolean`

### 7560

> **7560**: `object` = `chains.cyber`

#### 7560.blockExplorers

> **blockExplorers**: `object`

#### 7560.blockExplorers.default

> `readonly` **default**: `object`

#### 7560.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://cyberscan.co/api"`

#### 7560.blockExplorers.default.name

> `readonly` **name**: `"Blockscout"`

#### 7560.blockExplorers.default.url

> `readonly` **url**: `"https://cyberscan.co"`

#### 7560.contracts

> **contracts**: `object`

#### 7560.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 7560.contracts.multicall3.address

> `readonly` **address**: `"0xcA11bde05977b3631167028862bE2a173976CA11"`

#### 7560.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `0`

#### 7560.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 7560.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 7560.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 7560.formatters?

> `optional` **formatters**: `undefined`

#### 7560.id

> **id**: `7560`

#### 7560.name

> **name**: `"Cyber"`

#### 7560.nativeCurrency

> **nativeCurrency**: `object`

#### 7560.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 7560.nativeCurrency.name

> `readonly` **name**: `"Ether"`

#### 7560.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 7560.rpcUrls

> **rpcUrls**: `object`

#### 7560.rpcUrls.default

> `readonly` **default**: `object`

#### 7560.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://cyber.alt.technology"`\]

#### 7560.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 7560.sourceId?

> `optional` **sourceId**: `number`

#### 7560.testnet?

> `optional` **testnet**: `boolean`

### 7668

> **7668**: `object` = `chains.root`

#### 7668.blockExplorers

> **blockExplorers**: `object`

#### 7668.blockExplorers.default

> `readonly` **default**: `object`

#### 7668.blockExplorers.default.name

> `readonly` **name**: `"Rootscan"`

#### 7668.blockExplorers.default.url

> `readonly` **url**: `"https://rootscan.io"`

#### 7668.contracts

> **contracts**: `object`

#### 7668.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 7668.contracts.multicall3.address

> `readonly` **address**: `"0xc9C2E2429AeC354916c476B30d729deDdC94988d"`

#### 7668.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `9218338`

#### 7668.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 7668.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 7668.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 7668.formatters?

> `optional` **formatters**: `undefined`

#### 7668.id

> **id**: `7668`

#### 7668.name

> **name**: `"The Root Network"`

#### 7668.nativeCurrency

> **nativeCurrency**: `object`

#### 7668.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 7668.nativeCurrency.name

> `readonly` **name**: `"XRP"`

#### 7668.nativeCurrency.symbol

> `readonly` **symbol**: `"XRP"`

#### 7668.rpcUrls

> **rpcUrls**: `object`

#### 7668.rpcUrls.default

> `readonly` **default**: `object`

#### 7668.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://root.rootnet.live/archive"`\]

#### 7668.rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly \[`"wss://root.rootnet.live/archive/ws"`\]

#### 7668.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 7668.sourceId?

> `optional` **sourceId**: `number`

#### 7668.testnet?

> `optional` **testnet**: `boolean`

### 7672

> **7672**: `object` = `chains.rootPorcini`

#### 7672.blockExplorers

> **blockExplorers**: `object`

#### 7672.blockExplorers.default

> `readonly` **default**: `object`

#### 7672.blockExplorers.default.name

> `readonly` **name**: `"Rootscan"`

#### 7672.blockExplorers.default.url

> `readonly` **url**: `"https://porcini.rootscan.io"`

#### 7672.contracts

> **contracts**: `object`

#### 7672.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 7672.contracts.multicall3.address

> `readonly` **address**: `"0xc9C2E2429AeC354916c476B30d729deDdC94988d"`

#### 7672.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `10555692`

#### 7672.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 7672.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 7672.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 7672.formatters?

> `optional` **formatters**: `undefined`

#### 7672.id

> **id**: `7672`

#### 7672.name

> **name**: `"The Root Network - Porcini"`

#### 7672.nativeCurrency

> **nativeCurrency**: `object`

#### 7672.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 7672.nativeCurrency.name

> `readonly` **name**: `"XRP"`

#### 7672.nativeCurrency.symbol

> `readonly` **symbol**: `"XRP"`

#### 7672.rpcUrls

> **rpcUrls**: `object`

#### 7672.rpcUrls.default

> `readonly` **default**: `object`

#### 7672.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://porcini.rootnet.app/archive"`\]

#### 7672.rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly \[`"wss://porcini.rootnet.app/archive/ws"`\]

#### 7672.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 7672.sourceId?

> `optional` **sourceId**: `number`

#### 7672.testnet

> **testnet**: `true`

### 7700

> **7700**: `object` = `chains.canto`

#### 7700.blockExplorers

> **blockExplorers**: `object`

#### 7700.blockExplorers.default

> `readonly` **default**: `object`

#### 7700.blockExplorers.default.name

> `readonly` **name**: `"Tuber.Build (Blockscout)"`

#### 7700.blockExplorers.default.url

> `readonly` **url**: `"https://tuber.build"`

#### 7700.contracts

> **contracts**: `object`

#### 7700.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 7700.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 7700.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `2905789`

#### 7700.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 7700.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 7700.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 7700.formatters?

> `optional` **formatters**: `undefined`

#### 7700.id

> **id**: `7700`

#### 7700.name

> **name**: `"Canto"`

#### 7700.nativeCurrency

> **nativeCurrency**: `object`

#### 7700.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 7700.nativeCurrency.name

> `readonly` **name**: `"Canto"`

#### 7700.nativeCurrency.symbol

> `readonly` **symbol**: `"CANTO"`

#### 7700.rpcUrls

> **rpcUrls**: `object`

#### 7700.rpcUrls.default

> `readonly` **default**: `object`

#### 7700.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://canto.gravitychain.io"`\]

#### 7700.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 7700.sourceId?

> `optional` **sourceId**: `number`

#### 7700.testnet?

> `optional` **testnet**: `boolean`

### 7777777

> **7777777**: `object` = `chains.zora`

#### 7777777.blockExplorers

> **blockExplorers**: `object`

#### 7777777.blockExplorers.default

> `readonly` **default**: `object`

#### 7777777.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://explorer.zora.energy/api"`

#### 7777777.blockExplorers.default.name

> `readonly` **name**: `"Explorer"`

#### 7777777.blockExplorers.default.url

> `readonly` **url**: `"https://explorer.zora.energy"`

#### 7777777.contracts

> **contracts**: `object`

#### 7777777.contracts.gasPriceOracle

> `readonly` **gasPriceOracle**: `object`

#### 7777777.contracts.gasPriceOracle.address

> `readonly` **address**: `"0x420000000000000000000000000000000000000F"`

#### 7777777.contracts.l1Block

> `readonly` **l1Block**: `object`

#### 7777777.contracts.l1Block.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000015"`

#### 7777777.contracts.l1StandardBridge

> `readonly` **l1StandardBridge**: `object`

#### 7777777.contracts.l1StandardBridge.1

> `readonly` **1**: `object`

#### 7777777.contracts.l1StandardBridge.1.address

> `readonly` **address**: `"0x3e2Ea9B92B7E48A52296fD261dc26fd995284631"`

#### 7777777.contracts.l2CrossDomainMessenger

> `readonly` **l2CrossDomainMessenger**: `object`

#### 7777777.contracts.l2CrossDomainMessenger.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000007"`

#### 7777777.contracts.l2Erc721Bridge

> `readonly` **l2Erc721Bridge**: `object`

#### 7777777.contracts.l2Erc721Bridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000014"`

#### 7777777.contracts.l2OutputOracle

> `readonly` **l2OutputOracle**: `object`

#### 7777777.contracts.l2OutputOracle.1

> `readonly` **1**: `object`

#### 7777777.contracts.l2OutputOracle.1.address

> `readonly` **address**: `"0x9E6204F750cD866b299594e2aC9eA824E2e5f95c"`

#### 7777777.contracts.l2StandardBridge

> `readonly` **l2StandardBridge**: `object`

#### 7777777.contracts.l2StandardBridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000010"`

#### 7777777.contracts.l2ToL1MessagePasser

> `readonly` **l2ToL1MessagePasser**: `object`

#### 7777777.contracts.l2ToL1MessagePasser.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000016"`

#### 7777777.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 7777777.contracts.multicall3.address

> `readonly` **address**: `"0xcA11bde05977b3631167028862bE2a173976CA11"`

#### 7777777.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `5882`

#### 7777777.contracts.portal

> `readonly` **portal**: `object`

#### 7777777.contracts.portal.1

> `readonly` **1**: `object`

#### 7777777.contracts.portal.1.address

> `readonly` **address**: `"0x1a0ad011913A150f69f6A19DF447A0CfD9551054"`

#### 7777777.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 7777777.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 7777777.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 7777777.formatters

> **formatters**: `object`

#### 7777777.formatters.block

> `readonly` **block**: `object`

#### 7777777.formatters.block.exclude

> **exclude**: `undefined` \| \[\]

#### 7777777.formatters.block.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`OpStackRpcBlock`\<`BlockTag`, `boolean`\>

##### Returns

`object`

###### baseFeePerGas

> **baseFeePerGas**: `null` \| `bigint`

###### blobGasUsed

> **blobGasUsed**: `bigint`

###### difficulty

> **difficulty**: `bigint`

###### excessBlobGas

> **excessBlobGas**: `bigint`

###### extraData

> **extraData**: `` `0x${string}` ``

###### gasLimit

> **gasLimit**: `bigint`

###### gasUsed

> **gasUsed**: `bigint`

###### hash

> **hash**: `null` \| `` `0x${string}` ``

###### logsBloom

> **logsBloom**: `null` \| `` `0x${string}` ``

###### miner

> **miner**: `` `0x${string}` ``

###### mixHash

> **mixHash**: `` `0x${string}` ``

###### nonce

> **nonce**: `null` \| `` `0x${string}` ``

###### number

> **number**: `null` \| `bigint`

###### parentBeaconBlockRoot?

> `optional` **parentBeaconBlockRoot**: `` `0x${string}` ``

###### parentHash

> **parentHash**: `` `0x${string}` ``

###### receiptsRoot

> **receiptsRoot**: `` `0x${string}` ``

###### sealFields

> **sealFields**: `` `0x${string}` ``[]

###### sha3Uncles

> **sha3Uncles**: `` `0x${string}` ``

###### size

> **size**: `bigint`

###### stateRoot

> **stateRoot**: `` `0x${string}` ``

###### timestamp

> **timestamp**: `bigint`

###### totalDifficulty

> **totalDifficulty**: `null` \| `bigint`

###### transactions

> **transactions**: `` `0x${string}` ``[] \| `OpStackTransaction`\<`boolean`\>[]

###### transactionsRoot

> **transactionsRoot**: `` `0x${string}` ``

###### uncles

> **uncles**: `` `0x${string}` ``[]

###### withdrawals?

> `optional` **withdrawals**: `Withdrawal`[]

###### withdrawalsRoot?

> `optional` **withdrawalsRoot**: `` `0x${string}` ``

#### 7777777.formatters.block.type

> **type**: `"block"`

#### 7777777.formatters.transaction

> `readonly` **transaction**: `object`

#### 7777777.formatters.transaction.exclude

> **exclude**: `undefined` \| \[\]

#### 7777777.formatters.transaction.format()

> **format**: (`args`) => \{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

##### Parameters

###### args

`OpStackRpcTransaction`\<`boolean`\>

##### Returns

\{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

#### 7777777.formatters.transaction.type

> **type**: `"transaction"`

#### 7777777.formatters.transactionReceipt

> `readonly` **transactionReceipt**: `object`

#### 7777777.formatters.transactionReceipt.exclude

> **exclude**: `undefined` \| \[\]

#### 7777777.formatters.transactionReceipt.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`OpStackRpcTransactionReceipt`

##### Returns

`object`

###### blobGasPrice?

> `optional` **blobGasPrice**: `bigint`

###### blobGasUsed?

> `optional` **blobGasUsed**: `bigint`

###### blockHash

> **blockHash**: `` `0x${string}` ``

###### blockNumber

> **blockNumber**: `bigint`

###### contractAddress

> **contractAddress**: `undefined` \| `null` \| `` `0x${string}` ``

###### cumulativeGasUsed

> **cumulativeGasUsed**: `bigint`

###### effectiveGasPrice

> **effectiveGasPrice**: `bigint`

###### from

> **from**: `` `0x${string}` ``

###### gasUsed

> **gasUsed**: `bigint`

###### l1Fee

> **l1Fee**: `null` \| `bigint`

###### l1FeeScalar

> **l1FeeScalar**: `null` \| `number`

###### l1GasPrice

> **l1GasPrice**: `null` \| `bigint`

###### l1GasUsed

> **l1GasUsed**: `null` \| `bigint`

###### logs

> **logs**: `Log`\<`bigint`, `number`, `false`, `undefined`, `undefined`, `undefined`, `undefined`\>[]

###### logsBloom

> **logsBloom**: `` `0x${string}` ``

###### root?

> `optional` **root**: `` `0x${string}` ``

###### status

> **status**: `"success"` \| `"reverted"`

###### to

> **to**: `null` \| `` `0x${string}` ``

###### transactionHash

> **transactionHash**: `` `0x${string}` ``

###### transactionIndex

> **transactionIndex**: `number`

###### type

> **type**: `TransactionType`

#### 7777777.formatters.transactionReceipt.type

> **type**: `"transactionReceipt"`

#### 7777777.id

> **id**: `7777777`

#### 7777777.name

> **name**: `"Zora"`

#### 7777777.nativeCurrency

> **nativeCurrency**: `object`

#### 7777777.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 7777777.nativeCurrency.name

> `readonly` **name**: `"Ether"`

#### 7777777.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 7777777.rpcUrls

> **rpcUrls**: `object`

#### 7777777.rpcUrls.default

> `readonly` **default**: `object`

#### 7777777.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.zora.energy"`\]

#### 7777777.rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly \[`"wss://rpc.zora.energy"`\]

#### 7777777.serializers

> **serializers**: `object`

#### 7777777.serializers.transaction()

> `readonly` **transaction**: (`transaction`, `signature?`) => `` `0x02${string}` `` \| `` `0x01${string}` `` \| `` `0x03${string}` `` \| `` `0x04${string}` `` \| `TransactionSerializedLegacy` \| `` `0x7e${string}` ``

##### Parameters

###### transaction

`OpStackTransactionSerializable`

###### signature?

`Signature`

##### Returns

`` `0x02${string}` `` \| `` `0x01${string}` `` \| `` `0x03${string}` `` \| `` `0x04${string}` `` \| `TransactionSerializedLegacy` \| `` `0x7e${string}` ``

#### 7777777.sourceId

> **sourceId**: `1`

#### 7777777.testnet?

> `optional` **testnet**: `boolean`

### 787

> **787**: `object` = `chains.acala`

#### 787.blockExplorers

> **blockExplorers**: `object`

#### 787.blockExplorers.default

> `readonly` **default**: `object`

#### 787.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://blockscout.acala.network/api"`

#### 787.blockExplorers.default.name

> `readonly` **name**: `"Acala Blockscout"`

#### 787.blockExplorers.default.url

> `readonly` **url**: `"https://blockscout.acala.network"`

#### 787.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 787.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 787.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 787.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 787.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 787.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 787.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 787.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 787.formatters?

> `optional` **formatters**: `undefined`

#### 787.id

> **id**: `787`

#### 787.name

> **name**: `"Acala"`

#### 787.nativeCurrency

> **nativeCurrency**: `object`

#### 787.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 787.nativeCurrency.name

> `readonly` **name**: `"Acala"`

#### 787.nativeCurrency.symbol

> `readonly` **symbol**: `"ACA"`

#### 787.network

> `readonly` **network**: `"acala"`

#### 787.rpcUrls

> **rpcUrls**: `object`

#### 787.rpcUrls.default

> `readonly` **default**: `object`

#### 787.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://eth-rpc-acala.aca-api.network"`\]

#### 787.rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly \[`"wss://eth-rpc-acala.aca-api.network"`\]

#### 787.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 787.sourceId?

> `optional` **sourceId**: `number`

#### 787.testnet

> **testnet**: `false`

### 80002

> **80002**: `object` = `chains.polygonAmoy`

#### 80002.blockExplorers

> **blockExplorers**: `object`

#### 80002.blockExplorers.default

> `readonly` **default**: `object`

#### 80002.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://api-amoy.polygonscan.com/api"`

#### 80002.blockExplorers.default.name

> `readonly` **name**: `"PolygonScan"`

#### 80002.blockExplorers.default.url

> `readonly` **url**: `"https://amoy.polygonscan.com"`

#### 80002.contracts

> **contracts**: `object`

#### 80002.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 80002.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 80002.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `3127388`

#### 80002.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 80002.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 80002.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 80002.formatters?

> `optional` **formatters**: `undefined`

#### 80002.id

> **id**: `80002`

#### 80002.name

> **name**: `"Polygon Amoy"`

#### 80002.nativeCurrency

> **nativeCurrency**: `object`

#### 80002.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 80002.nativeCurrency.name

> `readonly` **name**: `"POL"`

#### 80002.nativeCurrency.symbol

> `readonly` **symbol**: `"POL"`

#### 80002.rpcUrls

> **rpcUrls**: `object`

#### 80002.rpcUrls.default

> `readonly` **default**: `object`

#### 80002.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc-amoy.polygon.technology"`\]

#### 80002.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 80002.sourceId?

> `optional` **sourceId**: `number`

#### 80002.testnet

> **testnet**: `true`

### 810181

> **810181**: `object` = `chains.zkLinkNovaSepoliaTestnet`

#### 810181.blockExplorers

> **blockExplorers**: `object`

#### 810181.blockExplorers.default

> `readonly` **default**: `object`

#### 810181.blockExplorers.default.name

> `readonly` **name**: `"zkLink Nova Block Explorer"`

#### 810181.blockExplorers.default.url

> `readonly` **url**: `"https://sepolia.explorer.zklink.io"`

#### 810181.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 810181.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 810181.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 810181.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 810181.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 810181.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 810181.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 810181.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 810181.formatters?

> `optional` **formatters**: `undefined`

#### 810181.id

> **id**: `810181`

#### 810181.name

> **name**: `"zkLink Nova Sepolia Testnet"`

#### 810181.nativeCurrency

> **nativeCurrency**: `object`

#### 810181.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 810181.nativeCurrency.name

> `readonly` **name**: `"ETH"`

#### 810181.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 810181.rpcUrls

> **rpcUrls**: `object`

#### 810181.rpcUrls.default

> `readonly` **default**: `object`

#### 810181.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://sepolia.rpc.zklink.io"`\]

#### 810181.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 810181.sourceId?

> `optional` **sourceId**: `number`

#### 810181.testnet?

> `optional` **testnet**: `boolean`

### 81457

> **81457**: `object` = `chains.blast`

#### 81457.blockExplorers

> **blockExplorers**: `object`

#### 81457.blockExplorers.default

> `readonly` **default**: `object`

#### 81457.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://api.blastscan.io/api"`

#### 81457.blockExplorers.default.name

> `readonly` **name**: `"Blastscan"`

#### 81457.blockExplorers.default.url

> `readonly` **url**: `"https://blastscan.io"`

#### 81457.contracts

> **contracts**: `object`

#### 81457.contracts.gasPriceOracle

> `readonly` **gasPriceOracle**: `object`

#### 81457.contracts.gasPriceOracle.address

> `readonly` **address**: `"0x420000000000000000000000000000000000000F"`

#### 81457.contracts.l1Block

> `readonly` **l1Block**: `object`

#### 81457.contracts.l1Block.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000015"`

#### 81457.contracts.l2CrossDomainMessenger

> `readonly` **l2CrossDomainMessenger**: `object`

#### 81457.contracts.l2CrossDomainMessenger.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000007"`

#### 81457.contracts.l2Erc721Bridge

> `readonly` **l2Erc721Bridge**: `object`

#### 81457.contracts.l2Erc721Bridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000014"`

#### 81457.contracts.l2StandardBridge

> `readonly` **l2StandardBridge**: `object`

#### 81457.contracts.l2StandardBridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000010"`

#### 81457.contracts.l2ToL1MessagePasser

> `readonly` **l2ToL1MessagePasser**: `object`

#### 81457.contracts.l2ToL1MessagePasser.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000016"`

#### 81457.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 81457.contracts.multicall3.address

> `readonly` **address**: `"0xcA11bde05977b3631167028862bE2a173976CA11"`

#### 81457.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `212929`

#### 81457.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 81457.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 81457.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 81457.formatters

> **formatters**: `object`

#### 81457.formatters.block

> `readonly` **block**: `object`

#### 81457.formatters.block.exclude

> **exclude**: `undefined` \| \[\]

#### 81457.formatters.block.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`OpStackRpcBlock`\<`BlockTag`, `boolean`\>

##### Returns

`object`

###### baseFeePerGas

> **baseFeePerGas**: `null` \| `bigint`

###### blobGasUsed

> **blobGasUsed**: `bigint`

###### difficulty

> **difficulty**: `bigint`

###### excessBlobGas

> **excessBlobGas**: `bigint`

###### extraData

> **extraData**: `` `0x${string}` ``

###### gasLimit

> **gasLimit**: `bigint`

###### gasUsed

> **gasUsed**: `bigint`

###### hash

> **hash**: `null` \| `` `0x${string}` ``

###### logsBloom

> **logsBloom**: `null` \| `` `0x${string}` ``

###### miner

> **miner**: `` `0x${string}` ``

###### mixHash

> **mixHash**: `` `0x${string}` ``

###### nonce

> **nonce**: `null` \| `` `0x${string}` ``

###### number

> **number**: `null` \| `bigint`

###### parentBeaconBlockRoot?

> `optional` **parentBeaconBlockRoot**: `` `0x${string}` ``

###### parentHash

> **parentHash**: `` `0x${string}` ``

###### receiptsRoot

> **receiptsRoot**: `` `0x${string}` ``

###### sealFields

> **sealFields**: `` `0x${string}` ``[]

###### sha3Uncles

> **sha3Uncles**: `` `0x${string}` ``

###### size

> **size**: `bigint`

###### stateRoot

> **stateRoot**: `` `0x${string}` ``

###### timestamp

> **timestamp**: `bigint`

###### totalDifficulty

> **totalDifficulty**: `null` \| `bigint`

###### transactions

> **transactions**: `` `0x${string}` ``[] \| `OpStackTransaction`\<`boolean`\>[]

###### transactionsRoot

> **transactionsRoot**: `` `0x${string}` ``

###### uncles

> **uncles**: `` `0x${string}` ``[]

###### withdrawals?

> `optional` **withdrawals**: `Withdrawal`[]

###### withdrawalsRoot?

> `optional` **withdrawalsRoot**: `` `0x${string}` ``

#### 81457.formatters.block.type

> **type**: `"block"`

#### 81457.formatters.transaction

> `readonly` **transaction**: `object`

#### 81457.formatters.transaction.exclude

> **exclude**: `undefined` \| \[\]

#### 81457.formatters.transaction.format()

> **format**: (`args`) => \{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

##### Parameters

###### args

`OpStackRpcTransaction`\<`boolean`\>

##### Returns

\{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

#### 81457.formatters.transaction.type

> **type**: `"transaction"`

#### 81457.formatters.transactionReceipt

> `readonly` **transactionReceipt**: `object`

#### 81457.formatters.transactionReceipt.exclude

> **exclude**: `undefined` \| \[\]

#### 81457.formatters.transactionReceipt.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`OpStackRpcTransactionReceipt`

##### Returns

`object`

###### blobGasPrice?

> `optional` **blobGasPrice**: `bigint`

###### blobGasUsed?

> `optional` **blobGasUsed**: `bigint`

###### blockHash

> **blockHash**: `` `0x${string}` ``

###### blockNumber

> **blockNumber**: `bigint`

###### contractAddress

> **contractAddress**: `undefined` \| `null` \| `` `0x${string}` ``

###### cumulativeGasUsed

> **cumulativeGasUsed**: `bigint`

###### effectiveGasPrice

> **effectiveGasPrice**: `bigint`

###### from

> **from**: `` `0x${string}` ``

###### gasUsed

> **gasUsed**: `bigint`

###### l1Fee

> **l1Fee**: `null` \| `bigint`

###### l1FeeScalar

> **l1FeeScalar**: `null` \| `number`

###### l1GasPrice

> **l1GasPrice**: `null` \| `bigint`

###### l1GasUsed

> **l1GasUsed**: `null` \| `bigint`

###### logs

> **logs**: `Log`\<`bigint`, `number`, `false`, `undefined`, `undefined`, `undefined`, `undefined`\>[]

###### logsBloom

> **logsBloom**: `` `0x${string}` ``

###### root?

> `optional` **root**: `` `0x${string}` ``

###### status

> **status**: `"success"` \| `"reverted"`

###### to

> **to**: `null` \| `` `0x${string}` ``

###### transactionHash

> **transactionHash**: `` `0x${string}` ``

###### transactionIndex

> **transactionIndex**: `number`

###### type

> **type**: `TransactionType`

#### 81457.formatters.transactionReceipt.type

> **type**: `"transactionReceipt"`

#### 81457.id

> **id**: `81457`

#### 81457.name

> **name**: `"Blast"`

#### 81457.nativeCurrency

> **nativeCurrency**: `object`

#### 81457.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 81457.nativeCurrency.name

> `readonly` **name**: `"Ether"`

#### 81457.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 81457.rpcUrls

> **rpcUrls**: `object`

#### 81457.rpcUrls.default

> `readonly` **default**: `object`

#### 81457.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.blast.io"`\]

#### 81457.serializers

> **serializers**: `object`

#### 81457.serializers.transaction()

> `readonly` **transaction**: (`transaction`, `signature?`) => `` `0x02${string}` `` \| `` `0x01${string}` `` \| `` `0x03${string}` `` \| `` `0x04${string}` `` \| `TransactionSerializedLegacy` \| `` `0x7e${string}` ``

##### Parameters

###### transaction

`OpStackTransactionSerializable`

###### signature?

`Signature`

##### Returns

`` `0x02${string}` `` \| `` `0x01${string}` `` \| `` `0x03${string}` `` \| `` `0x04${string}` `` \| `TransactionSerializedLegacy` \| `` `0x7e${string}` ``

#### 81457.sourceId

> **sourceId**: `1`

#### 81457.testnet?

> `optional` **testnet**: `boolean`

### 82

> **82**: `object` = `chains.meter`

#### 82.blockExplorers

> **blockExplorers**: `object`

#### 82.blockExplorers.default

> `readonly` **default**: `object`

#### 82.blockExplorers.default.name

> `readonly` **name**: `"MeterScan"`

#### 82.blockExplorers.default.url

> `readonly` **url**: `"https://scan.meter.io"`

#### 82.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 82.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 82.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 82.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 82.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 82.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 82.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 82.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 82.formatters?

> `optional` **formatters**: `undefined`

#### 82.id

> **id**: `82`

#### 82.name

> **name**: `"Meter"`

#### 82.nativeCurrency

> **nativeCurrency**: `object`

#### 82.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 82.nativeCurrency.name

> `readonly` **name**: `"MTR"`

#### 82.nativeCurrency.symbol

> `readonly` **symbol**: `"MTR"`

#### 82.rpcUrls

> **rpcUrls**: `object`

#### 82.rpcUrls.default

> `readonly` **default**: `object`

#### 82.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.meter.io"`\]

#### 82.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 82.sourceId?

> `optional` **sourceId**: `number`

#### 82.testnet?

> `optional` **testnet**: `boolean`

### 8217

> **8217**: `object` = `chains.klaytn`

#### 8217.blockExplorers

> **blockExplorers**: `object`

#### 8217.blockExplorers.default

> `readonly` **default**: `object`

#### 8217.blockExplorers.default.name

> `readonly` **name**: `"KlaytnScope"`

#### 8217.blockExplorers.default.url

> `readonly` **url**: `"https://scope.klaytn.com"`

#### 8217.contracts

> **contracts**: `object`

#### 8217.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 8217.contracts.multicall3.address

> `readonly` **address**: `"0xcA11bde05977b3631167028862bE2a173976CA11"`

#### 8217.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `96002415`

#### 8217.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 8217.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 8217.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 8217.formatters?

> `optional` **formatters**: `undefined`

#### 8217.id

> **id**: `8217`

#### 8217.name

> **name**: `"Klaytn"`

#### 8217.nativeCurrency

> **nativeCurrency**: `object`

#### 8217.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 8217.nativeCurrency.name

> `readonly` **name**: `"Klaytn"`

#### 8217.nativeCurrency.symbol

> `readonly` **symbol**: `"KLAY"`

#### 8217.rpcUrls

> **rpcUrls**: `object`

#### 8217.rpcUrls.default

> `readonly` **default**: `object`

#### 8217.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://public-en-cypress.klaytn.net"`\]

#### 8217.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 8217.sourceId?

> `optional` **sourceId**: `number`

#### 8217.testnet?

> `optional` **testnet**: `boolean`

### 841

> **841**: `object` = `chains.taraxa`

#### 841.blockExplorers

> **blockExplorers**: `object`

#### 841.blockExplorers.default

> `readonly` **default**: `object`

#### 841.blockExplorers.default.name

> `readonly` **name**: `"Taraxa Explorer"`

#### 841.blockExplorers.default.url

> `readonly` **url**: `"https://explorer.mainnet.taraxa.io"`

#### 841.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 841.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 841.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 841.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 841.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 841.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 841.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 841.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 841.formatters?

> `optional` **formatters**: `undefined`

#### 841.id

> **id**: `841`

#### 841.name

> **name**: `"Taraxa Mainnet"`

#### 841.nativeCurrency

> **nativeCurrency**: `object`

#### 841.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 841.nativeCurrency.name

> `readonly` **name**: `"Tara"`

#### 841.nativeCurrency.symbol

> `readonly` **symbol**: `"TARA"`

#### 841.rpcUrls

> **rpcUrls**: `object`

#### 841.rpcUrls.default

> `readonly` **default**: `object`

#### 841.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.mainnet.taraxa.io"`\]

#### 841.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 841.sourceId?

> `optional` **sourceId**: `number`

#### 841.testnet?

> `optional` **testnet**: `boolean`

### 8453

> **8453**: `object` = `chains.base`

#### 8453.blockExplorers

> **blockExplorers**: `object`

#### 8453.blockExplorers.default

> `readonly` **default**: `object`

#### 8453.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://api.basescan.org/api"`

#### 8453.blockExplorers.default.name

> `readonly` **name**: `"Basescan"`

#### 8453.blockExplorers.default.url

> `readonly` **url**: `"https://basescan.org"`

#### 8453.contracts

> **contracts**: `object`

#### 8453.contracts.disputeGameFactory

> `readonly` **disputeGameFactory**: `object`

#### 8453.contracts.disputeGameFactory.1

> `readonly` **1**: `object`

#### 8453.contracts.disputeGameFactory.1.address

> `readonly` **address**: `"0x43edB88C4B80fDD2AdFF2412A7BebF9dF42cB40e"`

#### 8453.contracts.gasPriceOracle

> `readonly` **gasPriceOracle**: `object`

#### 8453.contracts.gasPriceOracle.address

> `readonly` **address**: `"0x420000000000000000000000000000000000000F"`

#### 8453.contracts.l1Block

> `readonly` **l1Block**: `object`

#### 8453.contracts.l1Block.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000015"`

#### 8453.contracts.l1StandardBridge

> `readonly` **l1StandardBridge**: `object`

#### 8453.contracts.l1StandardBridge.1

> `readonly` **1**: `object`

#### 8453.contracts.l1StandardBridge.1.address

> `readonly` **address**: `"0x3154Cf16ccdb4C6d922629664174b904d80F2C35"`

#### 8453.contracts.l1StandardBridge.1.blockCreated

> `readonly` **blockCreated**: `17482143`

#### 8453.contracts.l2CrossDomainMessenger

> `readonly` **l2CrossDomainMessenger**: `object`

#### 8453.contracts.l2CrossDomainMessenger.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000007"`

#### 8453.contracts.l2Erc721Bridge

> `readonly` **l2Erc721Bridge**: `object`

#### 8453.contracts.l2Erc721Bridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000014"`

#### 8453.contracts.l2OutputOracle

> `readonly` **l2OutputOracle**: `object`

#### 8453.contracts.l2OutputOracle.1

> `readonly` **1**: `object`

#### 8453.contracts.l2OutputOracle.1.address

> `readonly` **address**: `"0x56315b90c40730925ec5485cf004d835058518A0"`

#### 8453.contracts.l2StandardBridge

> `readonly` **l2StandardBridge**: `object`

#### 8453.contracts.l2StandardBridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000010"`

#### 8453.contracts.l2ToL1MessagePasser

> `readonly` **l2ToL1MessagePasser**: `object`

#### 8453.contracts.l2ToL1MessagePasser.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000016"`

#### 8453.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 8453.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 8453.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `5022`

#### 8453.contracts.portal

> `readonly` **portal**: `object`

#### 8453.contracts.portal.1

> `readonly` **1**: `object`

#### 8453.contracts.portal.1.address

> `readonly` **address**: `"0x49048044D57e1C92A77f79988d21Fa8fAF74E97e"`

#### 8453.contracts.portal.1.blockCreated

> `readonly` **blockCreated**: `17482143`

#### 8453.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 8453.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 8453.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 8453.formatters

> **formatters**: `object`

#### 8453.formatters.block

> `readonly` **block**: `object`

#### 8453.formatters.block.exclude

> **exclude**: `undefined` \| \[\]

#### 8453.formatters.block.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`OpStackRpcBlock`\<`BlockTag`, `boolean`\>

##### Returns

`object`

###### baseFeePerGas

> **baseFeePerGas**: `null` \| `bigint`

###### blobGasUsed

> **blobGasUsed**: `bigint`

###### difficulty

> **difficulty**: `bigint`

###### excessBlobGas

> **excessBlobGas**: `bigint`

###### extraData

> **extraData**: `` `0x${string}` ``

###### gasLimit

> **gasLimit**: `bigint`

###### gasUsed

> **gasUsed**: `bigint`

###### hash

> **hash**: `null` \| `` `0x${string}` ``

###### logsBloom

> **logsBloom**: `null` \| `` `0x${string}` ``

###### miner

> **miner**: `` `0x${string}` ``

###### mixHash

> **mixHash**: `` `0x${string}` ``

###### nonce

> **nonce**: `null` \| `` `0x${string}` ``

###### number

> **number**: `null` \| `bigint`

###### parentBeaconBlockRoot?

> `optional` **parentBeaconBlockRoot**: `` `0x${string}` ``

###### parentHash

> **parentHash**: `` `0x${string}` ``

###### receiptsRoot

> **receiptsRoot**: `` `0x${string}` ``

###### sealFields

> **sealFields**: `` `0x${string}` ``[]

###### sha3Uncles

> **sha3Uncles**: `` `0x${string}` ``

###### size

> **size**: `bigint`

###### stateRoot

> **stateRoot**: `` `0x${string}` ``

###### timestamp

> **timestamp**: `bigint`

###### totalDifficulty

> **totalDifficulty**: `null` \| `bigint`

###### transactions

> **transactions**: `` `0x${string}` ``[] \| `OpStackTransaction`\<`boolean`\>[]

###### transactionsRoot

> **transactionsRoot**: `` `0x${string}` ``

###### uncles

> **uncles**: `` `0x${string}` ``[]

###### withdrawals?

> `optional` **withdrawals**: `Withdrawal`[]

###### withdrawalsRoot?

> `optional` **withdrawalsRoot**: `` `0x${string}` ``

#### 8453.formatters.block.type

> **type**: `"block"`

#### 8453.formatters.transaction

> `readonly` **transaction**: `object`

#### 8453.formatters.transaction.exclude

> **exclude**: `undefined` \| \[\]

#### 8453.formatters.transaction.format()

> **format**: (`args`) => \{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

##### Parameters

###### args

`OpStackRpcTransaction`\<`boolean`\>

##### Returns

\{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

#### 8453.formatters.transaction.type

> **type**: `"transaction"`

#### 8453.formatters.transactionReceipt

> `readonly` **transactionReceipt**: `object`

#### 8453.formatters.transactionReceipt.exclude

> **exclude**: `undefined` \| \[\]

#### 8453.formatters.transactionReceipt.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`OpStackRpcTransactionReceipt`

##### Returns

`object`

###### blobGasPrice?

> `optional` **blobGasPrice**: `bigint`

###### blobGasUsed?

> `optional` **blobGasUsed**: `bigint`

###### blockHash

> **blockHash**: `` `0x${string}` ``

###### blockNumber

> **blockNumber**: `bigint`

###### contractAddress

> **contractAddress**: `undefined` \| `null` \| `` `0x${string}` ``

###### cumulativeGasUsed

> **cumulativeGasUsed**: `bigint`

###### effectiveGasPrice

> **effectiveGasPrice**: `bigint`

###### from

> **from**: `` `0x${string}` ``

###### gasUsed

> **gasUsed**: `bigint`

###### l1Fee

> **l1Fee**: `null` \| `bigint`

###### l1FeeScalar

> **l1FeeScalar**: `null` \| `number`

###### l1GasPrice

> **l1GasPrice**: `null` \| `bigint`

###### l1GasUsed

> **l1GasUsed**: `null` \| `bigint`

###### logs

> **logs**: `Log`\<`bigint`, `number`, `false`, `undefined`, `undefined`, `undefined`, `undefined`\>[]

###### logsBloom

> **logsBloom**: `` `0x${string}` ``

###### root?

> `optional` **root**: `` `0x${string}` ``

###### status

> **status**: `"success"` \| `"reverted"`

###### to

> **to**: `null` \| `` `0x${string}` ``

###### transactionHash

> **transactionHash**: `` `0x${string}` ``

###### transactionIndex

> **transactionIndex**: `number`

###### type

> **type**: `TransactionType`

#### 8453.formatters.transactionReceipt.type

> **type**: `"transactionReceipt"`

#### 8453.id

> **id**: `8453`

#### 8453.name

> **name**: `"Base"`

#### 8453.nativeCurrency

> **nativeCurrency**: `object`

#### 8453.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 8453.nativeCurrency.name

> `readonly` **name**: `"Ether"`

#### 8453.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 8453.rpcUrls

> **rpcUrls**: `object`

#### 8453.rpcUrls.default

> `readonly` **default**: `object`

#### 8453.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://mainnet.base.org"`\]

#### 8453.serializers

> **serializers**: `object`

#### 8453.serializers.transaction()

> `readonly` **transaction**: (`transaction`, `signature?`) => `` `0x02${string}` `` \| `` `0x01${string}` `` \| `` `0x03${string}` `` \| `` `0x04${string}` `` \| `TransactionSerializedLegacy` \| `` `0x7e${string}` ``

##### Parameters

###### transaction

`OpStackTransactionSerializable`

###### signature?

`Signature`

##### Returns

`` `0x02${string}` `` \| `` `0x01${string}` `` \| `` `0x03${string}` `` \| `` `0x04${string}` `` \| `TransactionSerializedLegacy` \| `` `0x7e${string}` ``

#### 8453.sourceId

> **sourceId**: `1`

#### 8453.testnet?

> `optional` **testnet**: `boolean`

### 84531

> **84531**: `object` = `chains.baseGoerli`

#### 84531.blockExplorers

> **blockExplorers**: `object`

#### 84531.blockExplorers.default

> `readonly` **default**: `object`

#### 84531.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://goerli.basescan.org/api"`

#### 84531.blockExplorers.default.name

> `readonly` **name**: `"Basescan"`

#### 84531.blockExplorers.default.url

> `readonly` **url**: `"https://goerli.basescan.org"`

#### 84531.contracts

> **contracts**: `object`

#### 84531.contracts.gasPriceOracle

> `readonly` **gasPriceOracle**: `object`

#### 84531.contracts.gasPriceOracle.address

> `readonly` **address**: `"0x420000000000000000000000000000000000000F"`

#### 84531.contracts.l1Block

> `readonly` **l1Block**: `object`

#### 84531.contracts.l1Block.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000015"`

#### 84531.contracts.l1StandardBridge

> `readonly` **l1StandardBridge**: `object`

#### 84531.contracts.l1StandardBridge.5

> `readonly` **5**: `object`

#### 84531.contracts.l1StandardBridge.5.address

> `readonly` **address**: `"0xfA6D8Ee5BE770F84FC001D098C4bD604Fe01284a"`

#### 84531.contracts.l2CrossDomainMessenger

> `readonly` **l2CrossDomainMessenger**: `object`

#### 84531.contracts.l2CrossDomainMessenger.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000007"`

#### 84531.contracts.l2Erc721Bridge

> `readonly` **l2Erc721Bridge**: `object`

#### 84531.contracts.l2Erc721Bridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000014"`

#### 84531.contracts.l2OutputOracle

> `readonly` **l2OutputOracle**: `object`

#### 84531.contracts.l2OutputOracle.5

> `readonly` **5**: `object`

#### 84531.contracts.l2OutputOracle.5.address

> `readonly` **address**: `"0x2A35891ff30313CcFa6CE88dcf3858bb075A2298"`

#### 84531.contracts.l2StandardBridge

> `readonly` **l2StandardBridge**: `object`

#### 84531.contracts.l2StandardBridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000010"`

#### 84531.contracts.l2ToL1MessagePasser

> `readonly` **l2ToL1MessagePasser**: `object`

#### 84531.contracts.l2ToL1MessagePasser.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000016"`

#### 84531.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 84531.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 84531.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `1376988`

#### 84531.contracts.portal

> `readonly` **portal**: `object`

#### 84531.contracts.portal.5

> `readonly` **5**: `object`

#### 84531.contracts.portal.5.address

> `readonly` **address**: `"0xe93c8cD0D409341205A592f8c4Ac1A5fe5585cfA"`

#### 84531.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 84531.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 84531.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 84531.formatters

> **formatters**: `object`

#### 84531.formatters.block

> `readonly` **block**: `object`

#### 84531.formatters.block.exclude

> **exclude**: `undefined` \| \[\]

#### 84531.formatters.block.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`OpStackRpcBlock`\<`BlockTag`, `boolean`\>

##### Returns

`object`

###### baseFeePerGas

> **baseFeePerGas**: `null` \| `bigint`

###### blobGasUsed

> **blobGasUsed**: `bigint`

###### difficulty

> **difficulty**: `bigint`

###### excessBlobGas

> **excessBlobGas**: `bigint`

###### extraData

> **extraData**: `` `0x${string}` ``

###### gasLimit

> **gasLimit**: `bigint`

###### gasUsed

> **gasUsed**: `bigint`

###### hash

> **hash**: `null` \| `` `0x${string}` ``

###### logsBloom

> **logsBloom**: `null` \| `` `0x${string}` ``

###### miner

> **miner**: `` `0x${string}` ``

###### mixHash

> **mixHash**: `` `0x${string}` ``

###### nonce

> **nonce**: `null` \| `` `0x${string}` ``

###### number

> **number**: `null` \| `bigint`

###### parentBeaconBlockRoot?

> `optional` **parentBeaconBlockRoot**: `` `0x${string}` ``

###### parentHash

> **parentHash**: `` `0x${string}` ``

###### receiptsRoot

> **receiptsRoot**: `` `0x${string}` ``

###### sealFields

> **sealFields**: `` `0x${string}` ``[]

###### sha3Uncles

> **sha3Uncles**: `` `0x${string}` ``

###### size

> **size**: `bigint`

###### stateRoot

> **stateRoot**: `` `0x${string}` ``

###### timestamp

> **timestamp**: `bigint`

###### totalDifficulty

> **totalDifficulty**: `null` \| `bigint`

###### transactions

> **transactions**: `` `0x${string}` ``[] \| `OpStackTransaction`\<`boolean`\>[]

###### transactionsRoot

> **transactionsRoot**: `` `0x${string}` ``

###### uncles

> **uncles**: `` `0x${string}` ``[]

###### withdrawals?

> `optional` **withdrawals**: `Withdrawal`[]

###### withdrawalsRoot?

> `optional` **withdrawalsRoot**: `` `0x${string}` ``

#### 84531.formatters.block.type

> **type**: `"block"`

#### 84531.formatters.transaction

> `readonly` **transaction**: `object`

#### 84531.formatters.transaction.exclude

> **exclude**: `undefined` \| \[\]

#### 84531.formatters.transaction.format()

> **format**: (`args`) => \{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

##### Parameters

###### args

`OpStackRpcTransaction`\<`boolean`\>

##### Returns

\{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

#### 84531.formatters.transaction.type

> **type**: `"transaction"`

#### 84531.formatters.transactionReceipt

> `readonly` **transactionReceipt**: `object`

#### 84531.formatters.transactionReceipt.exclude

> **exclude**: `undefined` \| \[\]

#### 84531.formatters.transactionReceipt.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`OpStackRpcTransactionReceipt`

##### Returns

`object`

###### blobGasPrice?

> `optional` **blobGasPrice**: `bigint`

###### blobGasUsed?

> `optional` **blobGasUsed**: `bigint`

###### blockHash

> **blockHash**: `` `0x${string}` ``

###### blockNumber

> **blockNumber**: `bigint`

###### contractAddress

> **contractAddress**: `undefined` \| `null` \| `` `0x${string}` ``

###### cumulativeGasUsed

> **cumulativeGasUsed**: `bigint`

###### effectiveGasPrice

> **effectiveGasPrice**: `bigint`

###### from

> **from**: `` `0x${string}` ``

###### gasUsed

> **gasUsed**: `bigint`

###### l1Fee

> **l1Fee**: `null` \| `bigint`

###### l1FeeScalar

> **l1FeeScalar**: `null` \| `number`

###### l1GasPrice

> **l1GasPrice**: `null` \| `bigint`

###### l1GasUsed

> **l1GasUsed**: `null` \| `bigint`

###### logs

> **logs**: `Log`\<`bigint`, `number`, `false`, `undefined`, `undefined`, `undefined`, `undefined`\>[]

###### logsBloom

> **logsBloom**: `` `0x${string}` ``

###### root?

> `optional` **root**: `` `0x${string}` ``

###### status

> **status**: `"success"` \| `"reverted"`

###### to

> **to**: `null` \| `` `0x${string}` ``

###### transactionHash

> **transactionHash**: `` `0x${string}` ``

###### transactionIndex

> **transactionIndex**: `number`

###### type

> **type**: `TransactionType`

#### 84531.formatters.transactionReceipt.type

> **type**: `"transactionReceipt"`

#### 84531.id

> **id**: `84531`

#### 84531.name

> **name**: `"Base Goerli"`

#### 84531.nativeCurrency

> **nativeCurrency**: `object`

#### 84531.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 84531.nativeCurrency.name

> `readonly` **name**: `"Goerli Ether"`

#### 84531.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 84531.rpcUrls

> **rpcUrls**: `object`

#### 84531.rpcUrls.default

> `readonly` **default**: `object`

#### 84531.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://goerli.base.org"`\]

#### 84531.serializers

> **serializers**: `object`

#### 84531.serializers.transaction()

> `readonly` **transaction**: (`transaction`, `signature?`) => `` `0x02${string}` `` \| `` `0x01${string}` `` \| `` `0x03${string}` `` \| `` `0x04${string}` `` \| `TransactionSerializedLegacy` \| `` `0x7e${string}` ``

##### Parameters

###### transaction

`OpStackTransactionSerializable`

###### signature?

`Signature`

##### Returns

`` `0x02${string}` `` \| `` `0x01${string}` `` \| `` `0x03${string}` `` \| `` `0x04${string}` `` \| `TransactionSerializedLegacy` \| `` `0x7e${string}` ``

#### 84531.sourceId

> **sourceId**: `5`

#### 84531.testnet

> **testnet**: `true`

### 84532

> **84532**: `object` = `chains.baseSepolia`

#### 84532.blockExplorers

> **blockExplorers**: `object`

#### 84532.blockExplorers.default

> `readonly` **default**: `object`

#### 84532.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://api-sepolia.basescan.org/api"`

#### 84532.blockExplorers.default.name

> `readonly` **name**: `"Basescan"`

#### 84532.blockExplorers.default.url

> `readonly` **url**: `"https://sepolia.basescan.org"`

#### 84532.contracts

> **contracts**: `object`

#### 84532.contracts.disputeGameFactory

> `readonly` **disputeGameFactory**: `object`

#### 84532.contracts.disputeGameFactory.11155111

> `readonly` **11155111**: `object`

#### 84532.contracts.disputeGameFactory.11155111.address

> `readonly` **address**: `"0xd6E6dBf4F7EA0ac412fD8b65ED297e64BB7a06E1"`

#### 84532.contracts.gasPriceOracle

> `readonly` **gasPriceOracle**: `object`

#### 84532.contracts.gasPriceOracle.address

> `readonly` **address**: `"0x420000000000000000000000000000000000000F"`

#### 84532.contracts.l1Block

> `readonly` **l1Block**: `object`

#### 84532.contracts.l1Block.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000015"`

#### 84532.contracts.l1StandardBridge

> `readonly` **l1StandardBridge**: `object`

#### 84532.contracts.l1StandardBridge.11155111

> `readonly` **11155111**: `object`

#### 84532.contracts.l1StandardBridge.11155111.address

> `readonly` **address**: `"0xfd0Bf71F60660E2f608ed56e1659C450eB113120"`

#### 84532.contracts.l1StandardBridge.11155111.blockCreated

> `readonly` **blockCreated**: `4446677`

#### 84532.contracts.l2CrossDomainMessenger

> `readonly` **l2CrossDomainMessenger**: `object`

#### 84532.contracts.l2CrossDomainMessenger.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000007"`

#### 84532.contracts.l2Erc721Bridge

> `readonly` **l2Erc721Bridge**: `object`

#### 84532.contracts.l2Erc721Bridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000014"`

#### 84532.contracts.l2OutputOracle

> `readonly` **l2OutputOracle**: `object`

#### 84532.contracts.l2OutputOracle.11155111

> `readonly` **11155111**: `object`

#### 84532.contracts.l2OutputOracle.11155111.address

> `readonly` **address**: `"0x84457ca9D0163FbC4bbfe4Dfbb20ba46e48DF254"`

#### 84532.contracts.l2StandardBridge

> `readonly` **l2StandardBridge**: `object`

#### 84532.contracts.l2StandardBridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000010"`

#### 84532.contracts.l2ToL1MessagePasser

> `readonly` **l2ToL1MessagePasser**: `object`

#### 84532.contracts.l2ToL1MessagePasser.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000016"`

#### 84532.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 84532.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 84532.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `1059647`

#### 84532.contracts.portal

> `readonly` **portal**: `object`

#### 84532.contracts.portal.11155111

> `readonly` **11155111**: `object`

#### 84532.contracts.portal.11155111.address

> `readonly` **address**: `"0x49f53e41452c74589e85ca1677426ba426459e85"`

#### 84532.contracts.portal.11155111.blockCreated

> `readonly` **blockCreated**: `4446677`

#### 84532.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 84532.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 84532.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 84532.formatters

> **formatters**: `object`

#### 84532.formatters.block

> `readonly` **block**: `object`

#### 84532.formatters.block.exclude

> **exclude**: `undefined` \| \[\]

#### 84532.formatters.block.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`OpStackRpcBlock`\<`BlockTag`, `boolean`\>

##### Returns

`object`

###### baseFeePerGas

> **baseFeePerGas**: `null` \| `bigint`

###### blobGasUsed

> **blobGasUsed**: `bigint`

###### difficulty

> **difficulty**: `bigint`

###### excessBlobGas

> **excessBlobGas**: `bigint`

###### extraData

> **extraData**: `` `0x${string}` ``

###### gasLimit

> **gasLimit**: `bigint`

###### gasUsed

> **gasUsed**: `bigint`

###### hash

> **hash**: `null` \| `` `0x${string}` ``

###### logsBloom

> **logsBloom**: `null` \| `` `0x${string}` ``

###### miner

> **miner**: `` `0x${string}` ``

###### mixHash

> **mixHash**: `` `0x${string}` ``

###### nonce

> **nonce**: `null` \| `` `0x${string}` ``

###### number

> **number**: `null` \| `bigint`

###### parentBeaconBlockRoot?

> `optional` **parentBeaconBlockRoot**: `` `0x${string}` ``

###### parentHash

> **parentHash**: `` `0x${string}` ``

###### receiptsRoot

> **receiptsRoot**: `` `0x${string}` ``

###### sealFields

> **sealFields**: `` `0x${string}` ``[]

###### sha3Uncles

> **sha3Uncles**: `` `0x${string}` ``

###### size

> **size**: `bigint`

###### stateRoot

> **stateRoot**: `` `0x${string}` ``

###### timestamp

> **timestamp**: `bigint`

###### totalDifficulty

> **totalDifficulty**: `null` \| `bigint`

###### transactions

> **transactions**: `` `0x${string}` ``[] \| `OpStackTransaction`\<`boolean`\>[]

###### transactionsRoot

> **transactionsRoot**: `` `0x${string}` ``

###### uncles

> **uncles**: `` `0x${string}` ``[]

###### withdrawals?

> `optional` **withdrawals**: `Withdrawal`[]

###### withdrawalsRoot?

> `optional` **withdrawalsRoot**: `` `0x${string}` ``

#### 84532.formatters.block.type

> **type**: `"block"`

#### 84532.formatters.transaction

> `readonly` **transaction**: `object`

#### 84532.formatters.transaction.exclude

> **exclude**: `undefined` \| \[\]

#### 84532.formatters.transaction.format()

> **format**: (`args`) => \{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

##### Parameters

###### args

`OpStackRpcTransaction`\<`boolean`\>

##### Returns

\{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

#### 84532.formatters.transaction.type

> **type**: `"transaction"`

#### 84532.formatters.transactionReceipt

> `readonly` **transactionReceipt**: `object`

#### 84532.formatters.transactionReceipt.exclude

> **exclude**: `undefined` \| \[\]

#### 84532.formatters.transactionReceipt.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`OpStackRpcTransactionReceipt`

##### Returns

`object`

###### blobGasPrice?

> `optional` **blobGasPrice**: `bigint`

###### blobGasUsed?

> `optional` **blobGasUsed**: `bigint`

###### blockHash

> **blockHash**: `` `0x${string}` ``

###### blockNumber

> **blockNumber**: `bigint`

###### contractAddress

> **contractAddress**: `undefined` \| `null` \| `` `0x${string}` ``

###### cumulativeGasUsed

> **cumulativeGasUsed**: `bigint`

###### effectiveGasPrice

> **effectiveGasPrice**: `bigint`

###### from

> **from**: `` `0x${string}` ``

###### gasUsed

> **gasUsed**: `bigint`

###### l1Fee

> **l1Fee**: `null` \| `bigint`

###### l1FeeScalar

> **l1FeeScalar**: `null` \| `number`

###### l1GasPrice

> **l1GasPrice**: `null` \| `bigint`

###### l1GasUsed

> **l1GasUsed**: `null` \| `bigint`

###### logs

> **logs**: `Log`\<`bigint`, `number`, `false`, `undefined`, `undefined`, `undefined`, `undefined`\>[]

###### logsBloom

> **logsBloom**: `` `0x${string}` ``

###### root?

> `optional` **root**: `` `0x${string}` ``

###### status

> **status**: `"success"` \| `"reverted"`

###### to

> **to**: `null` \| `` `0x${string}` ``

###### transactionHash

> **transactionHash**: `` `0x${string}` ``

###### transactionIndex

> **transactionIndex**: `number`

###### type

> **type**: `TransactionType`

#### 84532.formatters.transactionReceipt.type

> **type**: `"transactionReceipt"`

#### 84532.id

> **id**: `84532`

#### 84532.name

> **name**: `"Base Sepolia"`

#### 84532.nativeCurrency

> **nativeCurrency**: `object`

#### 84532.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 84532.nativeCurrency.name

> `readonly` **name**: `"Sepolia Ether"`

#### 84532.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 84532.network

> `readonly` **network**: `"base-sepolia"`

#### 84532.rpcUrls

> **rpcUrls**: `object`

#### 84532.rpcUrls.default

> `readonly` **default**: `object`

#### 84532.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://sepolia.base.org"`\]

#### 84532.serializers

> **serializers**: `object`

#### 84532.serializers.transaction()

> `readonly` **transaction**: (`transaction`, `signature?`) => `` `0x02${string}` `` \| `` `0x01${string}` `` \| `` `0x03${string}` `` \| `` `0x04${string}` `` \| `TransactionSerializedLegacy` \| `` `0x7e${string}` ``

##### Parameters

###### transaction

`OpStackTransactionSerializable`

###### signature?

`Signature`

##### Returns

`` `0x02${string}` `` \| `` `0x01${string}` `` \| `` `0x03${string}` `` \| `` `0x04${string}` `` \| `TransactionSerializedLegacy` \| `` `0x7e${string}` ``

#### 84532.sourceId

> **sourceId**: `11155111`

#### 84532.testnet

> **testnet**: `true`

### 888

> **888**: `object` = `chains.wanchain`

#### 888.blockExplorers

> **blockExplorers**: `object`

#### 888.blockExplorers.default

> `readonly` **default**: `object`

#### 888.blockExplorers.default.name

> `readonly` **name**: `"WanScan"`

#### 888.blockExplorers.default.url

> `readonly` **url**: `"https://wanscan.org"`

#### 888.contracts

> **contracts**: `object`

#### 888.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 888.contracts.multicall3.address

> `readonly` **address**: `"0xcDF6A1566e78EB4594c86Fe73Fcdc82429e97fbB"`

#### 888.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `25312390`

#### 888.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 888.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 888.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 888.formatters?

> `optional` **formatters**: `undefined`

#### 888.id

> **id**: `888`

#### 888.name

> **name**: `"Wanchain"`

#### 888.nativeCurrency

> **nativeCurrency**: `object`

#### 888.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 888.nativeCurrency.name

> `readonly` **name**: `"WANCHAIN"`

#### 888.nativeCurrency.symbol

> `readonly` **symbol**: `"WAN"`

#### 888.rpcUrls

> **rpcUrls**: `object`

#### 888.rpcUrls.default

> `readonly` **default**: `object`

#### 888.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://gwan-ssl.wandevs.org:56891"`, `"https://gwan2-ssl.wandevs.org"`\]

#### 888.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 888.sourceId?

> `optional` **sourceId**: `number`

#### 888.testnet?

> `optional` **testnet**: `boolean`

### 88882

> **88882**: `object` = `chains.spicy`

#### 88882.blockExplorers

> **blockExplorers**: `object`

#### 88882.blockExplorers.default

> `readonly` **default**: `object`

#### 88882.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"http://spicy-explorer.chiliz.com/api"`

#### 88882.blockExplorers.default.name

> `readonly` **name**: `"Chiliz Explorer"`

#### 88882.blockExplorers.default.url

> `readonly` **url**: `"http://spicy-explorer.chiliz.com"`

#### 88882.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 88882.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 88882.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 88882.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 88882.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 88882.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 88882.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 88882.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 88882.formatters?

> `optional` **formatters**: `undefined`

#### 88882.id

> **id**: `88882`

#### 88882.name

> **name**: `"Chiliz Spicy Testnet"`

#### 88882.nativeCurrency

> **nativeCurrency**: `object`

#### 88882.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 88882.nativeCurrency.name

> `readonly` **name**: `"CHZ"`

#### 88882.nativeCurrency.symbol

> `readonly` **symbol**: `"CHZ"`

#### 88882.network

> `readonly` **network**: `"chiliz-spicy-Testnet"`

#### 88882.rpcUrls

> **rpcUrls**: `object`

#### 88882.rpcUrls.default

> `readonly` **default**: `object`

#### 88882.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://spicy-rpc.chiliz.com"`, `"https://chiliz-spicy-rpc.publicnode.com"`\]

#### 88882.rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly \[`"wss://spicy-rpc-ws.chiliz.com"`, `"wss://chiliz-spicy-rpc.publicnode.com"`\]

#### 88882.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 88882.sourceId?

> `optional` **sourceId**: `number`

#### 88882.testnet

> **testnet**: `true`

### 88888

> **88888**: `object` = `chains.chiliz`

#### 88888.blockExplorers

> **blockExplorers**: `object`

#### 88888.blockExplorers.default

> `readonly` **default**: `object`

#### 88888.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://scan.chiliz.com/api"`

#### 88888.blockExplorers.default.name

> `readonly` **name**: `"Chiliz Explorer"`

#### 88888.blockExplorers.default.url

> `readonly` **url**: `"https://scan.chiliz.com"`

#### 88888.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 88888.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 88888.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 88888.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 88888.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 88888.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 88888.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 88888.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 88888.formatters?

> `optional` **formatters**: `undefined`

#### 88888.id

> **id**: `88888`

#### 88888.name

> **name**: `"Chiliz Chain"`

#### 88888.nativeCurrency

> **nativeCurrency**: `object`

#### 88888.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 88888.nativeCurrency.name

> `readonly` **name**: `"CHZ"`

#### 88888.nativeCurrency.symbol

> `readonly` **symbol**: `"CHZ"`

#### 88888.network

> `readonly` **network**: `"chiliz-chain"`

#### 88888.rpcUrls

> **rpcUrls**: `object`

#### 88888.rpcUrls.default

> `readonly` **default**: `object`

#### 88888.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.chiliz.com"`\]

#### 88888.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 88888.sourceId?

> `optional` **sourceId**: `number`

#### 88888.testnet?

> `optional` **testnet**: `boolean`

### 888888888

> **888888888**: `object` = `chains.ancient8`

#### 888888888.blockExplorers

> **blockExplorers**: `object`

#### 888888888.blockExplorers.default

> `readonly` **default**: `object`

#### 888888888.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://scan.ancient8.gg/api"`

#### 888888888.blockExplorers.default.name

> `readonly` **name**: `"Ancient8 explorer"`

#### 888888888.blockExplorers.default.url

> `readonly` **url**: `"https://scan.ancient8.gg"`

#### 888888888.contracts

> **contracts**: `object`

#### 888888888.contracts.gasPriceOracle

> `readonly` **gasPriceOracle**: `object`

#### 888888888.contracts.gasPriceOracle.address

> `readonly` **address**: `"0x420000000000000000000000000000000000000F"`

#### 888888888.contracts.l1Block

> `readonly` **l1Block**: `object`

#### 888888888.contracts.l1Block.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000015"`

#### 888888888.contracts.l1StandardBridge

> `readonly` **l1StandardBridge**: `object`

#### 888888888.contracts.l1StandardBridge.1

> `readonly` **1**: `object`

#### 888888888.contracts.l1StandardBridge.1.address

> `readonly` **address**: `"0xd5e3eDf5b68135D559D572E26bF863FBC1950033"`

#### 888888888.contracts.l1StandardBridge.1.blockCreated

> `readonly` **blockCreated**: `19070571`

#### 888888888.contracts.l2CrossDomainMessenger

> `readonly` **l2CrossDomainMessenger**: `object`

#### 888888888.contracts.l2CrossDomainMessenger.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000007"`

#### 888888888.contracts.l2Erc721Bridge

> `readonly` **l2Erc721Bridge**: `object`

#### 888888888.contracts.l2Erc721Bridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000014"`

#### 888888888.contracts.l2OutputOracle

> `readonly` **l2OutputOracle**: `object`

#### 888888888.contracts.l2OutputOracle.1

> `readonly` **1**: `object`

#### 888888888.contracts.l2OutputOracle.1.address

> `readonly` **address**: `"0xB09DC08428C8b4EFB4ff9C0827386CDF34277996"`

#### 888888888.contracts.l2StandardBridge

> `readonly` **l2StandardBridge**: `object`

#### 888888888.contracts.l2StandardBridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000010"`

#### 888888888.contracts.l2ToL1MessagePasser

> `readonly` **l2ToL1MessagePasser**: `object`

#### 888888888.contracts.l2ToL1MessagePasser.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000016"`

#### 888888888.contracts.portal

> `readonly` **portal**: `object`

#### 888888888.contracts.portal.1

> `readonly` **1**: `object`

#### 888888888.contracts.portal.1.address

> `readonly` **address**: `"0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68"`

#### 888888888.contracts.portal.1.blockCreated

> `readonly` **blockCreated**: `19070571`

#### 888888888.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 888888888.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 888888888.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 888888888.formatters

> **formatters**: `object`

#### 888888888.formatters.block

> `readonly` **block**: `object`

#### 888888888.formatters.block.exclude

> **exclude**: `undefined` \| \[\]

#### 888888888.formatters.block.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`OpStackRpcBlock`\<`BlockTag`, `boolean`\>

##### Returns

`object`

###### baseFeePerGas

> **baseFeePerGas**: `null` \| `bigint`

###### blobGasUsed

> **blobGasUsed**: `bigint`

###### difficulty

> **difficulty**: `bigint`

###### excessBlobGas

> **excessBlobGas**: `bigint`

###### extraData

> **extraData**: `` `0x${string}` ``

###### gasLimit

> **gasLimit**: `bigint`

###### gasUsed

> **gasUsed**: `bigint`

###### hash

> **hash**: `null` \| `` `0x${string}` ``

###### logsBloom

> **logsBloom**: `null` \| `` `0x${string}` ``

###### miner

> **miner**: `` `0x${string}` ``

###### mixHash

> **mixHash**: `` `0x${string}` ``

###### nonce

> **nonce**: `null` \| `` `0x${string}` ``

###### number

> **number**: `null` \| `bigint`

###### parentBeaconBlockRoot?

> `optional` **parentBeaconBlockRoot**: `` `0x${string}` ``

###### parentHash

> **parentHash**: `` `0x${string}` ``

###### receiptsRoot

> **receiptsRoot**: `` `0x${string}` ``

###### sealFields

> **sealFields**: `` `0x${string}` ``[]

###### sha3Uncles

> **sha3Uncles**: `` `0x${string}` ``

###### size

> **size**: `bigint`

###### stateRoot

> **stateRoot**: `` `0x${string}` ``

###### timestamp

> **timestamp**: `bigint`

###### totalDifficulty

> **totalDifficulty**: `null` \| `bigint`

###### transactions

> **transactions**: `` `0x${string}` ``[] \| `OpStackTransaction`\<`boolean`\>[]

###### transactionsRoot

> **transactionsRoot**: `` `0x${string}` ``

###### uncles

> **uncles**: `` `0x${string}` ``[]

###### withdrawals?

> `optional` **withdrawals**: `Withdrawal`[]

###### withdrawalsRoot?

> `optional` **withdrawalsRoot**: `` `0x${string}` ``

#### 888888888.formatters.block.type

> **type**: `"block"`

#### 888888888.formatters.transaction

> `readonly` **transaction**: `object`

#### 888888888.formatters.transaction.exclude

> **exclude**: `undefined` \| \[\]

#### 888888888.formatters.transaction.format()

> **format**: (`args`) => \{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

##### Parameters

###### args

`OpStackRpcTransaction`\<`boolean`\>

##### Returns

\{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

#### 888888888.formatters.transaction.type

> **type**: `"transaction"`

#### 888888888.formatters.transactionReceipt

> `readonly` **transactionReceipt**: `object`

#### 888888888.formatters.transactionReceipt.exclude

> **exclude**: `undefined` \| \[\]

#### 888888888.formatters.transactionReceipt.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`OpStackRpcTransactionReceipt`

##### Returns

`object`

###### blobGasPrice?

> `optional` **blobGasPrice**: `bigint`

###### blobGasUsed?

> `optional` **blobGasUsed**: `bigint`

###### blockHash

> **blockHash**: `` `0x${string}` ``

###### blockNumber

> **blockNumber**: `bigint`

###### contractAddress

> **contractAddress**: `undefined` \| `null` \| `` `0x${string}` ``

###### cumulativeGasUsed

> **cumulativeGasUsed**: `bigint`

###### effectiveGasPrice

> **effectiveGasPrice**: `bigint`

###### from

> **from**: `` `0x${string}` ``

###### gasUsed

> **gasUsed**: `bigint`

###### l1Fee

> **l1Fee**: `null` \| `bigint`

###### l1FeeScalar

> **l1FeeScalar**: `null` \| `number`

###### l1GasPrice

> **l1GasPrice**: `null` \| `bigint`

###### l1GasUsed

> **l1GasUsed**: `null` \| `bigint`

###### logs

> **logs**: `Log`\<`bigint`, `number`, `false`, `undefined`, `undefined`, `undefined`, `undefined`\>[]

###### logsBloom

> **logsBloom**: `` `0x${string}` ``

###### root?

> `optional` **root**: `` `0x${string}` ``

###### status

> **status**: `"success"` \| `"reverted"`

###### to

> **to**: `null` \| `` `0x${string}` ``

###### transactionHash

> **transactionHash**: `` `0x${string}` ``

###### transactionIndex

> **transactionIndex**: `number`

###### type

> **type**: `TransactionType`

#### 888888888.formatters.transactionReceipt.type

> **type**: `"transactionReceipt"`

#### 888888888.id

> **id**: `888888888`

#### 888888888.name

> **name**: `"Ancient8"`

#### 888888888.nativeCurrency

> **nativeCurrency**: `object`

#### 888888888.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 888888888.nativeCurrency.name

> `readonly` **name**: `"Ether"`

#### 888888888.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 888888888.rpcUrls

> **rpcUrls**: `object`

#### 888888888.rpcUrls.default

> `readonly` **default**: `object`

#### 888888888.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.ancient8.gg"`\]

#### 888888888.serializers

> **serializers**: `object`

#### 888888888.serializers.transaction()

> `readonly` **transaction**: (`transaction`, `signature?`) => `` `0x02${string}` `` \| `` `0x01${string}` `` \| `` `0x03${string}` `` \| `` `0x04${string}` `` \| `TransactionSerializedLegacy` \| `` `0x7e${string}` ``

##### Parameters

###### transaction

`OpStackTransactionSerializable`

###### signature?

`Signature`

##### Returns

`` `0x02${string}` `` \| `` `0x01${string}` `` \| `` `0x03${string}` `` \| `` `0x04${string}` `` \| `TransactionSerializedLegacy` \| `` `0x7e${string}` ``

#### 888888888.sourceId

> **sourceId**: `1`

#### 888888888.testnet?

> `optional` **testnet**: `boolean`

### 8899

> **8899**: `object` = `chains.jbc`

#### 8899.blockExplorers

> **blockExplorers**: `object`

#### 8899.blockExplorers.default

> `readonly` **default**: `object`

#### 8899.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://exp-l1.jibchain.net/api"`

#### 8899.blockExplorers.default.name

> `readonly` **name**: `"Blockscout"`

#### 8899.blockExplorers.default.url

> `readonly` **url**: `"https://exp-l1.jibchain.net"`

#### 8899.contracts

> **contracts**: `object`

#### 8899.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 8899.contracts.multicall3.address

> `readonly` **address**: `"0xc0C8C486D1466C57Efe13C2bf000d4c56F47CBdC"`

#### 8899.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `2299048`

#### 8899.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 8899.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 8899.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 8899.formatters?

> `optional` **formatters**: `undefined`

#### 8899.id

> **id**: `8899`

#### 8899.name

> **name**: `"JB Chain"`

#### 8899.nativeCurrency

> **nativeCurrency**: `object`

#### 8899.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 8899.nativeCurrency.name

> `readonly` **name**: `"JBC"`

#### 8899.nativeCurrency.symbol

> `readonly` **symbol**: `"JBC"`

#### 8899.network

> `readonly` **network**: `"jbc"`

#### 8899.rpcUrls

> **rpcUrls**: `object`

#### 8899.rpcUrls.default

> `readonly` **default**: `object`

#### 8899.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc-l1.jibchain.net"`\]

#### 8899.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 8899.sourceId?

> `optional` **sourceId**: `number`

#### 8899.testnet

> **testnet**: `false`

### 88991

> **88991**: `object` = `chains.jbcTestnet`

#### 88991.blockExplorers

> **blockExplorers**: `object`

#### 88991.blockExplorers.default

> `readonly` **default**: `object`

#### 88991.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://exp.testnet.jibchain.net/api"`

#### 88991.blockExplorers.default.name

> `readonly` **name**: `"Blockscout"`

#### 88991.blockExplorers.default.url

> `readonly` **url**: `"https://exp.testnet.jibchain.net"`

#### 88991.contracts

> **contracts**: `object`

#### 88991.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 88991.contracts.multicall3.address

> `readonly` **address**: `"0xa1a858ad9041B4741e620355a3F96B3c78e70ecE"`

#### 88991.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `32848`

#### 88991.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 88991.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 88991.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 88991.formatters?

> `optional` **formatters**: `undefined`

#### 88991.id

> **id**: `88991`

#### 88991.name

> **name**: `"Jibchain Testnet"`

#### 88991.nativeCurrency

> **nativeCurrency**: `object`

#### 88991.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 88991.nativeCurrency.name

> `readonly` **name**: `"tJBC"`

#### 88991.nativeCurrency.symbol

> `readonly` **symbol**: `"tJBC"`

#### 88991.rpcUrls

> **rpcUrls**: `object`

#### 88991.rpcUrls.default

> `readonly` **default**: `object`

#### 88991.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.testnet.jibchain.net"`\]

#### 88991.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 88991.sourceId?

> `optional` **sourceId**: `number`

#### 88991.testnet

> **testnet**: `true`

### 9000

> **9000**: `object` = `chains.evmosTestnet`

#### 9000.blockExplorers

> **blockExplorers**: `object`

#### 9000.blockExplorers.default

> `readonly` **default**: `object`

#### 9000.blockExplorers.default.name

> `readonly` **name**: `"Evmos Testnet Block Explorer"`

#### 9000.blockExplorers.default.url

> `readonly` **url**: `"https://evm.evmos.dev/"`

#### 9000.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 9000.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 9000.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 9000.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 9000.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 9000.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 9000.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 9000.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 9000.formatters?

> `optional` **formatters**: `undefined`

#### 9000.id

> **id**: `9000`

#### 9000.name

> **name**: `"Evmos Testnet"`

#### 9000.nativeCurrency

> **nativeCurrency**: `object`

#### 9000.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 9000.nativeCurrency.name

> `readonly` **name**: `"Evmos"`

#### 9000.nativeCurrency.symbol

> `readonly` **symbol**: `"EVMOS"`

#### 9000.rpcUrls

> **rpcUrls**: `object`

#### 9000.rpcUrls.default

> `readonly` **default**: `object`

#### 9000.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://eth.bd.evmos.dev:8545"`\]

#### 9000.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 9000.sourceId?

> `optional` **sourceId**: `number`

#### 9000.testnet?

> `optional` **testnet**: `boolean`

### 9001

> **9001**: `object` = `chains.evmos`

#### 9001.blockExplorers

> **blockExplorers**: `object`

#### 9001.blockExplorers.default

> `readonly` **default**: `object`

#### 9001.blockExplorers.default.name

> `readonly` **name**: `"Evmos Block Explorer"`

#### 9001.blockExplorers.default.url

> `readonly` **url**: `"https://escan.live"`

#### 9001.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 9001.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 9001.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 9001.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 9001.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 9001.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 9001.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 9001.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 9001.formatters?

> `optional` **formatters**: `undefined`

#### 9001.id

> **id**: `9001`

#### 9001.name

> **name**: `"Evmos"`

#### 9001.nativeCurrency

> **nativeCurrency**: `object`

#### 9001.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 9001.nativeCurrency.name

> `readonly` **name**: `"Evmos"`

#### 9001.nativeCurrency.symbol

> `readonly` **symbol**: `"EVMOS"`

#### 9001.rpcUrls

> **rpcUrls**: `object`

#### 9001.rpcUrls.default

> `readonly` **default**: `object`

#### 9001.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://eth.bd.evmos.org:8545"`\]

#### 9001.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 9001.sourceId?

> `optional` **sourceId**: `number`

#### 9001.testnet?

> `optional` **testnet**: `boolean`

### 919

> **919**: `object` = `chains.modeTestnet`

#### 919.blockExplorers

> **blockExplorers**: `object`

#### 919.blockExplorers.default

> `readonly` **default**: `object`

#### 919.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://sepolia.explorer.mode.network/api"`

#### 919.blockExplorers.default.name

> `readonly` **name**: `"Blockscout"`

#### 919.blockExplorers.default.url

> `readonly` **url**: `"https://sepolia.explorer.mode.network"`

#### 919.contracts

> **contracts**: `object`

#### 919.contracts.gasPriceOracle

> `readonly` **gasPriceOracle**: `object`

#### 919.contracts.gasPriceOracle.address

> `readonly` **address**: `"0x420000000000000000000000000000000000000F"`

#### 919.contracts.l1Block

> `readonly` **l1Block**: `object`

#### 919.contracts.l1Block.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000015"`

#### 919.contracts.l1StandardBridge

> `readonly` **l1StandardBridge**: `object`

#### 919.contracts.l1StandardBridge.11155111

> `readonly` **11155111**: `object`

#### 919.contracts.l1StandardBridge.11155111.address

> `readonly` **address**: `"0xbC5C679879B2965296756CD959C3C739769995E2"`

#### 919.contracts.l1StandardBridge.11155111.blockCreated

> `readonly` **blockCreated**: `3778392`

#### 919.contracts.l2CrossDomainMessenger

> `readonly` **l2CrossDomainMessenger**: `object`

#### 919.contracts.l2CrossDomainMessenger.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000007"`

#### 919.contracts.l2Erc721Bridge

> `readonly` **l2Erc721Bridge**: `object`

#### 919.contracts.l2Erc721Bridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000014"`

#### 919.contracts.l2OutputOracle

> `readonly` **l2OutputOracle**: `object`

#### 919.contracts.l2OutputOracle.11155111

> `readonly` **11155111**: `object`

#### 919.contracts.l2OutputOracle.11155111.address

> `readonly` **address**: `"0x2634BD65ba27AB63811c74A63118ACb312701Bfa"`

#### 919.contracts.l2OutputOracle.11155111.blockCreated

> `readonly` **blockCreated**: `3778393`

#### 919.contracts.l2StandardBridge

> `readonly` **l2StandardBridge**: `object`

#### 919.contracts.l2StandardBridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000010"`

#### 919.contracts.l2ToL1MessagePasser

> `readonly` **l2ToL1MessagePasser**: `object`

#### 919.contracts.l2ToL1MessagePasser.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000016"`

#### 919.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 919.contracts.multicall3.address

> `readonly` **address**: `"0xBAba8373113Fb7a68f195deF18732e01aF8eDfCF"`

#### 919.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `3019007`

#### 919.contracts.portal

> `readonly` **portal**: `object`

#### 919.contracts.portal.11155111

> `readonly` **11155111**: `object`

#### 919.contracts.portal.11155111.address

> `readonly` **address**: `"0x320e1580effF37E008F1C92700d1eBa47c1B23fD"`

#### 919.contracts.portal.11155111.blockCreated

> `readonly` **blockCreated**: `3778395`

#### 919.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 919.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 919.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 919.formatters

> **formatters**: `object`

#### 919.formatters.block

> `readonly` **block**: `object`

#### 919.formatters.block.exclude

> **exclude**: `undefined` \| \[\]

#### 919.formatters.block.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`OpStackRpcBlock`\<`BlockTag`, `boolean`\>

##### Returns

`object`

###### baseFeePerGas

> **baseFeePerGas**: `null` \| `bigint`

###### blobGasUsed

> **blobGasUsed**: `bigint`

###### difficulty

> **difficulty**: `bigint`

###### excessBlobGas

> **excessBlobGas**: `bigint`

###### extraData

> **extraData**: `` `0x${string}` ``

###### gasLimit

> **gasLimit**: `bigint`

###### gasUsed

> **gasUsed**: `bigint`

###### hash

> **hash**: `null` \| `` `0x${string}` ``

###### logsBloom

> **logsBloom**: `null` \| `` `0x${string}` ``

###### miner

> **miner**: `` `0x${string}` ``

###### mixHash

> **mixHash**: `` `0x${string}` ``

###### nonce

> **nonce**: `null` \| `` `0x${string}` ``

###### number

> **number**: `null` \| `bigint`

###### parentBeaconBlockRoot?

> `optional` **parentBeaconBlockRoot**: `` `0x${string}` ``

###### parentHash

> **parentHash**: `` `0x${string}` ``

###### receiptsRoot

> **receiptsRoot**: `` `0x${string}` ``

###### sealFields

> **sealFields**: `` `0x${string}` ``[]

###### sha3Uncles

> **sha3Uncles**: `` `0x${string}` ``

###### size

> **size**: `bigint`

###### stateRoot

> **stateRoot**: `` `0x${string}` ``

###### timestamp

> **timestamp**: `bigint`

###### totalDifficulty

> **totalDifficulty**: `null` \| `bigint`

###### transactions

> **transactions**: `` `0x${string}` ``[] \| `OpStackTransaction`\<`boolean`\>[]

###### transactionsRoot

> **transactionsRoot**: `` `0x${string}` ``

###### uncles

> **uncles**: `` `0x${string}` ``[]

###### withdrawals?

> `optional` **withdrawals**: `Withdrawal`[]

###### withdrawalsRoot?

> `optional` **withdrawalsRoot**: `` `0x${string}` ``

#### 919.formatters.block.type

> **type**: `"block"`

#### 919.formatters.transaction

> `readonly` **transaction**: `object`

#### 919.formatters.transaction.exclude

> **exclude**: `undefined` \| \[\]

#### 919.formatters.transaction.format()

> **format**: (`args`) => \{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

##### Parameters

###### args

`OpStackRpcTransaction`\<`boolean`\>

##### Returns

\{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

#### 919.formatters.transaction.type

> **type**: `"transaction"`

#### 919.formatters.transactionReceipt

> `readonly` **transactionReceipt**: `object`

#### 919.formatters.transactionReceipt.exclude

> **exclude**: `undefined` \| \[\]

#### 919.formatters.transactionReceipt.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`OpStackRpcTransactionReceipt`

##### Returns

`object`

###### blobGasPrice?

> `optional` **blobGasPrice**: `bigint`

###### blobGasUsed?

> `optional` **blobGasUsed**: `bigint`

###### blockHash

> **blockHash**: `` `0x${string}` ``

###### blockNumber

> **blockNumber**: `bigint`

###### contractAddress

> **contractAddress**: `undefined` \| `null` \| `` `0x${string}` ``

###### cumulativeGasUsed

> **cumulativeGasUsed**: `bigint`

###### effectiveGasPrice

> **effectiveGasPrice**: `bigint`

###### from

> **from**: `` `0x${string}` ``

###### gasUsed

> **gasUsed**: `bigint`

###### l1Fee

> **l1Fee**: `null` \| `bigint`

###### l1FeeScalar

> **l1FeeScalar**: `null` \| `number`

###### l1GasPrice

> **l1GasPrice**: `null` \| `bigint`

###### l1GasUsed

> **l1GasUsed**: `null` \| `bigint`

###### logs

> **logs**: `Log`\<`bigint`, `number`, `false`, `undefined`, `undefined`, `undefined`, `undefined`\>[]

###### logsBloom

> **logsBloom**: `` `0x${string}` ``

###### root?

> `optional` **root**: `` `0x${string}` ``

###### status

> **status**: `"success"` \| `"reverted"`

###### to

> **to**: `null` \| `` `0x${string}` ``

###### transactionHash

> **transactionHash**: `` `0x${string}` ``

###### transactionIndex

> **transactionIndex**: `number`

###### type

> **type**: `TransactionType`

#### 919.formatters.transactionReceipt.type

> **type**: `"transactionReceipt"`

#### 919.id

> **id**: `919`

#### 919.name

> **name**: `"Mode Testnet"`

#### 919.nativeCurrency

> **nativeCurrency**: `object`

#### 919.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 919.nativeCurrency.name

> `readonly` **name**: `"Ether"`

#### 919.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 919.rpcUrls

> **rpcUrls**: `object`

#### 919.rpcUrls.default

> `readonly` **default**: `object`

#### 919.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://sepolia.mode.network"`\]

#### 919.serializers

> **serializers**: `object`

#### 919.serializers.transaction()

> `readonly` **transaction**: (`transaction`, `signature?`) => `` `0x02${string}` `` \| `` `0x01${string}` `` \| `` `0x03${string}` `` \| `` `0x04${string}` `` \| `TransactionSerializedLegacy` \| `` `0x7e${string}` ``

##### Parameters

###### transaction

`OpStackTransactionSerializable`

###### signature?

`Signature`

##### Returns

`` `0x02${string}` `` \| `` `0x01${string}` `` \| `` `0x03${string}` `` \| `` `0x04${string}` `` \| `TransactionSerializedLegacy` \| `` `0x7e${string}` ``

#### 919.sourceId

> **sourceId**: `11155111`

#### 919.testnet

> **testnet**: `true`

### 957

> **957**: `object` = `chains.lyra`

#### 957.blockExplorers

> **blockExplorers**: `object`

#### 957.blockExplorers.default

> `readonly` **default**: `object`

#### 957.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://explorer.lyra.finance/api/v2"`

#### 957.blockExplorers.default.name

> `readonly` **name**: `"Lyra Explorer"`

#### 957.blockExplorers.default.url

> `readonly` **url**: `"https://explorer.lyra.finance"`

#### 957.contracts

> **contracts**: `object`

#### 957.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 957.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 957.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `1935198`

#### 957.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 957.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 957.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 957.formatters?

> `optional` **formatters**: `undefined`

#### 957.id

> **id**: `957`

#### 957.name

> **name**: `"Lyra Chain"`

#### 957.nativeCurrency

> **nativeCurrency**: `object`

#### 957.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 957.nativeCurrency.name

> `readonly` **name**: `"Ether"`

#### 957.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 957.rpcUrls

> **rpcUrls**: `object`

#### 957.rpcUrls.default

> `readonly` **default**: `object`

#### 957.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.lyra.finance"`\]

#### 957.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 957.sourceId?

> `optional` **sourceId**: `number`

#### 957.testnet?

> `optional` **testnet**: `boolean`

### 96

> **96**: `object` = `chains.bitkub`

#### 96.blockExplorers

> **blockExplorers**: `object`

#### 96.blockExplorers.default

> `readonly` **default**: `object`

#### 96.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://www.bkcscan.com/api"`

#### 96.blockExplorers.default.name

> `readonly` **name**: `"KUB Chain Mainnet Explorer"`

#### 96.blockExplorers.default.url

> `readonly` **url**: `"https://www.bkcscan.com"`

#### 96.contracts?

> `optional` **contracts**: `object`

##### Index Signature

\[`x`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### 96.contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### 96.contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### 96.contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### 96.contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

#### 96.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 96.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 96.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 96.formatters?

> `optional` **formatters**: `undefined`

#### 96.id

> **id**: `96`

#### 96.name

> **name**: `"KUB Mainnet"`

#### 96.nativeCurrency

> **nativeCurrency**: `object`

#### 96.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 96.nativeCurrency.name

> `readonly` **name**: `"KUB Coin"`

#### 96.nativeCurrency.symbol

> `readonly` **symbol**: `"KUB"`

#### 96.rpcUrls

> **rpcUrls**: `object`

#### 96.rpcUrls.default

> `readonly` **default**: `object`

#### 96.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://rpc.bitkubchain.io"`\]

#### 96.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 96.sourceId?

> `optional` **sourceId**: `number`

#### 96.testnet?

> `optional` **testnet**: `boolean`

### 97

> **97**: `object` = `chains.bscTestnet`

#### 97.blockExplorers

> **blockExplorers**: `object`

#### 97.blockExplorers.default

> `readonly` **default**: `object`

#### 97.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://api-testnet.bscscan.com/api"`

#### 97.blockExplorers.default.name

> `readonly` **name**: `"BscScan"`

#### 97.blockExplorers.default.url

> `readonly` **url**: `"https://testnet.bscscan.com"`

#### 97.contracts

> **contracts**: `object`

#### 97.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 97.contracts.multicall3.address

> `readonly` **address**: `"0xca11bde05977b3631167028862be2a173976ca11"`

#### 97.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `17422483`

#### 97.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 97.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 97.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 97.formatters?

> `optional` **formatters**: `undefined`

#### 97.id

> **id**: `97`

#### 97.name

> **name**: `"Binance Smart Chain Testnet"`

#### 97.nativeCurrency

> **nativeCurrency**: `object`

#### 97.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 97.nativeCurrency.name

> `readonly` **name**: `"BNB"`

#### 97.nativeCurrency.symbol

> `readonly` **symbol**: `"tBNB"`

#### 97.rpcUrls

> **rpcUrls**: `object`

#### 97.rpcUrls.default

> `readonly` **default**: `object`

#### 97.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://data-seed-prebsc-1-s1.bnbchain.org:8545"`\]

#### 97.serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined`, `TransactionSerializable`\<`bigint`, `number`\>\>

#### 97.sourceId?

> `optional` **sourceId**: `number`

#### 97.testnet

> **testnet**: `true`

### 999

> **999**: `object` = `chains.zoraTestnet`

#### 999.blockExplorers

> **blockExplorers**: `object`

#### 999.blockExplorers.default

> `readonly` **default**: `object`

#### 999.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://testnet.explorer.zora.energy/api"`

#### 999.blockExplorers.default.name

> `readonly` **name**: `"Explorer"`

#### 999.blockExplorers.default.url

> `readonly` **url**: `"https://testnet.explorer.zora.energy"`

#### 999.contracts

> **contracts**: `object`

#### 999.contracts.gasPriceOracle

> `readonly` **gasPriceOracle**: `object`

#### 999.contracts.gasPriceOracle.address

> `readonly` **address**: `"0x420000000000000000000000000000000000000F"`

#### 999.contracts.l1Block

> `readonly` **l1Block**: `object`

#### 999.contracts.l1Block.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000015"`

#### 999.contracts.l2CrossDomainMessenger

> `readonly` **l2CrossDomainMessenger**: `object`

#### 999.contracts.l2CrossDomainMessenger.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000007"`

#### 999.contracts.l2Erc721Bridge

> `readonly` **l2Erc721Bridge**: `object`

#### 999.contracts.l2Erc721Bridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000014"`

#### 999.contracts.l2StandardBridge

> `readonly` **l2StandardBridge**: `object`

#### 999.contracts.l2StandardBridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000010"`

#### 999.contracts.l2ToL1MessagePasser

> `readonly` **l2ToL1MessagePasser**: `object`

#### 999.contracts.l2ToL1MessagePasser.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000016"`

#### 999.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 999.contracts.multicall3.address

> `readonly` **address**: `"0xcA11bde05977b3631167028862bE2a173976CA11"`

#### 999.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `189123`

#### 999.contracts.portal

> `readonly` **portal**: `object`

#### 999.contracts.portal.5

> `readonly` **5**: `object`

#### 999.contracts.portal.5.address

> `readonly` **address**: `"0xDb9F51790365e7dc196e7D072728df39Be958ACe"`

#### 999.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 999.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 999.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 999.formatters

> **formatters**: `object`

#### 999.formatters.block

> `readonly` **block**: `object`

#### 999.formatters.block.exclude

> **exclude**: `undefined` \| \[\]

#### 999.formatters.block.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`OpStackRpcBlock`\<`BlockTag`, `boolean`\>

##### Returns

`object`

###### baseFeePerGas

> **baseFeePerGas**: `null` \| `bigint`

###### blobGasUsed

> **blobGasUsed**: `bigint`

###### difficulty

> **difficulty**: `bigint`

###### excessBlobGas

> **excessBlobGas**: `bigint`

###### extraData

> **extraData**: `` `0x${string}` ``

###### gasLimit

> **gasLimit**: `bigint`

###### gasUsed

> **gasUsed**: `bigint`

###### hash

> **hash**: `null` \| `` `0x${string}` ``

###### logsBloom

> **logsBloom**: `null` \| `` `0x${string}` ``

###### miner

> **miner**: `` `0x${string}` ``

###### mixHash

> **mixHash**: `` `0x${string}` ``

###### nonce

> **nonce**: `null` \| `` `0x${string}` ``

###### number

> **number**: `null` \| `bigint`

###### parentBeaconBlockRoot?

> `optional` **parentBeaconBlockRoot**: `` `0x${string}` ``

###### parentHash

> **parentHash**: `` `0x${string}` ``

###### receiptsRoot

> **receiptsRoot**: `` `0x${string}` ``

###### sealFields

> **sealFields**: `` `0x${string}` ``[]

###### sha3Uncles

> **sha3Uncles**: `` `0x${string}` ``

###### size

> **size**: `bigint`

###### stateRoot

> **stateRoot**: `` `0x${string}` ``

###### timestamp

> **timestamp**: `bigint`

###### totalDifficulty

> **totalDifficulty**: `null` \| `bigint`

###### transactions

> **transactions**: `` `0x${string}` ``[] \| `OpStackTransaction`\<`boolean`\>[]

###### transactionsRoot

> **transactionsRoot**: `` `0x${string}` ``

###### uncles

> **uncles**: `` `0x${string}` ``[]

###### withdrawals?

> `optional` **withdrawals**: `Withdrawal`[]

###### withdrawalsRoot?

> `optional` **withdrawalsRoot**: `` `0x${string}` ``

#### 999.formatters.block.type

> **type**: `"block"`

#### 999.formatters.transaction

> `readonly` **transaction**: `object`

#### 999.formatters.transaction.exclude

> **exclude**: `undefined` \| \[\]

#### 999.formatters.transaction.format()

> **format**: (`args`) => \{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

##### Parameters

###### args

`OpStackRpcTransaction`\<`boolean`\>

##### Returns

\{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

#### 999.formatters.transaction.type

> **type**: `"transaction"`

#### 999.formatters.transactionReceipt

> `readonly` **transactionReceipt**: `object`

#### 999.formatters.transactionReceipt.exclude

> **exclude**: `undefined` \| \[\]

#### 999.formatters.transactionReceipt.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`OpStackRpcTransactionReceipt`

##### Returns

`object`

###### blobGasPrice?

> `optional` **blobGasPrice**: `bigint`

###### blobGasUsed?

> `optional` **blobGasUsed**: `bigint`

###### blockHash

> **blockHash**: `` `0x${string}` ``

###### blockNumber

> **blockNumber**: `bigint`

###### contractAddress

> **contractAddress**: `undefined` \| `null` \| `` `0x${string}` ``

###### cumulativeGasUsed

> **cumulativeGasUsed**: `bigint`

###### effectiveGasPrice

> **effectiveGasPrice**: `bigint`

###### from

> **from**: `` `0x${string}` ``

###### gasUsed

> **gasUsed**: `bigint`

###### l1Fee

> **l1Fee**: `null` \| `bigint`

###### l1FeeScalar

> **l1FeeScalar**: `null` \| `number`

###### l1GasPrice

> **l1GasPrice**: `null` \| `bigint`

###### l1GasUsed

> **l1GasUsed**: `null` \| `bigint`

###### logs

> **logs**: `Log`\<`bigint`, `number`, `false`, `undefined`, `undefined`, `undefined`, `undefined`\>[]

###### logsBloom

> **logsBloom**: `` `0x${string}` ``

###### root?

> `optional` **root**: `` `0x${string}` ``

###### status

> **status**: `"success"` \| `"reverted"`

###### to

> **to**: `null` \| `` `0x${string}` ``

###### transactionHash

> **transactionHash**: `` `0x${string}` ``

###### transactionIndex

> **transactionIndex**: `number`

###### type

> **type**: `TransactionType`

#### 999.formatters.transactionReceipt.type

> **type**: `"transactionReceipt"`

#### 999.id

> **id**: `999`

#### 999.name

> **name**: `"Zora Goerli Testnet"`

#### 999.nativeCurrency

> **nativeCurrency**: `object`

#### 999.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 999.nativeCurrency.name

> `readonly` **name**: `"Zora Goerli"`

#### 999.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 999.rpcUrls

> **rpcUrls**: `object`

#### 999.rpcUrls.default

> `readonly` **default**: `object`

#### 999.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://testnet.rpc.zora.energy"`\]

#### 999.rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly \[`"wss://testnet.rpc.zora.energy"`\]

#### 999.serializers

> **serializers**: `object`

#### 999.serializers.transaction()

> `readonly` **transaction**: (`transaction`, `signature?`) => `` `0x02${string}` `` \| `` `0x01${string}` `` \| `` `0x03${string}` `` \| `` `0x04${string}` `` \| `TransactionSerializedLegacy` \| `` `0x7e${string}` ``

##### Parameters

###### transaction

`OpStackTransactionSerializable`

###### signature?

`Signature`

##### Returns

`` `0x02${string}` `` \| `` `0x01${string}` `` \| `` `0x03${string}` `` \| `` `0x04${string}` `` \| `TransactionSerializedLegacy` \| `` `0x7e${string}` ``

#### 999.sourceId

> **sourceId**: `5`

#### 999.testnet

> **testnet**: `true`

### 999999999

> **999999999**: `object` = `chains.zoraSepolia`

#### 999999999.blockExplorers

> **blockExplorers**: `object`

#### 999999999.blockExplorers.default

> `readonly` **default**: `object`

#### 999999999.blockExplorers.default.apiUrl

> `readonly` **apiUrl**: `"https://sepolia.explorer.zora.energy/api"`

#### 999999999.blockExplorers.default.name

> `readonly` **name**: `"Zora Sepolia Explorer"`

#### 999999999.blockExplorers.default.url

> `readonly` **url**: `"https://sepolia.explorer.zora.energy/"`

#### 999999999.contracts

> **contracts**: `object`

#### 999999999.contracts.gasPriceOracle

> `readonly` **gasPriceOracle**: `object`

#### 999999999.contracts.gasPriceOracle.address

> `readonly` **address**: `"0x420000000000000000000000000000000000000F"`

#### 999999999.contracts.l1Block

> `readonly` **l1Block**: `object`

#### 999999999.contracts.l1Block.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000015"`

#### 999999999.contracts.l1StandardBridge

> `readonly` **l1StandardBridge**: `object`

#### 999999999.contracts.l1StandardBridge.11155111

> `readonly` **11155111**: `object`

#### 999999999.contracts.l1StandardBridge.11155111.address

> `readonly` **address**: `"0x5376f1D543dcbB5BD416c56C189e4cB7399fCcCB"`

#### 999999999.contracts.l2CrossDomainMessenger

> `readonly` **l2CrossDomainMessenger**: `object`

#### 999999999.contracts.l2CrossDomainMessenger.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000007"`

#### 999999999.contracts.l2Erc721Bridge

> `readonly` **l2Erc721Bridge**: `object`

#### 999999999.contracts.l2Erc721Bridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000014"`

#### 999999999.contracts.l2OutputOracle

> `readonly` **l2OutputOracle**: `object`

#### 999999999.contracts.l2OutputOracle.11155111

> `readonly` **11155111**: `object`

#### 999999999.contracts.l2OutputOracle.11155111.address

> `readonly` **address**: `"0x2615B481Bd3E5A1C0C7Ca3Da1bdc663E8615Ade9"`

#### 999999999.contracts.l2StandardBridge

> `readonly` **l2StandardBridge**: `object`

#### 999999999.contracts.l2StandardBridge.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000010"`

#### 999999999.contracts.l2ToL1MessagePasser

> `readonly` **l2ToL1MessagePasser**: `object`

#### 999999999.contracts.l2ToL1MessagePasser.address

> `readonly` **address**: `"0x4200000000000000000000000000000000000016"`

#### 999999999.contracts.multicall3

> `readonly` **multicall3**: `object`

#### 999999999.contracts.multicall3.address

> `readonly` **address**: `"0xcA11bde05977b3631167028862bE2a173976CA11"`

#### 999999999.contracts.multicall3.blockCreated

> `readonly` **blockCreated**: `83160`

#### 999999999.contracts.portal

> `readonly` **portal**: `object`

#### 999999999.contracts.portal.11155111

> `readonly` **11155111**: `object`

#### 999999999.contracts.portal.11155111.address

> `readonly` **address**: `"0xeffE2C6cA9Ab797D418f0D91eA60807713f3536f"`

#### 999999999.custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

#### 999999999.ensTlds?

> `optional` **ensTlds**: readonly `string`[]

#### 999999999.fees?

> `optional` **fees**: `ChainFees`\<`undefined`\>

#### 999999999.formatters

> **formatters**: `object`

#### 999999999.formatters.block

> `readonly` **block**: `object`

#### 999999999.formatters.block.exclude

> **exclude**: `undefined` \| \[\]

#### 999999999.formatters.block.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`OpStackRpcBlock`\<`BlockTag`, `boolean`\>

##### Returns

`object`

###### baseFeePerGas

> **baseFeePerGas**: `null` \| `bigint`

###### blobGasUsed

> **blobGasUsed**: `bigint`

###### difficulty

> **difficulty**: `bigint`

###### excessBlobGas

> **excessBlobGas**: `bigint`

###### extraData

> **extraData**: `` `0x${string}` ``

###### gasLimit

> **gasLimit**: `bigint`

###### gasUsed

> **gasUsed**: `bigint`

###### hash

> **hash**: `null` \| `` `0x${string}` ``

###### logsBloom

> **logsBloom**: `null` \| `` `0x${string}` ``

###### miner

> **miner**: `` `0x${string}` ``

###### mixHash

> **mixHash**: `` `0x${string}` ``

###### nonce

> **nonce**: `null` \| `` `0x${string}` ``

###### number

> **number**: `null` \| `bigint`

###### parentBeaconBlockRoot?

> `optional` **parentBeaconBlockRoot**: `` `0x${string}` ``

###### parentHash

> **parentHash**: `` `0x${string}` ``

###### receiptsRoot

> **receiptsRoot**: `` `0x${string}` ``

###### sealFields

> **sealFields**: `` `0x${string}` ``[]

###### sha3Uncles

> **sha3Uncles**: `` `0x${string}` ``

###### size

> **size**: `bigint`

###### stateRoot

> **stateRoot**: `` `0x${string}` ``

###### timestamp

> **timestamp**: `bigint`

###### totalDifficulty

> **totalDifficulty**: `null` \| `bigint`

###### transactions

> **transactions**: `` `0x${string}` ``[] \| `OpStackTransaction`\<`boolean`\>[]

###### transactionsRoot

> **transactionsRoot**: `` `0x${string}` ``

###### uncles

> **uncles**: `` `0x${string}` ``[]

###### withdrawals?

> `optional` **withdrawals**: `Withdrawal`[]

###### withdrawalsRoot?

> `optional` **withdrawalsRoot**: `` `0x${string}` ``

#### 999999999.formatters.block.type

> **type**: `"block"`

#### 999999999.formatters.transaction

> `readonly` **transaction**: `object`

#### 999999999.formatters.transaction.exclude

> **exclude**: `undefined` \| \[\]

#### 999999999.formatters.transaction.format()

> **format**: (`args`) => \{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

##### Parameters

###### args

`OpStackRpcTransaction`\<`boolean`\>

##### Returns

\{ `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `boolean`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `bigint`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash`: `` `0x${string}` ``; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"deposit"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList?`: `undefined`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId?`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"legacy"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity?`: `undefined`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice`: `bigint`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas?`: `undefined`; `maxPriorityFeePerGas?`: `undefined`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip2930"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip1559"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList?`: `undefined`; `blobVersionedHashes`: readonly `` `0x${string}` ``[]; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas`: `bigint`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip4844"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \} \| \{ `accessList`: `AccessList`; `authorizationList`: `SignedAuthorizationList`\<`number`\>; `blobVersionedHashes?`: `undefined`; `blockHash`: `null` \| `` `0x${string}` ``; `blockNumber`: `null` \| `bigint`; `chainId`: `number`; `from`: `` `0x${string}` ``; `gas`: `bigint`; `gasPrice?`: `undefined`; `hash`: `` `0x${string}` ``; `input`: `` `0x${string}` ``; `isSystemTx?`: `undefined`; `maxFeePerBlobGas?`: `undefined`; `maxFeePerGas`: `bigint`; `maxPriorityFeePerGas`: `bigint`; `mint?`: `undefined`; `nonce`: `number`; `r`: `` `0x${string}` ``; `s`: `` `0x${string}` ``; `sourceHash?`: `undefined`; `to`: `null` \| `` `0x${string}` ``; `transactionIndex`: `null` \| `number`; `type`: `"eip7702"`; `typeHex`: `null` \| `` `0x${string}` ``; `v`: `bigint`; `value`: `bigint`; `yParity`: `number`; \}

#### 999999999.formatters.transaction.type

> **type**: `"transaction"`

#### 999999999.formatters.transactionReceipt

> `readonly` **transactionReceipt**: `object`

#### 999999999.formatters.transactionReceipt.exclude

> **exclude**: `undefined` \| \[\]

#### 999999999.formatters.transactionReceipt.format()

> **format**: (`args`) => `object`

##### Parameters

###### args

`OpStackRpcTransactionReceipt`

##### Returns

`object`

###### blobGasPrice?

> `optional` **blobGasPrice**: `bigint`

###### blobGasUsed?

> `optional` **blobGasUsed**: `bigint`

###### blockHash

> **blockHash**: `` `0x${string}` ``

###### blockNumber

> **blockNumber**: `bigint`

###### contractAddress

> **contractAddress**: `undefined` \| `null` \| `` `0x${string}` ``

###### cumulativeGasUsed

> **cumulativeGasUsed**: `bigint`

###### effectiveGasPrice

> **effectiveGasPrice**: `bigint`

###### from

> **from**: `` `0x${string}` ``

###### gasUsed

> **gasUsed**: `bigint`

###### l1Fee

> **l1Fee**: `null` \| `bigint`

###### l1FeeScalar

> **l1FeeScalar**: `null` \| `number`

###### l1GasPrice

> **l1GasPrice**: `null` \| `bigint`

###### l1GasUsed

> **l1GasUsed**: `null` \| `bigint`

###### logs

> **logs**: `Log`\<`bigint`, `number`, `false`, `undefined`, `undefined`, `undefined`, `undefined`\>[]

###### logsBloom

> **logsBloom**: `` `0x${string}` ``

###### root?

> `optional` **root**: `` `0x${string}` ``

###### status

> **status**: `"success"` \| `"reverted"`

###### to

> **to**: `null` \| `` `0x${string}` ``

###### transactionHash

> **transactionHash**: `` `0x${string}` ``

###### transactionIndex

> **transactionIndex**: `number`

###### type

> **type**: `TransactionType`

#### 999999999.formatters.transactionReceipt.type

> **type**: `"transactionReceipt"`

#### 999999999.id

> **id**: `999999999`

#### 999999999.name

> **name**: `"Zora Sepolia"`

#### 999999999.nativeCurrency

> **nativeCurrency**: `object`

#### 999999999.nativeCurrency.decimals

> `readonly` **decimals**: `18`

#### 999999999.nativeCurrency.name

> `readonly` **name**: `"Zora Sepolia"`

#### 999999999.nativeCurrency.symbol

> `readonly` **symbol**: `"ETH"`

#### 999999999.network

> `readonly` **network**: `"zora-sepolia"`

#### 999999999.rpcUrls

> **rpcUrls**: `object`

#### 999999999.rpcUrls.default

> `readonly` **default**: `object`

#### 999999999.rpcUrls.default.http

> `readonly` **http**: readonly \[`"https://sepolia.rpc.zora.energy"`\]

#### 999999999.rpcUrls.default.webSocket

> `readonly` **webSocket**: readonly \[`"wss://sepolia.rpc.zora.energy"`\]

#### 999999999.serializers

> **serializers**: `object`

#### 999999999.serializers.transaction()

> `readonly` **transaction**: (`transaction`, `signature?`) => `` `0x02${string}` `` \| `` `0x01${string}` `` \| `` `0x03${string}` `` \| `` `0x04${string}` `` \| `TransactionSerializedLegacy` \| `` `0x7e${string}` ``

##### Parameters

###### transaction

`OpStackTransactionSerializable`

###### signature?

`Signature`

##### Returns

`` `0x02${string}` `` \| `` `0x01${string}` `` \| `` `0x03${string}` `` \| `` `0x04${string}` `` \| `TransactionSerializedLegacy` \| `` `0x7e${string}` ``

#### 999999999.sourceId

> **sourceId**: `11155111`

#### 999999999.testnet

> **testnet**: `true`
