"use client";
import { useState, useEffect } from "react";
import LayoutShell from "../../components/LayoutShell";
import { Settings, Bell, Shield, Palette, Database, Globe, Save } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sales: true,
      inventory: false,
      payments: true,
    },
    appearance: {
      theme: "light",
      language: "es",
    },
    security: {
      twoFactor: false,
      sessionTimeout: 30,
    },
  });

  const [saved, setSaved] = useState(false);

  // Cargar settings desde localStorage al montar
  useEffect(() => {
    const savedSettings = localStorage.getItem("appSettings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Aplicar tema al documento
  useEffect(() => {
    if (settings.appearance.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settings.appearance.theme]);

  const handleToggle = (category, key) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !prev[category][key],
      },
    }));
  };

  const handleChange = (category, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const handleSave = () => {
    // Guardar en localStorage
    localStorage.setItem("appSettings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <LayoutShell>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 text-purple-600 rounded-xl p-3">
              <Settings className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Configuración</h1>
              <p className="text-slate-600 text-sm mt-0.5">Personaliza tu experiencia</p>
            </div>
          </div>
        </div>

        {/* Mensaje de guardado */}
        {saved && (
          <div className="rounded-lg bg-green-50 border border-green-200 text-green-800 px-4 py-3 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            ✓ Configuración guardada correctamente
          </div>
        )}

        {/* Notificaciones */}
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 text-white rounded-lg p-2">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Notificaciones</h2>
                <p className="text-sm text-slate-600">Configura cómo deseas recibir actualizaciones</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* Email toggle */}
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <p className="font-medium text-slate-900">Notificaciones por Email</p>
                <p className="text-sm text-slate-600">Recibe correos con actualizaciones importantes</p>
              </div>
              <button
                onClick={() => handleToggle("notifications", "email")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  settings.notifications.email ? "bg-blue-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    settings.notifications.email ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Push toggle */}
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <p className="font-medium text-slate-900">Notificaciones Push</p>
                <p className="text-sm text-slate-600">Alertas en tiempo real en el navegador</p>
              </div>
              <button
                onClick={() => handleToggle("notifications", "push")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  settings.notifications.push ? "bg-blue-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    settings.notifications.push ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Categorías específicas */}
            <div className="pt-2">
              <p className="text-sm font-semibold text-slate-700 mb-3">Notificar sobre:</p>
              <div className="space-y-2">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.notifications.sales}
                    onChange={() => handleToggle("notifications", "sales")}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-slate-900">Nuevas ventas</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.notifications.inventory}
                    onChange={() => handleToggle("notifications", "inventory")}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-slate-900">Alertas de inventario</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.notifications.payments}
                    onChange={() => handleToggle("notifications", "payments")}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-slate-900">Confirmación de pagos</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Apariencia */}
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-b px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-600 text-white rounded-lg p-2">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Apariencia</h2>
                <p className="text-sm text-slate-600">Personaliza el tema y el idioma</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* Theme */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <Palette size={16} className="text-purple-600" />
                Tema
              </label>
              <select
                value={settings.appearance.theme}
                onChange={(e) => handleChange("appearance", "theme", e.target.value)}
                className="w-full border-2 border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              >
                <option value="light">Claro</option>
                <option value="dark">Oscuro</option>
                <option value="auto">Automático</option>
              </select>
            </div>

            {/* Language */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <Globe size={16} className="text-purple-600" />
                Idioma
              </label>
              <select
                value={settings.appearance.language}
                onChange={(e) => handleChange("appearance", "language", e.target.value)}
                className="w-full border-2 border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>

        {/* Seguridad */}
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-b px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="bg-red-600 text-white rounded-lg p-2">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Seguridad</h2>
                <p className="text-sm text-slate-600">Protege tu cuenta</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* 2FA */}
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <p className="font-medium text-slate-900">Autenticación de Dos Factores</p>
                <p className="text-sm text-slate-600">Añade una capa extra de seguridad</p>
              </div>
              <button
                onClick={() => handleToggle("security", "twoFactor")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  settings.security.twoFactor ? "bg-green-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    settings.security.twoFactor ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Session timeout */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <Shield size={16} className="text-red-600" />
                Tiempo de Sesión
              </label>
              <select
                value={settings.security.sessionTimeout}
                onChange={(e) => handleChange("security", "sessionTimeout", parseInt(e.target.value))}
                className="w-full border-2 border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
              >
                <option value={15}>15 minutos</option>
                <option value={30}>30 minutos</option>
                <option value={60}>1 hora</option>
                <option value={120}>2 horas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sistema */}
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-zinc-50 border-b px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="bg-slate-600 text-white rounded-lg p-2">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Sistema</h2>
                <p className="text-sm text-slate-600">Información de la aplicación</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-sm text-slate-600">Versión</span>
              <span className="text-sm font-medium text-slate-900">1.0.0</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-sm text-slate-600">Última actualización</span>
              <span className="text-sm font-medium text-slate-900">30 Oct 2025</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm text-slate-600">Datos almacenados</span>
              <button
                onClick={() => {
                  if (confirm("¿Seguro que deseas limpiar todos los datos locales?")) {
                    localStorage.clear();
                    alert("Datos limpiados. Recarga la página para aplicar cambios.");
                  }
                }}
                className="text-sm font-medium text-red-600 hover:text-red-700"
              >
                Limpiar datos locales
              </button>
            </div>
          </div>
        </div>

        {/* Botón guardar */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-sm font-medium transition shadow-lg hover:shadow-xl"
          >
            <Save size={18} />
            Guardar Cambios
          </button>
        </div>
      </div>
    </LayoutShell>
  );
}
