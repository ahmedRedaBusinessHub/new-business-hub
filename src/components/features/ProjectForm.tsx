import * as z from "zod";
import { useState, useEffect, useRef, useMemo } from "react";
import type { Project } from "./ProjectsManagement";
import DynamicForm, { type FormField } from "../shared/DynamicForm";
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
import { getLocalizedLabel } from "@/lib/localizedLabel";
import { useI18n } from "@/hooks/useI18n";

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
  const { t, language } = useI18n("admin");
  const isEdit = !!project;
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [projectTypes, setProjectTypes] = useState<StaticListOption[]>([]);
  const [projectCategories, setProjectCategories] = useState<StaticListOption[]>([]);
  const [projectStatuses, setProjectStatuses] = useState<StaticListOption[]>([]);
  const [loadingStaticLists, setLoadingStaticLists] = useState(true);
  const [socialMediaLinks, setSocialMediaLinks] = useState<Record<string, string>>({});
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [fileFiles, setFileFiles] = useState<File[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [deletedImageUrls, setDeletedImageUrls] = useState<string[]>([]);
  const [deletedFileUrls, setDeletedFileUrls] = useState<string[]>([]);
  const staticListsFetchedRef = useRef(false);

  const formSchema = useMemo(() => z.object({
    title_ar: z.string().min(2, t("entities.projects.titleArPlaceholder")),
    title_en: z.string().optional(),
    detail_ar: z.string().optional(),
    detail_en: z.string().optional(),
    type: z.union([z.string(), z.number()]).optional(),
    category_ids: z.any().optional(),
    link: z.union([z.string().url(t("entities.projects.linkPlaceholder")), z.literal("")]).optional(),
    social_media: z.any().optional(),
    status: z.coerce.number().int().min(0).max(1),
    mainImage: z.any().optional(),
    imageIds: z.any().optional(),
    fileIds: z.any().optional(),
  }), [t]);

  const handleDeleteImage = async (url: string, imageId?: number) => {
    if (!project?.id || !imageId) {
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

  // Fetch static lists for type and categories (only once)
  useEffect(() => {
    if (staticListsFetchedRef.current) return;

    const fetchStaticLists = async () => {
      try {
        staticListsFetchedRef.current = true;
        setLoadingStaticLists(true);

        const typesConfig = await staticListsCache.getByNamespace('project.types');
        if (typesConfig.length > 0) {
          setProjectTypes(typesConfig);
        } else {
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
          const newTypes = await staticListsCache.getByNamespace('project.types', true);
          setProjectTypes(newTypes.length > 0 ? newTypes : [
            { id: 1, name_en: 'Type 1', name_ar: 'نوع 1' },
            { id: 2, name_en: 'Type 2', name_ar: 'نوع 2' },
            { id: 3, name_en: 'Type 3', name_ar: 'نوع 3' },
          ]);
        }

        const categoriesConfig = await staticListsCache.getByNamespace('project.categories');
        if (categoriesConfig.length > 0) {
          setProjectCategories(categoriesConfig);
        } else {
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
          const newCategories = await staticListsCache.getByNamespace('project.categories', true);
          setProjectCategories(newCategories.length > 0 ? newCategories : [
            { id: 1, name_en: 'Category 1', name_ar: 'فئة 1' },
            { id: 2, name_en: 'Category 2', name_ar: 'فئة 2' },
            { id: 3, name_en: 'Category 3', name_ar: 'فئة 3' },
          ]);
        }

        const statusesConfig = await staticListsCache.getByNamespace('project.statuses');
        setProjectStatuses(statusesConfig || []);
      } catch (error) {
        console.error('Error fetching static lists:', error);
        toast.error('Failed to load project types and categories');
        staticListsFetchedRef.current = false;
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
      const currentSocialMedia = socialMediaLinks || {};
      const currentCategoryIds = selectedCategoryIds || [];

      const dataWithSocialMedia: Record<string, any> = {
        title_ar: data.title_ar ?? "",
        title_en: data.title_en ?? "",
        detail_ar: data.detail_ar ?? "",
        detail_en: data.detail_en ?? "",
        status: data.status !== undefined && data.status !== null ? data.status : 1,
      };

      if (data.type !== undefined && data.type !== null && data.type !== "") {
        const typeValue = typeof data.type === 'string' ? Number(data.type) : data.type;
        dataWithSocialMedia.type = isNaN(typeValue) ? null : typeValue;
      } else {
        dataWithSocialMedia.type = null;
      }

      if (data.link !== undefined && data.link !== null && data.link !== "") {
        dataWithSocialMedia.link = String(data.link);
      } else {
        dataWithSocialMedia.link = "";
      }

      dataWithSocialMedia.mainImage = data.mainImage;
      dataWithSocialMedia.imageIds = imageFiles.length > 0 ? imageFiles : undefined;
      dataWithSocialMedia.fileIds = fileFiles.length > 0 ? fileFiles : undefined;

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
        type: validated.type ? Number(validated.type) : null,
        category_ids: currentCategoryIds,
        link: validated.link || null,
        social_media: currentSocialMedia,
        status: validated.status,
        organization_id: project?.organization_id || 1,
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

  const formConfig = useMemo((): FormField[] => [
    {
      name: "title_ar",
      label: t("entities.projects.titleAr"),
      type: "text",
      placeholder: t("entities.projects.titleArPlaceholder"),
      validation: formSchema.shape.title_ar,
      required: true,
      helperText: `${t("entities.projects.titleAr")} ${t("entities.projects.helperTextRequired")}`,
    },
    {
      name: "title_en",
      label: t("entities.projects.titleEn"),
      type: "text",
      placeholder: t("entities.projects.titleEnPlaceholder"),
      validation: formSchema.shape.title_en,
      required: false,
      helperText: `${t("entities.projects.titleEn")} ${t("entities.projects.helperTextOptional")}`,
    },
    {
      name: "detail_ar",
      label: t("entities.projects.detailAr"),
      type: "textarea",
      placeholder: t("entities.projects.detailArPlaceholder"),
      validation: formSchema.shape.detail_ar,
      required: false,
      helperText: `${t("entities.projects.detailAr")} ${t("entities.projects.helperTextOptional")}`,
    },
    {
      name: "detail_en",
      label: t("entities.projects.detailEn"),
      type: "textarea",
      placeholder: t("entities.projects.detailEnPlaceholder"),
      validation: formSchema.shape.detail_en,
      required: false,
      helperText: `${t("entities.projects.detailEn")} ${t("entities.projects.helperTextOptional")}`,
    },
    {
      name: "type",
      label: t("entities.projects.type"),
      type: "select",
      placeholder: t("entities.projects.selectType"),
      validation: formSchema.shape.type,
      required: false,
      helperText: `${t("entities.projects.type")} ${t("entities.projects.helperTextOptional")}`,
      options: loadingStaticLists
        ? [{ value: "", label: t("entities.projects.loadingCategories") }]
        : projectTypes.map(tOption => ({ value: tOption.id.toString(), label: getLocalizedLabel(tOption.name_en, tOption.name_ar, language) })),
    },
    {
      name: "link",
      label: t("entities.projects.link"),
      type: "url",
      placeholder: t("entities.projects.linkPlaceholder"),
      validation: formSchema.shape.link,
      required: false,
      helperText: `${t("entities.projects.link")} ${t("entities.projects.helperTextOptional")}`,
    },
    {
      name: "status",
      label: t("common.status"),
      type: "select",
      placeholder: t("common.status"),
      validation: formSchema.shape.status,
      required: true,
      helperText: t("common.status"),
      options: projectStatuses.length > 0
        ? projectStatuses.map((s) => ({ value: String(s.id), label: getLocalizedLabel(s.name_en, s.name_ar, language) }))
        : [
          { value: "1", label: t("entities.projects.statusActive") },
          { value: "0", label: t("entities.projects.statusInactive") },
        ],
    },
    {
      name: "mainImage",
      label: t("entities.projects.mainImage"),
      type: "imageuploader",
      validation: formSchema.shape.mainImage,
      required: false,
      helperText: t("entities.projects.mainImageHelper"),
    },
  ], [formSchema, t, language, loadingStaticLists, projectTypes, projectStatuses]);

  return (
    <>
      {isEdit && existingImageUrl && (
        <div className="mb-6 flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
          <Avatar className="size-20">
            <AvatarImage src={existingImageUrl} alt={t("entities.projects.currentMainImage")} />
            <AvatarFallback>
              {project?.title_ar?.[0] || project?.title_en?.[0] || "P"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium">{t("entities.projects.currentMainImage")}</p>
            <p className="text-xs text-muted-foreground">
              {t("entities.projects.uploadNewImage")}
            </p>
          </div>
        </div>
      )}

      <DynamicForm
        formId="project-form"
        className="w-full"
        config={formConfig}
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
          <TabsTrigger value="details">{t("entities.projects.details")}</TabsTrigger>
          <TabsTrigger value="social">{t("entities.projects.socialMedia")}</TabsTrigger>
          {isEdit && <TabsTrigger value="images">{t("entities.projects.images")}</TabsTrigger>}
          {isEdit && <TabsTrigger value="files">{t("entities.projects.files")}</TabsTrigger>}
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="space-y-2">
            <Label>{t("entities.projects.categories")}</Label>
            <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
              {loadingStaticLists ? (
                <p className="text-sm text-muted-foreground">{t("entities.projects.loadingCategories")}</p>
              ) : projectCategories.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("entities.projects.noCategories")}</p>
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
                      {getLocalizedLabel(category.name_en, category.name_ar, language)}
                    </Label>
                  </div>
                ))
              )}
            </div>
            <p className="text-xs text-muted-foreground">{t("entities.projects.selectCategories")}</p>
          </div>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <div className="space-y-2">
            <Label>{t("entities.projects.socialMediaLinks")}</Label>
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
            <p className="text-xs text-muted-foreground">{t("entities.projects.socialMediaHelper")}</p>
          </div>
        </TabsContent>

        {isEdit && (
          <TabsContent value="images" className="space-y-4">
            {project?.image_urls && project.image_urls.length > 0 && (
              <div className="space-y-2 mb-4">
                <Label>{t("entities.projects.existingImages")}</Label>
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
              <Label>{t("entities.projects.uploadNewImages")}</Label>
              <ImageUploader
                multiple={true}
                accept=".jpg,.jpeg,.png,.gif,.webp,.avif,.bmp,.tiff"
                maxSize={5 * 1024 * 1024}
                onChange={(files) => setImageFiles(files)}
                onError={(error) => toast.error(error)}
              />
              <p className="text-xs text-muted-foreground">
                {t("entities.projects.uploadMultipleHelper")}
              </p>
            </div>
          </TabsContent>
        )}

        {isEdit && (
          <TabsContent value="files" className="space-y-4">
            {project?.file_urls && project.file_urls.length > 0 && (
              <div className="space-y-2 mb-4">
                <Label>{t("entities.projects.existingFiles")}</Label>
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
              <Label>{t("entities.projects.uploadNewFiles")}</Label>
              <FileUploader
                multiple={true}
                accept="*/*"
                maxSize={10 * 1024 * 1024}
                onChange={(files) => setFileFiles(files)}
                onError={(error) => toast.error(error)}
              />
              <p className="text-xs text-muted-foreground">
                {t("entities.projects.uploadFilesHelper")}
              </p>
            </div>
          </TabsContent>
        )}
      </Tabs>

      <div className="border-t pt-4 mt-6 bg-background">
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={async (e) => {
              e.preventDefault();

              const form = document.getElementById('project-form') as HTMLFormElement;

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
            {project ? t("entities.projects.edit") : t("entities.projects.createNew")}
            <Send className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}

