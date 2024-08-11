import type { State } from './State.js';
/**
 * State transition functions the UI can call
 */
export type Reducer<TPayload> = (payload: TPayload, state: State) => State;
/**
 * Mapping of available state transition functions
 */
export type Reducers = typeof reducers;
/**
 * Available state transition functions
 */
export declare const reducers: {
    setInput: Reducer<{
        value: string;
        input: "chainIdInput" | "nameInput" | "walletConnectIdInput";
    }>;
    goToNextPage: Reducer<any>;
    selectAndContinue: <TName extends keyof State>(payload: {
        name: TName;
        value: State[TName];
        nextPage?: boolean;
    }, state: State) => {
        readonly path: State["path"];
        readonly name: string;
        readonly nameInput: string;
        readonly walletConnectIdInput: string;
        readonly currentStep: number;
        readonly currentPage: import("./State.js").Page;
        readonly walletConnectProjectId: string;
        readonly useCase: "simple" | "ui" | "server";
        readonly packageManager: "npm" | "pnpm" | "bun" | "yarn";
        readonly framework: "simple" | "server" | "bun" | "mud" | "pwa" | "next" | "remix";
        readonly skipPrompts: boolean;
        readonly noGit: boolean;
        readonly noInstall: boolean;
    } | {
        readonly packageManager: "pnpm";
        readonly linter: "eslint-prettier";
        readonly typescriptStrictness: "strict";
        readonly testFrameworks: "none";
        readonly solidityFramework: "foundry";
        readonly contractStrategy: "local";
        readonly name: import("zod").TypeOf<typeof import("../create/args.js").args>[0];
        readonly path: import("zod").TypeOf<typeof import("../create/args.js").args>[0];
        readonly nameInput: string;
        readonly walletConnectIdInput: string;
        readonly currentStep: number;
        readonly currentPage: import("./State.js").Page;
        readonly walletConnectProjectId: string;
        readonly useCase: "simple" | "ui" | "server";
        readonly framework: "simple" | "server" | "bun" | "mud" | "pwa" | "next" | "remix";
        readonly skipPrompts: boolean;
        readonly noGit: boolean;
        readonly noInstall: boolean;
    };
    goToPreviousStep: Reducer<any>;
};
//# sourceMappingURL=reducers.d.ts.map