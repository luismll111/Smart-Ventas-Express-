"use client";
import { useMemo, useState } from "react";
import LayoutShell from "../../components/LayoutShell";
import { 
  Search, 
  Filter, 
  Download, 
  FileText, 
  Package, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  Barcode
} from "lucide-react";

/* ===== Utilitarios ===== */
const money = (n)=>"S/ " + (Number(n||0)).toFixed(2);

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

  // Estadísticas
  const stats = useMemo(() => {
    const total = filtrar.length;
    const activos = filtrar.filter(r => r.estado === "Activo").length;
    const stockBajo = filtrar.filter(r => r.stock < 10 && r.stock >= 0).length;
    const sinStock = filtrar.filter(r => r.stock <= 0).length;
    return { total, activos, stockBajo, sinStock };
  }, [filtrar]);

  return (
    <LayoutShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <div className="rounded-xl bg-purple-100 p-2">
                <Package className="text-purple-600" size={28}/>
              </div>
              Inventario
            </h1>
            <p className="text-slate-600 mt-2">Gestión y control de stock por almacén</p>
          </div>
          <div className="flex gap-3">
            <button onClick={exportPDF}
                    className="flex items-center gap-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2.5 transition shadow-sm hover:shadow-md">
              <FileText size={16}/>
              PDF
            </button>
            <button onClick={exportCSV}
                    className="flex items-center gap-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2.5 transition shadow-sm hover:shadow-md">
              <Download size={16}/>
              Exportar Excel
            </button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white/90 backdrop-blur p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="rounded-lg bg-blue-50 p-2">
                <Package className="text-blue-600" size={20}/>
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
            <div className="text-sm text-slate-600 mt-1">Total productos</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/90 backdrop-blur p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="rounded-lg bg-green-50 p-2">
                <CheckCircle className="text-green-600" size={20}/>
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats.activos}</div>
            <div className="text-sm text-slate-600 mt-1">Productos activos</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/90 backdrop-blur p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="rounded-lg bg-amber-50 p-2">
                <AlertTriangle className="text-amber-600" size={20}/>
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats.stockBajo}</div>
            <div className="text-sm text-slate-600 mt-1">Stock bajo (&lt;10)</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/90 backdrop-blur p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="rounded-lg bg-red-50 p-2">
                <XCircle className="text-red-600" size={20}/>
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats.sinStock}</div>
            <div className="text-sm text-slate-600 mt-1">Sin stock</div>
          </div>
        </div>

        {/* Filtros */}
        <div className="rounded-2xl border border-slate-200 bg-white/90 backdrop-blur shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 bg-slate-50">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <Filter size={18}/>
              Filtros de búsqueda
            </h2>
          </div>
          
          <div className="p-6">
            <div className="grid lg:grid-cols-4 gap-4">
              <label className="block">
                <span className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-2">
                  <Search size={14}/>
                  Código ítem
                </span>
                <input 
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Buscar por código..."
                  value={codigo} 
                  onChange={e=>setCodigo(e.target.value)} 
                />
              </label>
              
              <label className="block">
                <span className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-2">
                  <Barcode size={14}/>
                  Código de barras
                </span>
                <input 
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Escanear código..."
                  value={barcode} 
                  onChange={e=>setBarcode(e.target.value)} 
                />
              </label>
              
              <label className="block">
                <span className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-2">
                  <Package size={14}/>
                  Descripción
                </span>
                <input 
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Buscar producto..."
                  value={descripcion} 
                  onChange={e=>setDescripcion(e.target.value)} 
                />
              </label>
              
              <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-2 block">Estado</span>
                <select 
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  value={estado} 
                  onChange={e=>setEstado(e.target.value)}
                >
                  <option>TODOS</option>
                  <option>Activo</option>
                  <option>Inactivo</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-2 block">Sucursal</span>
                <select 
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  value={sucursal} 
                  onChange={e=>setSucursal(e.target.value)}
                >
                  {sucursales.map(s=><option key={s}>{s}</option>)}
                </select>
              </label>
              
              <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-2 block">Almacén</span>
                <select 
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  value={almacen} 
                  onChange={e=>setAlmacen(e.target.value)}
                >
                  {almacenes.map(a=><option key={a}>{a}</option>)}
                </select>
              </label>

              <div className="lg:col-span-2 flex items-end gap-3">
                <button 
                  onClick={resetAndSearch}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 transition shadow-sm hover:shadow-md"
                >
                  <Search size={16}/>
                  Buscar
                </button>
                <button 
                  onClick={()=>{ setCodigo(""); setBarcode(""); setDescripcion(""); setSucursal("TODOS"); setAlmacen("TODOS"); setEstado("TODOS"); setPage(1); }}
                  className="flex items-center gap-2 rounded-lg border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium px-5 py-2.5 transition"
                >
                  <RefreshCw size={16}/>
                  Limpiar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="rounded-2xl border border-slate-200 bg-white/90 backdrop-blur shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[1100px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3.5 text-left font-semibold text-slate-700">N°</th>
                  <th className="px-4 py-3.5 text-left font-semibold text-slate-700">Sucursal</th>
                  <th className="px-4 py-3.5 text-left font-semibold text-slate-700">Código</th>
                  <th className="px-4 py-3.5 text-left font-semibold text-slate-700">Descripción</th>
                  <th className="px-4 py-3.5 text-left font-semibold text-slate-700">Marca</th>
                  <th className="px-4 py-3.5 text-left font-semibold text-slate-700">Unidad</th>
                  <th className="px-4 py-3.5 text-center font-semibold text-slate-700">Estado</th>
                  <th className="px-4 py-3.5 text-left font-semibold text-slate-700">Almacén</th>
                  <th className="px-4 py-3.5 text-right font-semibold text-slate-700">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pageData.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="rounded-full bg-slate-100 p-4">
                          <Package className="text-slate-400" size={32}/>
                        </div>
                        <div className="text-slate-500 font-medium">No se encontraron productos</div>
                        <div className="text-sm text-slate-400">Intenta ajustar los filtros de búsqueda</div>
                      </div>
                    </td>
                  </tr>
                )}
                
                {pageData.map((r, idx) => {
                  // Color según stock
                  let stockColor = "text-green-700 bg-green-50 border-green-200";
                  let stockIcon = <CheckCircle size={14}/>;
                  
                  if (r.stock < 0) {
                    stockColor = "text-red-700 bg-red-50 border-red-200";
                    stockIcon = <XCircle size={14}/>;
                  } else if (r.stock < 10) {
                    stockColor = "text-amber-700 bg-amber-50 border-amber-200";
                    stockIcon = <AlertTriangle size={14}/>;
                  }

                  return (
                    <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 text-slate-600">
                        {(page - 1) * 10 + idx + 1}
                      </td>
                      <td className="px-4 py-3 text-slate-900">{r.sucursal}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Barcode size={14} className="text-slate-400"/>
                          <span className="font-mono text-xs font-medium text-blue-600">{r.codigo}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-900 max-w-xs truncate">
                        {r.descripcion}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{r.marca}</td>
                      <td className="px-4 py-3 text-slate-600">{r.unidad}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center">
                          {r.estado === "Activo" ? (
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
                      <td className="px-4 py-3 text-slate-600">{r.almacen}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${stockColor}`}>
                            {stockIcon}
                            {r.stock}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Paginación */}
        {pages > 1 && (
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/90 backdrop-blur p-5 shadow-sm">
            <div className="text-sm text-slate-600">
              Mostrando <span className="font-semibold text-slate-900">{(page - 1) * 10 + 1}</span> a{" "}
              <span className="font-semibold text-slate-900">{Math.min(page * 10, filtrar.length)}</span> de{" "}
              <span className="font-semibold text-slate-900">{filtrar.length}</span> productos
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 text-sm font-medium px-4 py-2 transition"
              >
                Anterior
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(pages, 7) }, (_, i) => {
                  let start = Math.max(1, Math.min(page - 3, pages - 6));
                  return start + i;
                }).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                      p === page
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={page === pages}
                className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 text-sm font-medium px-4 py-2 transition"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </LayoutShell>
  );
}