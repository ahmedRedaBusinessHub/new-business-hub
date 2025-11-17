"use client";
// ============================================================================
// Example Usage: Complete DynamicForm with All Field Types
// ============================================================================

import DynamicForm from "@/components/shared/DynamicForm";
import { z } from "zod";

// ============================================================================
// Example 1: Simple Contact Form
// ============================================================================
export const SimpleContactForm = () => {
  const contactConfig = [
    {
      name: "fullName",
      label: "Full Name",
      type: "text" as const,
      placeholder: "Enter your full name",
      validation: z.string().min(2, "Name must be at least 2 characters"),
      required: true,
      colSize: { desktop: 6, tablet: 6, mobile: 12 },
    },
    {
      name: "email",
      label: "Email Address",
      type: "email" as const,
      placeholder: "your.email@example.com",
      validation: z.string().email("Invalid email address"),
      required: true,
      colSize: { desktop: 6, tablet: 6, mobile: 12 },
    },
    {
      name: "phone",
      label: "Phone Number",
      type: "tel" as const,
      placeholder: "+1 (555) 000-0000",
      validation: z.string().optional(),
      colSize: { desktop: 12, tablet: 12, mobile: 12 },
    },
    {
      name: "message",
      label: "Message",
      type: "textarea" as const,
      placeholder: "Tell us how we can help you...",
      validation: z.string().min(10, "Message must be at least 10 characters"),
      required: true,
      helperText: "Minimum 10 characters",
      colSize: { desktop: 12, tablet: 12, mobile: 12 },
    },
  ];

  const handleSubmit = async (data: any) => {
    console.log("Contact form data:", data);
    // API call here
  };

  return (
    <DynamicForm
      config={contactConfig}
      onSubmit={handleSubmit}
      submitText="Send Message"
    />
  );
};

