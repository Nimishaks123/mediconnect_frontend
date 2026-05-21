import Sidebar from "../../components/dashboard/sideBar";
//import Header from "./Header";
import DashboardToolbar from "../dashboard/DashboardToolbar";
import DashboardHeader from "../dashboard/DashboardHeader";
import { Outlet } from "react-router-dom";

const PatientDashboardLayout = () => {
  return (
    <div className="flex bg-[#f7f9fc] min-h-screen">
      
      <Sidebar />

      <div className="flex-1 flex flex-col">
        
        {/* <Header /> */}
        
        <DashboardHeader/>
        {/* <DashboardToolbar/> */}

        <main className="p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default PatientDashboardLayout;