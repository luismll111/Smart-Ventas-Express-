"use client";
import { useMemo, useState } from "react";
import Link from "next/link";

const initialRows = [
  { id: 1, emision: "02-10-2025", pago: "-", tipo:"FACTURA", numero:"F001-101150", monto:49.00, cancelado:0, estado:"PENDIENTE DE PAGO" },
];

function BannerPendiente({ totalPendiente }){
  if (totalPendiente <= 0) return null;
  return (
    <div className="rounded-md bg-yellow-400 text-black px-3 py-2 text-sm flex items-center justify-between">
      <div className="font-medium">
        Tienes una factura pendiente de pago por S/ {totalPendiente.toFixed(2)}
      </div>
      <a href="#subir-pago" className="underline">Subir mi pago</a>
    </div>
  );
}

function InfoCard({ title, children }){
  return (
    <div className="rounded-2xl border bg-white/80 backdrop-blur p-5 shadow-sm">
      <div className="text-base font-semibold">{title}</div>
      <div className="text-sm text-slate-600 mt-1">{children}</div>
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
    <div className="grid gap-4">
      <BannerPendiente totalPendiente={deudaTotal} />

      {/* titulo */}
      <div className="rounded-2xl border bg-white/80 backdrop-blur p-5 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-lg font-semibold">Mi Deuda</h2>
          <Link href="/dashboard" className="text-blue-600 text-sm">Regresar al menú Smart Ventas Express</Link>
        </div>
        <p className="text-xs text-slate-500 mt-1">Mis comprobantes emitidos por Smart Ventas Express</p>
      </div>

      {/* tarjetas de info */}
      <div className="grid md:grid-cols-2 gap-4">
        <InfoCard title="Informacion importante">
          En esta interfaz podras llevar un control de todos tus pagos. Cada pago que realices lo registras con el boton <b>SUBIR PAGO</b>. Una vez subido, pasa a revision en 48 a 72 horas habiles.
        </InfoCard>
        <InfoCard title="Informacion de deuda">
          <div className="text-sm">
            <div>Nro comprobantes en deuda: <b>{deudaCount}</b></div>
            <div>Total de deuda: <b>S/ {deudaTotal.toFixed(2)}</b></div>
          </div>
        </InfoCard>
      </div>

      {/* tabla */}
      <div className="rounded-2xl border bg-white/80 backdrop-blur p-4 shadow-sm" id="subir-pago">
        <div className="overflow-auto">
          <table className="min-w-[900px] w-full text-sm">
            <thead>
              <tr className="text-left text-slate-600">
                <th className="py-2 px-2">N°</th>
                <th className="py-2 px-2">F. Emision</th>
                <th className="py-2 px-2">F. Pago</th>
                <th className="py-2 px-2">Comprobante</th>
                <th className="py-2 px-2">Numero</th>
                <th className="py-2 px-2">Monto</th>
                <th className="py-2 px-2">M. Cancelado</th>
                <th className="py-2 px-2">Estado</th>
                <th className="py-2 px-2">Subir Pago</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r,idx)=>{
                const pending = r.estado === "PENDIENTE DE PAGO";
                const reviewing = r.estado === "EN REVISION";
                return (
                  <tr key={r.id} className={`border-t ${pending ? "bg-red-50" : reviewing ? "bg-yellow-50" : "bg-green-50"}`}>
                    <td className="py-2 px-2">{idx+1}</td>
                    <td className="py-2 px-2">{r.emision}</td>
                    <td className="py-2 px-2">{r.pago}</td>
                    <td className="py-2 px-2">{r.tipo}</td>
                    <td className="py-2 px-2">
                      {r.numero}{" "}
                      <a className="ml-2 inline-block rounded-full bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-0.5"
                         href={`/invoices/${r.numero}.pdf`} download>
                        Descargar
                      </a>
                    </td>
                    <td className="py-2 px-2">S/ {r.monto.toFixed(2)}</td>
                    <td className="py-2 px-2">S/ {r.cancelado.toFixed(2)}</td>
                    <td className="py-2 px-2">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs
                        ${pending ? "bg-red-600 text-white" : reviewing ? "bg-yellow-500 text-black" : "bg-green-600 text-white"}`}>
                        {r.estado}
                      </span>
                    </td>
                    <td className="py-2 px-2">
                      {pending ? (
                        <button className="rounded-md bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-xs"
                                onClick={()=>{ setUploadRow(r); setShowUpload(true); }}>
                          SUBIR PAGO
                        </button>
                      ) : (
                        <button className="rounded-md border px-3 py-1.5 text-xs" onClick={()=>alert("Ver detalle (demo)")}>
                          Ver
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

      {/* Modal subir pago (demo) */}
      {showUpload && (
        <div className="fixed inset-0 z-50 bg-black/40 grid place-items-center" onClick={()=>setShowUpload(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl" onClick={(e)=>e.stopPropagation()}>
            <div className="text-base font-semibold">Subir pago</div>
            <div className="text-xs text-slate-500 mb-3">Para: {uploadRow?.numero}</div>

            <form className="grid gap-3" onSubmit={(e)=>{
              e.preventDefault();
              alert("Voucher recibido (demo). Estado: EN REVISION");
              setShowUpload(false);
            }}>
              <label className="block">
                <span className="text-sm">Metodo</span>
                <select className="mt-1 w-full rounded-lg border px-3 py-2 text-sm">
                  <option>Yape</option>
                  <option>Plin</option>
                  <option>Transferencia</option>
                  <option>Tarjeta</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm">Referencia</span>
                <input className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" placeholder="Nro operacion / ref"/>
              </label>
              <label className="block">
                <span className="text-sm">Adjuntar voucher (jpg, png, pdf)</span>
                <input className="mt-1 w-full text-sm" type="file" accept=".jpg,.jpeg,.png,.pdf"/>
              </label>

              <div className="flex items-center justify-end gap-2 mt-2">
                <button type="button" className="rounded-md border px-3 py-1.5 text-sm" onClick={()=>setShowUpload(false)}>Cancelar</button>
                <button type="submit" className="rounded-md bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-sm">Confirmar</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
