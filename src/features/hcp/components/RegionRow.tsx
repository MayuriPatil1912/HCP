import { useDispatch } from "react-redux";

import { toggleRegion } from "../hcpSlice";

import type { DisplayRow } from "../hcpTypes";

interface RegionRowProps {
  row: Extract<DisplayRow, { type: "region" }>;
  expanded: boolean;
}

export function RegionRow({ row, expanded }: RegionRowProps) {
  const dispatch = useDispatch();

  const handleToggle = () => {
    dispatch(toggleRegion(row.region));
  };

  const { hcpCount, calls, trx, nrx, cpi } = row.aggregate;

  return (
    <div className="table-row region-row">
      {/* Region label
          Spans ID + HCP Name + Specialty */}
      <div className="region-cell region-label">
        <button
          type="button"
          className="expand-button"
          onClick={handleToggle}
          aria-label={
            expanded ? `Collapse ${row.region}` : `Expand ${row.region}`
          }
        >
          {expanded ? "▼  " : "▶  "}
          <span>{row.region}</span>

          <span className="hcp-count">({hcpCount.toLocaleString()} HCPs)</span>
        </button>
      </div>

      {/* Calls */}
      <div className="table-cell numeric">{calls.toLocaleString()}</div>

      {/* TRx */}
      <div className="table-cell numeric">{trx.toLocaleString()}</div>

      {/* NRx */}
      <div className="table-cell numeric">{nrx.toLocaleString()}</div>

      {/* CPI */}
      <div className="table-cell numeric">
        {cpi === null ? "—" : cpi.toFixed(0)}
      </div>
    </div>
  );
}
