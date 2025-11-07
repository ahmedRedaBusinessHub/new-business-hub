'use client';

import React, { createContext, useContext, useState } from 'react';

interface WizardContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  totalSteps: number;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

interface WizardProps {
  children: React.ReactNode;
  currentStep?: number;
  onStepChange?: (step: number) => void;
  className?: string;
}

export const Wizard: React.FC<WizardProps> = ({
  children,
  currentStep = 0,
  onStepChange,
  className = '',
}) => {
  const [step, setStep] = useState(currentStep);
  const childrenArray = React.Children.toArray(children);
  const totalSteps = childrenArray.length;

  const handleSetStep = (newStep: number) => {
    if (newStep >= 0 && newStep < totalSteps) {
      setStep(newStep);
      onStepChange?.(newStep);
    }
  };

  return (
    <WizardContext.Provider value={{ currentStep: step, setCurrentStep: handleSetStep, totalSteps }}>
      <div className={`w-full ${className}`}>
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <React.Fragment key={index}>
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-colors ${
                    index <= step
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {index + 1}
                </div>
                {index < totalSteps - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-colors ${
                      index < step
                        ? 'bg-blue-600'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="mb-8">{childrenArray[step]}</div>

        {/* Navigation buttons */}
        <div className="flex justify-between gap-4">
          <button
            onClick={() => handleSetStep(step - 1)}
            disabled={step === 0}
            className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={() => handleSetStep(step + 1)}
            disabled={step === totalSteps - 1}
            className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
          >
            {step === totalSteps - 1 ? 'Complete' : 'Next'}
          </button>
        </div>
      </div>
    </WizardContext.Provider>
  );
};

interface WizardStepProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export const WizardStep: React.FC<WizardStepProps> = ({
  children,
  title,
  description,
  className = '',
}) => (
  <div className={className}>
    {title && <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h2>}
    {description && (
      <p className="text-gray-600 dark:text-gray-400 mb-6">{description}</p>
    )}
    {children}
  </div>
);
