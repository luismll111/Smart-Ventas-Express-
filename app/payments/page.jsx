"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import LayoutShell from "../../components/LayoutShell";
import { AlertCircle, CheckCircle, Clock, Download, Upload, CreditCard, FileText, ArrowLeft } from "lucide-react";

const initialRows = [
  { id: 1, emision: "02-10-2025", pago: "-", tipo:"FACTURA", numero:"F001-101150", monto:49.00, cancelado:0, estado:"PENDIENTE DE PAGO" },
];

function BannerPendiente({ totalPendiente }){
  if (totalPendiente <= 0) return null;
  return (
    <div className="rounded-xl border border-amber-300 bg-gradient-to-r from-amber-50 to-amber-100 px-5 py-4 shadow-sm">
      <div className="flex items-start gap-3">
        <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20}/>
        <div className="flex-1">
          <div className="font-semibold text-amber-900">Factura pendiente de pago</div>
          <div className="text-sm text-amber-800 mt-1">
            Tienes una factura pendiente por <span className="font-bold">S/ {totalPendiente.toFixed(2)}</span>
          </div>
        </div>
        <a href="#subir-pago" className="rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-4 py-2 transition shadow-sm">
          Subir pago
        </a>
      </div>
    </div>
  );
}

function InfoCard({ title, icon: Icon, children, highlight }){
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 backdrop-blur p-6 shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-3 mb-3">
        {Icon && <div className="rounded-lg bg-blue-50 p-2"><Icon className="text-blue-600" size={20}/></div>}
        <div className="text-base font-semibold text-slate-900">{title}</div>
      </div>
      <div className="text-sm text-slate-600 leading-relaxed">{children}</div>
      {highlight && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          {highlight}
        </div>
      )}
    </div>
  );
}

