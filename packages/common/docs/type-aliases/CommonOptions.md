[**@tevm/common**](../README.md)

***

[@tevm/common](../globals.md) / CommonOptions

# Type Alias: CommonOptions

> **CommonOptions** = `ViemChain` & `object`

## Type Declaration

### customCrypto?

> `optional` **customCrypto?**: [`CustomCrypto`](../interfaces/CustomCrypto.md)

Custom crypto implementations
For EIP-4844 support kzg must be passed

#### Warning

KZG can add a significant amount of bundle size to an app
A mock KZG implementation is available via createMockKzg but must be passed explicitly

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

### eips?

> `optional` **eips?**: `ReadonlyArray`\<`number`\>

EIPs to enable in addition to hardfork-native EIPs. Defaults to `[]`.

#### Default

```ts
[]
```

### hardfork?

> `optional` **hardfork?**: [`Hardfork`](Hardfork.md)

Hardfork to use. Defaults to `prague`

#### Default

```ts
'prague'
```

### loggingLevel?

> `optional` **loggingLevel?**: `LogOptions`\[`"level"`\]

Logging level of the Tevm logger instance

#### Default

```ts
'warn'
```

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
  hardfork: 'prague',
})
```

## See

[createCommon](https://tevm.sh/reference/tevm/common/functions/createcommon/)
