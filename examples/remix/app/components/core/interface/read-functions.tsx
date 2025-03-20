import { FC, useState } from 'react';
import { ABIFunction, ABI } from '@shazow/whatsabi/lib.types/abi';
import { MemoryClient } from 'tevm';
import { Address, encodeAbiParameters } from 'tevm/utils';
import { toast } from 'sonner';

import { formatInputValue, getFunctionId } from '../../../lib/utils';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import FunctionResult from './result';

type ReadFunctionsProps = {
  functions: ABIFunction[];
  abi: ABI;
  address: Address;
  caller: Address;
  client: MemoryClient;
};

/**
 * @notice Display read-only functions from a contract's ABI
 */
const ReadFunctions: FC<ReadFunctionsProps> = ({
  functions,
  abi,
  address,
  caller,
  client,
}) => {
  // Track inputs and results for each function
  const [inputs, setInputs] = useState<Record<string, string[]>>({});
  const [results, setResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  // Handle input change for a function parameter
  const handleInputChange = (
    functionId: string,
    inputIndex: number,
    value: string
  ) => {
    setInputs((prev) => {
      const functionInputs = [...(prev[functionId] || [])];
      functionInputs[inputIndex] = value;
      return { ...prev, [functionId]: functionInputs };
    });
  };

  // Execute a read function call
  const handleCall = async (func: ABIFunction) => {
    const functionId = getFunctionId(abi, func);
    const functionName = func.name || `function-${functionId}`;
    
    // Set loading state
    setLoading((prev) => ({ ...prev, [functionId]: true }));
    
    try {
      // Prepare inputs if the function has parameters
      let callData = `0x${func.selector || ''}`;
      if (func.inputs && func.inputs.length > 0) {
        const functionInputs = inputs[functionId] || [];
        
        // Validate inputs
        if (functionInputs.length < func.inputs.length) {
          throw new Error('Missing required inputs');
        }
        
        // Format input values according to their types
        const formattedInputs = func.inputs.map((input, index) => {
          try {
            return formatInputValue(input.type, functionInputs[index]);
          } catch (err) {
            throw new Error(`Invalid input for ${input.name || `param${index}`}: ${err.message}`);
          }
        });
        
        // Encode parameters
        const encodedParams = encodeAbiParameters(
          func.inputs.map((input) => ({ name: input.name || '', type: input.type })),
          formattedInputs
        );
        
        // Combine function selector with encoded parameters
        callData = `0x${func.selector || ''}${encodedParams.slice(2)}`;
      }
      
      // Call the function
      const result = await client.call({
        account: caller,
        to: address,
        data: callData,
      });
      
      // Process the result
      setResults((prev) => ({ ...prev, [functionId]: result }));
    } catch (err) {
      console.error(`Error calling ${functionName}:`, err);
      toast.error(`Error calling ${functionName}`);
    } finally {
      setLoading((prev) => ({ ...prev, [functionId]: false }));
    }
  };

  if (functions.length === 0) {
    return (
      <p className="text-center text-muted-foreground">
        No read functions found in the contract
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {functions.map((func) => {
        const functionId = getFunctionId(abi, func);
        const functionName = func.name || `function-${functionId}`;
        const hasInputs = func.inputs && func.inputs.length > 0;
        const isLoading = loading[functionId] || false;
        
        return (
          <div 
            key={functionId} 
            className="rounded-md border p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-lg font-medium">{functionName}</h4>
              <div className="text-xs text-muted-foreground">
                {func.stateMutability}
              </div>
            </div>
            
            {/* Function inputs */}
            {hasInputs && (
              <div className="mb-4 space-y-3">
                {func.inputs.map((input, index) => (
                  <div key={`${functionId}-input-${index}`} className="flex flex-col gap-1">
                    <label className="text-sm text-muted-foreground">
                      {input.name || `param${index}`}{' '}
                      <span className="text-xs font-mono">({input.type})</span>
                    </label>
                    <Input
                      value={inputs[functionId]?.[index] || ''}
                      onChange={(e) => handleInputChange(functionId, index, e.target.value)}
                      placeholder={`Enter ${input.type} value`}
                      disabled={isLoading}
                    />
                  </div>
                ))}
              </div>
            )}
            
            {/* Call button */}
            <div className="flex justify-end">
              <Button
                onClick={() => handleCall(func)}
                disabled={isLoading}
                size="sm"
              >
                {isLoading ? 'Loading...' : 'Call'}
              </Button>
            </div>
            
            {/* Result display */}
            {results[functionId] && (
              <div className="mt-4">
                <FunctionResult
                  result={results[functionId]}
                  outputs={func.outputs || []}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ReadFunctions;