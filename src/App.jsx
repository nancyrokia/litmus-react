import { Routes, Route } from "react-router-dom";

import Home from "./scenes/Home";
import Scene3 from "./scenes/Scene3";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/scene3" element={<Scene3 />} />
    </Routes>
  );
}

export default App;