// ============================================================================
// Example 2: Advanced User Profile Form (All Field Types)
// ============================================================================
export const AdvancedProfileForm = () => {
  const profileConfig = [
    // ========== Personal Information Section ==========
    {
      name: "personalInfo",
      label: "Personal Information",
      type: "section" as const,
      validation: z.any(),
      collapsible: true,
      defaultOpen: true,
      fields: [
        {
          name: "firstName",
          label: "First Name",
          type: "text" as const,
          placeholder: "John",
          validation: z.string().min(2),
          required: true,
          colSize: { desktop: 6, tablet: 6, mobile: 12 },
        },
        {
          name: "lastName",
          label: "Last Name",
          type: "text" as const,
          placeholder: "Doe",
          validation: z.string().min(2),
          required: true,
          colSize: { desktop: 6, tablet: 6, mobile: 12 },
        },
        {
          name: "email",
          label: "Email",
          type: "email" as const,
          placeholder: "john.doe@example.com",
          validation: z.string().email(),
          required: true,
          colSize: { desktop: 6, tablet: 12, mobile: 12 },
          tooltip: "We'll never share your email with anyone else.",
        },
        {
          name: "phone",
          label: "Phone",
          type: "tel" as const,
          placeholder: "+1 234 567 8900",
          validation: z.string().optional(),
          colSize: { desktop: 6, tablet: 12, mobile: 12 },
        },
        {
          name: "birthDate",
          label: "Date of Birth",
          type: "date" as const,
          validation: z.string(),
          required: true,
          colSize: { desktop: 6, tablet: 12, mobile: 12 },
        },
        {
          name: "gender",
          label: "Gender",
          type: "select" as const,
          placeholder: "Select gender",
          options: [
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
            { value: "other", label: "Other" },
            { value: "prefer-not-to-say", label: "Prefer not to say" },
          ],
          validation: z.string(),
          colSize: { desktop: 6, tablet: 12, mobile: 12 },
        },
      ],
    },

    // ========== Address Section ==========
    {
      name: "addressInfo",
      label: "Address Information",
      type: "section" as const,
      validation: z.any(),
      collapsible: true,
      defaultOpen: false,
      fields: [
        {
          name: "address",
          label: "Street Address",
          type: "text" as const,
          placeholder: "123 Main St",
          validation: z.string(),
          colSize: { desktop: 12, tablet: 12, mobile: 12 },
        },
        {
          name: "city",
          label: "City",
          type: "text" as const,
          placeholder: "New York",
          validation: z.string(),
          colSize: { desktop: 4, tablet: 6, mobile: 12 },
        },
        {
          name: "state",
          label: "State",
          type: "text" as const,
          placeholder: "NY",
          validation: z.string(),
          colSize: { desktop: 4, tablet: 6, mobile: 12 },
        },
        {
          name: "zipCode",
          label: "ZIP Code",
          type: "text" as const,
          placeholder: "10001",
          validation: z.string(),
          colSize: { desktop: 4, tablet: 12, mobile: 12 },
        },
        {
          name: "location",
          label: "Location on Map",
          type: "map" as const,
          validation: z
            .object({
              lat: z.number(),
              lng: z.number(),
            })
            .optional(),
          colSize: { desktop: 12, tablet: 12, mobile: 12 },
          helperText: "Pin your exact location",
        },
      ],
    },

    // ========== Professional Details ==========
    {
      name: "professionalInfo",
      label: "Professional Details",
      type: "section" as const,
      validation: z.any(),
      fields: [
        {
          name: "occupation",
          label: "Occupation",
          type: "text" as const,
          placeholder: "Software Engineer",
          validation: z.string(),
          colSize: { desktop: 6, tablet: 12, mobile: 12 },
        },
        {
          name: "experience",
          label: "Years of Experience",
          type: "slider" as const,
          min: 0,
          max: 50,
          step: 1,
          validation: z.number().min(0).max(50),
          colSize: { desktop: 6, tablet: 12, mobile: 12 },
          helperText: "Slide to select years",
        },
        {
          name: "skills",
          label: "Skills",
          type: "tags" as const,
          placeholder: "Add skills...",
          validation: z.array(z.string()).optional(),
          colSize: { desktop: 12, tablet: 12, mobile: 12 },
          helperText: "Press Enter to add a skill",
        },
        {
          name: "bio",
          label: "Professional Bio",
          type: "richtext" as const,
          placeholder: "Tell us about yourself...",
          validation: z.string().optional(),
          colSize: { desktop: 12, tablet: 12, mobile: 12 },
        },
      ],
    },

    // ========== Preferences ==========
    {
      name: "preferences",
      label: "Preferences & Settings",
      type: "section" as const,
      validation: z.any(),
      collapsible: true,
      fields: [
        {
          name: "theme",
          label: "Preferred Theme",
          type: "radio" as const,
          options: [
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
            { value: "auto", label: "Auto" },
          ],
          validation: z.string(),
          colSize: { desktop: 12, tablet: 12, mobile: 12 },
        },
        {
          name: "notifications",
          label: "Enable Notifications",
          type: "switch" as const,
          validation: z.boolean().optional(),
          colSize: { desktop: 6, tablet: 12, mobile: 12 },
        },
        {
          name: "newsletter",
          label: "Subscribe to Newsletter",
          type: "checkbox" as const,
          validation: z.boolean().optional(),
          colSize: { desktop: 6, tablet: 12, mobile: 12 },
        },
        {
          name: "favoriteColor",
          label: "Favorite Color",
          type: "color" as const,
          validation: z.string().optional(),
          colSize: { desktop: 6, tablet: 12, mobile: 12 },
        },
        {
          name: "rating",
          label: "Rate Your Experience",
          type: "rating" as const,
          maxRating: 5,
          validation: z.number().min(1).max(5).optional(),
          colSize: { desktop: 6, tablet: 12, mobile: 12 },
        },
      ],
    },

    // ========== Media Uploads ==========
    {
      name: "mediaSection",
      label: "Profile Media",
      type: "section" as const,
      validation: z.any(),
      fields: [
        {
          name: "profilePicture",
          label: "Profile Picture",
          type: "imageuploader" as const,
          validation: z.any().optional(),
          colSize: { desktop: 6, tablet: 12, mobile: 12 },
          helperText: "Upload a profile picture (JPG, PNG)",
        },
        {
          name: "documents",
          label: "Documents",
          type: "fileuploader" as const,
          accept: ".pdf,.doc,.docx",
          multiple: true,
          validation: z.any().optional(),
          colSize: { desktop: 6, tablet: 12, mobile: 12 },
          helperText: "Upload resume, certificates, etc.",
        },
      ],
    },
  ];

  const handleSubmit = async (data: any) => {
    console.log("Advanced profile form data:", data);
    // API call here
  };

  return (
    <DynamicForm
      config={profileConfig}
      onSubmit={handleSubmit}
      submitText="Save Profile"
      layout="single"
      showProgress={false}
    />
  );
};

