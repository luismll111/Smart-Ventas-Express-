"use client";
import { useState, useMemo } from "react";
import LayoutShell from "../../components/LayoutShell";
import { 
  Search, 
  Plus, 
  Package, 
  DollarSign, 
  CheckCircle, 
  XCircle,
  Edit,
  Trash2,
  Download,
  Filter
} from "lucide-react";

const money = (n) => `S/ ${Number(n || 0).toFixed(2)}`;

// Datos demo (hasta conectar con Supabase real)
const DEMO_PRODUCTS = [
  { id: 1, code: "PROD001", name: "Camisas Polo Estampadas M/Corta", brand: "VARIOS", unit: "UNIDAD", price: 45.00, is_active: true },
  { id: 2, code: "PROD002", name: "Casacas Koozo", brand: "KOOZO", unit: "UNIDAD", price: 120.00, is_active: true },
  { id: 3, code: "PROD003", name: "Camisas Jean Polo M/Corta Baggini", brand: "BAGGINI", unit: "UNIDAD", price: 65.00, is_active: true },
  { id: 4, code: "PROD004", name: "Casacas Jhon Holden Drill", brand: "JHON HOLDEN", unit: "UNIDAD", price: 180.00, is_active: true },
  { id: 5, code: "PROD005", name: "Bermudas Drill Nacional 05S Thomas", brand: "THOMAS", unit: "UNIDAD", price: 55.00, is_active: true },
  { id: 6, code: "PROD006", name: "Polos Oferta Dama", brand: "VARIOS", unit: "UNIDAD", price: 25.00, is_active: true },
  { id: 7, code: "PROD007", name: "Polos Oferta Varón", brand: "VARIOS", unit: "UNIDAD", price: 25.00, is_active: true },
  { id: 8, code: "PROD008", name: "Correas Donatelli, Massimo Ferris", brand: "DONATELLI", unit: "UNIDAD", price: 35.00, is_active: true },
  { id: 9, code: "PROD009", name: "Zapatillas Runner XR", brand: "RUNNER", unit: "PAR", price: 150.00, is_active: true },
  { id: 10, code: "PROD010", name: "Mochila Urbana 25L", brand: "VARIOS", unit: "UNIDAD", price: 80.00, is_active: false },
  { id: 11, code: "PROD011", name: "Pantalones Jean Slim Fit", brand: "DENIM", unit: "UNIDAD", price: 95.00, is_active: true },
  { id: 12, code: "PROD012", name: "Chompas Tejidas Lana", brand: "WOOL", unit: "UNIDAD", price: 110.00, is_active: false },
];

