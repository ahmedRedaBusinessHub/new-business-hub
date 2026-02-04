"use client";
import { useState, useEffect } from "react";
import { staticListsCache } from "@/lib/staticListsCache";
import { getLocalizedLabel } from "@/lib/localizedLabel";
import { useI18n } from "@/hooks/useI18n";

interface TypeNameProps {
  typeId: number;
}

export function TypeName({ typeId }: TypeNameProps) {
  const { language } = useI18n();
  const [typeName, setTypeName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!typeId) {
      setTypeName("-");
      setLoading(false);
      return;
    }

    const fetchType = async () => {
      try {
        const typeObj = await staticListsCache.getItemById('project.types', typeId);
        setTypeName(typeObj ? getLocalizedLabel(typeObj.name_en, typeObj.name_ar, language) : typeId.toString());
      } catch (error) {
        console.error('Error fetching type:', error);
        setTypeName(typeId.toString());
      } finally {
        setLoading(false);
      }
    };

    fetchType();
  }, [typeId, language]);

  if (loading) return <span className="text-muted-foreground">Loading...</span>;
  return <span>{typeName}</span>;
}

interface CategoryNamesProps {
  categoryIds: number[];
}

export function CategoryNames({ categoryIds }: CategoryNamesProps) {
  const { language } = useI18n();
  const [categoryNames, setCategoryNames] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
      setCategoryNames("-");
      setLoading(false);
      return;
    }

    const fetchCategories = async () => {
      try {
        const categories = await staticListsCache.getItemsByIds('project.categories', categoryIds);
        setCategoryNames(categories.map(cat => getLocalizedLabel(cat.name_en, cat.name_ar, language)).join(", "));
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategoryNames(categoryIds.join(", "));
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [categoryIds, language]);

  if (loading) return <span className="text-muted-foreground">Loading...</span>;
  return <span>{categoryNames}</span>;
}
