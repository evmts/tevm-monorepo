import {
	type MultipleChoiceStep,
	frameworks,
	type useCases,
} from './MultipleChoice.js'

/**
 * A mapping of use case to framworks
 */
export const frameworksByUseCase = {
	all: frameworks,
	//   scripting: {
	//     stateKey: frameworks.stateKey,
	//     type: frameworks.type,
	//     prompt: 'Pick a scripting template (hit arrow left to go back)',
	//     choices: {
	//       cli: frameworks.choices.cli,
	//       simple: frameworks.choices.simple,
	//       bun: frameworks.choices.bun,
	//     }
	//   },
	simple: {
		stateKey: frameworks.stateKey,
		type: frameworks.type,
		prompt: 'Pick a template (hit arrow left to go back)',
		choices: {
			simple: frameworks.choices.simple,
			bun: frameworks.choices.bun,
		},
	},
	server: {
		stateKey: frameworks.stateKey,
		type: frameworks.type,
		prompt: 'Pick a server template (hit arrow left to go back)',
		choices: {
			server: frameworks.choices.server,
			//       elysia: frameworks.choices.elysia,
		},
	},
	ui: {
		stateKey: frameworks.stateKey,
		type: frameworks.type,
		prompt: 'Pick a UI template (hit arrow left to go back)',
		choices: {
			pwa: frameworks.choices.pwa,
			mud: frameworks.choices.mud,
			next: frameworks.choices.next,
			remix: frameworks.choices.remix,
			//       astro: frameworks.choices.astro,
			//       svelte: frameworks.choices.svelte,
			//       vue: frameworks.choices.vue,
		},
	},
	//   game: {
	//     stateKey: frameworks.stateKey,
	//     type: frameworks.type,
	//     prompt: 'Pick a game template (hit arrow left to go back)',
	//     choices: {
	//       mud: frameworks.choices.mud,
	//     }
	//   },
} as const satisfies Record<
	keyof typeof useCases['choices'],
	MultipleChoiceStep
>
