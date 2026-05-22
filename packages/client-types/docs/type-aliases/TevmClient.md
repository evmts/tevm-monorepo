[**@tevm/client-types**](../README.md)

***

[@tevm/client-types](../globals.md) / TevmClient

# ~~Type Alias: TevmClient~~

> **TevmClient** = `object`

Defined in: [TevmClient.ts:131](https://github.com/evmts/tevm-monorepo/blob/main/packages/client-types/src/TevmClient.ts#L131)

## Deprecated

This type has been superseded by Provider types from `@tevm/decorators` package
The docs have not been updated to reflect this change if you are looking at this

A local EVM instance running in the browser, Bun, or Node.js. Akin to anvil or ganache. The TevmClient interface
is a unified interface that all Clients implement. This provides a consistent developer experience no matter how you are
using Tevm.

## See

[TevmClient guide](https://tevm.sh/learn/clients/) for more documentation on clients

#### JSON-RPC

Tevm exposes a JSON-RPC interface for interacting with the EVM via the [TevmClient.request](#request)

## Examples

```typescript
import {createMemoryClient, type Tevm} from 'tevm'

const tevm: Tevm = createMemoryClient()

await tevm.request({
  method: 'eth_blockNumber',
  params: [],
  id: 1,
  jsonrpc: '2.0',
}) // 0n
```

#### Actions

TevmClient exposes a higher level `actions` based api similar to [viem](https://viem.sh) for interacting with TevmClient in a typesasafe
ergonomic way.

```typescript
// same as eth_blockNumber example
const account = await tevm.account({address: `0x${'0'.repeat(40)}`})
console.log(account.balance) // 0n
```

#### Ethereum actions

Ethereum actions are namespaced under [TevmClient.eth](#eth)

```typescript
const blockNumber = await tevm.eth.blockNumber()
console.log(blockNumber) // 0n
```

#### Anvil hardhat and ganache compatibility

Will have anvil_* ganache_* and hardhat_* JSON-RPC compatibility in future versions

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="call"></a> ~~`call`~~ | `CallHandler` | Executes a call against the VM. It is similar to `eth_call` but has more options for controlling the execution environment By default it does not modify the state after the call is complete but this can be configured. **Example** `const res = tevm.call({ to: '0x123...', data: '0x123...', from: '0x123...', gas: 1000000, gasPrice: 1n, skipBalance: true, }` | [TevmClient.ts:275](https://github.com/evmts/tevm-monorepo/blob/main/packages/client-types/src/TevmClient.ts#L275) |
| <a id="contract"></a> ~~`contract`~~ | `ContractHandler` | Executes a contract call against the VM. It is similar to `eth_call` but has more options for controlling the execution environment along with a typesafe API for creating the call via the contract abi. The contract must already be deployed. Otherwise see `script` which executes calls against undeployed contracts **Example** `const res = await tevm.contract({ to: '0x123...', abi: [...], function: 'run', args: ['world'] from: '0x123...', gas: 1000000, gasPrice: 1n, skipBalance: true, } console.log(res.data) // "hello"` | [TevmClient.ts:297](https://github.com/evmts/tevm-monorepo/blob/main/packages/client-types/src/TevmClient.ts#L297) |
| <a id="dumpstate"></a> ~~`dumpState`~~ | `DumpStateHandler` | Dumps the current state of the VM into a JSON-seralizable object State can be dumped as follows **Examples** `const {state} = await tevm.dumpState() fs.writeFileSync('state.json', JSON.stringify(state))` And then loaded as follows `const state = JSON.parse(fs.readFileSync('state.json')) await tevm.loadState({state})` | [TevmClient.ts:315](https://github.com/evmts/tevm-monorepo/blob/main/packages/client-types/src/TevmClient.ts#L315) |
| <a id="eth"></a> ~~`eth`~~ | `object` | Standard JSON-RPC methods for interacting with the VM **See** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) | [TevmClient.ts:357](https://github.com/evmts/tevm-monorepo/blob/main/packages/client-types/src/TevmClient.ts#L357) |
| `eth.blockNumber` | `EthBlockNumberHandler` | Returns the current block number Set the `tag` to a block number or block hash to get the balance at that block Block tag defaults to 'pending' tag which is the optimistic state of the VM **See** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) **Example** `const blockNumber = await tevm.eth.blockNumber() console.log(blockNumber) // 0n` | [TevmClient.ts:367](https://github.com/evmts/tevm-monorepo/blob/main/packages/client-types/src/TevmClient.ts#L367) |
| `eth.call` | `EthCallHandler` | Executes a call without modifying the state Set the `tag` to a block number or block hash to get the balance at that block Block tag defaults to 'pending' tag which is the optimistic state of the VM **See** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) **Example** `const res = await tevm.eth.call({to: '0x123...', data: '0x123...'}) console.log(res) // "0x..."` | [TevmClient.ts:377](https://github.com/evmts/tevm-monorepo/blob/main/packages/client-types/src/TevmClient.ts#L377) |
| `eth.chainId` | `EthChainIdHandler` | Returns the current chain id Set the `tag` to a block number or block hash to get the balance at that block Block tag defaults to 'pending' tag which is the optimistic state of the VM **See** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) **Example** `const chainId = await tevm.eth.chainId() console.log(chainId) // 10n` | [TevmClient.ts:387](https://github.com/evmts/tevm-monorepo/blob/main/packages/client-types/src/TevmClient.ts#L387) |
| `eth.gasPrice` | `EthGasPriceHandler` | Returns the current gas price Set the `tag` to a block number or block hash to get the balance at that block Block tag defaults to 'pending' tag which is the optimistic state of the VM **See** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) **Example** `const gasPrice = await tevm.eth.gasPrice() console.log(gasPrice) // 0n` | [TevmClient.ts:415](https://github.com/evmts/tevm-monorepo/blob/main/packages/client-types/src/TevmClient.ts#L415) |
| `eth.getBalance` | `EthGetBalanceHandler` | Returns the balance of a given address Set the `tag` to a block number or block hash to get the balance at that block Block tag defaults to 'pending' tag which is the optimistic state of the VM **See** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) **Example** `const balance = await tevm.eth.getBalance({address: '0x123...', tag: 'pending'}) console.log(gasPrice) // 0n` | [TevmClient.ts:425](https://github.com/evmts/tevm-monorepo/blob/main/packages/client-types/src/TevmClient.ts#L425) |
| `eth.getCode` | `EthGetCodeHandler` | Returns code at a given address Set the `tag` to a block number or block hash to get the balance at that block Block tag defaults to 'pending' tag which is the optimistic state of the VM **See** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) **Example** `const code = await tevm.eth.getCode({address: '0x123...'})` | [TevmClient.ts:396](https://github.com/evmts/tevm-monorepo/blob/main/packages/client-types/src/TevmClient.ts#L396) |
| `eth.getStorageAt` | `EthGetStorageAtHandler` | Returns storage at a given address and slot Set the `tag` to a block number or block hash to get the balance at that block Block tag defaults to 'pending' tag which is the optimistic state of the VM **See** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) **Example** `const storageValue = await tevm.eth.getStorageAt({address: '0x123...', position: 0})` | [TevmClient.ts:405](https://github.com/evmts/tevm-monorepo/blob/main/packages/client-types/src/TevmClient.ts#L405) |
| <a id="getaccount"></a> ~~`getAccount`~~ | `GetAccountHandler` | Gets the state of a specific ethereum address **Example** `const res = tevm.getAccount({address: '0x123...'}) console.log(res.deployedBytecode) console.log(res.nonce) console.log(res.balance)` | [TevmClient.ts:258](https://github.com/evmts/tevm-monorepo/blob/main/packages/client-types/src/TevmClient.ts#L258) |
| <a id="loadstate"></a> ~~`loadState`~~ | `LoadStateHandler` | Loads a previously dumped state into the VM State can be dumped as follows **Examples** `const {state} = await tevm.dumpState() fs.writeFileSync('state.json', JSON.stringify(state))` And then loaded as follows `const state = JSON.parse(fs.readFileSync('state.json')) await tevm.loadState({state})` | [TevmClient.ts:333](https://github.com/evmts/tevm-monorepo/blob/main/packages/client-types/src/TevmClient.ts#L333) |
| <a id="request"></a> ~~`request`~~ | `TevmJsonRpcRequestHandler` | Request handler for JSON-RPC requests. Most users will want to use the [`actions` api](https://tevm.sh/learn/actions/) instead of this method directly **Example** `const blockNumberResponse = await tevm.request({ method: 'eth_blockNumber', params: [] id: 1 jsonrpc: '2.0' }) const accountResponse = await tevm.request({ method: 'tevm_getAccount', params: [{address: '0x123...'}], id: 1, jsonrpc: '2.0', })` | [TevmClient.ts:236](https://github.com/evmts/tevm-monorepo/blob/main/packages/client-types/src/TevmClient.ts#L236) |
| <a id="requestbulk"></a> ~~`requestBulk`~~ | `TevmJsonRpcBulkRequestHandler` | **`Experimental`** Bulk request handler for JSON-RPC requests. Takes an array of requests and returns an array of results. Bulk requests are currently handled in parallel which can cause issues if the requests are expected to run sequentially or interphere with each other. An option for configuring requests sequentially or in parallel will be added in the future. Currently is not very generic with regard to input and output types. **Example** `const [blockNumberResponse, gasPriceResponse] = await tevm.requestBulk([{ method: 'eth_blockNumber', params: [] id: 1 jsonrpc: '2.0' }, { method: 'eth_gasPrice', params: [] id: 1 jsonrpc: '2.0' }])` ### tevm_* methods #### tevm_call request - CallJsonRpcRequest response - CallJsonRpcResponse #### tevm_getAccount request - GetAccountJsonRpcRequest response - GetAccountJsonRpcResponse #### tevm_setAccount request - SetAccountJsonRpcRequest response - SetAccountJsonRpcResponse #### tevm_fork request - ForkJsonRpcRequest response - ForkJsonRpcResponse ### debug_* methods #### debug_traceCall request - DebugTraceCallJsonRpcRequest response - DebugTraceCallJsonRpcResponse ### eth_* methods #### eth_blockNumber request - EthBlockNumberJsonRpcRequest response - EthBlockNumberJsonRpcResponse #### eth_chainId request - EthChainIdJsonRpcRequest response - EthChainIdJsonRpcResponse #### eth_getCode request - EthGetCodeJsonRpcRequest response - EthGetCodeJsonRpcResponse #### eth_getStorageAt request - EthGetStorageAtJsonRpcRequest response - EthGetStorageAtJsonRpcResponse #### eth_gasPrice request - EthGasPriceJsonRpcRequest response - EthGasPriceJsonRpcResponse #### eth_getBalance request - EthGetBalanceJsonRpcRequest response - EthGetBalanceJsonRpcResponse | [TevmClient.ts:216](https://github.com/evmts/tevm-monorepo/blob/main/packages/client-types/src/TevmClient.ts#L216) |
| <a id="setaccount"></a> ~~`setAccount`~~ | `SetAccountHandler` | Sets the state of a specific ethereum address **Example** `import {parseEther} from 'tevm' await tevm.setAccount({ address: '0x123...', deployedBytecode: '0x6080604...', balance: parseEther('1.0') })` | [TevmClient.ts:249](https://github.com/evmts/tevm-monorepo/blob/main/packages/client-types/src/TevmClient.ts#L249) |
