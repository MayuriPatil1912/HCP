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

// Build the flattened list consumed by the virtualizer.
// Hierarchy: Region -> Territory -> HCP
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

  // Group by Region
  const regions = new Map<string, HcpRecord[]>();

  rows.forEach((row) => {
    const existing = regions.get(row.region);

    if (existing) {
      existing.push(row);
    } else {
      regions.set(row.region, [row]);
    }
  });

  // Convert Map to array so that we can sort regions.
  let regionEntries = Array.from(regions.entries());

  // Sort Regions by aggregate value.
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

  // Region loop
  for (const [region, regionRows] of regionEntries) {
    const regionAggregate = calculateAggregate(regionRows);

    displayRows.push({
      type: "region",
      key: `region:${region}`,
      region,
      aggregate: regionAggregate,
    });

    // If collapsed, don't add territories or HCP rows.
    if (!grouping.expandedRegions.includes(region)) {
      continue;
    }

    // Group by Territory
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

    // Sort Territories by aggregate value.
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

    // Territory loop
    for (const [territory, territoryRows] of territoryEntries) {
      const territoryKey = `${region}:${territory}`;
      const territoryAggregate = calculateAggregate(territoryRows);

      displayRows.push({
        type: "territory",
        key: `territory:${territoryKey}`,
        region,
        territory,
        aggregate: territoryAggregate,
      });

      // If collapsed, don't add HCP rows.
      if (!grouping.expandedTerritories.includes(territoryKey)) {
        continue;
      }

      // Sort HCP rows.
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

            // Preserve original order when values are equal.
            if (comparison === 0) {
              return a.originalIndex - b.originalIndex;
            }

            return applySortDirection(comparison, sorting.direction);
          })
          .map((item) => item.row);
      }

      // Add HCP rows.
      for (const row of sortedHcpRows) {
        // rowKey remains based on the original 50,000-row array.
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
