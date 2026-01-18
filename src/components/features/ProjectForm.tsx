import * as z from "zod";
import { useState, useEffect } from "react";
import type { Project } from "./ProjectsManagement";
import DynamicForm from "../shared/DynamicForm";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { FileUploader } from "@/components/ui/FileUploader";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { toast } from "sonner";
import { Send, Trash2 } from "lucide-react";
import { staticListsCache } from "@/lib/staticListsCache";

// Base schema for form fields (used in DynamicForm config)
// Using simpler schema without preprocess to avoid Zod v4 compatibility issues
const baseFormSchema = z.object({
  title_ar: z.string().min(2, "Arabic title must be at least 2 characters"),
  title_en: z.string().optional(),
  detail_ar: z.string().optional(),
  detail_en: z.string().optional(),
  type: z.number().int().nullable().optional(),
  category_ids: z.array(z.number()).optional(),
  link: z.string().optional(),
  social_media: z.record(z.string(), z.string()).optional(),
  status: z.number().int().min(0).max(1),
  mainImage: z.any().optional(), // Can be File or string
  imageIds: z.any().optional(), // Can be File[] or string[]
  fileIds: z.any().optional(), // Can be File[] or string[]
});

// For DynamicForm, we need a schema where type is just a string/number for the select
const formFieldSchema = z.object({
  title_ar: z.string().min(2, "Arabic title must be at least 2 characters"),
  title_en: z.string().optional(),
  detail_ar: z.string().optional(),
  detail_en: z.string().optional(),
  type: z.union([z.string(), z.number()]).optional(),
  category_ids: z.any().optional(),
  link: z.union([z.string().url("Invalid URL"), z.literal("")]).optional(),
  social_media: z.any().optional(),
  status: z.coerce.number().int().min(0).max(1),
  mainImage: z.any().optional(),
  imageIds: z.any().optional(),
  fileIds: z.any().optional(),
});

// Full validation schema (used in handleSubmit)
const formSchema = baseFormSchema;

interface ProjectFormProps {
  project: Project | null;
  onSubmit: (data: Omit<Project, "id" | "created_at" | "updated_at" | "main_image_url"> & { 
    mainImage?: File[];
    imageIds?: File[];
    fileIds?: File[];
  }) => void;
  onCancel: () => void;
}

interface StaticListOption {
  id: number;
  name_en: string;
  name_ar: string;
}

