import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Sidebar } from "../sidebar/Sidebar";
import { MainContent } from "./mainContent";
import { RightPanel } from "./rightPanel";
import { Toaster } from "sonner";

export const Home = () => {
    const { login} = useAuth();
    useEffect(() =>{
         const usuarioLogeado = localStorage.getItem("user");
         if (!usuarioLogeado) {
             return
            }
         login({user: JSON.parse(usuarioLogeado), access_tocken:""})
        }, [])


  return (
    <div className="flex w-full h-screen text-gray-800 font-sans">
      {/* Sidebar */}
     <Sidebar />

      {/* Main Content */}
      <MainContent />

      {/* Right Panel */}
      <RightPanel />
      <Toaster />
    </div>
  );
};
