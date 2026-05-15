"use client";

import { Trash2 } from "lucide-react";
import type { ProductWithStatus } from "@/lib/types";
import type { StockActionType } from "@/lib/stock-actions";

interface InventoryTableProps {
  products: ProductWithStatus[];
  onAction: (type: StockActionType, id: string) => void;
  onDelete: (id: string) => void;
}

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function InventoryTable({ products, onAction, onDelete }: InventoryTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-6 py-4">Nome do Produto</th>
              <th className="px-6 py-4">Preços</th>
              <th className="px-6 py-4 text-center">Estoque Atual</th>
              <th className="px-6 py-4 text-center">Nível Mínimo</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => (
              <tr key={product.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-semibold text-slate-900">{product.nome}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-0.5 text-xs">
                    <span className="text-slate-400">Custo: {formatBRL(product.precoCusto)}</span>
                    <span className="font-bold text-slate-900">Venda: {formatBRL(product.precoVenda)}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-1.5 w-24 rounded-full bg-slate-100 overflow-hidden">
                      <div 
                        className={`h-full transition-all ${product.alerta ? 'bg-red-500' : 'bg-slate-900'}`} 
                        style={{ width: `${Math.min(100, (product.estoqueAtual / (product.estoqueMinimo || 1)) * 100)}%` }} 
                      />
                    </div>
                    <span className={`text-xs font-bold ${product.alerta ? 'text-red-600' : 'text-slate-500'}`}>
                      {product.estoqueAtual} un.
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center text-xs font-bold text-slate-500">
                  {product.estoqueMinimo} un.
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onAction("entrada", product.id)}
                      className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800 transition-all"
                    >
                      Lote
                    </button>
                    <button
                      onClick={() => onAction("venda", product.id)}
                      disabled={product.estoqueAtual <= 0}
                      className={`rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold transition-all ${
                        product.estoqueAtual <= 0 
                        ? "opacity-30 cursor-not-allowed bg-slate-50 text-slate-400" 
                        : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      Venda
                    </button>
                    <button
                      onClick={() => onDelete(product.id)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Excluir produto"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
