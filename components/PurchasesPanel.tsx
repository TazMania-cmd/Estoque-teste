"use client";

import { AlertTriangle, Clock, ShoppingBag, Truck } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import type { ProductWithStatus } from "@/lib/types";

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

interface PurchasesPanelProps {
  products: ProductWithStatus[];
}

export function PurchasesPanel({ products }: PurchasesPanelProps) {
  const totalSugerido = products.reduce(
    (s, p) => s + p.quantidadeSugerida * p.precoCusto,
    0,
  );
  const totalUnidades = products.reduce((s, p) => s + p.quantidadeSugerida, 0);

  if (products.length === 0) {
    return (
      <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <ShoppingBag className="mx-auto h-10 w-10 text-emerald-600" />
        <h3 className="mt-3 text-lg font-semibold text-emerald-900">
          Nenhuma reposição necessária
        </h3>
        <p className="mt-1 text-sm text-emerald-800">
          Todos os produtos estão com estoque saudável. O sistema avisará quando
          for hora de pedir ao fornecedor.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <aside className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <span className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
          <span>
            <p className="font-semibold text-amber-900">
              {products.length} produto(s) precisam de reposição
            </p>
            <p className="mt-1 text-sm text-amber-800">
              Pedido sugerido: <strong>{totalUnidades} unidades</strong> —
              investimento estimado de{" "}
              <strong>{formatBRL(totalSugerido)}</strong>. Considere o{" "}
              <strong>lead time</strong> do fornecedor: peça antes do estoque
              zerar.
            </p>
          </span>
        </span>
      </aside>

      <ul className="space-y-3">
        {products.map((p) => (
          <li
            key={p.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <span className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="min-w-0 flex-1">
                <span className="mb-2 flex flex-wrap items-center gap-2">
                  <StatusBadge status={p.status} />
                  {p.status === "urgent" ? (
                    <span className="text-xs font-semibold uppercase tracking-wide text-red-700">
                      Pedir agora
                    </span>
                  ) : null}
                </span>
                <h3 className="font-semibold text-slate-900">{p.nome}</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Estoque: {p.estoqueAtual} / mínimo {p.estoqueMinimo}
                </p>
                <span className="mt-2 inline-flex items-center gap-1 text-xs text-slate-600">
                  <Clock className="h-3.5 w-3.5" />
                  Lead time: {p.leadTimeDias} dias — encomende com antecedência
                </span>
              </span>

              <span className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
                <span className="rounded-lg bg-slate-900 px-4 py-3 text-center text-white">
                  <span className="block text-xs font-medium uppercase tracking-wide text-slate-300">
                    Qtd. sugerida
                  </span>
                  <span className="text-2xl font-bold">
                    {p.quantidadeSugerida}
                  </span>
                  <span className="block text-xs text-slate-400">
                    meta: {p.estoqueMinimo * 2} un.
                  </span>
                </span>
                <span className="flex items-center gap-2 text-sm text-slate-600">
                  <Truck className="h-4 w-4" />
                  {formatBRL(p.quantidadeSugerida * p.precoCusto)}
                </span>
              </span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
