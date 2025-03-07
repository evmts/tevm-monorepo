[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / DeployParams

# Type Alias: DeployParams\<TThrowOnFail, TAbi, THasConstructor, TAllArgs\>

> **DeployParams**\<`TThrowOnFail`, `TAbi`, `THasConstructor`, `TAllArgs`\>: `Omit`\<[`BaseCallParams`](BaseCallParams.md)\<`TThrowOnFail`\>, `"to"`\> & `object` & `EncodeDeployDataParameters`\<`TAbi`, `THasConstructor`, `TAllArgs`\>

Defined in: [packages/actions/src/Deploy/DeployParams.ts:47](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Deploy/DeployParams.ts#L47)

Defines the parameters used for deploying a contract on TEVM.
This type extends the base call parameters used for typical TEVM calls,
with the addition of deployment-specific settings. By default, `createTransaction`
is set to true, because deployments result in state changes that need to be mined.

The `salt` parameter supports the use of CREATE2, allowing for deterministic address deployment.

## Type declaration

### salt?

> `readonly` `optional` **salt**: [`Hex`](Hex.md)

An optional CREATE2 salt, if deploying with CREATE2 for a predictable contract address.

## Type Parameters

• **TThrowOnFail** *extends* `boolean` = `boolean`

Indicates whether the function should throw on failure.

• **TAbi** *extends* `Abi` \| readonly `unknown`[] = `Abi`

The ABI type, typically including constructor definitions.

• **THasConstructor** = `TAbi` *extends* `Abi` ? `Abi` *extends* `TAbi` ? `true` : \[`Extract`\<`TAbi`\[`number`\], \{ `type`: `"constructor"`; \}\>\] *extends* \[`never`\] ? `false` : `true` : `true`

Determines whether the ABI includes a constructor.

• **TAllArgs** = `ContractConstructorArgs`\<`TAbi`\>

Types of the constructor arguments for the deployment.

## Example

```typescript
import { createClient } from 'viem'
import { deployHandler } from 'tevm/actions'

const client = createClient({
  transport: createTevmTransport({
    fork: { transport: http('https://mainnet.optimism.io')({}) }
  })
})

const deployParams = {
  bytecode: '0x6000366000...',
  abi: [{
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor'
  }],
  args: [],
  salt: '0x0000...0001',  // Optional CREATE2 salt for deterministic deployment
  from: '0xYourAccountAddress',
  gas: 1000000n,
  createTransaction: true
}

const result = await deployHandler(client)(deployParams)
console.log('Deployed contract address:', result.createdAddress)
```
