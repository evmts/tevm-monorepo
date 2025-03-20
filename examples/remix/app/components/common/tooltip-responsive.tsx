import React from 'react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

type TooltipResponsiveProps = {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  disabled?: boolean;
  className?: string;
};

/**
 * @notice A tooltip component that can be conditionally disabled
 * @param children The trigger element
 * @param content The tooltip content
 * @param side The side of the tooltip
 * @param align The alignment of the tooltip
 * @param disabled Whether to disable the tooltip
 * @param className Additional classes to apply to the tooltip content
 * @returns A component that displays a tooltip when hovering over the trigger
 */
const TooltipResponsive = ({
  children,
  content,
  side = 'top',
  align = 'center',
  disabled = false,
  className,
}: TooltipResponsiveProps) => {
  if (disabled) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} align={align} className={className}>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipResponsive;