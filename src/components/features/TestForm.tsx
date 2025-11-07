"use client";
import { z } from "zod";
import DynamicForm, { FormField } from "@/components/shared/DynamicForm";

/**
 * ============================================================================
 * EXAMPLE 1: Basic Contact Form
 * ============================================================================
 * This example demonstrates a simple contact form with text, email, and
 * textarea fields along with validation.
 */

// Define Zod validation schemas for each field
const contactFormValidations = {
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must not exceed 100 characters"),

  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),

  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must not exceed 1000 characters"),
};

// Form configuration for contact form
const contactFormConfig: FormField[] = [
  {
    name: "fullName",
    label: "Full Name",
    type: "text",
    placeholder: "John Doe",
    validation: contactFormValidations.fullName,
    required: true,
    helperText: "Please provide your full name",
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "john.doe@example.com",
    validation: contactFormValidations.email,
    required: true,
  },
  {
    name: "message",
    label: "Message",
    type: "textarea",
    placeholder: "Type your message here...",
    validation: contactFormValidations.message,
    required: true,
  },
];

// Submit handler
const handleContactSubmit = async (data: Record<string, any>) => {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to send message");
  }
};

// Component usage
export function ContactFormPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <DynamicForm
        config={contactFormConfig}
        onSubmit={handleContactSubmit}
        submitText="Send Message"
        onSuccess={() => console.log("Message sent successfully")}
      />
    </div>
  );
}

/**
 * ============================================================================
 * EXAMPLE 2: User Registration Form (Complex)
 * ============================================================================
 * This example demonstrates a more complex form with multiple field types,
 * including password validation with confirmation, select dropdowns, and
 * checkbox for terms acceptance.
 */

const registrationValidations = {
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must not exceed 20 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, underscores, and hyphens"
    ),

  email: z.string().email("Please enter a valid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),

  confirmPassword: z.string(),

  country: z.string().min(1, "Please select a country"),

  role: z.string().min(1, "Please select a role"),

  agreeToTerms: z.boolean().refine((value) => value === true, {
    message: "You must agree to the terms and conditions",
  }),

  subscribeNewsletter: z.boolean().optional(),
};

// Add password confirmation validation
const registrationSchema = z
  .object(registrationValidations)
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const registrationFormConfig: FormField[] = [
  {
    name: "username",
    label: "Username",
    type: "text",
    placeholder: "johndoe123",
    validation: registrationValidations.username,
    required: true,
    helperText: "Choose a unique username (3-20 characters)",
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "john@example.com",
    validation: registrationValidations.email,
    required: true,
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "••••••••",
    validation: registrationValidations.password,
    required: true,
    helperText: "At least 8 characters with uppercase, lowercase, and numbers",
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    placeholder: "••••••••",
    validation: registrationValidations.confirmPassword,
    required: true,
  },
  {
    name: "country",
    label: "Country",
    type: "select",
    validation: registrationValidations.country,
    required: true,
    options: [
      { value: "us", label: "United States" },
      { value: "uk", label: "United Kingdom" },
      { value: "ca", label: "Canada" },
      { value: "au", label: "Australia" },
      { value: "in", label: "India" },
    ],
  },
  {
    name: "role",
    label: "Account Type",
    type: "radio",
    validation: registrationValidations.role,
    required: true,
    options: [
      { value: "individual", label: "Individual" },
      { value: "business", label: "Business" },
      { value: "enterprise", label: "Enterprise" },
    ],
  },
  {
    name: "agreeToTerms",
    label: "I agree to the Terms and Conditions",
    type: "checkbox",
    validation: registrationValidations.agreeToTerms,
    required: true,
  },
  {
    name: "subscribeNewsletter",
    label: "Subscribe to our newsletter",
    type: "checkbox",
    validation: registrationValidations.subscribeNewsletter,
  },
];

const handleRegistrationSubmit = async (data: Record<string, any>) => {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: data.username,
      email: data.email,
      password: data.password,
      country: data.country,
      role: data.role,
      subscribeNewsletter: data.subscribeNewsletter || false,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Registration failed");
  }
};

export function RegistrationFormPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <DynamicForm
        config={registrationFormConfig}
        onSubmit={handleRegistrationSubmit}
        submitText="Create Account"
        onSuccess={() => {
          // Redirect to login or dashboard
          window.location.href = "/login";
        }}
        className="max-w-md"
      />
    </div>
  );
}

