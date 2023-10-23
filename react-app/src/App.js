import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./Homepage";
import Upload from "./Upload";
import AllDocuments from "./AllDocuments";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/allDocuments" element={<AllDocuments />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
