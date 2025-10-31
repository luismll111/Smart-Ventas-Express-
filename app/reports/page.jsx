"use client";

import { useMemo, useState } from "react";
import LayoutShell from "../../components/LayoutShell";
import {
  FileText,
  Calendar,
  Search,
  Download,
  FileSpreadsheet,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Package,
  BarChart3,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/* ========= helpers ========= */
const hoy = () => new Date().toISOString().slice(0, 10);
const money = (n) => "S/ " + (Number(n || 0)).toFixed(2);

function toCSV(rows) {
  const header = ["Comprobante", "Tipo", "Fecha", "Cliente", "Subtotal", "IGV", "Total"];
  const lines = rows.map(r => [
    r.id, r.tipo, r.fecha, r.cliente,
    r.subtotal, r.igv, r.total
  ]);
  return [header, ...lines].map(a => a.join(",")).join("\n");
}

function downloadCSV(rows, name = "reporte.csv") {
  const blob = new Blob([toCSV(rows)], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

/* ========= datos demo ========= */
const BASE = [
  { id: "B001-001061", tipo: "Boleta",  fecha: hoy(),       cliente: "Juan Pérez",  subtotal: 56.00, igv: 10.00, total: 66.00 },
  { id: "T001-001060", tipo: "Ticket",  fecha: hoy(),       cliente: "Mostrador",   subtotal: 217.00, igv: 0.00,  total: 217.00 },
  { id: "F001-000045", tipo: "Factura", fecha: hoy(),       cliente: "Acme SAC",    subtotal: 820.00, igv: 147.6, total: 967.60 },
  { id: "B001-001050", tipo: "Boleta",  fecha: "2025-10-28", cliente: "Ana Rojas",   subtotal: 100.00, igv: 18.00, total: 118.00 },
  { id: "F001-000046", tipo: "Factura", fecha: "2025-10-29", cliente: "Tech Corp",   subtotal: 450.00, igv: 81.00, total: 531.00 },
  { id: "B001-001062", tipo: "Boleta",  fecha: hoy(),       cliente: "María López", subtotal: 320.00, igv: 57.60, total: 377.60 },
  { id: "T001-001061", tipo: "Ticket",  fecha: hoy(),       cliente: "Mostrador",   subtotal: 89.00,  igv: 0.00,  total: 89.00 },
  { id: "F001-000047", tipo: "Factura", fecha: "2025-10-27", cliente: "Global SAC",  subtotal: 1200.00, igv: 216.00, total: 1416.00 },
];

/* ========= componentes ========= */

function StatCard({ icon: Icon, label, value, color = "blue" }) {
  const colors = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    amber: "bg-amber-100 text-amber-600",
  };

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-600">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className={`${colors[color]} rounded-lg p-3`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

function Filters({ f1, f2, setF1, setF2, q, setQ }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-5 h-5 text-slate-600" />
        <h3 className="font-semibold text-slate-800">Filtros</h3>
      </div>
      <div className="grid lg:grid-cols-3 gap-3">
        <label className="text-sm text-slate-700">
          <div className="flex items-center gap-1.5 mb-1">
            <Calendar className="w-4 h-4" />
            <span>Desde</span>
          </div>
          <input
            type="date"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            value={f1}
            onChange={(e) => setF1(e.target.value)}
          />
        </label>
        <label className="text-sm text-slate-700">
          <div className="flex items-center gap-1.5 mb-1">
            <Calendar className="w-4 h-4" />
            <span>Hasta</span>
          </div>
          <input
            type="date"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            value={f2}
            onChange={(e) => setF2(e.target.value)}
          />
        </label>
        <label className="text-sm text-slate-700">
          <div className="flex items-center gap-1.5 mb-1">
            <Search className="w-4 h-4" />
            <span>Buscar</span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              className="w-full border border-slate-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Comprobante o cliente..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </label>
      </div>
    </div>
  );
}

function Table({ rows }) {
  return (
    <div className="overflow-auto border border-slate-200 rounded-xl mt-4">
      <table className="min-w-[900px] w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr className="text-left">
            <th className="px-4 py-3 font-semibold text-slate-700">Comprobante</th>
            <th className="px-4 py-3 font-semibold text-slate-700">Tipo</th>
            <th className="px-4 py-3 font-semibold text-slate-700">Fecha</th>
            <th className="px-4 py-3 font-semibold text-slate-700">Cliente</th>
            <th className="px-4 py-3 font-semibold text-slate-700 text-right">Subtotal</th>
            <th className="px-4 py-3 font-semibold text-slate-700 text-right">IGV</th>
            <th className="px-4 py-3 font-semibold text-slate-700 text-right">Total</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3">
                <a className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2" href="#">
                  {r.id}
                </a>
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
                  r.tipo === "Factura" ? "bg-purple-100 text-purple-700" :
                  r.tipo === "Boleta" ? "bg-blue-100 text-blue-700" :
                  "bg-slate-100 text-slate-700"
                }`}>
                  <FileText className="w-3 h-3" />
                  {r.tipo}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-600">{r.fecha}</td>
              <td className="px-4 py-3 text-slate-900">{r.cliente}</td>
              <td className="px-4 py-3 text-right text-slate-700">{money(r.subtotal)}</td>
              <td className="px-4 py-3 text-right text-slate-700">{money(r.igv)}</td>
              <td className="px-4 py-3 text-right font-semibold text-slate-900">{money(r.total)}</td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-12 text-center">
                <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No se encontraron resultados</p>
                <p className="text-slate-400 text-sm mt-1">Ajusta los filtros para ver más datos</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function Pager({ page, pages, setPage }) {
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <button
        className="inline-flex items-center gap-1 border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        disabled={page === 1}
      >
        <ChevronLeft className="w-4 h-4" />
        Anterior
      </button>
      <div className="flex items-center gap-2">
        <span className="rounded-lg bg-blue-600 text-white text-sm font-medium px-4 py-2">
          {page}
        </span>
        <span className="text-sm text-slate-600">de {pages}</span>
      </div>
      <button
        className="inline-flex items-center gap-1 border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        onClick={() => setPage((p) => Math.min(pages, p + 1))}
        disabled={page === pages}
      >
        Siguiente
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function Block({ title, rows, onCSV, icon: Icon }) {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const pages = Math.max(1, Math.ceil(rows.length / pageSize));
  const pageRows = useMemo(() => rows.slice((page - 1) * pageSize, page * pageSize), [rows, page]);

  return (
    <div className="rounded-xl border bg-white shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="bg-blue-100 text-blue-600 rounded-lg p-2">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <h3 className="font-semibold text-lg text-slate-800">{title}</h3>
        </div>
        <div className="flex gap-2">
          <button
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm font-medium transition-colors"
            onClick={onCSV}
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm font-medium transition-colors"
            onClick={() => alert("PDF (demo)")}
          >
            <FileSpreadsheet className="w-4 h-4" />
            PDF
          </button>
        </div>
      </div>

      <Table rows={pageRows} />
      <Pager page={page} pages={pages} setPage={setPage} />
    </div>
  );
}

/* ========= Página ========= */

export default function ReportsPage() {
  const [tab, setTab] = useState("CONTABLE"); // "VENTAS", "CONTABLE", "INVENTARIO"
  const [f1, setF1] = useState(hoy());
  const [f2, setF2] = useState(hoy());
  const [q, setQ] = useState("");

  const inRange = (d) => d >= f1 && d <= f2;
  const matchQ = (r) => (q.trim() === "" ? true : (r.id + r.cliente).toLowerCase().includes(q.toLowerCase()));

  const dataVentas = useMemo(
    () => BASE.filter((r) => r.tipo === "Boleta" && inRange(r.fecha) && matchQ(r)),
    [f1, f2, q]
  );

  const dataContable = useMemo(() => BASE.filter((r) => inRange(r.fecha) && matchQ(r)), [f1, f2, q]);

  // Inventario Valorizado (demo): suma por "costo*stock" con mock
  const invRows = useMemo(
    () => [
      { codigo: "SKU-01", nombre: "Polo básico", stock: 20, costo: 12.5, total: 20 * 12.5 },
      { codigo: "SKU-02", nombre: "Casaca", stock: 5, costo: 95.0, total: 5 * 95.0 },
      { codigo: "SKU-03", nombre: "Pantalón jean", stock: 15, costo: 45.0, total: 15 * 45.0 },
      { codigo: "SKU-04", nombre: "Zapatillas", stock: 8, costo: 120.0, total: 8 * 120.0 },
    ],
    []
  );
  const invTotal = invRows.reduce((a, b) => a + b.total, 0);

  // Stats para el tab actual
  const currentData = tab === "VENTAS" ? dataVentas : tab === "CONTABLE" ? dataContable : [];
  const stats = useMemo(() => {
    const total = currentData.reduce((sum, r) => sum + r.total, 0);
    const subtotal = currentData.reduce((sum, r) => sum + r.subtotal, 0);
    const igv = currentData.reduce((sum, r) => sum + r.igv, 0);
    return { count: currentData.length, total, subtotal, igv };
  }, [currentData]);

  const TabBtn = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setTab(id)}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
        tab === id
          ? "bg-blue-600 text-white shadow-md"
          : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  return (
    <LayoutShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 text-indigo-600 rounded-xl p-3">
              <BarChart3 className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Reportes</h1>
              <p className="text-slate-600 text-sm mt-0.5">Análisis y reportes de ventas e inventario</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          <TabBtn id="VENTAS" label="Ventas (Boletas)" icon={ShoppingCart} />
          <TabBtn id="CONTABLE" label="Reporte Contable" icon={FileText} />
          <TabBtn id="INVENTARIO" label="Inventario Valorizado" icon={Package} />
        </div>

        {/* Filtros */}
        <Filters f1={f1} f2={f2} setF1={setF1} setF2={setF2} q={q} setQ={setQ} />

        {/* Stats Cards - Solo para VENTAS y CONTABLE */}
        {tab !== "INVENTARIO" && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard icon={FileText} label="Comprobantes" value={stats.count} color="blue" />
            <StatCard icon={DollarSign} label="Subtotal" value={money(stats.subtotal)} color="purple" />
            <StatCard icon={TrendingUp} label="IGV" value={money(stats.igv)} color="amber" />
            <StatCard icon={ShoppingCart} label="Total" value={money(stats.total)} color="green" />
          </div>
        )}

        {/* Contenido según tab */}
        <div>
          {tab === "VENTAS" && (
            <Block
              title="Movimientos de Boletas"
              rows={dataVentas}
              onCSV={() => downloadCSV(dataVentas, "reporte_ventas_boletas.csv")}
              icon={ShoppingCart}
            />
          )}

          {tab === "CONTABLE" && (
            <Block
              title="Movimientos Contables"
              rows={dataContable}
              onCSV={() => downloadCSV(dataContable, "reporte_contable.csv")}
              icon={FileText}
            />
          )}

          {tab === "INVENTARIO" && (
            <div className="rounded-xl border bg-white shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 text-purple-600 rounded-lg p-2">
                    <Package className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-lg text-slate-800">Inventario Valorizado (demo)</h3>
                </div>
                <button
                  className="inline-flex items-center gap-2 rounded-lg bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm font-medium transition-colors"
                  onClick={() => {
                    const header = "Código,Nombre,Stock,Costo,Total\n";
                    const lines = invRows.map((r) => [r.codigo, r.nombre, r.stock, r.costo, r.total].join(",")).join("\n");
                    const csv = header + lines + `\nTOTAL VALORIZADO,,,${invTotal}`;
                    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "inventario_valorizado.csv";
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  <Download className="w-4 h-4" />
                  Exportar CSV
                </button>
              </div>

              <div className="overflow-auto border border-slate-200 rounded-xl">
                <table className="min-w-[700px] w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr className="text-left">
                      <th className="px-4 py-3 font-semibold text-slate-700">Código</th>
                      <th className="px-4 py-3 font-semibold text-slate-700">Nombre</th>
                      <th className="px-4 py-3 font-semibold text-slate-700 text-right">Stock</th>
                      <th className="px-4 py-3 font-semibold text-slate-700 text-right">Costo</th>
                      <th className="px-4 py-3 font-semibold text-slate-700 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {invRows.map((r) => (
                      <tr key={r.codigo} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-mono text-blue-600">{r.codigo}</td>
                        <td className="px-4 py-3 text-slate-900">{r.nombre}</td>
                        <td className="px-4 py-3 text-right text-slate-700">{r.stock}</td>
                        <td className="px-4 py-3 text-right text-slate-700">{money(r.costo)}</td>
                        <td className="px-4 py-3 text-right font-semibold text-slate-900">{money(r.total)}</td>
                      </tr>
                    ))}
                    {invRows.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-12 text-center">
                          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                          <p className="text-slate-500 font-medium">No hay productos en inventario</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="border-t-2 border-slate-300 bg-slate-50">
                    <tr className="font-bold">
                      <td className="px-4 py-4 text-slate-800" colSpan={4}>
                        TOTAL VALORIZADO
                      </td>
                      <td className="px-4 py-4 text-right text-lg text-green-600">{money(invTotal)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </LayoutShell>
  );
}
