import "./HcpTableHeader.css"
export function HcpTableHeader() {
  return (
    <div className="table-header">
      <div className="table-header-cell">
        ID
      </div>

      <div className="table-header-cell">
        HCP NAME
      </div>

      <div className="table-header-cell">
        SPECIALITY
      </div>

      <div className="table-header-cell numeric">
        CALLS
      </div>

      <div className="table-header-cell numeric">
        TRX
      </div>

      <div className="table-header-cell numeric">
        NRX
      </div>

      <div className="table-header-cell numeric">
        CPI
      </div>
    </div>
  );
}