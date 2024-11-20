import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useFormContext } from "react-hook-form";

interface FormCheckboxFieldProps {
  name: string;
  label: React.ReactNode;
  required?: boolean;
}

export function FormCheckboxField({
  name,
  label,
  required = false,
}: FormCheckboxFieldProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex items-start space-x-3">
          <FormControl>
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
          <FormLabel className="leading-tight">
            {label}
            {required && <span className="text-red-500">*</span>}
          </FormLabel>
        </FormItem>
      )}
    />
  );
}
