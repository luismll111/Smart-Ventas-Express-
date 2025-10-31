"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import LayoutShell from "../../components/LayoutShell";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Upload,
  CreditCard,
  FileText,
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Calendar,
  Search,
  Filter,
  X,
} from "lucide-react";

const initialRows = [
  { id: 1, emision: "2025-10-25", pago: "-", tipo:"FACTURA", numero:"F001-101150", monto:49.00, cancelado:0, estado:"PENDIENTE DE PAGO", cliente: "Acme Corp SAC" },
  { id: 2, emision: "2025-10-20", pago: "2025-10-22", tipo:"FACTURA", numero:"F001-101149", monto:350.00, cancelado:350.00, estado:"PAGADO", cliente: "Tech Solutions" },
  { id: 3, emision: "2025-10-18", pago: "2025-10-21", tipo:"FACTURA", numero:"F001-101148", monto:120.00, cancelado:120.00, estado:"PAGADO", cliente: "Global Services" },
  { id: 4, emision: "2025-10-15", pago: "-", tipo:"FACTURA", numero:"F001-101147", monto:89.00, cancelado:0, estado:"EN REVISION", cliente: "Innovate Ltd" },
  { id: 5, emision: "2025-10-10", pago: "2025-10-12", tipo:"FACTURA", numero:"F001-101146", monto:275.50, cancelado:275.50, estado:"PAGADO", cliente: "Smart Business" },
];

