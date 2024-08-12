[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [common](../README.md) / CommonOptions

# Type Alias: CommonOptions

> **CommonOptions**: `object` & `ViemChain`

Options for creating an Tevm MemoryClient instance

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

### eips?

> `optional` **eips**: `ReadonlyArray`\<`number`\>

Eips to enable. Defaults to `[1559, 4895]`

### hardfork

> **hardfork**: [`Hardfork`](Hardfork.md)

Hardfork to use. Defaults to `shanghai`

### loggingLevel

> **loggingLevel**: `LogOptions`\[`"level"`\]

Tevm logger instance

## Example

```typescript
import { mainnet, createCommon, type CommonOptions } from 'tevm/common'

const opts: CommonOptions = {
  ...mainnet,
  hardfork: 'london',
}

const common = createCommon(opts)
````
@see [createCommon](https://tevm.sh/reference/tevm/common/functions/createcommon/)

## Defined in

packages/common/types/CommonOptions.d.ts:20
