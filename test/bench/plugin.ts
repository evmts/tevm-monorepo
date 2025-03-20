import { bunPluginTevm } from '@tevm/bun-plugin'
import { plugin } from 'bun'

// Load Tevm plugin to enable solidity imports
// Tevm is configured in the tsconfig.json
// in future it will be configured via tevm.config.ts
plugin(bunPluginTevm({}))
