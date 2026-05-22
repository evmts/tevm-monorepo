[**@tevm/decorators**](../README.md)

***

[@tevm/decorators](../globals.md) / TevmActionsApi

# Type Alias: TevmActionsApi

> **TevmActionsApi** = `object`

Defined in: [actions/TevmActionsApi.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/actions/TevmActionsApi.ts#L17)

The actions api is the high level API for interacting with a Tevm client similar to [viem actions](https://viem.sh/learn/actions/)

## See

[https://tevm.sh/learn/actions/](https://tevm.sh/learn/actions/)

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="call"></a> `call` | `CallHandler` | Executes a call against the VM. It is similar to `eth_call` but has more options for controlling the execution environment By default it does not modify the state after the call is complete but this can be configured. **Example** `const res = tevm.call({ to: '0x123...', data: '0x123...', from: '0x123...', gas: 1000000, gasPrice: 1n, skipBalance: true, }` | [actions/TevmActionsApi.ts:56](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/actions/TevmActionsApi.ts#L56) |
| <a id="contract"></a> `contract` | `ContractHandler` | Executes a contract call against the VM. It is similar to `eth_call` but has more options for controlling the execution environment along with a typesafe API for creating the call via the contract abi. The contract must already be deployed. Otherwise see `script` which executes calls against undeployed contracts **Example** `const res = await tevm.contract({ to: '0x123...', abi: [...], function: 'run', args: ['world'] from: '0x123...', gas: 1000000, gasPrice: 1n, skipBalance: true, } console.log(res.data) // "hello"` | [actions/TevmActionsApi.ts:78](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/actions/TevmActionsApi.ts#L78) |
| <a id="deal"></a> `deal` | `AnvilDealHandler` | Deals ERC20 tokens to an account by overriding the storage of balanceOf(account) **Example** `await tevm.deal({ erc20: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // Optional: USDC address account: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', amount: 1000000n // 1 USDC (6 decimals) })` | [actions/TevmActionsApi.ts:134](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/actions/TevmActionsApi.ts#L134) |
| <a id="deploy"></a> `deploy` | `DeployHandler` | Creates a transaction to deploys a contract to tevm | [actions/TevmActionsApi.ts:122](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/actions/TevmActionsApi.ts#L122) |
| <a id="dumpstate"></a> `dumpState` | `DumpStateHandler` | Dumps the current state of the VM into a JSON-seralizable object State can be dumped as follows **Examples** `const {state} = await tevm.dumpState() fs.writeFileSync('state.json', JSON.stringify(state))` And then loaded as follows `const state = JSON.parse(fs.readFileSync('state.json')) await tevm.loadState({state})` | [actions/TevmActionsApi.ts:96](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/actions/TevmActionsApi.ts#L96) |
| <a id="getaccount"></a> `getAccount` | `GetAccountHandler` | Gets the state of a specific ethereum address **Example** `const res = tevm.getAccount({address: '0x123...'}) console.log(res.deployedBytecode) console.log(res.nonce) console.log(res.balance)` | [actions/TevmActionsApi.ts:39](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/actions/TevmActionsApi.ts#L39) |
| <a id="loadstate"></a> `loadState` | `LoadStateHandler` | Loads a previously dumped state into the VM State can be dumped as follows **Examples** `const {state} = await tevm.dumpState() fs.writeFileSync('state.json', JSON.stringify(state))` And then loaded as follows `const state = JSON.parse(fs.readFileSync('state.json')) await tevm.loadState({state})` | [actions/TevmActionsApi.ts:114](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/actions/TevmActionsApi.ts#L114) |
| <a id="mine"></a> `mine` | `MineHandler` | Mines 1 or more blocks | [actions/TevmActionsApi.ts:118](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/actions/TevmActionsApi.ts#L118) |
| <a id="setaccount"></a> `setAccount` | `SetAccountHandler` | Sets the state of a specific ethereum address **Example** `import {parseEther} from 'tevm' await tevm.setAccount({ address: '0x123...', deployedBytecode: '0x6080604...', balance: parseEther('1.0') })` | [actions/TevmActionsApi.ts:30](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/actions/TevmActionsApi.ts#L30) |
