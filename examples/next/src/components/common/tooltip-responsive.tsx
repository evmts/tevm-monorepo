import { useMemo, type FC, type JSX, type ReactNode } from 'react';
import { useMedia } from 'react-use';

import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Icons } from '@/components/common/icons';

/* ---------------------------- SPECIAL TRIGGERS ---------------------------- */
type SpecialTrigger = 'info' | 'warning' | 'error' | 'success';
const iconClasses =
  'size-4 text-secondary-foreground hover:text-foreground transition-colors';
// Mapping of special triggers to their respective icons
const specialTriggerIcons: Record<SpecialTrigger, JSX.Element> = {
  info: <Icons.info className={iconClasses} />,
  warning: (
    <Icons.warning
      className={cn(iconClasses, 'text-orange hover:text-orange-light')}
    />
  ),
  error: (
    <Icons.error className={cn(iconClasses, 'text-red hover:text-red-light')} />
  ),
  success: (
    <Icons.success
      className={cn(iconClasses, 'text-green hover:text-green-light')}
    />
  ),
};

/* --------------------------------- TOOLTIP -------------------------------- */
type TooltipResponsiveProps = {
  trigger: ReactNode | string | SpecialTrigger;
  content: ReactNode | string;
  classNameTrigger?: string;
  classNameContent?: string;
  disabled?: boolean;
};

/**
 * @notice A responsive tooltip that switches to a popover on mobile
 * @dev We need a popover on touch devices to avoid hover issues; basically it works like a tooltip
 * that needs to be explicitly clicked/tapped to show the content
 * @param trigger The element that triggers the tooltip; this can be a string for special triggers
 * @param content The content to display in the tooltip
 * @param classNameTrigger Additional classes to apply to the trigger
 * @param classNameContent Additional classes to apply to the content inside the tooltip
 * @param disabled Whether to disable the tooltip (default: false)
 */
const TooltipResponsive: FC<TooltipResponsiveProps> = ({
  trigger,
  content,
  classNameTrigger,
  classNameContent,
  disabled,
}) => {
  const isDesktop = useMedia('(min-width: 768px)'); // md
  const triggerMapped = useMemo(() => {
    if (typeof trigger === 'string' && trigger in specialTriggerIcons)
      return specialTriggerIcons[trigger as SpecialTrigger];

    return trigger;
  }, [trigger]);

  /* --------------------------------- DESKTOP -------------------------------- */
  if (isDesktop)
    return (
      <TooltipProvider>
        <Tooltip disableHoverableContent={disabled}>
          <TooltipTrigger disabled={disabled} className={classNameTrigger}>
            {triggerMapped}
          </TooltipTrigger>
          {disabled ? null : (
            <TooltipContent className={classNameContent}>
              <div className="text-sm">{content}</div>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );

  /* -------------------------------- MOBILE --------------------------------- */
  return (
    <Popover>
      <PopoverTrigger disabled={disabled} className={classNameTrigger} asChild>
        {triggerMapped}
      </PopoverTrigger>
      {disabled ? null : (
        <PopoverContent className={classNameContent}>
          <div className="text-sm">{content}</div>
        </PopoverContent>
      )}
    </Popover>
  );
};

export default TooltipResponsive;
