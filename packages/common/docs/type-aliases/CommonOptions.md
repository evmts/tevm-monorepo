[**@tevm/common**](../README.md) • **Docs**

***

[@tevm/common](../globals.md) / CommonOptions

# Type Alias: CommonOptions

> **CommonOptions**: `ViemChain` & `object`

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

#### Default

```ts
[1559, 4895]
```

### hardfork?

> `optional` **hardfork**: [`Hardfork`](Hardfork.md)

Hardfork to use. Defaults to `shanghai`

#### Default

```ts
'cancun'
```

### loggingLevel?

> `optional` **loggingLevel**: `LogOptions`\[`"level"`\]

Logging level of the Tevm logger instance

#### Default

```ts
'warn'
```

## Defined in

[packages/common/src/CommonOptions.ts:38](https://github.com/evmts/tevm-monorepo/blob/main/packages/common/src/CommonOptions.ts#L38)
