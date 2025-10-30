"use client";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
/* === Safe repeat polyfill (temporal) === */
if (!String.prototype._origRepeat) {
  String.prototype._origRepeat = String.prototype.repeat;
  String.prototype.repeat = function (n) {
    n = Number(n) || 0;
    return n > 0 ? this._origRepeat(n) : "";
  };
}
/* === end polyfill === */


import { useEffect, useState } from "react";
import LayoutShell from "../../components/LayoutShell";
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
      alert(e?.message || "Error buscando productos");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{ if(open){ buscar(); } }, [open]);

  if(!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="font-semibold">Buscar productos</div>
          <button className="text-sm" onClick={onClose}>Cerrar</button>
        </div>
        <div className="p-4">
          <div className="flex gap-2">
          <button onClick={pingSupabase} className="rounded-md border px-3 py-1 text-sm">Probar BD</button>
<button onClick={emitirDemo} className="rounded-md bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 text-sm">Emitir demo (RPC)</button>
          
            <input
              className="flex-1 border rounded-lg px-3 py-2"
              placeholder="Código, nombre o marca"
              value={q}
              onChange={(e)=>setQ(e.target.value)}
              onKeyDown={(e)=>{ if(e.key==="Enter") buscar(); }}
            />
            <button className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4" onClick={buscar}>
              Buscar
            </button>
          </div>

          <div className="mt-3 overflow-auto border rounded-xl">
            <table className="min-w-[700px] w-full text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left">
                  <th className="px-2 py-2">Código</th>
                  <th className="px-2 py-2">Descripción</th>
                  <th className="px-2 py-2">Unidad</th>
                  <th className="px-2 py-2">Marca</th>
                  <th className="px-2 py-2">Precio</th>
                  <th className="px-2 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={6} className="px-2 py-6 text-center text-slate-500">Buscando</td></tr>
                )}
                {!loading && rows.map(r=>(
                  <tr key={r.id} className="border-t">
                    <td className="px-2 py-2">{r.code}</td>
                    <td className="px-2 py-2">{r.name}</td>
                    <td className="px-2 py-2">{r.unit}</td>
                    <td className="px-2 py-2">{r.brand}</td>
                    <td className="px-2 py-2">{money(r.price)}</td>
                    <td className="px-2 py-2">
                      <button
                        className="rounded-md border px-3 py-1 text-xs"
                        onClick={()=>{ onPick(r); onClose(); }}
                      >
                        Agregar
                      </button>
                    </td>
                  </tr>
                ))}
                {!loading && rows.length===0 && (
                  <tr><td colSpan={6} className="px-2 py-6 text-center text-slate-500">Sin resultados</td></tr>
                )}
              </tbody>
            </table>
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
    <div className="rounded-xl border overflow-auto">
      <table className="min-w-[900px] w-full text-sm">
        <thead className="bg-slate-50">
          <tr className="text-left">
            <th className="px-2 py-2 w-16">Cant.</th>
            <th className="px-2 py-2 w-40">Código</th>
            <th className="px-2 py-2">Descripción</th>
            <th className="px-2 py-2 w-24">Unidad</th>
            <th className="px-2 py-2 w-28">P. Unit.</th>
            <th className="px-2 py-2 w-28">Total</th>
            <th className="px-2 py-2 w-20"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r=>(
            <tr key={r.id} className="border-t">
              <td className="px-2 py-2">
                <input className="w-16 border rounded-lg px-2 py-1 text-right"
                       value={r.qty} onChange={e=>upd(r.id, "qty", Number(e.target.value||0))}/>
              </td>
              <td className="px-2 py-2">
                <input className="w-40 border rounded-lg px-2 py-1"
                       value={r.code} onChange={e=>upd(r.id, "code", e.target.value)}/>
              </td>
              <td className="px-2 py-2">
                <input className="w-full border rounded-lg px-2 py-1"
                       value={r.desc} onChange={e=>upd(r.id, "desc", e.target.value)}/>
              </td>
              <td className="px-2 py-2">
                <input className="w-24 border rounded-lg px-2 py-1"
                       value={r.unit} onChange={e=>upd(r.id, "unit", e.target.value)}/>
              </td>
              <td className="px-2 py-2">
                <input className="w-28 border rounded-lg px-2 py-1 text-right"
                       value={r.price} onChange={e=>upd(r.id, "price", Number(e.target.value||0))}/>
              </td>
              <td className="px-2 py-2 font-medium">{money(r.total)}</td>
              <td className="px-2 py-2">
                <button onClick={()=>remove(r.id)} className="text-xs rounded-md border px-2 py-1">Quitar</button>
              </td>
            </tr>
          ))}
          {rows.length===0 && (
            <tr><td colSpan={7} className="px-2 py-6 text-center text-slate-500">Agrega productos para emitir</td></tr>
          )}
        </tbody>
      </table>
      <div className="p-2 border-t bg-slate-50 flex gap-2">
        <button className="rounded-md border px-3 py-1 text-xs" onClick={addManual}>+ Línea manual</button>
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
    <div className="grid gap-4">
      {/* Encabezados */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border bg-white/80 p-4">
          <div className="font-semibold text-sm">Datos del Cliente</div>
          <div className="grid sm:grid-cols-3 gap-3 mt-3">
            <label className="text-sm">Tipo de Documento
              <select className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                      value={cliente.tipoDoc}
                      onChange={e=>setCliente({...cliente,tipoDoc:e.target.value})}>
                <option>DNI</option><option>RUC</option><option>CE</option>
              </select>
            </label>
            <label className="text-sm sm:col-span-2">Número de Documento
              <div className="mt-1 flex gap-2">
                <input className="flex-1 border rounded-lg px-3 py-2 text-sm"
                       value={cliente.nroDoc} onChange={e=>setCliente({...cliente,nroDoc:e.target.value})}/>
                <button className="rounded-lg border px-3 py-2 text-sm"></button>
                <button className="rounded-lg border px-3 py-2 text-sm">Nuevo Cliente</button>
              </div>
            </label>
          </div>
          <div className="grid gap-3 mt-3">
            <input className="border rounded-lg px-3 py-2 text-sm"
                   placeholder={tipo==="FACTURA"?"Razón Social":"Nombre completo"}
                   value={cliente.razon} onChange={e=>setCliente({...cliente,razon:e.target.value})}/>
            <input className="border rounded-lg px-3 py-2 text-sm" placeholder="Dirección"
                   value={cliente.direccion} onChange={e=>setCliente({...cliente,direccion:e.target.value})}/>
            <input className="border rounded-lg px-3 py-2 text-sm" placeholder="Correo electrónico"
                   value={cliente.email} onChange={e=>setCliente({...cliente,email:e.target.value})}/>
          </div>
        </div>

        <div className="rounded-2xl border bg-white/80 p-4">
          <div className="font-semibold text-sm">Datos del Documento</div>
          <div className="grid sm:grid-cols-2 gap-3 mt-3">
            <label className="text-sm">Serie del Documento
              <select className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                      value={doc.serie} onChange={e=>setDoc({...doc,serie:e.target.value})}>
                {tipo==="FACTURA" && <option>F001</option>}
                {tipo!=="FACTURA" && <option>B001</option>}
                {tipo==="TICKET" && <option>T001</option>}
              </select>
            </label>
            <label className="text-sm">Moneda
              <select className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                      value={doc.moneda} onChange={e=>setDoc({...doc,moneda:e.target.value})}>
                <option>SOLES</option><option>DÓLARES</option>
              </select>
            </label>
            <label className="text-sm">Condición de Pago
              <select className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                      value={doc.condicion} onChange={e=>setDoc({...doc,condicion:e.target.value})}>
                <option>CONTADO</option><option>CRÉDITO</option>
              </select>
            </label>
            <label className="text-sm">Fecha de Emisión
              <input type="date" className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                     value={doc.fecha} onChange={e=>setDoc({...doc,fecha:e.target.value})}/>
            </label>
            <label className="text-sm">Lista valor IGV
              <select className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                      value={doc.igv} onChange={e=>setDoc({...doc,igv:e.target.value})}>
                <option>IGV 18%</option><option>Exonerado</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      {/* Detalle */}
      <div className="rounded-2xl border bg-white/80 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="font-semibold text-sm">Detalle de ítems</div>
          <button className="rounded-md border px-3 py-1.5 text-sm" onClick={()=>setOpenPicker(true)}>
            + Agregar producto
          </button>
        </div>

        <ItemsGrid rows={rows} setRows={setRows} />

        <div className="grid lg:grid-cols-[1fr_340px] gap-4 mt-4">
          <div className="grid gap-2">
            <label className="text-sm">Observaciones
              <input className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" placeholder="Opcional"/>
            </label>
          </div>
          <div className="rounded-xl border bg-slate-50 p-3 text-sm">
            <div className="flex items-center justify-between">
              <span>Descuento Global</span>
              <div className="flex items-center">
                <span className="mr-1">S/</span>
                <input className="w-24 border rounded-lg px-2 py-1 text-right"
                       value={descGlobal} onChange={e=>{ const v=Number(e.target.value||0); const st=rows.reduce((a,b)=>a+(b.total||0),0); if(v<=st) setDescGlobal(v); }}/>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2"><span>Sub total</span><b>{money(subTotal)}</b></div>
            <div className="flex items-center justify-between mt-1"><span>IGV</span><b>{money(igvMonto)}</b></div>
            <div className="flex items-center justify-between mt-2 text-base"><span>Total</span><b>{money(total)}</b></div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={pingSupabase} className="rounded-md border px-3 py-1 text-sm">Probar BD</button>
<button onClick={emitirDemo} className="rounded-md bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 text-sm">Emitir demo (RPC)</button>
          
          <button className="rounded-md bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2" onClick={emitir}>Emitir</button>
          <button className="rounded-md bg-red-600 hover:bg-red-700 text-white px-4 py-2">Cancelar</button>
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
      className={"px-3 py-1.5 rounded-lg text-sm border "+(tab===id?"bg-blue-600 text-white border-blue-600":"bg-white hover:bg-slate-50")}>
      {label}
    </button>
  );
  return (
    <LayoutShell>
      <div className="rounded-2xl border bg-white/80 backdrop-blur p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button onClick={pingSupabase} className="rounded-md border px-3 py-1 text-sm">Probar BD</button>
<button onClick={emitirDemo} className="rounded-md bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 text-sm">Emitir demo (RPC)</button>
          
          <div className="text-base font-semibold">Ventas</div>
          <div className="flex gap-2">
          <button onClick={pingSupabase} className="rounded-md border px-3 py-1 text-sm">Probar BD</button>
<button onClick={emitirDemo} className="rounded-md bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 text-sm">Emitir demo (RPC)</button>
          
            <TabBtn id="BOLETA" label="Boleta" />
            <TabBtn id="FACTURA" label="Factura" />
            <TabBtn id="TICKET" label="Ticket de venta" />
          </div>
        </div>
        <div className="mt-4">
          {tab==="BOLETA"   && <DocForm tipo="BOLETA" />}
          {tab==="FACTURA"  && <DocForm tipo="FACTURA" />}
          {tab==="TICKET"   && <DocForm tipo="TICKET" />}
        </div>
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
