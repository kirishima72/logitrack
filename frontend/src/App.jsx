import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Dashboard from "./components/Dashboard";
import OrderList from "./components/OrderList";
import FormAddOrder from "./components/FormAddOrder";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route Utama langsung ke Login */}
        <Route path="/" element={<Login />} />
        
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/orders" element={<OrderList />} />
        <Route path="/orders/add" element={<FormAddOrder />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;