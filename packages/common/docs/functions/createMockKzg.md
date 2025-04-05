[**@tevm/common**](../README.md)

***

[@tevm/common](../globals.md) / createMockKzg

# Function: createMockKzg()

> **createMockKzg**(): `KZG`

Defined in: [packages/common/src/createMockKzg.js:22](https://github.com/evmts/tevm-monorepo/blob/main/packages/common/src/createMockKzg.js#L22)

Returns a mock kzg object that always trusts never verifies
The real kzg commitmenet is over 500kb added to bundle size
so this is useful alternative for smaller bundles and the default

## Returns

`KZG`

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
