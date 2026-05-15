export type StockStatus = "ok" | "attention" | "urgent";

export interface KnifeProduct {
  id: string;
  nome: string;
  precoCusto: number;
  precoVenda: number;
  estoqueAtual: number;
  estoqueMinimo: number;
  leadTimeDias: number;
}

export interface ProductWithStatus extends KnifeProduct {
  status: StockStatus;
  alerta: boolean;
  quantidadeSugerida: number;
  valorInvestidoItem: number;
}
