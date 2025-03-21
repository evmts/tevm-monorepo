import { Link } from "@remix-run/react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";

import { cn } from "../../lib/utils";
import { Icons } from "./icons";

type ShrinkableAddressProps = {
  address?: string;
  length?: number;
  className?: string;
  prefixLength?: number;
  suffixLength?: number;
  withCopy?: boolean;
  withLink?: boolean;
  linkPrefix?: string;
};

/**
 * @notice Renders a shrinked address with configurable options
 * @param address The address to display
 * @param length The total length to display
 * @param className Additional classname for styling
 * @param prefixLength Number of characters to show at the beginning
 * @param suffixLength Number of characters to show at the end
 * @param withCopy Whether to show a copy button
 * @param withLink Whether to link to the address page
 * @param linkPrefix Optional prefix for the address link
 * @returns A component that displays a shortened address with optional copy/link functionality
 */
const ShrinkedAddress = ({
  address,
  length = 66,
  className,
  prefixLength = 6,
  suffixLength = 4,
  withCopy = false,
  withLink = false,
  linkPrefix = "",
}: ShrinkableAddressProps) => {
  const [copied, setCopied] = useState(false);

  if (!address) {
    return null;
  }

  // Fallback for non-standard addresses
  if (address.length < length) {
    return (
      <span title={address} className={cn("font-mono", className)}>
        {address}
      </span>
    );
  }

  // Auto-collapse long addresses
  const prefix = address.slice(0, prefixLength);
  const suffix = address.slice(-suffixLength);
  const content = (
    <span title={address} className={cn("font-mono", className)}>
      {prefix}...{suffix}
    </span>
  );

  // Handle the copy functionality
  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  // Default rendering without copy or link
  if (!withCopy && !withLink) {
    return content;
  }

  // Wrap with link if needed
  const linked = withLink ? (
    <Link to={`/${linkPrefix}${address}`}>{content}</Link>
  ) : (
    content
  );

  // Add copy button if needed
  if (withCopy) {
    return (
      <div className="flex items-center space-x-1">
        {linked}
        <button
          type="button"
          onClick={handleCopy}
          className="ml-1 transition-opacity hover:opacity-70"
        >
          {copied ? (
            <Icons.check className="h-3.5 w-3.5" />
          ) : (
            <Icons.copy className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    );
  }

  return linked;
};

export default ShrinkedAddress;