// ============================================================================
// Example 3: Multi-Step Wizard Form
// ============================================================================
export const WizardForm = () => {
  const wizardConfig = [
    {
      name: "step1",
      label: "Step 1: Basic Info",
      type: "section" as const,
      validation: z.any(),
      fields: [
        {
          name: "companyName",
          label: "Company Name",
          type: "text" as const,
          placeholder: "Acme Corp",
          validation: z.string().min(2),
          required: true,
          colSize: { desktop: 12, tablet: 12, mobile: 12 },
        },
        {
          name: "industry",
          label: "Industry",
          type: "select" as const,
          options: [
            { value: "tech", label: "Technology" },
            { value: "finance", label: "Finance" },
            { value: "healthcare", label: "Healthcare" },
            { value: "retail", label: "Retail" },
          ],
          validation: z.string(),
          required: true,
          colSize: { desktop: 12, tablet: 12, mobile: 12 },
        },
      ],
    },
    {
      name: "step2",
      label: "Step 2: Contact Details",
      type: "section" as const,
      validation: z.any(),
      fields: [
        {
          name: "contactEmail",
          label: "Contact Email",
          type: "email" as const,
          validation: z.string().email(),
          required: true,
          colSize: { desktop: 12, tablet: 12, mobile: 12 },
        },
        {
          name: "contactPhone",
          label: "Contact Phone",
          type: "tel" as const,
          validation: z.string(),
          colSize: { desktop: 12, tablet: 12, mobile: 12 },
        },
      ],
    },
    {
      name: "step3",
      label: "Step 3: Review & Submit",
      type: "section" as const,
      validation: z.any(),
      fields: [
        {
          name: "terms",
          label: "I agree to the terms and conditions",
          type: "checkbox" as const,
          validation: z.boolean().refine((val) => val === true, {
            message: "You must accept the terms and conditions",
          }),
          required: true,
          colSize: { desktop: 12, tablet: 12, mobile: 12 },
        },
      ],
    },
  ];

  const handleSubmit = async (data: any) => {
    console.log("Wizard form data:", data);
  };

  return (
    <DynamicForm
      config={wizardConfig}
      onSubmit={handleSubmit}
      submitText="Complete Registration"
      layout="wizard"
      showProgress={true}
    />
  );
};

// ============================================================================
// Example 4: Tabbed Form Layout
// ============================================================================
export const TabbedForm = () => {
  const tabbedConfig = [
    {
      name: "accountTab",
      label: "Account",
      type: "section" as const,
      validation: z.any(),
      fields: [
        {
          name: "username",
          label: "Username",
          type: "text" as const,
          validation: z.string().min(3),
          required: true,
          colSize: { desktop: 12, tablet: 12, mobile: 12 },
        },
        {
          name: "password",
          label: "Password",
          type: "password" as const,
          validation: z.string().min(8),
          required: true,
          colSize: { desktop: 12, tablet: 12, mobile: 12 },
        },
      ],
    },
    {
      name: "profileTab",
      label: "Profile",
      type: "section" as const,
      validation: z.any(),
      fields: [
        {
          name: "displayName",
          label: "Display Name",
          type: "text" as const,
          validation: z.string(),
          colSize: { desktop: 12, tablet: 12, mobile: 12 },
        },
        {
          name: "avatar",
          label: "Avatar",
          type: "imageuploader" as const,
          validation: z.any().optional(),
          colSize: { desktop: 12, tablet: 12, mobile: 12 },
        },
      ],
    },
    {
      name: "settingsTab",
      label: "Settings",
      type: "section" as const,
      validation: z.any(),
      fields: [
        {
          name: "language",
          label: "Language",
          type: "select" as const,
          options: [
            { value: "en", label: "English" },
            { value: "ar", label: "Arabic" },
            { value: "fr", label: "French" },
          ],
          validation: z.string(),
          colSize: { desktop: 12, tablet: 12, mobile: 12 },
        },
      ],
    },
  ];

  const handleSubmit = async (data: any) => {
    console.log("Tabbed form data:", data);
  };

  return (
    <DynamicForm
      config={tabbedConfig}
      onSubmit={handleSubmit}
      submitText="Save All"
      layout="tabs"
    />
  );
};

// ============================================================================
// Example 5: Conditional Fields
// ============================================================================
export const ConditionalForm = () => {
  const conditionalConfig = [
    {
      name: "userType",
      label: "I am a",
      type: "select" as const,
      options: [
        { value: "individual", label: "Individual" },
        { value: "business", label: "Business" },
      ],
      validation: z.string(),
      required: true,
      colSize: { desktop: 12, tablet: 12, mobile: 12 },
    },
    // This field only shows if userType is "business"
    {
      name: "companyName",
      label: "Company Name",
      type: "text" as const,
      validation: z.string().optional(),
      colSize: { desktop: 12, tablet: 12, mobile: 12 },
      dependsOn: "userType",
      showWhen: (value) => value === "business",
    },
    // This field only shows if userType is "business"
    {
      name: "taxId",
      label: "Tax ID",
      type: "text" as const,
      validation: z.string().optional(),
      colSize: { desktop: 12, tablet: 12, mobile: 12 },
      dependsOn: "userType",
      showWhen: (value) => value === "business",
    },
  ];

  const handleSubmit = async (data: any) => {
    console.log("Conditional form data:", data);
  };

  return (
    <DynamicForm
      config={conditionalConfig}
      onSubmit={handleSubmit}
      submitText="Submit"
    />
  );
};
