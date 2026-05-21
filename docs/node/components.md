# Available Vocs Components

Exported by `vocs/components.ts` in vocs 1.0.5:

- `Authors` — author info
- `BlogPosts` — post listings
- `Button` — interactive buttons
- `Callout` — highlighted info blocks
- `HomePage` — home page components
- `Raw` — embed raw content
- `Sponsors` — sponsor info
- `Steps` / `Step` — step-by-step guides

`Tabs`/`Tab`, `Cards`/`Card`, and `FileTree` are **not** exported — use markdown directives instead.

## Markdown directives

### Code groups (replaces Tabs)

```md
:::code-group
```bash [npm]
npm i viem
```

```bash [pnpm]
pnpm i viem
```
:::
```

### Callouts

Types: `note`, `info`, `warning`, `danger`, `tip`, `success`.

```md
:::warning
This is a warning callout.
:::
```

### Steps

```md
::::steps
#### Step one
Content for step one

#### Step two
Content for step two
::::
```

### Details (collapsible)

```md
:::details[See more]
Hidden content here
:::
```
