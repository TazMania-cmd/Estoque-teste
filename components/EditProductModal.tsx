"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import type { KnifeProduct } from "@/lib/types";

interface EditProductModalProps {
  open: boolean;
  product: KnifeProduct | null;
  onClose: () => void;
  onConfirm: (id: string, updates: Partial<KnifeProduct>) => void;
}

export function EditProductModal({ open, product, onClose, onConfirm }: EditProductModalProps) {
  const [formData, setFormData] = useState<Partial<KnifeProduct>>({
    nome: "",
    precoCusto: 0,
    precoVenda: 0,
    estoqueMinimo: 0,
    leadTimeDias: 0,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        nome: product.nome,
        precoCusto: product.precoCusto,
        precoVenda: product.precoVenda,
        estoqueMinimo: product.estoqueMinimo,
        leadTimeDias: product.leadTimeDias,
      });
    }
  }, [product]);

  if (!open || !product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(product.id, formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <header className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Editar Produto</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700">Nome do Produto</label>
            <input
              required
              autoFocus
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Preço Custo</label>
              <div className="relative mt-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">R$</span>
                <input
                  required
                  type="text"
                  value={Number(formData.precoCusto).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  onChange={(e) => {
                    const cleanValue = e.target.value.replace(/\D/g, "");
                    setFormData({ ...formData, precoCusto: Number(cleanValue) / 100 });
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Preço Venda</label>
              <div className="relative mt-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">R$</span>
                <input
                  required
                  type="text"
                  value={Number(formData.precoVenda).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  onChange={(e) => {
                    const cleanValue = e.target.value.replace(/\D/g, "");
                    setFormData({ ...formData, precoVenda: Number(cleanValue) / 100 });
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Estoque Mínimo</label>
              <input
                required
                type="number"
                value={formData.estoqueMinimo}
                onChange={(e) => setFormData({ ...formData, estoqueMinimo: Number(e.target.value) })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Lead Time (Dias)</label>
              <input
                required
                type="number"
                value={formData.leadTimeDias}
                onChange={(e) => setFormData({ ...formData, leadTimeDias: Number(e.target.value) })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-all shadow-sm active:scale-95"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
