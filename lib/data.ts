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

export async function addProduct(product: Omit<KnifeProduct, "id">) {
  const { data, error } = await supabase
    .from("products")
    .insert([product])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProductStock(
  id: string, 
  newStock: number, 
  actionType: string, 
  quantity: number,
  previousStock: number
) {
  // 1. Atualiza o produto
  const { error: updateError } = await supabase
    .from("products")
    .update({ estoqueAtual: newStock })
    .eq("id", id);

  if (updateError) throw updateError;

  // 2. Registra no histórico
  const { error: logError } = await supabase
    .from("inventory_logs")
    .insert([{
      productId: id,
      tipo: actionType,
      quantidade: quantity,
      estoqueAnterior: previousStock,
      estoqueNovo: newStock
    }]);

  if (logError) console.error("Erro ao gerar log:", logError);
}

export async function fetchLogs() {
  const { data, error } = await supabase
    .from("inventory_logs")
    .select(`
      *,
      products ( nome )
    `)
    .order("createdAt", { ascending: false })
    .limit(50);

  if (error) throw error;
  return data;
}

export async function revertLog(logId: string) {
  // 1. Busca o log original
  const { data: log, error: fetchError } = await supabase
    .from("inventory_logs")
    .select("*")
    .eq("id", logId)
    .single();

  if (fetchError) throw fetchError;

  // 2. Busca o estoque atual do produto
  const { data: product, error: prodError } = await supabase
    .from("products")
    .select("estoqueAtual")
    .eq("id", log.productId)
    .single();

  if (prodError) throw prodError;

  // 3. Calcula o estorno
  // Se o log foi uma adição (entrada/remover-compra), subtraímos. 
  // Se foi uma subtração (venda/remover-lote), somamos.
  const diff = log.estoqueNovo - log.estoqueAnterior;
  const revertedStock = Math.max(0, product.estoqueAtual - diff);

  // 4. Atualiza o produto
  await supabase.from("products").update({ estoqueAtual: revertedStock }).eq("id", log.productId);

  // 5. Remove o log ou marca como revertido (vamos remover para simplificar)
  await supabase.from("inventory_logs").delete().eq("id", logId);
}
