---
editUrl: false
next: false
prev: false
title: "DeployParams"
---

> **DeployParams**\<`TThrowOnFail`, `TAbi`, `THasConstructor`, `TAllArgs`\>: `Omit`\<[`BaseCallParams`](/reference/tevm/actions/type-aliases/basecallparams/)\<`TThrowOnFail`\>, `"to"`\> & `object` & [`EncodeDeployDataParameters`](/reference/tevm/utils/type-aliases/encodedeploydataparameters/)\<`TAbi`, `THasConstructor`, `TAllArgs`\>

Defines the parameters used for deploying a contract on TEVM.
This type extends the base call parameters used for typical TEVM calls,
with the addition of deployment-specific settings. By default, `createTransaction`
is set to true, because deployments result in state changes that need to be mined.

The `salt` parameter supports the use of CREATE2, allowing for deterministic address deployment.

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

## Type declaration

### salt?

> `readonly` `optional` **salt**: [`Hex`](/reference/tevm/actions/type-aliases/hex/)

An optional CREATE2 salt, if deploying with CREATE2 for a predictable contract address.

## Type Parameters

• **TThrowOnFail** *extends* `boolean` = `boolean`

Indicates whether the function should throw on failure.

• **TAbi** *extends* [`Abi`](/reference/tevm/utils/type-aliases/abi/) \| readonly `unknown`[] = [`Abi`](/reference/tevm/utils/type-aliases/abi/)

The ABI type, typically including constructor definitions.

• **THasConstructor** = `TAbi` *extends* [`Abi`](/reference/tevm/utils/type-aliases/abi/) ? [`Abi`](/reference/tevm/utils/type-aliases/abi/) *extends* `TAbi` ? `true` : [`Extract`\<`TAbi`\[`number`\], `object`\>] *extends* [`never`] ? `false` : `true` : `true`

Determines whether the ABI includes a constructor.

• **TAllArgs** = [`ContractConstructorArgs`](/reference/tevm/utils/type-aliases/contractconstructorargs/)\<`TAbi`\>

Types of the constructor arguments for the deployment.

## Defined in

[packages/actions/src/Deploy/DeployParams.ts:47](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/actions/src/Deploy/DeployParams.ts#L47)
