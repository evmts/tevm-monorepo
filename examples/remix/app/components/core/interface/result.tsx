import { ABIParameter } from "@shazow/whatsabi/lib.types/abi";
import { FC } from "react";
import { toast } from "sonner";
import { isAddress } from "tevm/utils";
import { formatUnits } from "../../../lib/utils";

import { copyToClipboard } from "../../../lib/utils";
import { Icons } from "../../common/icons";
import ShrinkedAddress from "../../common/shrinked-address";
import { Button } from "../../ui/button";

type FunctionResultProps = {
  result: any;
  outputs: ABIParameter[];
};

/**
 * @notice Display the result of a function call
 * @dev Format outputs based on their type (address, numbers, etc.)
 */
const FunctionResult: FC<FunctionResultProps> = ({ result, outputs }) => {
  // Helper to format result values
  const formatResultValue = (value: any, type: string) => {
    // Big number handling
    if (typeof value === "bigint") {
      // If the type is a uint and likely to be wei
      if (type.includes("uint") && value > 10n ** 10n) {
        return (
          <div className="flex flex-col gap-1">
            <div className="font-mono text-sm break-all">
              {value.toString()}
            </div>
            <div className="text-xs text-muted-foreground">
              ({formatUnits(value)} ETH)
            </div>
          </div>
        );
      }
      return <span className="font-mono">{value.toString()}</span>;
    }

    // Address handling
    if (typeof value === "string" && isAddress(value)) {
      return <ShrinkedAddress address={value} className="font-mono" />;
    }

    // Boolean handling
    if (typeof value === "boolean") {
      return value ? "true" : "false";
    }

    // Array handling
    if (Array.isArray(value)) {
      return (
        <div className="space-y-1">
          {value.map((item, i) => (
            <div key={i} className="pl-2 border-l-2 border-primary/20">
              {formatResultValue(item, type.replace("[]", ""))}
            </div>
          ))}
        </div>
      );
    }

    // Default handling for strings and other types
    return <span className="break-all">{String(value)}</span>;
  };

  // Handle copying the result to clipboard
  const handleCopyResult = async () => {
    try {
      const resultString = JSON.stringify(result, (_, v) =>
        typeof v === "bigint" ? v.toString() : v,
      );

      await copyToClipboard(resultString);
      toast.success("Result copied to clipboard");
    } catch (err) {
      console.error("Failed to copy result:", err);
      toast.error("Failed to copy result");
    }
  };

  // Format result for display
  const formattedResult = () => {
    // If there's a single output and no name
    if (outputs.length === 1 && (!outputs[0].name || outputs[0].name === "")) {
      return (
        <div>
          <div className="mb-2 flex justify-between items-center">
            <div className="text-sm text-muted-foreground">Result:</div>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleCopyResult}
              title="Copy result"
              className="h-6 w-6"
            >
              <Icons.copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="rounded-md bg-muted p-3">
            {formatResultValue(result, outputs[0].type)}
          </div>
        </div>
      );
    }

    // Multiple outputs or named outputs
    return (
      <div>
        <div className="mb-2 flex justify-between items-center">
          <div className="text-sm text-muted-foreground">Results:</div>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleCopyResult}
            title="Copy result"
            className="h-6 w-6"
          >
            <Icons.copy className="h-4 w-4" />
          </Button>
        </div>
        <div className="rounded-md bg-muted p-3 space-y-2">
          {outputs.map((output, index) => (
            <div key={index} className="flex flex-col">
              <span className="text-xs text-muted-foreground">
                {output.name || `output${index}`} ({output.type})
              </span>
              <div className="mt-1">
                {formatResultValue(
                  Array.isArray(result) ? result[index] : result,
                  output.type,
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return formattedResult();
};

export default FunctionResult;