export default function ProductsPage() {
  const [rows] = useState(DEMO_PRODUCTS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("TODOS");

  // Filtrado
  const filteredRows = useMemo(() => {
    return rows.filter(r => {
      const matchSearch = search.trim() === "" || 
        r.code.toLowerCase().includes(search.toLowerCase()) ||
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.brand.toLowerCase().includes(search.toLowerCase());
      
      const matchStatus = filterStatus === "TODOS" || 
        (filterStatus === "ACTIVO" && r.is_active) ||
        (filterStatus === "INACTIVO" && !r.is_active);
      
      return matchSearch && matchStatus;
    });
  }, [rows, search, filterStatus]);

  // Estadísticas
  const stats = useMemo(() => {
    const total = rows.length;
    const activos = rows.filter(r => r.is_active).length;
    const inactivos = rows.filter(r => !r.is_active).length;
    const precioPromedio = rows.reduce((sum, r) => sum + r.price, 0) / total;
    return { total, activos, inactivos, precioPromedio };
  }, [rows]);

  const exportCSV = () => {
    const headers = ["Código", "Nombre", "Marca", "Unidad", "Precio", "Estado"];
    const csvRows = [headers.join(",")];
    filteredRows.forEach(r => {
      csvRows.push([
        r.code,
        `"${r.name.replaceAll('"', '""')}"`,
        r.brand,
        r.unit,
        r.price,
        r.is_active ? "Activo" : "Inactivo"
      ].join(","));
    });
    const csv = csvRows.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `productos_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <LayoutShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <div className="rounded-xl bg-indigo-100 p-2">
                <Package className="text-indigo-600" size={28}/>
              </div>
              Productos
            </h1>
            <p className="text-slate-600 mt-2">Gestión del catálogo de productos</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={exportCSV}
              className="flex items-center gap-2 rounded-lg border border-green-600 bg-green-50 hover:bg-green-600 text-green-600 hover:text-white text-sm font-medium px-4 py-2.5 transition"
            >
              <Download size={16}/>
              Exportar
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 transition shadow-sm hover:shadow-md">
              <Plus size={16}/>
              Nuevo Producto
            </button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="rounded-lg bg-blue-50 p-2">
                <Package className="text-blue-600" size={20}/>
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
            <div className="text-sm text-slate-600 mt-1">Total productos</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="rounded-lg bg-green-50 p-2">
                <CheckCircle className="text-green-600" size={20}/>
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats.activos}</div>
            <div className="text-sm text-slate-600 mt-1">Productos activos</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="rounded-lg bg-red-50 p-2">
                <XCircle className="text-red-600" size={20}/>
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats.inactivos}</div>
            <div className="text-sm text-slate-600 mt-1">Productos inactivos</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="rounded-lg bg-amber-50 p-2">
                <DollarSign className="text-amber-600" size={20}/>
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">{money(stats.precioPromedio)}</div>
            <div className="text-sm text-slate-600 mt-1">Precio promedio</div>
          </div>
        </div>

        {/* Filtros */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 bg-slate-50">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <Filter size={18}/>
              Filtros de búsqueda
            </h2>
          </div>
          
          <div className="p-5">
            <div className="grid lg:grid-cols-[1fr_200px] gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                <input 
                  className="w-full border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Buscar por código, nombre o marca..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              
              <select 
                className="border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
              >
                <option value="TODOS">Todos los estados</option>
                <option value="ACTIVO">Activos</option>
                <option value="INACTIVO">Inactivos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3.5 text-left font-semibold text-slate-700 w-16">N°</th>
                  <th className="px-4 py-3.5 text-left font-semibold text-slate-700">Código</th>
                  <th className="px-4 py-3.5 text-left font-semibold text-slate-700">Descripción</th>
                  <th className="px-4 py-3.5 text-left font-semibold text-slate-700">Marca</th>
                  <th className="px-4 py-3.5 text-left font-semibold text-slate-700">Unidad</th>
                  <th className="px-4 py-3.5 text-right font-semibold text-slate-700">Precio</th>
                  <th className="px-4 py-3.5 text-center font-semibold text-slate-700">Estado</th>
                  <th className="px-4 py-3.5 text-center font-semibold text-slate-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="rounded-full bg-slate-100 p-4">
                          <Package className="text-slate-400" size={32}/>
                        </div>
                        <div className="text-slate-500 font-medium">No se encontraron productos</div>
                        <div className="text-sm text-slate-400">Intenta ajustar los filtros de búsqueda</div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((r, i) => (
                    <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 text-slate-600">{i + 1}</td>
                      <td className="px-4 py-3 font-mono text-xs font-medium text-blue-600">{r.code}</td>
                      <td className="px-4 py-3 text-slate-900">{r.name}</td>
                      <td className="px-4 py-3 text-slate-600">{r.brand}</td>
                      <td className="px-4 py-3 text-slate-600">{r.unit}</td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-900">{money(r.price)}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center">
                          {r.is_active ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-50 border border-green-200 text-green-700 text-xs font-semibold">
                              <CheckCircle size={12}/>
                              Activo
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-300 text-slate-600 text-xs font-semibold">
                              <XCircle size={12}/>
                              Inactivo
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white px-2.5 py-1.5 text-xs font-medium transition"
                            title="Editar"
                          >
                            <Edit size={12}/>
                          </button>
                          <button 
                            className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white px-2.5 py-1.5 text-xs font-medium transition"
                            title="Eliminar"
                          >
                            <Trash2 size={12}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </LayoutShell>
  );
}
