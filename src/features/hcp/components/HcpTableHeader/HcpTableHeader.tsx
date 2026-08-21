import { useDispatch, useSelector } from "react-redux";

import { selectSortColumn } from "../../hcpSlice";

import type { SortColumn } from "../../hcpTypes";

import type { AppDispatch, RootState } from "../../../../app/store";

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

      <button onClick={() => handleSort("Calls")}>Calls</button>

      <button onClick={() => handleSort("TRx")}>TRx</button>

      <button onClick={() => handleSort("NRx")}>NRx</button>

      <button onClick={() => handleSort("CPI")}>CPI</button>
    </div>
  );
}
