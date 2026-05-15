"use client";

import {
  PackageMinus,
  PackagePlus,
  RotateCcw,
  ShoppingCart,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  STOCK_ACTION_CONFIG,
  type StockActionType,
} from "@/lib/stock-actions";
import type { KnifeProduct } from "@/lib/types";

interface ActionModalProps {
  open: boolean;
  type: StockActionType;
  product: KnifeProduct | null;
  onClose: () => void;
  onConfirm: (
    productId: string,
    quantity: number,
    type: StockActionType,
  ) => void;
}

const ICONS = {
  entrada: PackagePlus,
  venda: ShoppingCart,
  "remover-lote": PackageMinus,
  "remover-compra": RotateCcw,
} as const;

const STYLES: Record<
  StockActionType,
  { icon: string; button: string }
> = {
  entrada: {
    icon: "bg-emerald-100 text-emerald-700",
    button: "bg-emerald-600 hover:bg-emerald-700",
  },
  venda: {
    icon: "bg-blue-100 text-blue-700",
    button: "bg-blue-600 hover:bg-blue-700",
  },
  "remover-lote": {
    icon: "bg-orange-100 text-orange-700",
    button: "bg-orange-600 hover:bg-orange-700",
  },
  "remover-compra": {
    icon: "bg-violet-100 text-violet-700",
    button: "bg-violet-600 hover:bg-violet-700",
  },
};

export function ActionModal({
  open,
  type,
  product,
  onClose,
  onConfirm,
}: ActionModalProps) {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (open) setQuantity(1);
  }, [open, product?.id, type]);

  if (!open || !product) return null;

  const config = STOCK_ACTION_CONFIG[type];
  const Icon = ICONS[type];
  const style = STYLES[type];
  const maxQty = config.limitsToCurrentStock ? product.estoqueAtual : 9999;
  const exceedsStock =
    config.limitsToCurrentStock && quantity > product.estoqueAtual;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Ensure the product exists before accessing its fields.
    if (!product) return;
    if (quantity < 1 || exceedsStock) return;
    onConfirm(product.id, quantity, type);
    onClose();
  }

  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Fechar"
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <article className="relative w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-5 w-5" />
        </button>

        <header className="mb-4 flex items-center gap-3">
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-lg ${style.icon}`}
          >
            <Icon className="h-5 w-5" />
          </span>
          <span>
            <h2 className="text-lg font-semibold text-slate-900">
              {config.title}
            </h2>
            <p className="text-sm text-slate-500 line-clamp-2">{product.nome}</p>
          </span>
        </header>

        <p className="mb-3 text-sm text-slate-600">{config.description}</p>

        <p className="mb-4 text-sm text-slate-600">
          Estoque atual:{" "}
          <strong className="text-slate-900">{product.estoqueAtual} un.</strong>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Quantidade
            </span>
            <input
              type="number"
              min={1}
              max={maxQty}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </label>

          {exceedsStock ? (
            <p className="text-sm text-red-600">
              Quantidade maior que o estoque disponível ({product.estoqueAtual}{" "}
              un.).
            </p>
          ) : null}

          <span className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={exceedsStock || quantity < 1}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50 ${style.button}`}
            >
              {config.confirmLabel}
            </button>
          </span>
        </form>
      </article>
    </section>
  );
}
