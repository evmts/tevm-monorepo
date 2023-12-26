import { useEffect, useReducer, useRef } from 'react';

type State = {
  isLoading: boolean;
  errors: Error | null;
  // todo type me
  optimistic: any | null;
  // todo type me
  receipt: any | null;
  // todo type me
  hash: any | null;
}

const contractOperationReducer = (state: State, action: { tag: 'START', success: true } | {
  success: true,
  // TODO type me
  tag: string,
  // todo type me
  data: any,
  // todo this should be typesafe
  errors?: ReadonlyArray<Error>
} | {
  success: false,
  // TODO type me
  tag: string,
  // todo type me
  error: Error,
  // todo this should be typesafe
  errors?: ReadonlyArray<Error>
}) => {
  const defaultHandler = () => {
    if (!action.success) {
      return { ...state, optimistic: action, errors: state.errors };
    }
    return { ...state, optimistic: action, isLoading: false };
  }
  switch (action.tag) {
    case 'START':
      return { ...state, isLoading: true, errors: null };
    case 'OPTIMISTIC_RESULT':
      return defaultHandler()
    case 'HASH':
      return defaultHandler()
    case 'RECEIPT':
      return defaultHandler()
    default:
      return state;
  }
};


const initialState = {
  isLoading: false,
  errors: null,
  optimistic: null,
  receipt: null,
  hash: null
};

// TOOD type it
export const createHooks = (optimisticClient: any) => {
  // TODO type me
  const useContractOperation = (params: any) => {
    const [state, dispatch] = useReducer(contractOperationReducer, initialState);
    const operation = useRef(null);

    const cancelOperation = () => {
      if (operation.current) {
        // Logic to cancel the current operation
        operation.current = null;
      }
    };

    useEffect(() => {
      cancelOperation();

      const performOperation = async () => {
        const writeGenerator = optimisticClient.writeContractOptimistic(params)
        dispatch({ tag: 'START', success: true });
        try {
          for await (const result of writeGenerator) {
            dispatch(result)
          }
        } catch (error) {
          dispatch({ tag: 'ERROR', success: false, error: error as any });
        }
      };
      operation.current = performOperation() as any;
      return () => cancelOperation();
    }, [params]); // Dependency array includes all parameters that trigger re-calculation

    return state;
  };

  return {
    useContractOperation
  }
}
