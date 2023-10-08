# Quick start

There are many ways to get started with EVMts

## Try it now

To get started try out our live stackblitz example below.

## Start a new project with the EVMts cli

::: code-group

```bash [npx]
npx evmts create --template react
```

```bash [bunx]
bunx evmts create --template bun
```
:::

Valid templates include the following

- react - The recomended template for frontend apps based on Vite
- react-light - A simple react app with no REVM based on Vite
- server - The recomended template for servers
- server-bun - A bun based version of the server app recomended for advanced users

::: info

EVMts is looking for contributors to add the following templates

- react-next
- react-next-light
- react-next-light
- vue
- vue-light
- astro
- astro-light
- svelte
- svelte-light
:::

## Add EVMts to your existing app

It is recomended to use EVMts with it's special contract bundler and LSP. To set it up for your app find your guide below

- [vite](./vite.md) - A common bundler often used in react, vue, solid, svelte and astro apps. A good general purpose bundler. Also works in [vitest](https://vitest.dev) for testing. This is the best default choice.
- [webpack](./webpack.md) - A common bundler used in react and NEXT.js apps. Not recomended for most use cases unless you are already using it.
- [bun](./bun.md) - An extremely peformant next-generation bundler and runtime. Bun is on the bleeding edge and recomended for advanced JavaScript users who know what they are doing.
- [esbuild](./esbuild.md) - A popular peformant bundler written in golang. A good choice for simple apps that don't need the plugin ecosystem of rollup webpack or vite
- [rollup](./rollup.md) - The second most popular bundler behind webpack. Very mature plugin ecosystem. Great choice for simple NPM libraries.
- [rspack](./rspack.md) - A rewrite of webpack in rust. Not feature complete as of yet but production ready

::: tip
Adding support for new bundlers is quick. If your app is not supported by EVMts consider [opening an issue](https://github.com/evmts/evmts-monorepo/issues)
:::
