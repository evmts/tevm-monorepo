import { type Step } from './types.js';
export type Choice = {
    label: string;
    value: number | string | boolean;
};
export type MultipleChoice = {
    [choice in string]: Choice;
};
export type MultipleChoiceStep = Step & {
    type: 'multiple-choice';
    choices: MultipleChoice;
};
export declare const useCases: {
    readonly type: "multiple-choice";
    readonly prompt: "What do you want to build?";
    readonly stateKey: "useCase";
    readonly choices: {
        readonly simple: {
            readonly value: "simple";
            readonly label: "simple";
        };
        readonly ui: {
            readonly value: "ui";
            readonly label: "ui";
        };
        readonly server: {
            readonly value: "server";
            readonly label: "server";
        };
        readonly all: {
            readonly value: "all";
            readonly label: "all";
        };
    };
};
export declare const packageManagers: {
    readonly type: "multiple-choice";
    readonly prompt: "What package manager do you want to use?";
    readonly stateKey: "packageManager";
    readonly choices: {
        readonly npm: {
            readonly value: "npm";
            readonly label: "npm";
        };
        readonly pnpm: {
            readonly value: "pnpm";
            readonly label: "pnpm(recommended)";
        };
        readonly bun: {
            readonly value: "bun";
            readonly label: "bun";
        };
        readonly yarn: {
            readonly value: "yarn";
            readonly label: "yarn";
        };
    };
};
export declare const frameworks: {
    readonly type: "multiple-choice";
    readonly prompt: "Pick a template";
    readonly stateKey: "framework";
    readonly choices: {
        readonly simple: {
            readonly value: "simple";
            readonly label: "simple - Bare bones EVMts project";
        };
        readonly bun: {
            readonly value: "bun";
            readonly label: "bun: Fast-growing Node.js alternative emphasizing peformance";
        };
        readonly cli: {
            readonly value: "server";
            readonly label: "cli: Ethereum CLI application using clack";
        };
        readonly mud: {
            readonly value: "mud";
            readonly label: "mud(recommended) - Ethereum framework for ambitious applications";
        };
        readonly pwa: {
            readonly value: "pwa";
            readonly label: "pwa - Simple React+Vite PWA";
        };
        readonly next: {
            readonly value: "next";
            readonly label: "next - The most popular react framework";
        };
        readonly remix: {
            readonly value: "remix";
            readonly label: "remix - React framework emphasizing tighter integration with the web platform";
        };
        readonly server: {
            readonly value: "server";
            readonly label: "server: A fastify Node.js server";
        };
    };
};
export declare const gitChoices: {
    readonly type: "multiple-choice";
    readonly prompt: "Do you want to initialize a git repo?";
    readonly stateKey: "gitChoice";
    readonly choices: {
        readonly git: {
            readonly value: "git";
            readonly label: "yes - Use git";
        };
        readonly none: {
            readonly value: "none";
            readonly label: "no";
        };
    };
};
export declare const installChoices: {
    readonly type: "multiple-choice";
    readonly prompt: "Do you want to install dependencies?";
    readonly stateKey: "installChoice";
    readonly choices: {
        readonly install: {
            readonly value: "install";
            readonly label: "yes - install dependencies";
        };
        readonly none: {
            readonly value: "none";
            readonly label: "no - skip install";
        };
    };
};
//# sourceMappingURL=MultipleChoice.d.ts.map