"use client";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  Mail,
  Rocket,
  Award,
} from "lucide-react";
import { Header } from "@/components/layout";

export default function AdminLayout({ children }) {
  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Partners", href: "/admin/partners", icon: Users },
    { name: "Projects", href: "/admin/projects", icon: FolderOpen },
    { name: "Contact Submissions", href: "/admin/contact-us", icon: Mail },
    { name: "Accelerator Apps", href: "/admin/accelerator", icon: Rocket },
    { name: "ISO Requests", href: "/admin/get-iso-certification", icon: Award },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gray-50">
        <Header />
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
