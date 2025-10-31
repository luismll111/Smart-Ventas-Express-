"use client";
import { useState } from "react";
import { Eye, EyeOff, Lock, User, LogIn, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!form.username || !form.password) {
      setError("Por favor completa todos los campos.");
      return;
    }
    
    setLoading(true);
    
    // Simulamos una petición async
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (form.username === "admin" && form.password === "1234") {
      router.push("/dashboard");
    } else {
      setError("Usuario o contraseña incorrectos.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Panel izquierdo - Branding */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white p-12 relative overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-300 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="rounded-2xl bg-white/20 backdrop-blur p-3">
              <ShoppingBag size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Smart Ventas</h1>
              <p className="text-blue-100 text-lg">Express</p>
            </div>
          </div>
          
          <p className="text-xl text-blue-50 leading-relaxed mb-6">
            Gestiona tus ventas, inventario y pagos de forma rápida y eficiente.
          </p>
          
          <div className="space-y-4 text-blue-100">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-300"></div>
              <span>Control de inventario en tiempo real</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-300"></div>
              <span>Generación automática de comprobantes</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-300"></div>
              <span>Reportes y estadísticas detalladas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Panel derecho - Formulario */}
      <div className="flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Logo móvil */}
          <div className="lg:hidden flex items-center gap-3 justify-center mb-8">
            <div className="rounded-xl bg-blue-600 p-2">
              <ShoppingBag size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Smart Ventas Express</h1>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Bienvenido de vuelta</h2>
              <p className="text-sm text-slate-600">Ingresa tus credenciales para continuar</p>
            </div>

            <form className="space-y-5" onSubmit={onSubmit}>
              <label className="block">
                <span className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-2">
                  <User size={16} />
                  Usuario
                </span>
                <div className="relative">
                  <input
                    className="w-full rounded-lg border border-slate-300 pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="admin"
                    value={form.username}
                    onChange={(e)=>setForm({...form, username: e.target.value})}
                    disabled={loading}
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                </div>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-2">
                  <Lock size={16} />
                  Contraseña
                </span>
                <div className="relative">
                  <input
                    type={show ? "text" : "password"}
                    className="w-full rounded-lg border border-slate-300 pl-10 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e)=>setForm({...form, password: e.target.value})}
                    disabled={loading}
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <button 
                    type="button" 
                    onClick={()=>setShow(s=>!s)} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition" 
                    aria-label="Mostrar/ocultar contraseña"
                    disabled={loading}
                  >
                    {show ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </label>

              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 font-semibold transition shadow-sm hover:shadow-md flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Verificando...
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    Iniciar sesión
                  </>
                )}
              </button>

              <div className="text-center">
                <a className="text-sm text-blue-600 hover:text-blue-700 font-medium" href="#">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-200">
              <p className="text-xs text-center text-slate-500">
                Credenciales demo: <span className="font-mono font-semibold text-slate-700">admin</span> / <span className="font-mono font-semibold text-slate-700">1234</span>
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-slate-500 mt-6">
            © 2025 Smart Ventas Express. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
