"use client";

import { History as HistoryIcon, PackagePlus, RotateCcw, ShoppingBag, Trash2, Undo2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface HistoryLog {
  id: string;
  tipo: string;
  quantidade: number;
  estoqueAnterior: number;
  estoqueNovo: number;
  createdAt: string;
  products: {
    nome: string;
  } | null;
}

interface HistoryPanelProps {
  logs: HistoryLog[];
  onRevert: (id: string) => void;
  onClear: () => void;
}

export function HistoryPanel({ logs, onRevert, onClear }: HistoryPanelProps) {
  const getLogConfig = (tipo: string) => {
    switch (tipo) {
      case "entrada":
        return { label: "Entrada de Lote", color: "bg-emerald-100 text-emerald-700", icon: PackagePlus };
      case "venda":
        return { label: "Venda Realizada", color: "bg-blue-100 text-blue-700", icon: ShoppingBag };
      case "remover-lote":
        return { label: "Estorno de Entrada", color: "bg-amber-100 text-amber-700", icon: Undo2 };
      case "remover-compra":
        return { label: "Cancelamento de Venda", color: "bg-purple-100 text-purple-700", icon: Undo2 };
      default:
        return { label: tipo, color: "bg-slate-100 text-slate-700", icon: HistoryIcon };
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Histórico de Movimentações</h2>
          <p className="text-sm text-slate-500">Acompanhe entradas, saídas e estornos do seu estoque</p>
        </div>
        {logs.length > 0 && (
          <button
            onClick={onClear}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 transition-all shadow-sm"
          >
            <Trash2 className="h-4 w-4" />
            Limpar Histórico
          </button>
        )}
      </header>

      {logs.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-sm">
          <HistoryIcon className="mx-auto mb-4 h-12 w-12 text-slate-300" />
          <p>Nenhuma movimentação registrada ainda.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4">Data e Hora</th>
                  <th className="px-6 py-4">Produto</th>
                  <th className="px-6 py-4">Tipo de Movimentação</th>
                  <th className="px-6 py-4 text-center">Fluxo de Estoque</th>
                  <th className="px-6 py-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => {
                  const config = getLogConfig(log.tipo);
                  const Icon = config.icon;

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                        {format(new Date(log.createdAt), "dd MMM, HH:mm", { locale: ptBR })}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-900">{log.products?.nome || "Produto Removido"}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${config.color}`}>
                          <Icon className="h-3.5 w-3.5" />
                          {config.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <span className="w-8 text-right font-medium text-slate-400">{log.estoqueAnterior}</span>
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                            →
                          </div>
                          <span className="w-8 text-left font-bold text-slate-900">{log.estoqueNovo}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => onRevert(log.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                          title="Reverter movimentação"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          Reverter
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
