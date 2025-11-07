'use client';

import React, { useState } from 'react';

interface CalendarProps {
  value?: Date;
  onChange?: (date: Date) => void;
  className?: string;
}

export const Calendar: React.FC<CalendarProps> = ({
  value = new Date(),
  onChange,
  className = '',
}) => {
  const [currentMonth, setCurrentMonth] = useState(value);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days: (number | null)[] = Array(firstDay).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateClick = (day: number) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    onChange?.(selectedDate);
  };

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className={`p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
        >
          ‹
        </button>
        <h3 className="font-semibold text-gray-900 dark:text-white">{monthName}</h3>
        <button
          onClick={handleNextMonth}
          className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-semibold text-gray-600 dark:text-gray-400 py-2"
          >
            {day}
          </div>
        ))}

        {days.map((day, index) => (
          <div key={index}>
            {day ? (
              <button
                onClick={() => handleDateClick(day)}
                className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                  value?.getDate() === day &&
                  value?.getMonth() === currentMonth.getMonth() &&
                  value?.getFullYear() === currentMonth.getFullYear()
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white'
                }`}
              >
                {day}
              </button>
            ) : (
              <div className="w-8 h-8" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
