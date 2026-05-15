import type { KnifeProduct, ProductWithStatus, StockStatus } from "./types";

/** Meta de reposição: estoque alvo = 2× o mínimo */
export function calcularQuantidadeSugerida(produto: KnifeProduct): number {
  const meta = produto.estoqueMinimo * 2;
  return Math.max(0, meta - produto.estoqueAtual);
}

export function calcularStatus(produto: KnifeProduct): StockStatus {
  const { estoqueAtual, estoqueMinimo } = produto;

  if (estoqueAtual <= estoqueMinimo) {
    return "urgent";
  }

  if (estoqueAtual <= Math.ceil(estoqueMinimo * 1.5)) {
    return "attention";
  }

  return "ok";
}

export function enrichProduct(produto: KnifeProduct): ProductWithStatus {
  const status = calcularStatus(produto);
  return {
    ...produto,
    status,
    alerta: status !== "ok", // Adicionando o campo que estava faltando
    quantidadeSugerida: calcularQuantidadeSugerida(produto),
    valorInvestidoItem: produto.precoCusto * produto.estoqueAtual,
  };
}

export function precisaReposicao(produto: KnifeProduct): boolean {
  return calcularStatus(produto) !== "ok";
}

export function calcularDashboard(produtos: KnifeProduct[]) {
  const enriched = produtos.map(enrichProduct);

  const totalUnidades = produtos.reduce((s, p) => s + p.estoqueAtual, 0);
  const valorInvestido = produtos.reduce(
    (s, p) => s + p.precoCusto * p.estoqueAtual,
    0,
  );
  const abaixoMinimo = enriched.filter((p) => p.status === "urgent").length;
  const emAtencao = enriched.filter((p) => p.status === "attention").length;

  return {
    totalUnidades,
    valorInvestido,
    abaixoMinimo,
    emAtencao,
    enriched,
  };
}

export const STATUS_LABELS: Record<
  StockStatus,
  { label: string; description: string }
> = {
  ok: { label: "OK", description: "Estoque saudável" },
  attention: {
    label: "Atenção",
    description: "Considere pedir ao fornecedor em breve",
  },
  urgent: {
    label: "Repor urgente",
    description: "Abaixo do estoque mínimo — pedir agora",
  },
};
