import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "../../app/store";
import { buildDisplayRows } from "./Utils/BuildDisplayRow";

//  Get original 50,000 rows
export const selectRows = (state: RootState) => state.hcp.rows;

//Get Search Text
export const selectSearch = (state: RootState) => state.hcp.filters.search;

//Get Selected Region
export const selectRegionFilter = (state: RootState) =>
  state.hcp.filters.region;

// Filter rows based on name, Id and Region
export const selectFilteredRows = createSelector(
  [selectRows, selectSearch, selectRegionFilter],
  (rows, search, region) => {
    const normalizedSearch = search.trim().toLowerCase();

    return rows.filter((row) => {
      // Region Filter dropdown
      if (region && row.region !== region) {
        return false;
      }

      //search filter
      if (normalizedSearch) {
        const matchesId = row.id.toLowerCase().includes(normalizedSearch);

        const matchesName = row.name.toLowerCase().includes(normalizedSearch);

        if (!matchesId && !matchesName) {
          return false;
        }
      }

      return true;
    });
  },
);

//grouping state
export const selectGrouping = (state: RootState) => state.hcp.grouping;

//sortin state
export const selectSorting = (state: RootState) => state.hcp.sorting;

export const selectDisplayRows = createSelector(
  [selectFilteredRows, selectGrouping, selectSorting],

  (filteredRows, grouping, sorting) => {
    return buildDisplayRows(filteredRows, grouping, sorting);
  },
);
export const selectEdits = (state: RootState) => state.hcp.edits;
export const selectPendingChanges = createSelector(
  [selectEdits],
  (edits) =>
    Object.values(edits).filter((edit) => edit.status === "pending").length,
);
