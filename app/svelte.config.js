import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    // For Tauri, we use adapter-static to prerender the entire app
    // See: https://kit.svelte.dev/docs/adapters
    adapter: adapter({
      // Static adapter options
      fallback: 'index.html', // Single-page app (SPA) mode
      precompress: false,
      strict: false
    }),
    alias: {
      '$components': './src/components',
      '$lib': './src/lib'
    },
    
    // Prevent server-side rendering completely
    csp: {
      mode: 'auto',
      directives: {
        'script-src': ['self']
      }
    },
    
    // Ensure all pages are treated as endpoints, not SSR routes
    prerender: {
      handleMissingId: 'ignore'
    },
    
    // Disable server-side rendering
    ssr: false
  },
  
  // Enable Svelte 5 runes
  compilerOptions: {
    runes: true
  }
};

export default config;