import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import CityWrapper from "../CityWrapper";
import DirectionResults from "../DirectionResults";

function App() {
  return (
    <BrowserRouter>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<CityWrapper />}>
          <Route path="/search/:addresses" element={<DirectionResults />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
