import { defineConfig } from '@wagmi/cli'
import { erc, foundry, react } from '@wagmi/cli/plugins'

export default defineConfig({
  out: 'dist/generatedWagmi.ts',
  contracts: [],
  plugins: [
    erc({
      20: true,
      721: true,
    }),
    foundry({
      project: '../..',
      artifacts: 'packages/contracts/dist',
    }),
    react(),
  ],
})
