export type StockActionType =
  | "entrada"
  | "venda"
  | "remover-lote"
  | "remover-compra";

export function calcularDelta(
  action: StockActionType,
  quantity: number,
): number {
  switch (action) {
    case "entrada":
    case "remover-compra":
      return quantity;
    case "venda":
    case "remover-lote":
      return -quantity;
  }
}

export const STOCK_ACTION_CONFIG: Record<
  StockActionType,
  {
    title: string;
    description: string;
    confirmLabel: string;
    limitsToCurrentStock: boolean;
  }
> = {
  entrada: {
    title: "Entrada de lote",
    description: "Adiciona unidades ao estoque (recebimento do fornecedor).",
    confirmLabel: "Confirmar entrada",
    limitsToCurrentStock: false,
  },
  venda: {
    title: "Registrar venda",
    description: "Remove unidades do estoque (venda ao cliente).",
    confirmLabel: "Confirmar venda",
    limitsToCurrentStock: true,
  },
  "remover-lote": {
    title: "Remover lote",
    description:
      "Estorna uma entrada de lote registrada por engano (reduz o estoque).",
    confirmLabel: "Confirmar remoção",
    limitsToCurrentStock: true,
  },
  "remover-compra": {
    title: "Remover compra",
    description:
      "Estorna uma venda registrada por engano ou registra devolução (repõe o estoque).",
    confirmLabel: "Confirmar estorno",
    limitsToCurrentStock: false,
  },
};
