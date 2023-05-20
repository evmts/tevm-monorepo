Typescript

### Add @evmts to your tsconfig.json

- Add @evmts/ts-plugin to your `plugins` array in `compilerOptions`
- if `foundry.toml` config is not in the same directory as the ts-config pass in a relative path to the the project root

```json
{
  "compilerOptions": {
    "plugins": [{
      "name": "@evmts/ts-plugin",
      "project": "../"
    }],
    ...
  }
}
```

See [ts plugin](../guide/typescript.md) guide for more detailed information.
