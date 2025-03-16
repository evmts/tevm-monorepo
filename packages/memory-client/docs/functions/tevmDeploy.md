[**@tevm/memory-client**](../README.md)

***

[@tevm/memory-client](../globals.md) / tevmDeploy

# Function: tevmDeploy()

> **tevmDeploy**(`client`, `params`): `Promise`\<`DeployResult`\>

Defined in: [packages/memory-client/src/tevmDeploy.js:136](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/tevmDeploy.js#L136)

A tree-shakeable version of the `tevmDeploy` action for viem.
Deploys a smart contract to the in-memory blockchain with comprehensive deployment options and tracing capabilities.

This function handles the complete contract deployment process:
1. Encoding constructor arguments according to the ABI
2. Creating a deployment transaction with the contract bytecode
3. Executing the contract creation code in the EVM
4. Returning the deployment results including the new contract's address

**Important Mining Consideration:**
The contract deployment is processed immediately, but the contract is not officially added to blockchain state
until the transaction is mined. In manual mining mode (the default), you must explicitly call `client.mine()`
after deployment before interacting with the contract.

**Deployment Strategies:**
- **Standard Transaction Deployment**: Creates a transaction that must be mined (used by this function)
- **Alternative - Direct State Injection**: For testing scenarios, you can use `tevmSetAccount` to directly
  inject contract bytecode into state without a formal deployment transaction

## Parameters

### client

`Client`\<[`TevmTransport`](../type-aliases/TevmTransport.md)\<`string`\>, `undefined` \| `Chain`, `undefined` \| `Account`, `undefined`, `undefined` \| \{ `[key: string]`: `unknown`;  `account`: `undefined`; `batch`: `undefined`; `cacheTime`: `undefined`; `ccipRead`: `undefined`; `chain`: `undefined`; `key`: `undefined`; `name`: `undefined`; `pollingInterval`: `undefined`; `request`: `undefined`; `transport`: `undefined`; `type`: `undefined`; `uid`: `undefined`; \}\>

The viem client configured with TEVM transport.

### params

`Omit`\<`BaseCallParams`\<`boolean`\>, `"to"`\> & `object` & `object` & `object` & `CallEvents`

Parameters for the contract deployment, including ABI, bytecode, and constructor arguments.

## Returns

`Promise`\<`DeployResult`\>

The result of the contract deployment, including the created contract address, transaction hash, and execution details.

## Examples

```typescript
import { tevmDeploy } from 'tevm/actions'
import { createClient, http, parseAbi } from 'viem'
import { optimism } from 'tevm/common'
import { createTevmTransport } from 'tevm'

const client = createClient({
  transport: createTevmTransport({
    fork: { transport: http('https://mainnet.optimism.io')({}) },
    mining: { auto: true } // Optional: enable auto-mining for convenience
  }),
  chain: optimism,
})

async function deployStandardERC20() {
  // Define contract ABI and bytecode
  const abi = parseAbi([
    'constructor(string name, string symbol, uint8 decimals)',
    'function balanceOf(address) view returns (uint256)',
    'function transfer(address to, uint256 amount) returns (bool)'
  ])
  const bytecode = '0x60806040523480156100...' // ERC20 bytecode

  // Deploy with constructor arguments and sender address
  const result = await tevmDeploy(client, {
    abi,
    bytecode,
    args: ['My Test Token', 'MTT', 18],
    from: '0x1234567890123456789012345678901234567890',

    // Optional: trace the deployment execution step by step
    onStep: (step, next) => {
      console.log(`Executing ${step.opcode.name} at PC=${step.pc}`)
      next() // Must call next() to continue execution
    }
  })

  // In manual mining mode, transaction must be mined
  if (!client.transport.tevm.mining?.auto) {
    await client.mine()
  }

  console.log(`Contract deployed at: ${result.createdAddress}`)
  console.log(`Gas used: ${result.executionGasUsed}`)

  // Get transaction receipt after mining
  const receipt = await client.getTransactionReceipt({
    hash: result.transactionHash
  })
  console.log(`Block number: ${receipt.blockNumber}`)

  return result.createdAddress
}
```

```typescript
// Using with direct Solidity imports via TEVM bundler
import { tevmDeploy } from 'tevm/actions'
import { createClient, http } from 'viem'
import { optimism } from 'tevm/common'
import { createTevmTransport } from 'tevm'
import { MyToken } from './MyToken.sol' // Direct Solidity import

const client = createClient({
  transport: createTevmTransport({
    fork: { transport: http('https://mainnet.optimism.io')({}) }
  }),
  chain: optimism,
})

async function example() {
  // The imported contract has a pre-configured deploy function
  const result = await tevmDeploy(client,
    MyToken.deploy('My Token', 'MTK', 18)
  )

  // Mine the deployment transaction
  await client.mine()

  // Interact with the deployed contract
  const deployedContract = {
    ...MyToken,
    address: result.createdAddress
  }

  await client.tevmContract({
    ...deployedContract.write.mint(
      '0x1234567890123456789012345678901234567890',
      1000000n
    ),
    from: '0x1234567890123456789012345678901234567890'
  })

  await client.mine()
}
```

## See

 - [DeployParams](https://tevm.sh/reference/tevm/actions/type-aliases/deployparams/) for options reference.
 - [DeployResult](https://tevm.sh/reference/tevm/actions/type-aliases/deployresult/) for return values reference.
 - [BaseCallParams](https://tevm.sh/reference/tevm/actions/type-aliases/basecallparams-1/) for the base call parameters.
 - [TEVM Actions Guide](https://tevm.sh/learn/actions/)
 - [tevmSetAccount](https://tevm.sh/reference/tevm/actions/functions/setaccounthandler/) for putting contract bytecode into the state without deploying.
 - [TEVM Bundler Guide](https://tevm.sh/learn/solidity-imports/) for using the TEVM bundler to deploy contracts.
 - [tevmContract](https://tevm.sh/reference/tevm/memory-client/functions/tevmcontract/) for interacting with deployed contracts.

## Throws

Will throw if the contract deployment fails due to reverts in constructor execution, invalid bytecode, or insufficient gas.
