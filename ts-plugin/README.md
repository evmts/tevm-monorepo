## @evmts/ts-plugin

A typescript plugin for adding typescript support and autocomplete to your `.sol` file imports.

![image](https://user-images.githubusercontent.com/35039927/235395618-21bfd0c2-d5db-43f1-8264-2d425616fb59.png)

#### Installation

```bash [npm]
npm i @evmts/rollup-plugin @evmts/ts-plugin
```

### Configuration

- Add @evmts/ts-plugin to your `plugins` array in `compilerOptions`
- if `foundry.toml` config is not in the same directory as the ts-config pass in a relative path to the the project root as `project` config option

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "@evmts/ts-plugin",
        "project": "../"
      }
    ]
  }
}
```

## License 📄

<a href="./LICENSE"><img src="https://user-images.githubusercontent.com/35039927/231030761-66f5ce58-a4e9-4695-b1fe-255b1bceac92.png" width="200" /></a>
