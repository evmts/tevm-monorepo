[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / CallParams

# Type Alias: CallParams\<TThrowOnFail\>

> **CallParams**\<`TThrowOnFail`\>: `BaseCallParams`\<`TThrowOnFail`\> & `object`

TEVM parameters to execute a call on the VM.
`Call` is the lowest level method to interact with the VM, and other methods such as `contract` and `script` use `call` under the hood.

## Type declaration

### code?

> `readonly` `optional` **code**: `Hex`

The encoded code to deploy with for a deployless call. Code is encoded with constructor arguments, unlike `deployedBytecode`.

#### Examples

```typescript
import { createClient } from 'viem'
import { createTevmTransport, tevmCall, encodeDeployData } from 'tevm'
import { optimism } from 'tevm/common'

const client = createClient({
  transport: createTevmTransport({}),
  chain: optimism,
})

const callParams = {
  createTransaction: true,
  data: encodeDeployData({
    bytecode: '0x...',
    data: '0x...',
    abi: [{...}],
    args: [1, 2, 3],
  })
}

await tevmCall(client, callParams)
```
Code is also automatically created if using TEVM contracts via the `script` method.

```typescript
import { createClient } from 'viem'
import { createTevmTransport, tevmContract } from 'tevm'
import { optimism } from 'tevm/common'
import { SimpleContract } from 'tevm/contracts'

const client = createClient({
  transport: createTevmTransport({}),
  chain: optimism,
})

const script = SimpleContract.script({ constructorArgs: [420n] })

await tevmContract(client, script.read.get()) // 420n
```

### data?

> `readonly` `optional` **data**: `Hex`

The input data for the call.

### deployedBytecode?

> `readonly` `optional` **deployedBytecode**: `Hex`

The code to put into the state before executing the call. If you wish to call the constructor, use `code` instead.

#### Example

```typescript
import { createClient } from 'viem'
import { createTevmTransport, tevmCall } from 'tevm'
import { optimism } from 'tevm/common'

const client = createClient({
  transport: createTevmTransport({}),
  chain: optimism,
})

const callParams = {
  data: '0x...',
  deployedBytecode: '0x...',
}

await tevmCall(client, callParams)
```

### salt?

> `readonly` `optional` **salt**: `Hex`

An optional CREATE2 salt.

#### Example

```typescript
import { createClient } from 'viem'
import { createTevmTransport, tevmCall } from 'tevm'
import { optimism } from 'tevm/common'

const client = createClient({
  transport: createTevmTransport({}),
  chain: optimism,
})

const callParams = {
  data: '0x...',
  bytecode: '0x...',
  gasLimit: 420n,
  salt: '0x1234...',
}

await tevmCall(client, callParams)
```

#### See

[CREATE2](https://eips.ethereum.org/EIPS/eip-1014)

## Type Parameters

• **TThrowOnFail** *extends* `boolean` = `boolean`

## Example

```typescript
import { createClient } from 'viem'
import { createTevmTransport, tevmCall } from 'tevm'
import { optimism } from 'tevm/common'

const client = createClient({
  transport: createTevmTransport({}),
  chain: optimism,
})

const callParams = {
  data: '0x...',
  bytecode: '0x...',
  gasLimit: 420n,
}

await tevmCall(client, callParams)
```

## See

 - [BaseCallParams](https://tevm.sh/reference/tevm/actions/type-aliases/basecallparams-1/)
 - [tevmCall](https://tevm.sh/reference/tevm/memory-client/functions/tevmCall/)

## Defined in

packages/actions/types/Call/CallParams.d.ts:30
