import { ABI } from "@shazow/whatsabi/lib.types/abi";
import { FC } from "react";
import { GetAccountResult } from "tevm";
import { Address } from "tevm/utils";

import { useConfigStore } from "../../../lib/store/use-config";
import { useProviderStore } from "../../../lib/store/use-provider";
import { Heading } from "../../common/typography";
import ReadFunctions from "./read-functions";

type ContractInterfaceProps = {
  account: GetAccountResult;
  abi: ABI;
  caller: Address;
  skipBalance: boolean;
};

/**
 * @notice The contract interface for interacting with a contract
 * @dev This component displays all function calls available for the contract
 */
const ContractInterface: FC<ContractInterfaceProps> = ({
  account,
  abi,
  caller,
  skipBalance,
}) => {
  // Split the ABI into read and write functions
  const readFunctions = abi.filter(
    (item) =>
      item.type === "function" &&
      (item.stateMutability === "view" || item.stateMutability === "pure"),
  );

  const writeFunctions = abi.filter(
    (item) =>
      item.type === "function" &&
      item.stateMutability !== "view" &&
      item.stateMutability !== "pure",
  );

  // Get the client from the provider store
  const client = useProviderStore((state) => state.client);

  if (!account || !client) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">Loading contract interface...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {readFunctions.length > 0 && (
        <div>
          <Heading level={3} className="mb-4">
            Read Functions
          </Heading>
          <div className="space-y-4">
            <ReadFunctions
              functions={readFunctions}
              abi={abi}
              address={account.address}
              client={client}
              caller={caller}
            />
          </div>
        </div>
      )}

      {writeFunctions.length > 0 && (
        <div>
          <Heading level={3} className="mb-4">
            Write Functions
          </Heading>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Write functions will be implemented in the next update.
            </p>
            {/* WriteFunctions component will be implemented later */}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractInterface;
