import { useEffect, useState } from "react";
import { useSession } from 'next-auth/react';
import { signOut } from "next-auth/react";

import Sidebar from "./sidebar";
import Navbar from "./navbar";
import Footer from "./footer";
import Content from "./content";
import Alumni from "./alumni";

export default function DashboardAlumni() {
  const [menu, setMenu] = useState("dashboard"); 

  const renderContent = () => {
    switch (menu) {
      case "dashboard":
        return <Content /> 
      case "alumni":
        return <Alumni />
      case "loker":
        return <h1 className="text-2xl font-bold">Management Loker</h1>;
      case "pengumuman":
        return <h1 className="text-2xl font-bold">Management Pengumuman</h1>;
      default:
        return <h1 className="text-2xl font-bold">Page Not Found</h1>;
    }
  };


  return (
    <body>
      <Navbar />
      <div className="flex overflow-hidden bg-white pt-16">
        <Sidebar setMenu={setMenu} />
        <div id="main-content" style={{ minHeight: '100vh' }} className="h-full w-full bg-gray-50 relative overflow-y-auto lg:ml-64">
          <main>
            {renderContent()}
          </main>
          <Footer />
        </div>
      </div>
    </body>
  );
}