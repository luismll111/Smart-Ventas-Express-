"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, CheckCircle, ArrowLeft, Home } from "lucide-react";

export default function Logout(){
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      router.push("/login");
    }
  }, [countdown, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
          {/* Icono animado */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6 animate-bounce">
            <CheckCircle className="text-green-600" size={40} />
          </div>

          {/* Título */}
          <h1 className="text-2xl font-bold text-slate-900 mb-3">
            Sesión cerrada correctamente
          </h1>

          {/* Descripción */}
          <p className="text-slate-600 mb-6">
            Has cerrado sesión de forma segura. Gracias por usar Smart Ventas Express.
          </p>

          {/* Contador */}
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 mb-6">
            <p className="text-sm text-blue-800 mb-2">
              Serás redirigido al login en
            </p>
            <div className="text-4xl font-bold text-blue-600">
              {countdown}
            </div>
            <p className="text-xs text-blue-600 mt-2">segundos</p>
          </div>

          {/* Botones de acción */}
          <div className="space-y-3">
            <Link 
              href="/login" 
              className="flex items-center justify-center gap-2 w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white py-3 font-semibold transition shadow-sm hover:shadow-md"
            >
              <ArrowLeft size={18} />
              Volver al login ahora
            </Link>

            <Link 
              href="/dashboard" 
              className="flex items-center justify-center gap-2 w-full rounded-lg border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 py-3 font-semibold transition"
            >
              <Home size={18} />
              Ir al inicio
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-center gap-2 text-slate-500">
              <LogOut size={16} />
              <span className="text-xs">Tu sesión ha sido cerrada de forma segura</span>
            </div>
          </div>
        </div>

        {/* Info adicional */}
        <p className="text-center text-xs text-slate-500 mt-6">
          © 2025 Smart Ventas Express. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
