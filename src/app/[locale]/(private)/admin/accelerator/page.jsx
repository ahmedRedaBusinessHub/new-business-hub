"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Trash2, Eye, X } from "lucide-react";

export default function AdminAcceleratorPage() {
  const [applications, setApplications] = useState([
    {
      id: 1,
      name: "Khalid Hassan",
      email: "khalid@example.com",
      businessName: "Smart Agri Solutions",
      industry: "Agriculture",
      stage: "Prototype",
      phone: "+966501234567",
      location: "Riyadh",
      description: "IoT-based agricultural monitoring system",
      problem: "Farmers lack real-time crop data",
      solution: "Automated sensors and mobile dashboard",
      targetMarket: "Saudi farms and agricultural companies",
    },
  ]);
  const [viewing, setViewing] = useState(null);

  const handleDelete = (id) => {
    if (confirm("Are you sure?")) {
      setApplications(applications.filter((a) => a.id !== id));
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Accelerator Applications</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Applicant
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Business
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Industry
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Stage
              </th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{app.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {app.businessName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {app.industry}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{app.stage}</td>
                <td className="px-6 py-4 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewing(app)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(app.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {viewing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Application Details</h2>
              <button onClick={() => setViewing(null)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{viewing.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{viewing.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{viewing.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{viewing.location}</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Business Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Business Name</p>
                    <p className="font-medium">{viewing.businessName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Industry</p>
                    <p className="font-medium">{viewing.industry}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Stage</p>
                    <p className="font-medium">{viewing.stage}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="font-medium">{viewing.description}</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Pitch</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Problem</p>
                    <p className="font-medium">{viewing.problem}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Solution</p>
                    <p className="font-medium">{viewing.solution}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Target Market</p>
                    <p className="font-medium">{viewing.targetMarket}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
