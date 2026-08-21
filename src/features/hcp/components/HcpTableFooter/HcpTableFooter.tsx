import "./HcpTableFooter.css";
interface HcpTableFooterProps {
  domRowCount: number;
  totalRowCount: number;
  pendingChanges: number;
  lastSortTime: number;
}

export function HcpTableFooter({
  domRowCount,
  totalRowCount,
  pendingChanges,
  lastSortTime,
}: HcpTableFooterProps) {
  return (
    <div className="hcp-table-footer">
      <span>
        rows in DOM: <strong>{domRowCount}</strong> of{" "}
        <strong>{totalRowCount.toLocaleString()}</strong>
      </span>

      <span>
        pending changes: <strong>{pendingChanges}</strong>
      </span>

      <span>
        last sort: <strong>{lastSortTime} ms</strong>
      </span>
    </div>
  );
}
