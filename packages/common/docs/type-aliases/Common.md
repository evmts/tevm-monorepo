[**@tevm/common**](../README.md) • **Docs**

***

[@tevm/common](../globals.md) / Common

# Type alias: Common

> **Common**: `ViemChain` & `object`

Tevm specific chain configuration wrapping viem chain and ethereumjs commmon
Common contains the common configuration set between all chains such as fee information, hardfork information, eip information, predeployed contracts, default block explorers and more.
extends ethereumjs Common class with the Viem Chain type

## Example

```typescript
import { optimism, Common } from 'tevm/common'
import { createMemoryClient } from 'tevm'}

const createClient = (common: Common) => {
  const client = createMemoryClient({
    common,
  })
  return client
}

const client = createClient(optimism)

```

## Type declaration

### copy()

> **copy**: () => [`Common`](Common.md)

#### Returns

[`Common`](Common.md)

### ethjsCommon

> **ethjsCommon**: `EthjsCommon`

## Source

[packages/common/src/Common.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/common/src/Common.ts#L24)
