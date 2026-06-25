import { BrowserRouter, Routes, Route } from "react-router-dom";
import Join from "./pages/Join";
import Play from "./pages/Play";
import Host from "./pages/Host";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Join />} />
        <Route path="/play" element={<Play />} />
        <Route path="/host" element={<Host />} />
      </Routes>
    </BrowserRouter>
  );
}
