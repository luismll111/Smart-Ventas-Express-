"use client";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { useState } from "react";
import LayoutShell from "../../components/LayoutShell";
import { 
  Search, 
  Plus, 
  ShoppingCart, 
  User, 
  FileText, 
  Calendar,
  DollarSign,
  Trash2,
  CheckCircle,
  XCircle,
  Package
} from "lucide-react";

/* === Safe repeat polyfill (temporal) === */
if (!String.prototype._origRepeat) {
  String.prototype._origRepeat = String.prototype.repeat;
  String.prototype.repeat = function (n) {
    n = Number(n) || 0;
    return n > 0 ? this._origRepeat(n) : "";
  };
}
/* === end polyfill === */

/* Utiles */
const money = (n)=> "S/ " + (Number(n||0)).toFixed(2);
const hoy = ()=> new Date().toISOString().slice(0,10);

/* ======= Selector de productos (modal simple) ======= */
function ProductPicker({ open, onClose, onPick }) {
  const supabase = supabaseBrowser();
  const [q, setQ] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  async function buscar() {
    setLoading(true);
    try {
      const s = (q||"").trim();
      let query = supabase
        .from("products")
        .select("id, code, name, unit, brand, price")
        .order("code")
        .limit(25);

      if (s) {
        const p = `%${s}%`;
        query = query.or(`code.ilike.${p},name.ilike.${p},brand.ilike.${p}`);
      }

      const { data, error } = await query;
      if (error) throw error;
      setRows(data || []);
    } catch (e) {
      console.error("Buscar productos:", e);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  if(!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <Search className="text-blue-600" size={20}/>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Buscar productos</h3>
              <p className="text-xs text-slate-600">Busca por código, nombre o marca</p>
            </div>
          </div>
          <button 
            className="rounded-lg hover:bg-slate-100 p-2 transition"
            onClick={onClose}
          >
            <XCircle size={20} className="text-slate-500"/>
          </button>
        </div>
        
        <div className="p-5">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
              <input
                className="w-full border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Código, nombre o marca del producto..."
                value={q}
                onChange={(e)=>setQ(e.target.value)}
                onKeyDown={(e)=>{ if(e.key==="Enter") buscar(); }}
              />
            </div>
            <button 
              className="flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 transition shadow-sm hover:shadow-md"
              onClick={buscar}
            >
              <Search size={16}/>
              Buscar
            </button>
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Código</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Descripción</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Unidad</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Marca</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-700">Precio</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-700">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading && (
                    <tr>
                      <td colSpan={6} className="px-4 py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          <p className="text-slate-500">Buscando productos...</p>
                        </div>
                      </td>
                    </tr>
                  )}
                  {!loading && rows.map(r=>(
                    <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-blue-600 font-medium">{r.code}</td>
                      <td className="px-4 py-3 text-slate-900">{r.name}</td>
                      <td className="px-4 py-3 text-slate-600">{r.unit}</td>
                      <td className="px-4 py-3 text-slate-600">{r.brand}</td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-900">{money(r.price)}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          className="inline-flex items-center gap-1.5 rounded-lg border border-blue-600 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white px-3 py-1.5 text-xs font-medium transition"
                          onClick={()=>{ onPick(r); onClose(); }}
                        >
                          <Plus size={14}/>
                          Agregar
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!loading && rows.length===0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="rounded-full bg-slate-100 p-4">
                            <Package className="text-slate-400" size={32}/>
                          </div>
                          <p className="text-slate-500 font-medium">No se encontraron productos</p>
                          <p className="text-sm text-slate-400">Intenta con otros términos de búsqueda</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ======= Tabla de items ======= */
function ItemsGrid({ rows, setRows }) {
  const upd = (id, k, v)=> setRows(prev=>prev.map(x=> x.id===id ? {...x, [k]: v, total: Number(x.qty||0)*Number(x.price||0) } : x));
  const remove = (id)=> setRows(prev=>prev.filter(x=>x.id!==id));
  const addManual = ()=> setRows(prev=>[
    ...prev,
    { id: crypto.randomUUID(), code:"", desc:"", unit:"UND", price:0, qty:1, total:0 }
  ]);

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
              <th className="px-4 py-3 text-left font-semibold text-slate-700 w-24">Cant.</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700 w-40">Código</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Descripción</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700 w-28">Unidad</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-700 w-32">P. Unit.</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-700 w-32">Total</th>
              <th className="px-4 py-3 text-center font-semibold text-slate-700 w-24"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map(r=>(
              <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3">
                  <input className="w-20 border border-slate-300 rounded-lg px-3 py-2 text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                         value={r.qty} onChange={e=>upd(r.id, "qty", Number(e.target.value||0))}/>
                </td>
                <td className="px-4 py-3">
                  <input className="w-full border border-slate-300 rounded-lg px-3 py-2 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                         value={r.code} onChange={e=>upd(r.id, "code", e.target.value)}/>
                </td>
                <td className="px-4 py-3">
                  <input className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                         value={r.desc} onChange={e=>upd(r.id, "desc", e.target.value)}/>
                </td>
                <td className="px-4 py-3">
                  <input className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                         value={r.unit} onChange={e=>upd(r.id, "unit", e.target.value)}/>
                </td>
                <td className="px-4 py-3">
                  <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                         value={r.price} onChange={e=>upd(r.id, "price", Number(e.target.value||0))}/>
                </td>
                <td className="px-4 py-3 font-semibold text-right text-slate-900">{money(r.total)}</td>
                <td className="px-4 py-3 text-center">
                  <button 
                    onClick={()=>remove(r.id)} 
                    className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white px-2.5 py-1.5 text-xs font-medium transition"
                  >
                    <Trash2 size={12}/>
                    Quitar
                  </button>
                </td>
              </tr>
            ))}
            {rows.length===0 && (
              <tr>
                <td colSpan={7} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="rounded-full bg-slate-100 p-4">
                      <ShoppingCart className="text-slate-400" size={32}/>
                    </div>
                    <p className="text-slate-500 font-medium">No hay productos agregados</p>
                    <p className="text-sm text-slate-400">Agrega productos para emitir el comprobante</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-slate-200 bg-slate-50/50">
        <button 
          className="inline-flex items-center gap-2 rounded-lg border border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 text-sm font-medium transition"
          onClick={addManual}
        >
          <Plus size={16}/>
          Agregar línea manual
        </button>
      </div>
    </div>
  );
}

/* ======= Formulario Documento ======= */
function DocForm({ tipo }) {
  const [cliente,setCliente]=useState({ tipoDoc: tipo==="FACTURA"?"RUC":"DNI", nroDoc:"", razon:"", direccion:"", email:"" });
  const [doc,setDoc]=useState({ serie: tipo==="FACTURA"?"F001":(tipo==="BOLETA"?"B001":"T001"), moneda:"SOLES", fecha:hoy(), condicion:"CONTADO", igv:"IGV 18%" });
  const [rows,setRows]=useState([]);
  const [descGlobal,setDescGlobal]=useState(0);
  const [openPicker,setOpenPicker]=useState(false);

  const subTotal=rows.reduce((a,b)=>a+(b.total||0),0);
  const igvMonto=doc.igv==="IGV 18%"?(subTotal-descGlobal)*0.18:0;
  const total=Math.max(0, subTotal-descGlobal+igvMonto);

  const addPicked = (p)=>{
    setRows(prev=>[
      ...prev,
      {
        id: crypto.randomUUID(),
        code: p.code,
        desc: p.name,
        unit: p.unit || "UND",
        price: Number(p.price||0),
        qty: 1,
        total: Number(p.price||0)*1
      }
    ]);
  };

  const emitir = async () => {
  if (!rows.length) {
    alert("Agrega al menos 1 ítem.");
    return;
  }
  try {
    const supabase = supabaseBrowser();

    // Ajusta estos nombres si en tu grid usas otros campos
    const items = rows.map(r => ({
      code: r.codigo,
      qty: Number(r.cant ?? r.qty ?? 0)
    }));

    const { data, error } = await supabase.rpc("create_sale", {
      p_doc_type: (tipo === "FACTURA" ? "FACTURA" : (tipo === "BOLETA" ? "BOLETA" : "TICKET")),
      p_series:   (tipo === "FACTURA" ? "F001"     : (tipo === "BOLETA" ? "B001"     : "T001")),
      p_number:   null, // deja que el servidor genere la numeración
      p_items:    items
    });

    if (error) throw error;
    const saleId = data; // bigint

    // Traer cabecera de la venta para mostrar resumen
    const { data: head, error: e2 } = await supabase
      .from("sales")
      .select("series, number, issued_at, subtotal, igv, total")
      .eq("id", saleId)
      .single();

    if (e2) throw e2;

    alert(
      `Emitido ✅\n` +
      `Comprobante: ${head.series}-${head.number}\n` +
      `Subtotal: S/ ${Number(head.subtotal).toFixed(2)}\n` +
      `IGV: S/ ${Number(head.igv).toFixed(2)}\n` +
      `Total: S/ ${Number(head.total).toFixed(2)}`
    );

    // Limpiar grilla y descuento global si quieres
    setRows([]);
    setDescGlobal(0);
  } catch (err) {
    console.error(err);
    alert("Error al emitir: " + (err.message || err));
  }
};

  return (
    <div className="space-y-6">
      {/* Encabezados */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Cliente */}
        <div className="rounded-2xl border border-slate-200 bg-white/90 backdrop-blur shadow-sm">
          <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <User size={18} className="text-blue-600"/>
              Datos del Cliente
            </h3>
          </div>
          <div className="p-5">
            <div className="grid sm:grid-cols-3 gap-4">
              <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-2 block">Tipo de Documento</span>
                <select className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        value={cliente.tipoDoc}
                        onChange={e=>setCliente({...cliente,tipoDoc:e.target.value})}>
                  <option>DNI</option><option>RUC</option><option>CE</option>
                </select>
              </label>
              <label className="block sm:col-span-2">
                <span className="text-sm font-medium text-slate-700 mb-2 block">Número de Documento</span>
                <div className="flex gap-2">
                  <input className="flex-1 border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                         value={cliente.nroDoc} onChange={e=>setCliente({...cliente,nroDoc:e.target.value})}
                         placeholder="Ingresa el número"/>
                  <button className="rounded-lg border border-blue-600 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white px-4 text-sm font-medium transition">
                    <Search size={16}/>
                  </button>
                </div>
              </label>
            </div>
            <div className="space-y-3 mt-4">
              <input className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                     placeholder={tipo==="FACTURA"?"Razón Social":"Nombre completo"}
                     value={cliente.razon} onChange={e=>setCliente({...cliente,razon:e.target.value})}/>
              <input className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                     placeholder="Dirección"
                     value={cliente.direccion} onChange={e=>setCliente({...cliente,direccion:e.target.value})}/>
              <input className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                     placeholder="Correo electrónico"
                     value={cliente.email} onChange={e=>setCliente({...cliente,email:e.target.value})}/>
            </div>
          </div>
        </div>

        {/* Documento */}
        <div className="rounded-2xl border border-slate-200 bg-white/90 backdrop-blur shadow-sm">
          <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-green-50 to-emerald-50">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <FileText size={18} className="text-green-600"/>
              Datos del Documento
            </h3>
          </div>
          <div className="p-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-2 block">Serie del Documento</span>
                <select className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        value={doc.serie} onChange={e=>setDoc({...doc,serie:e.target.value})}>
                  {tipo==="FACTURA" && <option>F001</option>}
                  {tipo!=="FACTURA" && <option>B001</option>}
                  {tipo==="TICKET" && <option>T001</option>}
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-1.5">
                  <DollarSign size={14}/>
                  Moneda
                </span>
                <select className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        value={doc.moneda} onChange={e=>setDoc({...doc,moneda:e.target.value})}>
                  <option>SOLES</option><option>DÓLARES</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-2 block">Condición de Pago</span>
                <select className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        value={doc.condicion} onChange={e=>setDoc({...doc,condicion:e.target.value})}>
                  <option>CONTADO</option><option>CRÉDITO</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-1.5">
                  <Calendar size={14}/>
                  Fecha de Emisión
                </span>
                <input type="date" className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                       value={doc.fecha} onChange={e=>setDoc({...doc,fecha:e.target.value})}/>
              </label>
              <label className="block sm:col-span-2">
                <span className="text-sm font-medium text-slate-700 mb-2 block">Lista valor IGV</span>
                <select className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        value={doc.igv} onChange={e=>setDoc({...doc,igv:e.target.value})}>
                  <option>IGV 18%</option><option>Exonerado</option>
                </select>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Detalle */}
      <div className="rounded-2xl border border-slate-200 bg-white/90 backdrop-blur shadow-sm">
        <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <ShoppingCart size={18} className="text-purple-600"/>
              Detalle de ítems
            </h3>
            <button 
              className="inline-flex items-center gap-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 transition shadow-sm hover:shadow-md"
              onClick={()=>setOpenPicker(true)}
            >
              <Plus size={16}/>
              Agregar producto
            </button>
          </div>
        </div>

        <div className="p-5">
          <ItemsGrid rows={rows} setRows={setRows} />

          <div className="grid lg:grid-cols-[1fr_400px] gap-6 mt-6">
            <div className="space-y-3">
              <label className="block">
                <span className="text-sm font-medium text-slate-700 mb-2 block">Observaciones</span>
                <textarea 
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                  placeholder="Notas adicionales sobre el comprobante (opcional)"
                  rows={3}
                />
              </label>
            </div>
            
            <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-5 shadow-sm">
              <h4 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <DollarSign size={16}/>
                Resumen de Totales
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-sm text-slate-600">Descuento Global</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-700">S/</span>
                    <input 
                      className="w-28 border border-slate-300 rounded-lg px-3 py-2 text-right text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      value={descGlobal} 
                      onChange={e=>{ 
                        const v=Number(e.target.value||0); 
                        const st=rows.reduce((a,b)=>a+(b.total||0),0); 
                        if(v<=st) setDescGlobal(v); 
                      }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-slate-700">
                  <span className="text-sm">Sub total</span>
                  <span className="font-semibold">{money(subTotal)}</span>
                </div>
                
                <div className="flex items-center justify-between text-slate-700">
                  <span className="text-sm">IGV (18%)</span>
                  <span className="font-semibold">{money(igvMonto)}</span>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t-2 border-slate-300">
                  <span className="text-base font-bold text-slate-900">Total a Pagar</span>
                  <span className="text-xl font-bold text-blue-600">{money(total)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-slate-200">
            <button 
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium px-6 py-2.5 transition"
            >
              <XCircle size={16}/>
              Cancelar
            </button>
            <button 
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-6 py-2.5 transition shadow-sm hover:shadow-md"
              onClick={emitir}
            >
              <CheckCircle size={16}/>
              Emitir Comprobante
            </button>
          </div>
        </div>
      </div>

      <ProductPicker open={openPicker} onClose={()=>setOpenPicker(false)} onPick={addPicked} />
    </div>
  );
}

/* ======= Página principal con pestañas ======= */
export default function SalesPage(){
  const [tab,setTab]=useState("BOLETA");
  const TabBtn=({id,label})=>(
    <button onClick={()=>setTab(id)}
      className={"px-4 py-2.5 rounded-lg text-sm font-medium border transition shadow-sm "+(tab===id?"bg-blue-600 text-white border-blue-600 shadow-md":"bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400")}>
      {label}
    </button>
  );
  return (
    <LayoutShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <div className="rounded-xl bg-green-100 p-2">
                <FileText className="text-green-600" size={28}/>
              </div>
              Ventas
            </h1>
            <p className="text-slate-600 mt-2">Emisión de comprobantes electrónicos</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 p-2 rounded-2xl border border-slate-200 bg-white/90 backdrop-blur shadow-sm w-fit">
          <TabBtn id="BOLETA" label="Boleta de Venta" />
          <TabBtn id="FACTURA" label="Factura Electrónica" />
          <TabBtn id="TICKET" label="Ticket de Venta" />
        </div>

        {/* Contenido según tab */}
        {tab==="BOLETA"   && <DocForm tipo="BOLETA" />}
        {tab==="FACTURA"  && <DocForm tipo="FACTURA" />}
        {tab==="TICKET"   && <DocForm tipo="TICKET" />}
      </div>
    </LayoutShell>
  );
}


async function pingSupabase() {
  const supabase = supabaseBrowser();
  const { data, error } = await supabase
    .from("products")
    .select("code,name,price")
    .limit(5);

  if (error) { alert("❌ BD: " + error.message); console.error(error); return; }
  if (!data?.length) { alert("✅ Conectado, pero no hay productos."); return; }
  alert("✅ Conectado. " + data.map(d => `${d.code}:${d.name} S/ ${d.price}`).join(" | "));
}

async function emitirDemo() {
  const supabase = supabaseBrowser();
  const { data, error } = await supabase.rpc("create_sale", {
    p_doc_type: "BOLETA",
    p_series: "B001",
    p_number: "",
    p_items: [{ code: "SKU-01", qty: 1 }, { code: "SKU-02", qty: 2 }]
  });
  if (error) { alert("❌ RPC: " + error.message); console.error(error); return; }
  alert("✅ Venta creada. sale_id: " + data);
}
