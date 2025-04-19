// Ensure this file only executes in a browser environment
// This is critical to prevent any server-side rendering issues
if (typeof window !== 'undefined') {
  // Only import these modules in browser context
  const { default: App } = await import('./App.svelte');
  const { mount } = await import('svelte');
  
  // Mount the app to the DOM
  // This should only happen in the browser
  const app = mount(App, {
    target: document.getElementById('app')
  });
  
  export default app;
}