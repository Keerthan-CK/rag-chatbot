import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Documents", href: "/dashboard/documents" },
  { name: "Chat", href: "/dashboard/chat" },
  { name: "Settings", href: "/dashboard/settings" },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-800 flex flex-col p-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">R.A.G Bot</h1>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={() => console.log("TODO: supabase.auth.signOut()")}
          className="px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 transition-colors text-sm font-medium"
        >
          Log out
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
