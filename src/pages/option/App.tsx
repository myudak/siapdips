import "./App.css";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

import Navbar from "./components/Navbar";
import SettingsSection from "./components/Settings";
import SiteFooter from "./components/Footer";
import ChangelogSection from "./components/Changelog";
import HeaderSection from "./components/Header";
import TutorialSection from "./components/Tutorial";

const LandingPage = () => {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Navbar />
        <div className="main">
          <HeaderSection />

          {/* <section className="min-h-screen bg-muted/50 flex items-center">
            
          </section> */}

          <SettingsSection />

          <TutorialSection />

          <ChangelogSection />
        </div>
        <SiteFooter />
      </ThemeProvider>
      <Toaster />
    </>
  );
};

export default LandingPage;