export default function PaymentsPage(){
  const [rows, setRows] = useState(initialRows);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadRow, setUploadRow]   = useState(null);
  const [method, setMethod] = useState("Yape");
  const [ref, setRef] = useState("");
  const [file, setFile] = useState(null);

  const deudaCount = useMemo(()=> rows.filter(r=>r.estado === "PENDIENTE DE PAGO").length, [rows]);
  const deudaTotal = useMemo(()=> rows.filter(r=>r.estado === "PENDIENTE DE PAGO")
                                 .reduce((a,b)=>a + (b.monto - b.cancelado),0), [rows]);

  const abrirUpload = (row)=>{
    setUploadRow(row);
    setMethod("Yape");
    setRef("");
    setFile(null);
    setShowUpload(true);
  };

  const confirmarUpload = (e)=>{
    e.preventDefault();
    if (!ref.trim() || !file) {
      alert("Ingresa referencia y adjunta voucher.");
      return;
    }
    setRows(prev => prev.map(r => r.id === uploadRow.id ? { ...r, estado:"EN REVISION" } : r));
    setShowUpload(false);
    alert("Voucher recibido (demo). Estado: EN REVISION");
  };

  return (
    <LayoutShell>
      <div className="grid gap-6">
        <BannerPendiente totalPendiente={deudaTotal} />

      {/* Header mejorado */}
      <div className="rounded-2xl border border-slate-200 bg-white/90 backdrop-blur p-6 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <div className="rounded-xl bg-blue-100 p-2">
                <CreditCard className="text-blue-600" size={24}/>
              </div>
              Registro de Pagos
            </h1>
            <p className="text-sm text-slate-600 mt-2">Gestiona y controla todos tus comprobantes de pago</p>
          </div>
          <Link href="/dashboard" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition">
            <ArrowLeft size={16}/>
            Volver al Dashboard
          </Link>
        </div>
      </div>

      {/* Tarjetas de información mejoradas */}
      <div className="grid md:grid-cols-2 gap-5">
        <InfoCard 
          title="Información importante" 
          icon={FileText}
        >
          <p className="mb-2">En esta interfaz podrás llevar un control completo de todos tus pagos pendientes y confirmados.</p>
          <p>Cada pago que realices lo registras con el botón <span className="font-semibold text-blue-600">SUBIR PAGO</span>. Una vez subido, pasa a revisión en <span className="font-semibold">48 a 72 horas hábiles</span>.</p>
        </InfoCard>
        <InfoCard 
          title="Estado de deuda" 
          icon={AlertCircle}
          highlight={
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-red-50 border border-red-100">
                <div className="text-2xl font-bold text-red-600">{deudaCount}</div>
                <div className="text-xs text-red-600 font-medium mt-1">Comprobantes pendientes</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-amber-50 border border-amber-100">
                <div className="text-2xl font-bold text-amber-600">S/ {deudaTotal.toFixed(2)}</div>
                <div className="text-xs text-amber-600 font-medium mt-1">Total adeudado</div>
              </div>
            </div>
          }
        >
          Mantén tu cuenta al día para seguir disfrutando de nuestros servicios sin interrupciones.
        </InfoCard>
      </div>

      {/* Tabla moderna mejorada */}
      <div className="rounded-2xl border border-slate-200 bg-white/90 backdrop-blur shadow-sm" id="subir-pago">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Mis Comprobantes</h2>
          <p className="text-sm text-slate-600 mt-1">Historial completo de facturas y pagos</p>
        </div>
        <div className="overflow-auto">
          <table className="min-w-[1000px] w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-left text-slate-700 font-medium">
                <th className="py-3 px-4">N°</th>
                <th className="py-3 px-4">F. Emisión</th>
                <th className="py-3 px-4">F. Pago</th>
                <th className="py-3 px-4">Tipo</th>
                <th className="py-3 px-4">Número</th>
                <th className="py-3 px-4 text-right">Monto</th>
                <th className="py-3 px-4 text-right">Cancelado</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r,idx)=>{
                const pending = r.estado === "PENDIENTE DE PAGO";
                const reviewing = r.estado === "EN REVISION";
                const paid = r.estado === "PAGADO";
                return (
                  <tr key={r.id} className="hover:bg-slate-50 transition">
                    <td className="py-4 px-4 font-medium text-slate-900">{idx+1}</td>
                    <td className="py-4 px-4 text-slate-600">{r.emision}</td>
                    <td className="py-4 px-4 text-slate-600">{r.pago}</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                        <FileText size={12}/>
                        {r.tipo}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-900">{r.numero}</span>
                        <a className="inline-flex items-center gap-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 transition shadow-sm"
                           href={`/invoices/${r.numero}.pdf`} download>
                          <Download size={12}/>
                          PDF
                        </a>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right font-semibold text-slate-900">S/ {r.monto.toFixed(2)}</td>
                    <td className="py-4 px-4 text-right font-semibold text-slate-600">S/ {r.cancelado.toFixed(2)}</td>
                    <td className="py-4 px-4">
                      {pending && (
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-red-100 border border-red-200 px-2.5 py-1 text-xs font-semibold text-red-700">
                          <AlertCircle size={12}/>
                          PENDIENTE
                        </span>
                      )}
                      {reviewing && (
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-100 border border-amber-200 px-2.5 py-1 text-xs font-semibold text-amber-700">
                          <Clock size={12}/>
                          EN REVISIÓN
                        </span>
                      )}
                      {paid && (
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-green-100 border border-green-200 px-2.5 py-1 text-xs font-semibold text-green-700">
                          <CheckCircle size={12}/>
                          PAGADO
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {pending ? (
                        <button className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 text-xs font-medium transition shadow-sm hover:shadow-md"
                                onClick={()=>{ setUploadRow(r); setShowUpload(true); }}>
                          <Upload size={14}/>
                          SUBIR PAGO
                        </button>
                      ) : (
                        <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 px-3 py-2 text-xs font-medium transition"
                                onClick={()=>alert("Ver detalle (demo)")}>
                          Ver detalle
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal mejorado */}
      {showUpload && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm grid place-items-center p-4" onClick={()=>setShowUpload(false)}>
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl" onClick={(e)=>e.stopPropagation()}>
            {/* Header del modal */}
            <div className="border-b border-slate-200 p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-100 p-2">
                  <Upload className="text-blue-600" size={24}/>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Registrar Pago</h3>
                  <p className="text-sm text-slate-600 mt-0.5">Comprobante: <span className="font-mono font-semibold text-slate-900">{uploadRow?.numero}</span></p>
                </div>
              </div>
            </div>

            {/* Contenido del modal */}
            <form className="p-6 space-y-5" onSubmit={(e)=>{
              e.preventDefault();
              if (!ref.trim() || !file) {
                alert("Por favor ingresa la referencia y adjunta el voucher.");
                return;
              }
              setRows(prev => prev.map(r => r.id === uploadRow.id ? { ...r, estado:"EN REVISION" } : r));
              setShowUpload(false);
              alert("✅ Voucher recibido correctamente. Tu pago está EN REVISIÓN.");
            }}>
              <label className="block">
                <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <CreditCard size={16}/>
                  Método de pago
                </span>
                <select 
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  value={method}
                  onChange={(e)=>setMethod(e.target.value)}
                >
                  <option>Yape</option>
                  <option>Plin</option>
                  <option>Transferencia bancaria</option>
                  <option>Tarjeta de crédito/débito</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <FileText size={16}/>
                  Número de operación / Referencia
                </span>
                <input 
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" 
                  placeholder="Ej: 0012345678"
                  value={ref}
                  onChange={(e)=>setRef(e.target.value)}
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Upload size={16}/>
                  Adjuntar voucher (JPG, PNG, PDF)
                </span>
                <div className="mt-2">
                  <input 
                    className="w-full text-sm file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer cursor-pointer" 
                    type="file" 
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e)=>setFile(e.target.files?.[0])}
                  />
                </div>
                {file && (
                  <div className="mt-2 text-xs text-slate-600 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                    ✅ Archivo seleccionado: <span className="font-semibold">{file.name}</span>
                  </div>
                )}
              </label>

              {/* Footer del modal */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button 
                  type="button" 
                  className="rounded-lg border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 px-5 py-2.5 text-sm font-medium transition"
                  onClick={()=>setShowUpload(false)}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-sm font-medium transition shadow-sm hover:shadow-md"
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
