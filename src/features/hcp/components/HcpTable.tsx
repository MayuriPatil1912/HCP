import { useRef } from "react";
import { useSelector } from "react-redux";
import { useVirtualizer } from "@tanstack/react-virtual";

import type { RootState } from "../../../app/store";
import HcpTableHeader from "./HcpTableHeader";

function HcpTable() {
  const rows = useSelector((state: RootState) => state.hcp.rows);

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,

    getScrollElement: () => parentRef.current,

    estimateSize: () => 40,

    overscan: 10,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();

  return (
    <div>
      <h2>HCP Records</h2>

      <p>Total rows: {rows.length}</p>
      <HcpTableHeader />
      <div
        ref={parentRef}
        style={{
          height: "600px",
          overflow: "auto",
          border: "1px solid #ddd",
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            position: "relative",
          }}
        >
          {virtualRows.map((virtualRow) => {
            const row = rows[virtualRow.index];

            return (
              <div
                key={virtualRow.index}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "140px 180px 160px 130px 160px 80px 80px 80px",
                    height: "100%",
                    alignItems: "center",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <div>{row.id}</div>

                  <div>{row.name}</div>

                  <div>{row.specialty ?? "—"}</div>

                  <div>{row.region}</div>

                  <div>{row.territory}</div>

                  <div>{row.calls}</div>

                  <div>{row.trx}</div>

                  <div>{row.nrx}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p>Rows currently in DOM: {virtualRows.length}</p>
    </div>
  );
}

export default HcpTable;