function StatCard({ icon: Icon, label, value, color = "blue", trend }) {
  const colors = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    red: "bg-red-100 text-red-600",
    amber: "bg-amber-100 text-amber-600",
  };

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-slate-600">{label}</p>
          <p className="text-2xl font-bold mt-1.5 text-slate-900">{value}</p>
          {trend && <p className="text-xs text-slate-500 mt-1">{trend}</p>}
        </div>
        <div className={`${colors[color]} rounded-lg p-3`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

function BannerPendiente({ totalPendiente }) {
  if (totalPendiente <= 0) return null;
  return (
    <div className="rounded-xl border border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-4 shadow-sm">
      <div className="flex items-start gap-3">
        <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={22} />
        <div className="flex-1">
          <div className="font-semibold text-amber-900">⚠️ Tienes pagos pendientes</div>
          <div className="text-sm text-amber-800 mt-1">
            Total pendiente: <span className="font-bold text-lg">S/ {totalPendiente.toFixed(2)}</span>
            <span className="text-xs ml-2">• Mantén tu cuenta al día para evitar interrupciones</span>
          </div>
        </div>
        <a
          href="#subir-pago"
          className="rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-4 py-2 transition shadow-sm"
        >
          Pagar ahora
        </a>
      </div>
    </div>
  );
}

export default function PaymentsPage() {
  const [rows, setRows] = useState(initialRows);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadRow, setUploadRow] = useState(null);
  const [method, setMethod] = useState("Yape");
  const [ref, setRef] = useState("");
  const [file, setFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("TODOS");

  // Filtrado
  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      const matchSearch =
        searchTerm === "" ||
        r.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.cliente.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = filterStatus === "TODOS" || r.estado === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [rows, searchTerm, filterStatus]);

  // Stats
  const stats = useMemo(() => {
    const pendientes = rows.filter((r) => r.estado === "PENDIENTE DE PAGO");
    const enRevision = rows.filter((r) => r.estado === "EN REVISION");
    const pagados = rows.filter((r) => r.estado === "PAGADO");
    const totalPendiente = pendientes.reduce((a, b) => a + (b.monto - b.cancelado), 0);
    const totalPagado = pagados.reduce((a, b) => a + b.cancelado, 0);

    return {
      totalComprobantes: rows.length,
      pendientes: pendientes.length,
      enRevision: enRevision.length,
      pagados: pagados.length,
      totalPendiente,
      totalPagado,
    };
  }, [rows]);

  const abrirUpload = (row) => {
    setUploadRow(row);
    setMethod("Yape");
    setRef("");
    setFile(null);
    setShowUpload(true);
  };

  const confirmarUpload = (e) => {
    e.preventDefault();
    if (!ref.trim() || !file) {
      alert("Por favor ingresa la referencia y adjunta el voucher.");
      return;
    }
    setRows((prev) => prev.map((r) => (r.id === uploadRow.id ? { ...r, estado: "EN REVISION" } : r)));
    setShowUpload(false);
    alert("✅ Voucher recibido correctamente. Tu pago está EN REVISIÓN.");
  };

  const deudaTotal = stats.totalPendiente;

  return (
    <LayoutShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 text-green-600 rounded-xl p-3">
              <CreditCard className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Registro de Pagos</h1>
              <p className="text-slate-600 text-sm mt-0.5">Gestiona y controla tus comprobantes de pago</p>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm font-medium transition"
          >
            <ArrowLeft size={16} />
            Volver
          </Link>
        </div>

        {/* Banner de alerta */}
        <BannerPendiente totalPendiente={deudaTotal} />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            icon={FileText}
            label="Total Comprobantes"
            value={stats.totalComprobantes}
            color="blue"
          />
          <StatCard
            icon={AlertCircle}
            label="Pendientes"
            value={stats.pendientes}
            color="red"
            trend={`S/ ${stats.totalPendiente.toFixed(2)} por pagar`}
          />
          <StatCard
            icon={Clock}
            label="En Revisión"
            value={stats.enRevision}
            color="amber"
          />
          <StatCard
            icon={CheckCircle}
            label="Pagados"
            value={stats.pagados}
            color="green"
            trend={`S/ ${stats.totalPagado.toFixed(2)} pagado`}
          />
        </div>

        {/* Filtros */}
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-5 h-5 text-slate-600" />
            <h3 className="font-semibold text-slate-800">Filtros</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                className="w-full border border-slate-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Buscar por número o cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="TODOS">Todos los estados</option>
              <option value="PENDIENTE DE PAGO">Pendientes</option>
              <option value="EN REVISION">En Revisión</option>
              <option value="PAGADO">Pagados</option>
            </select>
          </div>
        </div>

        {/* Tabla moderna mejorada */}
        <div className="rounded-xl border bg-white shadow-sm" id="subir-pago">
          <div className="p-5 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Mis Comprobantes</h2>
                <p className="text-sm text-slate-600 mt-0.5">
                  Mostrando {filteredRows.length} de {rows.length} comprobantes
                </p>
              </div>
            </div>
          </div>
          <div className="overflow-auto">
            <table className="min-w-[1100px] w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-left text-slate-700 font-semibold">
                  <th className="py-3 px-4">N°</th>
                  <th className="py-3 px-4">Cliente</th>
                  <th className="py-3 px-4">Número</th>
                  <th className="py-3 px-4">Tipo</th>
                  <th className="py-3 px-4">F. Emisión</th>
                  <th className="py-3 px-4">F. Pago</th>
                  <th className="py-3 px-4 text-right">Monto</th>
                  <th className="py-3 px-4 text-right">Pagado</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRows.map((r, idx) => {
                  const pending = r.estado === "PENDIENTE DE PAGO";
                  const reviewing = r.estado === "EN REVISION";
                  const paid = r.estado === "PAGADO";
                  return (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4 font-medium text-slate-900">{idx + 1}</td>
                      <td className="py-4 px-4 text-slate-900">{r.cliente}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-blue-600 font-medium">{r.numero}</span>
                          <a
                            className="inline-flex items-center gap-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 transition shadow-sm"
                            href={`/invoices/${r.numero}.pdf`}
                            download
                          >
                            <Download size={12} />
                            PDF
                          </a>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-purple-100 text-purple-700 px-2 py-1 text-xs font-medium">
                          <FileText size={12} />
                          {r.tipo}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-600">{r.emision}</td>
                      <td className="py-4 px-4 text-slate-600">{r.pago}</td>
                      <td className="py-4 px-4 text-right font-semibold text-slate-900">S/ {r.monto.toFixed(2)}</td>
                      <td className="py-4 px-4 text-right font-semibold text-green-600">
                        S/ {r.cancelado.toFixed(2)}
                      </td>
                      <td className="py-4 px-4">
                        {pending && (
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-red-100 border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-700">
                            <AlertCircle size={14} />
                            PENDIENTE
                          </span>
                        )}
                        {reviewing && (
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-100 border border-amber-200 px-2.5 py-1.5 text-xs font-semibold text-amber-700">
                            <Clock size={14} />
                            EN REVISIÓN
                          </span>
                        )}
                        {paid && (
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-green-100 border border-green-200 px-2.5 py-1.5 text-xs font-semibold text-green-700">
                            <CheckCircle size={14} />
                            PAGADO
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {pending ? (
                          <button
                            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 text-xs font-medium transition shadow-sm hover:shadow-md"
                            onClick={() => abrirUpload(r)}
                          >
                            <Upload size={14} />
                            SUBIR PAGO
                          </button>
                        ) : (
                          <button
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 px-3 py-2 text-xs font-medium transition"
                            onClick={() => alert("Ver detalle (demo)")}
                          >
                            Ver detalle
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {filteredRows.length === 0 && (
                  <tr>
                    <td colSpan={10} className="py-12 text-center">
                      <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 font-medium">No se encontraron comprobantes</p>
                      <p className="text-slate-400 text-sm mt-1">Ajusta los filtros para ver más resultados</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal mejorado */}
        {showUpload && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4"
            onClick={() => setShowUpload(false)}
          >
            <div
              className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header del modal */}
              <div className="border-b border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-blue-100 p-3">
                      <Upload className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Registrar Pago</h3>
                      <p className="text-sm text-slate-600 mt-1">
                        Comprobante:{" "}
                        <span className="font-mono font-semibold text-blue-600">{uploadRow?.numero}</span> •{" "}
                        <span className="font-semibold text-slate-900">S/ {uploadRow?.monto.toFixed(2)}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowUpload(false)}
                    className="text-slate-400 hover:text-slate-600 transition"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Contenido del modal */}
              <form className="p-6 space-y-5" onSubmit={confirmarUpload}>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">Instrucciones importantes</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Ingresa el número de operación exacto que aparece en tu voucher</li>
                        <li>Adjunta una imagen clara del comprobante de pago</li>
                        <li>El pago será verificado en 48-72 horas hábiles</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <CreditCard size={18} className="text-blue-600" />
                    Método de pago
                  </span>
                  <select
                    className="mt-2 w-full rounded-lg border-2 border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                  >
                    <option>Yape</option>
                    <option>Plin</option>
                    <option>Transferencia bancaria</option>
                    <option>Tarjeta de crédito/débito</option>
                    <option>Depósito en efectivo</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <FileText size={18} className="text-blue-600" />
                    Número de operación / Referencia *
                  </span>
                  <input
                    className="mt-2 w-full rounded-lg border-2 border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Ej: 0012345678 o código de transacción"
                    value={ref}
                    onChange={(e) => setRef(e.target.value)}
                    required
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Upload size={18} className="text-blue-600" />
                    Adjuntar voucher (JPG, PNG, PDF) *
                  </span>
                  <div className="mt-2">
                    <input
                      className="w-full text-sm file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer cursor-pointer border-2 border-dashed border-slate-300 rounded-lg p-3"
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => setFile(e.target.files?.[0])}
                      required
                    />
                  </div>
                  {file && (
                    <div className="mt-3 text-sm text-slate-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3 flex items-center gap-2">
                      <CheckCircle className="text-green-600" size={18} />
                      <span>
                        Archivo seleccionado: <span className="font-semibold">{file.name}</span> (
                        {(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                  )}
                </label>

                {/* Footer del modal */}
                <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-200">
                  <button
                    type="button"
                    className="rounded-lg border-2 border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 px-6 py-2.5 text-sm font-semibold transition"
                    onClick={() => setShowUpload(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 text-sm font-semibold transition shadow-md hover:shadow-lg"
                  >
                    Confirmar y enviar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </LayoutShell>
  );
}
