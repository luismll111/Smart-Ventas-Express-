"use client";
import { useState, useEffect } from "react";
import LayoutShell from "../../components/LayoutShell";
import { Bell, ShoppingCart, Package, AlertTriangle, CheckCircle, Clock, Trash2, Filter } from "lucide-react";

export default function NotificationsPage() {
  const initialNotifications = [
    {
      id: 1,
      type: "sale",
      title: "Nueva venta realizada",
      message: "Se registró una venta de S/ 150.00",
      time: "Hace 5 min",
      read: false,
      icon: ShoppingCart,
      color: "green",
    },
    {
      id: 2,
      type: "inventory",
      title: "Stock bajo",
      message: "Producto 'Laptop HP' tiene solo 3 unidades",
      time: "Hace 15 min",
      read: false,
      icon: AlertTriangle,
      color: "amber",
    },
    {
      id: 3,
      type: "payment",
      title: "Pago confirmado",
      message: "Pago de S/ 500.00 procesado exitosamente",
      time: "Hace 1 hora",
      read: true,
      icon: CheckCircle,
      color: "blue",
    },
    {
      id: 4,
      type: "inventory",
      title: "Producto agregado",
      message: "Se agregó 'Mouse Logitech' al inventario",
      time: "Hace 2 horas",
      read: true,
      icon: Package,
      color: "blue",
    },
    {
      id: 5,
      type: "system",
      title: "Actualización disponible",
      message: "Nueva versión 1.0.1 disponible",
      time: "Hace 1 día",
      read: true,
      icon: Bell,
      color: "purple",
    },
  ];

  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");

  // Cargar notificaciones desde localStorage al montar
  useEffect(() => {
    const saved = localStorage.getItem("notifications");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Restaurar los iconos (no se guardan en JSON)
      const withIcons = parsed.map((notif) => {
        let icon;
        switch (notif.type) {
          case "sale":
            icon = ShoppingCart;
            break;
          case "inventory":
            icon = notif.title.includes("bajo") ? AlertTriangle : Package;
            break;
          case "payment":
            icon = CheckCircle;
            break;
          case "system":
            icon = Bell;
            break;
          default:
            icon = Bell;
        }
        return { ...notif, icon };
      });
      setNotifications(withIcons);
    } else {
      setNotifications(initialNotifications);
    }
  }, []);

  // Guardar en localStorage cuando cambien las notificaciones
  useEffect(() => {
    if (notifications.length > 0) {
      // Guardar sin los iconos (no son serializables)
      const toSave = notifications.map(({ icon, ...rest }) => rest);
      localStorage.setItem("notifications", JSON.stringify(toSave));
    }
  }, [notifications]);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const clearAll = () => {
    if (confirm("¿Seguro que deseas eliminar todas las notificaciones?")) {
      setNotifications([]);
      localStorage.removeItem("notifications");
    }
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "all") return true;
    if (filter === "unread") return !notif.read;
    return notif.type === filter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getColorClasses = (color) => {
    const colors = {
      green: "bg-green-100 text-green-600",
      amber: "bg-amber-100 text-amber-600",
      blue: "bg-blue-100 text-blue-600",
      purple: "bg-purple-100 text-purple-600",
    };
    return colors[color] || "bg-slate-100 text-slate-600";
  };

  return (
    <LayoutShell>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 text-blue-600 rounded-xl p-3 relative">
              <Bell className="w-7 h-7" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Notificaciones</h1>
              <p className="text-slate-600 text-sm mt-0.5">
                {unreadCount > 0 ? `${unreadCount} sin leer` : "No tienes notificaciones sin leer"}
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Marcar todas como leídas
            </button>
          )}
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
              filter === "all"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Filter size={16} />
            Todas ({notifications.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
              filter === "unread"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Bell size={16} />
            Sin leer ({unreadCount})
          </button>
          <button
            onClick={() => setFilter("sale")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
              filter === "sale"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <ShoppingCart size={16} />
            Ventas
          </button>
          <button
            onClick={() => setFilter("inventory")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
              filter === "inventory"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Package size={16} />
            Inventario
          </button>
          <button
            onClick={() => setFilter("payment")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
              filter === "payment"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <CheckCircle size={16} />
            Pagos
          </button>
          <button
            onClick={() => setFilter("system")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
              filter === "system"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Bell size={16} />
            Sistema
          </button>
        </div>

        {/* Lista de notificaciones */}
        {filteredNotifications.length === 0 ? (
          <div className="rounded-xl border bg-white shadow-sm p-12 text-center">
            <div className="bg-slate-100 text-slate-400 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Bell className="w-8 h-8" />
            </div>
            <p className="text-slate-600 font-medium">No hay notificaciones</p>
            <p className="text-slate-500 text-sm mt-1">
              {filter === "all"
                ? "No tienes ninguna notificación"
                : `No hay notificaciones de tipo "${filter}"`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notif) => {
              const Icon = notif.icon;
              return (
                <div
                  key={notif.id}
                  className={`rounded-xl border bg-white shadow-sm p-4 transition-all hover:shadow-md ${
                    !notif.read ? "ring-2 ring-blue-500 ring-opacity-20" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`rounded-lg p-3 ${getColorClasses(notif.color)}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <div className="flex items-center gap-2">
                          {!notif.read && (
                            <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0"></div>
                          )}
                          <h3 className="font-semibold text-slate-900">{notif.title}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          {!notif.read && (
                            <button
                              onClick={() => markAsRead(notif.id)}
                              className="text-xs text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap"
                            >
                              Marcar leída
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notif.id)}
                            className="text-slate-400 hover:text-red-600 transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <p className="text-slate-600 text-sm mb-2">{notif.message}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock size={12} />
                        {notif.time}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Botón limpiar todo */}
        {notifications.length > 0 && (
          <div className="flex justify-center">
            <button
              onClick={clearAll}
              className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium"
            >
              <Trash2 size={16} />
              Eliminar todas las notificaciones
            </button>
          </div>
        )}
      </div>
    </LayoutShell>
  );
}
