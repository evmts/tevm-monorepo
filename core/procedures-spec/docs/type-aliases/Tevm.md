**@tevm/procedures-spec** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > Tevm

# Type alias: Tevm

> **Tevm**: `object`

A local EVM instance running in the browser or Node.js. Akin to anvil or ganache

- Runs in browser bun and node.js environments
- Network forking to fork any EVM compatible network
- Supports most ethereum JSON-RPC methods

## See

 - [createMemoryTevm](https://todo.todo) for documentation on creating an in memory Tevm instance
 - [createTevmClient](https://todo.todo) for documentation on creating an client for talking to a remote Tevm instance over HTTP

#### JSON-RPC

Tevm exposes a JSON-RPC interface for interacting with the EVM via the [Tevm.request](Property request: TevmJsonRpcRequestHandler)

## Example

```typescript
import {createMemoryTevm, type Tevm} from 'tevm'

const tevm: Tevm = createMemoryTevm()

await tevm.request({
  method: 'eth_blockNumber',
  params: []
  id: 1
  jsonrpc: '2.0'
}) // 2323409234999n
```

#### Actions

Tevm exposes a higher level `actions` based api similar to [viem](https://viem.sh) for interacting with Tevm in a typesasafe
ergonomic way.

## Example

```typescript
// same as eth_blockNumber example
const blockNumber = await tevm.eth.blockNumber()
console.log(blockNumber) // 0n
```

#### Ethereum actions

Ethereum actions are namespaced under [Tevm.eth](Property eth: Object)

#### Anvil hardhat and ganache compatibility

Will have anvil_* ganache_* and hardhat_* JSON-RPC compatibility in future versions

## Type declaration

### call

> **call**: `CallHandler`

Executes a call against the VM. It is similar to `eth_call` but has more
options for controlling the execution environment

See `contract` and `script` which executes calls specifically against deployed contracts
or undeployed scripts

#### Example

```ts
const res = tevm.call({
to: '0x123...',
data: '0x123...',
from: '0x123...',
gas: 1000000,
gasPrice: 1n,
skipBalance: true,
}
```

### contract

> **contract**: `ContractHandler`

Executes a contract call against the VM. It is similar to `eth_call` but has more
options for controlling the execution environment along with a typesafe API
for creating the call via the contract abi.

The contract must already be deployed. Otherwise see `script` which executes calls
against undeployed contracts

#### Example

```ts
const res = await tevm.contract({
  to: '0x123...',
  abi: [...],
  function: 'run',
  args: ['world']
  from: '0x123...',
  gas: 1000000,
  gasPrice: 1n,
  skipBalance: true,
}
console.log(res.data) // "hello"
```

### dumpState

> **dumpState**: `DumpStateHandler`

Dumps the current state of the VM into a JSON-seralizable object

State can be dumped as follows

#### Example

```typescript
const {state} = await tevm.dumpState()
fs.writeFileSync('state.json', JSON.stringify(state))
```

And then loaded as follows

#### Example

```typescript
const state = JSON.parse(fs.readFileSync('state.json'))
await tevm.loadState({state})
```

### eth

> **eth**: `object`

Standard JSON-RPC methods for interacting with the VM

#### See

[JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/)

### eth.blockNumber

> **eth.blockNumber**: `EthBlockNumberHandler`

Returns the current block number
Set the `tag` to a block number or block hash to get the balance at that block
Block tag defaults to 'pending' tag which is the optimistic state of the VM

#### See

[JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/)

#### Example

```ts
const blockNumber = await tevm.eth.blockNumber()
console.log(blockNumber) // 0n
```

### eth.chainId

> **eth.chainId**: `EthChainIdHandler`

Returns the current chain id
Set the `tag` to a block number or block hash to get the balance at that block
Block tag defaults to 'pending' tag which is the optimistic state of the VM

#### See

[JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/)

#### Example

```ts
const chainId = await tevm.eth.chainId()
console.log(chainId) // 10n
```

### eth.gasPrice

> **eth.gasPrice**: `EthGasPriceHandler`

Returns the current gas price
Set the `tag` to a block number or block hash to get the balance at that block
Block tag defaults to 'pending' tag which is the optimistic state of the VM

#### See

[JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/)

#### Example

```ts
const gasPrice = await tevm.eth.gasPrice()
console.log(gasPrice) // 0n
```

### eth.getBalance

> **eth.getBalance**: `EthGetBalanceHandler`

Returns the balance of a given address
Set the `tag` to a block number or block hash to get the balance at that block
Block tag defaults to 'pending' tag which is the optimistic state of the VM

#### See

[JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/)

#### Example

```ts
const balance = await tevm.eth.getBalance({address: '0x123...', tag: 'pending'})
console.log(gasPrice) // 0n
```

### eth.getCode

> **eth.getCode**: `EthGetCodeHandler`

Returns code at a given address
Set the `tag` to a block number or block hash to get the balance at that block
Block tag defaults to 'pending' tag which is the optimistic state of the VM

#### See

[JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/)

#### Example

```ts
const code = await tevm.eth.getCode({address: '0x123...'})
```

### eth.getStorageAt

> **eth.getStorageAt**: `EthGetStorageAtHandler`

Returns storage at a given address and slot
Set the `tag` to a block number or block hash to get the balance at that block
Block tag defaults to 'pending' tag which is the optimistic state of the VM

#### See

[JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/)

#### Example

```ts
const storageValue = await tevm.eth.getStorageAt({address: '0x123...', position: 0})
```

### getAccount

> **getAccount**: `GetAccountHandler`

Gets the state of a specific ethereum address

#### Example

```ts
const res = tevm.getAccount({address: '0x123...'})
console.log(res.deployedBytecode)
console.log(res.nonce)
console.log(res.balance)
```

### loadState

> **loadState**: `LoadStateHandler`

Loads a previously dumped state into the VM

State can be dumped as follows

#### Example

```typescript
const {state} = await tevm.dumpState()
fs.writeFileSync('state.json', JSON.stringify(state))
```

And then loaded as follows

#### Example

```typescript
const state = JSON.parse(fs.readFileSync('state.json'))
await tevm.loadState({state})
```

### request

> **request**: [`TevmJsonRpcRequestHandler`](TevmJsonRpcRequestHandler.md)

Request handler for JSON-RPC requests. Most users will want to use the `actions` api
instead of this method directly

#### Example

```typescript
const blockNumberResponse = await tevm.request({
 method: 'eth_blockNumber',
 params: []
 id: 1
 jsonrpc: '2.0'
})
const accountResponse = await tevm.request({
 method: 'tevm_getAccount',
 params: [{address: '0x123...'}]
 id: 1
 jsonrpc: '2.0'
})
```

### script

> **script**: `ScriptHandler`

Executes scripts against the Tevm EVM. By default the script is sandboxed
and the state is reset after each execution unless the `persist` option is set
to true.

#### Example

```typescript
const res = tevm.script({
  deployedBytecode: '0x6080604...',
  abi: [...],
  function: 'run',
  args: ['hello world']
})
```
Contract handlers provide a more ergonomic way to execute scripts

#### Example

```typescript
ipmort {MyScript} from './MyScript.s.sol'

const res = tevm.script(
   MyScript.read.run('hello world')
)
```

### setAccount

> **setAccount**: `SetAccountHandler`

Sets the state of a specific ethereum address

#### Example

```ts
import {parseEther} from 'tevm'

await tevm.setAccount({
 address: '0x123...',
 deployedBytecode: '0x6080604...',
 balance: parseEther('1.0')
})
```

## Source

[Tevm.ts:69](https://github.com/evmts/tevm-monorepo/blob/main/core/procedures-spec/src/Tevm.ts#L69)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
