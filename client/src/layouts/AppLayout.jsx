import { BrowserRouter } from "react-router-dom";
import Navbar from "../components/Navbar";
import AppRoutes from "../routes/AppRoutes";

function AppLayout() {
  return (
    <BrowserRouter>
      <Navbar />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default AppLayout;