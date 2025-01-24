// ComboboxSelect.tsx
"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import { Check, ChevronsUpDown, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ComboboxSelectProps {
  name: string;
  label: string;
  description?: string;
  placeholder?: string;
  options: { label: string; value: string }[];
  allowCustomInput?: boolean;
  closeOnSelect?: boolean;
  required?: boolean;
}

export function ComboboxSelect({
  name,
  label,
  description,
  placeholder = "Select...",
  options,
  allowCustomInput = false,
  closeOnSelect = true,
  required = false,
}: ComboboxSelectProps) {
  const { control } = useFormContext();
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // Filter options based on input value
        const filteredOptions = options.filter((option) =>
          option.label.toLowerCase().includes(inputValue.toLowerCase())
        );

        // Check if inputValue matches any option
        const isExistingOption = options.some(
          (option) => option.label.toLowerCase() === inputValue.toLowerCase()
        );

        return (
          <FormItem className="flex-1">
            <FormLabel>
              {label}
              {required && <span className="text-red-500">*</span>}
            </FormLabel>
            <FormControl>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                      "w-full justify-between",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value
                      ? options.find((option) => option.value === field.value)
                          ?.label || field.value // Show custom input value
                      : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-full p-0"
                  side="bottom"
                  align="start"
                  sideOffset={4}
                >
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder={`Search ${label.toLowerCase()}...`}
                      value={inputValue}
                      onValueChange={(val) => setInputValue(val)}
                    />
                    <CommandList>
                      {filteredOptions.length === 0 && !allowCustomInput && (
                        <CommandEmpty>No results found.</CommandEmpty>
                      )}
                      {filteredOptions.length > 0 && (
                        <CommandGroup>
                          {filteredOptions.map((option) => (
                            <CommandItem
                              value={option.label}
                              key={option.value}
                              onSelect={() => {
                                field.onChange(option.value);
                                setInputValue("");
                                if (closeOnSelect) setOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  option.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {option.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}

                      {allowCustomInput && inputValue && !isExistingOption && (
                        <CommandGroup>
                          <CommandItem
                            value={inputValue}
                            onSelect={() => {
                              field.onChange(inputValue);
                              setInputValue("");
                              if (closeOnSelect) setOpen(false);
                            }}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Use &quot;{inputValue}&quot;
                          </CommandItem>
                        </CommandGroup>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
