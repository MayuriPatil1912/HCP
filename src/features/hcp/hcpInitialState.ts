import { HcpState } from "./hcpTypes";

export const initialState: HcpState = {
  rows: [],

  edits: {},

  selectedRows: [],

  // Empty means everything is collapsed.
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