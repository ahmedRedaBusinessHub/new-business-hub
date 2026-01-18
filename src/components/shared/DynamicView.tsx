"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";

/* -------------------------------------------------------------------------- */
/*                               Types                                        */
/* -------------------------------------------------------------------------- */

export type ViewFieldType =
  | "text"
  | "date"
  | "datetime"
  | "number"
  | "badge"
  | "boolean"
  | "custom"
  | "image"
  | "avatar";

export type ViewField = {
  name: string;
  label: string;
  type?: ViewFieldType;
  format?: (value: any, data: any) => React.ReactNode;
  render?: (value: any, data: any) => React.ReactNode;
  colSpan?: number; // For grid layout (1-12)
  hideWhenEmpty?: boolean;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
  badgeMap?: Record<string | number, { label: string; variant?: "default" | "secondary" | "destructive" | "outline" }>;
  dateFormat?: "date" | "datetime" | "time";
  imageUrlField?: string; // Field name that contains the image URL
  imageIdField?: string; // Field name that contains the image ID (for fetching)
  fetchImageUrl?: (data: any) => Promise<string | null>; // Custom function to fetch image
  avatarFallback?: (data: any) => string; // Function to generate avatar fallback text
};

export type ViewHeader = {
  type: "avatar" | "image" | "simple";
  title: (data: any) => string;
  subtitle?: (data: any) => string;
  imageUrl?: string | ((data: any) => string | null);
  imageIdField?: string;
  fetchImageUrl?: (data: any) => Promise<string | null>;
  avatarFallback?: (data: any) => string;
  badges?: Array<{
    field: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
    map?: Record<string | number, { label: string; variant?: "default" | "secondary" | "destructive" | "outline" }>;
  }>;
  actions?: React.ReactNode;
};

export type ViewTab = {
  id: string;
  label: string;
  fields?: ViewField[];
  customContent?: React.ReactNode | ((data: any) => React.ReactNode);
  gridCols?: number; // Number of columns in grid (default: 2)
};

export interface DynamicViewProps {
  data: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  header?: ViewHeader;
  tabs?: ViewTab[];
  fields?: ViewField[]; // If no tabs, use simple fields list
  gridCols?: number; // Default grid columns (default: 2)
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "6xl" | "7xl" | "8xl" | "9xl" | "10xl";
}

/* -------------------------------------------------------------------------- */
/*                             Component                                      */
/* -------------------------------------------------------------------------- */

