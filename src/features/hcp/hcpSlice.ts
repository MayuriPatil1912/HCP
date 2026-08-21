import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { HcpRecord } from "../../data-generator";

import type {
  EditState,
  FilterState,
  GroupingState,
  HistoryCommand,
  RowKey,
  SortColumn,
  SortDirection,
} from "./hcpTypes";

interface HcpState {
  /**
   * Original 50,000 records.
   *
   * Never replace this array with filtered/grouped data.
   */
  rows: HcpRecord[];

  /**
   * Active edits by stable RowKey.
   */
  edits: Record<string, EditState>;

  /**
   * Selected HCP rows.
   */
  selectedRows: RowKey[];

  /**
   * Region / Territory expansion state.
   */
  grouping: GroupingState;

  /**
   * Current table sorting.
   */
  sorting: {
    column: SortColumn | null;
    direction: SortDirection;
  };

  /**
   * Search and region filter.
   */
  filters: FilterState;

  /**
   * Command-based undo/redo history.
   */
  history: {
    undoStack: HistoryCommand[];
    redoStack: HistoryCommand[];
  };
}

const initialState: HcpState = {
  rows: [],

  edits: {},

  selectedRows: [],

  /**
   * Empty means everything is collapsed.
   *
   * Initial table:
   *
   * ▶ Northeast
   * ▶ Midwest
   * ▶ National
   * ▶ Southeast
   * ▶ Southwest
   * ▶ West
   */
  grouping: {
    expandedRegions: [],
    expandedTerritories: [],
  },

  sorting: {
    column: null,
    direction: "none",
  },

  filters: {
    search: "",
    region: "",
  },

  history: {
    undoStack: [],
    redoStack: [],
  },
};

