import { useParams } from "@remix-run/react";
import { useEffect } from "react";
import { toast } from "sonner";
import { getAddress } from "tevm/utils";

import ShrinkedAddress from "../components/common/shrinked-address";
import { Heading } from "../components/common/typography";
import Interact from "../components/core/interact";
import { useConfigStore } from "../lib/store/use-config";
import { useProviderStore } from "../lib/store/use-provider";
import { formatUnits } from "../lib/utils";

export default function AccountPage() {
  const params = useParams();
  const account = params.account;

  // Get the chain and client from the provider store
  const { chain, client, setProvider } = useProviderStore();

  // Get the account state from the config store
  const {
    account: accountState,
    abi,
    fetchingAccount,
    updateAccount,
  } = useConfigStore();

  // Set up the account when the page loads
  useEffect(() => {
    if (!account || !client) return;

    try {
      // Validate the address
      const validAddress = getAddress(account);

      // Update the account state
      updateAccount(validAddress, {
        updateAbi: true,
        chain,
        client,
      });
    } catch (err) {
      toast.error("Invalid address");
      console.error("Error fetching account:", err);
    }
  }, [account, chain, client, updateAccount]);

  // Loading state
  if (fetchingAccount || !accountState) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-64 rounded bg-muted" />
          <div className="h-20 w-full max-w-2xl rounded bg-muted" />
          <div className="h-48 w-full max-w-2xl rounded bg-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start gap-2">
        <Heading level={1} className="flex items-center gap-2">
          <span>{accountState.isContract ? "Contract" : "Account"}</span>
          <ShrinkedAddress
            address={accountState.address}
            className="font-mono text-muted-foreground"
          />
        </Heading>
        <p className="text-sm text-muted-foreground">
          On {chain.name} ({chain.id})
        </p>
      </div>

      <div className="rounded-lg border p-6">
        <Heading level={2} className="mb-4">
          Account Details
        </Heading>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Balance
            </h3>
            <p className="mt-1 font-medium">
              {formatUnits(accountState.balance)} ETH
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Nonce</h3>
            <p className="mt-1 font-medium">{accountState.nonce.toString()}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Type</h3>
            <p className="mt-1 font-medium">
              {accountState.isContract
                ? "Contract"
                : "Externally Owned Account"}
            </p>
          </div>
          {accountState.isContract && abi && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Functions
              </h3>
              <p className="mt-1 font-medium">{abi.length} found</p>
            </div>
          )}
        </div>
      </div>

      {accountState.isContract && (
        <div className="rounded-lg border p-6">
          <Heading level={2} className="mb-4">
            Contract Interaction
          </Heading>
          <Interact />
        </div>
      )}
    </div>
  );
}
