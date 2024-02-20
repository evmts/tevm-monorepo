---
editUrl: false
next: false
prev: false
title: "TevmActionsApi"
---

> **TevmActionsApi**: `object`

The actions api is the high level API for interacting with a Tevm client similar to [viem actions](https://viem.sh/learn/actions/)

## See

[https://tevm.sh/learn/actions/](https://tevm.sh/learn/actions/)

## Type declaration

### call

> **call**: [`CallHandler`](/reference/tevm/actions-types/type-aliases/callhandler/)

Executes a call against the VM. It is similar to `eth_call` but has more
options for controlling the execution environment

By default it does not modify the state after the call is complete but this can be configured.

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

> **contract**: [`ContractHandler`](/reference/tevm/actions-types/type-aliases/contracthandler/)

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

> **dumpState**: [`DumpStateHandler`](/reference/tevm/actions-types/type-aliases/dumpstatehandler/)

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

### getAccount

> **getAccount**: [`GetAccountHandler`](/reference/tevm/actions-types/type-aliases/getaccounthandler/)

Gets the state of a specific ethereum address

#### Example

```ts
const res = tevm.getAccount({address: '0x123...'})
console.log(res.deployedBytecode)
console.log(res.nonce)
console.log(res.balance)
```

### loadState

> **loadState**: [`LoadStateHandler`](/reference/tevm/actions-types/type-aliases/loadstatehandler/)

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

### script

> **script**: [`ScriptHandler`](/reference/tevm/actions-types/type-aliases/scripthandler/)

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

> **setAccount**: [`SetAccountHandler`](/reference/tevm/actions-types/type-aliases/setaccounthandler/)

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

[TevmActionsApi.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/TevmActionsApi.ts#L15)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
