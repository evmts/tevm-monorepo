# Available Vocs Components

Based on the inspection of `vocs/components.ts` in version 1.0.5, the following components are officially exported and available for use:

## Available Components

- `Authors` - For displaying author information
- `BlogPosts` - For displaying blog posts listings
- `Button` - For creating interactive buttons
- `Callout` - For creating highlighted information blocks
- `HomePage` - Home page components
- `Raw` - For embedding raw content
- `Sponsors` - For displaying sponsor information
- `Steps` - For creating step-by-step guides
- `Step` - Individual step components

## Markdown Directives

Instead of using React components like `Tabs` and `Tab`, vocs supports markdown directives for similar functionality:

### Code Groups (Alternative to Tabs)

```md
:::code-group
```bash [npm]
npm i viem
```

```bash [pnpm]
pnpm i viem
```

```bash [bun]
bun i viem
```
:::
```

### Callouts

```md
:::note
This is a note callout.
:::

:::info
This is an info callout.
:::

:::warning
This is a warning callout.
:::

:::danger
This is a danger callout.
:::

:::tip
This is a tip callout.
:::

:::success
This is a success callout.
:::
```

### Steps

```md
::::steps
#### Step one

Content for step one

#### Step two

Content for step two

#### Step three

Content for step three
::::
```

### Details (Collapsible Content)

```md
:::details[See more]
Hidden content here
:::
```