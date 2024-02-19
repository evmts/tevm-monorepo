[@tevm/decorators](README.md) / Exports

# @tevm/decorators

## Table of contents

### Type Aliases

- [EthActionsApi](modules.md#ethactionsapi)
- [TevmActionsApi](modules.md#tevmactionsapi)

### Functions

- [callAction](modules.md#callaction)
- [contractAction](modules.md#contractaction)
- [dumpStateAction](modules.md#dumpstateaction)
- [ethActions](modules.md#ethactions)
- [getAccountAction](modules.md#getaccountaction)
- [loadStateAction](modules.md#loadstateaction)
- [request](modules.md#request)
- [requestActions](modules.md#requestactions)
- [requestBulk](modules.md#requestbulk)
- [scriptAction](modules.md#scriptaction)
- [setAccountAction](modules.md#setaccountaction)
- [tevmActions](modules.md#tevmactions)

## Type Aliases

### EthActionsApi

Ƭ **EthActionsApi**: `Object`

Standard JSON-RPC methods for interacting with the VM

**`See`**

[JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/)

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `eth` | \{ `blockNumber`: `EthBlockNumberHandler` ; `call`: `EthCallHandler` ; `chainId`: `EthChainIdHandler` ; `gasPrice`: `EthGasPriceHandler` ; `getBalance`: `EthGetBalanceHandler` ; `getCode`: `EthGetCodeHandler` ; `getStorageAt`: `EthGetStorageAtHandler`  } | Standard JSON-RPC methods for interacting with the VM **`See`** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) |
| `eth.blockNumber` | `EthBlockNumberHandler` | Returns the current block number Set the `tag` to a block number or block hash to get the balance at that block Block tag defaults to 'pending' tag which is the optimistic state of the VM **`See`** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) **`Example`** ```ts const blockNumber = await tevm.eth.blockNumber() console.log(blockNumber) // 0n ``` |
| `eth.call` | `EthCallHandler` | Executes a call without modifying the state Set the `tag` to a block number or block hash to get the balance at that block Block tag defaults to 'pending' tag which is the optimistic state of the VM **`See`** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) **`Example`** ```ts const res = await tevm.eth.call({to: '0x123...', data: '0x123...'}) console.log(res) // "0x..." ``` |
| `eth.chainId` | `EthChainIdHandler` | Returns the current chain id Set the `tag` to a block number or block hash to get the balance at that block Block tag defaults to 'pending' tag which is the optimistic state of the VM **`See`** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) **`Example`** ```ts const chainId = await tevm.eth.chainId() console.log(chainId) // 10n ``` |
| `eth.gasPrice` | `EthGasPriceHandler` | Returns the current gas price Set the `tag` to a block number or block hash to get the balance at that block Block tag defaults to 'pending' tag which is the optimistic state of the VM **`See`** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) **`Example`** ```ts const gasPrice = await tevm.eth.gasPrice() console.log(gasPrice) // 0n ``` |
| `eth.getBalance` | `EthGetBalanceHandler` | Returns the balance of a given address Set the `tag` to a block number or block hash to get the balance at that block Block tag defaults to 'pending' tag which is the optimistic state of the VM **`See`** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) **`Example`** ```ts const balance = await tevm.eth.getBalance({address: '0x123...', tag: 'pending'}) console.log(gasPrice) // 0n ``` |
| `eth.getCode` | `EthGetCodeHandler` | Returns code at a given address Set the `tag` to a block number or block hash to get the balance at that block Block tag defaults to 'pending' tag which is the optimistic state of the VM **`See`** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) **`Example`** ```ts const code = await tevm.eth.getCode({address: '0x123...'}) ``` |
| `eth.getStorageAt` | `EthGetStorageAtHandler` | Returns storage at a given address and slot Set the `tag` to a block number or block hash to get the balance at that block Block tag defaults to 'pending' tag which is the optimistic state of the VM **`See`** [JSON-RPC](https://ethereum.github.io/execution-apis/api-documentation/) **`Example`** ```ts const storageValue = await tevm.eth.getStorageAt({address: '0x123...', position: 0}) ``` |

#### Defined in

[EthActionsApi.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/EthActionsApi.ts#L15)

___

### TevmActionsApi

Ƭ **TevmActionsApi**: `Object`

The actions api is the high level API for interacting with a Tevm client similar to [viem actions](https://viem.sh/learn/actions/)

**`See`**

[https://tevm.sh/learn/actions/](https://tevm.sh/learn/actions/)

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `call` | `CallHandler` | Executes a call against the VM. It is similar to `eth_call` but has more options for controlling the execution environment By default it does not modify the state after the call is complete but this can be configured. **`Example`** ```ts const res = tevm.call({ to: '0x123...', data: '0x123...', from: '0x123...', gas: 1000000, gasPrice: 1n, skipBalance: true, } ``` |
| `contract` | `ContractHandler` | Executes a contract call against the VM. It is similar to `eth_call` but has more options for controlling the execution environment along with a typesafe API for creating the call via the contract abi. The contract must already be deployed. Otherwise see `script` which executes calls against undeployed contracts **`Example`** ```ts const res = await tevm.contract({ to: '0x123...', abi: [...], function: 'run', args: ['world'] from: '0x123...', gas: 1000000, gasPrice: 1n, skipBalance: true, } console.log(res.data) // "hello" ``` |
| `dumpState` | `DumpStateHandler` | Dumps the current state of the VM into a JSON-seralizable object State can be dumped as follows **`Example`** ```typescript const {state} = await tevm.dumpState() fs.writeFileSync('state.json', JSON.stringify(state)) ``` And then loaded as follows **`Example`** ```typescript const state = JSON.parse(fs.readFileSync('state.json')) await tevm.loadState({state}) ``` |
| `getAccount` | `GetAccountHandler` | Gets the state of a specific ethereum address **`Example`** ```ts const res = tevm.getAccount({address: '0x123...'}) console.log(res.deployedBytecode) console.log(res.nonce) console.log(res.balance) ``` |
| `loadState` | `LoadStateHandler` | Loads a previously dumped state into the VM State can be dumped as follows **`Example`** ```typescript const {state} = await tevm.dumpState() fs.writeFileSync('state.json', JSON.stringify(state)) ``` And then loaded as follows **`Example`** ```typescript const state = JSON.parse(fs.readFileSync('state.json')) await tevm.loadState({state}) ``` |
| `script` | `ScriptHandler` | Executes scripts against the Tevm EVM. By default the script is sandboxed and the state is reset after each execution unless the `persist` option is set to true. **`Example`** ```typescript const res = tevm.script({ deployedBytecode: '0x6080604...', abi: [...], function: 'run', args: ['hello world'] }) ``` Contract handlers provide a more ergonomic way to execute scripts **`Example`** ```typescript ipmort {MyScript} from './MyScript.s.sol' const res = tevm.script( MyScript.read.run('hello world') ) ``` |
| `setAccount` | `SetAccountHandler` | Sets the state of a specific ethereum address **`Example`** ```ts import {parseEther} from 'tevm' await tevm.setAccount({ address: '0x123...', deployedBytecode: '0x6080604...', balance: parseEther('1.0') }) ``` |

#### Defined in

[TevmActionsApi.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/TevmActionsApi.ts#L15)

## Functions

### callAction

▸ **callAction**(): `Extension`\<`Pick`\<[`TevmActionsApi`](modules.md#tevmactionsapi), ``"call"``\>\>

#### Returns

`Extension`\<`Pick`\<[`TevmActionsApi`](modules.md#tevmactionsapi), ``"call"``\>\>

#### Defined in

[tevmActions.js:38](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/tevmActions.js#L38)

___

### contractAction

▸ **contractAction**(): `Extension`\<`Pick`\<[`TevmActionsApi`](modules.md#tevmactionsapi), ``"contract"``\>\>

#### Returns

`Extension`\<`Pick`\<[`TevmActionsApi`](modules.md#tevmactionsapi), ``"contract"``\>\>

#### Defined in

[tevmActions.js:46](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/tevmActions.js#L46)

___

### dumpStateAction

▸ **dumpStateAction**(): `Extension`\<`Pick`\<[`TevmActionsApi`](modules.md#tevmactionsapi), ``"dumpState"``\>\>

#### Returns

`Extension`\<`Pick`\<[`TevmActionsApi`](modules.md#tevmactionsapi), ``"dumpState"``\>\>

#### Defined in

[tevmActions.js:54](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/tevmActions.js#L54)

___

### ethActions

▸ **ethActions**(): `Extension`\<[`EthActionsApi`](modules.md#ethactionsapi)\>

#### Returns

`Extension`\<[`EthActionsApi`](modules.md#ethactionsapi)\>

#### Defined in

[ethActions.js:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/ethActions.js#L14)

___

### getAccountAction

▸ **getAccountAction**(): `Extension`\<`Pick`\<[`TevmActionsApi`](modules.md#tevmactionsapi), ``"getAccount"``\>\>

#### Returns

`Extension`\<`Pick`\<[`TevmActionsApi`](modules.md#tevmactionsapi), ``"getAccount"``\>\>

#### Defined in

[tevmActions.js:22](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/tevmActions.js#L22)

___

### loadStateAction

▸ **loadStateAction**(): `Extension`\<`Pick`\<[`TevmActionsApi`](modules.md#tevmactionsapi), ``"loadState"``\>\>

#### Returns

`Extension`\<`Pick`\<[`TevmActionsApi`](modules.md#tevmactionsapi), ``"loadState"``\>\>

#### Defined in

[tevmActions.js:62](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/tevmActions.js#L62)

___

### request

▸ **request**(): `Extension`\<`Pick`\<`TevmClient`, ``"request"``\>\>

#### Returns

`Extension`\<`Pick`\<`TevmClient`, ``"request"``\>\>

#### Defined in

[requestActions.js:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/requestActions.js#L6)

___

### requestActions

▸ **requestActions**(): `Extension`\<`Pick`\<`TevmClient`, ``"request"`` \| ``"requestBulk"``\>\>

#### Returns

`Extension`\<`Pick`\<`TevmClient`, ``"request"`` \| ``"requestBulk"``\>\>

#### Defined in

[requestActions.js:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/requestActions.js#L24)

___

### requestBulk

▸ **requestBulk**(): `Extension`\<`Pick`\<`TevmClient`, ``"requestBulk"``\>\>

#### Returns

`Extension`\<`Pick`\<`TevmClient`, ``"requestBulk"``\>\>

#### Defined in

[requestActions.js:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/requestActions.js#L15)

___

### scriptAction

▸ **scriptAction**(): `Extension`\<`Pick`\<[`TevmActionsApi`](modules.md#tevmactionsapi), ``"script"``\>\>

#### Returns

`Extension`\<`Pick`\<[`TevmActionsApi`](modules.md#tevmactionsapi), ``"script"``\>\>

#### Defined in

[tevmActions.js:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/tevmActions.js#L14)

___

### setAccountAction

▸ **setAccountAction**(): `Extension`\<`Pick`\<[`TevmActionsApi`](modules.md#tevmactionsapi), ``"setAccount"``\>\>

#### Returns

`Extension`\<`Pick`\<[`TevmActionsApi`](modules.md#tevmactionsapi), ``"setAccount"``\>\>

#### Defined in

[tevmActions.js:30](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/tevmActions.js#L30)

___

### tevmActions

▸ **tevmActions**(): `Extension`\<[`TevmActionsApi`](modules.md#tevmactionsapi)\>

#### Returns

`Extension`\<[`TevmActionsApi`](modules.md#tevmactionsapi)\>

#### Defined in

[tevmActions.js:71](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/tevmActions.js#L71)
