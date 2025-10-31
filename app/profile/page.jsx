"use client";
import { useState, useEffect } from "react";
import LayoutShell from "../../components/LayoutShell";
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Edit, Save, X, Camera } from "lucide-react";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "Admin",
    email: "admin@smartventas.com",
    phone: "+51 999 999 999",
    location: "Lima, Perú",
    role: "Administrador",
    joined: "Enero 2024",
  });

  const [tempData, setTempData] = useState(formData);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Cargar datos desde localStorage al montar el componente
  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setFormData(parsed);
      setTempData(parsed);
    }
  }, []);

  const handleEdit = () => {
    setTempData(formData);
    setIsEditing(true);
  };

  const handleSave = () => {
    // Guardar en localStorage
    localStorage.setItem("userProfile", JSON.stringify(tempData));
    setFormData(tempData);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    
    // Disparar evento para actualizar el header
    window.dispatchEvent(new Event("profileUpdated"));
  };

  const handleCancel = () => {
    setTempData(formData);
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setTempData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = () => {
    alert("Funcionalidad de cambio de foto de perfil (demo)");
  };

  return (
    <LayoutShell>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 text-blue-600 rounded-xl p-3">
              <User className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Mi Perfil</h1>
              <p className="text-slate-600 text-sm mt-0.5">Administra tu información personal</p>
            </div>
          </div>
        </div>

        {/* Mensaje de éxito */}
        {saveSuccess && (
          <div className="rounded-lg bg-green-50 border border-green-200 text-green-800 px-4 py-3 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            ✓ Perfil actualizado correctamente
          </div>
        )}

        {/* Card principal */}
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          {/* Header del perfil */}
          <div className="relative h-32 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
            <div className="absolute -bottom-16 left-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white grid place-items-center font-bold text-5xl border-4 border-white shadow-lg">
                  {formData.name.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={handleImageUpload}
                  className="absolute bottom-2 right-2 bg-white hover:bg-slate-50 rounded-full p-2 shadow-lg transition"
                  title="Cambiar foto"
                >
                  <Camera size={16} className="text-slate-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Contenido */}
          <div className="pt-20 px-6 pb-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{formData.name}</h2>
                <p className="text-slate-600">{formData.role}</p>
              </div>
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium transition shadow-sm"
                >
                  <Edit size={16} />
                  Editar Perfil
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className="inline-flex items-center gap-2 rounded-lg border-2 border-slate-300 hover:border-slate-400 bg-white text-slate-700 px-4 py-2 text-sm font-medium transition"
                  >
                    <X size={16} />
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    className="inline-flex items-center gap-2 rounded-lg bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm font-medium transition shadow-sm"
                  >
                    <Save size={16} />
                    Guardar
                  </button>
                </div>
              )}
            </div>

            {/* Información del perfil */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <User size={16} className="text-blue-600" />
                  Nombre Completo
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={tempData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="w-full border-2 border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Ingresa tu nombre"
                  />
                ) : (
                  <p className="text-slate-900 bg-slate-50 rounded-lg px-4 py-2.5">{formData.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Mail size={16} className="text-blue-600" />
                  Correo Electrónico
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={tempData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="w-full border-2 border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="correo@ejemplo.com"
                  />
                ) : (
                  <p className="text-slate-900 bg-slate-50 rounded-lg px-4 py-2.5">{formData.email}</p>
                )}
              </div>

              {/* Teléfono */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Phone size={16} className="text-blue-600" />
                  Teléfono
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={tempData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="w-full border-2 border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="+51 999 999 999"
                  />
                ) : (
                  <p className="text-slate-900 bg-slate-50 rounded-lg px-4 py-2.5">{formData.phone}</p>
                )}
              </div>

              {/* Ubicación */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <MapPin size={16} className="text-blue-600" />
                  Ubicación
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={tempData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    className="w-full border-2 border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Ciudad, País"
                  />
                ) : (
                  <p className="text-slate-900 bg-slate-50 rounded-lg px-4 py-2.5">{formData.location}</p>
                )}
              </div>

              {/* Rol */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Briefcase size={16} className="text-blue-600" />
                  Rol
                </label>
                <p className="text-slate-900 bg-slate-50 rounded-lg px-4 py-2.5">{formData.role}</p>
              </div>

              {/* Fecha de registro */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Calendar size={16} className="text-blue-600" />
                  Miembro desde
                </label>
                <p className="text-slate-900 bg-slate-50 rounded-lg px-4 py-2.5">{formData.joined}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Ventas Realizadas</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">1,234</p>
                <p className="text-xs text-green-600 mt-1">+12% este mes</p>
              </div>
              <div className="bg-green-100 text-green-600 rounded-lg p-3">
                <Briefcase className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Productos Gestionados</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">156</p>
                <p className="text-xs text-blue-600 mt-1">8 activos</p>
              </div>
              <div className="bg-blue-100 text-blue-600 rounded-lg p-3">
                <User className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Días Activo</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">305</p>
                <p className="text-xs text-purple-600 mt-1">Desde ene 2024</p>
              </div>
              <div className="bg-purple-100 text-purple-600 rounded-lg p-3">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutShell>
  );
}
