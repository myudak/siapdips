import "./App.css";

import { useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/Footer";
import LisSort from "@/components/ListSort";

function App() {
  const [isLocalStatus, setIsLocalStatus] = useState(false);

  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Navbar isLocalStatus={isLocalStatus} />
        <div className=" bg-gray-100 dark:bg-gray-900 flex flex-col">
          <div className="main flex flex-col gap-3 p-4 overflow-y-auto">
            <LisSort setIsLocalStatus={setIsLocalStatus} />
          </div>
        </div>
        <SiteFooter />
      </ThemeProvider>
      <Toaster />
    </>
  );
}

export default App;
