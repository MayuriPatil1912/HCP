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

  //This will create Map of 6 Regions, region as key and each region(key) points to the array of rows which have that region
  //region = Map(6) {'Southeast' => array(48),....}
  rows.forEach((row) => {
    const existing = regions.get(row.region); // return the value(Array of rows)
    if (existing) {
      existing.push(row);
    } else {
      regions.set(row.region, [row]);
    }
  });

  // Convert Map to array so that we can sort regions.
  //[['SouthWest',[Array(8294)]], ...]
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

    //For the first region row
    displayRows.push({
      type: "region",
      key: `region:${region}`,
      region,
      aggregate: regionAggregate,
    });

    // If collapsed, don't add territories or HCP rows,go and add second region row
    if (!grouping.expandedRegions.includes(region)) {
      continue;
    }

    // Group by Territory
    //We will create Map for each Territory
    //{"Southwest / T3" => Array(1063),....}
    const territories = new Map<string, HcpRecord[]>();

    regionRows.forEach((row) => {
      const existing = territories.get(row.territory);

      if (existing) {
        existing.push(row);
      } else {
        territories.set(row.territory, [row]);
      }
    });
    // Covert this Map into Array like below
    // [['Southwest / T3', Array(1063)],....]
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
// Create Map of Regions like below
//  {'Southeast' => array(48),....}

// Convert Map to Array for Iterration like below
// [['SouthWest',[Array(8294)]], ...]

// sort the array by given column

// In the for loop
// For First Region Add row
// Check in expanded region array ,if the that region is expanded continue the loop and check the next region

// If region is expanded in expanded region array

// Then create Map for of territory like below
// {"Southwest / T3" => Array(1063), ...}

//  Covert this Map into Array like below
//  [['Southwest / T3', Array(1063)],....]

// sort the array by given column

// In the for loop
// For First Terriotory Add row
// Check in expanded territory array ,if the that teretory is expanded continue,the loop and check the next teritory

// If teritory is expanded in teritory array

// sort the array by given column name

// In the for loop
// first HCP add the row
