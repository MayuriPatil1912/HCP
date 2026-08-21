import type { HcpRecord } from "../../data-generator";

import type {
  Aggregate,
  DisplayRow,
  GroupingState,
  RowKey,
  SortColumn,
  SortDirection,
} from "./hcpTypes";

/**
 * Calls can be either number or string in the
 * provided data generator.
 *
 * We normalize it only when performing calculations.
 */
export function getCallsValue(calls: number | string): number {
  const value = Number(calls);

  return Number.isFinite(value) ? value : 0;
}

/**
 * Calculate CPI safely.
 *
 * CPI = Calls / TRx * 100
 *
 * If TRx is 0, CPI is undefined and we return null.
 */
export function calculateCpi(calls: number, trx: number): number | null {
  if (trx === 0) {
    return null;
  }

  return (calls / trx) * 100;
}

/**
 * Calculate aggregate values for a group.
 */
export function calculateAggregate(rows: HcpRecord[]): Aggregate {
  let calls = 0;
  let trx = 0;
  let nrx = 0;

  for (const row of rows) {
    calls += getCallsValue(row.calls);
    trx += row.trx;
    nrx += row.nrx;
  }

  return {
    hcpCount: rows.length,
    calls,
    trx,
    nrx,
    cpi: calculateCpi(calls, trx),
  };
}



