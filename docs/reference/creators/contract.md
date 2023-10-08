# Contract

Contracts are the core api primitive of EVMts. They can be built from an ABI or imported directly from solidity using EVMts build tooling.

- **Contract Actions**

Contracts create `actions`. Actions are json serializable objects that are read by EVMts action handlers to do things such as execute a JSON rpc call. Actions also make debugging easier as they are all logged when [debug mode](../todo.md) is turned on.

For more information about actions see the documentation for the individual actions.

## Type

```typescript
import type {Abi, Hex, AbiParameter, AbiEventParameter} from 'evmts'

type Contract {
  abi: Abi,
  humanReadableAbi: Array<string>,
  bytecode: Hex,
  deployment: {
    abiItem: {
      name: 'constructor',
      stateMutability: 'nonpayable' | 'payable',
      inputs: Array<AbiParameter>
    },
    humanReadableAbiItem: string,
    deploy: (...args, options: DeployOptions) => DeployAction,
    deployPopulateTransaction: (...args, options: DeployOptions) => PopulateDeploymentAction,
    waitForDeployment: (options: WaitForDeploymentOptions) => WaitForDeploymentListener,
    getDeployedCode: (options: GetDeployedCodeOptions) => GetDeployedCodeAction,
    estimateGas: (...args, options: DeployOptions) => EstimateGasAction,
    simulateDeploy: (...args, options: DeployOptions) => SimulateDeployAction,
  },
  read: {
    [TFunctionName in ContractFunctionNames]: {
      name: TFunctionName,
      abi: Array<FunctionAbiItem>,
      humanReadableAbi: Array<string>,
      stateMutability: 'pure' | 'view' ,
      call: (...args, options: CallOptions) => CallAction,
      populateCall: (...args, options: PopulateCallOptions) => PopulateCallAction,
      staticCall: (...args, options: CallOptions) => StaticCallAction,
    }
  },
  write: {
    [functionName in ContractFunctionNames]: {
      name: TFunctionName,
      abi: Array<FunctionAbiItem>,
      humanReadableAbi: Array<string>,
      stateMutability: 'payable' | 'nonpayable',
      send: (...args, options: SendOptions) => SendAction,
      populateSendTransaction: (...args, options: PopulateSendTransaction) => PopulateSendTransactionAction,
      sendOptimistic: (...args, options: SendOptimisticOptions) => SendOptimisticAction,
      estimateGas: (...args, options: EstimateGasOptions) => EstimateGasAction,
      simulate: (...args, options: SimulateWriteOptions) => SimulateWriteActions,
    }
  },
  errors: {
    [TErrorName in ContractErrorNames]: {
      name: TErrorName,
      abi: [FunctionAbiItem],
      humanReadableAbi: [string],
      // TODO what else?
    }
  },
  events: {
    [TEventName in ContractEventNames]: {
      name: TEventName,
      inputs: Array<AbiEventParameter>,
      anonymous?: boolean,
    }
  },
  fallback: {
    stateMutability: 'nonpayable' | 'payable'
  },
}
```

## Action Example

The below code generates an json rpc call and then sends the action to an RPC node.

```typescript
import {mainnet} from 'evmts/chains'
import {jsonRpc} from 'evmts'
import {ERC20} from '@open-zeppelin/contracts/tokens/ERC20/ERC20.sol'

const balanceOfAction = MyContract.read.balanceOf.call('0x121212121212121212121212', {
  address: '0x42424242424242424242424242', 
  chain: mainnet
})

console.log(balanceOfAction) // returns the below object
/**
{ 
  __type: 'Contract.read.methodName.call',
  args: ['0x121212121212121212121212'],
  options: {
      addressBook
  }
  abi: {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    args: [{
		  constant: true,
		  inputs: [{ name: 'owner', type: 'address' }],
		  name: 'balanceOf',
		  outputs: [{ name: '', type: 'uint256' }],
		  payable: false,
		  stateMutability: 'view',
		  type: 'function',
    }]
  }
}
*/

const balance = await jsonRpc.call({
  action: balanceOfAction,
  chain: mainnet,
})

console.log(balance) // 420n
```

## Creating an EVMts contract from an import

With the @evmts/imports build tools you can create a contract from simply importing it's solidity file. The solidity file can either be in your project, in a different workspace, or npm installed. It is also possible to generate contracts using `@evmts/cli` from a block explorer.

This is the recomended way to use a contract as it will give you lots of nice `LSP` (language server protocol) features such as
- go-to-definition taking you directly to the solidity code that defines a function or event
- natspec comments on hover
- easy to read type errors rather than the difficult to read type errors type inference produces

- **Example**

```
// import local contract
import { MyLocalContract } from '../contracts/MyLocalContract.sol'
// import from node_modules
import { ERC20 } from '@open-zeppelin/contracts/tokens/ERC20/ERC20.sol'

// once imported use as normal
const readBalanceAction = ERC20.read.balanceOf.call('0x121212121212121212121212')
```

## Creating an EVMts contract from an abi

It is also possible to create an EVMts contract from an ABI. 

**Important**

For the type inference to work the abi must be as const. Importing a json file or a non const json object will work at runtime but typescript will be unable to infer the types.

Type errors will be a little tougher to read if you use an abi directly compared to using the EVMts build tool. If you are used to this from other libraries such as viem you shouldn't have a difficult time however.

**Example**

```typescript
import {createContractFromAbi} from 'evmts'
const myAbi = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    args: [{
		  constant: true,
		  inputs: [{ name: 'owner', type: 'address' }],
		  name: 'balanceOf',
		  outputs: [{ name: '', type: 'uint256' }],
		  payable: false,
		  stateMutability: 'view',
		  type: 'function',
    }]
  }
// !! Don't forget the as const!
] as const

// Since contract imports are capitalized it is
// best practice to capitalize contracts from abis
// but not required
const MyContractFromAbi = createContractFromAbi({
  name: 'MyContractFromAbi',
  abi: myAbi,
  // optionally include bytecode
  bytecode: '0x....'
})

// now use your contract as normal
const readBalanceAction = ERC20.read.balanceOf.call('0x121212121212121212121212')
```

