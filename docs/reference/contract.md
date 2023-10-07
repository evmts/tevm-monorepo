# Contract

Contracts are the core api primitive of EVMts. They can be built from an ABI or imported directly from solidity using EVMts build tooling.

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
