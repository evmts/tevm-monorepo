# REVM Docs - Vocs Site

This is a Vocs-powered documentation site for REVM (Rust Ethereum Virtual Machine).

## Running the Docs Site

To run the documentation site locally:

```bash
# Navigate to the docs directory
cd docs/revm

# Install dependencies (if not already installed)
pnpm install

# Start the development server
pnpm dev
```

This will start the Vocs development server, typically at http://localhost:5173.

## Building the Site

To build the site for production:

```bash
# Navigate to the docs directory
cd docs/revm

# Build the site
pnpm build
```

This will generate static files in the `dist` directory.

## Preview the Built Site

To preview the built site:

```bash
# Navigate to the docs directory
cd docs/revm

# Preview the built site
pnpm preview
```

## Documentation Structure

The documentation is organized into:

- `pages/` - Contains all MDX documentation files
  - `beginner-tutorial/` - Getting started guides and tutorials
  - `intermediate-concepts/` - Architecture and concept explanations
  - `examples/` - Usage examples and code patterns
  - `expert-reference/` - API and technical reference documentation
- `public/` - Static assets (images, etc.)
- `components/` - React components used in the documentation
- `styles/` - CSS styling

## Customization

To customize the site, you can modify:

- `vocs.config.ts` - Configure site navigation, theme, etc.
- `components/` - Modify or add React components
- `styles.css` - Update global styles

## Adding New Content

To add new documentation pages:

1. Create a new MDX file in the appropriate directory under `pages/`
2. Add frontmatter with title and description
3. Update the sidebar in `vocs.config.ts` if needed

Example MDX frontmatter:

```mdx
---
title: My New Page
description: Detailed information about a specific REVM feature
---

# My New Page

Content goes here...
```