import App from './App.svelte';
import { mount } from 'svelte';

// This is a pure client-side app for Tauri desktop
const app = mount(App, {
  target: document.getElementById('app')!
});

export default app;