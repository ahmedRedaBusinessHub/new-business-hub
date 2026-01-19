import * as z from "zod";
import { useState, useEffect } from "react";
import type { Program } from "./ProgramsManagement";
import DynamicForm from "../shared/DynamicForm";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { FileUploader } from "@/components/ui/FileUploader";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { Send, Trash2, Plus } from "lucide-react";
import { staticListsCache } from "@/lib/staticListsCache";

// Base schema for form fields
const baseFormSchema = z.object({
  name_ar: z.string().min(2, "Arabic name must be at least 2 characters"),
  name_en: z.string().nullable().optional(),
  detail_ar: z.string().nullable().optional(),
  detail_en: z.string().nullable().optional(),
  from_datetime: z.string().nullable().optional(),
  to_datetime: z.string().nullable().optional(),
  last_registration_date: z.string().nullable().optional(),
  type: z.number().int().nullable().optional(),
  subtype: z.number().int().nullable().optional(),
  promo_video: z.string().nullable().optional(),
  promo_image: z.string().nullable().optional(),
  status: z.number().int().min(0).max(1),
  mainImage: z.any().optional(),
  imageIds: z.any().optional(),
  document_ar: z.any().optional(),
  document_en: z.any().optional(),
});

// For DynamicForm
const formFieldSchema = z.object({
  name_ar: z.string().min(2, "Arabic name must be at least 2 characters"),
  name_en: z.string().optional(),
  detail_ar: z.string().optional(),
  detail_en: z.string().optional(),
  from_datetime: z.string().optional(),
  to_datetime: z.string().optional(),
  last_registration_date: z.string().optional(),
  type: z.union([z.string(), z.number()]).optional(),
  subtype: z.union([z.string(), z.number()]).optional(),
  promo_video: z.union([z.string().url("Invalid URL"), z.literal("")]).optional(),
  promo_image: z.union([z.string().url("Invalid URL"), z.literal("")]).optional(),
  status: z.coerce.number().int().min(0).max(1),
  mainImage: z.any().optional(),
  imageIds: z.any().optional(),
  document_ar: z.any().optional(),
  document_en: z.any().optional(),
});

const formSchema = baseFormSchema;

interface ProgramFormProps {
  program: Program | null;
  onSubmit: (data: Omit<Program, "id" | "created_at" | "updated_at" | "organization_id"> & {
    mainImage?: File[];
    imageIds?: File[];
    document_ar?: File[];
    document_en?: File[];
  }) => void;
  onCancel: () => void;
}

interface StaticListOption {
  id: number;
  name_en: string;
  name_ar: string;
}

interface JsonFieldItem {
  icon?: string;
  text: string;
  number?: number;
}