/**
 * ============================================================================
 * EXAMPLE 3: Product Form (E-commerce)
 * ============================================================================
 * This example demonstrates a form for adding/editing products with various
 * input types including file upload, color picker, date, and range slider.
 */

const productValidations = {
  productName: z
    .string()
    .min(3, "Product name must be at least 3 characters")
    .max(100, "Product name must not exceed 100 characters"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must not exceed 2000 characters"),

  price: z
    .number()
    .min(0.01, "Price must be greater than 0")
    .max(999999, "Price must be reasonable"),

  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .min(0, "Quantity cannot be negative")
    .max(10000, "Quantity is too high"),

  category: z.string().min(1, "Please select a category"),

  productImage: z.any().optional(),

  productColor: z.string().optional(),

  releaseDate: z.string().min(1, "Please select a release date"),

  discountPercent: z
    .string()
    .min(0, "Discount cannot be negative")
    .max(100, "Discount cannot exceed 100%"),

  inStock: z.boolean().optional(),
};

const productFormConfig: FormField[] = [
  {
    name: "productName",
    label: "Product Name",
    type: "text",
    placeholder: "Enter product name",
    validation: productValidations.productName,
    required: true,
    colSize: {
      desktop: 3,
      tablet: 6,
      mobile: 12,
    },
  },
  {
    name: "description",
    label: "Product Description",
    type: "textarea",
    placeholder: "Describe your product in detail",
    validation: productValidations.description,
    required: true,
    colSize: {
      desktop: 3,
      tablet: 6,
      mobile: 12,
    },
  },
  {
    colSize: {
      desktop: 3,
      tablet: 6,
      mobile: 12,
    },
    name: "category",
    label: "Category",
    type: "select",
    validation: productValidations.category,
    required: true,
    options: [
      { value: "electronics", label: "Electronics" },
      { value: "clothing", label: "Clothing" },
      { value: "furniture", label: "Furniture" },
      { value: "books", label: "Books" },
      { value: "other", label: "Other" },
    ],
  },
  {
    colSize: {
      desktop: 3,
      tablet: 6,
      mobile: 12,
    },
    name: "price",
    label: "Price ($)",
    type: "number",
    placeholder: "99.99",
    validation: productValidations.price,
    required: true,
  },
  {
    colSize: {
      desktop: 3,
      tablet: 6,
      mobile: 12,
    },
    name: "quantity",
    label: "Stock Quantity",
    type: "number",
    placeholder: "100",
    validation: productValidations.quantity,
    required: true,
  },
  {
    colSize: {
      desktop: 3,
      tablet: 6,
      mobile: 12,
    },
    name: "discountPercent",
    label: "Discount (%)",
    type: "range",
    validation: productValidations.discountPercent,
    helperText: "Slide to set discount percentage",
  },
  {
    colSize: {
      desktop: 3,
      tablet: 6,
      mobile: 12,
    },
    name: "productColor",
    label: "Product Color",
    type: "color",
    validation: productValidations.productColor,
  },
  {
    colSize: {
      desktop: 3,
      tablet: 6,
      mobile: 12,
    },
    name: "releaseDate",
    label: "Release Date",
    type: "date",
    validation: productValidations.releaseDate,
    required: true,
  },
  {
    colSize: {
      desktop: 3,
      tablet: 6,
      mobile: 12,
    },
    name: "productImage",
    label: "Product Image",
    type: "file",
    validation: productValidations.productImage,
  },
  {
    colSize: {
      desktop: 3,
      tablet: 6,
      mobile: 12,
    },
    name: "inStock",
    label: "Mark as In Stock",
    type: "checkbox",
    validation: productValidations.inStock,
  },
];

const handleProductSubmit = async (data: Record<string, any>) => {
  const formData = new FormData();

  // Append regular fields
  formData.append("productName", data.productName);
  formData.append("description", data.description);
  formData.append("category", data.category);
  formData.append("price", data.price);
  formData.append("quantity", data.quantity);
  formData.append("discountPercent", data.discountPercent);
  formData.append("productColor", data.productColor);
  formData.append("releaseDate", data.releaseDate);
  formData.append("inStock", data.inStock || false);

  // Append file if present
  if (data.productImage?.[0]) {
    formData.append("file", data.productImage[0]);
  }

  const response = await fetch("/api/products", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to create product");
  }
};

export function ProductFormPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <DynamicForm
        config={productFormConfig}
        onSubmit={handleProductSubmit}
        submitText="Create Product"
        onSuccess={() => console.log("Product created successfully")}
        className="max-w-2xl"
      />
    </div>
  );
}
