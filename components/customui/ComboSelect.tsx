"use client";

import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Check, ChevronsUpDown } from "lucide-react";

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
  closeOnSelect?: boolean; // Add this prop
}

export function ComboboxSelect({
  name,
  label,
  description,
  placeholder = "Select...",
  options,
  allowCustomInput = false,
  closeOnSelect = true, // Default to close on select
}: ComboboxSelectProps) {
  const { control } = useFormContext();
  const [isCustom, setIsCustom] = React.useState(false);
  const [open, setOpen] = React.useState(false); // State to control popover visibility

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? options.find((option) => option.value === field.value)
                        ?.label || field.value // Show custom input value
                    : placeholder}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto min-w-[var(--radix-popover-trigger-width)] p-0">
              <Command>
                <CommandInput
                  placeholder={`Search ${label.toLowerCase()}...`}
                  onValueChange={(val) => {
                    if (
                      allowCustomInput &&
                      val &&
                      !options.some((o) => o.label === val)
                    ) {
                      setIsCustom(true);
                      field.onChange(val); // Set custom input as value
                    } else {
                      setIsCustom(false);
                    }
                  }}
                />
                <CommandList>
                  <CommandEmpty>
                    {isCustom
                      ? `Using ${
                          field.value
                            ? `"${field.value}" as custom input`
                            : "custom input"
                        }`
                      : "No results found"}
                  </CommandEmpty>
                  <CommandGroup>
                    {options.map((option) => (
                      <CommandItem
                        value={option.label}
                        key={option.value}
                        onSelect={() => {
                          setIsCustom(false); // Reset custom input
                          field.onChange(option.value);
                          if (closeOnSelect) setOpen(false); // Close if `closeOnSelect` is true
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
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
