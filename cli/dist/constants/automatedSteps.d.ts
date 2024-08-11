import type { Step } from './types.js';
export type AutomatedStep = Step & {
    type: 'automated';
    loadingMessage: string;
    successMessage: string;
};
export declare const creatingProject: {
    readonly type: "automated";
    readonly prompt: "Creating project";
    readonly stateKey: "creatingProject";
    readonly loadingMessage: "Creating project";
    readonly successMessage: "Project created";
};
export declare const initializingGit: {
    readonly type: "automated";
    readonly prompt: "Initializing git";
    readonly stateKey: "initializingGit";
    readonly loadingMessage: "Initializing git";
    readonly successMessage: "Git initialized";
};
export declare const installingDependencies: {
    readonly type: "automated";
    readonly prompt: "Installing dependencies";
    readonly stateKey: "installingDependencies";
    readonly loadingMessage: "Installing dependencies";
    readonly successMessage: "Dependencies installed";
};
//# sourceMappingURL=automatedSteps.d.ts.map