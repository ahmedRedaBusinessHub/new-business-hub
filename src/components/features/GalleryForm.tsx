import * as z from "zod";
import { useState, useEffect } from "react";
import type { Gallery } from "./GalleriesManagement";
import DynamicForm from "../shared/DynamicForm";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Trash2, Send } from "lucide-react";
import { ImageUploader } from "../ui/ImageUploader";
import { toast } from "sonner";

const formSchema = z.object({
  title_ar: z.string().min(2, "Arabic title must be at least 2 characters"),
  title_en: z.string().optional(),
  status: z.coerce.number().int().min(0).max(1),
  mainImage: z.any().optional(),
  imageIds: z.any().optional(),
});

interface GalleryFormProps {
  gallery: Gallery | null;
  onSubmit: (data: Omit<Gallery, "id" | "created_at" | "updated_at" | "main_image_url" | "image_urls"> & { mainImage?: File[]; imageIds?: File[] }) => void;
  onCancel: () => void;
}

export function GalleryForm({ gallery, onSubmit, onCancel }: GalleryFormProps) {
  const isEdit = !!gallery;
  const [existingMainImageUrl, setExistingMainImageUrl] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [deletedImageUrls, setDeletedImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use main image URL from gallery data
  useEffect(() => {
    if (gallery?.main_image_url) {
      if (gallery.main_image_url.startsWith('http') || gallery.main_image_url.startsWith('/api/public/file')) {
        setExistingMainImageUrl(gallery.main_image_url);
      } else {
        setExistingMainImageUrl(`/api/public/file?file_url=${encodeURIComponent(gallery.main_image_url)}`);
      }
    } else {
      setExistingMainImageUrl(null);
    }
  }, [gallery]);

  const handleDeleteImage = async (url: string, imageId?: number) => {
    if (!gallery?.id || !imageId) {
      // For new galleries or if no imageId, just remove from display
      setDeletedImageUrls(prev => [...prev, url]);
      toast.success("Image marked for deletion");
      return;
    }

    try {
      const response = await fetch(
        `/api/galleries/${gallery.id}/remove-file`,
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

  const handleFormSubmit = async (data: Record<string, any>) => {
    try {
      setIsSubmitting(true);
      const validated = formSchema.parse(data);
      
      await onSubmit({
        title_ar: validated.title_ar,
        title_en: validated.title_en || null,
        main_image_id: gallery?.main_image_id || null,
        image_ids: gallery?.image_ids || [],
        status: validated.status,
        organization_id: gallery?.organization_id || 1,
        mainImage: validated.mainImage,
        imageIds: imageFiles.length > 0 ? imageFiles : undefined,
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
      {isEdit && existingMainImageUrl && (
        <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
          <Avatar className="size-20">
            <AvatarImage src={existingMainImageUrl} alt="Current main image" />
            <AvatarFallback>
              {gallery?.title_ar?.[0] || gallery?.title_en?.[0] || "G"}
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
        formId="gallery-form"
        config={[
          {
            name: "title_ar",
            label: "Title (Arabic)",
            type: "text",
            placeholder: "Enter title in Arabic",
            validation: formSchema.shape.title_ar,
            required: true,
            helperText: "Gallery title in Arabic (required)",
          },
          {
            name: "title_en",
            label: "Title (English)",
            type: "text",
            placeholder: "Enter title in English",
            validation: formSchema.shape.title_en,
            required: false,
            helperText: "Gallery title in English (optional)",
          },
          {
            name: "status",
            label: "Status",
            type: "select",
            placeholder: "Select status",
            validation: formSchema.shape.status,
            required: true,
            helperText: "Gallery status",
            options: [
              { value: "1", label: "Active" },
              { value: "0", label: "Inactive" },
            ],
          },
          {
            name: "mainImage",
            label: "Main Image",
            type: "imageuploader",
            validation: formSchema.shape.mainImage,
            required: false,
            helperText: "Upload main gallery image (JPG, PNG, WEBP - Max 5MB)",
          },
        ]}
        onSubmit={handleFormSubmit}
        submitText=""
        onSuccess={onCancel}
        defaultValues={{
          title_ar: gallery?.title_ar || "",
          title_en: gallery?.title_en || "",
          status: gallery?.status?.toString() || "1",
          mainImage: undefined,
        }}
      />

      {/* Gallery Images Tab */}
      <Tabs defaultValue="images" className="w-full">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="images">Gallery Images</TabsTrigger>
        </TabsList>
        <TabsContent value="images" className="space-y-4 pt-4">
          {/* Display existing images */}
          {isEdit && gallery?.image_urls && gallery.image_urls.length > 0 && (
            <div className="space-y-2 mb-4">
              <Label>Existing Images</Label>
              <div className="grid grid-cols-3 gap-4">
                {gallery.image_urls
                  .filter(url => url != null && !deletedImageUrls.includes(url))
                  .map((url, index) => {
                    const imageId = gallery.image_ids?.[index];
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
      </Tabs>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <Button 
          type="button" 
          disabled={isSubmitting}
          onClick={async () => {
            setIsSubmitting(true);
            try {
              const form = document.getElementById('gallery-form') as HTMLFormElement;
              if (!form) {
                toast.error("Form not found");
                return;
              }
              
              // Try to trigger form submission using requestSubmit
              try {
                form.requestSubmit();
              } catch (error) {
                console.warn('requestSubmit failed, manually collecting form values', error);
                
                // Manually collect form values
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
          {isSubmitting ? "Saving..." : gallery ? "Update Gallery" : "Create Gallery"}
          <Send className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
