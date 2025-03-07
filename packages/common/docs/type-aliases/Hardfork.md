[**@tevm/common**](../README.md)

***

[@tevm/common](../globals.md) / Hardfork

# Type Alias: Hardfork

> **Hardfork**: `"chainstart"` \| `"homestead"` \| `"dao"` \| `"tangerineWhistle"` \| `"spuriousDragon"` \| `"byzantium"` \| `"constantinople"` \| `"petersburg"` \| `"istanbul"` \| `"muirGlacier"` \| `"berlin"` \| `"london"` \| `"arrowGlacier"` \| `"grayGlacier"` \| `"mergeForkIdTransition"` \| `"paris"` \| `"shanghai"` \| `"cancun"` \| `"prague"` \| `"osaka"`

Defined in: [packages/common/src/Hardfork.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/common/src/Hardfork.ts#L17)

Ethereum hardfork options. Default option is currently cancun.
If you use older hardforks you might run into issues with EIPs not being supported.

## Example

```typescript
import { createCommon, mainnet } from 'tevm/common'`

const hardfork: Hardfork = 'shanghai'

const common = createCommon({
  ...mainnet,
  hardfork,
})
```

## See

[createCommon](https://tevm.sh/reference/tevm/common/functions/createcommon/)
