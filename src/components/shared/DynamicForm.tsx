"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  Button,
  Checkbox,
  Input,
  Select,
  Textarea,
  Radio,
  Color,
  File,
  Range,
} from "../ui";

/**
 * Type definition for form field configuration
 * This defines the shape of each field object passed to the DynamicForm component
 */
export type FormField = {
  colSize?: {
    desktop?: number; // 1–12, e.g. 3 for 3/12
    tablet?: number; // 1–12, e.g. 6 for 6/12
    mobile?: number; // 1–12, e.g. 12 for full width
  };
  /** Unique identifier for the form field (maps to form data key) */
  name: string;
  /** Display label for the field */
  label: string;
  /** HTML input type determining the UI element rendered */
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "date"
    | "datetime-local"
    | "select"
    | "textarea"
    | "checkbox"
    | "radio"
    | "time"
    | "week"
    | "month"
    | "color"
    | "file"
    | "range"
    | "url"
    | "tel"
    | "search";
  /** Placeholder text for input fields */
  placeholder?: string;
  /** Options for select and radio button fields */
  options?: Array<{ value: string; label: string }>;
  /** Zod validation schema for this field */
  validation: z.ZodTypeAny;
  /** Optional: show asterisk for required fields */
  required?: boolean;
  /** Optional: helper text displayed below the field */
  helperText?: string;
  /** Optional: disable the field */
  disabled?: boolean;

  sizes?: {
    desktop: number;
    tablet: number;
    mobile: number;
  };
};

/**
 * Props interface for the DynamicForm component
 */
export interface DynamicFormProps {
  /** Array of form field configurations */
  config: FormField[];
  /** Async function to handle form submission */
  onSubmit: (data: Record<string, any>) => Promise<void>;
  /** Text displayed on the submit button */
  submitText?: string;
  /** Callback fired on successful submission */
  onSuccess?: () => void;
  /** Additional CSS classes to apply to the form */
  className?: string;
  defaultValues?: Record<string, any>;
}

/**
 * DynamicForm Component
 *
 * A flexible, reusable form component that generates form fields from JSON configuration.
 * Integrates with react-hook-form, Zod validation, Tailwind CSS v4, TanStack React Query,
 * and react-hot-toast for a complete form solution.
 *
 * Features:
 * - Dynamic field generation from JSON config
 * - Real-time validation with Zod schemas
 * - Server-side mutation handling via TanStack Query
 * - User feedback via toast notifications
 * - Type-safe form handling with TypeScript
 * - Responsive design with Tailwind CSS v4
 * - Accessible form elements with proper labels and error messages
 */
