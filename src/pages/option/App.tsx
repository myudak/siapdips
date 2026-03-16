import "./App.css";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

import Navbar from "./components/Navbar";
import SettingsSection from "./components/Settings";
import SiteFooter from "./components/Footer";
import ChangelogSection from "./components/Changelog";
import HeaderSection from "./components/Header";
import QuickStartSection from "./components/QuickStart";
import TutorialSection from "./components/Tutorial";

const LandingPage = () => {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Navbar />
        <div className="main min-h-screen bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <HeaderSection />

            <QuickStartSection />

            <SettingsSection />

            <TutorialSection />

            <ChangelogSection />
          </div>
        </div>
        <SiteFooter />
      </ThemeProvider>
      <Toaster />
    </>
  );
};

export default LandingPage;
