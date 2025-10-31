"use client";
import { useState } from "react";
import LayoutShell from "../../components/LayoutShell";

const money = (n) => `S/ ${Number(n || 0).toFixed(2)}`;

// Datos demo (hasta conectar con Supabase real)
const DEMO_PRODUCTS = [
  { id: 1, code: "PROD001", name: "Camisas Polo Estampadas M/Corta", brand: "VARIOS", unit: "UNIDAD", price: 45.00, is_active: true },
  { id: 2, code: "PROD002", name: "Casacas Koozo", brand: "KOOZO", unit: "UNIDAD", price: 120.00, is_active: true },
  { id: 3, code: "PROD003", name: "Camisas Jean Polo M/Corta Baggini", brand: "BAGGINI", unit: "UNIDAD", price: 65.00, is_active: true },
  { id: 4, code: "PROD004", name: "Casacas Jhon Holden Drill", brand: "JHON HOLDEN", unit: "UNIDAD", price: 180.00, is_active: true },
  { id: 5, code: "PROD005", name: "Bermudas Drill Nacional 05S Thomas", brand: "THOMAS", unit: "UNIDAD", price: 55.00, is_active: true },
  { id: 6, code: "PROD006", name: "Polos Oferta Dama", brand: "VARIOS", unit: "UNIDAD", price: 25.00, is_active: true },
  { id: 7, code: "PROD007", name: "Polos Oferta Varón", brand: "VARIOS", unit: "UNIDAD", price: 25.00, is_active: true },
  { id: 8, code: "PROD008", name: "Correas Donatelli, Massimo Ferris", brand: "DONATELLI", unit: "UNIDAD", price: 35.00, is_active: true },
  { id: 9, code: "PROD009", name: "Zapatillas Runner XR", brand: "RUNNER", unit: "PAR", price: 150.00, is_active: true },
  { id: 10, code: "PROD010", name: "Mochila Urbana 25L", brand: "VARIOS", unit: "UNIDAD", price: 80.00, is_active: false },
];

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
  const [rows] = useState(DEMO_PRODUCTS);

  return (
    <LayoutShell>
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
              {rows.length === 0 ? (
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
    </LayoutShell>
  );
}
