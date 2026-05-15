"use client";

import { X, PackagePlus, ShoppingBag, Undo2, AlertCircle } from "lucide-react";
import { useState } from "react";
import type { KnifeProduct } from "@/lib/types";
import type { StockActionType } from "@/lib/stock-actions";

interface ActionModalProps {
  open: boolean;
  type: StockActionType;
  product: KnifeProduct | null;
  onClose: () => void;
  onConfirm: (productId: string, quantity: number, action: StockActionType) => void;
}

export function ActionModal({ open, type, product, onClose, onConfirm }: ActionModalProps) {
  const [quantity, setQuantity] = useState<number>(0);

  if (!open || !product) return null;

  const isVenda = type === "venda";
  const hasEnoughStock = isVenda ? product.estoqueAtual >= quantity : true;
  const isStockEmpty = isVenda && product.estoqueAtual <= 0;

  const config = {
    entrada: { title: "Entrada de Lote", icon: PackagePlus, color: "bg-emerald-50 text-emerald-600" },
    venda: { title: "Registrar Venda", icon: ShoppingBag, color: "bg-blue-50 text-blue-600" },
    "remover-lote": { title: "Remover Lote", icon: Undo2, color: "bg-amber-50 text-amber-600" },
    "remover-compra": { title: "Remover Venda", icon: Undo2, color: "bg-purple-50 text-purple-600" },
  };

  const current = config[type];
  const Icon = current.icon;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity > 0 && hasEnoughStock) {
      onConfirm(product.id, quantity, type);
      setQuantity(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${current.color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">{current.title}</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="mb-6 rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Produto</p>
          <p className="text-lg font-bold text-slate-900">{product.nome}</p>
          <div className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold shadow-sm ${isStockEmpty ? 'bg-red-50 text-red-600' : 'bg-white text-slate-600'}`}>
            Estoque atual: {product.estoqueAtual} un.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Quantidade</label>
            <input
              autoFocus
              type="number"
              min="1"
              max={isVenda ? product.estoqueAtual : undefined}
              value={quantity || ""}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className={`mt-1 w-full rounded-xl border px-4 py-3 text-lg font-bold transition-all focus:ring-0 ${
                !hasEnoughStock 
                ? "border-red-300 bg-red-50 text-red-900 focus:border-red-500" 
                : "border-slate-200 bg-white text-slate-900 focus:border-slate-900"
              }`}
              placeholder="0"
            />
            {!hasEnoughStock && (
              <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-red-600">
                <AlertCircle className="h-3.5 w-3.5" />
                Quantidade indisponível no estoque!
              </p>
            )}
          </div>

          {quantity > 0 && (
            <div className={`rounded-xl p-4 transition-all animate-in fade-in slide-in-from-bottom-2 ${isVenda ? 'bg-blue-50 border border-blue-100' : 'bg-emerald-50 border border-emerald-100'}`}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">
                  {isVenda ? "Valor Total da Venda" : "Investimento do Lote"}
                </span>
                <span className={`text-lg font-bold ${isVenda ? 'text-blue-700' : 'text-emerald-700'}`}>
                  {(quantity * (isVenda ? product.precoVenda : product.precoCusto)).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </span>
              </div>
              <p className="mt-1 text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                {quantity} un. × { (isVenda ? product.precoVenda : product.precoCusto).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) }
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!quantity || !hasEnoughStock || isStockEmpty}
              className="flex-1 rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-all shadow-sm active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
