import {
  AlertTriangle,
  Boxes,
  History as HistoryIcon,
  LayoutDashboard,
  Package,
  Plus,
  ShoppingCart,
  Wallet,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ActionModal } from "@/components/ActionModal";
import { AddProductModal } from "@/components/AddProductModal";
import { InventoryTable } from "@/components/InventoryTable";
import { PurchasesPanel } from "@/components/PurchasesPanel";
import { HistoryPanel } from "@/components/HistoryPanel";
import { StatCard } from "@/components/StatCard";
import { fetchProducts, fetchLogs, INITIAL_PRODUCTS, updateProductStock, revertLog, addProduct } from "@/lib/data";
import { calcularDashboard, precisaReposicao } from "@/lib/inventory";
import { calcularDelta, type StockActionType } from "@/lib/stock-actions";
import type { KnifeProduct } from "@/lib/types";

type Tab = "inventario" | "compras" | "historico";

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function DashboardApp() {
  const [products, setProducts] = useState<KnifeProduct[]>(INITIAL_PRODUCTS);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("inventario");
  const [modalType, setModalType] = useState<StockActionType | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  async function loadData() {
    try {
      const data = await fetchProducts();
      setProducts(data);
      if (tab === "historico") {
        const historyData = await fetchLogs();
        setLogs(historyData);
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
    if (!confirm("Tem certeza que deseja reverter esta movimentação?")) return;
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

      <nav className="mb-6 flex gap-2 border-b border-slate-200 overflow-x-auto">
        {[
          { id: "inventario", label: "Inventário", icon: LayoutDashboard },
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
            />
          </>
        )}
        
        {tab === "compras" && <PurchasesPanel products={reposicao} />}
        
        {tab === "historico" && (
          <HistoryPanel logs={logs} onRevert={handleRevert} />
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

      <footer className="mt-12 text-center text-xs text-slate-400">
        Sistema de Gestão RT Facas — Conectado ao Supabase
      </footer>
    </main>
  );
}
