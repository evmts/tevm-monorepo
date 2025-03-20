import * as React from 'react';
import { useMedia } from 'react-use';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';
import { ComboboxOption } from '../../lib/types/templates';
import { Skeleton } from '../ui/skeleton';

interface ComboBoxResponsiveProps {
  items: ComboboxOption[];
  selected: ComboboxOption;
  setSelected: (selected: ComboboxOption) => void;
  header?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  loading?: boolean;
  label?: string;
  className?: string;
}

/**
 * @notice A combobox component that works for both desktop and mobile
 * @param items The items to display in the combobox
 * @param selected The currently selected item
 * @param setSelected A function to set the selected item
 * @param header The header text to display at the top of the popup
 * @param placeholder The placeholder text to display when no item is selected
 * @param searchPlaceholder The placeholder text to display in the search input
 * @param disabled Whether the combobox is disabled
 * @param loading Whether the combobox is loading
 * @param label A label to display above the combobox
 * @param className Additional classes to apply to the combobox
 * @returns A component that displays a combobox with selectable options
 */
const ComboBoxResponsive = ({
  items,
  selected,
  setSelected,
  header,
  placeholder = 'Select an item...',
  searchPlaceholder = 'Search...',
  disabled = false,
  loading = false,
  label,
  className,
}: ComboBoxResponsiveProps) => {
  const [open, setOpen] = React.useState(false);

  // Expand from tablet breakpoint
  const isTablet = useMedia('(min-width: 640px)'); // sm

  if (loading) {
    return <Skeleton className={cn('h-8 w-full', className)} />;
  }

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label && (
        <span className="text-md text-secondary-foreground lg:text-lg">
          {label}
        </span>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              'flex w-full min-w-[100px] justify-between',
              !selected && 'text-muted-foreground',
            )}
          >
            {selected ? selected.label : placeholder}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="z-50 w-full p-0">
          <Command>
            {header && (
              <div className="p-2 font-medium text-sm">
                {header}
              </div>
            )}
            <CommandInput placeholder={searchPlaceholder} />
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.label}
                    onSelect={() => {
                      setSelected({
                        label: item.label,
                        value: item.value,
                      });
                      setOpen(false);
                    }}
                  >
                    <CheckIcon
                      className={cn(
                        'mr-2 h-4 w-4',
                        selected.value === item.value
                          ? 'opacity-100'
                          : 'opacity-0',
                      )}
                    />
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ComboBoxResponsive;