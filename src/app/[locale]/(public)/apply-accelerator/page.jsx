"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";

export default function ApplyAcceleratorPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1
    name: "",
    email: "",
    phone: "",
    location: "",
    // Step 2
    businessName: "",
    industry: "",
    stage: "",
    description: "",
    // Step 3
    problem: "",
    solution: "",
    targetMarket: "",
  });

  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Accelerator application submitted:", formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="py-20">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <div className="bg-green-50 p-12 rounded-lg">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Application Submitted!</h1>
            <p className="text-muted-foreground mb-6">
              Thank you for applying to our accelerator program. We will review
              your application and get back to you within 2 weeks.
            </p>
            <Button onClick={() => (window.location.href = "/")}>
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold text-center mb-12">
          Apply for Accelerator Program
        </h1>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-12">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  num <= step
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {num}
              </div>
              {num < 4 && (
                <div
                  className={`w-16 h-1 ${
                    num < step ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-md"
        >
          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-6">
                Personal Information
              </h2>
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  required
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          {/* Step 2: Business Info */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-6">
                Business Information
              </h2>
              <div>
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  required
                  value={formData.businessName}
                  onChange={(e) =>
                    setFormData({ ...formData, businessName: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="industry">Industry</Label>
                <select
                  id="industry"
                  required
                  value={formData.industry}
                  onChange={(e) =>
                    setFormData({ ...formData, industry: e.target.value })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select industry</option>
                  <option value="Technology">Technology</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Education">Education</option>
                  <option value="Finance">Finance</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <Label htmlFor="stage">Business Stage</Label>
                <select
                  id="stage"
                  required
                  value={formData.stage}
                  onChange={(e) =>
                    setFormData({ ...formData, stage: e.target.value })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select stage</option>
                  <option value="Idea">Idea Stage</option>
                  <option value="Prototype">Prototype</option>
                  <option value="MVP">MVP</option>
                  <option value="Early Revenue">Early Revenue</option>
                  <option value="Growth">Growth Stage</option>
                </select>
              </div>
              <div>
                <Label htmlFor="description">Business Description</Label>
                <Textarea
                  id="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          {/* Step 3: Pitch */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-6">Your Pitch</h2>
              <div>
                <Label htmlFor="problem">Problem Statement</Label>
                <Textarea
                  id="problem"
                  required
                  rows={4}
                  placeholder="What problem are you solving?"
                  value={formData.problem}
                  onChange={(e) =>
                    setFormData({ ...formData, problem: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="solution">Your Solution</Label>
                <Textarea
                  id="solution"
                  required
                  rows={4}
                  placeholder="How does your product/service solve this problem?"
                  value={formData.solution}
                  onChange={(e) =>
                    setFormData({ ...formData, solution: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="targetMarket">Target Market</Label>
                <Textarea
                  id="targetMarket"
                  required
                  rows={4}
                  placeholder="Who are your customers?"
                  value={formData.targetMarket}
                  onChange={(e) =>
                    setFormData({ ...formData, targetMarket: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          {/* Step 4: Documents */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-6">Documents</h2>
              <div>
                <Label htmlFor="businessPlan">Business Plan (Optional)</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <input
                    type="file"
                    id="businessPlan"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                  />
                  <label htmlFor="businessPlan" className="cursor-pointer">
                    <div className="text-gray-500">
                      <p className="font-medium">
                        Click to upload business plan
                      </p>
                      <p className="text-sm">PDF, DOC, DOCX up to 10MB</p>
                    </div>
                  </label>
                </div>
              </div>
              <div>
                <Label htmlFor="pitchDeck">Pitch Deck (Optional)</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <input
                    type="file"
                    id="pitchDeck"
                    className="hidden"
                    accept=".pdf,.ppt,.pptx"
                  />
                  <label htmlFor="pitchDeck" className="cursor-pointer">
                    <div className="text-gray-500">
                      <p className="font-medium">Click to upload pitch deck</p>
                      <p className="text-sm">PDF, PPT, PPTX up to 10MB</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={handlePrev}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
            )}
            {step < 4 && (
              <Button type="button" onClick={handleNext} className="ml-auto">
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
            {step === 4 && (
              <Button type="submit" className="ml-auto">
                Submit Application
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
