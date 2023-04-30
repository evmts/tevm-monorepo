## @evmts/ts-plugin

A typescript plugin for adding typescript support and autocomplete to your `.sol` file imports.

#### Docs

For full documentumentation see [evmts docs](../../docs/introduction/get-started.md)

#### Installation

```bash [npm]
npm i @evmts/rollup-plugin @evmts/ts-plugin
```

### Configuration

Add @evmts to your tsconfig.json

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "@evmts/ts-plugin"
      }
    ]
  }
}
```
