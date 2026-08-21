import { useDispatch, useSelector } from "react-redux";

import {
  setSearch,
  setRegionFilter,
  setSort,
} from "../../hcpSlice";

import {
  AppDispatch,
  RootState,
} from "../../../../app/store";

import { REGIONS } from "../../hcpConstants";

import "./HcpToolbar.css";

function HcpToolbar() {
  const dispatch = useDispatch<AppDispatch>();

  const search = useSelector(
    (state: RootState) => state.hcp.filters.search,
  );

  const region = useSelector(
    (state: RootState) => state.hcp.filters.region,
  );

  const sorting = useSelector(
    (state: RootState) => state.hcp.sorting,
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
    <div className="hcp-toolbar">

      {/* Search */}
      <input
        type="text"
        className="hcp-toolbar-search"
        value={search}
        placeholder="Search name or ID..."
        onChange={(event) =>
          dispatch(setSearch(event.target.value))
        }
      />

      {/* Region */}
      <select
        className="hcp-toolbar-region"
        value={region}
        onChange={(event) => {
          dispatch(
            setRegionFilter(event.target.value),
          );
        }}
      >
        <option value="">All regions</option>

        {REGIONS.map((regionName) => (
          <option
            key={regionName}
            value={regionName}
          >
            {regionName}
          </option>
        ))}
      </select>

      {/* Sort */}
      <button
        type="button"
        className="hcp-toolbar-sort"
        onClick={handleSort}
      >
        {getSortLabel()}
      </button>

    </div>
  );
}

export default HcpToolbar;