export function ProjectForm({ project, onSubmit, onCancel }: ProjectFormProps) {
  const isEdit = !!project;
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [projectTypes, setProjectTypes] = useState<StaticListOption[]>([]);
  const [projectCategories, setProjectCategories] = useState<StaticListOption[]>([]);
  const [loadingStaticLists, setLoadingStaticLists] = useState(true);
  const [socialMediaLinks, setSocialMediaLinks] = useState<Record<string, string>>({});
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [fileFiles, setFileFiles] = useState<File[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [deletedImageUrls, setDeletedImageUrls] = useState<string[]>([]);
  const [deletedFileUrls, setDeletedFileUrls] = useState<string[]>([]);

  const handleDeleteImage = async (url: string, imageId?: number) => {
    if (!project?.id || !imageId) {
      // For new projects or if no imageId, just remove from display
      setDeletedImageUrls(prev => [...prev, url]);
      toast.success("Image marked for deletion");
      return;
    }

    try {
      const response = await fetch(
        `/api/projects/${project.id}/remove-file`,
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

  const handleDeleteFile = async (url: string, fileId?: number) => {
    if (!project?.id || !fileId) {
      // For new projects or if no fileId, just remove from display
      setDeletedFileUrls(prev => [...prev, url]);
      toast.success("File marked for deletion");
      return;
    }

    try {
      const response = await fetch(
        `/api/projects/${project.id}/remove-file`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileId: fileId,
            refColumn: 'file_ids',
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete file');
      }

      setDeletedFileUrls(prev => [...prev, url]);
      toast.success("File deleted successfully");
    } catch (error: any) {
      console.error('Error deleting file:', error);
      toast.error(error.message || "Failed to delete file");
    }
  };

  // Fetch static lists for type and categories
  useEffect(() => {
    const fetchStaticLists = async () => {
      try {
        setLoadingStaticLists(true);
        
        // Fetch project types using cache
        const typesConfig = await staticListsCache.getByNamespace('project.types');
        if (typesConfig.length > 0) {
          setProjectTypes(typesConfig);
        } else {
          // Insert dummy data if not exists
          await fetch('/api/static-lists', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: 'Project Types',
              namespace: 'project.types',
              config: [
                { id: 1, name_en: 'Type 1', name_ar: 'نوع 1' },
                { id: 2, name_en: 'Type 2', name_ar: 'نوع 2' },
                { id: 3, name_en: 'Type 3', name_ar: 'نوع 3' },
              ],
              status: 1,
            }),
          });
          // Force refresh cache and get new data
          const newTypes = await staticListsCache.getByNamespace('project.types', true);
          setProjectTypes(newTypes.length > 0 ? newTypes : [
            { id: 1, name_en: 'Type 1', name_ar: 'نوع 1' },
            { id: 2, name_en: 'Type 2', name_ar: 'نوع 2' },
            { id: 3, name_en: 'Type 3', name_ar: 'نوع 3' },
          ]);
        }

        // Fetch project categories using cache
        const categoriesConfig = await staticListsCache.getByNamespace('project.categories');
        if (categoriesConfig.length > 0) {
          setProjectCategories(categoriesConfig);
        } else {
          // Insert dummy data
          await fetch('/api/static-lists', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: 'Project Categories',
              namespace: 'project.categories',
              config: [
                { id: 1, name_en: 'Category 1', name_ar: 'فئة 1' },
                { id: 2, name_en: 'Category 2', name_ar: 'فئة 2' },
                { id: 3, name_en: 'Category 3', name_ar: 'فئة 3' },
              ],
              status: 1,
            }),
          });
          // Force refresh cache and get new data
          const newCategories = await staticListsCache.getByNamespace('project.categories', true);
          setProjectCategories(newCategories.length > 0 ? newCategories : [
            { id: 1, name_en: 'Category 1', name_ar: 'فئة 1' },
            { id: 2, name_en: 'Category 2', name_ar: 'فئة 2' },
            { id: 3, name_en: 'Category 3', name_ar: 'فئة 3' },
          ]);
        }
      } catch (error) {
        console.error('Error fetching static lists:', error);
        toast.error('Failed to load project types and categories');
      } finally {
        setLoadingStaticLists(false);
      }
    };

    fetchStaticLists();
  }, []);

  // Initialize social media links and category IDs from project data
  useEffect(() => {
    if (project?.social_media) {
      try {
        const socialMedia = typeof project.social_media === 'string' 
          ? JSON.parse(project.social_media) 
          : project.social_media;
        setSocialMediaLinks(socialMedia || {});
      } catch {
        setSocialMediaLinks({});
      }
    } else {
      setSocialMediaLinks({});
    }
    
    if (project?.category_ids) {
      setSelectedCategoryIds(project.category_ids);
    } else {
      setSelectedCategoryIds([]);
    }
  }, [project]);

  // Use main_image_url from project data instead of fetching
  useEffect(() => {
    if (project?.main_image_url) {
      // If main_image_url is already a full URL, use it directly
      // If it's a file path, prepend the public file endpoint
      if (project.main_image_url.startsWith('http') || project.main_image_url.startsWith('/api/public/file')) {
        setExistingImageUrl(project.main_image_url);
      } else {
        setExistingImageUrl(`/api/public/file?file_url=${encodeURIComponent(project.main_image_url)}`);
      }
    } else {
      setExistingImageUrl(null);
    }
  }, [project]);

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      // Always use current state values for social media and categories
      // These are managed outside the form, so we always use the latest state
      const currentSocialMedia = socialMediaLinks || {};
      const currentCategoryIds = selectedCategoryIds || [];
      
      // Merge social media links into data for validation
      // Ensure all required fields are present with defaults
      // Only include fields that exist in the schema
      const dataWithSocialMedia: Record<string, any> = {
        title_ar: data.title_ar ?? "",
        title_en: data.title_en ?? "",
        detail_ar: data.detail_ar ?? "",
        detail_en: data.detail_en ?? "",
        status: data.status !== undefined && data.status !== null ? data.status : 1,
      };
      
      // Add optional fields only if they exist
      // Convert type to number if it's a string (from form select)
      if (data.type !== undefined && data.type !== null && data.type !== "") {
        const typeValue = typeof data.type === 'string' ? Number(data.type) : data.type;
        dataWithSocialMedia.type = isNaN(typeValue) ? null : typeValue;
      } else {
        dataWithSocialMedia.type = null;
      }
      
      // Handle link - ensure it's a string (empty string if null/undefined)
      if (data.link !== undefined && data.link !== null && data.link !== "") {
        dataWithSocialMedia.link = String(data.link);
      } else {
        dataWithSocialMedia.link = "";
      }
      
      // Always include optional fields explicitly (even if undefined) to avoid Zod schema issues
      dataWithSocialMedia.mainImage = data.mainImage;
      dataWithSocialMedia.imageIds = imageFiles.length > 0 ? imageFiles : undefined;
      dataWithSocialMedia.fileIds = fileFiles.length > 0 ? fileFiles : undefined;
      
      // Always include these as they're managed by state (use current state values)
      dataWithSocialMedia.social_media = currentSocialMedia;
      dataWithSocialMedia.category_ids = currentCategoryIds;
      
      if (!formSchema) {
        throw new Error('Form schema is not defined');
      }
      
      let validated;
      try {
        validated = formSchema.parse(dataWithSocialMedia);
      } catch (parseError: any) {
        throw parseError;
      }
      
      onSubmit({
        title_ar: validated.title_ar,
        title_en: validated.title_en || null,
        detail_ar: validated.detail_ar || null,
        detail_en: validated.detail_en || null,
        type: validated.type ?? null,
        category_ids: currentCategoryIds,
        link: validated.link || null,
        social_media: currentSocialMedia,
        status: validated.status,
        organization_id: project?.organization_id ?? 1,
        mainImage: validated.mainImage,
        imageIds: imageFiles,
        fileIds: fileFiles,
      });
    } catch (error) {
      console.error("Form validation error:", error);
      throw error;
    }
  };

  const handleSocialMediaChange = (platform: string, url: string) => {
    setSocialMediaLinks(prev => ({
      ...prev,
      [platform]: url,
    }));
  };

  return (
    <>
      {isEdit && existingImageUrl && (
        <div className="mb-6 flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
          <Avatar className="size-20">
            <AvatarImage src={existingImageUrl} alt="Current main image" />
            <AvatarFallback>
              {project?.title_ar?.[0] || project?.title_en?.[0] || "P"}
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
      {/* Form wrapper - always in DOM regardless of active tab */}
      <DynamicForm
        formId="project-form"
        className="w-full"
        config={[
          {
            name: "title_ar",
            label: "Title (Arabic)",
            type: "text",
            placeholder: "Enter Arabic title",
            validation: formFieldSchema.shape.title_ar,
            required: true,
            helperText: "Arabic title (required)",
          },
          {
            name: "title_en",
            label: "Title (English)",
            type: "text",
            placeholder: "Enter English title",
            validation: formFieldSchema.shape.title_en,
            required: false,
            helperText: "English title (optional)",
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
            name: "type",
            label: "Type",
            type: "select",
            placeholder: "Select project type",
            validation: formFieldSchema.shape.type,
            required: false,
            helperText: "Project type (optional)",
            options: loadingStaticLists 
              ? [{ value: "", label: "Loading..." }]
              : projectTypes.map(t => ({ value: t.id.toString(), label: `${t.name_en} / ${t.name_ar}` })),
          },
          {
            name: "link",
            label: "Link",
            type: "url",
            placeholder: "https://example.com",
            validation: formFieldSchema.shape.link,
            required: false,
            helperText: "Project link (optional)",
          },
          {
            name: "status",
            label: "Status",
            type: "select",
            placeholder: "Select status",
            validation: formFieldSchema.shape.status,
            required: true,
            helperText: "Project status",
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
          title_ar: project?.title_ar || "",
          title_en: project?.title_en || "",
          detail_ar: project?.detail_ar || "",
          detail_en: project?.detail_en || "",
          type: project?.type != null ? project.type.toString() : "",
          category_ids: project?.category_ids || [],
          link: project?.link || "",
          social_media: project?.social_media ? (typeof project.social_media === 'string' ? JSON.parse(project.social_media) : project.social_media) : {},
          status: project?.status?.toString() || "1",
          mainImage: undefined,
        }}
      />
      
      <Tabs defaultValue="details" className="w-full">
        <TabsList className={`grid w-full ${isEdit ? 'grid-cols-4' : 'grid-cols-2'}`}>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          {isEdit && <TabsTrigger value="images">Images</TabsTrigger>}
          {isEdit && <TabsTrigger value="files">Files</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="details" className="space-y-4">
          {/* Category IDs - Multi-select using checkboxes */}
          <div className="space-y-2">
            <Label>Categories</Label>
            <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
              {loadingStaticLists ? (
                <p className="text-sm text-muted-foreground">Loading categories...</p>
              ) : projectCategories.length === 0 ? (
                <p className="text-sm text-muted-foreground">No categories available</p>
              ) : (
                projectCategories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={selectedCategoryIds.includes(category.id)}
                      onCheckedChange={(checked: boolean) => {
                        setSelectedCategoryIds(prev => 
                          checked
                            ? [...prev, category.id]
                            : prev.filter(id => id !== category.id)
                        );
                      }}
                    />
                    <Label
                      htmlFor={`category-${category.id}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {category.name_en} / {category.name_ar}
                    </Label>
                  </div>
                ))
              )}
            </div>
            <p className="text-xs text-muted-foreground">Select one or more categories</p>
          </div>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          {/* Social Media Links */}
          <div className="space-y-2">
            <Label>Social Media Links</Label>
            <div className="space-y-3 p-4 border rounded-lg">
              {['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'].map((platform) => (
                <div key={platform} className="flex items-center gap-2">
                  <Label className="w-24 capitalize">{platform}:</Label>
                  <Input
                    type="url"
                    placeholder={`https://${platform}.com/...`}
                    value={socialMediaLinks[platform] || ""}
                    onChange={(e) => handleSocialMediaChange(platform, e.target.value)}
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Enter social media URLs (optional)</p>
          </div>
        </TabsContent>

        {isEdit && (
          <TabsContent value="images" className="space-y-4">
            {/* Display existing images */}
            {project?.image_urls && project.image_urls.length > 0 && (
              <div className="space-y-2 mb-4">
                <Label>Existing Images</Label>
                <div className="grid grid-cols-3 gap-4">
                  {project.image_urls
                    .filter(url => url != null && !deletedImageUrls.includes(url))
                    .map((url, index) => {
                      const imageId = project.image_ids?.[index];
                      return (
                    <div key={index} className="relative group">
                      <img
                        src={url.startsWith('http') || url.startsWith('/api/public/file') 
                          ? url 
                          : `/api/public/file?file_url=${encodeURIComponent(url)}`}
                        alt={`Image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
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
            
            <div className="space-y-2">
              <Label>Upload New Images</Label>
              <ImageUploader
                multiple={true}
                accept="image/*"
                maxSize={5 * 1024 * 1024}
                onChange={(files) => setImageFiles(files)}
                onError={(error) => toast.error(error)}
              />
              <p className="text-xs text-muted-foreground">
                Upload multiple images (JPG, PNG, WEBP - Max 5MB each)
              </p>
            </div>
          </TabsContent>
        )}

        {isEdit && (
          <TabsContent value="files" className="space-y-4">
            {/* Display existing files */}
            {project?.file_urls && project.file_urls.length > 0 && (
              <div className="space-y-2 mb-4">
                <Label>Existing Files</Label>
                <div className="space-y-2">
                  {project.file_urls
                    .filter(url => url != null && !deletedFileUrls.includes(url))
                    .map((url, index) => {
                    const fileName = url.split('/').pop() || `File ${index + 1}`;
                    const fileUrl = url.startsWith('http') || url.startsWith('/api/public/file') 
                      ? url 
                      : `/api/public/file?file_url=${encodeURIComponent(url)}`;
                    const fileId = project.file_ids?.[index];
                    
                    return (
                      <div key={index} className="flex items-center gap-2 p-2 border rounded-lg group hover:bg-muted/50 transition-colors">
                        <a 
                          href={fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex-1 text-sm hover:underline text-primary"
                        >
                          {fileName}
                        </a>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteFile(url, fileId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label>Upload New Files</Label>
              <FileUploader
                multiple={true}
                accept="*/*"
                maxSize={10 * 1024 * 1024}
                onChange={(files) => setFileFiles(files)}
                onError={(error) => toast.error(error)}
              />
              <p className="text-xs text-muted-foreground">
                Upload multiple files (Max 10MB each)
              </p>
            </div>
          </TabsContent>
        )}
      </Tabs>

      {/* Static Footer with Submit Button - Always visible across all tabs */}
      <div className="border-t pt-4 mt-6 bg-background">
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={async (e) => {
              e.preventDefault();
              
              // Find the form - now it should always be in DOM (moved outside TabsContent)
              const form = document.getElementById('project-form') as HTMLFormElement;
              
              if (!form) {
                toast.error('Form not found. Please try again.');
                return;
              }
              
              // Try to trigger form submission using requestSubmit
              // This will trigger react-hook-form's handleSubmit which validates and calls our handleSubmit
              try {
                form.requestSubmit();
              } catch (error) {
                // If requestSubmit fails (e.g., form is hidden), manually collect values and submit
                console.warn('requestSubmit failed, manually collecting form values', error);
                
                // Manually collect form values
                const formData = new FormData(form);
                const formValues: Record<string, any> = {};
                
                // Collect from FormData
                formData.forEach((value, key) => {
                  formValues[key] = value;
                });
                
                // Also collect from all inputs, selects, textareas (in case FormData missed some)
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
                
                // Call handleSubmit directly with collected values
                // handleSubmit will merge in state values (socialMediaLinks, etc.)
                await handleSubmit(formValues);
              }
            }}
          >
            {project ? "Update Project" : "Create Project"}
            <Send className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}

