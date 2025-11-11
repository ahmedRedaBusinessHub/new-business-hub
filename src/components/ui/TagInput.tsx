"use client";

import React, { useState, useRef, useEffect } from "react";

interface TagInputProps {
  value?: string[];
  onChange?: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
  maxTags?: number;
  delimiter?: string;
}

export const TagInput: React.FC<TagInputProps> = ({
  value = [],
  onChange,
  placeholder = "Type and press Enter to add tags...",
  className = "",
  maxTags,
  delimiter = ",",
}) => {
  const [tags, setTags] = useState<string[]>(value);
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTags(value);
  }, [value]);

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (
      trimmedTag &&
      !tags.includes(trimmedTag) &&
      (!maxTags || tags.length < maxTags)
    ) {
      const newTags = [...tags, trimmedTag];
      setTags(newTags);
      onChange?.(newTags);
      setInputValue("");
    }
  };

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
    onChange?.(newTags);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === delimiter) {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const newTags = pastedText.split(delimiter).map((tag) => tag.trim());

    newTags.forEach((tag) => {
      if (tag && !tags.includes(tag) && (!maxTags || tags.length < maxTags)) {
        const updated = [...tags, tag];
        setTags(updated);
        onChange?.(updated);
      }
    });
    setInputValue("");
  };

  return (
    <div
      className={`w-full border border-gray-200 dark:border-gray-700 rounded-lg p-2 ${
        isFocused ? "ring-2 ring-blue-500" : ""
      } ${className}`}
    >
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm font-medium"
          >
            {tag}
            <button
              onClick={() => removeTag(index)}
              className="hover:text-blue-900 dark:hover:text-blue-100 cursor-pointer font-bold"
              aria-label={`Remove tag: ${tag}`}
            >
              ✕
            </button>
          </span>
        ))}
      </div>

      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e: any) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        disabled={maxTags ? tags.length >= maxTags : false}
        className="w-full outline-none bg-transparent text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
      />

      {maxTags && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {tags.length} / {maxTags} tags
        </div>
      )}
    </div>
  );
};
