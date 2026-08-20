import type { HcpRecord } from "../../data-generator";

export type RowKey = number;

export type SortDirection = "asc" | "desc" | "none";

export type SortColumn =
  | "id"
  | "name"
  | "specialty"
  | "region"
  | "territory"
  | "calls"
  | "trx"
  | "nrx"
  | "cpi";

export interface SortState {
  column: SortColumn | null;
  direction: SortDirection;
}

export type EditStatus =
  | "editing"
  | "pending"
  | "rejected";

export interface EditState {
  rowKey: RowKey;
  originalValue: number | string;
  newValue: number;
  status: EditStatus;
  error?: string;
  requestId: string;
}

export interface FilterState {
  search: string;
  region: string;
}

export interface GroupingState {
  expandedRegions: string[];
  expandedTerritories: string[];
}

export interface HistoryCommand {
  type: "edit";

  rowKey: RowKey;

  previousValue: number | string;

  nextValue: number;
}

export interface HistoryState {
  undoStack: HistoryCommand[];
  redoStack: HistoryCommand[];
}

export interface HcpState {
  rows: HcpRecord[];

  edits: Record<string, EditState>;

  selectedRows: RowKey[];

  grouping: GroupingState;

  sorting: SortState;

  filters: FilterState;

  history: HistoryState;
}