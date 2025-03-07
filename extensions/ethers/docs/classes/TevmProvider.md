[**@tevm/ethers**](../README.md) • **Docs**

***

[@tevm/ethers](../globals.md) / TevmProvider

# Class: TevmProvider

An [ethers JsonRpcApiProvider](https://docs.ethers.org/v6/api/providers/jsonrpc/#JsonRpcApiProvider) using a tevm MemoryClient as it's backend

## TevmProvider

The TevmProvider class is an instance of an ethers provider using Tevm as it's backend. The `createMemoryProvider` method can be used to create an in memory instance of tevm using a [memoryClient](../clients/) as it's backend.

## Examples

```typescript
import {TevmProvider} from '@tevm/ethers'

const provider = await TevmProvider.createMemoryProvider({
  fork: {
    transport: http('https://mainnet.optimism.io')({}),
  },
})
```

## Using with an http client

The constructor takes any instance of tevm including the `httpClient`.

```typescript
import {createHttpClient} from '@tevm/http-client'
const provider = new TevmProvider(createHttpClient({url: 'https://localhost:8080'}))
```

## Ethers provider support

You can use all the normal ethers apis to interact with tevm.

```typescript
const provider = await TevmProvider.createMemoryProvider({
  fork: {
    transport: http('https://mainnet.optimism.io')({}),
  },
})

console.log(
  await provider.getBlockNumber()
) // 10
```

## Tevm actions support

The entire [tevm api](../clients/) exists on the `tevm` property. For example the `tevm.script` method can be used to run an arbitrary script.

```typescript
import {TevmProvider} from '@tevm/ethers'
import {createContract} from 'tevm'

const provider = await TevmProvider.createMemoryProvider({
  fork: {
    transport: http('https://mainnet.optimism.io')({}),
  },
})

const addContract = createContract({
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

### new TevmProvider()

> **new TevmProvider**(`client`): [`TevmProvider`](TevmProvider.md)

#### Parameters

• **client**: `TevmSendApi` & `TevmActionsApi` \| `object`

An instance of a tevm Memory client or TevmNode with TevmSendApi

#### Returns

[`TevmProvider`](TevmProvider.md)

#### Overrides

`JsonRpcApiProvider.constructor`

#### Defined in

[extensions/ethers/src/TevmProvider.js:173](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/TevmProvider.js#L173)

## Properties

### tevm

> **tevm**: `TevmSendApi` & `TevmActionsApi`

An instance of the TevmClient interface.

#### See

[Tevm Client reference](https://tevm.sh/reference/tevm/client-types/type-aliases/tevmclient/)

#### Example

```typescript
import {TevmProvider} from '@tevm/ethers'
import {createContract} from 'tevm'

const provider = await TevmProvider.createMemoryProvider({
  fork: {
    transport: http('https://mainnet.optimism.io')({}),
  },
})

const addContract = createContract({
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

#### Defined in

[extensions/ethers/src/TevmProvider.js:168](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/TevmProvider.js#L168)

## Accessors

### \_network

> `get` **\_network**(): `Network`

Gets the [[Network]] this provider has committed to. On each call, the network
 is detected, and if it has changed, the call will reject.

#### Returns

`Network`

#### Inherited from

`JsonRpcApiProvider._network`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:224

***

### destroyed

> `get` **destroyed**(): `boolean`

If this provider has been destroyed using the [[destroy]] method.

 Once destroyed, all resources are reclaimed, internal event loops
 and timers are cleaned up and no further requests may be sent to
 the provider.

#### Returns

`boolean`

#### Inherited from

`JsonRpcApiProvider.destroyed`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:419

***

### disableCcipRead

> `get` **disableCcipRead**(): `boolean`

Prevent any CCIP-read operation, regardless of whether requested
 in a [[call]] using ``enableCcipRead``.

> `set` **disableCcipRead**(`value`): `void`

#### Parameters

• **value**: `boolean`

#### Returns

`boolean`

#### Inherited from

`JsonRpcApiProvider.disableCcipRead`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:282

***

### paused

> `get` **paused**(): `boolean`

Whether the provider is currently paused.

 A paused provider will not emit any events, and generally should
 not make any requests to the network, but that is up to sub-classes
 to manage.

 Setting ``paused = true`` is identical to calling ``.pause(false)``,
 which will buffer any events that occur while paused until the
 provider is unpaused.

> `set` **paused**(`pause`): `void`

#### Parameters

• **pause**: `boolean`

#### Returns

`boolean`

#### Inherited from

`JsonRpcApiProvider.paused`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:438

***

### plugins

> `get` **plugins**(): `AbstractProviderPlugin`[]

Returns all the registered plug-ins.

#### Returns

`AbstractProviderPlugin`[]

#### Inherited from

`JsonRpcApiProvider.plugins`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:269

***

### pollingInterval

> `get` **pollingInterval**(): `number`

#### Returns

`number`

#### Inherited from

`JsonRpcApiProvider.pollingInterval`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:260

***

### provider

> `get` **provider**(): `this`

Returns ``this``, to allow an **AbstractProvider** to implement
 the [[ContractRunner]] interface.

#### Returns

`this`

#### Inherited from

`JsonRpcApiProvider.provider`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:265

***

### ready

> `get` **ready**(): `boolean`

Returns true only if the [[_start]] has been called.

#### Returns

`boolean`

#### Inherited from

`JsonRpcApiProvider.ready`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:270

## Methods

### \_clearTimeout()

> **\_clearTimeout**(`timerId`): `void`

Clear a timer created using the [[_setTimeout]] method.

#### Parameters

• **timerId**: `number`

#### Returns

`void`

#### Inherited from

`JsonRpcApiProvider._clearTimeout`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:374

***

### \_detectNetwork()

> **\_detectNetwork**(): `Promise`\<`Network`\>

Sub-classes may override this; it detects the *actual* network that
 we are **currently** connected to.

 Keep in mind that [[send]] may only be used once [[ready]], otherwise the
 _send primitive must be used instead.

#### Returns

`Promise`\<`Network`\>

#### Inherited from

`JsonRpcApiProvider._detectNetwork`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:245

***

### \_forEachSubscriber()

> **\_forEachSubscriber**(`func`): `void`

Perform %%func%% on each subscriber.

#### Parameters

• **func**

#### Returns

`void`

#### Inherited from

`JsonRpcApiProvider._forEachSubscriber`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:387

***

### \_getAddress()

> **\_getAddress**(`address`): `string` \| `Promise`\<`string`\>

Returns or resolves to the address for %%address%%, resolving ENS
 names and [[Addressable]] objects and returning if already an
 address.

#### Parameters

• **address**: `AddressLike`

#### Returns

`string` \| `Promise`\<`string`\>

#### Inherited from

`JsonRpcApiProvider._getAddress`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:332

***

### \_getBlockTag()

> **\_getBlockTag**(`blockTag`?): `string` \| `Promise`\<`string`\>

Returns or resolves to a valid block tag for %%blockTag%%, resolving
 negative values and returning if already a valid block tag.

#### Parameters

• **blockTag?**: `BlockTag`

#### Returns

`string` \| `Promise`\<`string`\>

#### Inherited from

`JsonRpcApiProvider._getBlockTag`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:337

***

### \_getFilter()

> **\_getFilter**(`filter`): `PerformActionFilter` \| `Promise`\<`PerformActionFilter`\>

Returns or resolves to a filter for %%filter%%, resolving any ENS
 names or [[Addressable]] object and returning if already a valid
 filter.

#### Parameters

• **filter**: `Filter` \| `FilterByBlockHash`

#### Returns

`PerformActionFilter` \| `Promise`\<`PerformActionFilter`\>

#### Inherited from

`JsonRpcApiProvider._getFilter`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:343

***

### \_getOption()

> **\_getOption**\<`K`\>(`key`): `JsonRpcApiProviderOptions`\[`K`\]

Returns the value associated with the option %%key%%.

 Sub-classes can use this to inquire about configuration options.

#### Type Parameters

• **K** *extends* keyof `JsonRpcApiProviderOptions`

#### Parameters

• **key**: `K`

#### Returns

`JsonRpcApiProviderOptions`\[`K`\]

#### Inherited from

`JsonRpcApiProvider._getOption`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:219

***

### \_getProvider()

> **\_getProvider**(`chainId`): `AbstractProvider`

#### Parameters

• **chainId**: `number`

#### Returns

`AbstractProvider`

#### Inherited from

`JsonRpcApiProvider._getProvider`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:364

***

### \_getSubscriber()

> **\_getSubscriber**(`sub`): `Subscriber`

Return a Subscriber that will manage the %%sub%%.

 Sub-classes may override this to modify the behavior of
 subscription management.

#### Parameters

• **sub**: `Subscription`

#### Returns

`Subscriber`

#### Inherited from

`JsonRpcApiProvider._getSubscriber`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:266

***

### \_getTransactionRequest()

> **\_getTransactionRequest**(`_request`): `PerformActionTransaction` \| `Promise`\<`PerformActionTransaction`\>

Returns or resolves to a transaction for %%request%%, resolving
 any ENS names or [[Addressable]] and returning if already a valid
 transaction.

#### Parameters

• **\_request**: `TransactionRequest`

#### Returns

`PerformActionTransaction` \| `Promise`\<`PerformActionTransaction`\>

#### Inherited from

`JsonRpcApiProvider._getTransactionRequest`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:349

***

### \_perform()

> **\_perform**(`req`): `Promise`\<`any`\>

Resolves to the non-normalized value by performing %%req%%.

 Sub-classes may override this to modify behavior of actions,
 and should generally call ``super._perform`` as a fallback.

#### Parameters

• **req**: `PerformActionRequest`

#### Returns

`Promise`\<`any`\>

#### Inherited from

`JsonRpcApiProvider._perform`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:237

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

• **oldSub**: `Subscriber`

• **newSub**: `Subscriber`

#### Returns

`void`

#### Inherited from

`JsonRpcApiProvider._recoverSubscriber`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:402

***

### \_send()

> **\_send**(`payload`): `Promise`\<(`JsonRpcResult` \| `JsonRpcError`)[]\>

Sends a JSON-RPC %%payload%% (or a batch) to the underlying tevm instance.

#### Parameters

• **payload**: `JsonRpcPayload` \| `JsonRpcPayload`[]

#### Returns

`Promise`\<(`JsonRpcResult` \| `JsonRpcError`)[]\>

#### Overrides

`JsonRpcApiProvider._send`

#### Defined in

[extensions/ethers/src/TevmProvider.js:187](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/TevmProvider.js#L187)

***

### \_setTimeout()

> **\_setTimeout**(`_func`, `timeout`?): `number`

Create a timer that will execute %%func%% after at least %%timeout%%
 (in ms). If %%timeout%% is unspecified, then %%func%% will execute
 in the next event loop.

 [Pausing](AbstractProvider-paused) the provider will pause any
 associated timers.

#### Parameters

• **\_func**

• **timeout?**: `number`

#### Returns

`number`

#### Inherited from

`JsonRpcApiProvider._setTimeout`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:383

***

### \_start()

> **\_start**(): `void`

Sub-classes **MUST** call this. Until [[_start]] has been called, no calls
 will be passed to [[_send]] from [[send]]. If it is overridden, then
 ``super._start()`` **MUST** be called.

 Calling it multiple times is safe and has no effect.

#### Returns

`void`

#### Inherited from

`JsonRpcApiProvider._start`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:253

***

### \_waitUntilReady()

> **\_waitUntilReady**(): `Promise`\<`void`\>

Resolves once the [[_start]] has been called. This can be used in
 sub-classes to defer sending data until the connection has been
 established.

#### Returns

`Promise`\<`void`\>

#### Inherited from

`JsonRpcApiProvider._waitUntilReady`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:259

***

### \_wrapBlock()

> **\_wrapBlock**(`value`, `network`): `Block`

Provides the opportunity for a sub-class to wrap a block before
 returning it, to add additional properties or an alternate
 sub-class of [[Block]].

#### Parameters

• **value**: `BlockParams`

• **network**: `Network`

#### Returns

`Block`

#### Inherited from

`JsonRpcApiProvider._wrapBlock`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:293

***

### \_wrapLog()

> **\_wrapLog**(`value`, `network`): `Log`

Provides the opportunity for a sub-class to wrap a log before
 returning it, to add additional properties or an alternate
 sub-class of [[Log]].

#### Parameters

• **value**: `LogParams`

• **network**: `Network`

#### Returns

`Log`

#### Inherited from

`JsonRpcApiProvider._wrapLog`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:299

***

### \_wrapTransactionReceipt()

> **\_wrapTransactionReceipt**(`value`, `network`): `TransactionReceipt`

Provides the opportunity for a sub-class to wrap a transaction
 receipt before returning it, to add additional properties or an
 alternate sub-class of [[TransactionReceipt]].

#### Parameters

• **value**: `TransactionReceiptParams`

• **network**: `Network`

#### Returns

`TransactionReceipt`

#### Inherited from

`JsonRpcApiProvider._wrapTransactionReceipt`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:305

***

### \_wrapTransactionResponse()

> **\_wrapTransactionResponse**(`tx`, `network`): `TransactionResponse`

Provides the opportunity for a sub-class to wrap a transaction
 response before returning it, to add additional properties or an
 alternate sub-class of [[TransactionResponse]].

#### Parameters

• **tx**: `TransactionResponseParams`

• **network**: `Network`

#### Returns

`TransactionResponse`

#### Inherited from

`JsonRpcApiProvider._wrapTransactionResponse`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:311

***

### addListener()

> **addListener**(`event`, `listener`): `Promise`\<[`TevmProvider`](TevmProvider.md)\>

Alias for [[on]].

#### Parameters

• **event**: `ProviderEvent`

• **listener**: `Listener`

#### Returns

`Promise`\<[`TevmProvider`](TevmProvider.md)\>

#### Inherited from

`JsonRpcApiProvider.addListener`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:410

***

### attachPlugin()

> **attachPlugin**(`plugin`): `this`

Attach a new plug-in.

#### Parameters

• **plugin**: `AbstractProviderPlugin`

#### Returns

`this`

#### Inherited from

`JsonRpcApiProvider.attachPlugin`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:273

***

### broadcastTransaction()

> **broadcastTransaction**(`signedTx`): `Promise`\<`TransactionResponse`\>

Broadcasts the %%signedTx%% to the network, adding it to the
 memory pool of any node for which the transaction meets the
 rebroadcast requirements.

#### Parameters

• **signedTx**: `string`

#### Returns

`Promise`\<`TransactionResponse`\>

#### Inherited from

`JsonRpcApiProvider.broadcastTransaction`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:358

***

### call()

> **call**(`_tx`): `Promise`\<`string`\>

Simulate the execution of %%tx%%. If the call reverts, it will
 throw a [[CallExceptionError]] which includes the revert data.

#### Parameters

• **\_tx**: `TransactionRequest`

#### Returns

`Promise`\<`string`\>

#### Inherited from

`JsonRpcApiProvider.call`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:353

***

### ccipReadFetch()

> **ccipReadFetch**(`tx`, `calldata`, `urls`): `Promise`\<`null` \| `string`\>

Resolves to the data for executing the CCIP-read operations.

#### Parameters

• **tx**: `PerformActionTransaction`

• **calldata**: `string`

• **urls**: `string`[]

#### Returns

`Promise`\<`null` \| `string`\>

#### Inherited from

`JsonRpcApiProvider.ccipReadFetch`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:287

***

### destroy()

> **destroy**(): `void`

Sub-classes may use this to shutdown any sockets or release their
 resources and reject any pending requests.

 Sub-classes **must** call ``super.destroy()``.

#### Returns

`void`

#### Inherited from

`JsonRpcApiProvider.destroy`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:320

***

### emit()

> **emit**(`event`, ...`args`): `Promise`\<`boolean`\>

Triggers each listener for %%event%% with the %%args%%.

#### Parameters

• **event**: `ProviderEvent`

• ...**args**: `any`[]

#### Returns

`Promise`\<`boolean`\>

#### Inherited from

`JsonRpcApiProvider.emit`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:405

***

### estimateGas()

> **estimateGas**(`_tx`): `Promise`\<`bigint`\>

Estimates the amount of gas required to execute %%tx%%.

#### Parameters

• **\_tx**: `TransactionRequest`

#### Returns

`Promise`\<`bigint`\>

#### Inherited from

`JsonRpcApiProvider.estimateGas`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:352

***

### getAvatar()

> **getAvatar**(`name`): `Promise`\<`null` \| `string`\>

#### Parameters

• **name**: `string`

#### Returns

`Promise`\<`null` \| `string`\>

#### Inherited from

`JsonRpcApiProvider.getAvatar`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:366

***

### getBalance()

> **getBalance**(`address`, `blockTag`?): `Promise`\<`bigint`\>

Get the account balance (in wei) of %%address%%. If %%blockTag%%
 is specified and the node supports archive access for that
 %%blockTag%%, the balance is as of that [[BlockTag]].

#### Parameters

• **address**: `AddressLike`

• **blockTag?**: `BlockTag`

#### Returns

`Promise`\<`bigint`\>

#### Note

On nodes without archive access enabled, the %%blockTag%% may be
       **silently ignored** by the node, which may cause issues if relied on.

#### Inherited from

`JsonRpcApiProvider.getBalance`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:354

***

### getBlock()

> **getBlock**(`block`, `prefetchTxs`?): `Promise`\<`null` \| `Block`\>

Resolves to the block for %%blockHashOrBlockTag%%.

 If %%prefetchTxs%%, and the backend supports including transactions
 with block requests, all transactions will be included and the
 [[Block]] object will not need to make remote calls for getting
 transactions.

#### Parameters

• **block**: `BlockTag`

• **prefetchTxs?**: `boolean`

#### Returns

`Promise`\<`null` \| `Block`\>

#### Inherited from

`JsonRpcApiProvider.getBlock`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:359

***

### getBlockNumber()

> **getBlockNumber**(): `Promise`\<`number`\>

Get the current block number.

#### Returns

`Promise`\<`number`\>

#### Inherited from

`JsonRpcApiProvider.getBlockNumber`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:326

***

### getCode()

> **getCode**(`address`, `blockTag`?): `Promise`\<`string`\>

Get the bytecode for %%address%%.

#### Parameters

• **address**: `AddressLike`

• **blockTag?**: `BlockTag`

#### Returns

`Promise`\<`string`\>

#### Note

On nodes without archive access enabled, the %%blockTag%% may be
       **silently ignored** by the node, which may cause issues if relied on.

#### Inherited from

`JsonRpcApiProvider.getCode`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:356

***

### getFeeData()

> **getFeeData**(): `Promise`\<`FeeData`\>

Get the best guess at the recommended [[FeeData]].

#### Returns

`Promise`\<`FeeData`\>

#### Inherited from

`JsonRpcApiProvider.getFeeData`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:351

***

### getLogs()

> **getLogs**(`_filter`): `Promise`\<`Log`[]\>

Resolves to the list of Logs that match %%filter%%

#### Parameters

• **\_filter**: `Filter` \| `FilterByBlockHash`

#### Returns

`Promise`\<`Log`[]\>

#### Inherited from

`JsonRpcApiProvider.getLogs`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:363

***

### getNetwork()

> **getNetwork**(): `Promise`\<`Network`\>

Get the connected [[Network]].

#### Returns

`Promise`\<`Network`\>

#### Inherited from

`JsonRpcApiProvider.getNetwork`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:350

***

### getPlugin()

> **getPlugin**\<`T`\>(`name`): `null` \| `T`

Get a plugin by name.

#### Type Parameters

• **T** *extends* `AbstractProviderPlugin` = `AbstractProviderPlugin`

#### Parameters

• **name**: `string`

#### Returns

`null` \| `T`

#### Inherited from

`JsonRpcApiProvider.getPlugin`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:277

***

### getResolver()

> **getResolver**(`name`): `Promise`\<`null` \| `EnsResolver`\>

#### Parameters

• **name**: `string`

#### Returns

`Promise`\<`null` \| `EnsResolver`\>

#### Inherited from

`JsonRpcApiProvider.getResolver`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:365

***

### getRpcError()

> **getRpcError**(`payload`, `_error`): `Error`

Returns an ethers-style Error for the given JSON-RPC error
 %%payload%%, coalescing the various strings and error shapes
 that different nodes return, coercing them into a machine-readable
 standardized error.

#### Parameters

• **payload**: `JsonRpcPayload`

• **\_error**: `JsonRpcError`

#### Returns

`Error`

#### Inherited from

`JsonRpcApiProvider.getRpcError`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:291

***

### getRpcRequest()

> **getRpcRequest**(`req`): `null` \| `object`

Returns the request method and arguments required to perform
 %%req%%.

#### Parameters

• **req**: `PerformActionRequest`

#### Returns

`null` \| `object`

#### Inherited from

`JsonRpcApiProvider.getRpcRequest`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:281

***

### getRpcTransaction()

> **getRpcTransaction**(`tx`): `JsonRpcTransactionRequest`

Returns %%tx%% as a normalized JSON-RPC transaction request,
 which has all values hexlified and any numeric values converted
 to Quantity values.

#### Parameters

• **tx**: `TransactionRequest`

#### Returns

`JsonRpcTransactionRequest`

#### Inherited from

`JsonRpcApiProvider.getRpcTransaction`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:276

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

• **address?**: `string` \| `number`

#### Returns

`Promise`\<`JsonRpcSigner`\>

#### Inherited from

`JsonRpcApiProvider.getSigner`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:318

***

### getStorage()

> **getStorage**(`address`, `_position`, `blockTag`?): `Promise`\<`string`\>

Get the storage slot value for %%address%% at slot %%position%%.

#### Parameters

• **address**: `AddressLike`

• **\_position**: `BigNumberish`

• **blockTag?**: `BlockTag`

#### Returns

`Promise`\<`string`\>

#### Note

On nodes without archive access enabled, the %%blockTag%% may be
       **silently ignored** by the node, which may cause issues if relied on.

#### Inherited from

`JsonRpcApiProvider.getStorage`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:357

***

### getTransaction()

> **getTransaction**(`hash`): `Promise`\<`null` \| `TransactionResponse`\>

Resolves to the transaction for %%hash%%.

 If the transaction is unknown or on pruning nodes which
 discard old transactions this resolves to ``null``.

#### Parameters

• **hash**: `string`

#### Returns

`Promise`\<`null` \| `TransactionResponse`\>

#### Inherited from

`JsonRpcApiProvider.getTransaction`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:360

***

### getTransactionCount()

> **getTransactionCount**(`address`, `blockTag`?): `Promise`\<`number`\>

Get the number of transactions ever sent for %%address%%, which
 is used as the ``nonce`` when sending a transaction. If
 %%blockTag%% is specified and the node supports archive access
 for that %%blockTag%%, the transaction count is as of that
 [[BlockTag]].

#### Parameters

• **address**: `AddressLike`

• **blockTag?**: `BlockTag`

#### Returns

`Promise`\<`number`\>

#### Note

On nodes without archive access enabled, the %%blockTag%% may be
       **silently ignored** by the node, which may cause issues if relied on.

#### Inherited from

`JsonRpcApiProvider.getTransactionCount`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:355

***

### getTransactionReceipt()

> **getTransactionReceipt**(`hash`): `Promise`\<`null` \| `TransactionReceipt`\>

Resolves to the transaction receipt for %%hash%%, if mined.

 If the transaction has not been mined, is unknown or on
 pruning nodes which discard old transactions this resolves to
 ``null``.

#### Parameters

• **hash**: `string`

#### Returns

`Promise`\<`null` \| `TransactionReceipt`\>

#### Inherited from

`JsonRpcApiProvider.getTransactionReceipt`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:361

***

### getTransactionResult()

> **getTransactionResult**(`hash`): `Promise`\<`null` \| `string`\>

Resolves to the result returned by the executions of %%hash%%.

 This is only supported on nodes with archive access and with
 the necessary debug APIs enabled.

#### Parameters

• **hash**: `string`

#### Returns

`Promise`\<`null` \| `string`\>

#### Inherited from

`JsonRpcApiProvider.getTransactionResult`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:362

***

### listAccounts()

> **listAccounts**(): `Promise`\<`JsonRpcSigner`[]\>

#### Returns

`Promise`\<`JsonRpcSigner`[]\>

#### Inherited from

`JsonRpcApiProvider.listAccounts`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:319

***

### listenerCount()

> **listenerCount**(`event`?): `Promise`\<`number`\>

Resolves to the number of listeners for %%event%%.

#### Parameters

• **event?**: `ProviderEvent`

#### Returns

`Promise`\<`number`\>

#### Inherited from

`JsonRpcApiProvider.listenerCount`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:406

***

### listeners()

> **listeners**(`event`?): `Promise`\<`Listener`[]\>

Resolves to the listeners for %%event%%.

#### Parameters

• **event?**: `ProviderEvent`

#### Returns

`Promise`\<`Listener`[]\>

#### Inherited from

`JsonRpcApiProvider.listeners`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:407

***

### lookupAddress()

> **lookupAddress**(`address`): `Promise`\<`null` \| `string`\>

Resolves to the ENS name associated for the %%address%% or
 ``null`` if the //primary name// is not configured.

 Users must perform additional steps to configure a //primary name//,
 which is not currently common.

#### Parameters

• **address**: `string`

#### Returns

`Promise`\<`null` \| `string`\>

#### Inherited from

`JsonRpcApiProvider.lookupAddress`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:368

***

### off()

> **off**(`event`, `listener`?): `Promise`\<[`TevmProvider`](TevmProvider.md)\>

Unregister the %%listener%% for %%event%%. If %%listener%%
 is unspecified, all listeners are unregistered.

#### Parameters

• **event**: `ProviderEvent`

• **listener?**: `Listener`

#### Returns

`Promise`\<[`TevmProvider`](TevmProvider.md)\>

#### Inherited from

`JsonRpcApiProvider.off`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:408

***

### on()

> **on**(`event`, `listener`): `Promise`\<[`TevmProvider`](TevmProvider.md)\>

Registers a %%listener%% that is called whenever the
 %%event%% occurs until unregistered.

#### Parameters

• **event**: `ProviderEvent`

• **listener**: `Listener`

#### Returns

`Promise`\<[`TevmProvider`](TevmProvider.md)\>

#### Inherited from

`JsonRpcApiProvider.on`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:403

***

### once()

> **once**(`event`, `listener`): `Promise`\<[`TevmProvider`](TevmProvider.md)\>

Registers a %%listener%% that is called the next time
 %%event%% occurs.

#### Parameters

• **event**: `ProviderEvent`

• **listener**: `Listener`

#### Returns

`Promise`\<[`TevmProvider`](TevmProvider.md)\>

#### Inherited from

`JsonRpcApiProvider.once`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:404

***

### pause()

> **pause**(`dropWhilePaused`?): `void`

Pause the provider. If %%dropWhilePaused%%, any events that occur
 while paused are dropped, otherwise all events will be emitted once
 the provider is unpaused.

#### Parameters

• **dropWhilePaused?**: `boolean`

#### Returns

`void`

#### Inherited from

`JsonRpcApiProvider.pause`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:445

***

### removeAllListeners()

> **removeAllListeners**(`event`?): `Promise`\<[`TevmProvider`](TevmProvider.md)\>

Unregister all listeners for %%event%%.

#### Parameters

• **event?**: `ProviderEvent`

#### Returns

`Promise`\<[`TevmProvider`](TevmProvider.md)\>

#### Inherited from

`JsonRpcApiProvider.removeAllListeners`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:409

***

### removeListener()

> **removeListener**(`event`, `listener`): `Promise`\<[`TevmProvider`](TevmProvider.md)\>

Alias for [[off]].

#### Parameters

• **event**: `ProviderEvent`

• **listener**: `Listener`

#### Returns

`Promise`\<[`TevmProvider`](TevmProvider.md)\>

#### Inherited from

`JsonRpcApiProvider.removeListener`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:411

***

### resolveName()

> **resolveName**(`name`): `Promise`\<`null` \| `string`\>

Resolves to the address configured for the %%ensName%% or
 ``null`` if unconfigured.

#### Parameters

• **name**: `string`

#### Returns

`Promise`\<`null` \| `string`\>

#### Inherited from

`JsonRpcApiProvider.resolveName`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:367

***

### resume()

> **resume**(): `void`

Resume the provider.

#### Returns

`void`

#### Inherited from

`JsonRpcApiProvider.resume`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:449

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

• **method**: `string`

• **params**: `any`[] \| `Record`\<`string`, `any`\>

#### Returns

`Promise`\<`any`\>

#### Inherited from

`JsonRpcApiProvider.send`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/provider-jsonrpc.d.ts:305

***

### waitForBlock()

> **waitForBlock**(`blockTag`?): `Promise`\<`Block`\>

Resolves to the block at %%blockTag%% once it has been mined.

 This can be useful for waiting some number of blocks by using
 the ``currentBlockNumber + N``.

#### Parameters

• **blockTag?**: `BlockTag`

#### Returns

`Promise`\<`Block`\>

#### Inherited from

`JsonRpcApiProvider.waitForBlock`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:370

***

### waitForTransaction()

> **waitForTransaction**(`hash`, `_confirms`?, `timeout`?): `Promise`\<`null` \| `TransactionReceipt`\>

Waits until the transaction %%hash%% is mined and has %%confirms%%
 confirmations.

#### Parameters

• **hash**: `string`

• **\_confirms?**: `null` \| `number`

• **timeout?**: `null` \| `number`

#### Returns

`Promise`\<`null` \| `TransactionReceipt`\>

#### Inherited from

`JsonRpcApiProvider.waitForTransaction`

#### Defined in

node\_modules/.pnpm/ethers@6.13.2\_bufferutil@4.0.8\_utf-8-validate@6.0.4/node\_modules/ethers/lib.esm/providers/abstract-provider.d.ts:369

***

### createMemoryProvider()

> `readonly` `static` **createMemoryProvider**(`options`): `Promise`\<[`TevmProvider`](TevmProvider.md)\>

Creates a new TevmProvider instance with a TevmMemoryClient.

#### Parameters

• **options**: `TevmNodeOptions`\<`object`\>

Options to create a new TevmProvider.

#### Returns

`Promise`\<[`TevmProvider`](TevmProvider.md)\>

A new TevmProvider instance.

#### See

[Tevm Clients Docs](https://tevm.sh/learn/clients/)

#### Example

```ts
import { TevmProvider } from '@tevm/ethers'

const provider = await TevmProvider.createMemoryProvider()

const blockNumber = await provider.getBlockNumber()
```

#### Defined in

[extensions/ethers/src/TevmProvider.js:124](https://github.com/evmts/tevm-monorepo/blob/main/extensions/ethers/src/TevmProvider.js#L124)
