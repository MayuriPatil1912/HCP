import { generateRows } from "./data-generator";

function App() {
  const rows = generateRows(42, 50000);

  console.log("Total rows:", rows.length);
  console.log("First row:", rows[0]);
  console.log("Last row:", rows[rows.length - 1]);

  return (
    <div>
      <h1>HCP Data Explorer</h1>
      <p>Total records: {rows.length}</p>
    </div>
  );
}

export default App;