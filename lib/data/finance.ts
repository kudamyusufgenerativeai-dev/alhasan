// Static placeholder for financial summary.
// v1.0: returns empty/dash values.
// v2.0: swap the body of this function to pull from Google Sheets — no UI changes needed.

export interface FinancialSummary {
  income: string | null;
  expense: string | null;
  balance: string | null;
}

export function getFinancialSummary(): FinancialSummary {
  return {
    income: null,
    expense: null,
    balance: null,
  };
}
