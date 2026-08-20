import type { HcpRecord } from "../../data-generator";

import type {
  Aggregate,
  DisplayRow,
  GroupingState,
  RowKey,
} from "./hcpTypes";

/**
 * Calls can be either number or string in the
 * provided data generator.
 *
 * We normalize it only when performing calculations.
 */
export function getCallsValue(
  calls: number | string
): number {
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
export function calculateCpi(
  calls: number,
  trx: number
): number | null {
  if (trx === 0) {
    return null;
  }

  return (calls / trx) * 100;
}

/**
 * Calculate aggregate values for a group.
 */
export function calculateAggregate(
  rows: HcpRecord[]
): Aggregate {
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

/**
 * Build the flattened list consumed by the virtualizer.
 *
 * Hierarchy:
 *
 * Region
 *   └── Territory
 *         └── HCP
 *
 * Only children of expanded groups are added.
 */
export function buildDisplayRows(
  rows: HcpRecord[],
  grouping: GroupingState
): DisplayRow[] {
  const displayRows: DisplayRow[] = [];

  /**
   * First group rows by Region.
   */
  const regions = new Map<string, HcpRecord[]>();

  rows.forEach((row) => {
    const existing =
      regions.get(row.region);

    if (existing) {
      existing.push(row);
    } else {
      regions.set(row.region, [row]);
    }
  });

  /**
   * Build Region → Territory → HCP hierarchy.
   */
  for (const [
    region,
    regionRows,
  ] of regions) {
    /**
     * Region row
     */
    displayRows.push({
      type: "region",

      key: `region:${region}`,

      region,

      aggregate:
        calculateAggregate(regionRows),
    });

    /**
     * If Region is collapsed,
     * don't add its territories/HCPs.
     */
    if (
      !grouping.expandedRegions.includes(
        region
      )
    ) {
      continue;
    }

    /**
     * Group Region rows by Territory.
     */
    const territories = new Map<
      string,
      HcpRecord[]
    >();

    regionRows.forEach((row) => {
      const existing =
        territories.get(row.territory);

      if (existing) {
        existing.push(row);
      } else {
        territories.set(row.territory, [row]);
      }
    });

    /**
     * Add Territory rows.
     */
    for (const [
      territory,
      territoryRows,
    ] of territories) {
      const territoryKey =
        `${region}:${territory}`;

      displayRows.push({
        type: "territory",

        key: `territory:${territoryKey}`,

        region,

        territory,

        aggregate:
          calculateAggregate(
            territoryRows
          ),
      });

      /**
       * If Territory is collapsed,
       * don't add its HCP rows.
       */
      if (
        !grouping.expandedTerritories.includes(
          territoryKey
        )
      ) {
        continue;
      }

      /**
       * Add individual HCP rows.
       *
       * IMPORTANT:
       * We need the original row index as
       * the stable RowKey.
       */
      for (const row of territoryRows) {
        const rowKey =
          rows.indexOf(row) as RowKey;

        displayRows.push({
          type: "hcp",

          key: rowKey,

          row,
        });
      }
    }
  }

  return displayRows;
}