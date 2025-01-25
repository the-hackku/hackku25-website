"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";

interface FormInputFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
  formatValue?: (value: string) => string;
}

export function FormInputField({
  name,
  label,
  placeholder,
  required = false,
  type = "text",
  formatValue,
}: FormInputFieldProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name as string}
      render={({ field }) => (
        <FormItem className="flex-1 text-base">
          <FormLabel>
            {label}
            {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              value={formatValue ? formatValue(field.value) : field.value || ""}
              onChange={(e) => field.onChange(e.target.value)}
              className="w-full text-base"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
