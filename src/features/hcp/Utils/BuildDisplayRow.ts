import { HcpRecord } from "../../../data-generator";
import {
  DisplayRow,
  GroupingState,
  RowKey,
  SortColumn,
  SortDirection,
} from "../hcpTypes";
import { calculateAggregate } from "../hcpUtils";
import {
  applySortDirection,
  compareSortValues,
  getAggregateSortValue,
  getHcpSortValue,
} from "./HcpSorting";

//  * Build the flattened list consumed by the virtualizer.
//  * Hierarchy: Region -> Territory -> HCP
export function buildDisplayRows(
  rows: HcpRecord[],
  grouping: GroupingState,
  sorting: {
    column: SortColumn | null;
    direction: SortDirection;
  },
): DisplayRow[] {
  const displayRows: DisplayRow[] = [];

  const isSortingActive =
    sorting.column !== null && sorting.direction !== "none";

  //group by Region
  const regions = new Map<string, HcpRecord[]>();

  rows.forEach((row) => {
    const existing = regions.get(row.region);

    if (existing) {
      existing.push(row);
    } else {
      regions.set(row.region, [row]);
    }
  });

  /**
   * Convert Map to array so that
   * we can sort regions.
   */
  let regionEntries = Array.from(regions.entries());

  /**
   * ============================
   * 2. SORT REGIONS
   * ============================
   *
   * Region sorting is based on
   * aggregate value.
   *
   * Example:
   *
   * Calls ASC
   *
   * Northeast   165,856
   * National    166,219
   * West        263,280
   * ...
   */
  if (isSortingActive && sorting.column) {
    regionEntries = regionEntries
      .map(([region, regionRows], index) => ({
        region,
        regionRows,
        aggregate: calculateAggregate(regionRows),
        originalIndex: index,
      }))
      .sort((a, b) => {
        const aValue = getAggregateSortValue(a.aggregate, sorting.column!);

        const bValue = getAggregateSortValue(b.aggregate, sorting.column!);

        const comparison = compareSortValues(aValue, bValue);

        if (comparison === 0) {
          return a.originalIndex - b.originalIndex;
        }

        return applySortDirection(comparison, sorting.direction);
      })
      .map((item) => [item.region, item.regionRows] as [string, HcpRecord[]]);
  }

  /**
   * ============================
   * 3. REGION LOOP
   * ============================
   */
  for (const [region, regionRows] of regionEntries) {
    const regionAggregate = calculateAggregate(regionRows);

    /**
     * Add Region row
     */
    displayRows.push({
      type: "region",
      key: `region:${region}`,
      region,
      aggregate: regionAggregate,
    });

    /**
     * If collapsed, don't add
     * territories or HCP rows.
     */
    if (!grouping.expandedRegions.includes(region)) {
      continue;
    }

    /**
     * ============================
     * 4. GROUP BY TERRITORY
     * ============================
     */
    const territories = new Map<string, HcpRecord[]>();

    regionRows.forEach((row) => {
      const existing = territories.get(row.territory);

      if (existing) {
        existing.push(row);
      } else {
        territories.set(row.territory, [row]);
      }
    });

    let territoryEntries = Array.from(territories.entries());

    /**
     * ============================
     * 5. SORT TERRITORIES
     * ============================
     */
    if (isSortingActive && sorting.column) {
      territoryEntries = territoryEntries
        .map(([territory, territoryRows], index) => ({
          territory,
          territoryRows,
          aggregate: calculateAggregate(territoryRows),
          originalIndex: index,
        }))
        .sort((a, b) => {
          const aValue = getAggregateSortValue(a.aggregate, sorting.column!);

          const bValue = getAggregateSortValue(b.aggregate, sorting.column!);

          const comparison = compareSortValues(aValue, bValue);

          if (comparison === 0) {
            return a.originalIndex - b.originalIndex;
          }

          return applySortDirection(comparison, sorting.direction);
        })
        .map(
          (item) =>
            [item.territory, item.territoryRows] as [string, HcpRecord[]],
        );
    }

    /**
     * ============================
     * 6. TERRITORY LOOP
     * ============================
     */
    for (const [territory, territoryRows] of territoryEntries) {
      const territoryKey = `${region}:${territory}`;

      const territoryAggregate = calculateAggregate(territoryRows);

      /**
       * Add Territory row
       */
      displayRows.push({
        type: "territory",

        key: `territory:${territoryKey}`,

        region,

        territory,

        aggregate: territoryAggregate,
      });

      /**
       * If Territory is collapsed,
       * don't add HCP rows.
       */
      if (!grouping.expandedTerritories.includes(territoryKey)) {
        continue;
      }

      /**
       * ============================
       * 7. SORT HCP ROWS
       * ============================
       */
      let sortedHcpRows = territoryRows;

      if (isSortingActive && sorting.column) {
        sortedHcpRows = territoryRows
          .map((row, index) => ({
            row,
            originalIndex: index,
          }))
          .sort((a, b) => {
            const aValue = getHcpSortValue(a.row, sorting.column!);

            const bValue = getHcpSortValue(b.row, sorting.column!);

            const comparison = compareSortValues(aValue, bValue);

            /**
             * Stable sorting:
             * if values are equal,
             * preserve original order.
             */
            if (comparison === 0) {
              return a.originalIndex - b.originalIndex;
            }

            return applySortDirection(comparison, sorting.direction);
          })
          .map((item) => item.row);
      }

      /**
       * ============================
       * 8. ADD HCP ROWS
       * ============================
       */
      for (const row of sortedHcpRows) {
        /**
         * IMPORTANT:
         *
         * rowKey is based on the
         * ORIGINAL 50,000-row array,
         * not the sorted array.
         */
        const rowKey = rows.indexOf(row) as RowKey;

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
