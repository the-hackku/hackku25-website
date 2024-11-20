// FormSelectField.tsx
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import { useFormContext } from "react-hook-form";

interface Option<T> {
  label: string;
  value: T;
}

interface FormSelectFieldProps<T> {
  name: string;
  label: string;
  options: Option<T>[];
  required?: boolean;
  onChange?: (value: T) => void;
}

export function FormSelectField<T extends string>({
  name,
  label,
  options,
  required = false,
  onChange,
}: FormSelectFieldProps<T>) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name as string}
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormLabel>
            {label}
            {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                if (onChange) onChange(value as T);
              }}
              value={field.value || ""}
            >
              <SelectTrigger className="w-full">
                {field.value || "Select..."}
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
