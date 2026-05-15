"use client";

import { RotateCcw, History as HistoryIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface HistoryPanelProps {
  logs: any[];
  onRevert: (logId: string) => void;
}

export function HistoryPanel({ logs, onRevert }: HistoryPanelProps) {
  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-400">
        <HistoryIcon className="mb-4 h-12 w-12 opacity-20" />
        <p>Nenhuma movimentação registrada ainda.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">Data</th>
            <th className="px-4 py-3">Produto</th>
            <th className="px-4 py-3">Tipo</th>
            <th className="px-4 py-3 text-right">Qtd</th>
            <th className="px-4 py-3 text-right">Estoque</th>
            <th className="px-4 py-3 text-right">Ação</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {logs.map((log) => {
            const isAddition = log.tipo === "entrada" || log.tipo === "remover-compra";
            
            return (
              <tr key={log.id} className="hover:bg-slate-50/50">
                <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                  {format(new Date(log.createdAt), "dd MMM, HH:mm", { locale: ptBR })}
                </td>
                <td className="px-4 py-3 font-medium text-slate-900">
                  {log.products?.nome || "Produto removido"}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 font-medium ${isAddition ? "text-emerald-600" : "text-amber-600"}`}>
                    {isAddition ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {log.tipo.replace("-", " ")}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-mono text-slate-600">
                  {log.quantidade}
                </td>
                <td className="px-4 py-3 text-right text-slate-500">
                  {log.estoqueAnterior} → <span className="font-bold text-slate-900">{log.estoqueNovo}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onRevert(log.id)}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-red-600 transition-colors"
                    title="Reverter movimentação"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Reverter
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
