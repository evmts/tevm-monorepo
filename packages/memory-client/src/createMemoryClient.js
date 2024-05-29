import { createBaseClient } from '@tevm/base-client'
import { tevmDefault } from '@tevm/common'
import { eip1993EventEmitter, requestEip1193, tevmActions, tevmSend } from '@tevm/decorators'
import { createClient, createTransport, publicActions, testActions } from 'viem'

// TODO strongly type this! Currently it's return type is inferred

/**
* A local EVM instance running in JavaScript. Similar to Anvil 
* It wraps the viem [public client](https://viem.sh/docs/clients/public#public-client) and [test client](https://viem.sh/docs/clients/test)
* It also supports powerful [tevm actions](https://tevm.sh/learn/actions/) prefixed with `tevm`
* _tevm has the internal api for low level control of the EVM
* @param {import('@tevm/base-client').BaseClientOptions} [options]
* @returns {import('./MemoryClient.js').MemoryClient}
* @example
* ```ts
* import { createMemoryClient } from "tevm"
* import { MyERC721 } from './MyERC721.sol'
*
* const tevm = createMemoryClient({
* 	fork: {
* 	  transport: http("https://mainnet.optimism.io")({}),
* 	},
* })
*
* const address = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',

* await tevm.runContractCall(
*   MyERC721.write.mint({
*     caller: address,
*   }),
* )
*
* const balance = await tevm.runContractCall(
*  MyERC721.read.balanceOf({
*  caller: address,
*  }),
*  )
*  console.log(balance) // 1n
*  ```
*  @see {@link https://tevm.sh/learn/client/} for more information on the `tevm` clients
*  @see {@link https://tevm.sh/learn/actions/} for more information on the `tevm` actions
*/
export const createMemoryClient = (options) => {
const tevm = createBaseClient(options)
.extend(tevmSend())
.extend(eip1993EventEmitter())
.extend(requestEip1193())
.extend(tevmActions())
return createClient({
type: 'tevm',
.../** @type any*/ (options?.common !== undefined ? { chain: options.common } : { chain: tevmDefault }),
transport: () =>
createTransport({
request: /** @type any*/ (tevm.request),
type: 'tevm',
name: /**options?.name ??*/ 'Tevm transport',
key: /*options?.key ??*/ 'tevm',
timeout: /*options?.timeout ?? */ 20_000,
retryCount: /*options?.retryCount ??*/ 3,
retryDelay: /* options?.retryDelay ?? */ 150,
}),
})
.extend(testActions({ mode: 'anvil' }))
.extend(publicActions)
.extend(() => {
return {
_tevm: tevm,
tevmReady: tevm.ready,
tevmCall: tevm.call,
tevmContract: tevm.contract,
tevmScript: tevm.script,
tevmDeploy: tevm.deploy,
tevmMine: tevm.mine,
tevmLoadState: tevm.loadState,
tevmDumpState: tevm.dumpState,
tevmSetAccount: tevm.setAccount,
tevmGetAccount: tevm.getAccount,
...(tevm.forkTransport !== undefined ? { forkTransport: tevm.forkTransport } : {}),
}
})
}
