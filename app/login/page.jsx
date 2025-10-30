"use client";
import { useState } from "react";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError("Completa usuario y contraseña.");
      return;
    }
    if (form.username === "admin" && form.password === "1234") {
      setError("");
      router.push("/dashboard");
    } else {
      setError("Usuario o contraseña incorrectos.");
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-blue-500 to-indigo-600 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6 leading-tight">
          Smart Ventas <br/> Express
        </h1>

        <form className="space-y-4" onSubmit={onSubmit}>
          <label className="block">
            <span className="text-sm">Usuario</span>
            <div className="mt-1 flex items-center gap-2 rounded-xl border px-3 py-2">
              <User className="h-4 w-4 text-gray-500" />
              <input
                className="w-full outline-none"
                placeholder="admin"
                value={form.username}
                onChange={(e)=>setForm({...form, username: e.target.value})}
              />
            </div>
          </label>

          <label className="block">
            <span className="text-sm">Contraseña</span>
            <div className="mt-1 flex items-center gap-2 rounded-xl border px-3 py-2">
              <Lock className="h-4 w-4 text-gray-500" />
              <input
                type={show ? "text" : "password"}
                className="w-full outline-none"
                placeholder="1234"
                value={form.password}
                onChange={(e)=>setForm({...form, password: e.target.value})}
              />
              <button type="button" onClick={()=>setShow(s=>!s)} className="text-gray-500" aria-label="Mostrar/ocultar">
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>

        {error && <div className="text-sm text-red-600">{error}</div>}

          <button type="submit" className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-2.5 font-semibold">
            Iniciar sesión
          </button>

          <div className="text-center text-xs text-gray-500">
            ¿Olvidaste tu contraseña? <a className="text-blue-600" href="#">Recupérala aquí</a>
          </div>
        </form>
      </div>
    </div>
  );
}
