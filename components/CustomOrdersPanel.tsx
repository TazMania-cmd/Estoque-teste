"use client";

import { Clock, CheckCircle2, Hammer, Truck, Plus, Trash2, User } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";

interface CustomOrder {
  id: string;
  cliente: string;
  descricao: string;
  valor: number;
  status: "pendente" | "produzindo" | "pronto" | "entregue";
  dataPedido: string;
}

interface CustomOrdersPanelProps {
  orders: CustomOrder[];
  onAdd: (order: any) => void;
  onUpdateStatus: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}

const STATUS_CONFIG = {
  pendente: { label: "Pendente", color: "bg-slate-100 text-slate-700", icon: Clock },
  produzindo: { label: "Produzindo", color: "bg-amber-100 text-amber-700", icon: Hammer },
  pronto: { label: "Pronto", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  entregue: { label: "Entregue", color: "bg-blue-100 text-blue-700", icon: Truck },
};

export function CustomOrdersPanel({ orders, onAdd, onUpdateStatus, onDelete }: CustomOrdersPanelProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [filter, setFilter] = useState<"ativos" | "entregues">("ativos");
  const [newOrder, setNewOrder] = useState({ cliente: "", descricao: "", valor: 0 });

  const filteredOrders = orders.filter(o => filter === "ativos" ? o.status !== "entregue" : o.status === "entregue");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onAdd(newOrder);
    setNewOrder({ cliente: "", descricao: "", valor: 0 });
    setIsAdding(false);
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Pedidos sob Encomenda</h2>
          <div className="mt-2 flex gap-2">
            <button 
              onClick={() => setFilter("ativos")}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${filter === "ativos" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500"}`}
            >
              Ativos ({orders.filter(o => o.status !== "entregue").length})
            </button>
            <button 
              onClick={() => setFilter("entregues")}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${filter === "entregues" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500"}`}
            >
              Histórico ({orders.filter(o => o.status === "entregue").length})
            </button>
          </div>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition-all shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Nova Encomenda
        </button>
      </header>

      {isAdding && (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-in fade-in slide-in-from-top-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-slate-700">Nome do Cliente</label>
              <input
                required
                value={newOrder.cliente}
                onChange={(e) => setNewOrder({ ...newOrder, cliente: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2"
                placeholder="Ex: João Silva"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Descrição do Pedido</label>
              <input
                required
                value={newOrder.descricao}
                onChange={(e) => setNewOrder({ ...newOrder, descricao: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2"
                placeholder="Ex: Faca Gaúcha 12 polegadas..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Valor Orçado</label>
              <div className="relative mt-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">R$</span>
                <input
                  required
                  type="text"
                  value={newOrder.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  onChange={(e) => {
                    const cleanValue = e.target.value.replace(/\D/g, "");
                    setNewOrder({ ...newOrder, valor: Number(cleanValue) / 100 });
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2"
                  placeholder="0,00"
                />
              </div>
            </div>
            <div className="sm:col-span-2 flex items-end gap-3">
              <button type="submit" className="flex-1 rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
                Confirmar Pedido
              </button>
              <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2.5 text-sm font-medium text-slate-500">
                Cancelar
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredOrders.map((order) => {
          const config = STATUS_CONFIG[order.status];
          const Icon = config.icon;

          return (
            <div key={order.id} className="group relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                  <User className="h-5 w-5" />
                </div>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${config.color}`}>
                  <Icon className="h-3.5 w-3.5" />
                  {config.label}
                </span>
              </div>

              <h3 className="font-bold text-slate-900">{order.cliente}</h3>
              <p className="mt-1 text-sm text-slate-600 line-clamp-2">{order.descricao}</p>
              
              <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-4">
                <div className="text-xs text-slate-400">
                  {format(new Date(order.dataPedido), "dd/MM/yy")}
                </div>
                <div className="font-bold text-slate-900">
                  {order.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-4 gap-1">
                {Object.keys(STATUS_CONFIG).map((s) => (
                  <button
                    key={s}
                    onClick={() => onUpdateStatus(order.id, s)}
                    className={`rounded-lg py-1.5 text-[10px] font-bold uppercase tracking-tighter transition-colors ${
                      order.status === s 
                        ? "bg-slate-900 text-white" 
                        : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                    }`}
                  >
                    {s.slice(0, 4)}
                  </button>
                ))}
              </div>

              <button
                onClick={() => onDelete(order.id)}
                title="Excluir encomenda"
                className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 shadow-sm transition-all z-10"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
