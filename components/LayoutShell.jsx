"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Home, ShoppingCart, Package, BarChart3, Layers, LogOut, CreditCard, User, Settings, Bell, ChevronDown } from "lucide-react";

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
    <nav className="p-6">
      <div className="px-3 text-white font-semibold text-base mb-6">Smart Ventas Express</div>
      <ul className="space-y-1">
        {nav.map(({href,label,Icon})=>{
          const active = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                onClick={onClickItem}
                className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium ${
                  active ? "bg-white/20 text-white" : "text-white/90 hover:bg-white/10"
                }`}
              >
                <Icon size={18}/> {label}
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
  const [profileOpen, setProfileOpen] = useState(false);
  const [userName, setUserName] = useState("Admin");
  const [userEmail, setUserEmail] = useState("admin@smartventas.com");

  // Cargar datos del perfil desde localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setUserName(profile.name || "Admin");
      setUserEmail(profile.email || "admin@smartventas.com");
    }
  }, []);

  // Actualizar cuando cambie el perfil
  useEffect(() => {
    const handleStorageChange = () => {
      const savedProfile = localStorage.getItem("userProfile");
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        setUserName(profile.name || "Admin");
        setUserEmail(profile.email || "admin@smartventas.com");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("profileUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("profileUpdated", handleStorageChange);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-blue-600 text-white grid place-items-center font-bold text-lg">S</div>
            <span className="font-semibold text-slate-900">Smart Ventas Express</span>
          </div>
          <div className="flex items-center gap-4">
            {/* Usuario en desktop con dropdown */}
            <div className="hidden md:block relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 rounded-lg hover:bg-slate-50 px-3 py-2 transition-colors"
              >
                <div className="text-right">
                  <p className="text-xs text-slate-500">Usuario actual</p>
                  <p className="text-sm font-semibold text-slate-900">{userName}</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white grid place-items-center font-bold text-sm">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <ChevronDown
                  size={16}
                  className={`text-slate-500 transition-transform ${profileOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown menu */}
              {profileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-slate-200 bg-white shadow-lg z-50 py-2">
                    {/* Header del perfil */}
                    <div className="px-4 py-3 border-b border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white grid place-items-center font-bold text-lg">
                          {userName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900">{userName}</p>
                          <p className="text-xs text-slate-500 truncate">{userEmail}</p>
                        </div>
                      </div>
                    </div>

                    {/* Opciones del menú */}
                    <div className="py-2">
                      <Link
                        href="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors text-sm text-slate-700"
                      >
                        <User size={18} className="text-slate-500" />
                        <span>Mi Perfil</span>
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors text-sm text-slate-700"
                      >
                        <Settings size={18} className="text-slate-500" />
                        <span>Configuración</span>
                      </Link>
                      <Link
                        href="/notifications"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors text-sm text-slate-700"
                      >
                        <Bell size={18} className="text-slate-500" />
                        <span>Notificaciones</span>
                      </Link>
                    </div>

                    {/* Separador */}
                    <div className="border-t border-slate-200 my-2" />

                    {/* Cerrar sesión */}
                    <div className="px-2 pb-2">
                      <Link
                        href="/logout"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 transition-colors text-sm text-red-600 font-medium"
                      >
                        <LogOut size={18} />
                        <span>Cerrar Sesión</span>
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
            {/* Botón menú mobile */}
            <button
              className="md:hidden inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-700 hover:bg-slate-50"
              onClick={() => setOpen(v=>!v)} 
              aria-label="Abrir menu"
            >
              {open ? <X size={18}/> : <Menu size={18}/>}
              <span className="text-sm">Menú</span>
            </button>
          </div>
        </div>
      </header>

      <div className="grid md:grid-cols-[16rem_1fr]">
        <aside className="hidden md:block sticky top-[57px] h-[calc(100vh-57px)] bg-blue-800 text-white overflow-y-auto">
          <SideNav />
        </aside>
        {open && (
          <div className="md:hidden fixed inset-0 z-30 bg-black/50" onClick={()=>setOpen(false)}>
            <aside className="absolute left-0 top-0 h-full w-72 bg-blue-800" onClick={e=>e.stopPropagation()}>
              <SideNav onClickItem={()=>setOpen(false)}/>
            </aside>
          </div>
        )}
        <main className="p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}