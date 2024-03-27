'use client';

import { FC } from 'react';

import { Chain } from '@/lib/types/providers';
import { EXAMPLE_VALUES } from '@/lib/constants/defaults';
import { useMediaQuery } from '@/lib/hooks/use-media-query';
import { Button } from '@/components/ui/button';

type ExampleButtonProps = {
  handleAccountSearch: (address: string, chain: Chain) => void;
};

/**
 * @notice Select a contract by pasting its address and selecting a chain
 * @dev This will fetch the abi and retrieve the contract's methods
 */
const ExampleButton: FC<ExampleButtonProps> = ({ handleAccountSearch }) => {
  // Expand from tablet breakpoint
  const isTablet = useMediaQuery('(min-width: 640px)'); // sm

  /* --------------------------------- RENDER --------------------------------- */
  return (
    // This will set the chain, client and contract to the example values,
    // then handle searching its abi to get the interface
    // See `components/core/selection/contract.tsx` for the full implementation
    <Button
      size={isTablet ? 'default' : 'sm'}
      variant="secondary"
      onClick={() =>
        handleAccountSearch(EXAMPLE_VALUES.contract, EXAMPLE_VALUES.chain)
      }
    >
      Try with an example
    </Button>
  );
};

export default ExampleButton;
