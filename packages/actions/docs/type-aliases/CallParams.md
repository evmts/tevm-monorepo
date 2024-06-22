[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / CallParams

# Type alias: CallParams\<TThrowOnFail\>

> **CallParams**\<`TThrowOnFail`\>: [`BaseCallParams`](BaseCallParams.md)\<`TThrowOnFail`\> & `object`

Tevm params to execute a call on the vm
Call is the lowest level method to interact with the vm
and other messages such as contract and script are using call
under the hood

## Example

```typescript`
const callParams: import('@tevm/api').CallParams = {
  data: '0x...',
  bytecode: '0x...',
  gasLimit: 420n,
}
```

## See

[BaseCallParams](BaseCallParams.md)

## Type declaration

### code?

> `optional` `readonly` **code**: [`Hex`](Hex.md)

The encoded code to deploy with for a deployless call. Code is encoded with constructor args unlike `deployedBytecode`.

#### Example

```typescript
import {createMemoryClient, encodeDeployData} from 'tevm'

const client = createMemoryClient()

await client.tevmCall({
  createTransaction: true,
  data: encodeDeployData({
    bytecode: '0x...',
    data: '0x...',
    abi: [{...}],
    args: [1, 2, 3],
  })
})
```
Code is also automatically created if using Tevm contracts via script method.

```@example
import {SimpleContract} from 'tevm/contracts'
import {createMemoryClient} from 'tevm'

const client = createMemoryClient()

const script = SimpleContract.script({constructorArgs: [420n]})

console.log(script.code)

await client.tevmContract(
  script.read.get() // abi, code, functionName, args
) // 420n
```

### data?

> `optional` `readonly` **data**: [`Hex`](Hex.md)

The input data.

### deployedBytecode?

> `optional` `readonly` **deployedBytecode**: [`Hex`](Hex.md)

The code to put into the state before executing call. If you wish to call the constructor
use `code` instead.
```@example
import {createMemoryClient} from 'tevm'

const client = createMemoryClient()

await client.tevmCall({
  data: '0x...',
  deployedBytecode: '0x...',
})
```

### salt?

> `optional` `readonly` **salt**: [`Hex`](Hex.md)

An optional CREATE2 salt.

## Type parameters

• **TThrowOnFail** *extends* `boolean` = `boolean`

## Source

[packages/actions/src/Call/CallParams.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallParams.ts#L19)
