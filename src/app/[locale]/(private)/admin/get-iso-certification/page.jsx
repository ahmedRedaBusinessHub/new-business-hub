"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Trash2, Eye, X } from "lucide-react";

export default function AdminISOPage() {
  const [requests, setRequests] = useState([
    {
      id: 1,
      companyName: "Tech Solutions Saudi",
      contactPerson: "Fahad Abdullah",
      email: "fahad@techsolutions.sa",
      phone: "+966501234567",
      certificationType: "ISO 9001",
    },
  ]);
  const [viewing, setViewing] = useState(null);

  const handleDelete = (id) => {
    if (confirm("Are you sure?")) {
      setRequests(requests.filter((r) => r.id !== id));
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">ISO Certification Requests</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Company
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Contact Person
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Certification Type
              </th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{req.companyName}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {req.contactPerson}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {req.certificationType}
                </td>
                <td className="px-6 py-4 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewing(req)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(req.id)}
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
              <h2 className="text-2xl font-bold">ISO Request Details</h2>
              <button onClick={() => setViewing(null)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Company Name</p>
                <p className="font-medium">{viewing.companyName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Contact Person</p>
                <p className="font-medium">{viewing.contactPerson}</p>
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
                <p className="text-sm text-gray-500">Certification Type</p>
                <p className="font-medium">{viewing.certificationType}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
