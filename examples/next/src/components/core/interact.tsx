import ArbitraryCall from '@/components/core/arbitrary-call';
import Interface from '@/components/core/interface';
import CallerSelection from '@/components/core/selection/caller';

/**
 * @notice The main interaction component, where the user can select a caller, call a method
 * and interact with the contract's interface (or perform arbitrary calls)
 */
const Interact = () => {
  return (
    <>
      <CallerSelection />
      <ArbitraryCall />
      <Interface />
    </>
  );
};

export default Interact;
