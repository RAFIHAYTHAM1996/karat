export interface TransactionCategory {
  category: string;
  amount: number;
  count: number;
  percentage: number;
}

export interface TransactionsSummary {
  average: number;
  categories: TransactionCategory[];
  count: number;
  sum: number;
}