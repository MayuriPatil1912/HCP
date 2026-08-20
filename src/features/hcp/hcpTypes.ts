import type { HcpRecord } from "../../data-generator";

/**
 * Stable identity of a source HCP row.
 */
export type RowKey = number;

/**
 * Sorting
 */
export type SortColumn =
  | "id"
  | "name"
  | "specialty"
  | "calls"
  | "trx"
  | "nrx"
  | "cpi";

export type SortDirection =
  | "asc"
  | "desc"
  | "none";

/**
 * Filters
 */
export interface FilterState {
  search: string;
  region: string;
}

/**
 * Grouping
 */
export interface GroupingState {
  expandedRegions: string[];
  expandedTerritories: string[];
}

/**
 * Aggregated values displayed by
 * Region and Territory rows.
 */
export interface Aggregate {
  hcpCount: number;
  calls: number;
  trx: number;
  nrx: number;
  cpi: number | null;
}

/**
 * Flattened rows consumed by the virtualizer.
 */
export type DisplayRow =
  | {
      type: "region";

      key: string;

      region: string;

      aggregate: Aggregate;
    }
  | {
      type: "territory";

      key: string;

      region: string;

      territory: string;

      aggregate: Aggregate;
    }
  | {
      type: "hcp";

      key: RowKey;

      row: HcpRecord;
    };

/**
 * ================================
 * EDITING
 * ================================
 */

export type EditStatus =
  | "editing"
  | "pending"
  | "rejected";

export interface EditState {
  rowKey: RowKey;

  originalValue: number;

  newValue: number;

  status: EditStatus;

  requestId: string;

  error?: string;
}

/**
 * ================================
 * UNDO / REDO
 * ================================
 */

export interface HistoryCommand {
  rowKey: RowKey;

  previousValue: number;

  nextValue: number;
}

/**
 * ================================
 * COMPLETE REDUX STATE
 * ================================
 */

export interface HcpState {
  /**
   * Original 50,000 records.
   */
  rows: HcpRecord[];

  /**
   * Active edits.
   */
  edits: Record<string, EditState>;

  /**
   * Selected HCP row keys.
   */
  selectedRows: RowKey[];

  /**
   * Region / Territory expansion.
   */
  grouping: GroupingState;

  /**
   * Sorting.
   */
  sorting: {
    column: SortColumn | null;
    direction: SortDirection;
  };

  /**
   * Search and filters.
   */
  filters: FilterState;

  /**
   * Command history.
   */
  history: {
    undoStack: HistoryCommand[];
    redoStack: HistoryCommand[];
  };
}