[tevm](../README.md) / [Modules](../modules.md) / decorators

# Module: decorators

## Table of contents

### Type Aliases

- [EthActionsApi](decorators.md#ethactionsapi)
- [TevmActionsApi](decorators.md#tevmactionsapi)

### Functions

- [callAction](decorators.md#callaction)
- [contractAction](decorators.md#contractaction)
- [dumpStateAction](decorators.md#dumpstateaction)
- [ethActions](decorators.md#ethactions)
- [getAccountAction](decorators.md#getaccountaction)
- [loadStateAction](decorators.md#loadstateaction)
- [request](decorators.md#request)
- [requestActions](decorators.md#requestactions)
- [requestBulk](decorators.md#requestbulk)
- [scriptAction](decorators.md#scriptaction)
- [setAccountAction](decorators.md#setaccountaction)
- [tevmActions](decorators.md#tevmactions)

## Type Aliases

### EthActionsApi

Ƭ **EthActionsApi**: `Object`

Standard JSON-RPC methods for interacting with the VM

**`See`**

[JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/)

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `eth` | \{ `blockNumber`: [`EthBlockNumberHandler`](actions_types.md#ethblocknumberhandler) ; `call`: [`EthCallHandler`](actions_types.md#ethcallhandler) ; `chainId`: [`EthChainIdHandler`](actions_types.md#ethchainidhandler) ; `gasPrice`: [`EthGasPriceHandler`](actions_types.md#ethgaspricehandler) ; `getBalance`: [`EthGetBalanceHandler`](actions_types.md#ethgetbalancehandler) ; `getCode`: [`EthGetCodeHandler`](actions_types.md#ethgetcodehandler) ; `getStorageAt`: [`EthGetStorageAtHandler`](actions_types.md#ethgetstorageathandler)  } | Standard JSON-RPC methods for interacting with the VM **`See`** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) |
| `eth.blockNumber` | [`EthBlockNumberHandler`](actions_types.md#ethblocknumberhandler) | Returns the current block number Set the `tag` to a block number or block hash to get the balance at that block Block tag defaults to 'pending' tag which is the optimistic state of the VM **`See`** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) **`Example`** ```ts const blockNumber = await tevm.eth.blockNumber() console.log(blockNumber) // 0n ``` |
| `eth.call` | [`EthCallHandler`](actions_types.md#ethcallhandler) | Executes a call without modifying the state Set the `tag` to a block number or block hash to get the balance at that block Block tag defaults to 'pending' tag which is the optimistic state of the VM **`See`** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) **`Example`** ```ts const res = await tevm.eth.call({to: '0x123...', data: '0x123...'}) console.log(res) // "0x..." ``` |
| `eth.chainId` | [`EthChainIdHandler`](actions_types.md#ethchainidhandler) | Returns the current chain id Set the `tag` to a block number or block hash to get the balance at that block Block tag defaults to 'pending' tag which is the optimistic state of the VM **`See`** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) **`Example`** ```ts const chainId = await tevm.eth.chainId() console.log(chainId) // 10n ``` |
| `eth.gasPrice` | [`EthGasPriceHandler`](actions_types.md#ethgaspricehandler) | Returns the current gas price Set the `tag` to a block number or block hash to get the balance at that block Block tag defaults to 'pending' tag which is the optimistic state of the VM **`See`** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) **`Example`** ```ts const gasPrice = await tevm.eth.gasPrice() console.log(gasPrice) // 0n ``` |
| `eth.getBalance` | [`EthGetBalanceHandler`](actions_types.md#ethgetbalancehandler) | Returns the balance of a given address Set the `tag` to a block number or block hash to get the balance at that block Block tag defaults to 'pending' tag which is the optimistic state of the VM **`See`** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) **`Example`** ```ts const balance = await tevm.eth.getBalance({address: '0x123...', tag: 'pending'}) console.log(gasPrice) // 0n ``` |
| `eth.getCode` | [`EthGetCodeHandler`](actions_types.md#ethgetcodehandler) | Returns code at a given address Set the `tag` to a block number or block hash to get the balance at that block Block tag defaults to 'pending' tag which is the optimistic state of the VM **`See`** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) **`Example`** ```ts const code = await tevm.eth.getCode({address: '0x123...'}) ``` |
| `eth.getStorageAt` | [`EthGetStorageAtHandler`](actions_types.md#ethgetstorageathandler) | Returns storage at a given address and slot Set the `tag` to a block number or block hash to get the balance at that block Block tag defaults to 'pending' tag which is the optimistic state of the VM **`See`** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) **`Example`** ```ts const storageValue = await tevm.eth.getStorageAt({address: '0x123...', position: 0}) ``` |

#### Defined in

evmts-monorepo/packages/decorators/types/EthActionsApi.d.ts:6

___

### TevmActionsApi

Ƭ **TevmActionsApi**: `Object`

The actions api is the high level API for interacting with a Tevm client similar to [viem actions](https://viem.sh/learn/actions/)

**`See`**

[https://tevm.sh/learn/actions/](https://tevm.sh/learn/actions/)

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `call` | [`CallHandler`](actions_types.md#callhandler) | Executes a call against the VM. It is similar to `eth_call` but has more options for controlling the execution environment By default it does not modify the state after the call is complete but this can be configured. **`Example`** ```ts const res = tevm.call({ to: '0x123...', data: '0x123...', from: '0x123...', gas: 1000000, gasPrice: 1n, skipBalance: true, } ``` |
| `contract` | [`ContractHandler`](actions_types.md#contracthandler) | Executes a contract call against the VM. It is similar to `eth_call` but has more options for controlling the execution environment along with a typesafe API for creating the call via the contract abi. The contract must already be deployed. Otherwise see `script` which executes calls against undeployed contracts **`Example`** ```ts const res = await tevm.contract({ to: '0x123...', abi: [...], function: 'run', args: ['world'] from: '0x123...', gas: 1000000, gasPrice: 1n, skipBalance: true, } console.log(res.data) // "hello" ``` |
| `dumpState` | [`DumpStateHandler`](actions_types.md#dumpstatehandler) | Dumps the current state of the VM into a JSON-seralizable object State can be dumped as follows **`Example`** ```typescript const {state} = await tevm.dumpState() fs.writeFileSync('state.json', JSON.stringify(state)) ``` And then loaded as follows **`Example`** ```typescript const state = JSON.parse(fs.readFileSync('state.json')) await tevm.loadState({state}) ``` |
| `getAccount` | [`GetAccountHandler`](actions_types.md#getaccounthandler) | Gets the state of a specific ethereum address **`Example`** ```ts const res = tevm.getAccount({address: '0x123...'}) console.log(res.deployedBytecode) console.log(res.nonce) console.log(res.balance) ``` |
| `loadState` | [`LoadStateHandler`](actions_types.md#loadstatehandler) | Loads a previously dumped state into the VM State can be dumped as follows **`Example`** ```typescript const {state} = await tevm.dumpState() fs.writeFileSync('state.json', JSON.stringify(state)) ``` And then loaded as follows **`Example`** ```typescript const state = JSON.parse(fs.readFileSync('state.json')) await tevm.loadState({state}) ``` |
| `script` | [`ScriptHandler`](actions_types.md#scripthandler) | Executes scripts against the Tevm EVM. By default the script is sandboxed and the state is reset after each execution unless the `persist` option is set to true. **`Example`** ```typescript const res = tevm.script({ deployedBytecode: '0x6080604...', abi: [...], function: 'run', args: ['hello world'] }) ``` Contract handlers provide a more ergonomic way to execute scripts **`Example`** ```typescript ipmort {MyScript} from './MyScript.s.sol' const res = tevm.script( MyScript.read.run('hello world') ) ``` |
| `setAccount` | [`SetAccountHandler`](actions_types.md#setaccounthandler) | Sets the state of a specific ethereum address **`Example`** ```ts import {parseEther} from 'tevm' await tevm.setAccount({ address: '0x123...', deployedBytecode: '0x6080604...', balance: parseEther('1.0') }) ``` |

#### Defined in

evmts-monorepo/packages/decorators/types/TevmActionsApi.d.ts:6

## Functions

### callAction

▸ **callAction**(): `Extension`

#### Returns

`Extension`

#### Defined in

evmts-monorepo/packages/decorators/types/tevmActions.d.ts:4

___

### contractAction

▸ **contractAction**(): `Extension`

#### Returns

`Extension`

#### Defined in

evmts-monorepo/packages/decorators/types/tevmActions.d.ts:5

___

### dumpStateAction

▸ **dumpStateAction**(): `Extension`

#### Returns

`Extension`

#### Defined in

evmts-monorepo/packages/decorators/types/tevmActions.d.ts:6

___

### ethActions

▸ **ethActions**(): `Extension`

#### Returns

`Extension`

#### Defined in

evmts-monorepo/packages/decorators/types/ethActions.d.ts:1

___

### getAccountAction

▸ **getAccountAction**(): `Extension`

#### Returns

`Extension`

#### Defined in

evmts-monorepo/packages/decorators/types/tevmActions.d.ts:2

___

### loadStateAction

▸ **loadStateAction**(): `Extension`

#### Returns

`Extension`

#### Defined in

evmts-monorepo/packages/decorators/types/tevmActions.d.ts:7

___

### request

▸ **request**(): `Extension`

#### Returns

`Extension`

#### Defined in

evmts-monorepo/packages/decorators/types/requestActions.d.ts:1

___

### requestActions

▸ **requestActions**(): `Extension`

#### Returns

`Extension`

#### Defined in

evmts-monorepo/packages/decorators/types/requestActions.d.ts:3

___

### requestBulk

▸ **requestBulk**(): `Extension`

#### Returns

`Extension`

#### Defined in

evmts-monorepo/packages/decorators/types/requestActions.d.ts:2

___

### scriptAction

▸ **scriptAction**(): `Extension`

#### Returns

`Extension`

#### Defined in

evmts-monorepo/packages/decorators/types/tevmActions.d.ts:1

___

### setAccountAction

▸ **setAccountAction**(): `Extension`

#### Returns

`Extension`

#### Defined in

evmts-monorepo/packages/decorators/types/tevmActions.d.ts:3

___

### tevmActions

▸ **tevmActions**(): `Extension`

#### Returns

`Extension`

#### Defined in

evmts-monorepo/packages/decorators/types/tevmActions.d.ts:8
