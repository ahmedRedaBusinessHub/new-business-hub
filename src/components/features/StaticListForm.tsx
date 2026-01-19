import * as z from "zod";
import { useState, useEffect } from "react";
import type { StaticList } from "./StaticListsManagement";
import DynamicForm from "../shared/DynamicForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Send } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  namespace: z.string().min(2, "Namespace must be at least 2 characters").regex(/^[a-z0-9._-]+$/, "Namespace must be lowercase with dots, dashes, or underscores only"),
  order_no: z.coerce.number().int().optional().nullable(),
  status: z.coerce.number().int().min(0).max(1),
});

interface StaticListFormProps {
  staticList: StaticList | null;
  onSubmit: (data: Omit<StaticList, "id" | "created_at" | "updated_at">) => void;
  onCancel: () => void;
}

export function StaticListForm({ staticList, onSubmit, onCancel }: StaticListFormProps) {
  const isEdit = !!staticList;
  const [configJson, setConfigJson] = useState<string>("");
  const [configError, setConfigError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize config JSON from staticList data
  useEffect(() => {
    if (staticList?.config) {
      try {
        const config = typeof staticList.config === 'string' 
          ? staticList.config 
          : JSON.stringify(staticList.config, null, 2);
        setConfigJson(config);
      } catch {
        setConfigJson("");
      }
    } else {
      setConfigJson("");
    }
  }, [staticList]);

  const validateJson = (value: string): boolean => {
    if (!value.trim()) {
      setConfigError(null);
      return true;
    }
    try {
      JSON.parse(value);
      setConfigError(null);
      return true;
    } catch (e: any) {
      setConfigError(`Invalid JSON: ${e.message}`);
      return false;
    }
  };

  const handleConfigChange = (value: string) => {
    setConfigJson(value);
    validateJson(value);
  };

  const handleFormSubmit = async (data: Record<string, any>) => {
    try {
      setIsSubmitting(true);
      
      // Validate JSON before submitting
      if (configJson.trim() && !validateJson(configJson)) {
        toast.error("Please fix the JSON configuration errors");
        return;
      }

      const validated = formSchema.parse(data);
      
      // Parse config JSON
      let config = null;
      if (configJson.trim()) {
        try {
          config = JSON.parse(configJson);
        } catch {
          toast.error("Invalid JSON configuration");
          return;
        }
      }
      
      await onSubmit({
        name: validated.name,
        namespace: validated.namespace,
        config,
        order_no: validated.order_no || null,
        status: validated.status,
        organization_id: staticList?.organization_id || 1,
      });
    } catch (error) {
      console.error("Form validation error:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <DynamicForm
        formId="static-list-form"
        config={[
          {
            name: "name",
            label: "Name",
            type: "text",
            placeholder: "Enter list name",
            validation: formSchema.shape.name,
            required: true,
            helperText: "Display name for the static list",
          },
          {
            name: "namespace",
            label: "Namespace",
            type: "text",
            placeholder: "e.g., program.types, project.categories",
            validation: formSchema.shape.namespace,
            required: true,
            helperText: "Unique identifier (lowercase, dots, dashes, underscores)",
          },
          {
            name: "order_no",
            label: "Order",
            type: "number",
            placeholder: "Enter display order",
            validation: formSchema.shape.order_no,
            required: false,
            helperText: "Display order (optional)",
          },
          {
            name: "status",
            label: "Status",
            type: "select",
            placeholder: "Select status",
            validation: formSchema.shape.status,
            required: true,
            helperText: "Static list status",
            options: [
              { value: "1", label: "Active" },
              { value: "0", label: "Inactive" },
            ],
          },
        ]}
        onSubmit={handleFormSubmit}
        submitText=""
        onSuccess={onCancel}
        defaultValues={{
          name: staticList?.name || "",
          namespace: staticList?.namespace || "",
          order_no: staticList?.order_no?.toString() || "",
          status: staticList?.status?.toString() || "1",
        }}
      />

      {/* Configuration Tab */}
      <Tabs defaultValue="config" className="w-full">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="config">Configuration (JSON)</TabsTrigger>
        </TabsList>
        <TabsContent value="config" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>JSON Configuration</Label>
            <Textarea
              value={configJson}
              onChange={(e) => handleConfigChange(e.target.value)}
              placeholder={`{
  "name_en": "Example",
  "name_ar": "مثال",
  "value": "example_value"
}`}
              className="font-mono text-sm min-h-[200px]"
            />
            {configError && (
              <p className="text-sm text-destructive">{configError}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Enter a valid JSON object for the configuration (optional)
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <Button 
          type="button" 
          disabled={isSubmitting || !!configError}
          onClick={async () => {
            setIsSubmitting(true);
            try {
              const form = document.getElementById('static-list-form') as HTMLFormElement;
              if (!form) {
                toast.error("Form not found");
                return;
              }
              
              try {
                form.requestSubmit();
              } catch (error) {
                console.warn('requestSubmit failed, manually collecting form values', error);
                
                const formData = new FormData(form);
                const formValues: Record<string, any> = {};
                
                formData.forEach((value, key) => {
                  formValues[key] = value;
                });
                
                const allInputs = form.querySelectorAll('input, select, textarea');
                allInputs.forEach((input) => {
                  const element = input as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
                  if (element.name && element.type !== 'file' && element.type !== 'hidden') {
                    if (element.type === 'checkbox') {
                      formValues[element.name] = (element as HTMLInputElement).checked;
                    } else {
                      formValues[element.name] = element.value;
                    }
                  }
                });
                
                await handleFormSubmit(formValues);
              }
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          {isSubmitting ? "Saving..." : staticList ? "Update Static List" : "Create Static List"}
          <Send className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