export const DynamicView: React.FC<DynamicViewProps> = ({
  data,
  open,
  onOpenChange,
  title,
  header,
  tabs,
  fields,
  gridCols = 2,
  className = "",
  maxWidth = "4xl",
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);

  // Fetch image if header has image configuration
  useEffect(() => {
    const fetchImage = async () => {
      if (!data || !header) return;

      if (header.type === "avatar" || header.type === "image") {
        try {
          setLoadingImage(true);

          // Try custom fetch function first
          if (header.fetchImageUrl) {
            const url = await header.fetchImageUrl(data);
            setImageUrl(url);
            return;
          }

          // Try imageUrl as function
          if (typeof header.imageUrl === "function") {
            const url = header.imageUrl(data);
            setImageUrl(url);
            return;
          }

          // Try imageUrl as string
          if (typeof header.imageUrl === "string") {
            setImageUrl(header.imageUrl);
            return;
          }

          // Try fetching by imageIdField
          if (header.imageIdField && data[header.imageIdField]) {
            // Try to fetch from API
            try {
              const response = await fetch(`/api/${title.toLowerCase()}s/${data.id}`);
              if (response.ok) {
                const responseData = await response.json();
                const itemData = responseData.data || responseData;
                if (itemData.image) {
                  setImageUrl(itemData.image);
                }
              }
            } catch (error) {
              console.error("Error fetching image:", error);
            }
          }
        } catch (error) {
          console.error("Error fetching image:", error);
        } finally {
          setLoadingImage(false);
        }
      }
    };

    if (data && open && header) {
      fetchImage();
    } else {
      setImageUrl(null);
    }
  }, [data, open, header]);

  if (!data) return null;

  const formatDate = (dateString: string | null | undefined, format: "date" | "datetime" | "time" = "date") => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      if (format === "date") {
        return date.toLocaleDateString();
      } else if (format === "datetime") {
        return date.toLocaleString();
      } else if (format === "time") {
        return date.toLocaleTimeString();
      }
      return date.toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const formatValue = (field: ViewField, value: any): React.ReactNode => {
    if (value === null || value === undefined || value === "") {
      return "-";
    }

    // Custom render function takes priority
    if (field.render) {
      return field.render(value, data);
    }

    // Custom format function
    if (field.format) {
      return field.format(value, data);
    }

    // Type-based formatting
    switch (field.type) {
      case "date":
      case "datetime":
        return formatDate(value, field.dateFormat || (field.type === "datetime" ? "datetime" : "date"));
      
      case "number":
        return typeof value === "number" ? value.toLocaleString() : value;
      
      case "boolean":
        return value ? "Yes" : "No";
      
      case "badge":
        if (field.badgeMap && field.badgeMap[value]) {
          const badgeConfig = field.badgeMap[value];
          return (
            <Badge variant={badgeConfig.variant || field.badgeVariant || "default"}>
              {badgeConfig.label}
            </Badge>
          );
        }
        return (
          <Badge variant={field.badgeVariant || "default"}>
            {String(value)}
          </Badge>
        );
      
      case "image":
        const imgUrl = field.imageUrlField
          ? data[field.imageUrlField]
          : field.imageIdField && imageUrl
          ? imageUrl
          : null;
        return imgUrl ? (
          <img src={imgUrl} alt={field.label} className="max-w-full h-auto rounded" />
        ) : (
          "-"
        );
      
      case "avatar":
        const avatarUrl = field.imageUrlField
          ? data[field.imageUrlField]
          : field.imageIdField && imageUrl
          ? imageUrl
          : null;
        const fallback = field.avatarFallback ? field.avatarFallback(data) : String(value || "").substring(0, 2).toUpperCase();
        return (
          <Avatar>
            {avatarUrl && <AvatarImage src={avatarUrl} alt={field.label} />}
            <AvatarFallback>{fallback}</AvatarFallback>
          </Avatar>
        );
      
      case "custom":
        return value;
      
      default:
        return String(value);
    }
  };

  const renderHeader = () => {
    if (!header) return null;

    if (header.type === "avatar" || header.type === "image") {
      const fallback = header.avatarFallback ? header.avatarFallback(data) : "";
      return (
        <div className="flex items-center gap-4 pb-4 border-b">
          <Avatar className="size-20">
            {imageUrl && !loadingImage && (
              <AvatarImage src={imageUrl} alt={header.title(data)} />
            )}
            <AvatarFallback className="text-lg">{fallback}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-xl font-semibold">{header.title(data)}</h3>
            {header.subtitle && (
              <p className="text-sm text-muted-foreground">{header.subtitle(data)}</p>
            )}
            {header.badges && (
              <div className="flex gap-2 mt-2">
                {header.badges.map((badgeConfig, index) => {
                  const value = data[badgeConfig.field];
                  if (badgeConfig.map && badgeConfig.map[value]) {
                    const badge = badgeConfig.map[value];
                    return (
                      <Badge key={index} variant={badge.variant || badgeConfig.variant || "default"}>
                        {badge.label}
                      </Badge>
                    );
                  }
                  return (
                    <Badge key={index} variant={badgeConfig.variant || "default"}>
                      {String(value || "-")}
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>
          {header.actions && <div>{header.actions}</div>}
        </div>
      );
    }

    // Simple header
    return (
      <div className="pb-4 border-b">
        <h3 className="text-xl font-semibold">{header.title(data)}</h3>
        {header.subtitle && (
          <p className="text-sm text-muted-foreground">{header.subtitle(data)}</p>
        )}
        {header.badges && (
          <div className="flex gap-2 mt-2">
            {header.badges.map((badgeConfig, index) => {
              const value = data[badgeConfig.field];
              if (badgeConfig.map && badgeConfig.map[value]) {
                const badge = badgeConfig.map[value];
                return (
                  <Badge key={index} variant={badge.variant || badgeConfig.variant || "default"}>
                    {badge.label}
                  </Badge>
                );
              }
              return (
                <Badge key={index} variant={badgeConfig.variant || "default"}>
                  {String(value || "-")}
                </Badge>
              );
            })}
          </div>
        )}
        {header.actions && <div className="mt-2">{header.actions}</div>}
      </div>
    );
  };

  const getGridColsClass = (cols: number): string => {
    const gridMap: Record<number, string> = {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      6: "grid-cols-6",
      12: "grid-cols-12",
    };
    return gridMap[cols] || "grid-cols-2";
  };

  const getColSpanClass = (colSpan: number): string => {
    if (colSpan === 12) return "col-span-full";
    const spanMap: Record<number, string> = {
      1: "col-span-1",
      2: "col-span-2",
      3: "col-span-3",
      4: "col-span-4",
      6: "col-span-6",
      12: "col-span-12",
    };
    return spanMap[colSpan] || "";
  };

  const renderFields = (fieldsToRender: ViewField[], cols: number = gridCols) => {
    return (
      <div className="grid grid-cols-12 gap-4">
        {fieldsToRender.map((field) => {
          const value = data[field.name];
          
          if (field.hideWhenEmpty && (value === null || value === undefined || value === "")) {
            return null;
          }

          // Use colSpan if specified, otherwise default to 2-column layout (6 cols each)
          // For fields that should be full width (like long text), use colSpan: 12
          const colSpan = field.colSpan || (cols === 2 ? 6 : 12);
          const colClass = colSpan === 12 ? "col-span-12" : "col-span-12 sm:col-span-6";

          return (
            <div key={field.name} className={colClass}>
              <label className="text-sm font-medium">{field.label}</label>
              <div className="mt-1">{formatValue(field, value)}</div>
            </div>
          );
        })}
      </div>
    );
  };

  const maxWidthClass = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "4xl": "max-w-4xl",
    "6xl": "max-w-6xl",
    "7xl": "max-w-7xl",
    "8xl": "max-w-8xl",
    "9xl": "max-w-9xl",
    "10xl": "max-w-10xl",
  }[maxWidth];

  const maxWidthClassResponsive = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
    "2xl": "sm:max-w-2xl",
    "4xl": "sm:max-w-4xl",
    "6xl": "sm:max-w-6xl",
    "7xl": "sm:max-w-7xl",
    "8xl": "sm:max-w-8xl",
    "9xl": "sm:max-w-9xl",
    "10xl": "sm:max-w-10xl",
  }[maxWidth];

  const dialogClassName = `${maxWidthClass} ${maxWidthClassResponsive} max-h-[90vh] overflow-y-auto ${className}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={dialogClassName}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {header && renderHeader()}

        {tabs && tabs.length > 0 ? (
          <Tabs defaultValue={tabs[0]?.id || "details"} className="w-full">
            <TabsList>
              {tabs.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {tabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id} className="space-y-4">
                {tab.customContent ? (
                  typeof tab.customContent === "function" ? (
                    tab.customContent(data)
                  ) : (
                    tab.customContent
                  )
                ) : tab.fields ? (
                  renderFields(tab.fields, tab.gridCols || gridCols)
                ) : null}
              </TabsContent>
            ))}
          </Tabs>
        ) : fields ? (
          <div className="space-y-4">{renderFields(fields, gridCols)}</div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default DynamicView;

