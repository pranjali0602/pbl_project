export type MoneyPattern = {
  riskTolerance: number;
  savingBehavior: number;
  spendingBehavior: number;
  investmentBehavior: number;
  planningBehavior: number;
};

export type FinancialTwin = MoneyPattern & {
  income: number;
  monthlyExpenses: number;
  savings: number;
  debt: number;
  profile: string;
  confidence: number;
  recommendedScenario: string;
  recommendedScenarioId: string;
};

export type TwinPrediction = Pick<
  FinancialTwin,
  "profile" | "confidence" | "recommendedScenario" | "recommendedScenarioId"
>;

export const MOCK_TWIN_PREDICTION: TwinPrediction = {
  profile: "Balanced",
  confidence: 0.62,
  recommendedScenario: "Investment & Goal Planning Challenge",
  recommendedScenarioId: "sip-or-skip",
};

export function getFinancialTwinPrediction(_input: Omit<FinancialTwin, keyof TwinPrediction>) {
  return Promise.resolve(MOCK_TWIN_PREDICTION);
}

export type DecisionAnswers = Record<"saving" | "spending" | "risk" | "investment" | "planning", number>;

export function scoresFromAnswers(answers: DecisionAnswers): MoneyPattern {
  return {
    savingBehavior: answers.saving,
    spendingBehavior: answers.spending,
    riskTolerance: answers.risk,
    investmentBehavior: answers.investment,
    planningBehavior: answers.planning,
  };
}

const STORAGE_KEY = "paisaboom.financial-twin.v1";

export function saveFinancialTwin(twin: FinancialTwin) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(twin));
}

export function readFinancialTwin(): FinancialTwin | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as FinancialTwin) : null;
  } catch {
    return null;
  }
}