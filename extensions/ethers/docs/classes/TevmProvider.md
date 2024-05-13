**@tevm/ethers** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > TevmProvider

# Class: TevmProvider

An [ethers JsonRpcApiProvider](https://docs.ethers.org/v6/api/providers/jsonrpc/#JsonRpcApiProvider) using a tevm MemoryClient as it's backend

## TevmProvider

The TevmProvider class is an instance of an ethers provider using Tevm as it's backend. The `createMemoryProvider` method can be used to create an in memory instance of tevm using a [memoryClient](../clients/) as it's backend.

## Example

```typescript
import {TevmProvider} from '@tevm/ethers'

const provider = await TevmProvider.createMemoryProvider({
  fork: {
    url: 'https://mainnet.optimism.io',
  },
})
```

## Using with an http client

The constructor takes any instance of tevm including the `httpClient`.

## Example

```typescript
import {createHttpClient} from '@tevm/http-client'
const provider = new TevmProvider(createHttpClient({url: 'https://localhost:8080'}))
```

## Ethers provider support

You can use all the normal ethers apis to interact with tevm.

## Example

```typescript
const provider = await TevmProvider.createMemoryProvider({
  fork: {
    url: 'https://mainnet.optimism.io',
  },
})

console.log(
  await provider.getBlockNumber()
) // 10
```

## Tevm actions support

The entire [tevm api](../clients/) exists on the `tevm` property. For example the `tevm.script` method can be used to run an arbitrary script.

## Example

```typescript
import {TevmProvider} from '@tevm/ethers'
import {createScript} from 'tevm'

const provider = await TevmProvider.createMemoryProvider({
  fork: {
    url: 'https://mainnet.optimism.io',
  },
})

const addContract = createScript({
  name: 'AddContract',
  humanReadableAbi: [
    'function add(uint256 a, uint256 b) public pure returns (uint256)',
  ],
  deployedBytecode: '0x608060405234801561000f575f80fd5b5060043610610029575f3560e01c8063771602f71461002d575b5f80fd5b610047600480360381019061004291906100a9565b61005d565b60405161005491906100f6565b60405180910390f35b5f818361006a919061013c565b905092915050565b5f80fd5b5f819050919050565b61008881610076565b8114610092575f80fd5b50565b5f813590506100a38161007f565b92915050565b5f80604083850312156100bf576100be610072565b5b5f6100cc85828601610095565b92505060206100dd85828601610095565b9150509250929050565b6100f081610076565b82525050565b5f6020820190506101095f8301846100e7565b92915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f61014682610076565b915061015183610076565b92508282019050808211156101695761016861010f565b5b9291505056fea2646970667358221220a8f4b7187c62760aefc097c1827799c61a6df322acc9d7575862a525f9aa59a364736f6c63430008170033',
  bytecode: '0x608060405234801561000f575f80fd5b506101a58061001d5f395ff3fe608060405234801561000f575f80fd5b5060043610610029575f3560e01c8063771602f71461002d575b5f80fd5b610047600480360381019061004291906100a9565b61005d565b60405161005491906100f6565b60405180910390f35b5f818361006a919061013c565b905092915050565b5f80fd5b5f819050919050565b61008881610076565b8114610092575f80fd5b50565b5f813590506100a38161007f565b92915050565b5f80604083850312156100bf576100be610072565b5b5f6100cc85828601610095565b92505060206100dd85828601610095565b9150509250929050565b6100f081610076565b82525050565b5f6020820190506101095f8301846100e7565b92915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f61014682610076565b915061015183610076565b92508282019050808211156101695761016861010f565b5b9291505056fea2646970667358221220a8f4b7187c62760aefc097c1827799c61a6df322acc9d7575862a525f9aa59a364736f6c63430008170033',
} as const)

const result = await provider.tevm.script(addContract.read.add(390n, 30n))

console.log(result)
//  createdAddresses: new Set(),
//  data: 420n,
//  executionGasUsed: 927n,
//  gas: 16776288n,
//  logs: [],
//  rawData: '0x00000000000000000000000000000000000000000000000000000000000001a4',
//  selfdestruct: new Set(),
```

## Tevm JSON-RPC support

An ethers TevmProvider supports the tevm [JSON-RPC methods](../json-rpc). For example you can use `tevm_account` to set account

## Example

```typescript
await provider.send('tevm_setAccount', {
  address: `0x${'69'.repeat(20)}`,
  nonce: toHex(1n),
  balance: toHex(420n),
}),
console.log(await provider.send('tevm_getAccount', {
  address: `0x${'69'.repeat(20)}`,
}))
//	address: '0x6969696969696969696969696969696969696969',
//	balance: toHex(420n),
//	deployedBytecode: '0x00',
//	nonce: toHex(1n),
//	storageRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
```

## See

[Tevm Clients Docs](https://tevm.sh/learn/clients/)

## Extends

- `JsonRpcApiProvider`

## Constructors

### new TevmProvider(memoryClient)

> **new TevmProvider**(`memoryClient`): [`TevmProvider`](TevmProvider.md)

#### Parameters

▪ **memoryClient**: `object`

An instance of a tevm Memory client

▪ **memoryClient.\_tevm**: `object` & `Eip1193RequestProvider` & `TevmActionsApi` & `object`

▪ **memoryClient.account**: `undefined`

The Account of the Client.

▪ **memoryClient.batch?**: `object`

Flags for batch settings.

▪ **memoryClient.batch.multicall?**: `boolean` \| `object`

Toggle to enable `eth_call` multicall aggregation.

▪ **memoryClient.cacheTime**: `number`

Time (in ms) that cached data will remain in memory.

▪ **memoryClient.call**: (`parameters`) => `Promise`\<`CallReturnType`\>

Executes a new message call immediately without submitting a transaction to the network.

- Docs: https://viem.sh/docs/actions/public/call
- JSON-RPC Methods: [`eth_call`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_call)

**Example**

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const data = await client.call({
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  data: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
})
```

▪ **memoryClient.ccipRead?**: `false` \| `object`

[CCIP Read](https://eips.ethereum.org/EIPS/eip-3668) configuration.

▪ **memoryClient.chain**: `undefined`

Chain for the client.

▪ **memoryClient.createBlockFilter**: () => `Promise`\<`object`\>

Creates a Filter to listen for new block hashes that can be used with [`getFilterChanges`](https://viem.sh/docs/actions/public/getFilterChanges).

- Docs: https://viem.sh/docs/actions/public/createBlockFilter
- JSON-RPC Methods: [`eth_newBlockFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newBlockFilter)

**Example**

```ts
import { createPublicClient, createBlockFilter, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const filter = await createBlockFilter(client)
// { id: "0x345a6572337856574a76364e457a4366", type: 'block' }
```

▪ **memoryClient.createContractEventFilter**: \<`TAbi`, `TEventName`, `TArgs`, `TStrict`, `TFromBlock`, `TToBlock`\>(`args`) => `Promise`\<`CreateContractEventFilterReturnType`\<`TAbi`, `TEventName`, `TArgs`, `TStrict`, `TFromBlock`, `TToBlock`\>\>

Creates a Filter to retrieve event logs that can be used with [`getFilterChanges`](https://viem.sh/docs/actions/public/getFilterChanges) or [`getFilterLogs`](https://viem.sh/docs/actions/public/getFilterLogs).

- Docs: https://viem.sh/docs/contract/createContractEventFilter

**Example**

```ts
import { createPublicClient, http, parseAbi } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const filter = await client.createContractEventFilter({
  abi: parseAbi(['event Transfer(address indexed, address indexed, uint256)']),
})
```

▪ **memoryClient.createEventFilter**: \<`TAbiEvent`, `TAbiEvents`, `TStrict`, `TFromBlock`, `TToBlock`, `_EventName`, `_Args`\>(`args`?) => `Promise`\<`{ [K in string | number | symbol]: Filter<"event", TAbiEvents, _EventName, _Args, TStrict, TFromBlock, TToBlock>[K] }`\>

Creates a [`Filter`](https://viem.sh/docs/glossary/types#filter) to listen for new events that can be used with [`getFilterChanges`](https://viem.sh/docs/actions/public/getFilterChanges).

- Docs: https://viem.sh/docs/actions/public/createEventFilter
- JSON-RPC Methods: [`eth_newFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newfilter)

**Example**

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const filter = await client.createEventFilter({
  address: '0xfba3912ca04dd458c843e2ee08967fc04f3579c2',
})
```

▪ **memoryClient.createPendingTransactionFilter**: () => `Promise`\<`object`\>

Creates a Filter to listen for new pending transaction hashes that can be used with [`getFilterChanges`](https://viem.sh/docs/actions/public/getFilterChanges).

- Docs: https://viem.sh/docs/actions/public/createPendingTransactionFilter
- JSON-RPC Methods: [`eth_newPendingTransactionFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newpendingtransactionfilter)

**Example**

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const filter = await client.createPendingTransactionFilter()
// { id: "0x345a6572337856574a76364e457a4366", type: 'transaction' }
```

▪ **memoryClient.dropTransaction**: (`args`) => `Promise`\<`void`\>

Removes a transaction from the mempool.

- Docs: https://viem.sh/docs/actions/test/dropTransaction

**Example**

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
await client.dropTransaction({
  hash: '0xe58dceb6b20b03965bb678e27d141e151d7d4efc2334c2d6a49b9fac523f7364'
})
```

▪ **memoryClient.dumpState**: () => `Promise`\<\`0x${string}\`\>

Serializes the current state (including contracts code, contract's storage,
accounts properties, etc.) into a savable data blob.

- Docs: https://viem.sh/docs/actions/test/dumpState

**Example**

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
await client.dumpState()
```

▪ **memoryClient.estimateContractGas**: \<`TChain`, `abi`, `functionName`, `args`\>(`args`) => `Promise`\<`bigint`\>

Estimates the gas required to successfully execute a contract write function call.

- Docs: https://viem.sh/docs/contract/estimateContractGas

**Remarks**

Internally, uses a [Public Client](https://viem.sh/docs/clients/public) to call the [`estimateGas` action](https://viem.sh/docs/actions/public/estimateGas) with [ABI-encoded `data`](https://viem.sh/docs/contract/encodeFunctionData).

**Example**

```ts
import { createPublicClient, http, parseAbi } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const gas = await client.estimateContractGas({
  address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
  abi: parseAbi(['function mint() public']),
  functionName: 'mint',
  account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
})
```

▪ **memoryClient.estimateFeesPerGas**: \<`TChainOverride`, `TType`\>(`args`?) => `Promise`\<`EstimateFeesPerGasReturnType`\>

Returns an estimate for the fees per gas for a transaction to be included
in the next block.

- Docs: https://viem.sh/docs/actions/public/estimateFeesPerGas

**Example**

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const maxPriorityFeePerGas = await client.estimateFeesPerGas()
// { maxFeePerGas: ..., maxPriorityFeePerGas: ... }
```

▪ **memoryClient.estimateGas**: (`args`) => `Promise`\<`bigint`\>

Estimates the gas necessary to complete a transaction without submitting it to the network.

- Docs: https://viem.sh/docs/actions/public/estimateGas
- JSON-RPC Methods: [`eth_estimateGas`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_estimategas)

**Example**

```ts
import { createPublicClient, http, parseEther } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const gasEstimate = await client.estimateGas({
  account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
  to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
  value: parseEther('1'),
})
```

▪ **memoryClient.estimateMaxPriorityFeePerGas**: \<`TChainOverride`\>(`args`?) => `Promise`\<`bigint`\>

Returns an estimate for the max priority fee per gas (in wei) for a transaction
to be included in the next block.

- Docs: https://viem.sh/docs/actions/public/estimateMaxPriorityFeePerGas

**Example**

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const maxPriorityFeePerGas = await client.estimateMaxPriorityFeePerGas()
// 10000000n
```

▪ **memoryClient.extend**: \<`client`\>(`fn`) => `Client`\<`Transport`, `undefined`, `undefined`, [`object`, `object`, `object`, `object`, `object`], `{ [K in string | number | symbol]: client[K] }` & `PublicActions` & `TestActions` & `TevmActions`\>

▪ **memoryClient.getAutomine**: () => `Promise`\<`boolean`\>

Returns the automatic mining status of the node.

- Docs: https://viem.sh/docs/actions/test/getAutomine

**Example**

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
const isAutomining = await client.getAutomine()
```

▪ **memoryClient.getBalance**: (`args`) => `Promise`\<`bigint`\>

Returns the balance of an address in wei.

- Docs: https://viem.sh/docs/actions/public/getBalance
- JSON-RPC Methods: [`eth_getBalance`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getbalance)

**Remarks**

You can convert the balance to ether units with [`formatEther`](https://viem.sh/docs/utilities/formatEther).

```ts
const balance = await getBalance(client, {
  address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
  blockTag: 'safe'
})
const balanceAsEther = formatEther(balance)
// "6.942"
```

**Example**

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const balance = await client.getBalance({
  address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
})
// 10000000000000000000000n (wei)
```

▪ **memoryClient.getBlobBaseFee**: () => `Promise`\<`bigint`\>

Returns the base fee per blob gas in wei.

- Docs: https://viem.sh/docs/actions/public/getBlobBaseFee
- JSON-RPC Methods: [`eth_blobBaseFee`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_blobBaseFee)

**Example**

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { getBlobBaseFee } from 'viem/public'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const blobBaseFee = await client.getBlobBaseFee()
```

▪ **memoryClient.getBlock**: \<`TIncludeTransactions`, `TBlockTag`\>(`args`?) => `Promise`\<`object`\>

Returns information about a block at a block number, hash, or tag.

- Docs: https://viem.sh/docs/actions/public/getBlock
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/blocks/fetching-blocks
- JSON-RPC Methods:
  - Calls [`eth_getBlockByNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblockbynumber) for `blockNumber` & `blockTag`.
  - Calls [`eth_getBlockByHash`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblockbyhash) for `blockHash`.

**Example**

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const block = await client.getBlock()
```

▪ **memoryClient.getBlockNumber**: (`args`?) => `Promise`\<`bigint`\>

Returns the number of the most recent block seen.

- Docs: https://viem.sh/docs/actions/public/getBlockNumber
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/blocks/fetching-blocks
- JSON-RPC Methods: [`eth_blockNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_blocknumber)

**Example**

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const blockNumber = await client.getBlockNumber()
// 69420n
```

▪ **memoryClient.getBlockTransactionCount**: (`args`?) => `Promise`\<`number`\>

Returns the number of Transactions at a block number, hash, or tag.

- Docs: https://viem.sh/docs/actions/public/getBlockTransactionCount
- JSON-RPC Methods:
  - Calls [`eth_getBlockTransactionCountByNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblocktransactioncountbynumber) for `blockNumber` & `blockTag`.
  - Calls [`eth_getBlockTransactionCountByHash`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblocktransactioncountbyhash) for `blockHash`.

**Example**

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const count = await client.getBlockTransactionCount()
```

▪ **memoryClient.getBytecode**: (`args`) => `Promise`\<`GetBytecodeReturnType`\>

Retrieves the bytecode at an address.

- Docs: https://viem.sh/docs/contract/getBytecode
- JSON-RPC Methods: [`eth_getCode`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getcode)

**Example**

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const code = await client.getBytecode({
  address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
})
```

▪ **memoryClient.getChainId**: () => `Promise`\<`number`\>

Returns the chain ID associated with the current network.

- Docs: https://viem.sh/docs/actions/public/getChainId
- JSON-RPC Methods: [`eth_chainId`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_chainid)

**Example**

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const chainId = await client.getChainId()
// 1
```

▪ **memoryClient.getContractEvents**: \<`abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>(`args`) => `Promise`\<`GetContractEventsReturnType`\<`abi`, `eventName`, `strict`, `fromBlock`, `toBlock`\>\>

Returns a list of event logs emitted by a contract.

- Docs: https://viem.sh/docs/actions/public/getContractEvents
- JSON-RPC Methods: [`eth_getLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getlogs)

**Example**

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { wagmiAbi } from './abi'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const logs = await client.getContractEvents(client, {
 address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
 abi: wagmiAbi,
 eventName: 'Transfer'
})
```

▪ **memoryClient.getEnsAddress**: (`args`) => `Promise`\<`GetEnsAddressReturnType`\>

Gets address for ENS name.

- Docs: https://viem.sh/docs/ens/actions/getEnsAddress
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/ens

**Remarks**

Calls `resolve(bytes, bytes)` on ENS Universal Resolver Contract.

Since ENS names prohibit certain forbidden characters (e.g. underscore) and have other validation rules, you likely want to [normalize ENS names](https://docs.ens.domains/contract-api-reference/name-processing#normalising-names) with [UTS-46 normalization](https://unicode.org/reports/tr46) before passing them to `getEnsAddress`. You can use the built-in [`normalize`](https://viem.sh/docs/ens/utilities/normalize) function for this.

**Example**

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { normalize } from 'viem/ens'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const ensAddress = await client.getEnsAddress({
  name: normalize('wevm.eth'),
})
// '0xd2135CfB216b74109775236E36d4b433F1DF507B'
```

▪ **memoryClient.getEnsAvatar**: (`args`) => `Promise`\<`GetEnsAvatarReturnType`\>

Gets the avatar of an ENS name.

- Docs: https://viem.sh/docs/ens/actions/getEnsAvatar
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/ens

**Remarks**

Calls [`getEnsText`](https://viem.sh/docs/ens/actions/getEnsText) with `key` set to `'avatar'`.

Since ENS names prohibit certain forbidden characters (e.g. underscore) and have other validation rules, you likely want to [normalize ENS names](https://docs.ens.domains/contract-api-reference/name-processing#normalising-names) with [UTS-46 normalization](https://unicode.org/reports/tr46) before passing them to `getEnsAddress`. You can use the built-in [`normalize`](https://viem.sh/docs/ens/utilities/normalize) function for this.

**Example**

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { normalize } from 'viem/ens'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const ensAvatar = await client.getEnsAvatar({
  name: normalize('wevm.eth'),
})
// 'https://ipfs.io/ipfs/Qma8mnp6xV3J2cRNf3mTth5C8nV11CAnceVinc3y8jSbio'
```

▪ **memoryClient.getEnsName**: (`args`) => `Promise`\<`GetEnsNameReturnType`\>

Gets primary name for specified address.

- Docs: https://viem.sh/docs/ens/actions/getEnsName
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/ens

**Remarks**

Calls `reverse(bytes)` on ENS Universal Resolver Contract to "reverse resolve" the address to the primary ENS name.

**Example**

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const ensName = await client.getEnsName({
  address: '0xd2135CfB216b74109775236E36d4b433F1DF507B',
})
// 'wevm.eth'
```

▪ **memoryClient.getEnsResolver**: (`args`) => `Promise`\<\`0x${string}\`\>

Gets resolver for ENS name.

- Docs: https://viem.sh/docs/ens/actions/getEnsResolver
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/ens

**Remarks**

Calls `findResolver(bytes)` on ENS Universal Resolver Contract to retrieve the resolver of an ENS name.

Since ENS names prohibit certain forbidden characters (e.g. underscore) and have other validation rules, you likely want to [normalize ENS names](https://docs.ens.domains/contract-api-reference/name-processing#normalising-names) with [UTS-46 normalization](https://unicode.org/reports/tr46) before passing them to `getEnsAddress`. You can use the built-in [`normalize`](https://viem.sh/docs/ens/utilities/normalize) function for this.

**Example**

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { normalize } from 'viem/ens'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const resolverAddress = await client.getEnsResolver({
  name: normalize('wevm.eth'),
})
// '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41'
```

▪ **memoryClient.getEnsText**: (`args`) => `Promise`\<`GetEnsTextReturnType`\>

Gets a text record for specified ENS name.

- Docs: https://viem.sh/docs/ens/actions/getEnsResolver
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/ens

**Remarks**

Calls `resolve(bytes, bytes)` on ENS Universal Resolver Contract.

Since ENS names prohibit certain forbidden characters (e.g. underscore) and have other validation rules, you likely want to [normalize ENS names](https://docs.ens.domains/contract-api-reference/name-processing#normalising-names) with [UTS-46 normalization](https://unicode.org/reports/tr46) before passing them to `getEnsAddress`. You can use the built-in [`normalize`](https://viem.sh/docs/ens/utilities/normalize) function for this.

**Example**

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { normalize } from 'viem/ens'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const twitterRecord = await client.getEnsText({
  name: normalize('wevm.eth'),
  key: 'com.twitter',
})
// 'wagmi_sh'
```

▪ **memoryClient.getFeeHistory**: (`args`) => `Promise`\<`GetFeeHistoryReturnType`\>

Returns a collection of historical gas information.

- Docs: https://viem.sh/docs/actions/public/getFeeHistory
- JSON-RPC Methods: [`eth_feeHistory`](https://docs.alchemy.com/reference/eth-feehistory)

**Example**

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const feeHistory = await client.getFeeHistory({
  blockCount: 4,
  rewardPercentiles: [25, 75],
})
```

▪ **memoryClient.getFilterChanges**: \<`TFilterType`, `TAbi`, `TEventName`, `TStrict`, `TFromBlock`, `TToBlock`\>(`args`) => `Promise`\<`GetFilterChangesReturnType`\<`TFilterType`, `TAbi`, `TEventName`, `TStrict`, `TFromBlock`, `TToBlock`\>\>

Returns a list of logs or hashes based on a [Filter](/docs/glossary/terms#filter) since the last time it was called.

- Docs: https://viem.sh/docs/actions/public/getFilterChanges
- JSON-RPC Methods: [`eth_getFilterChanges`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getfilterchanges)

**Remarks**

A Filter can be created from the following actions:

- [`createBlockFilter`](https://viem.sh/docs/actions/public/createBlockFilter)
- [`createContractEventFilter`](https://viem.sh/docs/contract/createContractEventFilter)
- [`createEventFilter`](https://viem.sh/docs/actions/public/createEventFilter)
- [`createPendingTransactionFilter`](https://viem.sh/docs/actions/public/createPendingTransactionFilter)

Depending on the type of filter, the return value will be different:

- If the filter was created with `createContractEventFilter` or `createEventFilter`, it returns a list of logs.
- If the filter was created with `createPendingTransactionFilter`, it returns a list of transaction hashes.
- If the filter was created with `createBlockFilter`, it returns a list of block hashes.

**Example**

```ts
// Blocks
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const filter = await client.createBlockFilter()
const hashes = await client.getFilterChanges({ filter })
```

**Example**

```ts
// Contract Events
import { createPublicClient, http, parseAbi } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const filter = await client.createContractEventFilter({
  address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  abi: parseAbi(['event Transfer(address indexed, address indexed, uint256)']),
  eventName: 'Transfer',
})
const logs = await client.getFilterChanges({ filter })
```

**Example**

```ts
// Raw Events
import { createPublicClient, http, parseAbiItem } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const filter = await client.createEventFilter({
  address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  event: parseAbiItem('event Transfer(address indexed, address indexed, uint256)'),
})
const logs = await client.getFilterChanges({ filter })
```

**Example**

```ts
// Transactions
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const filter = await client.createPendingTransactionFilter()
const hashes = await client.getFilterChanges({ filter })
```

▪ **memoryClient.getFilterLogs**: \<`TAbi`, `TEventName`, `TStrict`, `TFromBlock`, `TToBlock`\>(`args`) => `Promise`\<`GetFilterLogsReturnType`\<`TAbi`, `TEventName`, `TStrict`, `TFromBlock`, `TToBlock`\>\>

Returns a list of event logs since the filter was created.

- Docs: https://viem.sh/docs/actions/public/getFilterLogs
- JSON-RPC Methods: [`eth_getFilterLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getfilterlogs)

**Remarks**

`getFilterLogs` is only compatible with **event filters**.

**Example**

```ts
import { createPublicClient, http, parseAbiItem } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const filter = await client.createEventFilter({
  address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  event: parseAbiItem('event Transfer(address indexed, address indexed, uint256)'),
})
const logs = await client.getFilterLogs({ filter })
```

▪ **memoryClient.getGasPrice**: () => `Promise`\<`bigint`\>

Returns the current price of gas (in wei).

- Docs: https://viem.sh/docs/actions/public/getGasPrice
- JSON-RPC Methods: [`eth_gasPrice`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_gasprice)

**Example**

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const gasPrice = await client.getGasPrice()
```

▪ **memoryClient.getLogs**: \<`TAbiEvent`, `TAbiEvents`, `TStrict`, `TFromBlock`, `TToBlock`\>(`args`?) => `Promise`\<`GetLogsReturnType`\<`TAbiEvent`, `TAbiEvents`, `TStrict`, `TFromBlock`, `TToBlock`\>\>

Returns a list of event logs matching the provided parameters.

- Docs: https://viem.sh/docs/actions/public/getLogs
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/filters-and-logs/event-logs
- JSON-RPC Methods: [`eth_getLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getlogs)

**Example**

```ts
import { createPublicClient, http, parseAbiItem } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const logs = await client.getLogs()
```

▪ **memoryClient.getProof**: (`args`) => `Promise`\<`GetProofReturnType`\>

Returns the account and storage values of the specified account including the Merkle-proof.

- Docs: https://viem.sh/docs/actions/public/getProof
- JSON-RPC Methods:
  - Calls [`eth_getProof`](https://eips.ethereum.org/EIPS/eip-1186)

**Example**

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const block = await client.getProof({
 address: '0x...',
 storageKeys: ['0x...'],
})
```

▪ **memoryClient.getStorageAt**: (`args`) => `Promise`\<`GetStorageAtReturnType`\>

Returns the value from a storage slot at a given address.

- Docs: https://viem.sh/docs/contract/getStorageAt
- JSON-RPC Methods: [`eth_getStorageAt`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getstorageat)

**Example**

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { getStorageAt } from 'viem/contract'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const code = await client.getStorageAt({
  address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
  slot: toHex(0),
})
```

▪ **memoryClient.getTransaction**: \<`TBlockTag`\>(`args`) => `Promise`\<`object` \| `object` \| `object` \| `object`\>

Returns information about a [Transaction](https://viem.sh/docs/glossary/terms#transaction) given a hash or block identifier.

- Docs: https://viem.sh/docs/actions/public/getTransaction
- Example: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions/fetching-transactions
- JSON-RPC Methods: [`eth_getTransactionByHash`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getTransactionByHash)

**Example**

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const transaction = await client.getTransaction({
  hash: '0x4ca7ee652d57678f26e887c149ab0735f41de37bcad58c9f6d3ed5824f15b74d',
})
```

▪ **memoryClient.getTransactionConfirmations**: (`args`) => `Promise`\<`bigint`\>

Returns the number of blocks passed (confirmations) since the transaction was processed on a block.

- Docs: https://viem.sh/docs/actions/public/getTransactionConfirmations
- Example: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions/fetching-transactions
- JSON-RPC Methods: [`eth_getTransactionConfirmations`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getTransactionConfirmations)

**Example**

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const confirmations = await client.getTransactionConfirmations({
  hash: '0x4ca7ee652d57678f26e887c149ab0735f41de37bcad58c9f6d3ed5824f15b74d',
})
```

▪ **memoryClient.getTransactionCount**: (`args`) => `Promise`\<`number`\>

Returns the number of [Transactions](https://viem.sh/docs/glossary/terms#transaction) an Account has broadcast / sent.

- Docs: https://viem.sh/docs/actions/public/getTransactionCount
- JSON-RPC Methods: [`eth_getTransactionCount`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_gettransactioncount)

**Example**

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const transactionCount = await client.getTransactionCount({
  address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
})
```

▪ **memoryClient.getTransactionReceipt**: (`args`) => `Promise`\<`TransactionReceipt`\>

Returns the [Transaction Receipt](https://viem.sh/docs/glossary/terms#transaction-receipt) given a [Transaction](https://viem.sh/docs/glossary/terms#transaction) hash.

- Docs: https://viem.sh/docs/actions/public/getTransactionReceipt
- Example: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions/fetching-transactions
- JSON-RPC Methods: [`eth_getTransactionReceipt`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getTransactionReceipt)

**Example**

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const transactionReceipt = await client.getTransactionReceipt({
  hash: '0x4ca7ee652d57678f26e887c149ab0735f41de37bcad58c9f6d3ed5824f15b74d',
})
```

▪ **memoryClient.getTxpoolContent**: () => `Promise`\<`GetTxpoolContentReturnType`\>

Returns the details of all transactions currently pending for inclusion in the next block(s), as well as the ones that are being scheduled for future execution only.

- Docs: https://viem.sh/docs/actions/test/getTxpoolContent

**Example**

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
const content = await client.getTxpoolContent()
```

▪ **memoryClient.getTxpoolStatus**: () => `Promise`\<`GetTxpoolStatusReturnType`\>

Returns a summary of all the transactions currently pending for inclusion in the next block(s), as well as the ones that are being scheduled for future execution only.

- Docs: https://viem.sh/docs/actions/test/getTxpoolStatus

**Example**

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
const status = await client.getTxpoolStatus()
```

▪ **memoryClient.impersonateAccount**: (`args`) => `Promise`\<`void`\>

Impersonate an account or contract address. This lets you send transactions from that account even if you don't have access to its private key.

- Docs: https://viem.sh/docs/actions/test/impersonateAccount

**Example**

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
await client.impersonateAccount({
  address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
})
```

▪ **memoryClient.increaseTime**: (`args`) => `Promise`\<\`0x${string}\`\>

Jump forward in time by the given amount of time, in seconds.

- Docs: https://viem.sh/docs/actions/test/increaseTime

**Example**

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
await client.increaseTime({
  seconds: 420,
})
```

▪ **memoryClient.inspectTxpool**: () => `Promise`\<`InspectTxpoolReturnType`\>

Returns a summary of all the transactions currently pending for inclusion in the next block(s), as well as the ones that are being scheduled for future execution only.

- Docs: https://viem.sh/docs/actions/test/inspectTxpool

**Example**

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
const data = await client.inspectTxpool()
```

▪ **memoryClient.key**: `string`

A key for the client.

▪ **memoryClient.loadState**: (`args`) => `Promise`\<`void`\>

Adds state previously dumped with `dumpState` to the current chain.

- Docs: https://viem.sh/docs/actions/test/loadState

**Example**

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
await client.loadState({ state: '0x...' })
```

▪ **memoryClient.mine**: (`args`) => `Promise`\<`void`\>

Mine a specified number of blocks.

- Docs: https://viem.sh/docs/actions/test/mine

**Example**

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
await client.mine({ blocks: 1 })
```

▪ **memoryClient.multicall**: \<`contracts`, `allowFailure`\>(`args`) => `Promise`\<`MulticallReturnType`\<`contracts`, `allowFailure`\>\>

Similar to [`readContract`](https://viem.sh/docs/contract/readContract), but batches up multiple functions on a contract in a single RPC call via the [`multicall3` contract](https://github.com/mds1/multicall).

- Docs: https://viem.sh/docs/contract/multicall

**Example**

```ts
import { createPublicClient, http, parseAbi } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const abi = parseAbi([
  'function balanceOf(address) view returns (uint256)',
  'function totalSupply() view returns (uint256)',
])
const result = await client.multicall({
  contracts: [
    {
      address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
      abi,
      functionName: 'balanceOf',
      args: ['0xA0Cf798816D4b9b9866b5330EEa46a18382f251e'],
    },
    {
      address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
      abi,
      functionName: 'totalSupply',
    },
  ],
})
// [{ result: 424122n, status: 'success' }, { result: 1000000n, status: 'success' }]
```

▪ **memoryClient.name**: `string`

A name for the client.

▪ **memoryClient.pollingInterval**: `number`

Frequency (in ms) for polling enabled actions & events. Defaults to 4_000 milliseconds.

▪ **memoryClient.prepareTransactionRequest**: \<`TRequest`, `TChainOverride`, `TAccountOverride`\>(`args`) => `Promise`\<`{ [K in string | number | symbol]: (UnionRequiredBy<Extract<UnionOmit<(...), (...)> & ((...) extends (...) ? (...) : (...)) & ((...) extends (...) ? (...) : (...)), IsNever<(...)> extends true ? unknown : ExactPartial<(...)>> & Object, ParameterTypeToParameters<TRequest["parameters"] extends readonly PrepareTransactionRequestParameterType[] ? any[any][number] : "type" | "gas" | "nonce" | "blobVersionedHashes" | "chainId" | "fees">> & (unknown extends TRequest["kzg"] ? Object : Pick<TRequest, "kzg">))[K] }`\>

Prepares a transaction request for signing.

- Docs: https://viem.sh/docs/actions/wallet/prepareTransactionRequest

**Example**

```ts
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'

const client = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
})
const request = await client.prepareTransactionRequest({
  account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
  to: '0x0000000000000000000000000000000000000000',
  value: 1n,
})
```

**Example**

```ts
// Account Hoisting
import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mainnet } from 'viem/chains'

const client = createWalletClient({
  account: privateKeyToAccount('0x…'),
  chain: mainnet,
  transport: custom(window.ethereum),
})
const request = await client.prepareTransactionRequest({
  to: '0x0000000000000000000000000000000000000000',
  value: 1n,
})
```

▪ **memoryClient.readContract**: \<`abi`, `functionName`, `args`\>(`args`) => `Promise`\<`ReadContractReturnType`\<`abi`, `functionName`, `args`\>\>

Calls a read-only function on a contract, and returns the response.

- Docs: https://viem.sh/docs/contract/readContract
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/contracts/reading-contracts

**Remarks**

A "read-only" function (constant function) on a Solidity contract is denoted by a `view` or `pure` keyword. They can only read the state of the contract, and cannot make any changes to it. Since read-only methods do not change the state of the contract, they do not require any gas to be executed, and can be called by any user without the need to pay for gas.

Internally, uses a [Public Client](https://viem.sh/docs/clients/public) to call the [`call` action](https://viem.sh/docs/actions/public/call) with [ABI-encoded `data`](https://viem.sh/docs/contract/encodeFunctionData).

**Example**

```ts
import { createPublicClient, http, parseAbi } from 'viem'
import { mainnet } from 'viem/chains'
import { readContract } from 'viem/contract'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const result = await client.readContract({
  address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
  abi: parseAbi(['function balanceOf(address) view returns (uint256)']),
  functionName: 'balanceOf',
  args: ['0xA0Cf798816D4b9b9866b5330EEa46a18382f251e'],
})
// 424122n
```

▪ **memoryClient.removeBlockTimestampInterval**: () => `Promise`\<`void`\>

Removes [`setBlockTimestampInterval`](https://viem.sh/docs/actions/test/setBlockTimestampInterval) if it exists.

- Docs: https://viem.sh/docs/actions/test/removeBlockTimestampInterval

**Example**

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'
import { removeBlockTimestampInterval } from 'viem/test'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
await client.removeBlockTimestampInterval()
```

▪ **memoryClient.request**: `EIP1193RequestFn`\<[`object`, `object`, `object`, `object`, `object`]\>

Request function wrapped with friendly error handling

▪ **memoryClient.reset**: (`args`?) => `Promise`\<`void`\>

Resets fork back to its original state.

- Docs: https://viem.sh/docs/actions/test/reset

**Example**

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
await client.reset({ blockNumber: 69420n })
```

▪ **memoryClient.revert**: (`args`) => `Promise`\<`void`\>

Revert the state of the blockchain at the current block.

- Docs: https://viem.sh/docs/actions/test/revert

**Example**

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
await client.revert({ id: '0x…' })
```

▪ **memoryClient.sendRawTransaction**: (`args`) => `Promise`\<\`0x${string}\`\>

Sends a **signed** transaction to the network

- Docs: https://viem.sh/docs/actions/wallet/sendRawTransaction
- JSON-RPC Method: [`eth_sendRawTransaction`](https://ethereum.github.io/execution-apis/api-documentation/)

**Example**

```ts
import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'
import { sendRawTransaction } from 'viem/wallet'

const client = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
})

const hash = await client.sendRawTransaction({
  serializedTransaction: '0x02f850018203118080825208808080c080a04012522854168b27e5dc3d5839bab5e6b39e1a0ffd343901ce1622e3d64b48f1a04e00902ae0502c4728cbf12156290df99c3ed7de85b1dbfe20b5c36931733a33'
})
```

▪ **memoryClient.sendUnsignedTransaction**: \<`TChain`\>(`args`) => `Promise`\<\`0x${string}\`\>

Returns the details of all transactions currently pending for inclusion in the next block(s), as well as the ones that are being scheduled for future execution only.

- Docs: https://viem.sh/docs/actions/test/getTxpoolContent

**Example**

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
const hash = await client.sendUnsignedTransaction({
  from: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
  value: 1000000000000000000n,
})
```

▪ **memoryClient.setAutomine**: (`args`) => `Promise`\<`void`\>

Enables or disables the automatic mining of new blocks with each new transaction submitted to the network.

- Docs: https://viem.sh/docs/actions/test/setAutomine

**Example**

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
await client.setAutomine()
```

▪ **memoryClient.setBalance**: (`args`) => `Promise`\<`void`\>

Modifies the balance of an account.

- Docs: https://viem.sh/docs/actions/test/setBalance

**Example**

```ts
import { createTestClient, http, parseEther } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
await client.setBalance({
  address: '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
  value: parseEther('1'),
})
```

▪ **memoryClient.setBlockGasLimit**: (`args`) => `Promise`\<`void`\>

Sets the block's gas limit.

- Docs: https://viem.sh/docs/actions/test/setBlockGasLimit

**Example**

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
await client.setBlockGasLimit({ gasLimit: 420_000n })
```

▪ **memoryClient.setBlockTimestampInterval**: (`args`) => `Promise`\<`void`\>

Similar to [`increaseTime`](https://viem.sh/docs/actions/test/increaseTime), but sets a block timestamp `interval`. The timestamp of future blocks will be computed as `lastBlock_timestamp` + `interval`.

- Docs: https://viem.sh/docs/actions/test/setBlockTimestampInterval

**Example**

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
await client.setBlockTimestampInterval({ interval: 5 })
```

▪ **memoryClient.setCode**: (`args`) => `Promise`\<`void`\>

Modifies the bytecode stored at an account's address.

- Docs: https://viem.sh/docs/actions/test/setCode

**Example**

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
await client.setCode({
  address: '0xe846c6fcf817734ca4527b28ccb4aea2b6663c79',
  bytecode: '0x60806040526000600355600019600955600c80546001600160a01b031916737a250d5630b4cf539739df…',
})
```

▪ **memoryClient.setCoinbase**: (`args`) => `Promise`\<`void`\>

Sets the coinbase address to be used in new blocks.

- Docs: https://viem.sh/docs/actions/test/setCoinbase

**Example**

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
await client.setCoinbase({
  address: '0xe846c6fcf817734ca4527b28ccb4aea2b6663c79',
})
```

▪ **memoryClient.setIntervalMining**: (`args`) => `Promise`\<`void`\>

Sets the automatic mining interval (in seconds) of blocks. Setting the interval to 0 will disable automatic mining.

- Docs: https://viem.sh/docs/actions/test/setIntervalMining

**Example**

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
await client.setIntervalMining({ interval: 5 })
```

▪ **memoryClient.setLoggingEnabled**: (`args`) => `Promise`\<`void`\>

Enable or disable logging on the test node network.

- Docs: https://viem.sh/docs/actions/test/setLoggingEnabled

**Example**

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
await client.setLoggingEnabled()
```

▪ **memoryClient.setMinGasPrice**: (`args`) => `Promise`\<`void`\>

Change the minimum gas price accepted by the network (in wei).

- Docs: https://viem.sh/docs/actions/test/setMinGasPrice

Note: `setMinGasPrice` can only be used on clients that do not have EIP-1559 enabled.

**Example**

```ts
import { createTestClient, http, parseGwei } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
await client.setMinGasPrice({
  gasPrice: parseGwei('20'),
})
```

▪ **memoryClient.setNextBlockBaseFeePerGas**: (`args`) => `Promise`\<`void`\>

Sets the next block's base fee per gas.

- Docs: https://viem.sh/docs/actions/test/setNextBlockBaseFeePerGas

**Example**

```ts
import { createTestClient, http, parseGwei } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
await client.setNextBlockBaseFeePerGas({
  baseFeePerGas: parseGwei('20'),
})
```

▪ **memoryClient.setNextBlockTimestamp**: (`args`) => `Promise`\<`void`\>

Sets the next block's timestamp.

- Docs: https://viem.sh/docs/actions/test/setNextBlockTimestamp

**Example**

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
await client.setNextBlockTimestamp({ timestamp: 1671744314n })
```

▪ **memoryClient.setNonce**: (`args`) => `Promise`\<`void`\>

Modifies (overrides) the nonce of an account.

- Docs: https://viem.sh/docs/actions/test/setNonce

**Example**

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
await client.setNonce({
  address: '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
  nonce: 420,
})
```

▪ **memoryClient.setRpcUrl**: (`args`) => `Promise`\<`void`\>

Sets the backend RPC URL.

- Docs: https://viem.sh/docs/actions/test/setRpcUrl

**Example**

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
await client.setRpcUrl('https://eth-mainnet.g.alchemy.com/v2')
```

▪ **memoryClient.setStorageAt**: (`args`) => `Promise`\<`void`\>

Writes to a slot of an account's storage.

- Docs: https://viem.sh/docs/actions/test/setStorageAt

**Example**

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
await client.setStorageAt({
  address: '0xe846c6fcf817734ca4527b28ccb4aea2b6663c79',
  index: 2,
  value: '0x0000000000000000000000000000000000000000000000000000000000000069',
})
```

▪ **memoryClient.simulateContract**: \<`abi`, `functionName`, `args`, `chainOverride`, `accountOverride`\>(`args`) => `Promise`\<`SimulateContractReturnType`\<`abi`, `functionName`, `args`, `undefined` \| `Chain`, `undefined` \| `Account`, `chainOverride`, `accountOverride`\>\>

Simulates/validates a contract interaction. This is useful for retrieving **return data** and **revert reasons** of contract write functions.

- Docs: https://viem.sh/docs/contract/simulateContract
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/contracts/writing-to-contracts

**Remarks**

This function does not require gas to execute and _**does not**_ change the state of the blockchain. It is almost identical to [`readContract`](https://viem.sh/docs/contract/readContract), but also supports contract write functions.

Internally, uses a [Public Client](https://viem.sh/docs/clients/public) to call the [`call` action](https://viem.sh/docs/actions/public/call) with [ABI-encoded `data`](https://viem.sh/docs/contract/encodeFunctionData).

**Example**

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const result = await client.simulateContract({
  address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
  abi: parseAbi(['function mint(uint32) view returns (uint32)']),
  functionName: 'mint',
  args: ['69420'],
  account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
})
```

▪ **memoryClient.snapshot**: () => `Promise`\<\`0x${string}\`\>

Snapshot the state of the blockchain at the current block.

- Docs: https://viem.sh/docs/actions/test/snapshot

**Example**

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'
import { snapshot } from 'viem/test'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
await client.snapshot()
```

▪ **memoryClient.stopImpersonatingAccount**: (`args`) => `Promise`\<`void`\>

Stop impersonating an account after having previously used [`impersonateAccount`](https://viem.sh/docs/actions/test/impersonateAccount).

- Docs: https://viem.sh/docs/actions/test/stopImpersonatingAccount

**Example**

```ts
import { createTestClient, http } from 'viem'
import { foundry } from 'viem/chains'
import { stopImpersonatingAccount } from 'viem/test'

const client = createTestClient({
  mode: 'anvil',
  chain: 'foundry',
  transport: http(),
})
await client.stopImpersonatingAccount({
  address: '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
})
```

▪ **memoryClient.tevmCall**: `CallHandler`

▪ **memoryClient.tevmContract**: `ContractHandler`

▪ **memoryClient.tevmDeploy**: `DeployHandler`

▪ **memoryClient.tevmDumpState**: `DumpStateHandler`

▪ **memoryClient.tevmForkUrl?**: `string`

▪ **memoryClient.tevmGetAccount**: `GetAccountHandler`

▪ **memoryClient.tevmLoadState**: `LoadStateHandler`

▪ **memoryClient.tevmMine**: `MineHandler`

▪ **memoryClient.tevmReady**: () => `Promise`\<`true`\>

▪ **memoryClient.tevmScript**: `ScriptHandler`

▪ **memoryClient.tevmSetAccount**: `SetAccountHandler`

▪ **memoryClient.transport**: `TransportConfig`\<`string`, `EIP1193RequestFn`\> & `Record`\<`string`, `any`\>

The RPC transport

▪ **memoryClient.type**: `string`

The type of client.

▪ **memoryClient.uid**: `string`

A unique ID for the client.

▪ **memoryClient.uninstallFilter**: (`args`) => `Promise`\<`boolean`\>

Destroys a Filter that was created from one of the following Actions:

- [`createBlockFilter`](https://viem.sh/docs/actions/public/createBlockFilter)
- [`createEventFilter`](https://viem.sh/docs/actions/public/createEventFilter)
- [`createPendingTransactionFilter`](https://viem.sh/docs/actions/public/createPendingTransactionFilter)

- Docs: https://viem.sh/docs/actions/public/uninstallFilter
- JSON-RPC Methods: [`eth_uninstallFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_uninstallFilter)

**Example**

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { createPendingTransactionFilter, uninstallFilter } from 'viem/public'

const filter = await client.createPendingTransactionFilter()
const uninstalled = await client.uninstallFilter({ filter })
// true
```

▪ **memoryClient.verifyMessage**: (`args`) => `Promise`\<`boolean`\>

▪ **memoryClient.verifyTypedData**: (`args`) => `Promise`\<`boolean`\>

▪ **memoryClient.waitForTransactionReceipt**: (`args`) => `Promise`\<`TransactionReceipt`\>

Waits for the [Transaction](https://viem.sh/docs/glossary/terms#transaction) to be included on a [Block](https://viem.sh/docs/glossary/terms#block) (one confirmation), and then returns the [Transaction Receipt](https://viem.sh/docs/glossary/terms#transaction-receipt). If the Transaction reverts, then the action will throw an error.

- Docs: https://viem.sh/docs/actions/public/waitForTransactionReceipt
- Example: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions/sending-transactions
- JSON-RPC Methods:
  - Polls [`eth_getTransactionReceipt`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getTransactionReceipt) on each block until it has been processed.
  - If a Transaction has been replaced:
    - Calls [`eth_getBlockByNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblockbynumber) and extracts the transactions
    - Checks if one of the Transactions is a replacement
    - If so, calls [`eth_getTransactionReceipt`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getTransactionReceipt).

**Remarks**

The `waitForTransactionReceipt` action additionally supports Replacement detection (e.g. sped up Transactions).

Transactions can be replaced when a user modifies their transaction in their wallet (to speed up or cancel). Transactions are replaced when they are sent from the same nonce.

There are 3 types of Transaction Replacement reasons:

- `repriced`: The gas price has been modified (e.g. different `maxFeePerGas`)
- `cancelled`: The Transaction has been cancelled (e.g. `value === 0n`)
- `replaced`: The Transaction has been replaced (e.g. different `value` or `data`)

**Example**

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const transactionReceipt = await client.waitForTransactionReceipt({
  hash: '0x4ca7ee652d57678f26e887c149ab0735f41de37bcad58c9f6d3ed5824f15b74d',
})
```

▪ **memoryClient.watchBlockNumber**: (`args`) => `WatchBlockNumberReturnType`

Watches and returns incoming block numbers.

- Docs: https://viem.sh/docs/actions/public/watchBlockNumber
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/blocks/watching-blocks
- JSON-RPC Methods:
  - When `poll: true`, calls [`eth_blockNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_blocknumber) on a polling interval.
  - When `poll: false` & WebSocket Transport, uses a WebSocket subscription via [`eth_subscribe`](https://docs.alchemy.com/reference/eth-subscribe-polygon) and the `"newHeads"` event.

**Example**

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const unwatch = await client.watchBlockNumber({
  onBlockNumber: (blockNumber) => console.log(blockNumber),
})
```

▪ **memoryClient.watchBlocks**: \<`TIncludeTransactions`, `TBlockTag`\>(`args`) => `WatchBlocksReturnType`

Watches and returns information for incoming blocks.

- Docs: https://viem.sh/docs/actions/public/watchBlocks
- Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/blocks/watching-blocks
- JSON-RPC Methods:
  - When `poll: true`, calls [`eth_getBlockByNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getBlockByNumber) on a polling interval.
  - When `poll: false` & WebSocket Transport, uses a WebSocket subscription via [`eth_subscribe`](https://docs.alchemy.com/reference/eth-subscribe-polygon) and the `"newHeads"` event.

**Example**

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const unwatch = await client.watchBlocks({
  onBlock: (block) => console.log(block),
})
```

▪ **memoryClient.watchContractEvent**: \<`TAbi`, `TEventName`, `TStrict`\>(`args`) => `WatchContractEventReturnType`

Watches and returns emitted contract event logs.

- Docs: https://viem.sh/docs/contract/watchContractEvent

**Remarks**

This Action will batch up all the event logs found within the [`pollingInterval`](https://viem.sh/docs/contract/watchContractEvent#pollinginterval-optional), and invoke them via [`onLogs`](https://viem.sh/docs/contract/watchContractEvent#onLogs).

`watchContractEvent` will attempt to create an [Event Filter](https://viem.sh/docs/contract/createContractEventFilter) and listen to changes to the Filter per polling interval, however, if the RPC Provider does not support Filters (e.g. `eth_newFilter`), then `watchContractEvent` will fall back to using [`getLogs`](https://viem.sh/docs/actions/public/getLogs) instead.

**Example**

```ts
import { createPublicClient, http, parseAbi } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const unwatch = client.watchContractEvent({
  address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
  abi: parseAbi(['event Transfer(address indexed from, address indexed to, uint256 value)']),
  eventName: 'Transfer',
  args: { from: '0xc961145a54C96E3aE9bAA048c4F4D6b04C13916b' },
  onLogs: (logs) => console.log(logs),
})
```

▪ **memoryClient.watchEvent**: \<`TAbiEvent`, `TAbiEvents`, `TStrict`\>(`args`) => `WatchEventReturnType`

Watches and returns emitted [Event Logs](https://viem.sh/docs/glossary/terms#event-log).

- Docs: https://viem.sh/docs/actions/public/watchEvent
- JSON-RPC Methods:
  - **RPC Provider supports `eth_newFilter`:**
    - Calls [`eth_newFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newfilter) to create a filter (called on initialize).
    - On a polling interval, it will call [`eth_getFilterChanges`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getfilterchanges).
  - **RPC Provider does not support `eth_newFilter`:**
    - Calls [`eth_getLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getlogs) for each block between the polling interval.

**Remarks**

This Action will batch up all the Event Logs found within the [`pollingInterval`](https://viem.sh/docs/actions/public/watchEvent#pollinginterval-optional), and invoke them via [`onLogs`](https://viem.sh/docs/actions/public/watchEvent#onLogs).

`watchEvent` will attempt to create an [Event Filter](https://viem.sh/docs/actions/public/createEventFilter) and listen to changes to the Filter per polling interval, however, if the RPC Provider does not support Filters (e.g. `eth_newFilter`), then `watchEvent` will fall back to using [`getLogs`](https://viem.sh/docs/actions/public/getLogs) instead.

**Example**

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const unwatch = client.watchEvent({
  onLogs: (logs) => console.log(logs),
})
```

▪ **memoryClient.watchPendingTransactions**: (`args`) => `WatchPendingTransactionsReturnType`

Watches and returns pending transaction hashes.

- Docs: https://viem.sh/docs/actions/public/watchPendingTransactions
- JSON-RPC Methods:
  - When `poll: true`
    - Calls [`eth_newPendingTransactionFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newpendingtransactionfilter) to initialize the filter.
    - Calls [`eth_getFilterChanges`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getFilterChanges) on a polling interval.
  - When `poll: false` & WebSocket Transport, uses a WebSocket subscription via [`eth_subscribe`](https://docs.alchemy.com/reference/eth-subscribe-polygon) and the `"newPendingTransactions"` event.

**Remarks**

This Action will batch up all the pending transactions found within the [`pollingInterval`](https://viem.sh/docs/actions/public/watchPendingTransactions#pollinginterval-optional), and invoke them via [`onTransactions`](https://viem.sh/docs/actions/public/watchPendingTransactions#ontransactions).

**Example**

```ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
const unwatch = await client.watchPendingTransactions({
  onTransactions: (hashes) => console.log(hashes),
})
```

#### Overrides

JsonRpcApiProvider.constructor

#### Source

[extensions/ethers/src/TevmProvider.js:172](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/TevmProvider.js#L172)

## Properties

### #private

> **`private`** **#private**: `any`

#### Inherited from

JsonRpcApiProvider.#private

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:212

***

### #private

> **`private`** **#private**: `any`

#### Inherited from

JsonRpcApiProvider.#private

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:253

***

### tevm

> **tevm**: `object` & `Eip1193RequestProvider` & `TevmActionsApi` & `object`

An instance of the TevmClient interface.

#### See

[Tevm Client reference](https://tevm.sh/reference/tevm/client-types/type-aliases/tevmclient/)

#### Example

```typescript
import {TevmProvider} from '@tevm/ethers'
import {createScript} from 'tevm'

const provider = await TevmProvider.createMemoryProvider({
  fork: {
    url: 'https://mainnet.optimism.io',
  },
})

const addContract = createScript({
  name: 'AddContract',
  humanReadableAbi: [
    'function add(uint256 a, uint256 b) public pure returns (uint256)',
  ],
  deployedBytecode: '0x608060405234801561000f575f80fd5b5060043610610029575f3560e01c8063771602f71461002d575b5f80fd5b610047600480360381019061004291906100a9565b61005d565b60405161005491906100f6565b60405180910390f35b5f818361006a919061013c565b905092915050565b5f80fd5b5f819050919050565b61008881610076565b8114610092575f80fd5b50565b5f813590506100a38161007f565b92915050565b5f80604083850312156100bf576100be610072565b5b5f6100cc85828601610095565b92505060206100dd85828601610095565b9150509250929050565b6100f081610076565b82525050565b5f6020820190506101095f8301846100e7565b92915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f61014682610076565b915061015183610076565b92508282019050808211156101695761016861010f565b5b9291505056fea2646970667358221220a8f4b7187c62760aefc097c1827799c61a6df322acc9d7575862a525f9aa59a364736f6c63430008170033',
  bytecode: '0x608060405234801561000f575f80fd5b506101a58061001d5f395ff3fe608060405234801561000f575f80fd5b5060043610610029575f3560e01c8063771602f71461002d575b5f80fd5b610047600480360381019061004291906100a9565b61005d565b60405161005491906100f6565b60405180910390f35b5f818361006a919061013c565b905092915050565b5f80fd5b5f819050919050565b61008881610076565b8114610092575f80fd5b50565b5f813590506100a38161007f565b92915050565b5f80604083850312156100bf576100be610072565b5b5f6100cc85828601610095565b92505060206100dd85828601610095565b9150509250929050565b6100f081610076565b82525050565b5f6020820190506101095f8301846100e7565b92915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f61014682610076565b915061015183610076565b92508282019050808211156101695761016861010f565b5b9291505056fea2646970667358221220a8f4b7187c62760aefc097c1827799c61a6df322acc9d7575862a525f9aa59a364736f6c63430008170033',
} as const)

const result = await provider.tevm.script(addContract.read.add(390n, 30n))

console.log(result)
//  createdAddresses: new Set(),
//  data: 420n,
//  executionGasUsed: 927n,
//  gas: 16776288n,
//  logs: [],
//  rawData: '0x00000000000000000000000000000000000000000000000000000000000001a4',
//  selfdestruct: new Set(),
```

#### Type declaration

##### extend

> **`readonly`** **extend**: \<`TExtension`\>(`decorator`) => `BaseClient`\<`"fork"` \| `"normal"`, `object` & `TExtension`\>

Extends the base client with additional functionality. This enables optimal code splitting
and extensibility

###### Type parameters

▪ **TExtension** extends `Record`\<`string`, `any`\>

###### Parameters

▪ **decorator**: (`client`) => `TExtension`

##### forkUrl

> **`readonly`** **forkUrl**?: `string`

Fork url if the EVM is forked

###### Example

```ts
const client = createMemoryClient({ forkUrl: 'https://mainnet.infura.io/v3/your-api-key' })
console.log(client.forkUrl)
```

##### getReceiptsManager

> **`readonly`** **getReceiptsManager**: () => `Promise`\<`ReceiptsManager`\>

Interface for querying receipts and historical state

##### getTxPool

> **`readonly`** **getTxPool**: () => `Promise`\<`TxPool`\>

Gets the pool of pending transactions to be included in next block

##### getVm

> **`readonly`** **getVm**: () => `Promise`\<`Vm`\>

Internal instance of the VM. Can be used for lower level operations.
Normally not recomended to use unless building libraries or extensions
on top of Tevm.

##### logger

> **`readonly`** **logger**: `Logger`

The logger instance

##### miningConfig

> **`readonly`** **miningConfig**: `MiningConfig`

The configuration for mining. Defaults to 'auto'
- 'auto' will mine a block on every transaction
- 'interval' will mine a block every `interval` milliseconds
- 'manual' will not mine a block automatically and requires a manual call to `mineBlock`

##### mode

> **`readonly`** **mode**: `"fork"` \| `"normal"`

The mode the current client is running in
`fork` mode will fetch and cache all state from the block forked from the provided URL
`normal` mode will not fetch any state and will only run the EVM in memory

###### Example

```ts
let client = createMemoryClient()
console.log(client.mode) // 'normal'
client = createMemoryClient({ forkUrl: 'https://mainnet.infura.io/v3/your-api-key' })
console.log(client.mode) // 'fork'
```

##### ready

> **`readonly`** **ready**: () => `Promise`\<`true`\>

Returns promise that resulves when the client is ready
The client is usable without calling this method but may
have extra latency on the first call from initialization

###### Example

```ts
const client = createMemoryClient()
await client.ready()
```

#### Type declaration

##### request

> **request**: `EIP1193RequestFn`

##### send

> **send**: `TevmJsonRpcRequestHandler`

##### sendBulk

> **sendBulk**: `TevmJsonRpcBulkRequestHandler`

#### Source

[extensions/ethers/src/TevmProvider.js:167](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/TevmProvider.js#L167)

## Accessors

### \_network

> **`get`** **\_network**(): `Network`

Gets the [[Network]] this provider has committed to. On each call, the network
 is detected, and if it has changed, the call will reject.

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:224

***

### destroyed

> **`get`** **destroyed**(): `boolean`

If this provider has been destroyed using the [[destroy]] method.

 Once destroyed, all resources are reclaimed, internal event loops
 and timers are cleaned up and no further requests may be sent to
 the provider.

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:419

***

### disableCcipRead

> **`get`** **disableCcipRead**(): `boolean`

Prevent any CCIP-read operation, regardless of whether requested
 in a [[call]] using ``enableCcipRead``.

> **`set`** **disableCcipRead**(`value`): `void`

#### Parameters

▪ **value**: `boolean`

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:282

***

### paused

> **`get`** **paused**(): `boolean`

Whether the provider is currently paused.

 A paused provider will not emit any events, and generally should
 not make any requests to the network, but that is up to sub-classes
 to manage.

 Setting ``paused = true`` is identical to calling ``.pause(false)``,
 which will buffer any events that occur while paused until the
 provider is unpaused.

> **`set`** **paused**(`pause`): `void`

#### Parameters

▪ **pause**: `boolean`

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:438

***

### plugins

> **`get`** **plugins**(): `AbstractProviderPlugin`[]

Returns all the registered plug-ins.

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:269

***

### pollingInterval

> **`get`** **pollingInterval**(): `number`

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:260

***

### provider

> **`get`** **provider**(): `this`

Returns ``this``, to allow an **AbstractProvider** to implement
 the [[ContractRunner]] interface.

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:265

***

### ready

> **`get`** **ready**(): `boolean`

Returns true only if the [[_start]] has been called.

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:270

## Methods

### \_clearTimeout()

> **\_clearTimeout**(`timerId`): `void`

Clear a timer created using the [[_setTimeout]] method.

#### Parameters

▪ **timerId**: `number`

#### Inherited from

JsonRpcApiProvider.\_clearTimeout

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:374

***

### \_detectNetwork()

> **\_detectNetwork**(): `Promise`\<`Network`\>

Sub-classes may override this; it detects the *actual* network that
 we are **currently** connected to.

 Keep in mind that [[send]] may only be used once [[ready]], otherwise the
 _send primitive must be used instead.

#### Inherited from

JsonRpcApiProvider.\_detectNetwork

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:245

***

### \_forEachSubscriber()

> **\_forEachSubscriber**(`func`): `void`

Perform %%func%% on each subscriber.

#### Parameters

▪ **func**: (`s`) => `void`

#### Inherited from

JsonRpcApiProvider.\_forEachSubscriber

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:387

***

### \_getAddress()

> **\_getAddress**(`address`): `string` \| `Promise`\<`string`\>

Returns or resolves to the address for %%address%%, resolving ENS
 names and [[Addressable]] objects and returning if already an
 address.

#### Parameters

▪ **address**: `AddressLike`

#### Inherited from

JsonRpcApiProvider.\_getAddress

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:332

***

### \_getBlockTag()

> **\_getBlockTag**(`blockTag`?): `string` \| `Promise`\<`string`\>

Returns or resolves to a valid block tag for %%blockTag%%, resolving
 negative values and returning if already a valid block tag.

#### Parameters

▪ **blockTag?**: `BlockTag`

#### Inherited from

JsonRpcApiProvider.\_getBlockTag

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:337

***

### \_getFilter()

> **\_getFilter**(`filter`): `PerformActionFilter` \| `Promise`\<`PerformActionFilter`\>

Returns or resolves to a filter for %%filter%%, resolving any ENS
 names or [[Addressable]] object and returning if already a valid
 filter.

#### Parameters

▪ **filter**: `Filter` \| `FilterByBlockHash`

#### Inherited from

JsonRpcApiProvider.\_getFilter

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:343

***

### \_getOption()

> **\_getOption**\<`K`\>(`key`): `JsonRpcApiProviderOptions`[`K`]

Returns the value associated with the option %%key%%.

 Sub-classes can use this to inquire about configuration options.

#### Type parameters

▪ **K** extends keyof `JsonRpcApiProviderOptions`

#### Parameters

▪ **key**: `K`

#### Inherited from

JsonRpcApiProvider.\_getOption

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:219

***

### \_getProvider()

> **\_getProvider**(`chainId`): `AbstractProvider`

#### Parameters

▪ **chainId**: `number`

#### Inherited from

JsonRpcApiProvider.\_getProvider

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:364

***

### \_getSubscriber()

> **\_getSubscriber**(`sub`): `Subscriber`

Return a Subscriber that will manage the %%sub%%.

 Sub-classes may override this to modify the behavior of
 subscription management.

#### Parameters

▪ **sub**: `Subscription`

#### Inherited from

JsonRpcApiProvider.\_getSubscriber

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:266

***

### \_getTransactionRequest()

> **\_getTransactionRequest**(`_request`): `PerformActionTransaction` \| `Promise`\<`PerformActionTransaction`\>

Returns or resovles to a transaction for %%request%%, resolving
 any ENS names or [[Addressable]] and returning if already a valid
 transaction.

#### Parameters

▪ **\_request**: `TransactionRequest`

#### Inherited from

JsonRpcApiProvider.\_getTransactionRequest

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:349

***

### \_perform()

> **\_perform**(`req`): `Promise`\<`any`\>

Resolves to the non-normalized value by performing %%req%%.

 Sub-classes may override this to modify behavior of actions,
 and should generally call ``super._perform`` as a fallback.

#### Parameters

▪ **req**: `PerformActionRequest`

#### Inherited from

JsonRpcApiProvider.\_perform

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:237

***

### \_recoverSubscriber()

> **\_recoverSubscriber**(`oldSub`, `newSub`): `void`

If a [[Subscriber]] fails and needs to replace itself, this
 method may be used.

 For example, this is used for providers when using the
 ``eth_getFilterChanges`` method, which can return null if state
 filters are not supported by the backend, allowing the Subscriber
 to swap in a [[PollingEventSubscriber]].

#### Parameters

▪ **oldSub**: `Subscriber`

▪ **newSub**: `Subscriber`

#### Inherited from

JsonRpcApiProvider.\_recoverSubscriber

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:402

***

### \_send()

> **\_send**(`payload`): `Promise`\<(`JsonRpcResult` \| `JsonRpcError`)[]\>

Sends a JSON-RPC %%payload%% (or a batch) to the underlying tevm instance.

#### Parameters

▪ **payload**: `JsonRpcPayload` \| `JsonRpcPayload`[]

#### Overrides

JsonRpcApiProvider.\_send

#### Source

[extensions/ethers/src/TevmProvider.js:186](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/TevmProvider.js#L186)

***

### \_setTimeout()

> **\_setTimeout**(`_func`, `timeout`?): `number`

Create a timer that will execute %%func%% after at least %%timeout%%
 (in ms). If %%timeout%% is unspecified, then %%func%% will execute
 in the next event loop.

 [Pausing](AbstractProvider-paused) the provider will pause any
 associated timers.

#### Parameters

▪ **\_func**: () => `void`

▪ **timeout?**: `number`

#### Inherited from

JsonRpcApiProvider.\_setTimeout

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:383

***

### \_start()

> **\_start**(): `void`

Sub-classes **MUST** call this. Until [[_start]] has been called, no calls
 will be passed to [[_send]] from [[send]]. If it is overridden, then
 ``super._start()`` **MUST** be called.

 Calling it multiple times is safe and has no effect.

#### Inherited from

JsonRpcApiProvider.\_start

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:253

***

### \_waitUntilReady()

> **\_waitUntilReady**(): `Promise`\<`void`\>

Resolves once the [[_start]] has been called. This can be used in
 sub-classes to defer sending data until the connection has been
 established.

#### Inherited from

JsonRpcApiProvider.\_waitUntilReady

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:259

***

### \_wrapBlock()

> **\_wrapBlock**(`value`, `network`): `Block`

Provides the opportunity for a sub-class to wrap a block before
 returning it, to add additional properties or an alternate
 sub-class of [[Block]].

#### Parameters

▪ **value**: `BlockParams`

▪ **network**: `Network`

#### Inherited from

JsonRpcApiProvider.\_wrapBlock

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:293

***

### \_wrapLog()

> **\_wrapLog**(`value`, `network`): `Log`

Provides the opportunity for a sub-class to wrap a log before
 returning it, to add additional properties or an alternate
 sub-class of [[Log]].

#### Parameters

▪ **value**: `LogParams`

▪ **network**: `Network`

#### Inherited from

JsonRpcApiProvider.\_wrapLog

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:299

***

### \_wrapTransactionReceipt()

> **\_wrapTransactionReceipt**(`value`, `network`): `TransactionReceipt`

Provides the opportunity for a sub-class to wrap a transaction
 receipt before returning it, to add additional properties or an
 alternate sub-class of [[TransactionReceipt]].

#### Parameters

▪ **value**: `TransactionReceiptParams`

▪ **network**: `Network`

#### Inherited from

JsonRpcApiProvider.\_wrapTransactionReceipt

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:305

***

### \_wrapTransactionResponse()

> **\_wrapTransactionResponse**(`tx`, `network`): `TransactionResponse`

Provides the opportunity for a sub-class to wrap a transaction
 response before returning it, to add additional properties or an
 alternate sub-class of [[TransactionResponse]].

#### Parameters

▪ **tx**: `TransactionResponseParams`

▪ **network**: `Network`

#### Inherited from

JsonRpcApiProvider.\_wrapTransactionResponse

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:311

***

### addListener()

> **addListener**(`event`, `listener`): `Promise`\<[`TevmProvider`](TevmProvider.md)\>

#### Parameters

▪ **event**: `ProviderEvent`

▪ **listener**: `Listener`

#### Inherited from

JsonRpcApiProvider.addListener

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:410

***

### attachPlugin()

> **attachPlugin**(`plugin`): `this`

Attach a new plug-in.

#### Parameters

▪ **plugin**: `AbstractProviderPlugin`

#### Inherited from

JsonRpcApiProvider.attachPlugin

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:273

***

### broadcastTransaction()

> **broadcastTransaction**(`signedTx`): `Promise`\<`TransactionResponse`\>

#### Parameters

▪ **signedTx**: `string`

#### Inherited from

JsonRpcApiProvider.broadcastTransaction

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:358

***

### call()

> **call**(`_tx`): `Promise`\<`string`\>

#### Parameters

▪ **\_tx**: `TransactionRequest`

#### Inherited from

JsonRpcApiProvider.call

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:353

***

### ccipReadFetch()

> **ccipReadFetch**(`tx`, `calldata`, `urls`): `Promise`\<`null` \| `string`\>

Resolves to the data for executing the CCIP-read operations.

#### Parameters

▪ **tx**: `PerformActionTransaction`

▪ **calldata**: `string`

▪ **urls**: `string`[]

#### Inherited from

JsonRpcApiProvider.ccipReadFetch

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:287

***

### destroy()

> **destroy**(): `void`

#### Inherited from

JsonRpcApiProvider.destroy

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:320

***

### emit()

> **emit**(`event`, ...`args`): `Promise`\<`boolean`\>

#### Parameters

▪ **event**: `ProviderEvent`

▪ ...**args**: `any`[]

#### Inherited from

JsonRpcApiProvider.emit

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:405

***

### estimateGas()

> **estimateGas**(`_tx`): `Promise`\<`bigint`\>

#### Parameters

▪ **\_tx**: `TransactionRequest`

#### Inherited from

JsonRpcApiProvider.estimateGas

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:352

***

### getAvatar()

> **getAvatar**(`name`): `Promise`\<`null` \| `string`\>

#### Parameters

▪ **name**: `string`

#### Inherited from

JsonRpcApiProvider.getAvatar

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:366

***

### getBalance()

> **getBalance**(`address`, `blockTag`?): `Promise`\<`bigint`\>

#### Parameters

▪ **address**: `AddressLike`

▪ **blockTag?**: `BlockTag`

#### Inherited from

JsonRpcApiProvider.getBalance

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:354

***

### getBlock()

> **getBlock**(`block`, `prefetchTxs`?): `Promise`\<`null` \| `Block`\>

#### Parameters

▪ **block**: `BlockTag`

▪ **prefetchTxs?**: `boolean`

#### Inherited from

JsonRpcApiProvider.getBlock

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:359

***

### getBlockNumber()

> **getBlockNumber**(): `Promise`\<`number`\>

#### Inherited from

JsonRpcApiProvider.getBlockNumber

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:326

***

### getCode()

> **getCode**(`address`, `blockTag`?): `Promise`\<`string`\>

#### Parameters

▪ **address**: `AddressLike`

▪ **blockTag?**: `BlockTag`

#### Inherited from

JsonRpcApiProvider.getCode

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:356

***

### getFeeData()

> **getFeeData**(): `Promise`\<`FeeData`\>

#### Inherited from

JsonRpcApiProvider.getFeeData

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:351

***

### getLogs()

> **getLogs**(`_filter`): `Promise`\<`Log`[]\>

#### Parameters

▪ **\_filter**: `Filter` \| `FilterByBlockHash`

#### Inherited from

JsonRpcApiProvider.getLogs

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:363

***

### getNetwork()

> **getNetwork**(): `Promise`\<`Network`\>

#### Inherited from

JsonRpcApiProvider.getNetwork

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:350

***

### getPlugin()

> **getPlugin**\<`T`\>(`name`): `null` \| `T`

Get a plugin by name.

#### Type parameters

▪ **T** extends `AbstractProviderPlugin` = `AbstractProviderPlugin`

#### Parameters

▪ **name**: `string`

#### Inherited from

JsonRpcApiProvider.getPlugin

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:277

***

### getResolver()

> **getResolver**(`name`): `Promise`\<`null` \| `EnsResolver`\>

#### Parameters

▪ **name**: `string`

#### Inherited from

JsonRpcApiProvider.getResolver

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:365

***

### getRpcError()

> **getRpcError**(`payload`, `_error`): `Error`

Returns an ethers-style Error for the given JSON-RPC error
 %%payload%%, coalescing the various strings and error shapes
 that different nodes return, coercing them into a machine-readable
 standardized error.

#### Parameters

▪ **payload**: `JsonRpcPayload`

▪ **\_error**: `JsonRpcError`

#### Inherited from

JsonRpcApiProvider.getRpcError

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:291

***

### getRpcRequest()

> **getRpcRequest**(`req`): `null` \| `object`

Returns the request method and arguments required to perform
 %%req%%.

#### Parameters

▪ **req**: `PerformActionRequest`

#### Inherited from

JsonRpcApiProvider.getRpcRequest

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:281

***

### getRpcTransaction()

> **getRpcTransaction**(`tx`): `JsonRpcTransactionRequest`

Returns %%tx%% as a normalized JSON-RPC transaction request,
 which has all values hexlified and any numeric values converted
 to Quantity values.

#### Parameters

▪ **tx**: `TransactionRequest`

#### Inherited from

JsonRpcApiProvider.getRpcTransaction

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:276

***

### getSigner()

> **getSigner**(`address`?): `Promise`\<`JsonRpcSigner`\>

Resolves to the [[Signer]] account for  %%address%% managed by
 the client.

 If the %%address%% is a number, it is used as an index in the
 the accounts from [[listAccounts]].

 This can only be used on clients which manage accounts (such as
 Geth with imported account or MetaMask).

 Throws if the account doesn't exist.

#### Parameters

▪ **address?**: `string` \| `number`

#### Inherited from

JsonRpcApiProvider.getSigner

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:318

***

### getStorage()

> **getStorage**(`address`, `_position`, `blockTag`?): `Promise`\<`string`\>

#### Parameters

▪ **address**: `AddressLike`

▪ **\_position**: `BigNumberish`

▪ **blockTag?**: `BlockTag`

#### Inherited from

JsonRpcApiProvider.getStorage

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:357

***

### getTransaction()

> **getTransaction**(`hash`): `Promise`\<`null` \| `TransactionResponse`\>

#### Parameters

▪ **hash**: `string`

#### Inherited from

JsonRpcApiProvider.getTransaction

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:360

***

### getTransactionCount()

> **getTransactionCount**(`address`, `blockTag`?): `Promise`\<`number`\>

#### Parameters

▪ **address**: `AddressLike`

▪ **blockTag?**: `BlockTag`

#### Inherited from

JsonRpcApiProvider.getTransactionCount

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:355

***

### getTransactionReceipt()

> **getTransactionReceipt**(`hash`): `Promise`\<`null` \| `TransactionReceipt`\>

#### Parameters

▪ **hash**: `string`

#### Inherited from

JsonRpcApiProvider.getTransactionReceipt

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:361

***

### getTransactionResult()

> **getTransactionResult**(`hash`): `Promise`\<`null` \| `string`\>

#### Parameters

▪ **hash**: `string`

#### Inherited from

JsonRpcApiProvider.getTransactionResult

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:362

***

### listAccounts()

> **listAccounts**(): `Promise`\<`JsonRpcSigner`[]\>

#### Inherited from

JsonRpcApiProvider.listAccounts

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:319

***

### listenerCount()

> **listenerCount**(`event`?): `Promise`\<`number`\>

#### Parameters

▪ **event?**: `ProviderEvent`

#### Inherited from

JsonRpcApiProvider.listenerCount

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:406

***

### listeners()

> **listeners**(`event`?): `Promise`\<`Listener`[]\>

#### Parameters

▪ **event?**: `ProviderEvent`

#### Inherited from

JsonRpcApiProvider.listeners

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:407

***

### lookupAddress()

> **lookupAddress**(`address`): `Promise`\<`null` \| `string`\>

#### Parameters

▪ **address**: `string`

#### Inherited from

JsonRpcApiProvider.lookupAddress

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:368

***

### off()

> **off**(`event`, `listener`?): `Promise`\<[`TevmProvider`](TevmProvider.md)\>

#### Parameters

▪ **event**: `ProviderEvent`

▪ **listener?**: `Listener`

#### Inherited from

JsonRpcApiProvider.off

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:408

***

### on()

> **on**(`event`, `listener`): `Promise`\<[`TevmProvider`](TevmProvider.md)\>

#### Parameters

▪ **event**: `ProviderEvent`

▪ **listener**: `Listener`

#### Inherited from

JsonRpcApiProvider.on

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:403

***

### once()

> **once**(`event`, `listener`): `Promise`\<[`TevmProvider`](TevmProvider.md)\>

#### Parameters

▪ **event**: `ProviderEvent`

▪ **listener**: `Listener`

#### Inherited from

JsonRpcApiProvider.once

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:404

***

### pause()

> **pause**(`dropWhilePaused`?): `void`

Pause the provider. If %%dropWhilePaused%%, any events that occur
 while paused are dropped, otherwise all events will be emitted once
 the provider is unpaused.

#### Parameters

▪ **dropWhilePaused?**: `boolean`

#### Inherited from

JsonRpcApiProvider.pause

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:445

***

### removeAllListeners()

> **removeAllListeners**(`event`?): `Promise`\<[`TevmProvider`](TevmProvider.md)\>

#### Parameters

▪ **event?**: `ProviderEvent`

#### Inherited from

JsonRpcApiProvider.removeAllListeners

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:409

***

### removeListener()

> **removeListener**(`event`, `listener`): `Promise`\<[`TevmProvider`](TevmProvider.md)\>

#### Parameters

▪ **event**: `ProviderEvent`

▪ **listener**: `Listener`

#### Inherited from

JsonRpcApiProvider.removeListener

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:411

***

### resolveName()

> **resolveName**(`name`): `Promise`\<`null` \| `string`\>

#### Parameters

▪ **name**: `string`

#### Inherited from

JsonRpcApiProvider.resolveName

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:367

***

### resume()

> **resume**(): `void`

Resume the provider.

#### Inherited from

JsonRpcApiProvider.resume

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:449

***

### send()

> **send**(`method`, `params`): `Promise`\<`any`\>

Requests the %%method%% with %%params%% via the JSON-RPC protocol
 over the underlying channel. This can be used to call methods
 on the backend that do not have a high-level API within the Provider
 API.

 This method queues requests according to the batch constraints
 in the options, assigns the request a unique ID.

 **Do NOT override** this method in sub-classes; instead
 override [[_send]] or force the options values in the
 call to the constructor to modify this method's behavior.

#### Parameters

▪ **method**: `string`

▪ **params**: `any`[] \| `Record`\<`string`, `any`\>

#### Inherited from

JsonRpcApiProvider.send

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:305

***

### waitForBlock()

> **waitForBlock**(`blockTag`?): `Promise`\<`Block`\>

#### Parameters

▪ **blockTag?**: `BlockTag`

#### Inherited from

JsonRpcApiProvider.waitForBlock

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:370

***

### waitForTransaction()

> **waitForTransaction**(`hash`, `_confirms`?, `timeout`?): `Promise`\<`null` \| `TransactionReceipt`\>

#### Parameters

▪ **hash**: `string`

▪ **\_confirms?**: `null` \| `number`

▪ **timeout?**: `null` \| `number`

#### Inherited from

JsonRpcApiProvider.waitForTransaction

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:369

***

### createMemoryProvider()

> **`static`** **`readonly`** **createMemoryProvider**(`options`): `Promise`\<[`TevmProvider`](TevmProvider.md)\>

Creates a new TevmProvider instance with a TevmMemoryClient.

#### Parameters

▪ **options**: `BaseClientOptions`

Options to create a new TevmProvider.

#### Returns

A new TevmProvider instance.

#### See

[Tevm Clients Docs](https://tevm.sh/learn/clients/)

#### Example

```ts
import { TevmProvider } from '@tevm/ethers'

const provider = await TevmProvider.createMemoryProvider()

const blockNumber = await provider.getBlockNumber()
```

#### Source

[extensions/ethers/src/TevmProvider.js:123](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/TevmProvider.js#L123)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
