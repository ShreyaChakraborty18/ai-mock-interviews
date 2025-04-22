// Importing necessary types and components from React Hook Form and custom UI components.
import { Controller, Control, FieldValues, Path } from "react-hook-form"; 
// `Controller` is used to wrap controlled components in React Hook Form.
// `Control` is the type for the form control object.
// `FieldValues` is a generic type for form field values.
// `Path` is used to define the path to a specific field in the form.

import {
  FormItem, // Wrapper for a form field.
  FormLabel, // Label for the form field.
  FormControl, // Wrapper for the input control.
  FormMessage, // Component to display validation error messages.
} from "@/components/ui/form"; // Custom UI components for consistent styling.

import { Input } from "@/components/ui/input"; // Custom Input component for text fields.

// Define the props for the `FormField` component.
// This is a generic interface that works with any form field values (`T`).
interface FormFieldProps<T extends FieldValues> {
  control: Control<T>; // The form control object from React Hook Form.
  name: Path<T>; // The name of the field, which must match the form schema.
  label: string; // The label for the form field.
  placeholder?: string; // Optional placeholder text for the input field.
  type?: "text" | "email" | "password" | "file"; // The type of the input field (default is "text").
}

// Define the `FormField` component as a generic function component.
// It takes the props defined above and renders a form field.
const FormField = <T extends FieldValues>({
  control, // The form control object.
  name, // The name of the field.
  label, // The label for the field.
  placeholder, // The placeholder text (optional).
  type = "text", // The input type (default is "text").
}: FormFieldProps<T>) => {
  return (
    // Use the `Controller` component from React Hook Form to manage the field.
    <Controller
      control={control} // Pass the form control object.
      name={name} // Specify the name of the field.
      render={({ field }) => ( // Render the field using the `render` prop.
        <FormItem>
          {/* Render the label for the field */}
          <FormLabel className="label">{label}</FormLabel>
          <FormControl>
            {/* Render the input field */}
            <Input
              className="input" // Apply custom styles to the input.
              type={type} // Set the input type (e.g., text, email, password).
              placeholder={placeholder} // Set the placeholder text (if provided).
              {...field} // Spread the field props provided by React Hook Form.
            />
          </FormControl>
          {/* Render the validation error message (if any) */}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

// Export the `FormField` component for use in other parts of the application.
export default FormField;