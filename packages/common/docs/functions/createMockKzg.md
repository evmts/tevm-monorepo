[**@tevm/common**](../README.md)

***

[@tevm/common](../globals.md) / createMockKzg

# Function: createMockKzg()

> **createMockKzg**(): [`MockKzg`](../type-aliases/MockKzg.md)

Returns a mock kzg object that always trusts never verifies
The real kzg commitmenet is over 500kb added to bundle size
so this is useful explicit opt-in alternative for smaller bundles

## Returns

[`MockKzg`](../type-aliases/MockKzg.md)

## Throws

## Example

```typescript
import { createCommon, createMockKzg, mainnet } from 'tevm/common'

const common = createCommon({
  ...mainnet,
  customCrypto: {
    kzg: createMockKzg(),
  },
})
```

## See

[createCommon](https://tevm.sh/reference/tevm/common/functions/createcommon/)
