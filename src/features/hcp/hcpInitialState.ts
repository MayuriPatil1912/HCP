import type { HcpState } from "./hcpTypes";

export const initialHcpState: HcpState = {
  rows: [],

  edits: {},

  selectedRows: [],

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