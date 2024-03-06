import { FC } from 'react';

import { useProviderStore } from '@/lib/store/use-provider';
import AccountState from '@/components/core/account-state';
import SearchBar from '@/components/core/search-bar';
import ChainSelection from '@/components/core/selection/chain';

type HeaderProps = {
  initialAddress?: string;
};

/**
 * @notice The header of the app, where the user can search for an account, interact with
 * the chain (select & reset) and view information about the current account
 * @dev This will render a skeleton until the app is hydrated, because you don't want to render
 * it with default values (instead of the ones saved in local storage), as this would only be confusing
 * to the user.
 * @param initialAddress The researched address, if relevant (not on the home page)
 */
const Header: FC<HeaderProps> = ({ initialAddress }) => {
  const isHydrated = useProviderStore((state) => state.isHydrated);

  return (
    <>
      <SearchBar initialAddress={initialAddress} hydrating={!isHydrated} />
      <ChainSelection hydrating={!isHydrated} />
      <AccountState />
    </>
  );
};

export default Header;
