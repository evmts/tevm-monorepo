[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / Common

# Type Alias: Common

> **Common** = `Prettify`\<`ViemChain` & `object`\>

Defined in: packages/common/types/Common.d.ts:26

Common is the main representation of chain specific configuration for tevm clients.

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

## See

 - [createCommon](https://tevm.sh/reference/tevm/common/functions/createcommon/)
 - [Tevm client docs](https://tevm.sh/learn/clients/)
