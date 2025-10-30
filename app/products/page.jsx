"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseAnon);

const money = (n) => `S/ ${Number(n || 0).toFixed(2)}`;

function StatusPill({ active }) {
  const on = "bg-green-100 text-green-700";
  const off = "bg-gray-200 text-gray-600";
  return (
    <span className={`inline-flex items-center h-6 px-2 text-xs rounded-full ${active ? on : off}`}>
      {active ? "Activo" : "Inactivo"}
    </span>
  );
}

export default function ProductsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      if (!supabaseUrl || !supabaseAnon) {
        throw new Error("Faltan variables NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY");
      }

      const { data, error } = await supabase
        .from("public.products")
        .select("id, code, name, brand, unit, price, is_active")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRows(data ?? []);
    } catch (e) {
      console.error("Supabase SELECT error:", e);
      alert("No pude leer productos: " + (e?.message || "error desconocido"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Productos</h1>
        <div className="flex gap-2">
          <input
            className="border rounded px-3 py-2 text-sm w-80"
            placeholder="Buscar por código, descripción o marca"
          />
          <button className="bg-blue-600 text-white px-3 py-2 rounded">Crear item</button>
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-2 text-left w-12">N</th>
              <th className="px-2 py-2 text-left">Código</th>
              <th className="px-2 py-2 text-left">Descripción</th>
              <th className="px-2 py-2 text-left">Unidad</th>
              <th className="px-2 py-2 text-left">Marca</th>
              <th className="px-2 py-2 text-left">S/</th>
              <th className="px-2 py-2 text-left">Estado</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-2 py-6 text-center text-gray-500">
                  Cargando...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-2 py-6 text-center text-gray-500">
                  Sin registros
                </td>
              </tr>
            ) : (
              rows.map((r, i) => (
                <tr key={r.id} className="border-t">
                  <td className="px-2 py-2">{i + 1}</td>
                  <td className="px-2 py-2">{r.code}</td>
                  <td className="px-2 py-2">{r.name}</td>
                  <td className="px-2 py-2">{r.unit}</td>
                  <td className="px-2 py-2">{r.brand}</td>
                  <td className="px-2 py-2">{money(r.price)}</td>
                  <td className="px-2 py-2">
                    <StatusPill active={!!r.is_active} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
