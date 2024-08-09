import { basename } from 'path';
/**
 * Sets the name input when user types
 */
const setInput = (payload, state) => {
    return { ...state, [payload.input]: payload.value };
};
/**
 * Selects an option and continues to the next step
 */
const selectAndContinue = ((payload, state) => {
    const newState = {
        ...state,
        [payload.name]: payload.value,
        currentStep: payload.nextPage ? state.currentStep : state.currentStep + 1,
        currentPage: payload.nextPage
            ? goToNextPage({}, state).currentPage
            : state.currentPage,
    };
    const isName = payload.name === 'name';
    const isFrameworkBun = payload.name === 'framework' && payload.value.includes('bun');
    const isFrameworkMud = payload.name === 'framework' && payload.value.includes('mud');
    // if name step is set also set the path if name is a path instead of a name
    if (isName) {
        return {
            ...newState,
            path: payload.value,
            name: basename(payload.value),
        };
    }
    else if (isFrameworkBun) {
        return {
            ...newState,
            packageManager: 'bun',
        };
    }
    else if (isFrameworkMud) {
        return {
            ...newState,
            packageManager: 'pnpm',
            linter: 'eslint-prettier',
            typescriptStrictness: 'strict',
            testFrameworks: 'none',
            solidityFramework: 'foundry',
            contractStrategy: 'local',
        };
    }
    else {
        return newState;
    }
});
const goToPreviousStep = (_, state) => {
    if (state.currentStep === 0) {
        return state;
    }
    return {
        ...state,
        currentStep: state.currentStep - 1,
    };
};
/**
 * Gos to the next page of the prompt
 */
const goToNextPage = (_, state) => {
    if (state.currentPage === 'interactive') {
        return {
            ...state,
            currentPage: 'creating',
        };
    }
    if (state.currentPage === 'creating') {
        return {
            ...state,
            currentPage: 'complete',
        };
    }
    if (state.currentPage === 'complete') {
        throw new Error('Cannot go to next page from complete');
    }
    throw new Error(`Unknown page ${state.currentPage}`);
};
/**
 * Available state transition functions
 */
export const reducers = {
    setInput,
    goToNextPage,
    selectAndContinue,
    goToPreviousStep,
};
