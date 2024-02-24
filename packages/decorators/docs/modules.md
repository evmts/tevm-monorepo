[@tevm/decorators](README.md) / Exports

# @tevm/decorators

## Table of contents

### Classes

- [ProviderRpcError](classes/ProviderRpcError.md)

### Type Aliases

- [AddEthereumChainParameter](modules.md#addethereumchainparameter)
- [DerivedRpcSchema](modules.md#derivedrpcschema)
- [EIP1193EventEmitter](modules.md#eip1193eventemitter)
- [EIP1193EventMap](modules.md#eip1193eventmap)
- [EIP1193Events](modules.md#eip1193events)
- [EIP1193Parameters](modules.md#eip1193parameters)
- [EIP1193RequestFn](modules.md#eip1193requestfn)
- [EIP1193RequestOptions](modules.md#eip1193requestoptions)
- [Eip1193RequestProvider](modules.md#eip1193requestprovider)
- [EthActionsApi](modules.md#ethactionsapi)
- [Hash](modules.md#hash)
- [JsonRpcSchemaPublic](modules.md#jsonrpcschemapublic)
- [JsonRpcSchemaTevm](modules.md#jsonrpcschematevm)
- [JsonRpcSchemaWallet](modules.md#jsonrpcschemawallet)
- [LogTopic](modules.md#logtopic)
- [NetworkSync](modules.md#networksync)
- [ProviderConnectInfo](modules.md#providerconnectinfo)
- [ProviderMessage](modules.md#providermessage)
- [Quantity](modules.md#quantity)
- [RpcSchema](modules.md#rpcschema)
- [RpcSchemaOverride](modules.md#rpcschemaoverride)
- [TestRpcSchema](modules.md#testrpcschema)
- [TevmActionsApi](modules.md#tevmactionsapi)
- [WalletPermission](modules.md#walletpermission)
- [WalletPermissionCaveat](modules.md#walletpermissioncaveat)
- [WatchAssetParams](modules.md#watchassetparams)

### Functions

- [createEventEmitter](modules.md#createeventemitter)
- [ethActions](modules.md#ethactions)
- [requestEip1193](modules.md#requesteip1193)
- [tevmActions](modules.md#tevmactions)
- [tevmSend](modules.md#tevmsend)

## Type Aliases

### AddEthereumChainParameter

Ƭ **AddEthereumChainParameter**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockExplorerUrls?` | `string`[] | - |
| `chainId` | `string` | A 0x-prefixed hexadecimal string |
| `chainName` | `string` | The chain name. |
| `iconUrls?` | `string`[] | - |
| `nativeCurrency?` | \{ `decimals`: `number` ; `name`: `string` ; `symbol`: `string`  } | Native currency for the chain. |
| `nativeCurrency.decimals` | `number` | - |
| `nativeCurrency.name` | `string` | - |
| `nativeCurrency.symbol` | `string` | - |
| `rpcUrls` | readonly `string`[] | - |

#### Defined in

[evmts-monorepo/packages/decorators/src/eip1193/AddEthereumChainParameter.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/AddEthereumChainParameter.ts#L7)

___

### DerivedRpcSchema

Ƭ **DerivedRpcSchema**\<`TRpcSchema`, `TRpcSchemaOverride`\>: `TRpcSchemaOverride` extends [`RpcSchemaOverride`](modules.md#rpcschemaoverride) ? [`TRpcSchemaOverride` & \{ `Method`: `string`  }] : `TRpcSchema`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TRpcSchema` | extends [`RpcSchema`](modules.md#rpcschema) \| `undefined` |
| `TRpcSchemaOverride` | extends [`RpcSchemaOverride`](modules.md#rpcschemaoverride) \| `undefined` |

#### Defined in

[evmts-monorepo/packages/decorators/src/eip1193/DerivedRpcSchema.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/DerivedRpcSchema.ts#L11)

___

### EIP1193EventEmitter

Ƭ **EIP1193EventEmitter**: [`EIP1193Events`](modules.md#eip1193events) & \{ `emit`: (`eventName`: keyof [`EIP1193EventMap`](modules.md#eip1193eventmap), ...`args`: `any`[]) => `boolean`  }

A very minimal EventEmitter interface

#### Defined in

[evmts-monorepo/packages/decorators/src/events/EIP1193EventEmitter.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/events/EIP1193EventEmitter.ts#L9)

___

### EIP1193EventMap

Ƭ **EIP1193EventMap**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `accountsChanged` | (`accounts`: \`0x$\{string}\`[]) => `void` |
| `chainChanged` | (`chainId`: `string`) => `void` |
| `connect` | (`connectInfo`: [`ProviderConnectInfo`](modules.md#providerconnectinfo)) => `void` |
| `disconnect` | (`error`: [`ProviderRpcError`](classes/ProviderRpcError.md)) => `void` |
| `message` | (`message`: [`ProviderMessage`](modules.md#providermessage)) => `void` |

#### Defined in

[evmts-monorepo/packages/decorators/src/eip1193/EIP1193Events.ts:28](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/EIP1193Events.ts#L28)

___

### EIP1193Events

Ƭ **EIP1193Events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `on` | \<TEvent\>(`event`: `TEvent`, `listener`: [`EIP1193EventMap`](modules.md#eip1193eventmap)[`TEvent`]) => `void` |
| `removeListener` | \<TEvent\>(`event`: `TEvent`, `listener`: [`EIP1193EventMap`](modules.md#eip1193eventmap)[`TEvent`]) => `void` |

#### Defined in

[evmts-monorepo/packages/decorators/src/eip1193/EIP1193Events.ts:36](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/EIP1193Events.ts#L36)

___

### EIP1193Parameters

Ƭ **EIP1193Parameters**\<`TRpcSchema`\>: `TRpcSchema` extends [`RpcSchema`](modules.md#rpcschema) ? \{ [K in keyof TRpcSchema]: Object & (TRpcSchema[K] extends TRpcSchema[number] ? TRpcSchema[K]["Parameters"] extends undefined ? Object : Object : never) }[`number`] : \{ `method`: `string` ; `params?`: `unknown`  }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TRpcSchema` | extends [`RpcSchema`](modules.md#rpcschema) \| `undefined` = `undefined` |

#### Defined in

[evmts-monorepo/packages/decorators/src/eip1193/EIP1193Parameters.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/EIP1193Parameters.ts#L10)

___

### EIP1193RequestFn

Ƭ **EIP1193RequestFn**\<`TRpcSchema`\>: \<TRpcSchemaOverride, TParameters, _ReturnType\>(`args`: `TParameters`, `options?`: [`EIP1193RequestOptions`](modules.md#eip1193requestoptions)) => `Promise`\<`_ReturnType`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TRpcSchema` | extends [`RpcSchema`](modules.md#rpcschema) \| `undefined` = `undefined` |

#### Type declaration

▸ \<`TRpcSchemaOverride`, `TParameters`, `_ReturnType`\>(`args`, `options?`): `Promise`\<`_ReturnType`\>

##### Type parameters

| Name | Type |
| :------ | :------ |
| `TRpcSchemaOverride` | extends [`RpcSchemaOverride`](modules.md#rpcschemaoverride) \| `undefined` = `undefined` |
| `TParameters` | extends [`EIP1193Parameters`](modules.md#eip1193parameters)\<[`DerivedRpcSchema`](modules.md#derivedrpcschema)\<`TRpcSchema`, `TRpcSchemaOverride`\>\> = [`EIP1193Parameters`](modules.md#eip1193parameters)\<[`DerivedRpcSchema`](modules.md#derivedrpcschema)\<`TRpcSchema`, `TRpcSchemaOverride`\>\> |
| `_ReturnType` | [`DerivedRpcSchema`](modules.md#derivedrpcschema)\<`TRpcSchema`, `TRpcSchemaOverride`\> extends [`RpcSchema`](modules.md#rpcschema) ? `Extract`\<[`DerivedRpcSchema`](modules.md#derivedrpcschema)\<`TRpcSchema`, `TRpcSchemaOverride`\>[`number`], \{ `Method`: `TParameters`[``"method"``]  }\>[``"ReturnType"``] : `unknown` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `args` | `TParameters` |
| `options?` | [`EIP1193RequestOptions`](modules.md#eip1193requestoptions) |

##### Returns

`Promise`\<`_ReturnType`\>

#### Defined in

[evmts-monorepo/packages/decorators/src/eip1193/EIP1993RequestFn.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/EIP1993RequestFn.ts#L14)

___

### EIP1193RequestOptions

Ƭ **EIP1193RequestOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `retryCount?` | `number` |
| `retryDelay?` | `number` |

#### Defined in

[evmts-monorepo/packages/decorators/src/eip1193/EIP1993RequestOptions.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/EIP1993RequestOptions.ts#L7)

___

### Eip1193RequestProvider

Ƭ **Eip1193RequestProvider**: `Object`

The default EIP1193 compatable provider request method with enabled tevm methods.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `request` | [`EIP1193RequestFn`](modules.md#eip1193requestfn)\<[[`JsonRpcSchemaTevm`](modules.md#jsonrpcschematevm)[``"tevm_call"``], [`JsonRpcSchemaTevm`](modules.md#jsonrpcschematevm)[``"tevm_script"``], [`JsonRpcSchemaTevm`](modules.md#jsonrpcschematevm)[``"tevm_dumpState"``], [`JsonRpcSchemaTevm`](modules.md#jsonrpcschematevm)[``"tevm_loadState"``], [`JsonRpcSchemaTevm`](modules.md#jsonrpcschematevm)[``"tevm_getAccount"``], [`JsonRpcSchemaTevm`](modules.md#jsonrpcschematevm)[``"tevm_setAccount"``], [`JsonRpcSchemaPublic`](modules.md#jsonrpcschemapublic)[``"eth_blockNumber"``], [`JsonRpcSchemaPublic`](modules.md#jsonrpcschemapublic)[``"eth_call"``], [`JsonRpcSchemaPublic`](modules.md#jsonrpcschemapublic)[``"eth_chainId"``], [`JsonRpcSchemaPublic`](modules.md#jsonrpcschemapublic)[``"eth_getCode"``], [`JsonRpcSchemaPublic`](modules.md#jsonrpcschemapublic)[``"eth_getStorageAt"``], [`JsonRpcSchemaPublic`](modules.md#jsonrpcschemapublic)[``"eth_gasPrice"``], [`JsonRpcSchemaPublic`](modules.md#jsonrpcschemapublic)[``"eth_getBalance"``], [`JsonRpcSchemaPublic`](modules.md#jsonrpcschemapublic)[``"eth_call"``], [`JsonRpcSchemaPublic`](modules.md#jsonrpcschemapublic)[``"eth_call"``]]\> |

#### Defined in

[evmts-monorepo/packages/decorators/src/request/Eip1193RequestProvider.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/request/Eip1193RequestProvider.ts#L12)

___

### EthActionsApi

Ƭ **EthActionsApi**: `Object`

The actions api is the high level API for interacting with a Tevm client similar to [viem actions](https://viem.sh/learn/actions/)
These actions correspond 1:1 eith the public ethereum JSON-RPC api

**`See`**

[https://tevm.sh/learn/actions/](https://tevm.sh/learn/actions/)

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `eth` | \{ `blockNumber`: `EthBlockNumberHandler` ; `call`: `EthCallHandler` ; `chainId`: `EthChainIdHandler` ; `gasPrice`: `EthGasPriceHandler` ; `getBalance`: `EthGetBalanceHandler` ; `getCode`: `EthGetCodeHandler` ; `getStorageAt`: `EthGetStorageAtHandler`  } | Standard JSON-RPC methods for interacting with the VM **`See`** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) |
| `eth.blockNumber` | `EthBlockNumberHandler` | Returns the current block number Set the `tag` to a block number or block hash to get the balance at that block Block tag defaults to 'pending' tag which is the optimistic state of the VM **`See`** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) **`Example`** ```ts const blockNumber = await tevm.eth.blockNumber() console.log(blockNumber) // 0n ``` |
| `eth.call` | `EthCallHandler` | Executes a call without modifying the state Set the `tag` to a block number or block hash to get the balance at that block Block tag defaults to 'pending' tag which is the optimistic state of the VM **`See`** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) **`Example`** ```ts const res = await tevm.eth.call({to: '0x123...', data: '0x123...'}) console.log(res) // "0x..." ``` |
| `eth.chainId` | `EthChainIdHandler` | Returns the current chain id Set the `tag` to a block number or block hash to get the balance at that block Block tag defaults to 'pending' tag which is the optimistic state of the VM **`See`** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) **`Example`** ```ts const chainId = await tevm.eth.chainId() console.log(chainId) // 10n ``` |
| `eth.gasPrice` | `EthGasPriceHandler` | Returns the current gas price Set the `tag` to a block number or block hash to get the balance at that block Block tag defaults to 'pending' tag which is the optimistic state of the VM **`See`** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) **`Example`** ```ts const gasPrice = await tevm.eth.gasPrice() console.log(gasPrice) // 0n ``` |
| `eth.getBalance` | `EthGetBalanceHandler` | Returns the balance of a given address Set the `tag` to a block number or block hash to get the balance at that block Block tag defaults to 'pending' tag which is the optimistic state of the VM **`See`** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) **`Example`** ```ts const balance = await tevm.eth.getBalance({address: '0x123...', tag: 'pending'}) console.log(gasPrice) // 0n ``` |
| `eth.getCode` | `EthGetCodeHandler` | Returns code at a given address Set the `tag` to a block number or block hash to get the balance at that block Block tag defaults to 'pending' tag which is the optimistic state of the VM **`See`** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) **`Example`** ```ts const code = await tevm.eth.getCode({address: '0x123...'}) ``` |
| `eth.getStorageAt` | `EthGetStorageAtHandler` | Returns storage at a given address and slot Set the `tag` to a block number or block hash to get the balance at that block Block tag defaults to 'pending' tag which is the optimistic state of the VM **`See`** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) **`Example`** ```ts const storageValue = await tevm.eth.getStorageAt({address: '0x123...', position: 0}) ``` |

#### Defined in

[evmts-monorepo/packages/decorators/src/actions/EthActionsApi.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/actions/EthActionsApi.ts#L16)

___

### Hash

Ƭ **Hash**: \`0x$\{string}\`

#### Defined in

[evmts-monorepo/packages/decorators/src/eip1193/misc.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/misc.ts#L9)

___

### JsonRpcSchemaPublic

Ƭ **JsonRpcSchemaPublic**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `eth_blobGasPrice` | \{ `Method`: ``"eth_blobGasPrice"`` ; `Parameters?`: `undefined` ; `ReturnType`: `Quantity`  } | **`Description`** Returns the current blob price of gas expressed in wei **`Example`** ```ts provider.request({ method: 'eth_blobGasPrice' }) // => '0x09184e72a000' ``` |
| `eth_blobGasPrice.Method` | ``"eth_blobGasPrice"`` | - |
| `eth_blobGasPrice.Parameters?` | `undefined` | - |
| `eth_blobGasPrice.ReturnType` | `Quantity` | - |
| `eth_blockNumber` | \{ `Method`: ``"eth_blockNumber"`` ; `Parameters?`: `undefined` ; `ReturnType`: `Quantity`  } | **`Description`** Returns the number of the most recent block seen by this client **`Example`** ```ts provider.request({ method: 'eth_blockNumber' }) // => '0x1b4' ``` |
| `eth_blockNumber.Method` | ``"eth_blockNumber"`` | - |
| `eth_blockNumber.Parameters?` | `undefined` | - |
| `eth_blockNumber.ReturnType` | `Quantity` | - |
| `eth_call` | \{ `Method`: ``"eth_call"`` ; `Parameters`: [transaction: Partial\<TransactionRequest\>] \| [transaction: Partial\<TransactionRequest\>, block: BlockNumber \| BlockTag \| BlockIdentifier] \| [transaction: Partial\<TransactionRequest\>, block: BlockNumber \| BlockTag \| BlockIdentifier, stateOverrideSet: RpcStateOverride] ; `ReturnType`: `Hex`  } | **`Description`** Executes a new message call immediately without submitting a transaction to the network **`Example`** ```ts provider.request({ method: 'eth_call', params: [{ to: '0x...', data: '0x...' }] }) // => '0x...' ``` |
| `eth_call.Method` | ``"eth_call"`` | - |
| `eth_call.Parameters` | [transaction: Partial\<TransactionRequest\>] \| [transaction: Partial\<TransactionRequest\>, block: BlockNumber \| BlockTag \| BlockIdentifier] \| [transaction: Partial\<TransactionRequest\>, block: BlockNumber \| BlockTag \| BlockIdentifier, stateOverrideSet: RpcStateOverride] | - |
| `eth_call.ReturnType` | `Hex` | - |
| `eth_chainId` | \{ `Method`: ``"eth_chainId"`` ; `Parameters?`: `undefined` ; `ReturnType`: `Quantity`  } | **`Description`** Returns the chain ID associated with the current network **`Example`** ```ts provider.request({ method: 'eth_chainId' }) // => '1' ``` |
| `eth_chainId.Method` | ``"eth_chainId"`` | - |
| `eth_chainId.Parameters?` | `undefined` | - |
| `eth_chainId.ReturnType` | `Quantity` | - |
| `eth_coinbase` | \{ `Method`: ``"eth_coinbase"`` ; `Parameters?`: `undefined` ; `ReturnType`: `Address`  } | **`Description`** Returns the client coinbase address. **`Example`** ```ts provider.request({ method: 'eth_coinbase' }) // => '0x...' ``` |
| `eth_coinbase.Method` | ``"eth_coinbase"`` | - |
| `eth_coinbase.Parameters?` | `undefined` | - |
| `eth_coinbase.ReturnType` | `Address` | - |
| `eth_estimateGas` | \{ `Method`: ``"eth_estimateGas"`` ; `Parameters`: [transaction: TransactionRequest] \| [transaction: TransactionRequest, block: BlockNumber \| BlockTag] ; `ReturnType`: `Quantity`  } | **`Description`** Estimates the gas necessary to complete a transaction without submitting it to the network **`Example`** ```ts provider.request({ method: 'eth_estimateGas', params: [{ from: '0x...', to: '0x...', value: '0x...' }] }) // => '0x5208' ``` |
| `eth_estimateGas.Method` | ``"eth_estimateGas"`` | - |
| `eth_estimateGas.Parameters` | [transaction: TransactionRequest] \| [transaction: TransactionRequest, block: BlockNumber \| BlockTag] | - |
| `eth_estimateGas.ReturnType` | `Quantity` | - |
| `eth_feeHistory` | \{ `Method`: ``"eth_feeHistory"`` ; `Parameters`: [blockCount: Quantity, newestBlock: BlockNumber \| BlockTag, rewardPercentiles: number[] \| undefined] ; `ReturnType`: `FeeHistory`  } | **`Description`** Returns a collection of historical gas information **`Example`** ```ts provider.request({ method: 'eth_feeHistory', params: ['4', 'latest', ['25', '75']] }) // => { // oldestBlock: '0x1', // baseFeePerGas: ['0x1', '0x2', '0x3', '0x4'], // gasUsedRatio: ['0x1', '0x2', '0x3', '0x4'], // reward: [['0x1', '0x2'], ['0x3', '0x4'], ['0x5', '0x6'], ['0x7', '0x8']] // } ``` |
| `eth_feeHistory.Method` | ``"eth_feeHistory"`` | - |
| `eth_feeHistory.Parameters` | [blockCount: Quantity, newestBlock: BlockNumber \| BlockTag, rewardPercentiles: number[] \| undefined] | - |
| `eth_feeHistory.ReturnType` | `FeeHistory` | - |
| `eth_gasPrice` | \{ `Method`: ``"eth_gasPrice"`` ; `Parameters?`: `undefined` ; `ReturnType`: `Quantity`  } | **`Description`** Returns the current price of gas expressed in wei **`Example`** ```ts provider.request({ method: 'eth_gasPrice' }) // => '0x09184e72a000' ``` |
| `eth_gasPrice.Method` | ``"eth_gasPrice"`` | - |
| `eth_gasPrice.Parameters?` | `undefined` | - |
| `eth_gasPrice.ReturnType` | `Quantity` | - |
| `eth_getBalance` | \{ `Method`: ``"eth_getBalance"`` ; `Parameters`: [address: Address, block: BlockNumber \| BlockTag \| BlockIdentifier] ; `ReturnType`: `Quantity`  } | **`Description`** Returns the balance of an address in wei **`Example`** ```ts provider.request({ method: 'eth_getBalance', params: ['0x...', 'latest'] }) // => '0x12a05...' ``` |
| `eth_getBalance.Method` | ``"eth_getBalance"`` | - |
| `eth_getBalance.Parameters` | [address: Address, block: BlockNumber \| BlockTag \| BlockIdentifier] | - |
| `eth_getBalance.ReturnType` | `Quantity` | - |
| `eth_getBlockByHash` | \{ `Method`: ``"eth_getBlockByHash"`` ; `Parameters`: [hash: Hash, includeTransactionObjects: boolean] ; `ReturnType`: `Block` \| ``null``  } | **`Description`** Returns information about a block specified by hash **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_getBlockByHash', params: ['0x...', true] }) // => { // number: '0x1b4', // hash: '0x...', // parentHash: '0x...', // ... // } ``` |
| `eth_getBlockByHash.Method` | ``"eth_getBlockByHash"`` | - |
| `eth_getBlockByHash.Parameters` | [hash: Hash, includeTransactionObjects: boolean] | - |
| `eth_getBlockByHash.ReturnType` | `Block` \| ``null`` | - |
| `eth_getBlockByNumber` | \{ `Method`: ``"eth_getBlockByNumber"`` ; `Parameters`: [block: BlockNumber \| BlockTag, includeTransactionObjects: boolean] ; `ReturnType`: `Block` \| ``null``  } | **`Description`** Returns information about a block specified by number **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_getBlockByNumber', params: ['0x1b4', true] }) // => { // number: '0x1b4', // hash: '0x...', // parentHash: '0x...', // ... // } ``` |
| `eth_getBlockByNumber.Method` | ``"eth_getBlockByNumber"`` | - |
| `eth_getBlockByNumber.Parameters` | [block: BlockNumber \| BlockTag, includeTransactionObjects: boolean] | - |
| `eth_getBlockByNumber.ReturnType` | `Block` \| ``null`` | - |
| `eth_getBlockTransactionCountByHash` | \{ `Method`: ``"eth_getBlockTransactionCountByHash"`` ; `Parameters`: [hash: Hash] ; `ReturnType`: `Quantity`  } | **`Description`** Returns the number of transactions in a block specified by block hash **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_getBlockTransactionCountByHash', params: ['0x...'] }) // => '0x1' ``` |
| `eth_getBlockTransactionCountByHash.Method` | ``"eth_getBlockTransactionCountByHash"`` | - |
| `eth_getBlockTransactionCountByHash.Parameters` | [hash: Hash] | - |
| `eth_getBlockTransactionCountByHash.ReturnType` | `Quantity` | - |
| `eth_getBlockTransactionCountByNumber` | \{ `Method`: ``"eth_getBlockTransactionCountByNumber"`` ; `Parameters`: [block: BlockNumber \| BlockTag] ; `ReturnType`: `Quantity`  } | **`Description`** Returns the number of transactions in a block specified by block number **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_getBlockTransactionCountByNumber', params: ['0x1b4'] }) // => '0x1' ``` |
| `eth_getBlockTransactionCountByNumber.Method` | ``"eth_getBlockTransactionCountByNumber"`` | - |
| `eth_getBlockTransactionCountByNumber.Parameters` | [block: BlockNumber \| BlockTag] | - |
| `eth_getBlockTransactionCountByNumber.ReturnType` | `Quantity` | - |
| `eth_getCode` | \{ `Method`: ``"eth_getCode"`` ; `Parameters`: [address: Address, block: BlockNumber \| BlockTag \| BlockIdentifier] ; `ReturnType`: `Hex`  } | **`Description`** Returns the contract code stored at a given address **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_getCode', params: ['0x...', 'latest'] }) // => '0x...' ``` |
| `eth_getCode.Method` | ``"eth_getCode"`` | - |
| `eth_getCode.Parameters` | [address: Address, block: BlockNumber \| BlockTag \| BlockIdentifier] | - |
| `eth_getCode.ReturnType` | `Hex` | - |
| `eth_getFilterChanges` | \{ `Method`: ``"eth_getFilterChanges"`` ; `Parameters`: [filterId: Quantity] ; `ReturnType`: `Log`[] \| `Hex`[]  } | **`Description`** Returns a list of all logs based on filter ID since the last log retrieval **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_getFilterChanges', params: ['0x...'] }) // => [{ ... }, { ... }] ``` |
| `eth_getFilterChanges.Method` | ``"eth_getFilterChanges"`` | - |
| `eth_getFilterChanges.Parameters` | [filterId: Quantity] | - |
| `eth_getFilterChanges.ReturnType` | `Log`[] \| `Hex`[] | - |
| `eth_getFilterLogs` | \{ `Method`: ``"eth_getFilterLogs"`` ; `Parameters`: [filterId: Quantity] ; `ReturnType`: `Log`[]  } | **`Description`** Returns a list of all logs based on filter ID **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_getFilterLogs', params: ['0x...'] }) // => [{ ... }, { ... }] ``` |
| `eth_getFilterLogs.Method` | ``"eth_getFilterLogs"`` | - |
| `eth_getFilterLogs.Parameters` | [filterId: Quantity] | - |
| `eth_getFilterLogs.ReturnType` | `Log`[] | - |
| `eth_getLogs` | \{ `Method`: ``"eth_getLogs"`` ; `Parameters`: [\{ `address?`: `Address` \| `Address`[] ; `topics?`: [`LogTopic`](modules.md#logtopic)[]  } & \{ `blockHash?`: `never` ; `fromBlock?`: `BlockNumber` \| `BlockTag` ; `toBlock?`: `BlockNumber` \| `BlockTag`  } \| \{ `blockHash?`: [`Hash`](modules.md#hash) ; `fromBlock?`: `never` ; `toBlock?`: `never`  }] ; `ReturnType`: `Log`[]  } | **`Description`** Returns a list of all logs based on a filter object **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_getLogs', params: [{ fromBlock: '0x...', toBlock: '0x...', address: '0x...', topics: ['0x...'] }] }) // => [{ ... }, { ... }] ``` |
| `eth_getLogs.Method` | ``"eth_getLogs"`` | - |
| `eth_getLogs.Parameters` | [\{ `address?`: `Address` \| `Address`[] ; `topics?`: [`LogTopic`](modules.md#logtopic)[]  } & \{ `blockHash?`: `never` ; `fromBlock?`: `BlockNumber` \| `BlockTag` ; `toBlock?`: `BlockNumber` \| `BlockTag`  } \| \{ `blockHash?`: [`Hash`](modules.md#hash) ; `fromBlock?`: `never` ; `toBlock?`: `never`  }] | - |
| `eth_getLogs.ReturnType` | `Log`[] | - |
| `eth_getProof` | \{ `Method`: ``"eth_getProof"`` ; `Parameters`: [address: Address, storageKeys: Hash[], block: BlockNumber \| BlockTag] ; `ReturnType`: `Proof`  } | **`Description`** Returns the account and storage values of the specified account including the Merkle-proof. **`Link`** https://eips.ethereum.org/EIPS/eip-1186 **`Example`** ```ts provider.request({ method: 'eth_getProof', params: ['0x...', ['0x...'], 'latest'] }) // => { // ... // } ``` |
| `eth_getProof.Method` | ``"eth_getProof"`` | - |
| `eth_getProof.Parameters` | [address: Address, storageKeys: Hash[], block: BlockNumber \| BlockTag] | - |
| `eth_getProof.ReturnType` | `Proof` | - |
| `eth_getStorageAt` | \{ `Method`: ``"eth_getStorageAt"`` ; `Parameters`: [address: Address, index: Quantity, block: BlockNumber \| BlockTag \| BlockIdentifier] ; `ReturnType`: `Hex`  } | **`Description`** Returns the value from a storage position at an address **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_getStorageAt', params: ['0x...', '0x...', 'latest'] }) // => '0x...' ``` |
| `eth_getStorageAt.Method` | ``"eth_getStorageAt"`` | - |
| `eth_getStorageAt.Parameters` | [address: Address, index: Quantity, block: BlockNumber \| BlockTag \| BlockIdentifier] | - |
| `eth_getStorageAt.ReturnType` | `Hex` | - |
| `eth_getTransactionByBlockHashAndIndex` | \{ `Method`: ``"eth_getTransactionByBlockHashAndIndex"`` ; `Parameters`: [hash: Hash, index: Quantity] ; `ReturnType`: `Transaction` \| ``null``  } | **`Description`** Returns information about a transaction specified by block hash and transaction index **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_getTransactionByBlockHashAndIndex', params: ['0x...', '0x...'] }) // => { ... } ``` |
| `eth_getTransactionByBlockHashAndIndex.Method` | ``"eth_getTransactionByBlockHashAndIndex"`` | - |
| `eth_getTransactionByBlockHashAndIndex.Parameters` | [hash: Hash, index: Quantity] | - |
| `eth_getTransactionByBlockHashAndIndex.ReturnType` | `Transaction` \| ``null`` | - |
| `eth_getTransactionByBlockNumberAndIndex` | \{ `Method`: ``"eth_getTransactionByBlockNumberAndIndex"`` ; `Parameters`: [block: BlockNumber \| BlockTag, index: Quantity] ; `ReturnType`: `Transaction` \| ``null``  } | **`Description`** Returns information about a transaction specified by block number and transaction index **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_getTransactionByBlockNumberAndIndex', params: ['0x...', '0x...'] }) // => { ... } ``` |
| `eth_getTransactionByBlockNumberAndIndex.Method` | ``"eth_getTransactionByBlockNumberAndIndex"`` | - |
| `eth_getTransactionByBlockNumberAndIndex.Parameters` | [block: BlockNumber \| BlockTag, index: Quantity] | - |
| `eth_getTransactionByBlockNumberAndIndex.ReturnType` | `Transaction` \| ``null`` | - |
| `eth_getTransactionByHash` | \{ `Method`: ``"eth_getTransactionByHash"`` ; `Parameters`: [hash: Hash] ; `ReturnType`: `Transaction` \| ``null``  } | **`Description`** Returns information about a transaction specified by hash **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_getTransactionByHash', params: ['0x...'] }) // => { ... } ``` |
| `eth_getTransactionByHash.Method` | ``"eth_getTransactionByHash"`` | - |
| `eth_getTransactionByHash.Parameters` | [hash: Hash] | - |
| `eth_getTransactionByHash.ReturnType` | `Transaction` \| ``null`` | - |
| `eth_getTransactionCount` | \{ `Method`: ``"eth_getTransactionCount"`` ; `Parameters`: [address: Address, block: BlockNumber \| BlockTag \| BlockIdentifier] ; `ReturnType`: `Quantity`  } | **`Description`** Returns the number of transactions sent from an address **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_getTransactionCount', params: ['0x...', 'latest'] }) // => '0x1' ``` |
| `eth_getTransactionCount.Method` | ``"eth_getTransactionCount"`` | - |
| `eth_getTransactionCount.Parameters` | [address: Address, block: BlockNumber \| BlockTag \| BlockIdentifier] | - |
| `eth_getTransactionCount.ReturnType` | `Quantity` | - |
| `eth_getTransactionReceipt` | \{ `Method`: ``"eth_getTransactionReceipt"`` ; `Parameters`: [hash: Hash] ; `ReturnType`: `TransactionReceipt` \| ``null``  } | **`Description`** Returns the receipt of a transaction specified by hash **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_getTransactionReceipt', params: ['0x...'] }) // => { ... } ``` |
| `eth_getTransactionReceipt.Method` | ``"eth_getTransactionReceipt"`` | - |
| `eth_getTransactionReceipt.Parameters` | [hash: Hash] | - |
| `eth_getTransactionReceipt.ReturnType` | `TransactionReceipt` \| ``null`` | - |
| `eth_getUncleByBlockHashAndIndex` | \{ `Method`: ``"eth_getUncleByBlockHashAndIndex"`` ; `Parameters`: [hash: Hash, index: Quantity] ; `ReturnType`: `Uncle` \| ``null``  } | **`Description`** Returns information about an uncle specified by block hash and uncle index position **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_getUncleByBlockHashAndIndex', params: ['0x...', '0x...'] }) // => { ... } ``` |
| `eth_getUncleByBlockHashAndIndex.Method` | ``"eth_getUncleByBlockHashAndIndex"`` | - |
| `eth_getUncleByBlockHashAndIndex.Parameters` | [hash: Hash, index: Quantity] | - |
| `eth_getUncleByBlockHashAndIndex.ReturnType` | `Uncle` \| ``null`` | - |
| `eth_getUncleByBlockNumberAndIndex` | \{ `Method`: ``"eth_getUncleByBlockNumberAndIndex"`` ; `Parameters`: [block: BlockNumber \| BlockTag, index: Quantity] ; `ReturnType`: `Uncle` \| ``null``  } | **`Description`** Returns information about an uncle specified by block number and uncle index position **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_getUncleByBlockNumberAndIndex', params: ['0x...', '0x...'] }) // => { ... } ``` |
| `eth_getUncleByBlockNumberAndIndex.Method` | ``"eth_getUncleByBlockNumberAndIndex"`` | - |
| `eth_getUncleByBlockNumberAndIndex.Parameters` | [block: BlockNumber \| BlockTag, index: Quantity] | - |
| `eth_getUncleByBlockNumberAndIndex.ReturnType` | `Uncle` \| ``null`` | - |
| `eth_getUncleCountByBlockHash` | \{ `Method`: ``"eth_getUncleCountByBlockHash"`` ; `Parameters`: [hash: Hash] ; `ReturnType`: `Quantity`  } | **`Description`** Returns the number of uncles in a block specified by block hash **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_getUncleCountByBlockHash', params: ['0x...'] }) // => '0x1' ``` |
| `eth_getUncleCountByBlockHash.Method` | ``"eth_getUncleCountByBlockHash"`` | - |
| `eth_getUncleCountByBlockHash.Parameters` | [hash: Hash] | - |
| `eth_getUncleCountByBlockHash.ReturnType` | `Quantity` | - |
| `eth_getUncleCountByBlockNumber` | \{ `Method`: ``"eth_getUncleCountByBlockNumber"`` ; `Parameters`: [block: BlockNumber \| BlockTag] ; `ReturnType`: `Quantity`  } | **`Description`** Returns the number of uncles in a block specified by block number **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_getUncleCountByBlockNumber', params: ['0x...'] }) // => '0x1' ``` |
| `eth_getUncleCountByBlockNumber.Method` | ``"eth_getUncleCountByBlockNumber"`` | - |
| `eth_getUncleCountByBlockNumber.Parameters` | [block: BlockNumber \| BlockTag] | - |
| `eth_getUncleCountByBlockNumber.ReturnType` | `Quantity` | - |
| `eth_maxPriorityFeePerGas` | \{ `Method`: ``"eth_maxPriorityFeePerGas"`` ; `Parameters?`: `undefined` ; `ReturnType`: `Quantity`  } | **`Description`** Returns the current maxPriorityFeePerGas in wei. **`Link`** https://ethereum.github.io/execution-apis/api-documentation/ **`Example`** ```ts provider.request({ method: 'eth_maxPriorityFeePerGas' }) // => '0x5f5e100' ``` |
| `eth_maxPriorityFeePerGas.Method` | ``"eth_maxPriorityFeePerGas"`` | - |
| `eth_maxPriorityFeePerGas.Parameters?` | `undefined` | - |
| `eth_maxPriorityFeePerGas.ReturnType` | `Quantity` | - |
| `eth_newBlockFilter` | \{ `Method`: ``"eth_newBlockFilter"`` ; `Parameters?`: `undefined` ; `ReturnType`: `Quantity`  } | **`Description`** Creates a filter to listen for new blocks that can be used with `eth_getFilterChanges` **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_newBlockFilter' }) // => '0x1' ``` |
| `eth_newBlockFilter.Method` | ``"eth_newBlockFilter"`` | - |
| `eth_newBlockFilter.Parameters?` | `undefined` | - |
| `eth_newBlockFilter.ReturnType` | `Quantity` | - |
| `eth_newFilter` | \{ `Method`: ``"eth_newFilter"`` ; `Parameters`: [filter: Object] ; `ReturnType`: `Quantity`  } | **`Description`** Creates a filter to listen for specific state changes that can then be used with `eth_getFilterChanges` **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_newFilter', params: [{ fromBlock: '0x...', toBlock: '0x...', address: '0x...', topics: ['0x...'] }] }) // => '0x1' ``` |
| `eth_newFilter.Method` | ``"eth_newFilter"`` | - |
| `eth_newFilter.Parameters` | [filter: Object] | - |
| `eth_newFilter.ReturnType` | `Quantity` | - |
| `eth_newPendingTransactionFilter` | \{ `Method`: ``"eth_newPendingTransactionFilter"`` ; `Parameters?`: `undefined` ; `ReturnType`: `Quantity`  } | **`Description`** Creates a filter to listen for new pending transactions that can be used with `eth_getFilterChanges` **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_newPendingTransactionFilter' }) // => '0x1' ``` |
| `eth_newPendingTransactionFilter.Method` | ``"eth_newPendingTransactionFilter"`` | - |
| `eth_newPendingTransactionFilter.Parameters?` | `undefined` | - |
| `eth_newPendingTransactionFilter.ReturnType` | `Quantity` | - |
| `eth_protocolVersion` | \{ `Method`: ``"eth_protocolVersion"`` ; `Parameters?`: `undefined` ; `ReturnType`: `string`  } | **`Description`** Returns the current Ethereum protocol version **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_protocolVersion' }) // => '54' ``` |
| `eth_protocolVersion.Method` | ``"eth_protocolVersion"`` | - |
| `eth_protocolVersion.Parameters?` | `undefined` | - |
| `eth_protocolVersion.ReturnType` | `string` | - |
| `eth_sendRawTransaction` | \{ `Method`: ``"eth_sendRawTransaction"`` ; `Parameters`: [signedTransaction: Hex] ; `ReturnType`: [`Hash`](modules.md#hash)  } | **`Description`** Sends a **signed** transaction to the network **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_sendRawTransaction', params: ['0x...'] }) // => '0x...' ``` |
| `eth_sendRawTransaction.Method` | ``"eth_sendRawTransaction"`` | - |
| `eth_sendRawTransaction.Parameters` | [signedTransaction: Hex] | - |
| `eth_sendRawTransaction.ReturnType` | [`Hash`](modules.md#hash) | - |
| `eth_uninstallFilter` | \{ `Method`: ``"eth_uninstallFilter"`` ; `Parameters`: [filterId: Quantity] ; `ReturnType`: `boolean`  } | **`Description`** Destroys a filter based on filter ID **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_uninstallFilter', params: ['0x1'] }) // => true ``` |
| `eth_uninstallFilter.Method` | ``"eth_uninstallFilter"`` | - |
| `eth_uninstallFilter.Parameters` | [filterId: Quantity] | - |
| `eth_uninstallFilter.ReturnType` | `boolean` | - |
| `net_listening` | \{ `Method`: ``"net_listening"`` ; `Parameters?`: `undefined` ; `ReturnType`: `boolean`  } | **`Description`** Determines if this client is listening for new network connections **`Example`** ```ts provider.request({ method: 'net_listening' }) // => true ``` |
| `net_listening.Method` | ``"net_listening"`` | - |
| `net_listening.Parameters?` | `undefined` | - |
| `net_listening.ReturnType` | `boolean` | - |
| `net_peerCount` | \{ `Method`: ``"net_peerCount"`` ; `Parameters?`: `undefined` ; `ReturnType`: `Quantity`  } | **`Description`** Returns the number of peers currently connected to this client **`Example`** ```ts provider.request({ method: 'net_peerCount' }) // => '0x1' ``` |
| `net_peerCount.Method` | ``"net_peerCount"`` | - |
| `net_peerCount.Parameters?` | `undefined` | - |
| `net_peerCount.ReturnType` | `Quantity` | - |
| `net_version` | \{ `Method`: ``"net_version"`` ; `Parameters?`: `undefined` ; `ReturnType`: `Quantity`  } | **`Description`** Returns the chain ID associated with the current network **`Example`** ```ts provider.request({ method: 'net_version' }) // => '1' ``` |
| `net_version.Method` | ``"net_version"`` | - |
| `net_version.Parameters?` | `undefined` | - |
| `net_version.ReturnType` | `Quantity` | - |
| `web3_clientVersion` | \{ `Method`: ``"web3_clientVersion"`` ; `Parameters?`: `undefined` ; `ReturnType`: `string`  } | **`Description`** Returns the version of the current client **`Example`** ```ts provider.request({ method: 'web3_clientVersion' }) // => 'MetaMask/v1.0.0' ``` |
| `web3_clientVersion.Method` | ``"web3_clientVersion"`` | - |
| `web3_clientVersion.Parameters?` | `undefined` | - |
| `web3_clientVersion.ReturnType` | `string` | - |
| `web3_sha3` | \{ `Method`: ``"web3_sha3"`` ; `Parameters`: [data: Hash] ; `ReturnType`: `string`  } | **`Description`** Hashes data using the Keccak-256 algorithm **`Example`** ```ts provider.request({ method: 'web3_sha3', params: ['0x68656c6c6f20776f726c64'] }) // => '0xc94770007dda54cF92009BFF0dE90c06F603a09f' ``` |
| `web3_sha3.Method` | ``"web3_sha3"`` | - |
| `web3_sha3.Parameters` | [data: Hash] | - |
| `web3_sha3.ReturnType` | `string` | - |

#### Defined in

[evmts-monorepo/packages/decorators/src/eip1193/JsonRpcSchemaPublic.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaPublic.ts#L24)

___

### JsonRpcSchemaTevm

Ƭ **JsonRpcSchemaTevm**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `tevm_call` | \{ `Method`: ``"tevm_call"`` ; `Parameters`: `CallJsonRpcRequest`[``"params"``] ; `ReturnType`: `SerializeToJson`\<`CallResult`\<`never`\>\>  } | **`Description`** A versatile way of executing an EVM call with many options and detailed return data **`Link`** https://tevm.sh/learn/json-rpc/#tevm-methods **`Example`** ```ts provider.request({ method: 'tevm_call', params: [{ from: '0x...', to: '0x...', data: '0x...' }] })}) // => { data: '0x...', events: [{...}], ... } ``` |
| `tevm_call.Method` | ``"tevm_call"`` | - |
| `tevm_call.Parameters` | `CallJsonRpcRequest`[``"params"``] | - |
| `tevm_call.ReturnType` | `SerializeToJson`\<`CallResult`\<`never`\>\> | - |
| `tevm_dumpState` | \{ `Method`: ``"tevm_dumpState"`` ; `Parameters?`: `DumpStateJsonRpcRequest`[``"params"``] ; `ReturnType`: `SerializeToJson`\<`DumpStateResult`\<`never`\>\>  } | **`Description`** Dumps the current cached state of the EVM. **`Link`** https://tevm.sh/learn/json-rpc/#tevm-methods **`Example`** ```ts provider.request({ method: 'tevm_dumpState' })}) ``` |
| `tevm_dumpState.Method` | ``"tevm_dumpState"`` | - |
| `tevm_dumpState.Parameters?` | `DumpStateJsonRpcRequest`[``"params"``] | - |
| `tevm_dumpState.ReturnType` | `SerializeToJson`\<`DumpStateResult`\<`never`\>\> | - |
| `tevm_getAccount` | \{ `Method`: ``"tevm_getAccount"`` ; `Parameters`: `GetAccountJsonRpcRequest`[``"params"``] ; `ReturnType`: `SerializeToJson`\<`GetAccountResult`\<`never`\>\>  } | **`Description`** Returns the account state of the given address **`Link`** https://tevm.sh/learn/json-rpc/#tevm-methods **`Example`** ```ts provider.request({ method: 'tevm_getAccount', params: [{address: '0x...' }])}) ``` |
| `tevm_getAccount.Method` | ``"tevm_getAccount"`` | - |
| `tevm_getAccount.Parameters` | `GetAccountJsonRpcRequest`[``"params"``] | - |
| `tevm_getAccount.ReturnType` | `SerializeToJson`\<`GetAccountResult`\<`never`\>\> | - |
| `tevm_loadState` | \{ `Method`: ``"tevm_loadState"`` ; `Parameters`: `LoadStateJsonRpcRequest`[``"params"``] ; `ReturnType`: `SerializeToJson`\<`LoadStateResult`\<`never`\>\>  } | **`Description`** Loads the provided state into the EVM **`Link`** https://tevm.sh/learn/json-rpc/#tevm-methods **`Example`** ```ts provider.request({ method: 'tevm_loadState', params: [{ state: {...} }] }])}) // => { success: true } ``` |
| `tevm_loadState.Method` | ``"tevm_loadState"`` | - |
| `tevm_loadState.Parameters` | `LoadStateJsonRpcRequest`[``"params"``] | - |
| `tevm_loadState.ReturnType` | `SerializeToJson`\<`LoadStateResult`\<`never`\>\> | - |
| `tevm_script` | \{ `Method`: ``"tevm_script"`` ; `Parameters`: `ScriptJsonRpcRequest`[``"params"``] ; `ReturnType`: `SerializeToJson`\<`CallResult`\<`never`\>\>  } | **`Description`** Execute supplied contract bytecode on the EVM **`Link`** https://tevm.sh/learn/json-rpc/#tevm-methods **`Example`** ```ts provider.request({ method: 'tevm_script', params: [{ deployedBytecode: '0x...', args: [...] }] })}) // => { address: '0x...', events: [{...}], ... } ``` |
| `tevm_script.Method` | ``"tevm_script"`` | - |
| `tevm_script.Parameters` | `ScriptJsonRpcRequest`[``"params"``] | - |
| `tevm_script.ReturnType` | `SerializeToJson`\<`CallResult`\<`never`\>\> | - |
| `tevm_setAccount` | \{ `Method`: ``"tevm_setAccount"`` ; `Parameters`: `SetAccountJsonRpcRequest`[``"params"``] ; `ReturnType`: `SerializeToJson`\<`SetAccountResult`\<`never`\>\>  } | **`Description`** Sets the account state of the given address **`Link`** https://tevm.sh/learn/json-rpc/#tevm-methods **`Example`** ```ts provider.request({ method: 'tevm_setAccount', params: [{address: '0x...', value: '0x42' }])}) r ``` |
| `tevm_setAccount.Method` | ``"tevm_setAccount"`` | - |
| `tevm_setAccount.Parameters` | `SetAccountJsonRpcRequest`[``"params"``] | - |
| `tevm_setAccount.ReturnType` | `SerializeToJson`\<`SetAccountResult`\<`never`\>\> | - |

#### Defined in

[evmts-monorepo/packages/decorators/src/eip1193/JsonRpcSchemaTevm.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaTevm.ts#L20)

___

### JsonRpcSchemaWallet

Ƭ **JsonRpcSchemaWallet**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `eth_accounts` | \{ `Method`: ``"eth_accounts"`` ; `Parameters?`: `undefined` ; `ReturnType`: `Address`[]  } | **`Description`** Returns a list of addresses owned by this client **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_accounts' }) // => ['0x0fB69...'] ``` |
| `eth_accounts.Method` | ``"eth_accounts"`` | - |
| `eth_accounts.Parameters?` | `undefined` | - |
| `eth_accounts.ReturnType` | `Address`[] | - |
| `eth_chainId` | \{ `Method`: ``"eth_chainId"`` ; `Parameters?`: `undefined` ; `ReturnType`: `Quantity`  } | **`Description`** Returns the current chain ID associated with the wallet. **`Example`** ```ts provider.request({ method: 'eth_chainId' }) // => '1' ``` |
| `eth_chainId.Method` | ``"eth_chainId"`` | - |
| `eth_chainId.Parameters?` | `undefined` | - |
| `eth_chainId.ReturnType` | `Quantity` | - |
| `eth_estimateGas` | \{ `Method`: ``"eth_estimateGas"`` ; `Parameters`: [transaction: TransactionRequest] \| [transaction: TransactionRequest, block: BlockNumber \| BlockTag] ; `ReturnType`: `Quantity`  } | **`Description`** Estimates the gas necessary to complete a transaction without submitting it to the network **`Example`** ```ts provider.request({ method: 'eth_estimateGas', params: [{ from: '0x...', to: '0x...', value: '0x...' }] }) // => '0x5208' ``` |
| `eth_estimateGas.Method` | ``"eth_estimateGas"`` | - |
| `eth_estimateGas.Parameters` | [transaction: TransactionRequest] \| [transaction: TransactionRequest, block: BlockNumber \| BlockTag] | - |
| `eth_estimateGas.ReturnType` | `Quantity` | - |
| `eth_requestAccounts` | \{ `Method`: ``"eth_requestAccounts"`` ; `Parameters?`: `undefined` ; `ReturnType`: `Address`[]  } | **`Description`** Requests that the user provides an Ethereum address to be identified by. Typically causes a browser extension popup to appear. **`Link`** https://eips.ethereum.org/EIPS/eip-1102 **`Example`** ```ts provider.request({ method: 'eth_requestAccounts' }] }) // => ['0x...', '0x...'] ``` |
| `eth_requestAccounts.Method` | ``"eth_requestAccounts"`` | - |
| `eth_requestAccounts.Parameters?` | `undefined` | - |
| `eth_requestAccounts.ReturnType` | `Address`[] | - |
| `eth_sendRawTransaction` | \{ `Method`: ``"eth_sendRawTransaction"`` ; `Parameters`: [signedTransaction: Hex] ; `ReturnType`: [`Hash`](modules.md#hash)  } | **`Description`** Sends and already-signed transaction to the network **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_sendRawTransaction', params: ['0x...'] }) // => '0x...' ``` |
| `eth_sendRawTransaction.Method` | ``"eth_sendRawTransaction"`` | - |
| `eth_sendRawTransaction.Parameters` | [signedTransaction: Hex] | - |
| `eth_sendRawTransaction.ReturnType` | [`Hash`](modules.md#hash) | - |
| `eth_sendTransaction` | \{ `Method`: ``"eth_sendTransaction"`` ; `Parameters`: [transaction: TransactionRequest] ; `ReturnType`: [`Hash`](modules.md#hash)  } | **`Description`** Creates, signs, and sends a new transaction to the network **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_sendTransaction', params: [{ from: '0x...', to: '0x...', value: '0x...' }] }) // => '0x...' ``` |
| `eth_sendTransaction.Method` | ``"eth_sendTransaction"`` | - |
| `eth_sendTransaction.Parameters` | [transaction: TransactionRequest] | - |
| `eth_sendTransaction.ReturnType` | [`Hash`](modules.md#hash) | - |
| `eth_sign` | \{ `Method`: ``"eth_sign"`` ; `Parameters`: [address: Address, data: Hex] ; `ReturnType`: `Hex`  } | **`Description`** Calculates an Ethereum-specific signature in the form of `keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))` **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_sign', params: ['0x...', '0x...'] }) // => '0x...' ``` |
| `eth_sign.Method` | ``"eth_sign"`` | - |
| `eth_sign.Parameters` | [address: Address, data: Hex] | - |
| `eth_sign.ReturnType` | `Hex` | - |
| `eth_signTransaction` | \{ `Method`: ``"eth_signTransaction"`` ; `Parameters`: [request: TransactionRequest] ; `ReturnType`: `Hex`  } | **`Description`** Signs a transaction that can be submitted to the network at a later time using with `eth_sendRawTransaction` **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_signTransaction', params: [{ from: '0x...', to: '0x...', value: '0x...' }] }) // => '0x...' ``` |
| `eth_signTransaction.Method` | ``"eth_signTransaction"`` | - |
| `eth_signTransaction.Parameters` | [request: TransactionRequest] | - |
| `eth_signTransaction.ReturnType` | `Hex` | - |
| `eth_signTypedData_v4` | \{ `Method`: ``"eth_signTypedData_v4"`` ; `Parameters`: [address: Address, message: string] ; `ReturnType`: `Hex`  } | **`Description`** Calculates an Ethereum-specific signature in the form of `keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))` **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_signTypedData_v4', params: [{ from: '0x...', data: [{ type: 'string', name: 'message', value: 'hello world' }] }] }) // => '0x...' ``` |
| `eth_signTypedData_v4.Method` | ``"eth_signTypedData_v4"`` | - |
| `eth_signTypedData_v4.Parameters` | [address: Address, message: string] | - |
| `eth_signTypedData_v4.ReturnType` | `Hex` | - |
| `eth_syncing` | \{ `Method`: ``"eth_syncing"`` ; `Parameters?`: `undefined` ; `ReturnType`: [`NetworkSync`](modules.md#networksync) \| ``false``  } | **`Description`** Returns information about the status of this client’s network synchronization **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'eth_syncing' }) // => { startingBlock: '0x...', currentBlock: '0x...', highestBlock: '0x...' } ``` |
| `eth_syncing.Method` | ``"eth_syncing"`` | - |
| `eth_syncing.Parameters?` | `undefined` | - |
| `eth_syncing.ReturnType` | [`NetworkSync`](modules.md#networksync) \| ``false`` | - |
| `personal_sign` | \{ `Method`: ``"personal_sign"`` ; `Parameters`: [data: Hex, address: Address] ; `ReturnType`: `Hex`  } | **`Description`** Calculates an Ethereum-specific signature in the form of `keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))` **`Link`** https://eips.ethereum.org/EIPS/eip-1474 **`Example`** ```ts provider.request({ method: 'personal_sign', params: ['0x...', '0x...'] }) // => '0x...' ``` |
| `personal_sign.Method` | ``"personal_sign"`` | - |
| `personal_sign.Parameters` | [data: Hex, address: Address] | - |
| `personal_sign.ReturnType` | `Hex` | - |
| `wallet_addEthereumChain` | \{ `Method`: ``"wallet_addEthereumChain"`` ; `Parameters`: [chain: AddEthereumChainParameter] ; `ReturnType`: ``null``  } | **`Description`** Add an Ethereum chain to the wallet. **`Link`** https://eips.ethereum.org/EIPS/eip-3085 **`Example`** ```ts provider.request({ method: 'wallet_addEthereumChain', params: [{ chainId: 1, rpcUrl: 'https://mainnet.infura.io/v3/...' }] }) // => { ... } ``` |
| `wallet_addEthereumChain.Method` | ``"wallet_addEthereumChain"`` | - |
| `wallet_addEthereumChain.Parameters` | [chain: AddEthereumChainParameter] | - |
| `wallet_addEthereumChain.ReturnType` | ``null`` | - |
| `wallet_getPermissions` | \{ `Method`: ``"wallet_getPermissions"`` ; `Parameters?`: `undefined` ; `ReturnType`: [`WalletPermission`](modules.md#walletpermission)[]  } | **`Description`** Gets the wallets current permissions. **`Link`** https://eips.ethereum.org/EIPS/eip-2255 **`Example`** ```ts provider.request({ method: 'wallet_getPermissions' }) // => { ... } ``` |
| `wallet_getPermissions.Method` | ``"wallet_getPermissions"`` | - |
| `wallet_getPermissions.Parameters?` | `undefined` | - |
| `wallet_getPermissions.ReturnType` | [`WalletPermission`](modules.md#walletpermission)[] | - |
| `wallet_requestPermissions` | \{ `Method`: ``"wallet_requestPermissions"`` ; `Parameters`: [permissions: Object] ; `ReturnType`: [`WalletPermission`](modules.md#walletpermission)[]  } | **`Description`** Requests the given permissions from the user. **`Link`** https://eips.ethereum.org/EIPS/eip-2255 **`Example`** ```ts provider.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] }) // => { ... } ``` |
| `wallet_requestPermissions.Method` | ``"wallet_requestPermissions"`` | - |
| `wallet_requestPermissions.Parameters` | [permissions: Object] | - |
| `wallet_requestPermissions.ReturnType` | [`WalletPermission`](modules.md#walletpermission)[] | - |
| `wallet_switchEthereumChain` | \{ `Method`: ``"wallet_switchEthereumChain"`` ; `Parameters`: [chain: Object] ; `ReturnType`: ``null``  } | **`Description`** Switch the wallet to the given Ethereum chain. **`Link`** https://eips.ethereum.org/EIPS/eip-3326 **`Example`** ```ts provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0xf00' }] }) // => { ... } ``` |
| `wallet_switchEthereumChain.Method` | ``"wallet_switchEthereumChain"`` | - |
| `wallet_switchEthereumChain.Parameters` | [chain: Object] | - |
| `wallet_switchEthereumChain.ReturnType` | ``null`` | - |
| `wallet_watchAsset` | \{ `Method`: ``"wallet_watchAsset"`` ; `Parameters`: [`WatchAssetParams`](modules.md#watchassetparams) ; `ReturnType`: `boolean`  } | **`Description`** Requests that the user tracks the token in their wallet. Returns a boolean indicating if the token was successfully added. **`Link`** https://eips.ethereum.org/EIPS/eip-747 **`Example`** ```ts provider.request({ method: 'wallet_watchAsset' }] }) // => true ``` |
| `wallet_watchAsset.Method` | ``"wallet_watchAsset"`` | - |
| `wallet_watchAsset.Parameters` | [`WatchAssetParams`](modules.md#watchassetparams) | - |
| `wallet_watchAsset.ReturnType` | `boolean` | - |

#### Defined in

[evmts-monorepo/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaWallet.ts#L18)

___

### LogTopic

Ƭ **LogTopic**: `Hex` \| `Hex`[] \| ``null``

#### Defined in

[evmts-monorepo/packages/decorators/src/eip1193/misc.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/misc.ts#L10)

___

### NetworkSync

Ƭ **NetworkSync**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `currentBlock` | [`Quantity`](modules.md#quantity) | The current block number |
| `highestBlock` | [`Quantity`](modules.md#quantity) | Number of latest block on the network |
| `startingBlock` | [`Quantity`](modules.md#quantity) | Block number at which syncing started |

#### Defined in

[evmts-monorepo/packages/decorators/src/eip1193/NetworkSync.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/NetworkSync.ts#L11)

___

### ProviderConnectInfo

Ƭ **ProviderConnectInfo**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chainId` | `string` |

#### Defined in

[evmts-monorepo/packages/decorators/src/eip1193/EIP1193Events.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/EIP1193Events.ts#L8)

___

### ProviderMessage

Ƭ **ProviderMessage**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `data` | `unknown` |
| `type` | `string` |

#### Defined in

[evmts-monorepo/packages/decorators/src/eip1193/EIP1193Events.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/EIP1193Events.ts#L12)

___

### Quantity

Ƭ **Quantity**: `Hex`

#### Defined in

[evmts-monorepo/packages/decorators/src/eip1193/NetworkSync.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/NetworkSync.ts#L9)

___

### RpcSchema

Ƭ **RpcSchema**: readonly \{ `Method`: `string` ; `Parameters?`: `unknown` ; `ReturnType`: `unknown`  }[]

Most general RPC schema type.

#### Defined in

[evmts-monorepo/packages/decorators/src/eip1193/RpcSchema.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/RpcSchema.ts#L12)

___

### RpcSchemaOverride

Ƭ **RpcSchemaOverride**: `Omit`\<[`RpcSchema`](modules.md#rpcschema)[`number`], ``"Method"``\>

#### Defined in

[evmts-monorepo/packages/decorators/src/eip1193/RpcSchemaOverride.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/RpcSchemaOverride.ts#L9)

___

### TestRpcSchema

Ƭ **TestRpcSchema**\<`TMode`\>: [addCompilationResult: Object, dropTransaction: Object, dumpState: Object, enableTraces: Object, impersonateAccount: Object, getAutomine: Object, loadState: Object, mine: Object, reset: Object, setBalance: Object, setCode: Object, setCoinbase: Object, setLoggingEnabled: Object, setMinGasPrice: Object, setNextBlockBaseFeePerGas: Object, setNonce: Object, setRpcUrl: Object, setStorageAt: Object, stopImpersonatingAccount: Object, increaseTime: Object, setAccountBalance: Object, evm\_setAutomine: Object, evm\_setBlockGasLimit: Object, evm\_increaseTime: Object, setBlockTimestampInterval: Object, removeBlockTimestampInterval: Object, evm\_setIntervalMining: Object, evm\_setNextBlockTimestamp: Object, evm\_snapshot: Object, evm\_revert: Object, miner\_start: Object, miner\_stop: Object, txpool\_content: Object, txpool\_inspect: Object, txpool\_status: Object, eth\_mining: Object, evm\_mine: Object, eth\_sendUnsignedTransaction: Object]

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TMode` | extends `string` |

#### Defined in

[evmts-monorepo/packages/decorators/src/eip1193/JsonRpcSchemaTest.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/JsonRpcSchemaTest.ts#L14)

___

### TevmActionsApi

Ƭ **TevmActionsApi**: `Object`

The actions api is the high level API for interacting with a Tevm client similar to [viem actions](https://viem.sh/learn/actions/)

**`See`**

[https://tevm.sh/learn/actions/](https://tevm.sh/learn/actions/)

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `call` | `CallHandler` | Executes a call against the VM. It is similar to `eth_call` but has more options for controlling the execution environment By default it does not modify the state after the call is complete but this can be configured. **`Example`** ```ts const res = tevm.call({ to: '0x123...', data: '0x123...', from: '0x123...', gas: 1000000, gasPrice: 1n, skipBalance: true, } ``` |
| `contract` | `ContractHandler` | Executes a contract call against the VM. It is similar to `eth_call` but has more options for controlling the execution environment along with a typesafe API for creating the call via the contract abi. The contract must already be deployed. Otherwise see `script` which executes calls against undeployed contracts **`Example`** ```ts const res = await tevm.contract({ to: '0x123...', abi: [...], function: 'run', args: ['world'] from: '0x123...', gas: 1000000, gasPrice: 1n, skipBalance: true, } console.log(res.data) // "hello" ``` |
| `dumpState` | `DumpStateHandler` | Dumps the current state of the VM into a JSON-seralizable object State can be dumped as follows **`Example`** ```typescript const {state} = await tevm.dumpState() fs.writeFileSync('state.json', JSON.stringify(state)) ``` And then loaded as follows **`Example`** ```typescript const state = JSON.parse(fs.readFileSync('state.json')) await tevm.loadState({state}) ``` |
| `getAccount` | `GetAccountHandler` | Gets the state of a specific ethereum address **`Example`** ```ts const res = tevm.getAccount({address: '0x123...'}) console.log(res.deployedBytecode) console.log(res.nonce) console.log(res.balance) ``` |
| `loadState` | `LoadStateHandler` | Loads a previously dumped state into the VM State can be dumped as follows **`Example`** ```typescript const {state} = await tevm.dumpState() fs.writeFileSync('state.json', JSON.stringify(state)) ``` And then loaded as follows **`Example`** ```typescript const state = JSON.parse(fs.readFileSync('state.json')) await tevm.loadState({state}) ``` |
| `script` | `ScriptHandler` | Executes scripts against the Tevm EVM. By default the script is sandboxed and the state is reset after each execution unless the `persist` option is set to true. **`Example`** ```typescript const res = tevm.script({ deployedBytecode: '0x6080604...', abi: [...], function: 'run', args: ['hello world'] }) ``` Contract handlers provide a more ergonomic way to execute scripts **`Example`** ```typescript ipmort {MyScript} from './MyScript.s.sol' const res = tevm.script( MyScript.read.run('hello world') ) ``` |
| `setAccount` | `SetAccountHandler` | Sets the state of a specific ethereum address **`Example`** ```ts import {parseEther} from 'tevm' await tevm.setAccount({ address: '0x123...', deployedBytecode: '0x6080604...', balance: parseEther('1.0') }) ``` |

#### Defined in

[evmts-monorepo/packages/decorators/src/actions/TevmActionsApi.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/actions/TevmActionsApi.ts#L15)

___

### WalletPermission

Ƭ **WalletPermission**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `caveats` | [`WalletPermissionCaveat`](modules.md#walletpermissioncaveat)[] |
| `date` | `number` |
| `id` | `string` |
| `invoker` | \`http://$\{string}\` \| \`https://$\{string}\` |
| `parentCapability` | ``"eth_accounts"`` \| `string` |

#### Defined in

[evmts-monorepo/packages/decorators/src/eip1193/WalletPermission.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/WalletPermission.ts#L8)

___

### WalletPermissionCaveat

Ƭ **WalletPermissionCaveat**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `type` | `string` |
| `value` | `any` |

#### Defined in

[evmts-monorepo/packages/decorators/src/eip1193/WalletPermissionCaveat.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/WalletPermissionCaveat.ts#L7)

___

### WatchAssetParams

Ƭ **WatchAssetParams**: `Object`

Parameters for the `watchAsset` method.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | \{ `address`: `string` ; `decimals`: `number` ; `image?`: `string` ; `symbol`: `string`  } | - |
| `options.address` | `string` | The address of the token contract |
| `options.decimals` | `number` | The number of token decimals |
| `options.image?` | `string` | A string url of the token logo |
| `options.symbol` | `string` | A ticker symbol or shorthand, up to 11 characters |
| `type` | ``"ERC20"`` | Token type. |

#### Defined in

[evmts-monorepo/packages/decorators/src/eip1193/WatchAssetParams.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/WatchAssetParams.ts#L11)

## Functions

### createEventEmitter

▸ **createEventEmitter**(): `Extension`\<[`EIP1193EventEmitter`](modules.md#eip1193eventemitter)\>

Factory function to create an event emitter.

#### Returns

`Extension`\<[`EIP1193EventEmitter`](modules.md#eip1193eventemitter)\>

#### Defined in

[evmts-monorepo/packages/decorators/src/events/createEventEmitter.js:5](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/events/createEventEmitter.js#L5)

___

### ethActions

▸ **ethActions**(): `Extension`\<[`EthActionsApi`](modules.md#ethactionsapi)\>

#### Returns

`Extension`\<[`EthActionsApi`](modules.md#ethactionsapi)\>

#### Defined in

[evmts-monorepo/packages/decorators/src/actions/ethActions.js:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/actions/ethActions.js#L14)

___

### requestEip1193

▸ **requestEip1193**(): `Extension`\<[`Eip1193RequestProvider`](modules.md#eip1193requestprovider)\>

A decorator that adds the EIP-1193 request method to the client

#### Returns

`Extension`\<[`Eip1193RequestProvider`](modules.md#eip1193requestprovider)\>

#### Defined in

[evmts-monorepo/packages/decorators/src/request/requestEip1193.js:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/request/requestEip1193.js#L18)

___

### tevmActions

▸ **tevmActions**(): `Extension`\<[`TevmActionsApi`](modules.md#tevmactionsapi)\>

#### Returns

`Extension`\<[`TevmActionsApi`](modules.md#tevmactionsapi)\>

#### Defined in

[evmts-monorepo/packages/decorators/src/actions/tevmActions.js:78](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/actions/tevmActions.js#L78)

___

### tevmSend

▸ **tevmSend**(): `Extension`\<\{ `send`: `TevmJsonRpcRequestHandler` ; `sendBulk`: `TevmJsonRpcBulkRequestHandler`  }\>

The low level method for sending and recieving a JSON-RPC request.
Strictly adheres to the JSON-RPC 2.0 spec.
See `requestEip1193` for a more user friendly method.

#### Returns

`Extension`\<\{ `send`: `TevmJsonRpcRequestHandler` ; `sendBulk`: `TevmJsonRpcBulkRequestHandler`  }\>

#### Defined in

[evmts-monorepo/packages/decorators/src/request/tevmSend.js:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/request/tevmSend.js#L8)
