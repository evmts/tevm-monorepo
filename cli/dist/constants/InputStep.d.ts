import type { Step } from './types.js';
/**
* A cli step where user enters input text
*/
export type InputStep = Step & {
    type: 'input';
};
/**
* Name of the project
*/
export declare const nameStep: {
    readonly type: "input";
    readonly prompt: "What is the name of your project?";
    readonly stateKey: "name";
};
/**
* Comma seperated list of chainIds used by the project
*/
export declare const walletConnectProjectId: {
    readonly type: "input";
    readonly prompt: "Please enter your wallet connect project id. See https://docs.walletconnect.com/cloud/relay#project-id";
    readonly stateKey: "walletConnectProjectId";
};
//# sourceMappingURL=InputStep.d.ts.map