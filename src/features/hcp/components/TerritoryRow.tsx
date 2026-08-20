import { useDispatch } from "react-redux";

import { toggleTerritory } from "../hcpSlice";

import type { DisplayRow } from "../hcpTypes";

interface TerritoryRowProps {
  row: Extract<
    DisplayRow,
    { type: "territory" }
  >;

  expanded: boolean;
}

export function TerritoryRow({
  row,
  expanded,
}: TerritoryRowProps) {
  const dispatch = useDispatch();

  /**
   * Region + Territory together form the
   * unique territory key.
   *
   * Example:
   *
   * Northeast:Northeast / T3
   */
  const territoryKey =
    `${row.region}:${row.territory}`;

  const handleToggle = () => {
    dispatch(
      toggleTerritory(territoryKey)
    );
  };

  const {
    hcpCount,
    calls,
    trx,
    nrx,
    cpi,
  } = row.aggregate;

  return (
    <div className="table-row territory-row">
      {/* Region column */}
      <div className="table-cell">
        —
      </div>

      {/* HCP Name / Territory */}
      <div className="table-cell territory-name">
        <button
          type="button"
          className="expand-button"
          onClick={handleToggle}
          aria-label={
            expanded
              ? `Collapse ${row.territory}`
              : `Expand ${row.territory}`
          }
        >
          {expanded ? "▼" : "▶"}
        </button>

        <strong>
          {row.territory}
        </strong>

        <span className="hcp-count">
          ({hcpCount.toLocaleString()} HCPs)
        </span>
      </div>

      {/* Specialty */}
      <div className="table-cell">
        —
      </div>

      {/* Calls */}
      <div className="table-cell numeric">
        {calls.toLocaleString()}
      </div>

      {/* TRx */}
      <div className="table-cell numeric">
        {trx.toLocaleString()}
      </div>

      {/* NRx */}
      <div className="table-cell numeric">
        {nrx.toLocaleString()}
      </div>

      {/* CPI */}
      <div className="table-cell numeric">
        {cpi === null
          ? "—"
          : cpi.toFixed(2)}
      </div>
    </div>
  );
}