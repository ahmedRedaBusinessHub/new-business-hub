"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion } from "framer-motion";
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
  Switch,
  TagInput,
  Calendar,
  RichTextEditor,
  FileUploader,
  ImageUploader,
  Map,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Progress,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  Label,
} from "../ui";
import { Send, Info } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import { TooltipProvider } from "../ui/Tooltip";
import { Toggle } from "../ui/Toggle";
import { Slider } from "../ui/Slider";
import { Rating } from "../ui/Rating";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/Accordion";

/* -------------------------------------------------------------------------- */
/*                               Types                                        */
/* -------------------------------------------------------------------------- */

export type FormField = {
  colSize?: { desktop?: number; tablet?: number; mobile?: number };
  name: string;
  label: string;
  type:
  | "text"
  | "email"
  | "password"
  | "number"
  | "date"
  | "datetime-local"
  | "time"
  | "week"
  | "month"
  | "url"
  | "tel"
  | "search"
  | "textarea"
  | "select"
  | "checkbox"
  | "radio"
  | "switch"
  | "toggle"
  | "slider"
  | "range"
  | "color"
  | "file"
  | "fileuploader"
  | "imageuploader"
  | "tags"
  | "calendar"
  | "richtext"
  | "map"
  | "rating"
  | "section"
  | "hidden";
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  validation: z.ZodTypeAny;
  required?: boolean;
  helperText?: string;
  disabled?: boolean;
  multiple?: boolean;
  accept?: string;
  maxSize?: number;
  showPreview?: boolean;
  min?: number;
  max?: number;
  step?: number;
  maxRating?: number;
  fields?: FormField[];
  collapsible?: boolean;
  defaultOpen?: boolean;
  dependsOn?: string;
  showWhen?: (value: any) => boolean;
  tooltip?: string;
};

export interface DynamicFormProps {
  config: FormField[];
  onSubmit: (data: Record<string, any>) => Promise<void>;
  submitText?: string;
  onSuccess?: () => void;
  className?: string;
  defaultValues?: Record<string, any>;
  layout?: "single" | "tabs" | "accordion" | "wizard";
  showProgress?: boolean;
  onError?: (error: Error & { fieldErrors?: Record<string, string> }) => void;
  formId?: string;
}

/* -------------------------------------------------------------------------- */
/*                         Stable Field Wrapper                                */
/* -------------------------------------------------------------------------- */

const FieldWrapper = React.memo(
  ({
    name,
    label,
    required,
    tooltip,
    error,
    helperText,
    children,
  }: {
    name: string;
    label?: string;
    required?: boolean;
    tooltip?: string;
    error?: string;
    helperText?: string;
    children: React.ReactNode;
  }) => (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center gap-2">
          <Label htmlFor={name}>
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </Label>
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>{tooltip}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      )}
      {children}
      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
);

/* -------------------------------------------------------------------------- */
/*                             Component                                      */
/* -------------------------------------------------------------------------- */

