[**@tevm/memory-client**](../README.md)

***

[@tevm/memory-client](../globals.md) / tevmDeploy

# Function: tevmDeploy()

> **tevmDeploy**(`client`, `params`): `Promise`\<`DeployResult`\>

Defined in: [packages/memory-client/src/tevmDeploy.js:33](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/tevmDeploy.js#L33)

Tree-shakeable `tevmDeploy` action. Deploys a contract to the in-memory blockchain.

The deployment runs immediately, but the contract is only added to canonical state once mined.
In manual mining mode (the default) call `client.mine()` after deploying.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `client` | `Client`\<[`TevmTransport`](../type-aliases/TevmTransport.md)\<`string`\>, `Chain` \| `undefined`, `Account` \| `undefined`, `undefined`, \{\[`key`: `string`\]: `unknown`; `account?`: `undefined`; `batch?`: `undefined`; `cacheTime?`: `undefined`; `ccipRead?`: `undefined`; `chain?`: `undefined`; `dataSuffix?`: `undefined`; `experimental_blockTag?`: `undefined`; `key?`: `undefined`; `name?`: `undefined`; `pollingInterval?`: `undefined`; `request?`: `undefined`; `transport?`: `undefined`; `type?`: `undefined`; `uid?`: `undefined`; \} \| `undefined`\> | The viem client configured with TEVM transport. |
| `params` | `Omit`\<`BaseCallParams`\<`boolean`\>, `"to"`\> & `object` & `object` & `object` & `CallEvents` | Parameters for the contract deployment, including ABI, bytecode, and constructor arguments. |

## Returns

`Promise`\<`DeployResult`\>

Deployment result including created contract address and execution details.

## Example

```typescript
import { tevmDeploy } from 'tevm/actions'
import { createClient, http, parseAbi } from 'viem'
import { createTevmTransport } from 'tevm'

const client = createClient({ transport: createTevmTransport() })
const result = await tevmDeploy(client, {
  abi: parseAbi(['constructor(string)']),
  bytecode: '0x6080...',
  args: ['Token'],
})
await client.mine()
```

## See

 - [DeployParams](https://tevm.sh/reference/tevm/actions/type-aliases/deployparams/) for options reference.
 - [DeployResult](https://tevm.sh/reference/tevm/actions/type-aliases/deployresult/) for return values reference.

## Throws

Will throw if the contract deployment fails (constructor revert, invalid bytecode, insufficient gas).
