# Webpack plugin

Adds evmts solidity file import support to [webpack](https://webpack.js.org/) or [NEXT](https://nextjs.org/) apps.

- **Type**

```ts
function pluginWebpackEvmts(
  /**
   * File path to folder containing foundry.toml
   * @defaults '.'
   */
  project?: string,
  /**
   * File path from `project` to `out` folder as specified in foundry.toml
   * Defaults to `out`
   */
  out?: string
): ViemContract;
```

- **Details**

`pluginWebpackEvmts` allows you to import solidity files directly in your NEXT.js

- **Example**

```ts [example.ts]
const { webpackPluginEvmts } = require("@evmts/webpack");

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
  plugins: [
    webpackPluginEvmts({
      project: ".",
      out: "artifacts",
    }),
  ],
};
```

- **Live example**

TODO stackblitz

- **See also:** [typescript docs](./typescript.md)
