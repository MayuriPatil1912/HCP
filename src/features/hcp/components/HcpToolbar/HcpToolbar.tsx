import { useDispatch, useSelector } from "react-redux";

import { setSearch, setRegionFilter, applySort } from "../../hcpSlice";

import { AppDispatch, RootState } from "../../../../app/store";

import { REGIONS } from "../../hcpConstants";

import "./HcpToolbar.css";

function HcpToolbar() {
  const dispatch = useDispatch<AppDispatch>();

  const search = useSelector((state: RootState) => state.hcp.filters.search);

  const region = useSelector((state: RootState) => state.hcp.filters.region);

  const sorting = useSelector((state: RootState) => state.hcp.sorting);

  const handleSort = () => {
    if (!sorting.column) {
      return;
    }

    if (sorting.direction === "none") {
      dispatch(applySort("asc"));
    } else if (sorting.direction === "asc") {
      dispatch(applySort("desc"));
    } else {
      dispatch(applySort("none"));
    }
  };

  const getSortLabel = () => {
    if (!sorting.column) {
      return "Sort: Select column";
    }

    const columnName = sorting.column;

    if (sorting.direction === "asc") {
      return `Sort: ${columnName} ▲`;
    }

    if (sorting.direction === "desc") {
      return `Sort: ${columnName} ▼`;
    }

    return `Sort: ${columnName}`;
  };

  return (
    <>
      <div className="hcp-toolbar">
        {/* Search */}
        <input
          type="text"
          className="hcp-toolbar-search"
          value={search}
          placeholder="Search name or ID..."
          onChange={(event) => dispatch(setSearch(event.target.value))}
        />

        {/* Region */}
        <select
          className="hcp-toolbar-region"
          value={region}
          onChange={(event) => {
            dispatch(setRegionFilter(event.target.value));
          }}
        >
          <option value="">All regions</option>

          {REGIONS.map((regionName) => (
            <option key={regionName} value={regionName}>
              {regionName}
            </option>
          ))}
        </select>

        {/* Sort */}
        <button
          type="button"
          className="hcp-toolbar-sort"
          disabled={!sorting.column}
          onClick={handleSort}
        >
          {getSortLabel()}
        </button>
      </div>
      <div className="hcp-sort-hint">
        * Click a column header to select sorting, then use the{" "}
        <strong>Sort</strong> button.
      </div>
    </>
  );
}

export default HcpToolbar;
