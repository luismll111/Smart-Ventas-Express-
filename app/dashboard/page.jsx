"use client";
import { useState } from "react";
import LayoutShell from "../../components/LayoutShell";
import Link from "next/link";
import { 
  ShoppingCart, 
  Package, 
  Layers, 
  BarChart3, 
  CreditCard, 
  TrendingUp, 
  TrendingDown,
  AlertCircle,
  DollarSign,
  Users,
  Calendar,
  ArrowUpRight,
  Send
} from "lucide-react";

function QuickActionCard({title, desc, href, icon: Icon, color = "blue"}){
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-100",
    green: "bg-green-50 text-green-600 group-hover:bg-green-100",
    purple: "bg-purple-50 text-purple-600 group-hover:bg-purple-100",
    orange: "bg-orange-50 text-orange-600 group-hover:bg-orange-100",
    pink: "bg-pink-50 text-pink-600 group-hover:bg-pink-100",
  };
  
  return (
    <Link href={href} className="group rounded-2xl border border-slate-200 bg-white/90 backdrop-blur p-6 shadow-sm hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <div className={`rounded-xl p-3 ${colorClasses[color]} transition`}>
          <Icon size={24} />
        </div>
        <ArrowUpRight className="text-slate-400 group-hover:text-blue-600 transition" size={20} />
      </div>
      <h3 className="font-semibold text-slate-900 mt-4 text-lg">{title}</h3>
      <p className="text-sm text-slate-600 mt-2 leading-relaxed">{desc}</p>
    </Link>
  );
}

function StatCard({title, value, change, trend, icon: Icon, color = "blue"}){
  const isPositive = trend === "up";
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600",
  };
  
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 backdrop-blur p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className={`rounded-xl p-2.5 ${colorClasses[color]}`}>
          <Icon size={20} />
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-xs font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {change}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className="text-sm text-slate-600 mt-1">{title}</div>
    </div>
  );
}

function DebtBanner(){
  const total = 49.00;
  return (
    <div className="rounded-xl border border-amber-300 bg-gradient-to-r from-amber-50 to-amber-100 p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="rounded-lg bg-amber-100 p-2 flex-shrink-0">
          <AlertCircle className="text-amber-600" size={24}/>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-amber-900 mb-1">Factura pendiente de pago</h3>
          <p className="text-sm text-amber-800">
            Tienes una factura pendiente por <span className="font-bold">S/ {total.toFixed(2)}</span>. 
            Por favor, realiza el pago para mantener tu cuenta activa.
          </p>
        </div>
        <Link href="/payments" className="rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-5 py-2.5 transition shadow-sm hover:shadow-md flex-shrink-0">
          Ir a pagos
        </Link>
      </div>
    </div>
  );
}

export default function Dashboard(){
  const [period, setPeriod] = useState("mes");
  const [showWhatsAppSuccess, setShowWhatsAppSuccess] = useState(false);

  const salesData = {
    mes: { total: 5230.00, transactions: 320, change: "+12.5%" },
    semana: { total: 1240.00, transactions: 78, change: "+8.3%" },
    hoy: { total: 185.00, transactions: 12, change: "+15.2%" },
  };

  const currentData = salesData[period];

  const handleWhatsAppShare = () => {
    setShowWhatsAppSuccess(true);
    setTimeout(() => setShowWhatsAppSuccess(false), 3000);
    // Aquí iría la lógica real de compartir por WhatsApp
  };

  return (
    <LayoutShell>
      <div className="space-y-6">
        {/* Header con fecha */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1 flex items-center gap-2">
            <Calendar size={16} />
            {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Banner de deuda */}
        <DebtBanner/>

        {/* Estadísticas principales */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Ventas del mes" 
            value="S/ 5,230" 
            change="+12.5%" 
            trend="up"
            icon={DollarSign}
            color="green"
          />
          <StatCard 
            title="Transacciones" 
            value="320" 
            change="+8.3%" 
            trend="up"
            icon={ShoppingCart}
            color="blue"
          />
          <StatCard 
            title="Productos activos" 
            value="156" 
            icon={Package}
            color="purple"
          />
          <StatCard 
            title="Stock bajo" 
            value="8" 
            change="+2" 
            trend="down"
            icon={AlertCircle}
            color="amber"
          />
        </div>

        {/* Consulta de ventas mejorada */}
        <div className="rounded-2xl border border-slate-200 bg-white/90 backdrop-blur shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-slate-50">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <BarChart3 size={20} />
              Resumen de Ventas
            </h2>
          </div>
          
          <div className="p-6">
            {/* Selector de período */}
            <div className="flex flex-wrap gap-2 mb-5">
              {["hoy", "semana", "mes"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    period === p
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>

            {/* Resultado */}
            <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-emerald-700 mb-1">Ventas de {period === "hoy" ? "hoy" : period === "semana" ? "esta semana" : "este mes"}</p>
                  <div className="text-3xl font-bold text-emerald-900">S/ {currentData.total.toFixed(2)}</div>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-1 rounded-lg bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                    <TrendingUp size={14} />
                    {currentData.change}
                  </div>
                  <p className="text-xs text-emerald-700 mt-2">{currentData.transactions} transacciones</p>
                </div>
              </div>

              {/* Botón WhatsApp */}
              <button 
                onClick={handleWhatsAppShare}
                className="flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2.5 transition shadow-sm hover:shadow-md"
              >
                <Send size={16} />
                Enviar por WhatsApp
              </button>

              {showWhatsAppSuccess && (
                <div className="mt-3 rounded-lg bg-green-100 border border-green-300 text-green-800 text-sm px-4 py-2">
                  ✓ Resumen enviado correctamente
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Acciones Rápidas</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <QuickActionCard 
              title="Realizar Venta" 
              desc="Registra nuevas ventas y genera tickets automáticamente" 
              href="/sales" 
              icon={ShoppingCart}
              color="blue"
            />
            <QuickActionCard 
              title="Gestionar Productos" 
              desc="Añade, edita o elimina productos del catálogo" 
              href="/products" 
              icon={Package}
              color="green"
            />
            <QuickActionCard 
              title="Control de Inventario" 
              desc="Monitorea y actualiza tu stock en tiempo real" 
              href="/inventory" 
              icon={Layers}
              color="purple"
            />
            <QuickActionCard 
              title="Reportes de Ventas" 
              desc="Consulta informes detallados y tendencias" 
              href="/reports" 
              icon={BarChart3}
              color="orange"
            />
            <QuickActionCard 
              title="Registro de Pagos" 
              desc="Gestiona y confirma pagos pendientes" 
              href="/payments" 
              icon={CreditCard}
              color="pink"
            />
          </div>
        </div>
      </div>
    </LayoutShell>
  );
}
