"use client";

import {
  AlertTriangle,
  Boxes,
  Clock,
  History as HistoryIcon,
  LayoutDashboard,
  Package,
  Plus,
  ShoppingCart,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ActionModal } from "@/components/ActionModal";
import { AddProductModal } from "@/components/AddProductModal";
import { ConfirmModal } from "@/components/ConfirmModal";
import { CustomOrdersPanel } from "@/components/CustomOrdersPanel";
import { InventoryTable } from "@/components/InventoryTable";
import { PurchasesPanel } from "@/components/PurchasesPanel";
import { HistoryPanel } from "@/components/HistoryPanel";
import { AnalyticsPanel } from "@/components/AnalyticsPanel";
import { StatCard } from "@/components/StatCard";
import { fetchProducts, fetchLogs, fetchCustomOrders, addCustomOrder, updateCustomOrderStatus, deleteCustomOrder, clearLogs, INITIAL_PRODUCTS, updateProductStock, revertLog, addProduct, deleteProduct } from "@/lib/data";
import { calcularDashboard, precisaReposicao } from "@/lib/inventory";
import { calcularDelta, type StockActionType } from "@/lib/stock-actions";
import type { KnifeProduct } from "@/lib/types";

type Tab = "inventario" | "compras" | "historico" | "encomendas" | "analise";

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function DashboardApp() {
  const [products, setProducts] = useState<KnifeProduct[]>(INITIAL_PRODUCTS);
  const [logs, setLogs] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("analise");
  const [modalType, setModalType] = useState<StockActionType | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({
    title: "",
    message: "",
    onConfirm: () => { }
  });

  async function loadData() {
    try {
      const data = await fetchProducts();
      setProducts(data);

      if (tab === "historico" || tab === "analise") {
        const historyData = await fetchLogs();
        setLogs(historyData);
      }

      if (tab === "encomendas") {
        const ordersData = await fetchCustomOrders();
        setOrders(ordersData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [tab]);

  const dashboard = useMemo(() => calcularDashboard(products), [products]);

  const reposicao = useMemo(
    () => dashboard.enriched.filter(precisaReposicao),
    [dashboard.enriched],
  );

  const totalEncomendas = useMemo(() => {
    return orders
      .filter(o => o.status !== "entregue")
      .reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0);
  }, [orders]);

  const selectedProduct = products.find((p) => p.id === selectedId) ?? null;

  function openModal(type: StockActionType, id: string) {
    setSelectedId(id);
    setModalType(type);
  }

  async function handleConfirm(
    productId: string,
    quantity: number,
    action: StockActionType,
  ) {
    const delta = calcularDelta(action, quantity);
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const newStock = Math.max(0, product.estoqueAtual + delta);

    try {
      await updateProductStock(productId, newStock, action, quantity, product.estoqueAtual);
      await loadData();
      setModalType(null);
    } catch (err) {
      alert("Erro ao atualizar o estoque no banco de dados.");
    }
  }

  async function handleAddProduct(newProduct: Omit<KnifeProduct, "id">) {
    try {
      setLoading(true);
      await addProduct(newProduct);
      await loadData();
      setIsAddModalOpen(false);
    } catch (err) {
      alert("Erro ao cadastrar produto.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRevert(logId: string) {
    setConfirmConfig({
      title: "Reverter Movimentação?",
      message: "Isso irá estornar o estoque e apagar este registro permanentemente.",
      onConfirm: async () => {
        try {
          setLoading(true);
          await revertLog(logId);
          await loadData();
        } catch (err) {
          alert("Erro ao reverter movimentação.");
        } finally {
          setLoading(false);
        }
      }
    });
    setIsConfirmOpen(true);
  }

  async function handleDeleteProduct(id: string) {
    setConfirmConfig({
      title: "Excluir Produto?",
      message: "Esta ação não pode ser desfeita e removerá todo o histórico do produto.",
      onConfirm: async () => {
        try {
          setLoading(true);
          await deleteProduct(id);
          await loadData();
        } catch (err) {
          alert("Erro ao excluir produto.");
        } finally {
          setLoading(false);
        }
      }
    });
    setIsConfirmOpen(true);
  }

  async function handleClearLogs() {
    setConfirmConfig({
      title: "Limpar todo o Histórico?",
      message: "Esta ação apagará permanentemente todos os registros de movimentação. Isso não afeta o estoque atual dos produtos.",
      onConfirm: async () => {
        try {
          setLoading(true);
          await clearLogs();
          await loadData();
        } catch (err) {
          alert("Erro ao limpar histórico.");
        } finally {
          setLoading(false);
        }
      }
    });
    setIsConfirmOpen(true);
  }

  async function handleAddOrder(order: any) {
    try {
      await addCustomOrder(order);
      await loadData();
    } catch (err) {
      alert("Erro ao criar encomenda.");
    }
  }

  async function handleUpdateOrderStatus(id: string, status: string) {
    try {
      await updateCustomOrderStatus(id, status);
      await loadData();
    } catch (err) {
      alert("Erro ao atualizar status.");
    }
  }

  async function handleDeleteOrder(id: string) {
    setConfirmConfig({
      title: "Excluir Encomenda?",
      message: "Deseja mesmo remover este pedido? Esta ação é definitiva.",
      onConfirm: async () => {
        try {
          await deleteCustomOrder(id);
          await loadData();
        } catch (err) {
          alert("Erro ao excluir encomenda.");
        }
      }
    });
    setIsConfirmOpen(true);
  }

  if (loading && products.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-900 border-t-transparent mx-auto"></div>
          <p className="text-slate-600 font-medium">Carregando sistema...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6">
        <div>
          <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">
            <Package className="h-3.5 w-3.5" />
            Facas Artesanais — Revenda
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Controle de Estoque
          </h1>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-all shadow-sm active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Novo Produto
        </button>
      </header>

      <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Total em estoque"
          value={`${dashboard.totalUnidades} un.`}
          subtitle={`${products.length} referências`}
          icon={Boxes}
          accent="blue"
        />
        <StatCard
          title="Valor investido"
          value={formatBRL(dashboard.valorInvestido)}
          subtitle="Custo × Quantidade"
          icon={Wallet}
          accent="slate"
        />
        <StatCard
          title="Encomendas Ativas"
          value={formatBRL(totalEncomendas)}
          subtitle={`${orders.filter(o => o.status !== "entregue").length} pedidos em andamento`}
          icon={Clock}
          accent="purple"
        />
        <StatCard
          title="Abaixo do mínimo"
          value={String(dashboard.abaixoMinimo)}
          subtitle="Repor urgente"
          icon={AlertTriangle}
          accent="red"
        />
        <StatCard
          title="Em atenção"
          value={String(dashboard.emAtencao)}
          subtitle={`${reposicao.length} itens no radar`}
          icon={LayoutDashboard}
          accent="amber"
        />
      </section>

      <nav className="mb-6 flex gap-2 border-b border-slate-200 overflow-x-auto">
        {[
          { id: "analise", label: "Inteligência", icon: TrendingUp },
          { id: "inventario", label: "Inventário", icon: LayoutDashboard },
          { id: "encomendas", label: "Encomendas", icon: Clock },
          { id: "compras", label: "Compras", icon: ShoppingCart, count: reposicao.length },
          { id: "historico", label: "Histórico", icon: HistoryIcon },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id as Tab)}
            className={`inline-flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${tab === t.id
              ? "border-slate-900 text-slate-900"
              : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
            {t.count ? (
              <span className="ml-1 rounded-full bg-red-600 px-2 py-0.5 text-xs text-white">
                {t.count}
              </span>
            ) : null}
          </button>
        ))}
      </nav>

      <div className="min-h-[400px]">
        {tab === "inventario" && (
          <>
            <p className="mb-3 text-xs text-slate-500">
              <strong>Lote</strong>: entrada · <strong>Venda</strong>: saída · <strong>Ações</strong> permitem registrar movimentações rápidas.
            </p>
            <InventoryTable
              products={dashboard.enriched}
              onAction={openModal}
              onDelete={handleDeleteProduct}
            />
          </>
        )}

        {tab === "compras" && <PurchasesPanel products={reposicao} />}

        {tab === "analise" && <AnalyticsPanel products={products} logs={logs} />}

        {tab === "historico" && (
          <HistoryPanel logs={logs} onRevert={handleRevert} onClear={handleClearLogs} />
        )}

        {tab === "encomendas" && (
          <CustomOrdersPanel
            orders={orders}
            onAdd={handleAddOrder}
            onUpdateStatus={handleUpdateOrderStatus}
            onDelete={handleDeleteOrder}
          />
        )}
      </div>

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

      <AddProductModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onConfirm={handleAddProduct}
      />

      <ConfirmModal
        open={isConfirmOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmConfig.onConfirm}
      />

      <footer className="mt-12 text-center text-xs text-slate-400">
        Sistema de Gestão RT Facas — Conectado ao Supabase
      </footer>
    </main>
  );
}
