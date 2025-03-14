[**@tevm/common**](../README.md)

***

[@tevm/common](../globals.md) / CommonOptions

# Type Alias: CommonOptions

> **CommonOptions**: `ViemChain` & `object`

Defined in: [packages/common/src/CommonOptions.ts:39](https://github.com/evmts/tevm-monorepo/blob/main/packages/common/src/CommonOptions.ts#L39)

## Type declaration

### customCrypto?

> `optional` **customCrypto**: [`CustomCrypto`](../interfaces/CustomCrypto.md)

Custom crypto implementations
For EIP-4844 support kzg must be passed

#### Warning

KZG can add a significant amount of bundle size to an app
In future a stub will be provided that that automatically returns valid without checking the kzg proof

#### Example

```typescript
import  { createMemoryClient } from 'tevm'
import  { mainnet } from 'tevm/common'
import { createMockKzg } from 'tevm/crypto'

const common = createCommon({
  ...mainnet,
  customCrypto: {
    kzg: createMockKzg(),
    ...customCrypto,
  },
})
```
Choices include:
- keccak256
- ecrecover
- sha256
- ecsign
- ecdsaSign
- ecdsaRecover
- kzg

Notably kzg is not included by default because of it's bundlesize import and instead replaced with a mock that always returns true

### eips?

> `optional` **eips**: `ReadonlyArray`\<`number`\>

Eips to enable. Defaults to `[1559, 4895]`

#### Default

```ts
[1559, 4895]
```

### genesis?

> `optional` **genesis**: `ChainConfig`\[`"genesis"`\]

### hardfork?

> `optional` **hardfork**: [`Hardfork`](Hardfork.md)

Hardfork to use. Defaults to `shanghai`

#### Default

```ts
'cancun'
```

### hardforkTransitionConfig?

> `optional` **hardforkTransitionConfig**: readonly `HardforkTransitionConfig`[]

A mapping of block heights to hardfork. This allows the evm to modify which hardfork it uses based on block height

### loggingLevel?

> `optional` **loggingLevel**: `LogOptions`\[`"level"`\]

Logging level of the Tevm logger instance

#### Default

```ts
'warn'
```

### params?

> `optional` **params**: [`ParamsDict`](ParamsDict.md)

Optionally pass in an EIP params dictionary,

## Examples

```typescript
import { mainnet, createCommon, type CommonOptions } from 'tevm/common'

const opts: CommonOptions = {
  ...mainnet,
  hardfork: 'london',
}

const common = createCommon(opts)
```

You can also create a Common instance from viem chains:

```typescript
import { mainnet } from 'viem/chains'
import { createCommon } from 'tevm/common'

const common = createCommon({
  ...mainnet,
  hardfork: 'cancun',
})
```

## See

[createCommon](https://tevm.sh/reference/tevm/common/functions/createcommon/)
