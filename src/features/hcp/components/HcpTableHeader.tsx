const columns = [
  { key: "id", label: "ID", width: 140 },
  { key: "name", label: "HCP NAME", width: 180 },
  { key: "specialty", label: "SPECIALTY", width: 160 },
  { key: "calls", label: "CALLS", width: 80 },
  { key: "trx", label: "TRX", width: 80 },
  { key: "nrx", label: "NRX", width: 80 },
  { key: "cpi", label: "CPI", width: 80 },
];

export const GRID_TEMPLATE = columns
  .map((column) => `${column.width}px`)
  .join(" ");

function HcpTableHeader() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: GRID_TEMPLATE,
        height: "32px",
        alignItems: "center",
        backgroundColor: "#eef2f6",
        borderTop: "1px solid #d7dee7",
        borderBottom: "1px solid #d7dee7",
        fontSize: "10px",
        fontWeight: 600,
        color: "#617083",
        textTransform: "uppercase",
      }}
    >
      {columns.map((column) => (
        <div
          key={column.key}
          style={{
            padding: "0 8px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {column.label}
        </div>
      ))}
    </div>
  );
}

export default HcpTableHeader;