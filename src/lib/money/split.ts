// Pure expense-split math. No I/O, no React — safe to unit test in isolation.
// Given a set of expenses (each with a payer and the participants who share it),
// compute each person's net balance and a minimal list of settle-up transfers.

import type { Expense } from "@/lib/types";

/** A person's net position across all expenses, in USD. */
export interface Balance {
  personId: string;
  /** Total this person paid out. */
  paid: number;
  /** Total this person's share of all expenses they participated in. */
  owes: number;
  /** paid - owes. Positive: others owe them; negative: they owe others. */
  net: number;
}

/** A suggested payment from one person to another to settle balances. */
export interface Transfer {
  fromId: string;
  toId: string;
  amount: number;
}

/** Round to cents to avoid floating-point drift in displayed figures. */
function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Compute net balances for the given people across the given expenses. Each
 * expense splits its amount equally among its participants; the payer is
 * credited the full amount. People with no activity still appear with zeros.
 */
export function computeBalances(
  expenses: Expense[],
  personIds: string[],
): Balance[] {
  const paid = new Map<string, number>();
  const owes = new Map<string, number>();
  for (const id of personIds) {
    paid.set(id, 0);
    owes.set(id, 0);
  }

  for (const expense of expenses) {
    const participants = expense.participantIds;
    if (participants.length === 0) continue;
    const share = expense.amount / participants.length;
    paid.set(expense.payerId, (paid.get(expense.payerId) ?? 0) + expense.amount);
    for (const participantId of participants) {
      owes.set(participantId, (owes.get(participantId) ?? 0) + share);
    }
  }

  // Include any ids that appear only in expenses (payer/participant not in list).
  const allIds = new Set<string>(personIds);
  for (const id of paid.keys()) allIds.add(id);
  for (const id of owes.keys()) allIds.add(id);

  return Array.from(allIds).map((personId) => {
    const p = round2(paid.get(personId) ?? 0);
    const o = round2(owes.get(personId) ?? 0);
    return { personId, paid: p, owes: o, net: round2(p - o) };
  });
}

/**
 * Suggest a small set of transfers that settle the balances. Greedy matching:
 * repeatedly pay the largest debtor toward the largest creditor. Amounts below
 * one cent are treated as settled. The result is not guaranteed to be the
 * theoretical minimum number of transfers but is small and correct.
 */
export function settleUp(balances: Balance[]): Transfer[] {
  const creditors = balances
    .filter((b) => b.net > 0.005)
    .map((b) => ({ id: b.personId, amount: b.net }))
    .sort((a, b) => b.amount - a.amount);
  const debtors = balances
    .filter((b) => b.net < -0.005)
    .map((b) => ({ id: b.personId, amount: -b.net }))
    .sort((a, b) => b.amount - a.amount);

  const transfers: Transfer[] = [];
  let ci = 0;
  let di = 0;
  while (ci < creditors.length && di < debtors.length) {
    const creditor = creditors[ci];
    const debtor = debtors[di];
    const amount = round2(Math.min(creditor.amount, debtor.amount));
    if (amount > 0) {
      transfers.push({ fromId: debtor.id, toId: creditor.id, amount });
    }
    creditor.amount = round2(creditor.amount - amount);
    debtor.amount = round2(debtor.amount - amount);
    if (creditor.amount <= 0.005) ci += 1;
    if (debtor.amount <= 0.005) di += 1;
  }

  return transfers;
}
