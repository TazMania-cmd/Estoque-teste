"use client";

import {
  AlertTriangle,
  Boxes,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Wallet,
} from "lucide-react";
import { useMemo, useState } from "react";
import { ActionModal } from "@/components/ActionModal";
import { InventoryTable } from "@/components/InventoryTable";
import { PurchasesPanel } from "@/components/PurchasesPanel";
import { StatCard } from "@/components/StatCard";
import { INITIAL_PRODUCTS } from "@/lib/data";
import { calcularDashboard, precisaReposicao } from "@/lib/inventory";
import { calcularDelta, type StockActionType } from "@/lib/stock-actions";
import type { KnifeProduct } from "@/lib/types";

type Tab = "inventario" | "compras";

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function DashboardApp() {
  const [products, setProducts] = useState<KnifeProduct[]>(INITIAL_PRODUCTS);
  const [tab, setTab] = useState<Tab>("inventario");
  const [modalType, setModalType] = useState<StockActionType | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const dashboard = useMemo(() => calcularDashboard(products), [products]);

  const reposicao = useMemo(
    () => dashboard.enriched.filter(precisaReposicao),
    [dashboard.enriched],
  );

  const selectedProduct = products.find((p) => p.id === selectedId) ?? null;

  function openModal(type: StockActionType, id: string) {
    setSelectedId(id);
    setModalType(type);
  }

  function handleConfirm(
    productId: string,
    quantity: number,
    action: StockActionType,
  ) {
    const delta = calcularDelta(action, quantity);
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        return {
          ...p,
          estoqueAtual: Math.max(0, p.estoqueAtual + delta),
        };
      }),
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 border-b border-slate-200 pb-6">
        <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">
          <Package className="h-3.5 w-3.5" />
          Facas Artesanais — Revenda
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Controle de Estoque
        </h1>
        <p className="mt-1 max-w-2xl text-slate-600">
          Dashboard focado em compras: saiba a hora exata de repor facas junto
          ao fornecedor, com base no estoque mínimo e no lead time.
        </p>
      </header>

      <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total em estoque"
          value={`${dashboard.totalUnidades} un.`}
          subtitle={`${products.length} referências cadastradas`}
          icon={Boxes}
          accent="blue"
        />
        <StatCard
          title="Valor investido"
          value={formatBRL(dashboard.valorInvestido)}
          subtitle="Soma do custo × quantidade"
          icon={Wallet}
          accent="slate"
        />
        <StatCard
          title="Abaixo do mínimo"
          value={String(dashboard.abaixoMinimo)}
          subtitle="Repor urgente — pedir agora"
          icon={AlertTriangle}
          accent="red"
        />
        <StatCard
          title="Em atenção"
          value={String(dashboard.emAtencao)}
          subtitle={`${reposicao.length} itens no radar de compras`}
          icon={LayoutDashboard}
          accent="amber"
        />
      </section>

      {reposicao.length > 0 ? (
        <aside className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            <strong>Ação recomendada:</strong> há produtos abaixo do estoque
            mínimo ou na zona de atenção. Acesse a aba{" "}
            <strong>Compras</strong> para ver quantidades sugeridas e considere
            o lead time antes que o estoque zere.
          </p>
        </aside>
      ) : null}

      <nav className="mb-6 flex gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setTab("inventario")}
          className={`inline-flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
            tab === "inventario"
              ? "border-slate-900 text-slate-900"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <LayoutDashboard className="h-4 w-4" />
          Inventário
        </button>
        <button
          type="button"
          onClick={() => setTab("compras")}
          className={`inline-flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
            tab === "compras"
              ? "border-slate-900 text-slate-900"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <ShoppingCart className="h-4 w-4" />
          Compras
          {reposicao.length > 0 ? (
            <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs text-white">
              {reposicao.length}
            </span>
          ) : null}
        </button>
      </nav>

      {tab === "inventario" ? (
        <>
          <p className="mb-3 text-xs text-slate-500">
            <strong>Lote</strong> / <strong>− Lote</strong>: entrada e estorno
            de lote · <strong>Venda</strong> / <strong>− Compra</strong>: venda
            e estorno (devolução)
          </p>
          <InventoryTable
            products={dashboard.enriched}
            onAction={openModal}
          />
        </>
      ) : (
        <PurchasesPanel products={reposicao} />
      )}

      <ActionModal
        open={modalType !== null}
        type={modalType ?? "entrada"}
        product={selectedProduct}
        onClose={() => {
          setModalType(null);
          setSelectedId(null);
        }}
        onConfirm={handleConfirm}
      />

      <footer className="mt-12 text-center text-xs text-slate-400">
        Protótipo — dados mock em memória. Verde: OK · Amarelo: atenção ·
        Vermelho: repor urgente.
      </footer>
    </main>
  );
}
