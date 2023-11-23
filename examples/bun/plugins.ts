import { evmtsBunPlugin } from '@evmts/bun-plugin'
import { plugin } from 'bun'
// @ts-expect-error
import * as solc from 'solc'

// Load EVMts plugin to enable solidity imports
// EVMts is configured in the tsconfig.json
// in future it will be configured via evmts.config.ts
plugin(evmtsBunPlugin({ solc }))
