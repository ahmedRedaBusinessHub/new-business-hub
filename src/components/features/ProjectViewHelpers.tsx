"use client";
import { useState, useEffect } from "react";
import { staticListsCache } from "@/lib/staticListsCache";

interface TypeNameProps {
  typeId: number;
}

export function TypeName({ typeId }: TypeNameProps) {
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
        setTypeName(typeObj ? typeObj.name_en : typeId.toString());
      } catch (error) {
        console.error('Error fetching type:', error);
        setTypeName(typeId.toString());
      } finally {
        setLoading(false);
      }
    };

    fetchType();
  }, [typeId]);

  if (loading) return <span className="text-muted-foreground">Loading...</span>;
  return <span>{typeName}</span>;
}

interface CategoryNamesProps {
  categoryIds: number[];
}

export function CategoryNames({ categoryIds }: CategoryNamesProps) {
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
        setCategoryNames(categories.map(cat => cat.name_en).join(", "));
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategoryNames(categoryIds.join(", "));
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [categoryIds]);

  if (loading) return <span className="text-muted-foreground">Loading...</span>;
  return <span>{categoryNames}</span>;
}
