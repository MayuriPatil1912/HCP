import { useDispatch, useSelector } from "react-redux";



import {
  setSearch,
  setRegionFilter,
  setSort,
} from "../../hcpSlice";
import { AppDispatch, RootState } from "../../../../app/store";

function HcpToolbar() {
  const dispatch = useDispatch<AppDispatch>();

  const search = useSelector(
    (state: RootState) => state.hcp.filters.search
  );

  const region = useSelector(
    (state: RootState) => state.hcp.filters.region
  );

  const sorting = useSelector(
    (state: RootState) => state.hcp.sorting
  );

  const handleSort = () => {
    dispatch(setSort("calls"));
  };

  const getSortLabel = () => {
    if (
      sorting.column === "calls" &&
      sorting.direction === "asc"
    ) {
      return "Sort: Calls ▲";
    }

    if (
      sorting.column === "calls" &&
      sorting.direction === "desc"
    ) {
      return "Sort: Calls ▼";
    }

    return "Sort: Calls";
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        marginBottom: "8px",
        alignItems: "center",
      }}
    >
      {/* Search */}
      <input
        type="text"
        value={search}
        placeholder="Search name or ID..."
        onChange={(event) =>
          dispatch(setSearch(event.target.value))
        }
        style={{
          width: "180px",
          height: "30px",
          padding: "0 10px",
          border: "1px solid #cbd5e1",
          borderRadius: "6px",
          fontSize: "11px",
          outline: "none",
        }}
      />

      {/* Region */}
      <select
        value={region}
        onChange={(event) =>
          dispatch(
            setRegionFilter(event.target.value)
          )
        }
        style={{
          width: "115px",
          height: "30px",
          padding: "0 8px",
          border: "1px solid #cbd5e1",
          borderRadius: "6px",
          background: "#fff",
          fontSize: "11px",
        }}
      >
        <option value="">All regions</option>

        <option value="Midwest">Midwest</option>
        <option value="National">National</option>
        <option value="Northeast">Northeast</option>
        <option value="Southeast">Southeast</option>
        <option value="Southwest">Southwest</option>
        <option value="West">West</option>
      </select>

      {/* Sort */}
      <button
        type="button"
        onClick={handleSort}
        style={{
          height: "30px",
          padding: "0 10px",
          border: "1px solid #b8dcd2",
          borderRadius: "6px",
          background: "#f4fffc",
          color: "#159473",
          fontSize: "11px",
          cursor: "pointer",
        }}
      >
        {getSortLabel()}
      </button>
    </div>
  );
}

export default HcpToolbar;