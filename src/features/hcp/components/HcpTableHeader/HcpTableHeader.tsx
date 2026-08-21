import { useDispatch } from "react-redux";

import { selectSortColumn } from "../../hcpSlice";

import type { SortColumn } from "../../hcpTypes";

import type { AppDispatch } from "../../../../app/store";

import "./HcpTableHeader.css";

export function HcpTableHeader() {
  const dispatch = useDispatch<AppDispatch>();

  const handleSort = (column: SortColumn) => {
    dispatch(selectSortColumn(column));
  };

  return (
    <div className="table-header">
      <button onClick={() => handleSort("ID")}>ID</button>

      <button onClick={() => handleSort("HCP Name")}>HCP Name</button>

      <button onClick={() => handleSort("Specialty")}>Specialty</button>

      <button className="numeric" onClick={() => handleSort("Calls")}>Calls</button>

      <button className="numeric" onClick={() => handleSort("TRx")}>TRx</button>

      <button className="numeric" onClick={() => handleSort("NRx")}>NRx</button>

      <button className="numeric" onClick={() => handleSort("CPI")}>CPI</button>
    </div>
  );
}
