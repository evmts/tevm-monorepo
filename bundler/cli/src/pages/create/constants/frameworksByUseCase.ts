import { frameworks, type MultipleChoiceStep, type useCases } from "./MultipleChoice.js";

/**
 * A mapping of use case to framworks
 */
export const frameworksByUseCase = {
  all: frameworks,
  scripting: {
    stateKey: frameworks.stateKey,
    type: frameworks.type,
    prompt: 'Pick a scripting template',
    choices: {
      cli: frameworks.choices.cli,
      simple: frameworks.choices.simple,
      bun: frameworks.choices.bun,
    }
  },
  simple: {
    stateKey: frameworks.stateKey,
    type: frameworks.type,
    prompt: 'Pick a template',
    choices: {
      simple: frameworks.choices.simple,
      bun: frameworks.choices.bun,
    }
  },
  server: {
    stateKey: frameworks.stateKey,
    type: frameworks.type,
    prompt: 'Pick a server template',
    choices: {
      server: frameworks.choices.server,
      elysia: frameworks.choices.elysia,
      htmx: frameworks.choices.htmx,
    }
  },
  ui: {
    stateKey: frameworks.stateKey,
    type: frameworks.type,
    prompt: 'Pick a UI template',
    choices: {
      mud: frameworks.choices.mud,
      pwa: frameworks.choices.pwa,
      next: frameworks.choices.next,
      remix: frameworks.choices.remix,
      astro: frameworks.choices.astro,
      svelte: frameworks.choices.svelte,
      vue: frameworks.choices.vue,
      htmx: frameworks.choices.htmx,
    }
  }
} as const satisfies Record<keyof (typeof useCases)['choices'], MultipleChoiceStep>
