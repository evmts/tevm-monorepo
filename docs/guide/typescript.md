# Plugin ts

## Why a ts plugin

`@evmts/plugin-rollup` direct solidity file imports for bundlers like [Rollup](./rollup.md) [Vite](./vite.md) and [Webpack (coming soon)](./webpack.md). But by default typescript is unable to infer the types of these solidity files.

EVMts offers `plugin-ts` to bring the full developer experience of typescript to your solidity files including

- Automatically find and _auto-import_ `.sol` contract files
- _Typesafety_ and _autocomplete_ in your editor
- Helpful _error messages_ in your editor when things go wrong
- (COMING SOON) _go-to-definition_ support. Go straight from your typescript code to the solidity code that implemented it
