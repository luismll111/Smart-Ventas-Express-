"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard", label: "Inicio" },
  { href: "/sales", label: "Ventas" },
  { href: "/products", label: "Productos" },
  { href: "/inventory", label: "Inventario" },
  { href: "/reports", label: "Reportes" },
  { href: "/logout", label: "Cerrar Sesión" },
];

export default function Sidebar(){
  const pathname = usePathname();
  return (
    <aside className="w-56 bg-blue-800 text-white min-h-[calc(100vh-64px)] p-4">
      <div className="font-semibold mb-4">Smart Ventas Express</div>
      <nav className="space-y-1">
        {items.map(it => {
          const active = pathname === it.href;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`block rounded-md px-3 py-2 text-sm ${
                active ? "bg-white/20" : "hover:bg-white/10"
              }`}
            >
              {it.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