const hcpSlice = createSlice({
  name: "hcp",

  initialState,

  reducers: {
    /**
     * Load the original dataset.
     */
    setRows(state, action: PayloadAction<HcpRecord[]>) {
      state.rows = action.payload;
    },

    /**
     * Search by HCP name or ID.
     */
    setSearch(state, action: PayloadAction<string>) {
      state.filters.search = action.payload;
    },

    /**
     * Filter by region.
     */
    setRegionFilter(state, action: PayloadAction<string>) {
      state.filters.region = action.payload;
    },

    /**
     * Three-state sorting:
     *
     * none → asc → desc → none
     */
    setSort(state, action: PayloadAction<SortColumn>) {
      const column = action.payload;

      /**
       * Selecting a different column
       * always starts with ascending.
       */
      if (state.sorting.column !== column) {
        state.sorting.column = column;
        state.sorting.direction = "asc";

        return;
      }

      /**
       * asc → desc
       */
      if (state.sorting.direction === "asc") {
        state.sorting.direction = "desc";

        return;
      }

      /**
       * desc → none
       */
      if (state.sorting.direction === "desc") {
        state.sorting.column = null;
        state.sorting.direction = "none";

        return;
      }

      /**
       * none → asc
       */
      state.sorting.direction = "asc";
    },

    /**
     * Expand/collapse a Region.
     */
    toggleRegion(state, action: PayloadAction<string>) {
      const region = action.payload;

      const index = state.grouping.expandedRegions.indexOf(region);

      if (index !== -1) {
        /**
         * Region currently expanded.
         * Collapse it.
         */
        state.grouping.expandedRegions.splice(index, 1);
      } else {
        /**
         * Region currently collapsed.
         * Expand it.
         */
        state.grouping.expandedRegions.push(region);
      }
    },

    /**
     * Expand/collapse a Territory.
     *
     * Territory key contains the region so that
     * "T1" in different regions cannot collide.
     *
     * Example:
     *
     * Northeast:Northeast / T3
     */
    toggleTerritory(state, action: PayloadAction<string>) {
      const territoryKey = action.payload;

      const index = state.grouping.expandedTerritories.indexOf(territoryKey);

      if (index !== -1) {
        state.grouping.expandedTerritories.splice(index, 1);
      } else {
        state.grouping.expandedTerritories.push(territoryKey);
      }
    },

    /**
     * Select / deselect one HCP.
     */
    toggleRowSelection(state, action: PayloadAction<RowKey>) {
      const rowKey = action.payload;

      const index = state.selectedRows.indexOf(rowKey);

      if (index !== -1) {
        state.selectedRows.splice(index, 1);
      } else {
        state.selectedRows.push(rowKey);
      }
    },

    /**
     * Select multiple HCPs.
     */
    selectRows(state, action: PayloadAction<RowKey[]>) {
      for (const rowKey of action.payload) {
        if (!state.selectedRows.includes(rowKey)) {
          state.selectedRows.push(rowKey);
        }
      }
    },

    /**
     * Clear all selection.
     */
    clearSelection(state) {
      state.selectedRows = [];
    },

    /**
     * Start an edit.
     *
     * Actual validation will be implemented later.
     */
    startEdit(state, action: PayloadAction<EditState>) {
      const key = String(action.payload.rowKey);

      state.edits[key] = action.payload;
    },

    /**
     * Mark an edit as pending.
     */
    setEditPending(
      state,
      action: PayloadAction<{
        rowKey: RowKey;
        requestId: string;
      }>,
    ) {
      const key = String(action.payload.rowKey);

      const edit = state.edits[key];

      /**
       * Ignore stale async responses.
       */
      if (!edit || edit.requestId !== action.payload.requestId) {
        return;
      }

      edit.status = "pending";
    },
    cancelEdit(state, action: PayloadAction<RowKey>) {
      const key = String(action.payload);

      delete state.edits[key];
    },

    editRejected(
      state,
      action: PayloadAction<{
        rowKey: RowKey;
        requestId: string;
        error: string;
      }>,
    ) {
      const { rowKey, requestId, error } = action.payload;

      const key = String(rowKey);

      const edit = state.edits[key];

      // Ignore if edit no longer exists
      if (!edit) {
        return;
      }

      // Ignore stale response
      if (edit.requestId !== requestId) {
        return;
      }

      edit.status = "rejected";
      edit.error = error;
    },

    editAccepted(
      state,
      action: PayloadAction<{
        rowKey: RowKey;
        requestId: string;
        value: number;
      }>,
    ) {
      const { rowKey, requestId, value } = action.payload;

      const key = String(rowKey);

      const edit = state.edits[key];

      if (!edit) {
        return;
      }

      // Ignore stale response
      if (edit.requestId !== requestId) {
        return;
      }

      const row = state.rows[rowKey];

      if (!row) {
        return;
      }

      // Save old value
      const previousValue = Number(row.calls);

      // Update actual row
      row.calls = value;

      // Add to undo history
      state.history.undoStack.push({
        type: "editCalls",
        rowKey,
        previousValue,
        newValue: value,
      });

      // New edit means redo history is no longer valid
      state.history.redoStack = [];

      // Remove temporary edit state
      delete state.edits[key];
    },
    undo(state) {
      const command = state.history.undoStack.pop();

      if (!command) {
        return;
      }

      if (command.type === "editCalls") {
        const row = state.rows[command.rowKey];

        if (row) {
          row.calls = command.previousValue;
        }
      }

      state.history.redoStack.push(command);
    },
    redo(state) {
      const command = state.history.redoStack.pop();

      if (!command) {
        return;
      }

      if (command.type === "editCalls") {
        const row = state.rows[command.rowKey];

        if (row) {
          row.calls = command.newValue;
        }
      }

      state.history.undoStack.push(command);
    },

    /**
     * Add a command to undo history.
     */
    pushHistory(state, action: PayloadAction<HistoryCommand>) {
      state.history.undoStack.push(action.payload);

      /**
       * Any new command invalidates
       * the redo branch.
       */
      state.history.redoStack = [];
    },
  },
});

export const {
  setRows,
  setSearch,
  setRegionFilter,
  setSort,
  toggleRegion,
  toggleTerritory,
  toggleRowSelection,
  selectRows,
  clearSelection,
  startEdit,
  setEditPending,
  pushHistory,
  cancelEdit,
  editRejected,
  editAccepted,
  undo,
  redo,
} = hcpSlice.actions;

export default hcpSlice.reducer;
