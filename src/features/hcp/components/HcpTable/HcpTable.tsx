import { useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { useVirtualizer } from "@tanstack/react-virtual";

import { selectDisplayRows, selectGrouping, selectPendingChanges } from "../../hcpSelectors";

import { HcpDataRow } from "../HcpDataRow/HcpDataRow";
import { HcpTableHeader } from "../HcpTableHeader/HcpTableHeader";
import "./HcpTable.css";
import { TerritoryRow } from "../TerriotoryRow/TerritoryRow";
import { RegionRow } from "../RegionRow/RegionRow";
import { HcpTableFooter } from "../HcpTableFooter/HcpTableFooter";

export function HcpTable() {
  /**
   * These are NOT the original 50,000 rows.
   * They are the flattened rows that should currently
   * be visible according to:
   * search
   * region filter
   * expanded regions
   * expanded territories
   */
  const displayRows = useSelector(selectDisplayRows);
  // console.log(selectDisplayRows,"selectDisplayRows")
  console.log(displayRows, "displayRows");

  const grouping = useSelector(selectGrouping);
  const pendingChanges = useSelector(selectPendingChanges);

  const parentRef = useRef<HTMLDivElement>(null);

  /**
   * Virtualizer works against the flattened
   * display row list.
   */
  const rowVirtualizer = useVirtualizer({
    count: displayRows.length,

    getScrollElement: () => parentRef.current,

    estimateSize: () => 40,

    overscan: 10,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();

  return (
    <div className="hcp-table">
      <HcpTableHeader />

      {/* ========================= */}
      {/* SCROLL CONTAINER */}
      {/* ========================= */}

      <div ref={parentRef} className="table-scroll">
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,

            position: "relative",

            width: "100%",
          }}
        >
          {virtualRows.map((virtualRow) => {
            // console.log(displayRows, "displayRows");
            const displayRow = displayRows[virtualRow.index];

            if (!displayRow) {
              return null;
            }

            return (
              <div
                key={displayRow.key}
                data-index={virtualRow.index}
                ref={rowVirtualizer.measureElement}
                style={{
                  position: "absolute",

                  top: 0,

                  left: 0,

                  width: "100%",

                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {/* Region */}
                {displayRow.type === "region" && (
                  <RegionRow
                    row={displayRow}
                    expanded={grouping.expandedRegions.includes(
                      displayRow.region,
                    )}
                  />
                )}

                {/* Terriotory */}
                {displayRow.type === "territory" && (
                  <TerritoryRow
                    row={displayRow}
                    expanded={grouping.expandedTerritories.includes(
                      `${displayRow.region}:${displayRow.territory}`,
                    )}
                  />
                )}

                {/* ================= */}
                {/* HCP */}
                {/* ================= */}

                {displayRow.type === "hcp" && (
                  <HcpDataRow row={displayRow.row} rowKey={displayRow.key} />
                )}
              </div>
            );
          })}
        </div>
      </div>
      <HcpTableFooter
        domRowCount={virtualRows.length}
        totalRowCount={50000}
        pendingChanges={pendingChanges}
        lastSortTime={0}
      />
    </div>
  );
}
