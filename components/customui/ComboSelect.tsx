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
  multiselect?: boolean;
  focusSearch?: boolean; // New prop
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
  multiselect = false,
  focusSearch = false, // Default to false
}: ComboboxSelectProps) {
  const { control } = useFormContext();
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (open && focusSearch && inputRef.current) {
      inputRef.current.focus(); // Automatically focus the search input
    }
  }, [open, focusSearch]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selectedValues = field.value
          ? (field.value as string).split(",").map((val) => val.trim())
          : [];

        const filteredOptions = options.filter((option) =>
          option.label.toLowerCase().includes(inputValue.toLowerCase())
        );

        const isExistingOption = options.some(
          (option) => option.label.toLowerCase() === inputValue.toLowerCase()
        );

        const toggleValue = (value: string) => {
          if (selectedValues.includes(value)) {
            // Remove value if already selected
            const newValues = selectedValues.filter((v) => v !== value);
            field.onChange(newValues.join(", "));
          } else {
            // Add value if not already selected
            const newValues = [...selectedValues, value];
            field.onChange(newValues.join(", "));
          }
        };

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
                      "w-full justify-between truncate",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {selectedValues.length > 0
                      ? selectedValues.join(", ") // Display comma-separated values
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
                      ref={inputRef} // Attach ref to the CommandInput
                      placeholder={`Search ${
                        allowCustomInput ? "or add " : ""
                      }${label.toLowerCase()}...`}
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
                                if (multiselect) {
                                  toggleValue(option.value);
                                } else {
                                  field.onChange(option.value);
                                  if (closeOnSelect) setOpen(false);
                                }
                                setInputValue("");
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedValues.includes(option.value)
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
                              if (multiselect) {
                                toggleValue(inputValue);
                              } else {
                                field.onChange(inputValue);
                                if (closeOnSelect) setOpen(false);
                              }
                              setInputValue("");
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
