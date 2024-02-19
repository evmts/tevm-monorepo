[@tevm/client-types](README.md) / Exports

# @tevm/client-types

## Table of contents

### Type Aliases

- [TevmClient](modules.md#tevmclient)

## Type Aliases

### TevmClient

Ƭ **TevmClient**: `Object`

A local EVM instance running in the browser, Bun, or Node.js. Akin to anvil or ganache. The TevmClient interface
is a unified interface that all Clients implement. This provides a consistent developer experience no matter how you are
using Tevm.

**`See`**

[TevmClient guide](https://tevm.sh/learn/clients/) for more documentation on clients

#### JSON-RPC

Tevm exposes a JSON-RPC interface for interacting with the EVM via the [TevmClient.request](modules.md#request)

**`Example`**

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

**`Example`**

```typescript
// same as eth_blockNumber example
const account = await tevm.account({address: `0x${'0'.repeat(40)}`})
console.log(account.balance) // 0n
```

#### Ethereum actions

Ethereum actions are namespaced under [TevmClient.eth](modules.md#eth)

**`Example`**

```typescript
const blockNumber = await tevm.eth.blockNumber()
console.log(blockNumber) // 0n
```

#### Anvil hardhat and ganache compatibility

Will have anvil_* ganache_* and hardhat_* JSON-RPC compatibility in future versions

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `call` | `CallHandler` | Executes a call against the VM. It is similar to `eth_call` but has more options for controlling the execution environment By default it does not modify the state after the call is complete but this can be configured. **`Example`** ```ts const res = tevm.call({ to: '0x123...', data: '0x123...', from: '0x123...', gas: 1000000, gasPrice: 1n, skipBalance: true, } ``` |
| `contract` | `ContractHandler` | Executes a contract call against the VM. It is similar to `eth_call` but has more options for controlling the execution environment along with a typesafe API for creating the call via the contract abi. The contract must already be deployed. Otherwise see `script` which executes calls against undeployed contracts **`Example`** ```ts const res = await tevm.contract({ to: '0x123...', abi: [...], function: 'run', args: ['world'] from: '0x123...', gas: 1000000, gasPrice: 1n, skipBalance: true, } console.log(res.data) // "hello" ``` |
| `dumpState` | `DumpStateHandler` | Dumps the current state of the VM into a JSON-seralizable object State can be dumped as follows **`Example`** ```typescript const {state} = await tevm.dumpState() fs.writeFileSync('state.json', JSON.stringify(state)) ``` And then loaded as follows **`Example`** ```typescript const state = JSON.parse(fs.readFileSync('state.json')) await tevm.loadState({state}) ``` |
| `eth` | \{ `blockNumber`: `EthBlockNumberHandler` ; `call`: `EthCallHandler` ; `chainId`: `EthChainIdHandler` ; `gasPrice`: `EthGasPriceHandler` ; `getBalance`: `EthGetBalanceHandler` ; `getCode`: `EthGetCodeHandler` ; `getStorageAt`: `EthGetStorageAtHandler`  } | Standard JSON-RPC methods for interacting with the VM **`See`** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) |
| `eth.blockNumber` | `EthBlockNumberHandler` | Returns the current block number Set the `tag` to a block number or block hash to get the balance at that block Block tag defaults to 'pending' tag which is the optimistic state of the VM **`See`** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) **`Example`** ```ts const blockNumber = await tevm.eth.blockNumber() console.log(blockNumber) // 0n ``` |
| `eth.call` | `EthCallHandler` | Executes a call without modifying the state Set the `tag` to a block number or block hash to get the balance at that block Block tag defaults to 'pending' tag which is the optimistic state of the VM **`See`** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) **`Example`** ```ts const res = await tevm.eth.call({to: '0x123...', data: '0x123...'}) console.log(res) // "0x..." ``` |
| `eth.chainId` | `EthChainIdHandler` | Returns the current chain id Set the `tag` to a block number or block hash to get the balance at that block Block tag defaults to 'pending' tag which is the optimistic state of the VM **`See`** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) **`Example`** ```ts const chainId = await tevm.eth.chainId() console.log(chainId) // 10n ``` |
| `eth.gasPrice` | `EthGasPriceHandler` | Returns the current gas price Set the `tag` to a block number or block hash to get the balance at that block Block tag defaults to 'pending' tag which is the optimistic state of the VM **`See`** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) **`Example`** ```ts const gasPrice = await tevm.eth.gasPrice() console.log(gasPrice) // 0n ``` |
| `eth.getBalance` | `EthGetBalanceHandler` | Returns the balance of a given address Set the `tag` to a block number or block hash to get the balance at that block Block tag defaults to 'pending' tag which is the optimistic state of the VM **`See`** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) **`Example`** ```ts const balance = await tevm.eth.getBalance({address: '0x123...', tag: 'pending'}) console.log(gasPrice) // 0n ``` |
| `eth.getCode` | `EthGetCodeHandler` | Returns code at a given address Set the `tag` to a block number or block hash to get the balance at that block Block tag defaults to 'pending' tag which is the optimistic state of the VM **`See`** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) **`Example`** ```ts const code = await tevm.eth.getCode({address: '0x123...'}) ``` |
| `eth.getStorageAt` | `EthGetStorageAtHandler` | Returns storage at a given address and slot Set the `tag` to a block number or block hash to get the balance at that block Block tag defaults to 'pending' tag which is the optimistic state of the VM **`See`** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) **`Example`** ```ts const storageValue = await tevm.eth.getStorageAt({address: '0x123...', position: 0}) ``` |
| `getAccount` | `GetAccountHandler` | Gets the state of a specific ethereum address **`Example`** ```ts const res = tevm.getAccount({address: '0x123...'}) console.log(res.deployedBytecode) console.log(res.nonce) console.log(res.balance) ``` |
| `loadState` | `LoadStateHandler` | Loads a previously dumped state into the VM State can be dumped as follows **`Example`** ```typescript const {state} = await tevm.dumpState() fs.writeFileSync('state.json', JSON.stringify(state)) ``` And then loaded as follows **`Example`** ```typescript const state = JSON.parse(fs.readFileSync('state.json')) await tevm.loadState({state}) ``` |
| `request` | `TevmJsonRpcRequestHandler` | Request handler for JSON-RPC requests. Most users will want to use the [`actions` api](https://tevm.sh/learn/actions/) instead of this method directly **`Example`** ```typescript const blockNumberResponse = await tevm.request({ method: 'eth_blockNumber', params: [] id: 1 jsonrpc: '2.0' }) const accountResponse = await tevm.request({ method: 'tevm_getAccount', params: [{address: '0x123...'}], id: 1, jsonrpc: '2.0', }) ``` |
| `requestBulk` | `TevmJsonRpcBulkRequestHandler` | Bulk request handler for JSON-RPC requests. Takes an array of requests and returns an array of results. Bulk requests are currently handled in parallel which can cause issues if the requests are expected to run sequentially or interphere with each other. An option for configuring requests sequentially or in parallel will be added in the future. Currently is not very generic with regard to input and output types. **`Example`** ```typescript const [blockNumberResponse, gasPriceResponse] = await tevm.requestBulk([{ method: 'eth_blockNumber', params: [] id: 1 jsonrpc: '2.0' }, { method: 'eth_gasPrice', params: [] id: 1 jsonrpc: '2.0' }]) ``` ### tevm_* methods #### tevm_call request - CallJsonRpcRequest response - CallJsonRpcResponse #### tevm_script request - ScriptJsonRpcRequest response - ScriptJsonRpcResponse #### tevm_getAccount request - GetAccountJsonRpcRequest response - GetAccountJsonRpcResponse #### tevm_setAccount request - SetAccountJsonRpcRequest response - SetAccountJsonRpcResponse #### tevm_fork request - ForkJsonRpcRequest response - ForkJsonRpcResponse ### debug_* methods #### debug_traceCall request - DebugTraceCallJsonRpcRequest response - DebugTraceCallJsonRpcResponse ### eth_* methods #### eth_blockNumber request - EthBlockNumberJsonRpcRequest response - EthBlockNumberJsonRpcResponse #### eth_chainId request - EthChainIdJsonRpcRequest response - EthChainIdJsonRpcResponse #### eth_getCode request - EthGetCodeJsonRpcRequest response - EthGetCodeJsonRpcResponse #### eth_getStorageAt request - EthGetStorageAtJsonRpcRequest response - EthGetStorageAtJsonRpcResponse #### eth_gasPrice request - EthGasPriceJsonRpcRequest response - EthGasPriceJsonRpcResponse #### eth_getBalance request - EthGetBalanceJsonRpcRequest response - EthGetBalanceJsonRpcResponse |
| `script` | `ScriptHandler` | Executes scripts against the Tevm EVM. By default the script is sandboxed and the state is reset after each execution unless the `persist` option is set to true. **`Example`** ```typescript const res = tevm.script({ deployedBytecode: '0x6080604...', abi: [...], function: 'run', args: ['hello world'] }) ``` Contract handlers provide a more ergonomic way to execute scripts **`Example`** ```typescript ipmort {MyScript} from './MyScript.s.sol' const res = tevm.script( MyScript.read.run('hello world') ) ``` |
| `setAccount` | `SetAccountHandler` | Sets the state of a specific ethereum address **`Example`** ```ts import {parseEther} from 'tevm' await tevm.setAccount({ address: '0x123...', deployedBytecode: '0x6080604...', balance: parseEther('1.0') }) ``` |

#### Defined in

[TevmClient.ts:129](https://github.com/evmts/tevm-monorepo/blob/main/packages/client-types/src/TevmClient.ts#L129)