export const DynamicForm: React.FC<DynamicFormProps> = ({
  config,
  onSubmit,
  submitText = "Submit",
  onSuccess,
  className = "",
  defaultValues = {},
}) => {
  // ============================================================================
  // Schema Generation
  // ============================================================================
  // Dynamically construct a Zod schema object from the config array.
  // Each field's validation rule is extracted and combined into a single schema.

  const schemaObject: Record<string, z.ZodTypeAny> = config.reduce(
    (schema, field) => {
      schema[field.name] = field.validation;
      return schema;
    },
    {} as Record<string, z.ZodTypeAny>
  );

  const validationSchema = z.object(schemaObject);
  type FormData = z.infer<typeof validationSchema>;

  // ============================================================================
  // React Hook Form Setup
  // ============================================================================
  // Initialize the form with zodResolver to integrate Zod validation.
  // This provides form state management, field registration, and validation.

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    reset,
  } = useForm<FormData>({
    defaultValues,
    resolver: zodResolver(validationSchema),
    mode: "onChange", // Validate on every change for instant feedback
  });

  // ============================================================================
  // TanStack React Query Mutation
  // ============================================================================
  // Use useMutation to handle the async form submission.
  // The mutation manages loading, success, and error states automatically.

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      // Call the provided onSubmit handler with validated data
      await onSubmit(data);
    },
    onSuccess: () => {
      // Show success toast notification
      toast.success("Form submitted successfully!", {
        position: "top-right",
        duration: 4000,
      });

      // Reset the form to initial state
      reset();

      // Call the optional onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: Error) => {
      // Show error toast notification with error message
      toast.error(error.message || "Something went wrong. Please try again.", {
        position: "top-right",
        duration: 4000,
      });
    },
  });

  // ============================================================================
  // Form Submission Handler
  // ============================================================================
  // This wraps react-hook-form's handleSubmit with the mutation's mutateAsync.
  // This ensures the loading state is properly managed by react-hook-form.

  const onFormSubmit = handleSubmit((data) => mutation.mutateAsync(data));

  // ============================================================================
  // Component Rendering
  // ============================================================================
  // This section maps over the config array and renders appropriate input
  // components based on the 'type' field. Error messages are displayed inline.

  return (
    <form
      onSubmit={onFormSubmit}
      className={`w-full grid grid-cols-12 gap-6
         rounded-lg bg-white p-6 shadow-md  ${className} `}
      noValidate
    >
      {/* Map over config array and render each field */}
      {config.map((field) => (
        <div
          key={field.name}
          className={`
    col-span-${field?.colSize?.mobile || 12}
    md:col-span-${field?.colSize?.tablet || 12}
    lg:col-span-${field?.colSize?.desktop || 12}
    
  `}
        >
          {/* Switch Statement for Different Input Types */}
          {/* Text-Based Inputs */}
          {(field.type === "text" ||
            field.type === "email" ||
            field.type === "password" ||
            field.type === "number" ||
            field.type === "date" ||
            field.type === "datetime-local" ||
            field.type === "time" ||
            field.type === "week" ||
            field.type === "month" ||
            field.type === "url" ||
            field.type === "tel" ||
            field.type === "search") && (
            <Input
              helperText={field.helperText}
              label={field.label}
              required={field.required}
              id={field.name}
              type={field.type}
              placeholder={field.placeholder}
              disabled={field.disabled || mutation.isPending}
              {...register(field.name)}
              error={errors[field.name]}
            />
          )}

          {/* Textarea Input */}
          {field.type === "textarea" && (
            <Textarea
              helperText={field.helperText}
              label={field.label}
              required={field.required}
              id={field.name}
              placeholder={field.placeholder}
              disabled={field.disabled || mutation.isPending}
              {...register(field.name)}
              error={errors[field.name]}
              rows={4}
            />
          )}

          {/* Select Dropdown */}
          {field.type === "select" && (
            <Select
              label={field.label}
              required={field.required}
              id={field.name}
              disabled={field.disabled || mutation.isPending}
              helperText={field.helperText}
              {...register(field.name)}
              error={errors[field.name]}
              options={field.options}
            />
          )}

          {/* Color Picker Input */}
          {field.type === "color" && (
            <Color
              label={field.label}
              required={field.required}
              error={errors[field.name]}
              id={field.name}
              helperText={field.helperText}
              disabled={field.disabled || mutation.isPending}
              {...register(field.name)}
            />
          )}

          {/* File Input */}
          {field.type === "file" && (
            <File
              label={field.label}
              required={field.required}
              error={errors[field.name]}
              id={field.name}
              helperText={field.helperText}
              disabled={field.disabled || mutation.isPending}
              {...register(field.name)}
            />
          )}

          {/* Checkbox Input */}
          {field.type === "checkbox" && (
            <Checkbox
              label={field.label}
              helperText={field.helperText}
              disabled={field.disabled || mutation.isPending}
              {...register(field.name)}
              error={errors[field.name]}
            />
          )}

          {/* Radio Button Input */}
          {field.type === "radio" && (
            <Radio
              id={field.name}
              label={field.label}
              options={field.options}
              required={field.required}
              error={errors[field.name]}
              helperText={field.helperText}
              disabled={field.disabled || mutation.isPending}
              {...register(field.name)}
            />
          )}
          {/* Range Slider Input */}
          {field.type === "range" && (
            <Range
              label={field.label}
              required={field.required}
              error={errors[field.name]}
              id={field.name}
              helperText={field.helperText}
              disabled={field.disabled || mutation.isPending}
              value={watch(field.name as keyof FormData)}
              {...register(field.name)}
            />
          )}
        </div>
      ))}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!isValid || mutation.isPending}
        className="w-full rounded-md bg-blue-600 py-2 px-4 font-semibold text-white transition-all duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {mutation.isPending ? (
          <span className="flex items-center justify-center space-x-2">
            <svg
              className="h-5 w-5 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Submitting...</span>
          </span>
        ) : (
          submitText
        )}
      </Button>
    </form>
  );
};

export default DynamicForm;
