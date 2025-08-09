import { Route, Routes } from "react-router";
import "./App.css";
import Home from "./pages/Home";
import TimeOut from "./pages/TimeOut";

function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="/timeout" element={<TimeOut />} />
    </Routes>
  );
}

export default App;
