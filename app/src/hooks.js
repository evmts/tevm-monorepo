// This file disables server-side rendering completely
// It's a SvelteKit hooks file that tells the framework to never execute server-side
// See: https://kit.svelte.dev/docs/hooks#server

/** @type {import('@sveltejs/kit').Handle} */
export function handle({ event, resolve }) {
  // Force client-side rendering for everything
  return resolve(event, {
    ssr: false
  });
}

// Disable all server-side hooks
export const handleError = () => {};
export const handleFetch = () => {};
export const externalFetch = () => {};