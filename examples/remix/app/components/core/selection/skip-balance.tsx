import { FC } from "react";
import { useConfigStore } from "../../../lib/store/use-config";
import { Icons } from "../../common/icons";
import TooltipResponsive from "../../common/tooltip-responsive";
import { Label } from "../../ui/label";

/**
 * @notice Toggle to enable/disable skipping balance checks when making calls
 * @dev This is useful for testing contract calls when the caller doesn't have enough balance
 */
const SkipBalanceSelection: FC = () => {
  /* ---------------------------------- STATE --------------------------------- */
  const { skipBalance, setSkipBalance } = useConfigStore((state) => ({
    skipBalance: state.skipBalance,
    setSkipBalance: state.setSkipBalance,
  }));

  /* -------------------------------- HANDLERS -------------------------------- */
  const handleToggle = () => {
    setSkipBalance(!skipBalance);
  };

  /* --------------------------------- RENDER --------------------------------- */
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2">
        <Label
          htmlFor="skip-balance"
          className="text-sm font-semibold tracking-wide"
        >
          Skip Balance
        </Label>
        <TooltipResponsive content="Skip balance checks when making calls (useful for testing)">
          <Icons.info className="h-4 w-4 text-muted-foreground" />
        </TooltipResponsive>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={skipBalance}
        onClick={handleToggle}
        className={`
          relative inline-flex h-6 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent
          transition-colors duration-200 ease-in-out
          ${skipBalance ? "bg-primary" : "bg-muted"} 
          focus:outline-none focus-visible:ring-2 focus-visible:ring-ring
        `}
      >
        <span
          aria-hidden="true"
          className={`
            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background
            shadow-lg ring-0 transition duration-200 ease-in-out
            ${skipBalance ? "translate-x-4" : "translate-x-0"}
          `}
        />
      </button>
    </div>
  );
};

export default SkipBalanceSelection;
