import { useState } from "react";
import TableView from "./components/TableView";
import Form from "./components/Form";
import { Donor } from "./class/person";
function App() {
  const [dataEntry, setDataEntry] = useState(false);
  const [result, setResult] = useState(true);

  const handleTabChange = (tab) => {
    if (tab === "dataEntry") {
      setDataEntry(true);
      setResult(false);
    } else if (tab === "result") {
      setDataEntry(false);
      setResult(true);
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-2 p-3 relative">
        <button
          type="button"
          onClick={() => handleTabChange("dataEntry")}
          className="flex-grow min-w-26 bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-500 transition duration-200"
        >
          Data Entry
        </button>
        <button
          type="button"
          onClick={() => handleTabChange("result")}
          className="flex-grow min-w-26 bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-500 transition duration-200"
        >
          Results
        </button>
      </div>
      {dataEntry && <Form />}
      {result && <TableView />}
    </>
  );
}

export default App;
