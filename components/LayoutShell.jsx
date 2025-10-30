"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Home, ShoppingCart, Package, BarChart3, Layers, LogOut, CreditCard } from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Inicio", Icon: Home },
  { href: "/sales", label: "Ventas", Icon: ShoppingCart },
  { href: "/products", label: "Productos", Icon: Package },
  { href: "/inventory", label: "Inventario", Icon: Layers },
  { href: "/reports", label: "Reportes", Icon: BarChart3 },
  { href: "/payments", label: "Registro de pago", Icon: CreditCard },
  { href: "/logout", label: "Cerrar Sesion", Icon: LogOut },
];

function SideNav({ onClickItem }) {
  const pathname = usePathname();
  return (
    <nav className="p-4">
      <div className="px-3 text-white/90 font-semibold mb-4 tracking-wide">Smart Ventas Express</div>
      <ul className="space-y-1">
        {nav.map(({href,label,Icon})=>{
          const active = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                onClick={onClickItem}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition
                ${active ? "bg-white/20 text-white" : "text-white/90 hover:bg-white/10"}`}
              >
                <Icon size={16}/> {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default function LayoutShell({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-blue-600 text-white grid place-items-center font-bold">S</div>
            <span className="font-semibold">Bienvenido a Smart Ventas Express</span>
          </div>
          <button
            className="md:hidden inline-flex items-center gap-2 rounded-lg border px-3 py-1.5"
            onClick={() => setOpen(v=>!v)} aria-label="Abrir menu"
          >
            {open ? <X size={18}/> : <Menu size={18}/>} Menu
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl grid md:grid-cols-[15rem_1fr] gap-0">
        <aside className="hidden md:block sticky top-16 h-[calc(100vh-4rem)] bg-blue-800/95 text-white">
          <SideNav />
        </aside>
        {open && (
          <div className="md:hidden fixed inset-0 z-30 bg-black/40" onClick={()=>setOpen(false)}>
            <aside className="absolute left-0 top-0 h-full w-72 bg-blue-800 shadow-xl" onClick={e=>e.stopPropagation()}>
              <SideNav onClickItem={()=>setOpen(false)}/>
            </aside>
          </div>
        )}
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}