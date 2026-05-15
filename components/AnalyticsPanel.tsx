"use client";

import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Cell, PieChart, Pie, Legend
} from "recharts";
import { TrendingUp, DollarSign, Package, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AnalyticsPanelProps {
  products: any[];
  logs: any[];
}

export function AnalyticsPanel({ products, logs }: AnalyticsPanelProps) {
  const stats = useMemo(() => {
    // 1. Processar Faturamento por Mês (últimos 6 meses)
    const salesLogs = logs.filter(l => l.tipo === "venda");
    const monthlyData: Record<string, number> = {};

    salesLogs.forEach(log => {
      const date = new Date(log.createdAt);
      const monthYear = format(date, "MMM yy", { locale: ptBR });
      const product = products.find(p => p.id === log.productId);
      const totalSale = log.quantidade * (product?.precoVenda || 0);

      monthlyData[monthYear] = (monthlyData[monthYear] || 0) + totalSale;
    });

    const faturamentoChart = Object.entries(monthlyData).map(([name, total]) => ({
      name,
      total
    })).reverse();

    // 2. Top 5 Produtos por Lucro Total (Venda - Custo)
    const profitByProduct = products.map(p => {
      const soldQty = salesLogs
        .filter(l => l.productId === p.id)
        .reduce((sum, l) => sum + l.quantidade, 0);

      const unitProfit = p.precoVenda - p.precoCusto;
      return {
        nome: p.nome.split(" ")[0] + " " + (p.nome.split(" ")[1] || ""),
        lucroTotal: soldQty * unitProfit,
        quantidade: soldQty
      };
    }).sort((a, b) => b.lucroTotal - a.lucroTotal).slice(0, 5);

    // 3. Status de Estoque (Pizza)
    const stockStatus = [
      { name: "Saudável", value: products.filter(p => p.estoqueAtual > p.estoqueMinimo).length, color: "#10b981" },
      { name: "Abaixo do Mínimo", value: products.filter(p => p.estoqueAtual <= p.estoqueMinimo && p.estoqueAtual > 0).length, color: "#f59e0b" },
      { name: "Zerado", value: products.filter(p => p.estoqueAtual === 0).length, color: "#ef4444" },
    ];

    const totalFaturado = salesLogs.reduce((acc, log) => {
      const product = products.find(p => p.id === log.productId);
      return acc + (log.quantidade * (product?.precoVenda || 0));
    }, 0);

    const totalLucro = salesLogs.reduce((acc, log) => {
      const product = products.find(p => p.id === log.productId);
      if (!product) return acc;
      return acc + (log.quantidade * (product.precoVenda - product.precoCusto));
    }, 0);

    return { faturamentoChart, profitByProduct, stockStatus, totalFaturado, totalLucro };
  }, [products, logs]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Cards de Resumo Rápido */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
              <TrendingUp className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium text-slate-500">Vendas Totais</span>
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900">
            {stats.totalFaturado.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
              <DollarSign className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium text-slate-500">Lucro Estimado</span>
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900">
            {stats.totalLucro.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-50 p-2 text-amber-600">
              <Package className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium text-slate-500">Margem Média</span>
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900">
            {stats.totalFaturado > 0 ? ((stats.totalLucro / stats.totalFaturado) * 100).toFixed(1) : 0}%
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-red-50 p-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium text-slate-500">Itens Críticos</span>
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900">
            {products.filter(p => p.estoqueAtual <= p.estoqueMinimo).length}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Gráfico de Faturamento */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-6 font-bold text-slate-900">Faturamento por Mês</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.faturamentoChart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => value?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                />
                <Line type="monotone" dataKey="total" stroke="#0f172a" strokeWidth={3} dot={{ r: 4, fill: '#0f172a' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico Top Produtos */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-6 font-bold text-slate-900">Top 5 Produtos (Mais Lucrativos)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.profitByProduct} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="nome" type="category" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 11 }} width={100} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => value?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                />
                <Bar dataKey="lucroTotal" radius={[0, 4, 4, 0]}>
                  {stats.profitByProduct.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#0f172a', '#1e293b', '#334155', '#475569', '#64748b'][index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status de Estoque */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h3 className="mb-6 font-bold text-slate-900">Saúde do Estoque</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.stockStatus}
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.stockStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="middle" align="right" layout="vertical" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
