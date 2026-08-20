import type { HcpRecord } from "../../../data-generator";

import type { RowKey } from "../hcpTypes";

interface HcpDataRowProps {
  row: HcpRecord;
  rowKey: RowKey;
}

function getCallsValue(
  calls: number | string
): number {
  const value = Number(calls);

  return Number.isFinite(value) ? value : 0;
}

function formatCpi(
  calls: number | string,
  trx: number
): string {
  const callsValue = getCallsValue(calls);

  if (trx === 0) {
    return "—";
  }

  return ((callsValue / trx) * 100).toFixed(2);
}

export function HcpDataRow({
  row,
  rowKey,
}: HcpDataRowProps) {
  return (
    <div
      className="table-row hcp-row"
      data-row-key={rowKey}
    >
      {/* ID */}
      <div className="table-cell">
        {row.id}
      </div>

      {/* Name */}
      <div className="table-cell">
        {row.name}
      </div>

      {/* Specialty */}
      <div className="table-cell">
        {row.specialty ?? "—"}
      </div>

      {/* Calls */}
      <div className="table-cell numeric">
        {getCallsValue(row.calls)}
      </div>

      {/* TRx */}
      <div className="table-cell numeric">
        {row.trx.toLocaleString()}
      </div>

      {/* NRx */}
      <div className="table-cell numeric">
        {row.nrx.toLocaleString()}
      </div>

      {/* CPI */}
      <div className="table-cell numeric">
        {formatCpi(
          row.calls,
          row.trx
        )}
      </div>
    </div>
  );
}