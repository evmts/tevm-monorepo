**@tevm/viem** • [Readme](../README.md) \| [API](../globals.md)

***

[@tevm/viem](../README.md) / tevmViemExtension

# Function: tevmViemExtension()

> **tevmViemExtension**(): [`ViemTevmClientDecorator`](../type-aliases/ViemTevmClientDecorator.md)

Decorates a viem [public client](https://viem.sh/) with the [tevm api](https://tevm.sh/generated/tevm/api/type-aliases/tevm/) with tevm
specif actions namspaced under `client.tevm`
It is used together with [tevmTransport](https://tevm.sh/generated/tevm/tevmTransport)

## Returns

[`ViemTevmClientDecorator`](../type-aliases/ViemTevmClientDecorator.md)

## Example

```js
import { tevmViemExtension, tevmTransport } from 'tevm/viem'
import { createPublicClient } from 'viem'

const client = createPublicClient({
  'https://mainnet.optimism.io'
}).extend(tevmViemExtension())
```
## With a backend server

This decorator can also be used with a [@tevm/server](https://tevm.sh/generated/tevm/server/functions/createserver)

## Example

```typescript
// Server code
import { createServer } from '@tevm/server'

const server = createServer({
 fork: {
   url: 'https://mainnet.optimism.io'
 }
})

server.listen(8545)

// Client code
import { tevmViemExtension } from 'tevm/viem'
import { createPublicClient, http } from 'viem'
import { optimism } from 'viem/chains'

const client = createPublicClient({
  transport: http('http://localhost:8545'),
  chain: optimism,
})
```

## client.tevm.call

A low level call to tevm backend similar to [client.call](https://viem.sh/docs/clients/public.html#call) but with advanced tevm specific parameters
Unlike a normal call one can optionally chose to create a transaction on the blockchain with the call
Tevm also supports geth style `stateOverrideSet` and `blockOverrideSet` parameters

## Example

```typescript
client.tevm.call({
  to: `0x${'2'.repeat(40)}`,
  // Will create a transaction in the tevm blockchain based on call
  createTransaction: true,
  // Skip balance will automatically mint msg.value if account has less than msg.value
  skipBalance: true,
  // You can arbitrarily set the caller and origin
  caller: `0x${'1'.repeat(40)}`,
  origin: `0x${'2'.repeat(40)}`,
  // You can customize the call depth
  depth: 0,
})
```

## client.tevm.contract

A `call` like method for executing contract code with tevm backend similar to [client.readContract](https://viem.sh/docs/clients/public.html#readContract) but with advanced tevm specific parameters
It can create transactions just like writeContract as well iwth `createTransaction`
See `client.tevm.call` for more details on the custom options

## Example

```typescript
client.tevm.contract({
  // Takes params similar to readContract and writeContract
  abi: parseAbi(['function balanceOf(address): uint256']),
  functionName: 'balanceOf',
  args: [address]
  to: erc20Address,
})
```

## client.tevm.script

Another `call` like method for executing arbitrary contract bytecode in the evm.
Unlike `client.tevm.contract` it does not require the contract to already be deployed
Similar to `client.tevm.call` it can create transactions with `createTransaction`
See `client.tevm.call` for more details on the custom options

## Example

```typescript
client.tevm.script({
 // Takes params similar to readContract and writeContract
 abi: parseAbi(['function foo(address): uint256']),
 functionName: 'foo',
 args: [address],
 deployedBytecode: '0x1234...',
 to: '0x
})
```

## client.tevm.getAccount

A method for getting the account state of an address
It can optionally also return contract storage

## Example

```typescript
const account = await client.tevm.getAccount({
 address: `0x${'2'.repeat(40)}`,
})
console.log(account) // { balance: 0n, nonce: 0n, storageRoot: '0x0', codeHash: '0x0',... }
```

## client.tevm.setAccount

A method for setting the account state of an address
It can optionally also set contract storage

## Example

```typescript
const account = await client.tevm.setAccount({
address: `0x${'2'.repeat(40)}`,
balance: 100n,
nonce: 0n,
storageRoot: '0x0',
codeHash: '0x0',
deployedBytecode: '0x0',
})
```

## client.tevm.dumpState

Dumps the entire tevm state into a JSON-serializable object

## Example

```typescript
const state = await client.tevm.dumpState()
```

## client.tevm.loadState

Loads a tevm state generated with `client.tevm.dumpState` into the tevm state

## Example

```typescript
await client.tevm.loadState(state)
```

## Source

[tevmViemExtension.js:162](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/tevmViemExtension.js#L162)
