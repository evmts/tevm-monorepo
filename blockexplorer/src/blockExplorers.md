# BlockExplorer

class utlities representing a blockchain explorer

## SafeStandardBlockExplorer

Class providing utilities for safely generating URLs using blockchain explorers.

### Import

```typescript
import {SafeStandardBlockExplorer} from '@evmts/blockexplorers'
```

### Example

```typescript
import {SafeStandardBlockExplorer} from '@evmts/blockexplorers'
const etherscan = new SafeStandardBlockExplorer(
  'Etherscan',
  'https://etherscan.io',
  1
)
const txUrlEffect = etherscan.getTxUrl('0x1234') // [!code focus:2]
```

## StandardBlockExplorer

Class providing direct utilities for generating URLs using blockchain explorers.

### Import

```typescript
import {StandardBlockExplorer} from '@evmts/blockexplorers'
```

### Example

```typescript
import {StandardBlockExplorer} from '@evmts/blockexplorers'
const etherscan = new StandardBlockExplorer(
  'Etherscan',
  'https://etherscan.io',
  1
)
const txUrl = etherscan.getTxUrl('0x1234') // [!code focus:2]
```

