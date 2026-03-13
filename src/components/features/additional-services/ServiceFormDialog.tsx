"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { ServiceType, CreateServicePayload, AdminServiceCatalogItem } from "@/types/api/additional-services-admin";

interface ServiceFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateServicePayload) => void;
  isLoading?: boolean;
  service?: AdminServiceCatalogItem | null;
}

export function ServiceFormDialog({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  service,
}: ServiceFormDialogProps) {
  const t = useTranslations();
  const [formData, setFormData] = useState({
    name_en: "",
    name_ar: "",
    service_type: "" as ServiceType | "",
    base_price: "",
    pricing_unit: "",
    description_en: "",
    description_ar: "",
  });

  useEffect(() => {
    if (service) {
      setFormData({
        name_en: service.name_en,
        name_ar: service.name_ar,
        service_type: service.service_type,
        base_price: service.base_price.toString(),
        pricing_unit: service.pricing_unit,
        description_en: service.description_en || "",
        description_ar: service.description_ar || "",
      });
    } else {
      setFormData({
        name_en: "",
        name_ar: "",
        service_type: "",
        base_price: "",
        pricing_unit: "",
        description_en: "",
        description_ar: "",
      });
    }
  }, [service, isOpen]);

  const handleSubmit = () => {
    if (!formData.name_en.trim() || !formData.name_ar.trim() || !formData.service_type || !formData.base_price || !formData.pricing_unit.trim()) {
      return;
    }

    const basePrice = parseFloat(formData.base_price);
    if (isNaN(basePrice) || basePrice < 0.01) {
      return;
    }

    onSubmit({
      name_en: formData.name_en.trim(),
      name_ar: formData.name_ar.trim(),
      service_type: formData.service_type as ServiceType,
      base_price: basePrice,
      pricing_unit: formData.pricing_unit.trim(),
      description_en: formData.description_en.trim() || undefined,
      description_ar: formData.description_ar.trim() || undefined,
    });
  };

  const handleReset = () => {
    if (service) {
      setFormData({
        name_en: service.name_en,
        name_ar: service.name_ar,
        service_type: service.service_type,
        base_price: service.base_price.toString(),
        pricing_unit: service.pricing_unit,
        description_en: service.description_en || "",
        description_ar: service.description_ar || "",
      });
    } else {
      setFormData({
        name_en: "",
        name_ar: "",
        service_type: "",
        base_price: "",
        pricing_unit: "",
        description_en: "",
        description_ar: "",
      });
    }
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const isSubmitDisabled =
    !formData.name_en.trim() ||
    !formData.name_ar.trim() ||
    !formData.service_type ||
    !formData.base_price ||
    !formData.pricing_unit.trim() ||
    isNaN(parseFloat(formData.base_price)) ||
    parseFloat(formData.base_price) < 0.01 ||
    isLoading;

  const isEditMode = !!service;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? t("edit_service") : t("create_service")}</DialogTitle>
          <DialogDescription>
            {isEditMode ? t("edit_service_description") : t("create_service_description")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name_en">{t("name_en")} *</Label>
              <Input
                id="name_en"
                value={formData.name_en}
                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                disabled={isLoading}
                placeholder={t("enter_service_name")}
              />
            </div>
            <div>
              <Label htmlFor="name_ar">{t("name_ar")} *</Label>
              <Input
                id="name_ar"
                value={formData.name_ar}
                onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                disabled={isLoading}
                placeholder={t("enter_service_name_ar")}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Select
                id="service_type"
                label={t("service_type")}
                required
                options={[
                  { label: "PRINTING", value: "PRINTING" },
                  { label: "STORAGE", value: "STORAGE" },
                  { label: "MAILBOX", value: "MAILBOX" },
                  { label: "STUDIO", value: "STUDIO" },
                ]}
                value={formData.service_type}
                onChange={(e) => setFormData({ ...formData, service_type: e.target.value as ServiceType })}
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="base_price">{t("base_price")} *</Label>
              <Input
                id="base_price"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.base_price}
                onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                disabled={isLoading}
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="pricing_unit">{t("pricing_unit")} *</Label>
            <Input
              id="pricing_unit"
              value={formData.pricing_unit}
              onChange={(e) => setFormData({ ...formData, pricing_unit: e.target.value })}
              disabled={isLoading}
              placeholder={t("enter_pricing_unit")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="description_en">{t("description_en")}</Label>
              <Textarea
                id="description_en"
                value={formData.description_en}
                onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                disabled={isLoading}
                rows={3}
                placeholder={t("enter_description")}
              />
            </div>
            <div>
              <Label htmlFor="description_ar">{t("description_ar")}</Label>
              <Textarea
                id="description_ar"
                value={formData.description_ar}
                onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                disabled={isLoading}
                rows={3}
                placeholder={t("enter_description_ar")}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={handleClose} disabled={isLoading}>
            {t("common_cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitDisabled}>
            {isLoading ? t("common_saving") : isEditMode ? t("common_update") : t("common_create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
