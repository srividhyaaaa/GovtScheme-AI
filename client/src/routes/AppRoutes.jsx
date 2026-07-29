import Dashboard from "../pages/Dashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chat from "../pages/Chat";
import Navbar from "../components/Navbar";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import Schemes from "../pages/Schemes";
import SchemeDetails from "../pages/SchemeDetails";
import NotFound from "../pages/NotFound";


function AppRoutes(){

    return(

        <BrowserRouter>

            <Navbar />

            <Routes>

                <Route path="/" element={<Home />} />

                <Route path="/login" element={<Login />} />

                <Route path="/register" element={<Register />} />

                <Route path="/profile" element={<Profile />} />

                <Route path="/schemes" element={<Schemes />} />

                <Route 
                    path="/scheme/:id" 
                    element={<SchemeDetails />} 
                />


                <Route 
                     path="/dashboard" 
                     element={<Dashboard />} 
                />
                <Route 
                    path="/chat" 
                    element={<Chat />} 
                />

                <Route 
                    path="*" 
                    element={<NotFound />} 
                />

            </Routes>

        </BrowserRouter>

    )

}


export default AppRoutes;