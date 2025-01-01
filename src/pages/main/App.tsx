import HidePopupcard from "@/components/HidePopupcard";
import "./App.css";
import Ipkstatus from "@/components/Ipkstatus";
import Navbar from "@/components/Navbar";
import NavigationCard from "@/components/Navcard";
import { ThemeProvider } from "@/components/theme-provider";
import Themecard from "@/components/Themecard";
import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";

function App() {
  const [isLocalStatus, setIsLocalStatus] = useState(false);
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Navbar isLocalStatus={isLocalStatus} />
        <div className=" bg-gray-100 dark:bg-gray-900 flex flex-col">
          <div className="main flex flex-col gap-3 p-4 overflow-y-auto">
            <NavigationCard />
            <Ipkstatus setIsLocalStatus={setIsLocalStatus} />
            <Themecard />
            <HidePopupcard />
          </div>
        </div>
      </ThemeProvider>
      <Toaster />
    </>
  );
}

export default App;
