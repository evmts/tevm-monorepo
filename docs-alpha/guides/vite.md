# Vite

The vite bundler is popular in many applications including Vue, React SPAs, and Astro apps.

These instructions apply to [vitest](todo.link) configurations too

::: info You will learn
How to configure vite to bundle your solidity files in vite and vitest
:::

## 1. Install vite plugin

::: code-group

```bash [npm]
npm install @evmts/vite --save-dev
```

```bash [pnpm]
pnpm install @evmts/vite --save-dev
```

```bash [yarn]
yarn add @evmts/vite -D
```

::: 

## 2. Add to vite.config.ts

Add to vite.config.ts.  The vite config takes no options.  For custom configuration add a [evmts.config.ts](../reference/config.md)

```typescript vite.config.ts
import { vitePluginEvmts } from '@evmts/vite-plugin'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vitePluginEvmts()],
})
```

## 3. Configure editor support

For editor support use either the [ts-plugin](../tutorial/typescript) or [vscode extension](../guides/vscode)

