import type { Metadata } from 'next';

const title = 'Tevm - Next example';
const description = 'Next.js example using Tevm';
const authorUrl = 'https://twitter.com/0xpolarzero';
const websiteUrl = 'https://tevm.sh';

/* -------------------------------------------------------------------------- */
/*                                  METADATA                                  */
/* -------------------------------------------------------------------------- */

/**
 * @notice Base metadata for the application
 * @dev This will be exported again from the layout file.
 */
export const METADATA_BASE: Metadata = {
  title: title,
  description: description,
  applicationName: title,
  authors: [{ url: authorUrl, name: 'polarzero' }],
  keywords: [],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: websiteUrl,
    siteName: title,
    title: title,
    description: description,
  },
};

/**
 * @notice Extra metadata for the application
 */
export const METADATA_EXTRA = {
  links: {
    github: 'https://github.com/evmts/tevm-monorepo/tree/main/examples/next',
  },
};