export function ProgramForm({ program, onSubmit, onCancel }: ProgramFormProps) {
  const isEdit = !!program;
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [programTypes, setProgramTypes] = useState<StaticListOption[]>([]);
  const [programSubtypes, setProgramSubtypes] = useState<StaticListOption[]>([]);
  const [loadingStaticLists, setLoadingStaticLists] = useState(true);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [documentArFiles, setDocumentArFiles] = useState<File[]>([]);
  const [documentEnFiles, setDocumentEnFiles] = useState<File[]>([]);
  
  // JSON fields state
  const [values, setValues] = useState<JsonFieldItem[]>([{ icon: '', text: '' }]);
  const [progressSteps, setProgressSteps] = useState<JsonFieldItem[]>([{ number: 1, text: '' }]);
  const [applicationRequirements, setApplicationRequirements] = useState<JsonFieldItem[]>([{ icon: '', text: '' }]);
  const [documentsRequirements, setDocumentsRequirements] = useState<JsonFieldItem[]>([{ icon: '', text: '' }]);
  
  const [deletedImageUrls, setDeletedImageUrls] = useState<string[]>([]);
  const [deletedDocumentAr, setDeletedDocumentAr] = useState(false);
  const [deletedDocumentEn, setDeletedDocumentEn] = useState(false);

  const handleDeleteDocument = async (refColumn: 'document_ar_id' | 'document_en_id') => {
    if (!program?.id) {
      toast.error("Cannot delete document: Program not found");
      return;
    }

    // Get the document ID based on refColumn
    const docId = refColumn === 'document_ar_id' ? program.document_ar_id : program.document_en_id;
    
    if (!docId) {
      toast.error("Document ID not found");
      return;
    }

    try {
      const response = await fetch(
        `/api/programs/${program.id}/remove-file`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileId: docId,
            refColumn: refColumn,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete document');
      }

      if (refColumn === 'document_ar_id') {
        setDeletedDocumentAr(true);
      } else {
        setDeletedDocumentEn(true);
      }
      toast.success("Document deleted successfully");
    } catch (error: any) {
      console.error('Error deleting document:', error);
      toast.error(error.message || "Failed to delete document");
    }
  };

  const handleDeleteImage = async (url: string, imageId?: number) => {
    if (!program?.id || !imageId) {
      setDeletedImageUrls(prev => [...prev, url]);
      toast.success("Image marked for deletion");
      return;
    }

    try {
      const response = await fetch(
        `/api/programs/${program.id}/remove-file`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileId: imageId,
            refColumn: 'image_ids',
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete image');
      }

      setDeletedImageUrls(prev => [...prev, url]);
      toast.success("Image deleted successfully");
    } catch (error: any) {
      console.error('Error deleting image:', error);
      toast.error(error.message || "Failed to delete image");
    }
  };

  // Fetch static lists
  useEffect(() => {
    const fetchStaticLists = async () => {
      try {
        setLoadingStaticLists(true);
        
        const typesConfig = await staticListsCache.getByNamespace('program.types');
        setProgramTypes(typesConfig);
        
        const subtypesConfig = await staticListsCache.getByNamespace('program.subtypes');
        setProgramSubtypes(subtypesConfig);
      } catch (error) {
        console.error('Error fetching static lists:', error);
        toast.error('Failed to load program types and subtypes');
      } finally {
        setLoadingStaticLists(false);
      }
    };

    fetchStaticLists();
  }, []);

  // Initialize JSON fields from program data
  useEffect(() => {
    if (program) {
      if (program.values) {
        const parsedValues = typeof program.values === 'string' ? JSON.parse(program.values) : program.values;
        setValues(Array.isArray(parsedValues) && parsedValues.length > 0 ? parsedValues : [{ icon: '', text: '' }]);
      }
      
      if (program.progress_steps) {
        const parsedSteps = typeof program.progress_steps === 'string' ? JSON.parse(program.progress_steps) : program.progress_steps;
        setProgressSteps(Array.isArray(parsedSteps) && parsedSteps.length > 0 ? parsedSteps : [{ number: 1, text: '' }]);
      }
      
      if (program.application_requirements) {
        const parsedReqs = typeof program.application_requirements === 'string' ? JSON.parse(program.application_requirements) : program.application_requirements;
        setApplicationRequirements(Array.isArray(parsedReqs) && parsedReqs.length > 0 ? parsedReqs : [{ icon: '', text: '' }]);
      }
      
      if (program.documents_requirements) {
        const parsedDocs = typeof program.documents_requirements === 'string' ? JSON.parse(program.documents_requirements) : program.documents_requirements;
        setDocumentsRequirements(Array.isArray(parsedDocs) && parsedDocs.length > 0 ? parsedDocs : [{ icon: '', text: '' }]);
      }
    }
  }, [program]);

  // Use main_image_url from program data
  useEffect(() => {
    if (program?.main_image_url) {
      if (program.main_image_url.startsWith('http') || program.main_image_url.startsWith('/api/public/file')) {
        setExistingImageUrl(program.main_image_url);
      } else {
        setExistingImageUrl(`/api/public/file?file_url=${encodeURIComponent(program.main_image_url)}`);
      }
    } else {
      setExistingImageUrl(null);
    }
  }, [program]);

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      const dataWithJsonFields: Record<string, any> = {
        name_ar: data.name_ar ?? "",
        name_en: data.name_en ?? "",
        detail_ar: data.detail_ar ?? "",
        detail_en: data.detail_en ?? "",
        // Convert datetime-local format to ISO-8601
        from_datetime: data.from_datetime ? new Date(data.from_datetime).toISOString() : null,
        to_datetime: data.to_datetime ? new Date(data.to_datetime).toISOString() : null,
        last_registration_date: data.last_registration_date ? new Date(data.last_registration_date).toISOString() : null,
        promo_video: data.promo_video || null,
        promo_image: data.promo_image || null,
        status: data.status !== undefined && data.status !== null ? data.status : 1,
      };
      
      if (data.type !== undefined && data.type !== null && data.type !== "") {
        const typeValue = typeof data.type === 'string' ? Number(data.type) : data.type;
        dataWithJsonFields.type = isNaN(typeValue) ? null : typeValue;
      } else {
        dataWithJsonFields.type = null;
      }
      
      if (data.subtype !== undefined && data.subtype !== null && data.subtype !== "") {
        const subtypeValue = typeof data.subtype === 'string' ? Number(data.subtype) : data.subtype;
        dataWithJsonFields.subtype = isNaN(subtypeValue) ? null : subtypeValue;
      } else {
        dataWithJsonFields.subtype = null;
      }
      
      dataWithJsonFields.mainImage = data.mainImage;
      dataWithJsonFields.imageIds = imageFiles.length > 0 ? imageFiles : undefined;
      dataWithJsonFields.document_ar = documentArFiles.length > 0 ? documentArFiles : undefined;
      dataWithJsonFields.document_en = documentEnFiles.length > 0 ? documentEnFiles : undefined;
      
      // Add JSON fields
      dataWithJsonFields.values = values.filter(v => v.text.trim() !== '');
      dataWithJsonFields.progress_steps = progressSteps.filter(s => s.text.trim() !== '');
      dataWithJsonFields.application_requirements = applicationRequirements.filter(r => r.text.trim() !== '');
      dataWithJsonFields.documents_requirements = documentsRequirements.filter(d => d.text.trim() !== '');
      
      if (!formSchema) {
        throw new Error('Form schema is not defined');
      }
      
      let validated;
      try {
        validated = formSchema.parse(dataWithJsonFields);
      } catch (parseError: any) {
        throw parseError;
      }
      
      onSubmit({
        name_ar: validated.name_ar,
        name_en: validated.name_en || null,
        detail_ar: validated.detail_ar || null,
        detail_en: validated.detail_en || null,
        from_datetime: validated.from_datetime || null,
        to_datetime: validated.to_datetime || null,
        last_registration_date: validated.last_registration_date || null,
        type: validated.type ?? null,
        subtype: validated.subtype ?? null,
        values: dataWithJsonFields.values,
        progress_steps: dataWithJsonFields.progress_steps,
        application_requirements: dataWithJsonFields.application_requirements,
        documents_requirements: dataWithJsonFields.documents_requirements,
        promo_video: validated.promo_video || null,
        promo_image: validated.promo_image || null,
        status: validated.status,
        mainImage: validated.mainImage,
        imageIds: imageFiles,
        document_ar: documentArFiles,
        document_en: documentEnFiles,
      });
    } catch (error) {
      console.error("Form validation error:", error);
      throw error;
    }
  };

  // JSON field handlers
  const addValue = () => setValues([...values, { icon: '', text: '' }]);
  const removeValue = (index: number) => setValues(values.filter((_, i) => i !== index));
  const updateValue = (index: number, field: keyof JsonFieldItem, value: string | number) => {
    const updated = [...values];
    updated[index] = { ...updated[index], [field]: value };
    setValues(updated);
  };

  const addProgressStep = () => setProgressSteps([...progressSteps, { number: progressSteps.length + 1, text: '' }]);
  const removeProgressStep = (index: number) => setProgressSteps(progressSteps.filter((_, i) => i !== index));
  const updateProgressStep = (index: number, field: keyof JsonFieldItem, value: string | number) => {
    const updated = [...progressSteps];
    updated[index] = { ...updated[index], [field]: value };
    setProgressSteps(updated);
  };

  const addApplicationRequirement = () => setApplicationRequirements([...applicationRequirements, { icon: '', text: '' }]);
  const removeApplicationRequirement = (index: number) => setApplicationRequirements(applicationRequirements.filter((_, i) => i !== index));
  const updateApplicationRequirement = (index: number, field: keyof JsonFieldItem, value: string | number) => {
    const updated = [...applicationRequirements];
    updated[index] = { ...updated[index], [field]: value };
    setApplicationRequirements(updated);
  };

  const addDocumentRequirement = () => setDocumentsRequirements([...documentsRequirements, { icon: '', text: '' }]);
  const removeDocumentRequirement = (index: number) => setDocumentsRequirements(documentsRequirements.filter((_, i) => i !== index));
  const updateDocumentRequirement = (index: number, field: keyof JsonFieldItem, value: string | number) => {
    const updated = [...documentsRequirements];
    updated[index] = { ...updated[index], [field]: value };
    setDocumentsRequirements(updated);
  };

  return (
    <>
      {isEdit && existingImageUrl && (
        <div className="mb-6 flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
          <Avatar className="size-20">
            <AvatarImage src={existingImageUrl} alt="Current main image" />
            <AvatarFallback>
              {program?.name_ar?.[0] || program?.name_en?.[0] || "P"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium">Current Main Image</p>
            <p className="text-xs text-muted-foreground">
              Upload a new image below to replace this one
            </p>
          </div>
        </div>
      )}
      
      <DynamicForm
        formId="program-form"
        className="w-full"
        config={[
          {
            name: "name_ar",
            label: "Name (Arabic)",
            type: "text",
            placeholder: "Enter Arabic name",
            validation: formFieldSchema.shape.name_ar,
            required: true,
            helperText: "Arabic name (required)",
          },
          {
            name: "name_en",
            label: "Name (English)",
            type: "text",
            placeholder: "Enter English name",
            validation: formFieldSchema.shape.name_en,
            required: false,
            helperText: "English name (optional)",
          },
          {
            name: "detail_ar",
            label: "Detail (Arabic)",
            type: "textarea",
            placeholder: "Enter Arabic detail",
            validation: formFieldSchema.shape.detail_ar,
            required: false,
            helperText: "Arabic detail (optional)",
          },
          {
            name: "detail_en",
            label: "Detail (English)",
            type: "textarea",
            placeholder: "Enter English detail",
            validation: formFieldSchema.shape.detail_en,
            required: false,
            helperText: "English detail (optional)",
          },
          {
            name: "from_datetime",
            label: "From Date/Time",
            type: "datetime-local",
            validation: formFieldSchema.shape.from_datetime,
            required: false,
            helperText: "Program start date and time",
          },
          {
            name: "to_datetime",
            label: "To Date/Time",
            type: "datetime-local",
            validation: formFieldSchema.shape.to_datetime,
            required: false,
            helperText: "Program end date and time",
          },
          {
            name: "last_registration_date",
            label: "Last Registration Date",
            type: "datetime-local",
            validation: formFieldSchema.shape.last_registration_date,
            required: false,
            helperText: "Last date for registration",
          },
          {
            name: "type",
            label: "Type",
            type: "select",
            placeholder: "Select program type",
            validation: formFieldSchema.shape.type,
            required: false,
            helperText: "Program type (optional)",
            options: loadingStaticLists 
              ? [{ value: "", label: "Loading..." }]
              : programTypes.map(t => ({ value: t.id.toString(), label: `${t.name_en} / ${t.name_ar}` })),
          },
          {
            name: "subtype",
            label: "Subtype",
            type: "select",
            placeholder: "Select program subtype",
            validation: formFieldSchema.shape.subtype,
            required: false,
            helperText: "Program subtype (optional)",
            options: loadingStaticLists 
              ? [{ value: "", label: "Loading..." }]
              : programSubtypes.map(s => ({ value: s.id.toString(), label: `${s.name_en} / ${s.name_ar}` })),
          },
          {
            name: "promo_video",
            label: "Promo Video URL",
            type: "url",
            placeholder: "https://example.com/video.mp4",
            validation: formFieldSchema.shape.promo_video,
            required: false,
            helperText: "Promotional video URL (optional)",
          },
          {
            name: "promo_image",
            label: "Promo Image URL",
            type: "url",
            placeholder: "https://example.com/image.jpg",
            validation: formFieldSchema.shape.promo_image,
            required: false,
            helperText: "Promotional image URL (optional)",
          },
          {
            name: "status",
            label: "Status",
            type: "select",
            placeholder: "Select status",
            validation: formFieldSchema.shape.status,
            required: true,
            helperText: "Program status",
            options: [
              { value: "1", label: "Active" },
              { value: "0", label: "Inactive" },
            ],
          },
          {
            name: "mainImage",
            label: "Main Image",
            type: "imageuploader",
            validation: formFieldSchema.shape.mainImage,
            required: false,
            helperText: "Upload main image (JPG, PNG, WEBP - Max 5MB)",
          },
        ]}
        onSubmit={handleSubmit}
        submitText=""
        onSuccess={onCancel}
        defaultValues={{
          name_ar: program?.name_ar || "",
          name_en: program?.name_en || "",
          detail_ar: program?.detail_ar || "",
          detail_en: program?.detail_en || "",
          from_datetime: program?.from_datetime ? new Date(program.from_datetime).toISOString().slice(0, 16) : "",
          to_datetime: program?.to_datetime ? new Date(program.to_datetime).toISOString().slice(0, 16) : "",
          last_registration_date: program?.last_registration_date ? new Date(program.last_registration_date).toISOString().slice(0, 16) : "",
          type: program?.type != null ? program.type.toString() : "",
          subtype: program?.subtype != null ? program.subtype.toString() : "",
          promo_video: program?.promo_video || "",
          promo_image: program?.promo_image || "",
          status: program?.status?.toString() || "1",
          mainImage: undefined,
        }}
      />
      
      <Tabs defaultValue="json-fields" className="w-full mt-6">
        <TabsList className={`grid w-full h-auto p-1 bg-muted/50 rounded-xl ${isEdit ? 'grid-cols-6' : 'grid-cols-5'}`}>
          <TabsTrigger value="json-fields" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm py-2.5">JSON Fields</TabsTrigger>
          <TabsTrigger value="progress" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm py-2.5">Progress Steps</TabsTrigger>
          <TabsTrigger value="app-req" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm py-2.5">App Requirements</TabsTrigger>
          <TabsTrigger value="doc-req" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm py-2.5">Doc Requirements</TabsTrigger>
          <TabsTrigger value="documents" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm py-2.5">Documents</TabsTrigger>
          {isEdit && <TabsTrigger value="images" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm py-2.5">Images</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="json-fields" className="space-y-4 pt-4">
          <Label className="text-sm font-medium text-muted-foreground">Values (Icon + Text)</Label>
          <div className="space-y-2 w-full">
            {values.map((value, index) => (
              <div key={index} className="flex items-center gap-2 w-full">
                <Input
                  placeholder="Icon"
                  value={value.icon}
                  onChange={(e) => updateValue(index, 'icon', e.target.value)}
                  className="w-20 shrink-0 bg-muted/50 border-0 rounded-md"
                />
                <div className="flex-1">
                  <Input
                    placeholder="Text"
                    value={value.text}
                    onChange={(e) => updateValue(index, 'text', e.target.value)}
                    className="w-full bg-muted/50 border-0 rounded-md"
                  />
                </div>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeValue(index)}
                  className="text-muted-foreground hover:text-destructive shrink-0 ml-auto"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addValue} className="mt-2">
            <Plus className="h-4 w-4 mr-2" /> Add Value
          </Button>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4 pt-4">
          <Label className="text-sm font-medium text-muted-foreground">Progress Steps (Number + Text)</Label>
          <div className="space-y-2 w-full">
            {progressSteps.map((step, index) => (
              <div key={index} className="flex items-center gap-2 w-full">
                <Input
                  type="number"
                  placeholder="Step #"
                  value={step.number}
                  onChange={(e) => updateProgressStep(index, 'number', Number(e.target.value))}
                  className="w-20 shrink-0 bg-muted/50 border-0 rounded-md"
                />
                <div className="flex-1">
                  <Input
                    placeholder="Step description"
                    value={step.text}
                    onChange={(e) => updateProgressStep(index, 'text', e.target.value)}
                    className="w-full bg-muted/50 border-0 rounded-md"
                  />
                </div>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeProgressStep(index)}
                  className="text-muted-foreground hover:text-destructive shrink-0 ml-auto"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addProgressStep} className="mt-2">
            <Plus className="h-4 w-4 mr-2" /> Add Step
          </Button>
        </TabsContent>

        <TabsContent value="app-req" className="space-y-4 pt-4">
          <Label className="text-sm font-medium text-muted-foreground">Application Requirements (Icon + Text)</Label>
          <div className="space-y-2 w-full">
            {applicationRequirements.map((req, index) => (
              <div key={index} className="flex items-center gap-2 w-full">
                <Input
                  placeholder="Icon"
                  value={req.icon}
                  onChange={(e) => updateApplicationRequirement(index, 'icon', e.target.value)}
                  className="w-20 shrink-0 bg-muted/50 border-0 rounded-md"
                />
                <div className="flex-1">
                  <Input
                    placeholder="Requirement"
                    value={req.text}
                    onChange={(e) => updateApplicationRequirement(index, 'text', e.target.value)}
                    className="w-full bg-muted/50 border-0 rounded-md"
                  />
                </div>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeApplicationRequirement(index)}
                  className="text-muted-foreground hover:text-destructive shrink-0 ml-auto"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addApplicationRequirement} className="mt-2">
            <Plus className="h-4 w-4 mr-2" /> Add Requirement
          </Button>
        </TabsContent>

        <TabsContent value="doc-req" className="space-y-4 pt-4">
          <Label className="text-sm font-medium text-muted-foreground">Document Requirements (Icon + Text)</Label>
          <div className="space-y-2 w-full">
            {documentsRequirements.map((req, index) => (
              <div key={index} className="flex items-center gap-2 w-full">
                <Input
                  placeholder="Icon"
                  value={req.icon}
                  onChange={(e) => updateDocumentRequirement(index, 'icon', e.target.value)}
                  className="w-20 shrink-0 bg-muted/50 border-0 rounded-md"
                />
                <div className="flex-1">
                  <Input
                    placeholder="Requirement"
                    value={req.text}
                    onChange={(e) => updateDocumentRequirement(index, 'text', e.target.value)}
                    className="w-full bg-muted/50 border-0 rounded-md"
                  />
                </div>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeDocumentRequirement(index)}
                  className="text-muted-foreground hover:text-destructive shrink-0 ml-auto"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addDocumentRequirement} className="mt-2">
            <Plus className="h-4 w-4 mr-2" /> Add Requirement
          </Button>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6 pt-4">
          <div className="space-y-3">
            <Label className="text-sm font-medium text-muted-foreground">Arabic Document</Label>
            <div className="bg-muted/50 rounded-xl p-4">
              {program?.document_ar_url && !deletedDocumentAr && documentArFiles.length === 0 ? (
                <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      <a 
                        href={program.document_ar_url.startsWith('http') || program.document_ar_url.startsWith('/api/public/file') 
                          ? program.document_ar_url 
                          : `/api/public/file?file_url=${encodeURIComponent(program.document_ar_url)}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-primary hover:underline"
                      >
                        {program.document_ar_url.split('/').pop()}
                      </a>
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteDocument('document_ar_id')}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <FileUploader
                    multiple={false}
                    accept=".pdf,.doc,.docx"
                    maxSize={10 * 1024 * 1024}
                    onChange={(files) => setDocumentArFiles(files)}
                    onError={(error) => toast.error(error)}
                  />
                  {documentArFiles.length > 0 && (
                    <p className="text-xs text-green-600 mt-2">
                      Selected: {documentArFiles[0].name}
                    </p>
                  )}
                  {deletedDocumentAr && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Previous document was deleted. Upload a new one.
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
          
          <div className="space-y-3">
            <Label className="text-sm font-medium text-muted-foreground">English Document</Label>
            <div className="bg-muted/50 rounded-xl p-4">
              {program?.document_en_url && !deletedDocumentEn && documentEnFiles.length === 0 ? (
                <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      <a 
                        href={program.document_en_url.startsWith('http') || program.document_en_url.startsWith('/api/public/file') 
                          ? program.document_en_url 
                          : `/api/public/file?file_url=${encodeURIComponent(program.document_en_url)}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-primary hover:underline"
                      >
                        {program.document_en_url.split('/').pop()}
                      </a>
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteDocument('document_en_id')}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <FileUploader
                    multiple={false}
                    accept=".pdf,.doc,.docx"
                    maxSize={10 * 1024 * 1024}
                    onChange={(files) => setDocumentEnFiles(files)}
                    onError={(error) => toast.error(error)}
                  />
                  {documentEnFiles.length > 0 && (
                    <p className="text-xs text-green-600 mt-2">
                      Selected: {documentEnFiles[0].name}
                    </p>
                  )}
                  {deletedDocumentEn && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Previous document was deleted. Upload a new one.
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </TabsContent>

        {isEdit && (
          <TabsContent value="images" className="space-y-6 pt-4">
            {program?.image_urls && program.image_urls.length > 0 && (
              <div className="space-y-3">
                <Label className="text-sm font-medium text-muted-foreground">Existing Images</Label>
                <div className="grid grid-cols-3 gap-4">
                  {program.image_urls
                    .filter(url => url != null && !deletedImageUrls.includes(url))
                    .map((url, index) => {
                      const imageId = program.image_ids?.[index];
                      return (
                        <div key={index} className="relative group rounded-xl overflow-hidden bg-muted/50">
                          <img
                            src={url.startsWith('http') || url.startsWith('/api/public/file') 
                              ? url 
                              : `/api/public/file?file_url=${encodeURIComponent(url)}`}
                            alt={`Image ${index + 1}`}
                            className="w-full h-32 object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleDeleteImage(url, imageId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              <Label className="text-sm font-medium text-muted-foreground">Upload New Images</Label>
              <div className="bg-muted/50 rounded-xl p-4">
                <ImageUploader
                  multiple={true}
                  accept="image/*"
                  maxSize={5 * 1024 * 1024}
                  onChange={(files) => setImageFiles(files)}
                  onError={(error) => toast.error(error)}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Upload multiple images (JPG, PNG, WEBP - Max 5MB each)
                </p>
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>

      {/* Static Footer with Submit Button */}
      <div className="border-t pt-4 mt-6 bg-background">
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={async (e) => {
              e.preventDefault();
              
              const form = document.getElementById('program-form') as HTMLFormElement;
              
              if (!form) {
                toast.error('Form not found. Please try again.');
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
                
                await handleSubmit(formValues);
              }
            }}
          >
            {program ? "Update Program" : "Create Program"}
            <Send className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}
