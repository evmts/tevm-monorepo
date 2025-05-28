[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [common](../README.md) / Hardfork

# Type Alias: Hardfork

> **Hardfork** = `"chainstart"` \| `"homestead"` \| `"dao"` \| `"tangerineWhistle"` \| `"spuriousDragon"` \| `"byzantium"` \| `"constantinople"` \| `"petersburg"` \| `"istanbul"` \| `"muirGlacier"` \| `"berlin"` \| `"london"` \| `"arrowGlacier"` \| `"grayGlacier"` \| `"mergeForkIdTransition"` \| `"paris"` \| `"shanghai"` \| `"cancun"` \| `"prague"` \| `"osaka"`

Defined in: packages/common/types/Hardfork.d.ts:17

Ethereum hardfork options. Default option is currently prague.
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
