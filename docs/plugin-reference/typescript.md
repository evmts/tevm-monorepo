# Typescript plugin

A typescript plugin for adding typescript support and autocomplete to your `.sol` file imports.

#### Docs

For full documentumentation see [evmts docs](../../docs/introduction/get-started.md)

#### Installation

```bash [npm]
npm i @evmts/rollup @evmts/ts
```

### Configuration

- Add @evmts/ts to your `plugins` array in `compilerOptions`
- if `foundry.toml` config is not in the same directory as the ts-config pass in a relative path to the the project root as `project` config option

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "@evmts/ts",
        "project": "./contracts"
      }
    ]
  }
}
```
