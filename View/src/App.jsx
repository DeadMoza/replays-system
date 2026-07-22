import { Routes, Route } from "react-router-dom";
import { useState } from "react";

import Home from "./pages/Home";
import Navbar from "./navbar";
import CalendarPage from "./pages/Calendar";
import SlotsPage from "./pages/Slots";
import ReplaysPage from "./pages/Replays";


function App() {
  const [lang, setLang] = useState("ar");

  return (
    <>
      <Navbar lang={lang} setLang={setLang} />

      <Routes>
        <Route path="/" element={<Home lang={lang} />} />
<Route path="/calendar" element={<CalendarPage lang={lang} />} />
<Route path="/slots" element={<SlotsPage lang={lang} />} />
<Route path="/replays" element={<ReplaysPage lang={lang} />} />

      </Routes>
    </>
  );
}

export default App;