"use client";

import { AlertTriangle, Clock, ShoppingBag, Truck } from "lucide-react";

interface PurchasesPanelProps {
  products: any[];
}

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function PurchasesPanel({ products }: PurchasesPanelProps) {
  const totalSugerido = products.reduce(
    (s, p) => s + (p.estoqueMinimo * 2 - p.estoqueAtual) * p.precoCusto,
    0,
  );
  const totalUnidades = products.reduce((s, p) => s + (p.estoqueMinimo * 2 - p.estoqueAtual), 0);

  if (products.length === 0) {
    return (
      <section className="rounded-2xl border border-emerald-100 bg-emerald-50 p-12 text-center">
        <ShoppingBag className="mx-auto h-12 w-12 text-emerald-600" />
        <h3 className="mt-4 text-xl font-bold text-emerald-900">
          Tudo sob controle!
        </h3>
        <p className="mt-2 text-sm text-emerald-700 max-w-md mx-auto">
          Seu estoque está saudável. O sistema avisará automaticamente quando os produtos atingirem o nível de reposição.
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-amber-900">
              Atenção: {products.length} itens precisam de reposição
            </h3>
            <p className="mt-1 text-sm text-amber-700">
              Sugestão de compra total: <strong>{totalUnidades} unidades</strong>. 
              Investimento aproximado: <strong className="text-amber-900">{formatBRL(totalSugerido)}</strong>.
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-4">
        {products.map((p) => {
          const qtdSugerida = Math.max(0, p.estoqueMinimo * 2 - p.estoqueAtual);
          return (
            <div
              key={p.id}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-bold text-slate-900">{p.nome}</h4>
                    {p.alerta && (
                      <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-600">
                        Crítico
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5 font-medium">
                      Estoque: <span className="text-slate-900">{p.estoqueAtual}</span> / {p.estoqueMinimo} un.
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      Lead Time: {p.leadTimeDias} dias
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6 border-t border-slate-50 pt-4 sm:border-0 sm:pt-0">
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Custo Total</p>
                    <p className="text-lg font-bold text-slate-900">{formatBRL(qtdSugerida * p.precoCusto)}</p>
                  </div>
                  <div className="flex h-14 w-14 flex-col items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg transform transition-transform group-hover:scale-105">
                    <span className="text-[10px] font-bold uppercase leading-none opacity-60">Pedir</span>
                    <span className="text-xl font-black">{qtdSugerida}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
