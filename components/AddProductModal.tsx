"use client";

import { X, PlusCircle } from "lucide-react";
import { useState } from "react";
import type { KnifeProduct } from "@/lib/types";

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (product: Omit<KnifeProduct, "id">) => void;
}

export function AddProductModal({ open, onClose, onConfirm }: AddProductModalProps) {
  const [formData, setFormData] = useState({
    nome: "",
    precoCusto: 0,
    precoVenda: 0,
    estoqueAtual: 0,
    estoqueMinimo: 0,
    leadTimeDias: 0,
  });

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onConfirm(formData);
    setFormData({
      nome: "",
      precoCusto: 0,
      precoVenda: 0,
      estoqueAtual: 0,
      estoqueMinimo: 0,
      leadTimeDias: 0,
    });
  }

  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <article className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <button onClick={onClose} className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100">
          <X className="h-5 w-5" />
        </button>

        <header className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
            <PlusCircle className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Novo Produto</h2>
            <p className="text-sm text-slate-500">Cadastre uma nova faca no sistema</p>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Nome da Faca</label>
            <input
              required
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-slate-900 focus:ring-0"
              placeholder="Ex: Faca Gaúcha 10 polegadas"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Preço Custo (R$)</label>
            <input
              required
              type="number"
              value={formData.precoCusto}
              onChange={(e) => setFormData({ ...formData, precoCusto: Number(e.target.value) })}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Preço Venda (R$)</label>
            <input
              required
              type="number"
              value={formData.precoVenda}
              onChange={(e) => setFormData({ ...formData, precoVenda: Number(e.target.value) })}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Estoque Inicial</label>
            <input
              required
              type="number"
              value={formData.estoqueAtual}
              onChange={(e) => setFormData({ ...formData, estoqueAtual: Number(e.target.value) })}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Estoque Mínimo</label>
            <input
              required
              type="number"
              value={formData.estoqueMinimo}
              onChange={(e) => setFormData({ ...formData, estoqueMinimo: Number(e.target.value) })}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Lead Time (Dias para entrega)</label>
            <input
              required
              type="number"
              value={formData.leadTimeDias}
              onChange={(e) => setFormData({ ...formData, leadTimeDias: Number(e.target.value) })}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5"
            />
          </div>

          <div className="flex gap-3 pt-4 sm:col-span-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Salvar Produto
            </button>
          </div>
        </form>
      </article>
    </section>
  );
}
