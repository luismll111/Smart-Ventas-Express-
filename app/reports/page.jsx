"use client";

import { useMemo, useState } from "react";
import LayoutShell from "../../components/LayoutShell";

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
  { id: "B001-001050", tipo: "Boleta",  fecha: "2025-09-20", cliente: "Ana Rojas",   subtotal: 100.00, igv: 18.00, total: 118.00 },
];

/* ========= componentes ========= */

function Filters({ f1, f2, setF1, setF2, q, setQ }) {
  return (
    <div className="grid lg:grid-cols-3 gap-3">
      <label className="text-sm">Desde
        <input type="date" className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
               value={f1} onChange={(e)=>setF1(e.target.value)} />
      </label>
      <label className="text-sm">Hasta
        <input type="date" className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
               value={f2} onChange={(e)=>setF2(e.target.value)} />
      </label>
      <label className="text-sm lg:col-span-1">Buscar serie/número o cliente
        <input className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
               placeholder="F001-000321, Mostrador…" value={q} onChange={(e)=>setQ(e.target.value)} />
      </label>
    </div>
  );
}

function Table({ rows }) {
  return (
    <div className="overflow-auto border rounded-xl mt-3">
      <table className="min-w-[900px] w-full text-sm">
        <thead className="bg-slate-50">
          <tr className="text-left">
            <th className="px-3 py-2">Comprobante</th>
            <th className="px-3 py-2">Tipo</th>
            <th className="px-3 py-2">Fecha</th>
            <th className="px-3 py-2">Cliente</th>
            <th className="px-3 py-2">Subtotal</th>
            <th className="px-3 py-2">IGV</th>
            <th className="px-3 py-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="px-3 py-2">
                <a className="text-blue-600 underline underline-offset-2" href="#">{r.id}</a>
              </td>
              <td className="px-3 py-2">{r.tipo}</td>
              <td className="px-3 py-2">{r.fecha}</td>
              <td className="px-3 py-2">{r.cliente}</td>
              <td className="px-3 py-2">{money(r.subtotal)}</td>
              <td className="px-3 py-2">{money(r.igv)}</td>
              <td className="px-3 py-2">{money(r.total)}</td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr><td colSpan={7} className="px-3 py-6 text-center text-slate-500">Sin resultados</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function Pager({ page, pages, setPage }) {
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-3">
      <button className="border rounded-md px-2 py-1 text-xs" onClick={()=>setPage(p=>Math.max(1,p-1))}>‹</button>
      <span className="rounded-md bg-blue-600 text-white text-xs px-2 py-1">{page}</span>
      <button className="border rounded-md px-2 py-1 text-xs" onClick={()=>setPage(p=>Math.min(pages,p+1))}>›</button>
    </div>
  );
}

function Block({ title, rows, onCSV }) {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const pages = Math.max(1, Math.ceil(rows.length / pageSize));
  const pageRows = useMemo(() => rows.slice((page-1)*pageSize, page*pageSize), [rows, page]);

  return (
    <div className="rounded-2xl border bg-white/80 p-4">
      <div className="flex items-center justify-between">
        <div className="font-semibold text-sm">{title}</div>
        <div className="flex gap-2">
          <button className="rounded-md bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-sm"
                  onClick={onCSV}>
            Exportar CSV
          </button>
          <button className="rounded-md bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 text-sm"
                  onClick={()=>alert("PDF (demo)")}>
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
  const [q, setQ]   = useState("");

  const inRange = (d) => (d >= f1 && d <= f2);
  const matchQ  = (r) => (q.trim() === "" ? true : (r.id + r.cliente).toLowerCase().includes(q.toLowerCase()));

  const dataVentas = useMemo(() =>
    BASE.filter(r => r.tipo === "Boleta" && inRange(r.fecha) && matchQ(r)),
  [f1, f2, q]);

  const dataContable = useMemo(() =>
    BASE.filter(r => inRange(r.fecha) && matchQ(r)), [f1, f2, q]);

  // Inventario Valorizado (demo): suma por "costo*stock" con mock
  const invRows = useMemo(() => ([
    { codigo:"SKU-01", nombre:"Polo básico", stock:20, costo:12.5, total: 20*12.5 },
    { codigo:"SKU-02", nombre:"Casaca",     stock: 5, costo:95.0, total: 5*95.0 },
  ]), []);
  const invTotal = invRows.reduce((a,b)=>a+b.total,0);

  const TabBtn = ({ id, label }) => (
    <button onClick={()=>setTab(id)}
      className={"px-3 py-1.5 rounded-lg text-sm border "+
        (tab===id ? "bg-blue-600 text-white border-blue-600" : "bg-white hover:bg-slate-50")}>
      {label}
    </button>
  );

  return (
    <LayoutShell>
      <div className="rounded-2xl border bg-white/80 backdrop-blur p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-base font-semibold">Reportes</div>
          <div className="flex gap-2">
            <TabBtn id="VENTAS"     label="Ventas (Boletas)" />
            <TabBtn id="CONTABLE"   label="Reporte Contable" />
            <TabBtn id="INVENTARIO" label="Inventario Valorizado" />
          </div>
        </div>

        {/* Filtros comunes */}
        <div className="mt-4">
          <Filters f1={f1} f2={f2} setF1={setF1} setF2={setF2} q={q} setQ={setQ} />
        </div>

        {/* SIN TARJETAS/KPIs — eliminado el bloque señalado */}

        <div className="mt-4 grid gap-4">
          {tab === "VENTAS" && (
            <Block
              title="Movimientos de Boletas"
              rows={dataVentas}
              onCSV={() => downloadCSV(dataVentas, "reporte_ventas_boletas.csv")}
            />
          )}

          {tab === "CONTABLE" && (
            <Block
              title="Movimientos contables"
              rows={dataContable}
              onCSV={() => downloadCSV(dataContable, "reporte_contable.csv")}
            />
          )}

          {tab === "INVENTARIO" && (
            <div className="rounded-2xl border bg-white/80 p-4">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-sm">Inventario valorizado (demo)</div>
                <button
                  className="rounded-md bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-sm"
                  onClick={()=>{
                    const header = "Código,Nombre,Stock,Costo,Total\n";
                    const lines = invRows.map(r=>[r.codigo,r.nombre,r.stock,r.costo,r.total].join(",")).join("\n");
                    const csv = header + lines + `\nTOTAL VALORIZADO,, , ,${invTotal}`;
                    const blob = new Blob([csv], {type:"text/csv;charset=utf-8;"});
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url; a.download = "inventario_valorizado.csv";
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  Exportar CSV
                </button>
              </div>

              <div className="overflow-auto border rounded-xl mt-3">
                <table className="min-w-[700px] w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr className="text-left">
                      <th className="px-3 py-2">Código</th>
                      <th className="px-3 py-2">Nombre</th>
                      <th className="px-3 py-2">Stock</th>
                      <th className="px-3 py-2">Costo</th>
                      <th className="px-3 py-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invRows.map((r)=>(
                      <tr key={r.codigo} className="border-t">
                        <td className="px-3 py-2">{r.codigo}</td>
                        <td className="px-3 py-2">{r.nombre}</td>
                        <td className="px-3 py-2">{r.stock}</td>
                        <td className="px-3 py-2">{money(r.costo)}</td>
                        <td className="px-3 py-2">{money(r.total)}</td>
                      </tr>
                    ))}
                    {invRows.length===0 && (
                      <tr><td colSpan={5} className="px-3 py-6 text-center text-slate-500">Sin resultados</td></tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="border-t bg-slate-50 font-medium">
                      <td className="px-3 py-2" colSpan={4}>TOTAL VALORIZADO</td>
                      <td className="px-3 py-2">{money(invTotal)}</td>
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
