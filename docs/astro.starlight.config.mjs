import starlight from '@astrojs/starlight';
import starlightBlogPlugin from 'starlight-blog';
import starlightLinksValidatorPlugin from 'starlight-links-validator';
import { typeDocConfig } from './astro.typedoc.config.mjs';
import { typeDocSidebarGroup } from 'starlight-typedoc';
import { sidebarConfig } from './astro.sidebar.config.mjs';

const ENABLE_LINK_CHECKER = false;

export const starlightConfig = starlight({
    title: 'Tevm Docs',
    logo: {
        light: './src/assets/tevm-logo-light.png',
        dark: './src/assets/tevm-logo-dark.png',
    },
    lastUpdated: true,
    customCss: ['./src/styles/custom.css'],
    editLink: {
        baseUrl: 'https://github.com/evmts/tevm-monorepo/edit/main/docs',
    },
    tableOfContents: true,
    favicon: './src/assets/tevm-logo-dark.png',
    plugins: [
        starlightBlogPlugin(),
        ...(ENABLE_LINK_CHECKER
            ? [
                starlightLinksValidatorPlugin({
                    errorOnRelativeLinks: true,
                }),
            ]
            : []),
        typeDocConfig,
    ],
    social: {
        github: 'https://github.com/evmts/tevm-monorepo',
        twitter: 'https://twitter.com/FUCORY',
        telegram: 'https://t.me/+ANThR9bHDLAwMjUx',
    },
    sidebar: sidebarConfig,
});
