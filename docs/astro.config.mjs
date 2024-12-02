import { defineConfig } from 'astro/config';
import { starlightConfig } from './astro.starlight.config.mjs';

// https://astro.build/config
export default defineConfig({
    integrations: [
        starlightConfig,
    ],
    redirects: {
        '/telegram': {
            destination: 'https://t.me/+ANThR9bHDLAwMjUx',
            permanent: true
        }
    }
});
