const title = 'Tevm - Remix example';
const description = 'Remix example using Tevm';
const authorUrl = 'https://twitter.com/0xpolarzero';
const websiteUrl = 'https://tevm.sh';

/* -------------------------------------------------------------------------- */
/*                                  METADATA                                  */
/* -------------------------------------------------------------------------- */

/**
 * @notice Base metadata for the application
 */
export const METADATA_BASE = {
  title: title,
  description: description,
  applicationName: title,
  authors: [{ url: authorUrl, name: 'polarzero' }],
  keywords: [],
};

/**
 * @notice Extra metadata for the application
 */
export const METADATA_EXTRA = {
  links: {
    github: 'https://github.com/evmts/tevm-monorepo/tree/main/examples/remix',
  },
};