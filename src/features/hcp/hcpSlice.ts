import {
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

import type { HcpRecord } from "../../data-generator";

import { initialHcpState } from "./hcpInitialState";

import type {
  EditState,
  HistoryCommand,
  RowKey,
  SortColumn,
  HcpState,
} from "./hcpTypes";

const hcpSlice = createSlice({
  name: "hcp",

  initialState: initialHcpState,

  reducers: {
    setRows(
      state,
      action: PayloadAction<HcpRecord[]>
    ) {
      state.rows = action.payload;
    },

    updateCalls(
      state,
      action: PayloadAction<{
        rowKey: RowKey;
        value: number;
      }>
    ) {
      const {
        rowKey,
        value,
      } = action.payload;

      const row = state.rows[rowKey];

      if (!row) {
        return;
      }

      row.calls = value;
    },

    // -------------------------
    // SEARCH / FILTER
    // -------------------------

    setSearch(
      state,
      action: PayloadAction<string>
    ) {
      state.filters.search =
        action.payload;
    },

    setRegionFilter(
      state,
      action: PayloadAction<string>
    ) {
      state.filters.region =
        action.payload;
    },

    // -------------------------
    // SORTING
    // -------------------------

    setSort(
      state,
      action: PayloadAction<SortColumn>
    ) {
      const column =
        action.payload;

      // New column
      if (
        state.sorting.column !==
        column
      ) {
        state.sorting.column =
          column;

        state.sorting.direction =
          "asc";

        return;
      }

      // ASC → DESC
      if (
        state.sorting.direction ===
        "asc"
      ) {
        state.sorting.direction =
          "desc";

        return;
      }

      // DESC → NONE
      if (
        state.sorting.direction ===
        "desc"
      ) {
        state.sorting.column =
          null;

        state.sorting.direction =
          "none";

        return;
      }

      // NONE → ASC
      state.sorting.direction =
        "asc";
    },

    // -------------------------
    // GROUPING
    // -------------------------

    toggleRegion(
      state,
      action: PayloadAction<string>
    ) {
      const region =
        action.payload;

      const index =
        state.grouping.expandedRegions.indexOf(
          region
        );

      if (index >= 0) {
        state.grouping.expandedRegions.splice(
          index,
          1
        );
      } else {
        state.grouping.expandedRegions.push(
          region
        );
      }
    },

    toggleTerritory(
      state,
      action: PayloadAction<string>
    ) {
      const territory =
        action.payload;

      const index =
        state.grouping.expandedTerritories.indexOf(
          territory
        );

      if (index >= 0) {
        state.grouping.expandedTerritories.splice(
          index,
          1
        );
      } else {
        state.grouping.expandedTerritories.push(
          territory
        );
      }
    },

    // -------------------------
    // EDITING
    // -------------------------

    startEdit(
      state,
      action: PayloadAction<EditState>
    ) {
      const edit =
        action.payload;

      const key =
        String(edit.rowKey);

      state.edits[key] =
        edit;
    },

    setEditPending(
      state,
      action: PayloadAction<{
        rowKey: RowKey;
        requestId: string;
      }>
    ) {
      const {
        rowKey,
        requestId,
      } = action.payload;

      const key =
        String(rowKey);

      const edit =
        state.edits[key];

      if (
        !edit ||
        edit.requestId !==
          requestId
      ) {
        return;
      }

      edit.status =
        "pending";
    },

    editRejected(
      state,
      action: PayloadAction<{
        rowKey: RowKey;
        requestId: string;
        error: string;
      }>
    ) {
      const {
        rowKey,
        requestId,
        error,
      } = action.payload;

      const key =
        String(rowKey);

      const edit =
        state.edits[key];

      if (
        !edit ||
        edit.requestId !==
          requestId
      ) {
        return;
      }

      edit.status =
        "rejected";

      edit.error =
        error;
    },

    clearEdit(
      state,
      action: PayloadAction<RowKey>
    ) {
      delete state.edits[
        String(action.payload)
      ];
    },

    // -------------------------
    // SELECTION
    // -------------------------

    toggleRowSelection(
      state,
      action: PayloadAction<RowKey>
    ) {
      const rowKey =
        action.payload;

      const index =
        state.selectedRows.indexOf(
          rowKey
        );

      if (index >= 0) {
        state.selectedRows.splice(
          index,
          1
        );
      } else {
        state.selectedRows.push(
          rowKey
        );
      }
    },

    selectRows(
      state,
      action: PayloadAction<RowKey[]>
    ) {
      for (
        const rowKey of action.payload
      ) {
        if (
          !state.selectedRows.includes(
            rowKey
          )
        ) {
          state.selectedRows.push(
            rowKey
          );
        }
      }
    },

    clearSelection(state) {
      state.selectedRows = [];
    },

    // -------------------------
    // HISTORY
    // -------------------------

    pushHistory(
      state,
      action: PayloadAction<HistoryCommand>
    ) {
      state.history.undoStack.push(
        action.payload
      );

      // New command invalidates redo
      state.history.redoStack = [];
    },

    clearHistory(state) {
      state.history.undoStack = [];
      state.history.redoStack = [];
    },
  },
});

export const {
  setRows,
  updateCalls,

  setSearch,
  setRegionFilter,

  setSort,

  toggleRegion,
  toggleTerritory,

  startEdit,
  setEditPending,
  editRejected,
  clearEdit,

  toggleRowSelection,
  selectRows,
  clearSelection,

  pushHistory,
  clearHistory,
} = hcpSlice.actions;

export default hcpSlice.reducer;