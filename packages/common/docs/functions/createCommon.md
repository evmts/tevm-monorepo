[**@tevm/common**](../README.md)

***

[@tevm/common](../globals.md) / createCommon

# Function: createCommon()

> **createCommon**(`options`): `object`

Defined in: packages/common/src/createCommon.js:53

Common is the main representation of chain specific configuration for tevm clients.

createCommon creates a typesafe ethereumjs Common object used by the EVM
to access chain and hardfork parameters and to provide
a unified and shared view on the network and hardfork state.
Tevm common extends the [viem chain](https://github.com/wevm/viem/blob/main/src/chains/index.ts) interface

## Parameters

### options

[`CommonOptions`](../type-aliases/CommonOptions.md)

## Returns

### blockExplorers?

> `optional` **blockExplorers**: `object`

Collection of block explorers

#### Index Signature

\[`key`: `string`\]: `ChainBlockExplorer`

#### blockExplorers.default

> **default**: `ChainBlockExplorer`

### contracts?

> `optional` **contracts**: `object`

Collection of contracts

#### Index Signature

\[`key`: `string`\]: `undefined` \| `ChainContract` \| \{[`sourceId`: `number`]: `undefined` \| `ChainContract`; \}

#### contracts.ensRegistry?

> `optional` **ensRegistry**: `ChainContract`

#### contracts.ensUniversalResolver?

> `optional` **ensUniversalResolver**: `ChainContract`

#### contracts.multicall3?

> `optional` **multicall3**: `ChainContract`

#### contracts.universalSignatureVerifier?

> `optional` **universalSignatureVerifier**: `ChainContract`

### copy()

> **copy**: () => \{ blockExplorers?: \{ \[key: string\]: ChainBlockExplorer; default: ChainBlockExplorer; \} \| undefined; contracts?: \{ \[x: string\]: ChainContract \| \{ ...; \} \| undefined; ensRegistry?: ChainContract \| undefined; ensUniversalResolver?: ChainContract \| undefined; multicall3?: ChainContract \| undefined; universalSignatureVer...

#### Returns

\{ blockExplorers?: \{ \[key: string\]: ChainBlockExplorer; default: ChainBlockExplorer; \} \| undefined; contracts?: \{ \[x: string\]: ChainContract \| \{ ...; \} \| undefined; ensRegistry?: ChainContract \| undefined; ensUniversalResolver?: ChainContract \| undefined; multicall3?: ChainContract \| undefined; universalSignatureVer...

### custom?

> `optional` **custom**: `Record`\<`string`, `unknown`\>

Custom chain data.

### ensTlds?

> `optional` **ensTlds**: readonly `string`[]

Collection of ENS TLDs for the chain.

### ethjsCommon

> **ethjsCommon**: `Common`

### fees?

> `optional` **fees**: `ChainFees`\<`undefined` \| `ChainFormatters`\>

Modifies how fees are derived.

### formatters?

> `optional` **formatters**: `ChainFormatters`

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

### rpcUrls

> **rpcUrls**: `object`

Collection of RPC endpoints

#### Index Signature

\[`key`: `string`\]: `ChainRpcUrls`

#### rpcUrls.default

> **default**: `ChainRpcUrls`

### serializers?

> `optional` **serializers**: `ChainSerializers`\<`undefined` \| `ChainFormatters`, `TransactionSerializable`\>

Modifies how data is serialized (e.g. transactions).

### sourceId?

> `optional` **sourceId**: `number`

Source Chain ID (ie. the L1 chain)

### testnet?

> `optional` **testnet**: `boolean`

Flag for test networks

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

To use with ethereumjs use the ethjsCommon property

```typescript
import { VM } from '@ethereumjs/vm'
import { createMemoryClient } from 'tevm'

const common = createCommon({ ... })

const vm = new VM({
  common: common.ethjsCommon,
})
```

## See

[Tevm client docs](https://tevm.sh/learn/clients/)
