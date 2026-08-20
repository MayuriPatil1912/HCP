import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "../../app/store";

export const selectHcpState = (
  state: RootState
) => state.hcp;

export const selectRows = createSelector(
  [selectHcpState],
  (hcp) => hcp.rows
);

export const selectEdits = createSelector(
  [selectHcpState],
  (hcp) => hcp.edits
);

export const selectSelectedRows =
  createSelector(
    [selectHcpState],
    (hcp) => hcp.selectedRows
  );

export const selectGrouping =
  createSelector(
    [selectHcpState],
    (hcp) => hcp.grouping
  );

export const selectSorting =
  createSelector(
    [selectHcpState],
    (hcp) => hcp.sorting
  );

export const selectFilters =
  createSelector(
    [selectHcpState],
    (hcp) => hcp.filters
  );

export const selectHistory =
  createSelector(
    [selectHcpState],
    (hcp) => hcp.history
);