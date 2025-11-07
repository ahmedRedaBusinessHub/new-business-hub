'use client';

import React, { useRef, useState } from 'react';

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  height?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value = '',
  onChange,
  placeholder = 'Enter text...',
  className = '',
  height = '300px',
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleInput = () => {
    if (editorRef.current) {
      onChange?.(editorRef.current.innerHTML);
    }
  };

  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  return (
    <div className={`w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ${className}`}>
      <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-2 flex flex-wrap gap-1">
        <button
          onClick={() => applyFormat('bold')}
          className="px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => applyFormat('italic')}
          className="px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Italic"
        >
          <em>I</em>
        </button>
        <button
          onClick={() => applyFormat('underline')}
          className="px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Underline"
        >
          <u>U</u>
        </button>
        <div className="border-l border-gray-300 dark:border-gray-600 mx-1" />
        <button
          onClick={() => applyFormat('insertUnorderedList')}
          className="px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Bullet List"
        >
          •
        </button>
        <button
          onClick={() => applyFormat('insertOrderedList')}
          className="px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Numbered List"
        >
          1.
        </button>
        <button
          onClick={() => applyFormat('createLink', prompt('Enter URL:') || '')}
          className="px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Link"
        >
          🔗
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full p-4 outline-none text-gray-900 dark:text-white bg-white dark:bg-gray-900 ${
          isFocused ? 'ring-2 ring-blue-500' : ''
        }`}
        style={{ height, minHeight: height }}
        data-placeholder={placeholder}
      >
        {value}
      </div>
    </div>
  );
};
