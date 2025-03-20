import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { isAddress } from 'tevm/utils';
import { useMedia } from 'react-use';
import { toast } from 'sonner';
import { ABIFunction, ABI } from '@shazow/whatsabi/lib.types/abi';
import { GetAccountResult } from 'tevm';

import { DEFAULT_CALLER } from '../../../lib/constants/defaults';
import { useConfigStore } from '../../../lib/store/use-config';
import { cn } from '../../../lib/utils';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Icons } from '../../common/icons';
import TooltipResponsive from '../../common/tooltip-responsive';

type CallerSelectionProps = {
  account: GetAccountResult;
};

/**
 * @notice Select a caller address to impersonate for contract interactions
 * @dev This will be used for all transactions issued from the interface
 * @param account The account to interact with
 */
const CallerSelection: FC<CallerSelectionProps> = ({ account }) => {
  /* ---------------------------------- STATE --------------------------------- */
  // A temporary value for the input
  const [value, setValue] = useState<string>('');
  // Whether the input value passes the checksum
  const [isValidAddress, setIsValidAddress] = useState<boolean>(true);

  // Expand from tablet breakpoint
  const isTablet = useMedia('(min-width: 640px)'); // sm

  // Get the caller from the store
  const { caller, setCaller } = useConfigStore((state) => ({
    caller: state.caller,
    setCaller: state.setCaller,
  }));

  // Get the abi from the store (to find the owner)
  const abi = useConfigStore((state) => state.abi);

  // Check on mount, to avoid having the "set owner" button if there's no owner method
  const [showOwnerButton, setShowOwnerButton] = useState<boolean>(false);
  useEffect(() => {
    if (!abi || !account.isContract) return;

    // Check if there's an "owner" method in the ABI (or similar)
    const ownerMethods = ['owner', 'getOwner', 'OWNER'];
    const hasOwnerMethod = abi.some(
      (method) =>
        method.type === 'function' &&
        ownerMethods.includes(method.name?.toLowerCase() || ''),
    );

    setShowOwnerButton(hasOwnerMethod);
  }, [abi, account]);

  // Initialize the input with the caller from the store on mount
  useEffect(() => {
    setValue(caller);
  }, [caller]);

  /* -------------------------------- HANDLERS -------------------------------- */
  // Handle the change of the input (update only if valid address, keep track of validation)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setValue(value);
    setIsValidAddress(value === '' || isAddress(value));
  };

  // Handle the change of the caller
  const handleCallerChange = () => {
    if (!isValidAddress) return;
    const validValue = value === '' ? DEFAULT_CALLER : value;

    if (value !== caller) {
      setCaller(validValue);
      toast.success(`Caller set to ${validValue.slice(0, 6)}...${validValue.slice(-4)}`);
    }
  };

  // Handle the click on "Set owner"
  const handleOwnerClick = async () => {
    try {
      if (!account.isContract) {
        toast.error('This is not a contract');
        return;
      }

      // Get the owner method from the ABI
      const ownerMethod = abi?.find(
        (method) =>
          method.type === 'function' &&
          ['owner', 'getOwner', 'OWNER'].includes(method.name?.toLowerCase() || ''),
      ) as ABIFunction | undefined;

      // Inform the user if there's no owner method
      if (!ownerMethod) {
        toast.info("This contract doesn't have an owner method");
        return;
      }

      // This feature is a placeholder since we haven't implemented the contract interaction yet
      toast.info("Contract interaction will be available in the next update");

      // In the Next.js implementation, this would normally:
      // 1. Call the owner method
      // 2. Update the caller state with the owner address
      // 3. Show a success toast
    } catch (err) {
      console.error('Error setting owner:', err);
      toast.error('Could not set owner');
    }
  };

  /* --------------------------------- RENDER --------------------------------- */
  return (
    <div className="flex w-full max-w-xl flex-col gap-1">
      <div className="flex items-center gap-2">
        <Label htmlFor="caller" className="text-sm font-semibold tracking-wide">
          Caller
        </Label>
        <TooltipResponsive
          content="The address that will be used as the caller for all requests"
        >
          <Icons.info className="h-4 w-4 text-muted-foreground" />
        </TooltipResponsive>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Input
            value={value}
            onChange={handleChange}
            className={cn(
              !isValidAddress && 'border-red-500',
              'font-mono text-xs md:text-sm',
            )}
            placeholder={isTablet ? DEFAULT_CALLER : 'Caller address'}
          />
          {!isValidAddress ? (
            <span className="absolute -bottom-5 left-0 text-xs font-medium text-red-500">
              Invalid address
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          {showOwnerButton ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleOwnerClick}
              className="whitespace-nowrap"
            >
              Set owner
            </Button>
          ) : null}
          <Button
            variant="default"
            size="sm"
            disabled={!isValidAddress}
            onClick={handleCallerChange}
            className="whitespace-nowrap"
          >
            Set caller
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CallerSelection;