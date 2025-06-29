import React, { Suspense } from "react";
// ** Router Import
import { Route, Routes } from "react-router-dom";
import Panel from "./pages/Panel";
//css
import "./App.css";

function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route exact path="/" element={<Panel />} />
        <Route path="*" navigate={<Panel />} />
      </Routes>
    </Suspense>
  );
}

export default App;
