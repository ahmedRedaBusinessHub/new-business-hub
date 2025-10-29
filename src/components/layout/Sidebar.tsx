import { auth } from "@/auth";
import { getNavigationForRole } from "@/config/navigation";
import Link from "next/link";
import { AuthSession, UserRole } from "@/types/auth";

export async function Sidebar() {
  const session: AuthSession | any = await auth();
  const userRole = (session?.user?.role as UserRole) || "guest";
  const navItems = getNavigationForRole(userRole);

  return (
    <aside className="w-64 bg-[var(--color-background)] border-r border-gray-200 dark:border-gray-700 h-screen">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[var(--color-foreground)]">
            Navigation
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Role: <span className="font-semibold capitalize">{userRole}</span>
          </p>
        </div>
        <nav>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block px-4 py-3 rounded-md text-[var(--color-foreground)] hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
