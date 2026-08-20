import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import type {
  RootState,
  AppDispatch,
} from "./app/store";

import { generateRows } from "./data-generator";

import { setRows } from "./features/hcp/hcpSlice";

import HcpTable from "./features/hcp/components/HcpTable";

function App() {
  const dispatch = useDispatch<AppDispatch>();

  const rows = useSelector(
    (state: RootState) => state.hcp.rows
  );

  useEffect(() => {
    const data = generateRows(42, 50000);

    dispatch(setRows(data));
  }, [dispatch]);

  return (
    <div>
      <h1>HCP Data Explorer</h1>

      <p>
        Total rows: {rows.length}
      </p>

      <HcpTable />
    </div>
  );
}

export default App;