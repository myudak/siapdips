import { ThemeProvider } from "@/components/theme-provider";
import "./App.css";
import Navbar from "./components/Navbar";
import Nromal from "./components/Normal";
import SiteFooter from "./components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, Laptop, Rocket } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Icons } from "./components/Navbar/Navbar.logo";
import { Toaster } from "@/components/ui/sonner";
import { useScrollToHashSection } from "@/hooks/useScrollToHashSection";
import { useRef } from "react";

const LandingPage = () => {
  const tutorialIpk = useRef<null | HTMLDivElement>(null);
  const tutorialTheme = useRef<null | HTMLDivElement>(null);
  const tutorialAutopbm = useRef<null | HTMLDivElement>(null);
  const tutorialEnableClickKanan = useRef<null | HTMLDivElement>(null);

  const tutorials = [
    {
      id: 1,
      title: "Ipk Status",
      videoSrc: "vid-ipk.mp4",
      hash: "IpkStatus",
      ref: tutorialIpk,
    },
    {
      id: 2,
      title: "Theme",
      videoSrc: "Vid-Theme.webm",
      hash: "Theme",
      ref: tutorialTheme,
    },
    {
      id: 3,
      title: "Auto PBM",
      videoSrc: "Vid-Pbm.webm",
      hash: "Autopbm",
      ref: tutorialAutopbm,
    },
    {
      id: 4,
      title: "Enable Click Kanan",
      videoSrc: "vid-klikKanan.mp4",
      hash: "EnableClickKanan",
      ref: tutorialEnableClickKanan,
    },
  ];

  useScrollToHashSection("IpkStatus", tutorialIpk);
  useScrollToHashSection("Theme", tutorialTheme);
  useScrollToHashSection("Autopbm", tutorialAutopbm);
  useScrollToHashSection("EnableClickKanan", tutorialEnableClickKanan);
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Navbar />
        <div className="main">
          <section className="h-[calc(100dvh-3.6rem)]  flex items-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full"></div>
                    <Icons.logoSiapDips className="h-28 w-28 text-primary relative animate-pulse" />
                    {/* <Zap className="h-24 w-24 text-primary relative animate-pulse" /> */}
                  </div>
                </div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                  <span className="text-primary">SiAp DiPS</span>
                </h1>
                <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
                  Extension for better Undip experience. ~&gt; Created by
                  myudakk. ヽ（≧□≦）ノ
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <Button
                    onClick={() => (window.location.href = "#Tutorials")}
                    size="lg"
                    className="gap-2"
                  >
                    Tutorial <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault();
                      chrome.tabs.create({
                        url: "https://siap.undip.ac.id/sso/login",
                      });
                    }}
                  >
                    Goto~ Undip
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* <section className="min-h-screen bg-muted/50 flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold">Fitur</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Everything you need to build modern applications
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6">
                <Rocket className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
                <p className="text-muted-foreground">
                  Built for speed and performance, deploy your applications in
                  seconds.
                </p>
              </Card>
              <Card className="p-6">
                <Code2 className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Developer First</h3>
                <p className="text-muted-foreground">
                  Best-in-class developer experience with intuitive APIs and
                  tools.
                </p>
              </Card>
              <Card className="p-6">
                <Laptop className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Modern Stack</h3>
                <p className="text-muted-foreground">
                  Built with the latest technologies and best practices in mind.
                </p>
              </Card>
            </div>
          </div>
        </section> */}

          <Nromal />
          <section className="bg-muted/50 mt-6 py-12">
            <div className="container mx-auto px-4">
              <h2
                id="Tutorials"
                className="text-4xl font-bold mb-12 text-center"
              >
                ~ Tutorial ~
              </h2>
              <div className="flex flex-col space-y-12">
                {tutorials.map((tutorial) => (
                  <div
                    key={tutorial.id}
                    className="w-full flex flex-col items-center"
                    id={tutorial.hash}
                    ref={tutorial.ref}
                  >
                    <h3 className="text-2xl font-semibold mb-6">
                      {tutorial.title}
                    </h3>
                    <video
                      src={tutorial.videoSrc}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full max-w-4xl rounded-lg shadow-2xl"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
        <SiteFooter />
      </ThemeProvider>
      <Toaster />
    </>
  );
};

export default LandingPage;
