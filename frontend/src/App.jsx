import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route Utama langsung ke Login */}
        <Route path="/" element={<Login />} />
        
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;