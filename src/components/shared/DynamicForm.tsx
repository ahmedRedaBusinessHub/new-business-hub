"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion } from "motion/react";
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
  Alert,
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

/**
 * Enhanced FormField type with support for all UI components
 */
export type FormField = {
  // Layout configuration
  colSize?: {
    desktop?: number; // 1–12
    tablet?: number; // 1–12
    mobile?: number; // 1–12
  };

  // Field identification
  name: string;
  label: string;

  // Extended type support for all UI components
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
    | "section" // For grouping fields
    | "hidden";

  // Field configuration
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  validation: z.ZodTypeAny;
  required?: boolean;
  helperText?: string;
  disabled?: boolean;

  // File upload specific
  multiple?: boolean;
  accept?: string;
  maxSize?: number;
  showPreview?: boolean;

  // Slider/Range specific
  min?: number;
  max?: number;
  step?: number;

  // Rating specific
  maxRating?: number;

  // Section specific (for grouping)
  fields?: FormField[];
  collapsible?: boolean;
  defaultOpen?: boolean;

  // Conditional rendering
  dependsOn?: string;
  showWhen?: (value: any) => boolean;

  // Advanced
  tooltip?: string;
  icon?: React.ReactNode;
};

/**
 * Enhanced DynamicForm Props
 */
export interface DynamicFormProps {
  config: FormField[];
  onSubmit: (data: Record<string, any>) => Promise<void>;
  submitText?: string;
  onSuccess?: () => void;
  className?: string;
  defaultValues?: Record<string, any>;
  layout?: "single" | "tabs" | "accordion" | "wizard";
  showProgress?: boolean;
}

/**
 * Enhanced DynamicForm Component
 *
 * Supports all UI components with advanced features:
 * - All input types from basic to complex
 * - Conditional field rendering
 * - Section/grouping with accordion/tabs
 * - File uploads with preview
 * - Rich text editing
 * - Maps and location
 * - Rating systems
 * - Progress indicators
 * - Tooltips and helpers
 */
