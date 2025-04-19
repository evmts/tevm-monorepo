// This file is only executed in the browser
// It serves as the entry point for the client-side application

// Only run in browser context
if (typeof window !== 'undefined') {
  (async () => {
    try {
      // Dynamic import to ensure this only runs in browser
      const { default: App } = await import('./App.svelte');
      const { mount } = await import('svelte');

      // Mount the application
      const app = mount(App, {
        target: document.getElementById('app')
      });
      
      // For HMR/devtools
      if (import.meta.hot) {
        import.meta.hot.accept();
        import.meta.hot.dispose(() => {
          app.$destroy?.();
        });
      }
    } catch (error) {
      console.error('Failed to start application:', error);
    }
  })();
}