---
editUrl: false
next: false
prev: false
title: "TevmActionsApi"
---

> **TevmActionsApi**: `object`

The actions api is the high level API for interacting with a Tevm client similar to [viem actions](https://viem.sh/learn/actions/)

## Type declaration

### call

> **call**: [`CallHandler`](/reference/tevm/actions/type-aliases/callhandler/)

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

> **contract**: [`ContractHandler`](/reference/tevm/actions/type-aliases/contracthandler/)

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

### deal

> **deal**: [`AnvilDealHandler`](/reference/tevm/actions/type-aliases/anvildealhandler/)

Deals ERC20 tokens to an account by overriding the storage of balanceOf(account)

#### Example

```typescript
await tevm.deal({
  erc20: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // Optional: USDC address
  account: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  amount: 1000000n // 1 USDC (6 decimals)
})
```

### deploy

> **deploy**: [`DeployHandler`](/reference/tevm/actions/type-aliases/deployhandler/)

Creates a transaction to deploys a contract to tevm

### dumpState

> **dumpState**: [`DumpStateHandler`](/reference/tevm/actions/type-aliases/dumpstatehandler/)

Dumps the current state of the VM into a JSON-seralizable object

State can be dumped as follows

#### Examples

```typescript
const {state} = await tevm.dumpState()
fs.writeFileSync('state.json', JSON.stringify(state))
```

And then loaded as follows

```typescript
const state = JSON.parse(fs.readFileSync('state.json'))
await tevm.loadState({state})
```

### getAccount

> **getAccount**: [`GetAccountHandler`](/reference/tevm/actions/type-aliases/getaccounthandler/)

Gets the state of a specific ethereum address

#### Example

```ts
const res = tevm.getAccount({address: '0x123...'})
console.log(res.deployedBytecode)
console.log(res.nonce)
console.log(res.balance)
```

### loadState

> **loadState**: [`LoadStateHandler`](/reference/tevm/actions/type-aliases/loadstatehandler/)

Loads a previously dumped state into the VM

State can be dumped as follows

#### Examples

```typescript
const {state} = await tevm.dumpState()
fs.writeFileSync('state.json', JSON.stringify(state))
```

And then loaded as follows

```typescript
const state = JSON.parse(fs.readFileSync('state.json'))
await tevm.loadState({state})
```

### mine

> **mine**: [`MineHandler`](/reference/tevm/actions/type-aliases/minehandler/)

Mines 1 or more blocks

### setAccount

> **setAccount**: [`SetAccountHandler`](/reference/tevm/actions/type-aliases/setaccounthandler/)

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

## See

[https://tevm.sh/learn/actions/](https://tevm.sh/learn/actions/)

## Defined in

[actions/TevmActionsApi.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/actions/TevmActionsApi.ts#L17)
