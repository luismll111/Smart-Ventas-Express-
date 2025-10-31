import LayoutShell from "../../components/LayoutShell";
import Link from "next/link";

function Card({title,desc,href}){
  return (
    <Link href={href} className="group rounded-2xl border bg-white/80 backdrop-blur p-5 shadow-sm transition hover:shadow-xl hover:-translate-y-0.5">
      <div className="font-medium">{title}</div>
      <p className="text-sm text-slate-600 mt-1">{desc}</p>
      <div className="text-sm text-blue-600 mt-3">Entrar &gt;</div>
    </Link>
  );
}

function DebtBannerFixed(){
  const total = 49.00;
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm">
          Tienes una factura pendiente de pago por <b className="font-semibold">S/ {total.toFixed(2)}</b>.
        </div>
        <Link href="/payments" className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 transition shadow-sm hover:shadow-md">
          Subir pago
        </Link>
      </div>
    </div>
  );
}

export default function Dashboard(){
  return (
    <LayoutShell>
      <DebtBannerFixed/>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white/90 backdrop-blur p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <input className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" defaultValue="VENTAS DEL MES"/>
          <button className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2.5 transition shadow-sm hover:shadow-md">Consultar</button>
        </div>
        <div className="mt-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm p-4">
          Las ventas de este mes alcanzan <b className="font-semibold">S/ 5,230.00</b>, con un total de <b className="font-semibold">320</b> transacciones.
          <div className="mt-3">
            <button className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium px-4 py-2 transition shadow-sm hover:shadow-md">Enviar por WhatsApp</button>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Card title="Realizar Venta" desc="Registra nuevas ventas y genera tickets automaticamente." href="/sales" />
        <Card title="Gestionar Productos" desc="Anade, edita o elimina productos del catalogo." href="/products" />
        <Card title="Control de Inventario" desc="Monitorea y actualiza tu stock en tiempo real." href="/inventory" />
        <Card title="Reportes de Ventas" desc="Consulta informes y tendencias." href="/reports" />
        <Card title="Registro de Pago" desc="Registra y confirma pagos pendientes." href="/payments" />
      </section>
    </LayoutShell>
  );
}
