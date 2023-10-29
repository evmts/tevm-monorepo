# Tutorial

::: info On this page you will learn

1. How to set up a basic TypeScript project with foundry from scratch
2. What a bundler is

:::

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

