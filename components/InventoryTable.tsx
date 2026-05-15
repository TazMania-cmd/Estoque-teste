"use client";

import {
  PackageMinus,
  PackagePlus,
  RotateCcw,
  ShoppingCart,
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { STATUS_LABELS } from "@/lib/inventory";
import type { StockActionType } from "@/lib/stock-actions";
import type { ProductWithStatus } from "@/lib/types";

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

interface InventoryTableProps {
  products: ProductWithStatus[];
  onAction: (type: StockActionType, id: string) => void;
}

export function InventoryTable({ products, onAction }: InventoryTableProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3">Produto</th>
              <th className="px-4 py-3">Custo</th>
              <th className="px-4 py-3">Venda</th>
              <th className="px-4 py-3">Estoque</th>
              <th className="px-4 py-3">Mínimo</th>
              <th className="px-4 py-3">Lead time</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/80">
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-900">{p.nome}</p>
                  <p className="text-xs text-slate-500">ID {p.id}</p>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {formatBRL(p.precoCusto)}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {formatBRL(p.precoVenda)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      p.status === "urgent"
                        ? "font-semibold text-red-700"
                        : "font-medium text-slate-900"
                    }
                  >
                    {p.estoqueAtual}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">{p.estoqueMinimo}</td>
                <td className="px-4 py-3 text-slate-600">
                  {p.leadTimeDias} dias
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={p.status} />
                  <p className="mt-1 text-xs text-slate-500">
                    {STATUS_LABELS[p.status].description}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <span className="flex flex-wrap justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => onAction("entrada", p.id)}
                      title="Entrada de lote"
                      className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1.5 text-xs font-medium text-emerald-800 hover:bg-emerald-100"
                    >
                      <PackagePlus className="h-3.5 w-3.5" />
                      Lote
                    </button>
                    <button
                      type="button"
                      onClick={() => onAction("remover-lote", p.id)}
                      disabled={p.estoqueAtual === 0}
                      title="Remover lote (estorno de entrada)"
                      className="inline-flex items-center gap-1 rounded-lg border border-orange-200 bg-orange-50 px-2 py-1.5 text-xs font-medium text-orange-800 hover:bg-orange-100 disabled:opacity-40"
                    >
                      <PackageMinus className="h-3.5 w-3.5" />
                      − Lote
                    </button>
                    <button
                      type="button"
                      onClick={() => onAction("venda", p.id)}
                      disabled={p.estoqueAtual === 0}
                      title="Registrar venda"
                      className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2 py-1.5 text-xs font-medium text-blue-800 hover:bg-blue-100 disabled:opacity-40"
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      Venda
                    </button>
                    <button
                      type="button"
                      onClick={() => onAction("remover-compra", p.id)}
                      title="Remover compra (estorno de venda / devolução)"
                      className="inline-flex items-center gap-1 rounded-lg border border-violet-200 bg-violet-50 px-2 py-1.5 text-xs font-medium text-violet-800 hover:bg-violet-100"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      − Compra
                    </button>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
