# Plugin configuration

### Add evmts to your build config

::: details Vite Setup

Add rollup plugin to vite config

```typescript{5}
import { rollupPlugin } from '@evmts/plugins`
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [rollupPlugin()]
})
```

:::

::: details Rollup Setup

```typescript{5}
const { rollupPlugin } = require('@evmts/plugins');

module.exports = {
  ...
  plugins: [rollupPlugin()]
};
```

:::

::: details Next.js setup
Coming soon
:::
