[**@tevm/common**](../README.md)

***

[@tevm/common](../globals.md) / Common

# Type Alias: Common

> **Common**: `Prettify`\<`ViemChain` & `object`\>

Defined in: [packages/common/src/Common.ts:27](https://github.com/evmts/tevm-monorepo/blob/main/packages/common/src/Common.ts#L27)

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