export const DynamicForm: React.FC<DynamicFormProps> = ({
  config,
  onSubmit,
  submitText = "Submit",
  onSuccess,
  className = "",
  defaultValues = {},
  layout = "single",
  showProgress = false,
}) => {
  const { t } = useI18n();
  const [currentStep, setCurrentStep] = useState(0);

  // ============================================================================
  // Schema Generation
  // ============================================================================
  const buildSchema = (fields: FormField[]): Record<string, z.ZodTypeAny> => {
    const schema: Record<string, z.ZodTypeAny> = {};

    fields.forEach((field) => {
      if (field.type === "section" && field.fields) {
        Object.assign(schema, buildSchema(field.fields));
      } else if (field.type !== "hidden") {
        schema[field.name] = field.validation;
      }
    });

    return schema;
  };

  const schemaObject = buildSchema(config);
  const validationSchema = z.object(schemaObject);
  type FormData = z.infer<typeof validationSchema>;

  // ============================================================================
  // React Hook Form Setup
  // ============================================================================
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    watch,
    reset,
    setValue,
  } = useForm<FormData>({
    defaultValues,
    resolver: zodResolver(validationSchema),
    mode: "onChange",
  });

  const watchedValues = watch();

  // ============================================================================
  // Mutation
  // ============================================================================
  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      await onSubmit(data);
    },
    onSuccess: () => {
      toast.success(t("Form submitted successfully!"), {
        position: "top-right",
        duration: 4000,
      });
      reset();
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      toast.error(
        error.message || t("Something went wrong. Please try again."),
        {
          position: "top-right",
          duration: 4000,
        }
      );
    },
  });

  const onFormSubmit = handleSubmit((data) => mutation.mutateAsync(data));

  // ============================================================================
  // Field Renderer
  // ============================================================================
  const renderField = (field: FormField) => {
    // Check conditional rendering
    if (field.dependsOn && field.showWhen) {
      const dependentValue = watchedValues[field.dependsOn];
      if (!field.showWhen(dependentValue)) {
        return null;
      }
    }

    const fieldError = errors[field.name];
    const errorMessage = fieldError?.message as string;

    // Wrapper for field with label and error
    const FieldWrapper = ({ children }: { children: React.ReactNode }) => (
      <div className="space-y-2">
        {field.label && (
          <div className="flex items-center gap-2">
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {field.tooltip && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{field.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        )}
        {children}
        {field.helperText && !errorMessage && (
          <p className="text-sm text-muted-foreground">{field.helperText}</p>
        )}
        {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
      </div>
    );

    // Render based on type
    switch (field.type) {
      // ========== Text-based inputs ==========
      case "text":
      case "email":
      case "password":
      case "number":
      case "date":
      case "datetime-local":
      case "time":
      case "week":
      case "month":
      case "url":
      case "tel":
      case "search":
        return (
          <FieldWrapper>
            <Input
              id={field.name}
              type={field.type}
              placeholder={field.placeholder}
              disabled={field.disabled}
              error={fieldError}
              {...register(field.name)}
            />
          </FieldWrapper>
        );

      // ========== Textarea ==========
      case "textarea":
        return (
          <FieldWrapper>
            <Textarea
              id={field.name}
              placeholder={field.placeholder}
              disabled={field.disabled}
              error={fieldError}
              {...register(field.name)}
            />
          </FieldWrapper>
        );

      // ========== Select ==========
      case "select":
        return (
          <FieldWrapper>
            <Select
              disabled={field.disabled}
              error={fieldError}
              {...register(field.name)}
            >
              <option value="">
                {field.placeholder || "Select an option"}
              </option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FieldWrapper>
        );

      // ========== Checkbox ==========
      case "checkbox":
        return (
          <FieldWrapper>
            <Checkbox
              id={field.name}
              disabled={field.disabled}
              {...register(field.name)}
            />
          </FieldWrapper>
        );

      // ========== Radio ==========
      case "radio":
        return (
          <FieldWrapper>
            <div className="space-y-2">
              {field.options?.map((option) => (
                <div key={option.value} className="flex items-center gap-2">
                  <Radio
                    id={`${field.name}-${option.value}`}
                    value={option.value}
                    disabled={field.disabled}
                    {...register(field.name)}
                  />
                  <Label htmlFor={`${field.name}-${option.value}`}>
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </FieldWrapper>
        );

      // ========== Switch ==========
      case "switch":
        return (
          <FieldWrapper>
            <Controller
              name={field.name}
              control={control}
              render={({ field: { onChange, value } }) => (
                <Switch
                  checked={value}
                  onCheckedChange={onChange}
                  disabled={field.disabled}
                />
              )}
            />
          </FieldWrapper>
        );

      // ========== Toggle ==========
      case "toggle":
        return (
          <FieldWrapper>
            <Controller
              name={field.name}
              control={control}
              render={({ field: { onChange, value } }) => (
                <Toggle
                  pressed={value}
                  onPressedChange={onChange}
                  disabled={field.disabled}
                >
                  {field.placeholder || "Toggle"}
                </Toggle>
              )}
            />
          </FieldWrapper>
        );

      // ========== Slider ==========
      case "slider":
        return (
          <FieldWrapper>
            <Controller
              name={field.name}
              control={control}
              render={({ field: { onChange, value } }) => (
                <Slider
                  min={field.min ?? 0}
                  max={field.max ?? 100}
                  step={field.step ?? 1}
                  value={[value || field.min || 0]}
                  onValueChange={(vals) => onChange(vals[0])}
                  disabled={field.disabled}
                />
              )}
            />
          </FieldWrapper>
        );

      // ========== Range ==========
      case "range":
        return (
          <FieldWrapper>
            <Range
              min={field.min ?? 0}
              max={field.max ?? 100}
              step={field.step ?? 1}
              disabled={field.disabled}
              {...register(field.name)}
            />
          </FieldWrapper>
        );

      // ========== Color ==========
      case "color":
        return (
          <FieldWrapper>
            <Color
              disabled={field.disabled}
              error={fieldError}
              {...register(field.name)}
            />
          </FieldWrapper>
        );

      // ========== File ==========
      case "file":
        return (
          <FieldWrapper>
            <File
              label={field.label}
              multiple={field.multiple}
              accept={field.accept}
              showPreview={field.showPreview}
              maxSize={field.maxSize}
              disabled={field.disabled}
              error={fieldError}
              helperText={field.helperText}
              {...register(field.name)}
            />
          </FieldWrapper>
        );

      // ========== File Uploader ==========
      case "fileuploader":
        return (
          <FieldWrapper>
            <Controller
              name={field.name}
              control={control}
              render={({ field: { onChange, value } }) => (
                <FileUploader
                  value={value}
                  onChange={onChange}
                  accept={field.accept}
                  multiple={field.multiple}
                  disabled={field.disabled}
                />
              )}
            />
          </FieldWrapper>
        );

      // ========== Image Uploader ==========
      case "imageuploader":
        return (
          <FieldWrapper>
            <Controller
              name={field.name}
              control={control}
              render={({ field: { onChange, value } }) => (
                <ImageUploader
                  value={value}
                  onChange={onChange}
                  disabled={field.disabled}
                />
              )}
            />
          </FieldWrapper>
        );

      // ========== Tag Input ==========
      case "tags":
        return (
          <FieldWrapper>
            <Controller
              name={field.name}
              control={control}
              render={({ field: { onChange, value } }) => (
                <TagInput
                  value={value || []}
                  onChange={onChange}
                  placeholder={field.placeholder}
                  disabled={field.disabled}
                />
              )}
            />
          </FieldWrapper>
        );

      // ========== Calendar ==========
      case "calendar":
        return (
          <FieldWrapper>
            <Controller
              name={field.name}
              control={control}
              render={({ field: { onChange, value } }) => (
                <Calendar
                  mode="single"
                  selected={value}
                  onSelect={onChange}
                  disabled={field.disabled}
                />
              )}
            />
          </FieldWrapper>
        );

      // ========== Rich Text Editor ==========
      case "richtext":
        return (
          <FieldWrapper>
            <Controller
              name={field.name}
              control={control}
              render={({ field: { onChange, value } }) => (
                <RichTextEditor
                  value={value}
                  onChange={onChange}
                  placeholder={field.placeholder}
                  disabled={field.disabled}
                />
              )}
            />
          </FieldWrapper>
        );

      // ========== Map ==========
      case "map":
        return (
          <FieldWrapper>
            <Controller
              name={field.name}
              control={control}
              render={({ field: { onChange, value } }) => (
                <Map
                  value={value}
                  onChange={onChange}
                  disabled={field.disabled}
                />
              )}
            />
          </FieldWrapper>
        );

      // ========== Rating ==========
      case "rating":
        return (
          <FieldWrapper>
            <Controller
              name={field.name}
              control={control}
              render={({ field: { onChange, value } }) => (
                <Rating
                  value={value}
                  onChange={onChange}
                  max={field.maxRating ?? 5}
                  disabled={field.disabled}
                />
              )}
            />
          </FieldWrapper>
        );

      // ========== Section (Grouping) ==========
      case "section":
        if (field.collapsible) {
          return (
            <Accordion
              type="single"
              collapsible
              defaultValue={field.defaultOpen ? field.name : undefined}
            >
              <AccordionItem value={field.name}>
                <AccordionTrigger>{field.label}</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-12 gap-4">
                    {field.fields?.map((subField) => (
                      <div
                        key={subField.name}
                        className={getColSpanClass(subField.colSize)}
                      >
                        {renderField(subField)}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          );
        } else {
          return (
            <Card>
              <CardHeader>
                <CardTitle>{field.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-12 gap-4">
                  {field.fields?.map((subField) => (
                    <div
                      key={subField.name}
                      className={getColSpanClass(subField.colSize)}
                    >
                      {renderField(subField)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        }

      case "hidden":
        return <input type="hidden" {...register(field.name)} />;

      default:
        return null;
    }
  };

  // ============================================================================
  // Utility Functions
  // ============================================================================
  const getColSpanClass = (colSize?: {
    desktop?: number;
    tablet?: number;
    mobile?: number;
  }) => {
    const desktop = colSize?.desktop || 12;
    const tablet = colSize?.tablet || 12;
    const mobile = colSize?.mobile || 12;

    return `col-span-${mobile} md:col-span-${tablet} lg:col-span-${desktop}`;
  };

  // ============================================================================
  // Layout Rendering
  // ============================================================================
  const renderLayout = () => {
    switch (layout) {
      case "tabs":
        // Group fields by sections for tabs
        const sections = config.filter((f) => f.type === "section");
        return (
          <Tabs defaultValue={sections[0]?.name}>
            <TabsList>
              {sections.map((section) => (
                <TabsTrigger key={section.name} value={section.name}>
                  {section.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {sections.map((section) => (
              <TabsContent key={section.name} value={section.name}>
                <div className="grid grid-cols-12 gap-4">
                  {section.fields?.map((field) => (
                    <div
                      key={field.name}
                      className={getColSpanClass(field.colSize)}
                    >
                      {renderField(field)}
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        );

      case "accordion":
        return (
          <Accordion type="single" collapsible>
            {config.map((field) => (
              <div key={field.name} className={getColSpanClass(field.colSize)}>
                {renderField(field)}
              </div>
            ))}
          </Accordion>
        );

      case "wizard":
        // Multi-step wizard
        const steps = config.filter((f) => f.type === "section");
        const currentStepData = steps[currentStep];

        return (
          <div className="space-y-6">
            {showProgress && (
              <Progress value={((currentStep + 1) / steps.length) * 100} />
            )}
            <div className="grid grid-cols-12 gap-4">
              {currentStepData?.fields?.map((field) => (
                <div
                  key={field.name}
                  className={getColSpanClass(field.colSize)}
                >
                  {renderField(field)}
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              {currentStep < steps.length - 1 ? (
                <Button
                  type="button"
                  onClick={() =>
                    setCurrentStep((prev) =>
                      Math.min(steps.length - 1, prev + 1)
                    )
                  }
                >
                  Next
                </Button>
              ) : null}
            </div>
          </div>
        );

      case "single":
      default:
        return (
          <div className="grid grid-cols-12 gap-4">
            {config.map((field) => (
              <div key={field.name} className={getColSpanClass(field.colSize)}>
                {renderField(field)}
              </div>
            ))}
          </div>
        );
    }
  };

  // ============================================================================
  // Main Render
  // ============================================================================
  return (
    <motion.form
      onSubmit={onFormSubmit}
      className={`space-y-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {renderLayout()}

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={!isValid || mutation.isPending}
          className="min-w-[120px]"
        >
          {mutation.isPending ? (
            <>
              <motion.div
                className="mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              {t("Sending")}...
            </>
          ) : (
            <>
              {submitText}
              <Send className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </motion.form>
  );
};

export default DynamicForm;
