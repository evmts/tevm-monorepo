[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / CallResult

# Type Alias: CallResult\<ErrorType\>

> **CallResult**\<`ErrorType`\> = `object`

Defined in: [packages/actions/src/Call/CallResult.ts:31](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallResult.ts#L31)

Result of a TEVM VM Call method.

## Example

```typescript
import { createClient } from 'viem'
import { createTevmTransport, tevmCall } from 'tevm'
import { optimism } from 'tevm/common'
import { CallResult } from 'tevm/actions'

const client = createClient({
  transport: createTevmTransport({}),
  chain: optimism,
})

const callParams = {
  data: '0x...',
  bytecode: '0x...',
  gasLimit: 420n,
}

const result: CallResult = await tevmCall(client, callParams)
console.log(result)
```

## See

[tevmCall](https://tevm.sh/reference/tevm/memory-client/functions/tevmCall/)

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `ErrorType` | [`TevmCallError`](TevmCallError.md) |

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="accesslist"></a> `accessList?` | `Record`\<[`Address`](Address.md), `Set`\<[`Hex`](Hex.md)\>\> | The access list if enabled on call. Mapping of addresses to storage slots. **Example** `const accessList = result.accessList console.log(accessList) // { "0x...": Set(["0x..."]) }` | [packages/actions/src/Call/CallResult.ts:52](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallResult.ts#L52) |
| <a id="amountspent"></a> `amountSpent?` | `bigint` | The amount of ether used by this transaction. Does not include L1 fees. | [packages/actions/src/Call/CallResult.ts:186](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallResult.ts#L186) |
| <a id="basefee"></a> `baseFee?` | `bigint` | The base fee of the transaction. | [packages/actions/src/Call/CallResult.ts:148](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallResult.ts#L148) |
| <a id="blobgasused"></a> `blobGasUsed?` | `bigint` | Amount of blob gas consumed by the transaction. | [packages/actions/src/Call/CallResult.ts:113](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallResult.ts#L113) |
| <a id="createdaddress"></a> `createdAddress?` | [`Address`](Address.md) | Address of created account during the transaction, if any. | [packages/actions/src/Call/CallResult.ts:117](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallResult.ts#L117) |
| <a id="createdaddresses"></a> `createdAddresses?` | `Set`\<[`Address`](Address.md)\> | Map of addresses which were created (used in EIP 6780). Note the addresses are not actually created until the transaction is mined. | [packages/actions/src/Call/CallResult.ts:126](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallResult.ts#L126) |
| <a id="errors"></a> `errors?` | `ErrorType`[] | Description of the exception, if any occurred. | [packages/actions/src/Call/CallResult.ts:140](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallResult.ts#L140) |
| <a id="executiongasused"></a> `executionGasUsed` | `bigint` | Amount of gas the code used to run within the EVM. This only includes gas spent on the EVM execution itself and doesn't account for gas spent on other factors such as data storage. | [packages/actions/src/Call/CallResult.ts:95](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallResult.ts#L95) |
| <a id="gas"></a> `gas?` | `bigint` | Amount of gas left after execution. | [packages/actions/src/Call/CallResult.ts:90](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallResult.ts#L90) |
| <a id="gasrefund"></a> `gasRefund?` | `bigint` | The gas refund counter as a uint256. | [packages/actions/src/Call/CallResult.ts:109](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallResult.ts#L109) |
| <a id="l1basefee"></a> `l1BaseFee?` | `bigint` | Latest known L1 base fee known by the L2 chain. Only included when an OP-Stack common is provided. **See** [OP-Stack docs](https://docs.optimism.io/stack/transactions/fees) | [packages/actions/src/Call/CallResult.ts:175](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallResult.ts#L175) |
| <a id="l1blobfee"></a> `l1BlobFee?` | `bigint` | Current blob base fee known by the L2 chain. **See** [OP-Stack docs](https://docs.optimism.io/stack/transactions/fees) | [packages/actions/src/Call/CallResult.ts:168](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallResult.ts#L168) |
| <a id="l1fee"></a> `l1Fee?` | `bigint` | L1 fee that should be paid for the transaction. Only included when an OP-Stack common is provided. **See** [OP-Stack docs](https://docs.optimism.io/stack/transactions/fees) | [packages/actions/src/Call/CallResult.ts:155](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallResult.ts#L155) |
| <a id="l1gasused"></a> `l1GasUsed?` | `bigint` | Amount of L1 gas used to publish the transaction. Only included when an OP-Stack common is provided. **See** [OP-Stack docs](https://docs.optimism.io/stack/transactions/fees) | [packages/actions/src/Call/CallResult.ts:162](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallResult.ts#L162) |
| <a id="logs"></a> `logs?` | [`Log`](Log.md)[] | Array of logs that the contract emitted. **Example** `const logs = result.logs logs?.forEach(log => console.log(log))` | [packages/actions/src/Call/CallResult.ts:105](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallResult.ts#L105) |
| <a id="minervalue"></a> `minerValue?` | `bigint` | The value that accrues to the miner by this transaction. | [packages/actions/src/Call/CallResult.ts:190](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallResult.ts#L190) |
| <a id="preimages"></a> `preimages?` | `Record`\<[`Hex`](Hex.md), [`Hex`](Hex.md)\> | Preimages mapping of the touched accounts from the transaction (see `reportPreimages` option). | [packages/actions/src/Call/CallResult.ts:56](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallResult.ts#L56) |
| <a id="priorityfee"></a> `priorityFee?` | `bigint` | Priority fee set by the transaction. | [packages/actions/src/Call/CallResult.ts:144](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallResult.ts#L144) |
| <a id="rawdata"></a> `rawData` | [`Hex`](Hex.md) | Encoded return value from the contract as a hex string. **Example** `const rawData = result.rawData console.log(`Raw data returned: ${rawData}`)` | [packages/actions/src/Call/CallResult.ts:136](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallResult.ts#L136) |
| <a id="selfdestruct"></a> `selfdestruct?` | `Set`\<[`Address`](Address.md)\> | A set of accounts to selfdestruct. | [packages/actions/src/Call/CallResult.ts:121](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallResult.ts#L121) |
| <a id="status"></a> `status?` | [`Hex`](Hex.md) | The transaction receipt status when the call was included in the chain. Will be '0x1' for success or '0x0' for failure. Only present when the call creates a transaction (createTransaction option is enabled). **Example** `const status = result.status if (status === '0x1') { console.log('Transaction succeeded') } else if (status === '0x0') { console.log('Transaction failed') }` | [packages/actions/src/Call/CallResult.ts:86](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallResult.ts#L86) |
| <a id="totalgasspent"></a> `totalGasSpent?` | `bigint` | The amount of gas used in this transaction, which is paid for. This contains the gas units that have been used on execution, plus the upfront cost, which consists of calldata cost, intrinsic cost, and optionally the access list costs. This is analogous to what `eth_estimateGas` would return. Does not include L1 fees. | [packages/actions/src/Call/CallResult.ts:182](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallResult.ts#L182) |
| <a id="trace"></a> `trace?` | [`TraceResult`](TraceResult.md) | The call trace if tracing is enabled on call. **Example** `const trace = result.trace trace.structLogs.forEach(console.log)` | [packages/actions/src/Call/CallResult.ts:41](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallResult.ts#L41) |
| <a id="txhash"></a> `txHash?` | [`Hex`](Hex.md) | The returned transaction hash if the call was included in the chain. Will not be defined if the call was not included in the chain. Whether a call is included in the chain depends on the `createTransaction` option and the result of the call. **Example** `const txHash = result.txHash if (txHash) { console.log(`Transaction included in the chain with hash: ${txHash}`) }` | [packages/actions/src/Call/CallResult.ts:70](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallResult.ts#L70) |
