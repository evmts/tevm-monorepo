import { useConfigStore } from '@/lib/store/use-config';
import ArbitraryCall from '@/components/core/arbitrary-call';
import DebuggerToggle from '@/components/core/debugger';
import Interface from '@/components/core/interface';
import CallerSelection from '@/components/core/selection/caller';

/**
 * @notice The main interaction component, where the user can select a caller, call a method
 * and interact with the contract's interface (or perform arbitrary calls)
 */
const Interact = () => {
  const { account } = useConfigStore((state) => ({
    account: state.account,
  }));

  return (
    <>
      <CallerSelection />
      {account && <DebuggerToggle contractAddress={account.address} />}
      <ArbitraryCall />
      <Interface />
    </>
  );
};

export default Interact;
