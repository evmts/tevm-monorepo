---
editUrl: false
next: false
prev: false
title: "TevmProvider"
---

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

### new TevmProvider(tevm)

> **new TevmProvider**(`tevm`): [`TevmProvider`](/reference/tevm/ethers/classes/tevmprovider/)

#### Parameters

▪ **tevm**: [`TevmClient`](/reference/tevm/client-types/type-aliases/tevmclient/)

An instance of the Tevm interface.

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

> **tevm**: [`TevmClient`](/reference/tevm/client-types/type-aliases/tevmclient/)

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

> **addListener**(`event`, `listener`): `Promise`\<[`TevmProvider`](/reference/tevm/ethers/classes/tevmprovider/)\>

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

> **off**(`event`, `listener`?): `Promise`\<[`TevmProvider`](/reference/tevm/ethers/classes/tevmprovider/)\>

#### Parameters

▪ **event**: `ProviderEvent`

▪ **listener?**: `Listener`

#### Inherited from

JsonRpcApiProvider.off

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:408

***

### on()

> **on**(`event`, `listener`): `Promise`\<[`TevmProvider`](/reference/tevm/ethers/classes/tevmprovider/)\>

#### Parameters

▪ **event**: `ProviderEvent`

▪ **listener**: `Listener`

#### Inherited from

JsonRpcApiProvider.on

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:403

***

### once()

> **once**(`event`, `listener`): `Promise`\<[`TevmProvider`](/reference/tevm/ethers/classes/tevmprovider/)\>

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

> **removeAllListeners**(`event`?): `Promise`\<[`TevmProvider`](/reference/tevm/ethers/classes/tevmprovider/)\>

#### Parameters

▪ **event?**: `ProviderEvent`

#### Inherited from

JsonRpcApiProvider.removeAllListeners

#### Source

node\_modules/.pnpm/ethers@6.10.0/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:409

***

### removeListener()

> **removeListener**(`event`, `listener`): `Promise`\<[`TevmProvider`](/reference/tevm/ethers/classes/tevmprovider/)\>

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

> **`static`** **`readonly`** **createMemoryProvider**(`options`): `Promise`\<[`TevmProvider`](/reference/tevm/ethers/classes/tevmprovider/)\>

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