export const DynamicForm: React.FC<DynamicFormProps> = ({
  config,
  onSubmit,
  submitText = "Submit",
  onSuccess,
  className = "",
  defaultValues = {},
  layout = "single",
  showProgress = false,
  onError,
  formId,
}) => {
  const { t } = useI18n();
  const [currentStep, setCurrentStep] = useState(0);

  const schemaObject = useMemo(() => {
    const build = (fields: FormField[]): Record<string, z.ZodTypeAny> => {
      const s: Record<string, z.ZodTypeAny> = {};
      fields.forEach((f) => {
        if (f.type === "section" && f.fields) Object.assign(s, build(f.fields));
        else if (f.type !== "hidden") s[f.name] = f.validation;
      });
      return s;
    };
    return build(config);
  }, [config]);

  const validationSchema = useMemo(() => z.object(schemaObject), [schemaObject]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    reset,
    setError,
    getValues,
  } = useForm({
    defaultValues,
    resolver: zodResolver(validationSchema),
    mode: "onChange",
  });

  const watchedValues = useWatch({ control });

  const mutation = useMutation({
    mutationFn: async (data: Record<string, any>) => {
      try {
        await onSubmit(data);
      } catch (error: any) {
        // Re-throw error to ensure onError is called and onSuccess is NOT called
        throw error;
      }
    },
    onSuccess: () => {
      // Only called when mutation succeeds (no error thrown)
      // This is the ONLY place where we reset form and close modal
      reset();
      onSuccess?.(); // This closes the modal - only called on success
    },
    onError: (e: Error & { fieldErrors?: Record<string, string> }) => {
      // IMPORTANT: This is called when mutation fails
      // onSuccess is NOT called, so:
      // - reset() is NOT called (form data is preserved)
      // - onSuccess callback is NOT called (modal stays open)

      // Preserve current form values - do NOT reset
      const currentValues = getValues();

      // Set field-specific errors if provided
      if (e.fieldErrors) {
        Object.keys(e.fieldErrors).forEach((fieldName) => {
          setError(fieldName as any, {
            type: "server",
            message: e.fieldErrors![fieldName],
          });
        });
      }

      // Always show error message toast (user requested to show message)
      // Show the original API message if available, otherwise use the error message
      const displayMessage = (e as any).originalMessage || e.message || "An error occurred. Please check the form for details.";

      if (onError) {
        onError(e);
      } else {
        // Show toast with error message (prefer original API message)
        toast.error(displayMessage);
      }

      // DO NOT reset form here - form data must be preserved
      // DO NOT call onSuccess here - modal must stay open
      // Form values are already preserved in currentValues if needed
    },
  });

  const renderField = useCallback(
    (field: FormField) => {
      if (field.dependsOn && field.showWhen) {
        if (!field.showWhen(watchedValues?.[field.dependsOn])) return null;
      }

      const error = errors[field.name]?.message as string | undefined;

      const wrapperProps = {
        name: field.name,
        label: field.label,
        required: field.required,
        tooltip: field.tooltip,
        helperText: field.helperText,
        error,
      };

      switch (field.type) {
        case "text":
        case "email":
        case "password":
        case "number":
        case "tel":
        case "date":
        case "datetime-local":
        case "time":
        case "week":
        case "month":
        case "url":
        case "search":
          return (
            <FieldWrapper {...wrapperProps}>
              <Input
                {...register(field.name)}
                type={field.type}
                placeholder={field.placeholder}
              />
            </FieldWrapper>
          );

        case "textarea":
          return (
            <FieldWrapper {...wrapperProps}>
              <Textarea {...register(field.name)} placeholder={field.placeholder} />
            </FieldWrapper>
          );

        case "select":
          return (
            <FieldWrapper {...wrapperProps}>
              <Controller
                name={field.name}
                control={control}
                render={({ field: controllerField }) => (
                  <Select
                    {...controllerField}
                    error={error}
                    value={controllerField.value ?? ""}
                    options={field.options}
                  >
                    {field.placeholder && (
                      <option value="">{field.placeholder}</option>
                    )}
                  </Select>
                )}
              />
            </FieldWrapper>
          );

        case "switch":
          return (
            <FieldWrapper {...wrapperProps}>
              <Controller
                name={field.name}
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </FieldWrapper>
          );

        case "rating":
          return (
            <FieldWrapper {...wrapperProps}>
              <Controller
                name={field.name}
                control={control}
                render={({ field: controllerField }) => (
                  <Rating
                    value={controllerField.value}
                    onChange={controllerField.onChange}
                    max={field.maxRating ?? 5}
                  />
                )}
              />
            </FieldWrapper>
          );

        case "imageuploader":
          return (
            <FieldWrapper {...wrapperProps}>
              <Controller
                name={field.name}
                control={control}
                render={({ field: controllerField }) => (
                  <ImageUploader
                    accept={field.accept || ".jpg,.jpeg,.png,.gif,.webp,.avif,.bmp,.tiff"}
                    multiple={field.multiple || false}
                    maxSize={field.maxSize || 5 * 1024 * 1024}
                    onChange={(files) => controllerField.onChange(files)}
                    onError={(error) => {
                      console.error("Image upload error:", error);
                      toast.error(error);
                    }}
                  />
                )}
              />
            </FieldWrapper>
          );

        case "fileuploader":
          return (
            <FieldWrapper {...wrapperProps}>
              <Controller
                name={field.name}
                control={control}
                render={({ field: controllerField }) => (
                  <FileUploader
                    accept={field.accept}
                    multiple={field.multiple || false}
                    maxSize={field.maxSize}
                    onChange={(files) => controllerField.onChange(files)}
                    onError={(error) => {
                      console.error("File upload error:", error);
                      toast.error(error);
                    }}
                  />
                )}
              />
            </FieldWrapper>
          );

        case "hidden":
          return <input type="hidden" {...register(field.name)} />;

        default:
          return null;
      }
    },
    [control, errors, register, watchedValues]
  );

  const getColSpan = (field: FormField): string => {
    const fullWidthTypes = ["textarea", "richtext", "imageuploader", "fileuploader", "map"];
    if (fullWidthTypes.includes(field.type)) return "col-span-12";
    if (field.colSize?.desktop) return `col-span-${field.colSize.desktop}`;
    // Use sm: breakpoint (640px) for 2-column layout to work better with medium modals (max-w-4xl = 896px)
    return "col-span-12 sm:col-span-6";
  };

  const handleFormSubmit = async (data: Record<string, any>) => {
    try {
      // Use mutateAsync - if it throws, onError is called, onSuccess is NOT called
      // This ensures the modal stays open on error
      await mutation.mutateAsync(data);
    } catch (error: any) {
      // Error is already handled by mutation.onError
      // We catch here to prevent unhandled promise rejection
      // The form will NOT reset and modal will NOT close because:
      // 1. onSuccess is NOT called (only called on success)
      // 2. reset() is only called in onSuccess
      // 3. onSuccess callback (which closes modal) is only called in onSuccess
      // So the error is handled, form stays open, data is preserved
    }
  };

  return (
    <motion.form
      id={formId}
      onSubmit={handleSubmit(handleFormSubmit)}
      className={`space-y-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="grid grid-cols-12 gap-4">
        {config.map((f) => (
          <div key={f.name} className={getColSpan(f)}>
            {renderField(f)}
          </div>
        ))}
      </div>

      {submitText && (
        <div className="flex justify-end">
          <Button type="submit" disabled={!isValid || mutation.isPending}>
            {mutation.isPending ? t("Sending") : submitText}
            <Send className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </motion.form>
  );
};

export default DynamicForm;