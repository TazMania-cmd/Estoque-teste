import type { KnifeProduct } from "./types";
import { supabase } from "./supabase";

export const INITIAL_PRODUCTS: KnifeProduct[] = [
  {
    id: "1",
    nome: "Faca Chef Santoku 18cm — Aço Damasco",
    precoCusto: 0,
    precoVenda: 0,
    estoqueAtual: 0,
    estoqueMinimo: 0,
    leadTimeDias: 0,
  },
  {
    id: "2",
    nome: "Faca Paring 9cm — Cabo Olmo",
    precoCusto: 0,
    precoVenda: 0,
    estoqueAtual: 0,
    estoqueMinimo: 0,
    leadTimeDias: 0,
  },
  {
    id: "3",
    nome: "Faca Bread 20cm — Série Artesão",
    precoCusto: 0,
    precoVenda: 0,
    estoqueAtual: 0,
    estoqueMinimo: 0,
    leadTimeDias: 0,
  },
  {
    id: "4",
    nome: "Faca Utility 15cm — Carbono Forjado",
    precoCusto: 0,
    precoVenda: 0,
    estoqueAtual: 0,
    estoqueMinimo: 0,
    leadTimeDias: 0,
  },
  {
    id: "5",
    nome: "Kit 3 Facas — Presente Premium",
    precoCusto: 0,
    precoVenda: 0,
    estoqueAtual: 0,
    estoqueMinimo: 0,
    leadTimeDias: 0,
  },
  {
    id: "6",
    nome: "Faca Filet 16cm — Aço Inox 67 Camadas",
    precoCusto: 0,
    precoVenda: 0,
    estoqueAtual: 0,
    estoqueMinimo: 0,
    leadTimeDias: 0,
  },
  {
    id: "7",
    nome: "Faca Nakiri 17cm — Cabo Ébano",
    precoCusto: 0,
    precoVenda: 0,
    estoqueAtual: 0,
    estoqueMinimo: 0,
    leadTimeDias: 0,
  },
  {
    id: "8",
    nome: "Chaira Diamantada 26cm",
    precoCusto: 0,
    precoVenda: 0,
    estoqueAtual: 0,
    estoqueMinimo: 0,
    leadTimeDias: 0,
  },
];

export async function fetchProducts(): Promise<KnifeProduct[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("nome");

  if (error) {
    console.error("Erro ao buscar produtos:", error);
    return INITIAL_PRODUCTS;
  }

  return data || [];
}

export async function updateProductStock(id: string, newStock: number) {
  const { error } = await supabase
    .from("products")
    .update({ estoqueAtual: newStock })
    .eq("id", id);

  if (error) {
    console.error("Erro ao atualizar estoque:", error);
    throw error;
  }
}
