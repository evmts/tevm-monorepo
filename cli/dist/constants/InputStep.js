/**
* Name of the project
*/
export const nameStep = {
    type: 'input',
    prompt: 'What is the name of your project?',
    stateKey: 'name',
};
/**
* Comma seperated list of chainIds used by the project
*/
export const walletConnectProjectId = {
    type: 'input',
    prompt: 'Please enter your wallet connect project id. See https://docs.walletconnect.com/cloud/relay#project-id',
    stateKey: 'walletConnectProjectId',
};
