# Tutorial

To learn all the pieces of Evmts we will configure a new project from scratch.  We only assume basic TypeScript knowledge and knowledge of what a Smart Contract is

::: info On this page you will learn

1. How to set up a basic TypeScript project with foundry from scratch
2. What a bundler is

:::

Looking to get started fast? Try forking one of our example projects or using our live example.

## Initial setup and installation

#### Create a new project

1. Install [nodejs](https://nodejs.org/)
2. Create a new project folder

```bash
mkdir evmts-tut && cd evmts-tut && npm init
```

3. Initialize a new npm project.

```bash
npm init --yes
```

The `--yes` flag will skip the prompts.  Omit it if you prefer.

4. Make your project a TypeScript project

```bash
npm install --save-dev typescript && tsc --init
```

This will initialize a basic tsconfig.

At this point your project should look like `[TODO link to github]`

#### Install and configure Foundry

We will use the [Foundry](https://book.getfoundry.sh/getting-started/installation) toolchain to deploy our contracts.  To install use `foundryup`

1. Install foundryup

```bash
curl -L https://foundry.paradigm.xyz | bash
```

2. Source your environment and run foundryup

```bash
foundryup
```

3. Initialize a basic foundry config

```bash
touch foundry.toml
```

[Toml](https://toml.io/en/) is a file format popular in the rust community similar to JSON.   Foundry comes with a long list of [configuration options](https://book.getfoundry.sh/reference/config/) but for this tutorial we only need this basic config.

```toml
[profile.default]
src = 'src/contracts'
out = 'artifacts'
libs = ['node_modules']
solc_version = "0.8.13"
```

- `src` tells Foundry which folder contains the contract code.   We will put our contracts in `src/contracts`
- `out` tells foundry where to put the artifacts.   We will put them in a folder called `artifacts`
- `lib` tells foundry where to load library code from.   Putting 'node_modules` in there lets us load contracts from node_modules
- Finally `solc_version` is telling Foundry to use the same solc version as Evmts.

