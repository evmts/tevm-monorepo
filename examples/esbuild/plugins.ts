import { evmtsBunPlugin } from '@evmts/bun-plugin'
import { plugin } from 'bun'

// Load EVMts plugin to enable solidity imports
// EVMts is configured in the tsconfig.json
// in future it will be configured via evmts.config.ts
plugin(evmtsBunPlugin())
