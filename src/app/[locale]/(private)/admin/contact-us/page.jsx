"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Trash2, Eye, X } from "lucide-react";

export default function AdminContactPage() {
  const [submissions, setSubmissions] = useState([
    {
      id: 1,
      name: "Ahmed Ali",
      email: "ahmed@example.com",
      phone: "+966501234567",
      message: "I'm interested in learning more about your programs.",
    },
    {
      id: 2,
      name: "Sara Mohammed",
      email: "sara@example.com",
      phone: "+966507654321",
      message: "Can you provide more details about the accelerator?",
    },
  ]);
  const [viewing, setViewing] = useState(null);

  const handleDelete = (id) => {
    if (confirm("Are you sure?")) {
      setSubmissions(submissions.filter((s) => s.id !== id));
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Contact Submissions</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Phone
              </th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub) => (
              <tr key={sub.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{sub.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{sub.email}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{sub.phone}</td>
                <td className="px-6 py-4 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewing(sub)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(sub.id)}
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Contact Details</h2>
              <button onClick={() => setViewing(null)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
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
                <p className="text-sm text-gray-500">Message</p>
                <p className="font-medium">{viewing.message}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
