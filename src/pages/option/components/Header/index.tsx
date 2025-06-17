import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Icons } from "../Navbar/Navbar.logo";

const VERSION = "1.4.0";
const LAST_UPDATE = "June 15, 2025";

const HeaderSection = () => {
  return (
    <section className="h-[calc(100dvh-3.6rem)] flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex justify-center mb-8 relative">
            <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full"></div>
            <Icons.logoSiapDips className="h-28 w-28 text-primary relative animate-pulse" />
            {/* Version badge positioned near the logo */}
            <Badge className="cursor-default absolute -right-6 top-0  text-xs px-2 py-1 rounded-full font-medium">
              v{VERSION}
            </Badge>
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            <span className="text-primary">SiAp DiPS</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
            Extension for better Undip experience. ~&gt; Created by myudakk.
            ヽ（≧□≦）ノ
          </p>
          {/* Version info line */}
          <p className="mt-2 text-sm text-muted-foreground">
            Latest update: {LAST_UPDATE} •{" "}
            <a href="#changelog" className="text-primary hover:underline">
              See whats new
            </a>
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
  );
};

export default HeaderSection;
