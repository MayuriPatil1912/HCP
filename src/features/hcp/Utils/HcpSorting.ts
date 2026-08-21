import { HcpRecord } from "../../../data-generator";
import { Aggregate, SortColumn, SortDirection } from "../hcpTypes";
import { calculateCpi, getCallsValue } from "../hcpUtils";

//Goal for sorting is to do the comparision of two rows
//For HCP we have to compare by column value which is selected for sorting
//For Region and Teritory we have to compare by column value which is selected for sorting

// For HCP row, what value should I use for sorting
// this function wll return value for comparision
export function getHcpSortValue(
  row: HcpRecord,
  column: SortColumn,
): string | number | null {
  switch (column) {
    case "ID":
      return row.id;

    case "HCP Name":
      return row.name;

    case "Specialty":
      return row.specialty;

    case "Calls":
      return getCallsValue(row.calls);

    case "TRx":
      return row.trx;

    case "NRx":
      return row.nrx;

    case "CPI":
      return calculateCpi(getCallsValue(row.calls), row.trx);

    default:
      return null;
  }
}

//  For Region and Teritory row what value should we use to compare
//this function will return value to compare for region or teritory
export function getAggregateSortValue(
  aggregate: Aggregate,
  column: SortColumn,
): string | number | null {
  switch (column) {
    case "Calls":
      return aggregate.calls;

    case "TRx":
      return aggregate.trx;

    case "NRx":
      return aggregate.nrx;

    case "CPI":
      return aggregate.cpi;

    default:
      return null;
  }
}

// this will compare two values of rows got from above 2 methods
//this will return 0, 1, -1, like positive or negative value
export function compareSortValues(
  a: string | number | null,
  b: string | number | null,
): number {
  // null values go to the end
  if (a === null && b === null) {
    return 0;
  }

  if (a === null) {
    return 1;
  }

  if (b === null) {
    return -1;
  }

  // Numeric comparison
  if (typeof a === "number" && typeof b === "number") {
    return a - b;
  }

  // String comparison
  return String(a).localeCompare(String(b), undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

//  apply ascending, descending direction
export function applySortDirection(
  comparison: number,
  direction: SortDirection,
): number {
  if (direction === "desc") {
    return comparison * -1;
  }
  return comparison;
}
