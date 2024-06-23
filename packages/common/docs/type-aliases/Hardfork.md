[**@tevm/common**](../README.md) • **Docs**

***

[@tevm/common](../globals.md) / Hardfork

# Type alias: Hardfork

> **Hardfork**: `"chainstart"` \| `"homestead"` \| `"dao"` \| `"tangerineWhistle"` \| `"spuriousDragon"` \| `"byzantium"` \| `"constantinople"` \| `"petersburg"` \| `"istanbul"` \| `"muirGlacier"` \| `"berlin"` \| `"london"` \| `"arrowGlacier"` \| `"grayGlacier"` \| `"mergeForkIdTransition"` \| `"paris"` \| `"shanghai"` \| `"cancun"`

Ethereum hardfork options. Default option is currently cancun.
If you use older hardforks you might run into issues with EIPs not being supported.

## Example

```typesxcript
import { createCommon, mainnet } from 'tevm/common'`

const hardfork: Hardfork = 'shanghai'

const common = createCommon({
  ...mainnet,
  hardfork,
})
```

## Source

[packages/common/src/Hardfork.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/common/src/Hardfork.ts#L16)
