"use client";
import { useMemo, useState } from "react";
import LayoutShell from "../../components/LayoutShell";

/* ===== Utilitarios ===== */
const money = (n)=>"S/ " + (Number(n||0)).toFixed(2);
const Badge = ({ok,label}) => (
  <span className={"px-2 py-0.5 rounded-full text-xs font-semibold "+
    (ok ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600")}>
    {label}
  </span>
);

/* ===== Datos demo (hasta conectar backend) ===== */
const BASE_ITEMS = (() => {
  const des = [
    "CAMISAS POLO ESTAMPADAS M/CORTA JUVENIL",
    "CASACAS KOOZO",
    "CAMISAS JEAN POLO M/CORTA JUVENILES, BAGGINI",
    "CASACAS JHON HOLDEN DRILL",
    "BERMUDAS DRILL NACIONAL 05S THOMAS",
    "POLOS OFERTA DAMA",
    "POLOS OFERTA VARON",
    "CORREAS DONATELLI, MASSIMO FERRIS",
    "ZAPATILLAS RUNNER XR",
    "MOCHILA URBANA 25L"
  ];
  const sku = ["B73163173","B73163174","B73163172","B73163171","B73163170","B73163169","B73163168","B73163167","B73169990","B73169991"];
  const suc = ["Central","Norte","Sur"];
  const alm = ["ALMACÉN LOGÍSTICO EDEMO01","ALMACÉN DE VENTAS EDEMO01","ALMACÉN PRINCIPAL"];
  const arr=[];
  for(let i=0;i<130;i++){
    arr.push({
      id: i+1,
      sucursal: suc[i%suc.length],
      codigo: sku[i%sku.length].replace("B","P")+String(i%900).padStart(3,"0"),
      descripcion: des[i%des.length],
      marca: "VARIOS",
      unidad: i%7===0 ? "PAQUETE" : "UNIDAD",
      estado: i%11===0 ? "Inactivo" : "Activo",
      almacen: alm[i%alm.length],
      stock: (i%13===0 ? -6 : Math.floor(Math.random()*120)-5)
    });
  }
  return arr;
})();

/* ===== Página ===== */
export default function InventoryPage(){
  // filtros
  const [codigo,setCodigo] = useState("");
  const [barcode,setBarcode] = useState("");
  const [descripcion,setDescripcion] = useState("");
  const [sucursal,setSucursal] = useState("TODOS");
  const [almacen,setAlmacen]   = useState("TODOS");
  const [estado,setEstado]     = useState("TODOS");

  // paginación
  const [page,setPage] = useState(1);
  const pageSize = 10;

  const filtrar = useMemo(()=>{
    let rows = BASE_ITEMS.filter(r=>{
      const okCod = codigo.trim()==="" || r.codigo.toLowerCase().includes(codigo.toLowerCase());
      const okDesc= descripcion.trim()==="" || r.descripcion.toLowerCase().includes(descripcion.toLowerCase());
      const okSuc = sucursal==="TODOS" || r.sucursal===sucursal;
      const okAlm = almacen==="TODOS" || r.almacen===almacen;
      const okEst = estado==="TODOS" || r.estado===estado;
      return okCod && okDesc && okSuc && okAlm && okEst;
    });
    return rows;
  },[codigo,descripcion,sucursal,almacen,estado]);

  const pages = Math.max(1, Math.ceil(filtrar.length / pageSize));
  const pageData = useMemo(()=>{
    const start = (page-1)*pageSize;
    return filtrar.slice(start, start+pageSize);
  },[filtrar,page]);

  const resetAndSearch = ()=> setPage(1);

  const exportCSV = () => {
    const headers = ["N°","Sucursal","Código","Descripción","Marca","Unidad","Estado","Almacén","Stock"];
    const csvRows = [headers.join(",")];
    filtrar.forEach((r,i)=>{
      csvRows.push([
        i+1, r.sucursal, r.codigo,
        `"${r.descripcion.replaceAll('"','""')}"`,
        r.marca, r.unidad, r.estado, `"${r.almacen}"`, r.stock
      ].join(","));
    });
    const csv = csvRows.join("\n");
    const blob = new Blob([csv], {type:"text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const fecha = new Date().toISOString().slice(0,10);
    a.download = `inventario_${fecha}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = ()=> alert("🔖 Exportar a PDF (demo). Luego generaremos PDF real.");

  // sucursales/almacenes únicos
  const sucursales = useMemo(()=>["TODOS", ...Array.from(new Set(BASE_ITEMS.map(x=>x.sucursal)))],[]);
  const almacenes  = useMemo(()=>["TODOS", ...Array.from(new Set(BASE_ITEMS.map(x=>x.almacen)))],[]);

  return (
    <LayoutShell>
      <div className="rounded-2xl border bg-white/80 p-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="text-base font-semibold">Inventario de ítems</div>
          <div className="text-xs text-slate-500">Visualización de los stocks</div>
        </div>

        {/* Filtros */}
        <div className="mt-4 rounded-2xl border bg-white/60 p-4">
          <div className="text-sm font-semibold mb-3">Filtros adicionales</div>
          <div className="grid lg:grid-cols-4 gap-3">
            <label className="text-sm">Código ítem
              <input className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                     value={codigo} onChange={e=>setCodigo(e.target.value)} />
            </label>
            <label className="text-sm">Código de barras
              <input className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                     value={barcode} onChange={e=>setBarcode(e.target.value)} />
            </label>
            <label className="text-sm">Descripción ítem
              <input className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                     value={descripcion} onChange={e=>setDescripcion(e.target.value)} />
            </label>
            <label className="text-sm">Estado
              <select className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                      value={estado} onChange={e=>setEstado(e.target.value)}>
                <option>TODOS</option>
                <option>Activo</option>
                <option>Inactivo</option>
              </select>
            </label>

            <label className="text-sm">Sucursal
              <select className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                      value={sucursal} onChange={e=>setSucursal(e.target.value)}>
                {sucursales.map(s=><option key={s}>{s}</option>)}
              </select>
            </label>
            <label className="text-sm">Almacén
              <select className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                      value={almacen} onChange={e=>setAlmacen(e.target.value)}>
                {almacenes.map(a=><option key={a}>{a}</option>)}
              </select>
            </label>

            <div className="lg:col-span-2 flex items-end">
              <div className="flex gap-2">
                <button onClick={resetAndSearch}
                        className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2">
                  🔎 Buscar
                </button>
                <button onClick={()=>{ setCodigo(""); setBarcode(""); setDescripcion(""); setSucursal("TODOS"); setAlmacen("TODOS"); setEstado("TODOS"); setPage(1); }}
                        className="rounded-lg border text-sm px-4 py-2">
                  Limpiar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones de reporte */}
        <div className="flex justify-end gap-2 mt-3">
          <button onClick={exportPDF}
                  className="rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2">
            PDF
          </button>
          <button onClick={exportCSV}
                  className="rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2">
            Exportar Excel
          </button>
        </div>

        {/* Tabla */}
        <div className="mt-3 overflow-auto border rounded-xl">
          <table className="min-w-[1100px] w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left">
                <th className="px-2 py-2 w-14">N°</th>
                <th className="px-2 py-2">Sucursal</th>
                <th className="px-2 py-2">Código</th>
                <th className="px-2 py-2">Descripción</th>
                <th className="px-2 py-2">Marca</th>
                <th className="px-2 py-2">Unidad</th>
                <th className="px-2 py-2">Estado</th>
                <th className="px-2 py-2">Almacén</th>
                <th className="px-2 py-2 text-right">Stock</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((r,idx)=>(
                <tr key={r.id} className="border-t">
                  <td className="px-2 py-2">{(page-1)*10 + idx + 1}</td>
                  <td className="px-2 py-2">{r.sucursal}</td>
                  <td className="px-2 py-2">
                    <span className="text-blue-600 font-medium">{r.codigo}</span>
                  </td>
                  <td className="px-2 py-2">{r.descripcion}</td>
                  <td className="px-2 py-2">{r.marca}</td>
                  <td className="px-2 py-2">{r.unidad}</td>
                  <td className="px-2 py-2">
                    <Badge ok={r.estado==="Activo"} label={r.estado}/>
                  </td>
                  <td className="px-2 py-2">{r.almacen}</td>
                  <td className={"px-2 py-2 text-right "+(r.stock<0?"text-red-600 font-semibold":"")}>
                    {r.stock}
                  </td>
                </tr>
              ))}
              {pageData.length===0 && (
                <tr><td colSpan={9} className="py-8 text-center text-slate-500">Sin resultados</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="flex justify-center items-center gap-1 mt-3">
          <button className="px-2 py-1 border rounded-md text-sm disabled:opacity-50"
                  onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}>‹</button>
          {Array.from({length: Math.min(pages,7)}, (_,i)=>{
            // ventana centrada si hay muchas páginas
            let start = Math.max(1, Math.min(page-3, pages-6));
            return start+i;
          }).map(p=>(
            <button key={p}
                    className={"px-2 py-1 border rounded-md text-sm "+(p===page?"bg-blue-600 text-white border-blue-600":"")}
                    onClick={()=>setPage(p)}>{p}</button>
          ))}
          <button className="px-2 py-1 border rounded-md text-sm disabled:opacity-50"
                  onClick={()=>setPage(p=>Math.min(pages,p+1))} disabled={page===pages}>›</button>
        </div>
      </div>
    </LayoutShell>
  );
}