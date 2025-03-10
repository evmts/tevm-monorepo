'use client';

import { useState, type FC } from 'react';
import { useMedia } from 'react-use';

import type { ComboboxOption } from '@/lib/types/templates';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Icons } from '@/components/common/icons';

/* -------------------------------------------------------------------------- */
/*                                  COMBOBOX                                  */
/* -------------------------------------------------------------------------- */

type ComboBoxResponsiveProps = {
  items: ComboboxOption[];
  label: string;
  selected: ComboboxOption;
  setSelected: (item: ComboboxOption) => void;
  header?: string;
  disabled?: boolean;
  className?: string;
};

/**
 * @notice A responsive combobox that will display a popover on desktop and a drawer on mobile
 * @param items The list of items to display
 * @param label The label to display on the button
 * @param selected The currently selected item
 * @param setSelected The function triggered when an item is selected
 * @param header The header to display in the drawer (default: 'Select a {label}')
 * @param disabled Whether the whole combobox is disabled (default: false)
 * @param className Additional classses to apply to the button
 * @dev Modified from shadcn/ui
 * @see https://ui.shadcn.com/docs/components/combobox
 */
const ComboBoxResponsive: FC<ComboBoxResponsiveProps> = (props) => {
  const { label, className, selected, disabled, header, setSelected } = props;
  const [open, setOpen] = useState<boolean>(false);

  const isDesktop = useMedia('(min-width: 768px)'); // md

  /* --------------------------------- DESKTOP -------------------------------- */
  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild disabled={disabled}>
          <Button
            variant="outline"
            className={cn('flex w-full items-center justify-start', className)}
          >
            {selected ? (
              selected.label
            ) : (
              <>
                <Icons.down className="mr-2 size-4" /> {label}
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0" align="start">
          <ItemList
            setOpen={setOpen}
            setSelectedItem={setSelected}
            {...props}
          />
        </PopoverContent>
      </Popover>
    );
  }

  /* --------------------------------- MOBILE --------------------------------- */
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className={cn('flex w-[250px] items-center justify-start', className)}
        >
          {selected ? (
            selected.label
          ) : (
            <>
              <Icons.down className="mr-2 size-4" /> {label}
            </>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <span className="text-secondary-foreground mt-2 text-center font-medium">
          {header}
        </span>
        <div className="mt-4 border-t">
          <ItemList
            setOpen={setOpen}
            setSelectedItem={setSelected}
            {...props}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

/* -------------------------------------------------------------------------- */
/*                                    LIST                                    */
/* -------------------------------------------------------------------------- */

type ItemListProps = {
  items: ComboboxOption[];
  label: string;
  setOpen: (open: boolean) => void;
  setSelectedItem: (item: ComboboxOption) => void;
};

const ItemList: FC<ItemListProps> = ({
  items,
  label,
  setOpen,
  setSelectedItem,
}) => {
  return (
    <Command>
      <CommandInput placeholder={`Filter ${label.toLowerCase()}s...`} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {items.map((item) => (
            <CommandItem
              key={item.value}
              value={item.value.toString()}
              onSelect={(value) => {
                setSelectedItem(
                  items.find(
                    (priority) =>
                      priority.value.toString().toLowerCase() ===
                      value.toLowerCase(),
                  ) || items[0],
                );
                setOpen(false);
              }}
            >
              <div className="flex items-center">{item.label}</div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export default ComboBoxResponsive;
