"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

export default function ISOCertificationPage() {
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    certificationType: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("ISO form submitted:", formData);
    setSubmitted(true);
    setFormData({
      companyName: "",
      contactPerson: "",
      email: "",
      phone: "",
      certificationType: "",
    });
  };

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">
          Get ISO Certification
        </h1>

        <div className="max-w-4xl mx-auto space-y-12">
          <section className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">
              Why ISO Certification?
            </h2>
            <p className="text-muted-foreground">
              ISO certification demonstrates your commitment to quality, safety,
              and efficiency. It helps you meet international standards and gain
              competitive advantages in the market.
            </p>
          </section>

          <section className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Benefits</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Improved credibility and reputation</li>
              <li>Access to international markets</li>
              <li>Enhanced operational efficiency</li>
              <li>Better risk management</li>
              <li>Increased customer satisfaction</li>
            </ul>
          </section>

          <section className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6">
              Request Certification
            </h2>

            {submitted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md text-green-800">
                Thank you! We will contact you shortly to discuss your ISO
                certification needs.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  required
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input
                  id="contactPerson"
                  required
                  value={formData.contactPerson}
                  onChange={(e) =>
                    setFormData({ ...formData, contactPerson: e.target.value })
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
                <Label htmlFor="certificationType">Certification Type</Label>
                <select
                  id="certificationType"
                  required
                  value={formData.certificationType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      certificationType: e.target.value,
                    })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select a certification type</option>
                  <option value="ISO 9001">
                    ISO 9001 - Quality Management
                  </option>
                  <option value="ISO 14001">
                    ISO 14001 - Environmental Management
                  </option>
                  <option value="ISO 45001">
                    ISO 45001 - Occupational Health & Safety
                  </option>
                  <option value="ISO 27001">
                    ISO 27001 - Information Security
                  </option>
                  <option value="ISO 22000">ISO 22000 - Food Safety</option>
                </select>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Submit Request
              </Button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
