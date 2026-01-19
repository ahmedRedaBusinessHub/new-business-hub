import * as z from "zod";
import { useState, useEffect } from "react";
import type { News } from "./NewsManagement";
import DynamicForm from "../shared/DynamicForm";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { Send, Trash2 } from "lucide-react";

const baseFormSchema = z.object({
  title_ar: z.string().min(2, "Arabic title must be at least 2 characters"),
  title_en: z.string().nullable().optional(),
  detail_ar: z.string().nullable().optional(),
  detail_en: z.string().nullable().optional(),
  social_media: z.record(z.string(), z.string()).optional(),
  status: z.number().int().min(0).max(1),
  mainImage: z.any().optional(),
  imageIds: z.any().optional(),
});

const formFieldSchema = z.object({
  title_ar: z.string().min(2, "Arabic title must be at least 2 characters"),
  title_en: z.string().optional(),
  detail_ar: z.string().optional(),
  detail_en: z.string().optional(),
  social_media: z.any().optional(),
  status: z.coerce.number().int().min(0).max(1),
  mainImage: z.any().optional(),
  imageIds: z.any().optional(),
});

const formSchema = baseFormSchema;

interface NewsFormProps {
  news: News | null;
  onSubmit: (data: Omit<News, "id" | "created_at" | "updated_at" | "main_image_url"> & { 
    mainImage?: File[];
    imageIds?: File[];
  }) => void;
  onCancel: () => void;
}

export function NewsForm({ news, onSubmit, onCancel }: NewsFormProps) {
  const isEdit = !!news;
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [socialMediaLinks, setSocialMediaLinks] = useState<Record<string, string>>({});
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [deletedImageUrls, setDeletedImageUrls] = useState<string[]>([]);

  const handleDeleteImage = async (url: string, imageId?: number) => {
    if (!news?.id || !imageId) {
      setDeletedImageUrls(prev => [...prev, url]);
      toast.success("Image marked for deletion");
      return;
    }

    try {
      const response = await fetch(
        `/api/news/${news.id}/remove-file`,
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

  // Initialize social media links from news data
  useEffect(() => {
    if (news?.social_media) {
      try {
        const socialMedia = typeof news.social_media === 'string' 
          ? JSON.parse(news.social_media) 
          : news.social_media;
        setSocialMediaLinks(socialMedia || {});
      } catch {
        setSocialMediaLinks({});
      }
    } else {
      setSocialMediaLinks({});
    }
  }, [news]);

  // Use main_image_url from news data
  useEffect(() => {
    if (news?.main_image_url) {
      if (news.main_image_url.startsWith('http') || news.main_image_url.startsWith('/api/public/file')) {
        setExistingImageUrl(news.main_image_url);
      } else {
        setExistingImageUrl(`/api/public/file?file_url=${encodeURIComponent(news.main_image_url)}`);
      }
    } else {
      setExistingImageUrl(null);
    }
  }, [news]);

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      const currentSocialMedia = socialMediaLinks || {};
      
      const dataWithSocialMedia: Record<string, any> = {
        title_ar: data.title_ar ?? "",
        title_en: data.title_en ?? "",
        detail_ar: data.detail_ar ?? "",
        detail_en: data.detail_en ?? "",
        status: data.status !== undefined && data.status !== null ? data.status : 1,
      };
      
      dataWithSocialMedia.mainImage = data.mainImage;
      dataWithSocialMedia.imageIds = imageFiles.length > 0 ? imageFiles : undefined;
      dataWithSocialMedia.social_media = currentSocialMedia;
      
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
        social_media: currentSocialMedia,
        status: validated.status,
        mainImage: validated.mainImage,
        imageIds: imageFiles,
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
              {news?.title_ar?.[0] || news?.title_en?.[0] || "N"}
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
        formId="news-form"
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
            name: "status",
            label: "Status",
            type: "select",
            placeholder: "Select status",
            validation: formFieldSchema.shape.status,
            required: true,
            helperText: "News status",
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
          title_ar: news?.title_ar || "",
          title_en: news?.title_en || "",
          detail_ar: news?.detail_ar || "",
          detail_en: news?.detail_en || "",
          status: news?.status?.toString() || "1",
          mainImage: undefined,
        }}
      />
      
      <Tabs defaultValue="social" className="w-full mt-6">
        <TabsList className={`grid w-full h-auto p-1 bg-muted/50 rounded-xl ${isEdit ? 'grid-cols-2' : 'grid-cols-1'}`}>
          <TabsTrigger value="social" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm py-2.5">Social Media</TabsTrigger>
          {isEdit && <TabsTrigger value="images" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm py-2.5">Images</TabsTrigger>}
        </TabsList>

        <TabsContent value="social" className="space-y-4 pt-4">
          <Label className="text-sm font-medium text-muted-foreground">Social Media Links</Label>
          <div className="space-y-2">
            {['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'].map((platform) => (
              <div key={platform} className="flex items-center gap-2 w-full">
                <Label className="w-24 shrink-0 capitalize text-sm">{platform}:</Label>
                <div className="flex-1">
                  <Input
                    type="url"
                    placeholder={`https://${platform}.com/...`}
                    value={socialMediaLinks[platform] || ""}
                    onChange={(e) => handleSocialMediaChange(platform, e.target.value)}
                    className="w-full bg-muted/50 border-0 rounded-md"
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Enter social media URLs (optional)</p>
        </TabsContent>

        {isEdit && (
          <TabsContent value="images" className="space-y-6 pt-4">
            {news?.image_urls && news.image_urls.length > 0 && (
              <div className="space-y-3">
                <Label className="text-sm font-medium text-muted-foreground">Existing Images</Label>
                <div className="grid grid-cols-3 gap-4">
                  {news.image_urls
                    .filter(url => url != null && !deletedImageUrls.includes(url))
                    .map((url, index) => {
                      const imageId = news.image_ids?.[index];
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
              
              const form = document.getElementById('news-form') as HTMLFormElement;
              
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
            {news ? "Update News" : "Create News"}
            <Send className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}
