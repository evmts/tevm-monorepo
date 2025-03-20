import { useEffect } from 'react';
import { useParams } from '@remix-run/react';
import { getAddress } from 'tevm/utils';
import { toast } from 'sonner';

import { useConfigStore } from '../lib/store/use-config';
import { useProviderStore } from '../lib/store/use-provider';

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
    updateAccount 
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
      toast.error('Invalid address');
      console.error('Error fetching account:', err);
    }
  }, [account, chain, client, updateAccount]);

  // Loading state
  if (fetchingAccount || !accountState) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-64 rounded bg-muted"></div>
          <div className="h-20 w-full max-w-2xl rounded bg-muted"></div>
          <div className="h-48 w-full max-w-2xl rounded bg-muted"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Account: {accountState.address}</h1>
      
      <div className="rounded-lg border p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium">Balance</h3>
            <p>{accountState.balance.toString()} wei</p>
          </div>
          <div>
            <h3 className="font-medium">Nonce</h3>
            <p>{accountState.nonce.toString()}</p>
          </div>
          <div>
            <h3 className="font-medium">Type</h3>
            <p>{accountState.isContract ? 'Contract' : 'EOA'}</p>
          </div>
          {accountState.isContract && abi && (
            <div>
              <h3 className="font-medium">Functions</h3>
              <p>{abi.length} found</p>
            </div>
          )}
        </div>
      </div>

      {/* TODO: Add the contract interaction components here */}
    </div>
  );
}