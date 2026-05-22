[**@tevm/common**](../README.md)

***

[@tevm/common](../globals.md) / createCommon

# Function: createCommon()

> **createCommon**(`options`): `object`

Common is the main representation of chain specific configuration for tevm clients.

createCommon creates a typesafe Common object used by the EVM
to access chain and hardfork parameters and to provide
a unified and shared view on the network and hardfork state.
Tevm common extends the [viem chain](https://github.com/wevm/viem/blob/main/src/chains/index.ts) interface

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`CommonOptions`](../type-aliases/CommonOptions.md) | - |

## Returns

### blockExplorers?

> `optional` **blockExplorers?**: `object`

Collection of block explorers

#### Type Declaration

#### Index Signature

\[`key`: `string`\]: `ChainBlockExplorer`

#### blockExplorers.default

> **default**: `ChainBlockExplorer`

### blockTime?

> `optional` **blockTime?**: `number`

Block time in milliseconds.

### contracts?

> `optional` **contracts?**: `object`

Collection of contracts

#### Type Declaration

#### Index Signature

\[`key`: `string`\]: `ChainContract` \| \{\[`sourceId`: `number`\]: `ChainContract` \| `undefined`; \} \| `undefined`

#### contracts.ensRegistry?

> `optional` **ensRegistry?**: `ChainContract`

#### contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver?**: `ChainContract`

#### contracts.erc6492Verifier?

> `optional` **erc6492Verifier?**: `ChainContract`

#### contracts.multicall3?

> `optional` **multicall3?**: `ChainContract`

### copy

> **copy**: () => \{ blockExplorers?: \{ \[key: string\]: ChainBlockExplorer; default: ChainBlockExplorer; \} \| undefined; blockTime?: number \| undefined; contracts?: \{ ...; \} \| undefined; ... 16 more ...; copy: () =\> ...; \}

#### Returns

\{ blockExplorers?: \{ \[key: string\]: ChainBlockExplorer; default: ChainBlockExplorer; \} \| undefined; blockTime?: number \| undefined; contracts?: \{ ...; \} \| undefined; ... 16 more ...; copy: () =\> ...; \}

### ~~custom?~~

> `optional` **custom?**: `Record`\<`string`, `unknown`\>

Custom chain data.

#### Deprecated

use `.extend` instead.

### ensTlds?

> `optional` **ensTlds?**: readonly `string`[]

Collection of ENS TLDs for the chain.

### ethjsCommon

> **ethjsCommon**: `Common`

### experimental\_preconfirmationTime?

> `optional` **experimental\_preconfirmationTime?**: `number`

Preconfirmation time in milliseconds.

### extendSchema?

> `optional` **extendSchema?**: `Record`\<`string`, `unknown`\>

Extend schema.

### fees?

> `optional` **fees?**: `ChainFees`\<`ChainFormatters` \| `undefined`\>

Modifies how fees are derived.

### formatters?

> `optional` **formatters?**: `ChainFormatters`

Modifies how data is formatted and typed (e.g. blocks and transactions)

### id

> **id**: `number`

ID in number form

### name

> **name**: `string`

Human-readable name

### nativeCurrency

> **nativeCurrency**: `ChainNativeCurrency`

Currency used by chain

### prepareTransactionRequest?

> `optional` **prepareTransactionRequest?**: `PrepareTransactionRequestFn` \| \[`PrepareTransactionRequestFn`, `object`\]

Function to prepare a transaction request. Runs before the transaction is filled.

### rpcUrls

> **rpcUrls**: `object`

Collection of RPC endpoints

#### Type Declaration

#### Index Signature

\[`key`: `string`\]: `ChainRpcUrls`

#### rpcUrls.default

> **default**: `ChainRpcUrls`

### serializers?

> `optional` **serializers?**: `ChainSerializers`\<`ChainFormatters` \| `undefined`, `TransactionSerializable`\>

Modifies how data is serialized (e.g. transactions).

### sourceId?

> `optional` **sourceId?**: `number`

Source Chain ID (ie. the L1 chain)

### testnet?

> `optional` **testnet?**: `boolean`

Flag for test networks

### verifyHash?

> `optional` **verifyHash?**: `ChainVerifyHashFn`

Chain-specific signature verification.

## Throws

only if invalid params are passed

## Examples

```typescript
import { createCommon } from 'tevm/common'

const common = createCommon({
 customCrypto: {},
 loggingLevel: 'debug',
 hardfork: 'london',
 eips: [420],
 id: 69,
 name: 'MyChain',
 ...
})
```
Since common are stateful consider copying it before using it

```typescript
import { createCommon } from 'tevm/common'
const common = createCommon({ ... })

const commonCopy = common.copy()
```

To access the underlying Common instance, use the ethjsCommon property.

```typescript
const common = createCommon({ ... })
const ethjsCommon = common.ethjsCommon
```

## See

[Tevm client docs](https://tevm.sh/learn/clients/)
