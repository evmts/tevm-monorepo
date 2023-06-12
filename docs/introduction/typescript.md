Typescript

### Add @evmts to your tsconfig.json

- Add @evmts/ts to your `plugins` array in `compilerOptions`
- if `foundry.toml` config is not in the same directory as the ts-config pass in a relative path to the the project root

```json
{
  "compilerOptions": {
    "plugins": [{
      "name": "@evmts/ts",
      "project": "../"
    }],
    ...
  }
}
```

See [ts plugin](../guide/typescript.md) guide for more detailed information.
