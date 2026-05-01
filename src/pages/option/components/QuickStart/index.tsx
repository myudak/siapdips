import { ComponentType, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  MoonStar,
  BookOpen,
  CalendarDays,
  Sparkles,
  UtensilsCrossed,
  Workflow,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LOCAL_STORAGE_OPTION_ONBOARDING_COLLAPSED_KEY,
  LOCAL_STORAGE_OPTION_ONBOARDING_SEEN_KEY,
} from "@/constants/storage";

type QuickStep = {
  id: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  icon: ComponentType<{ className?: string }>;
};

const quickSteps: QuickStep[] = [
  {
    id: "base",
    title: "Set up the basics",
    description:
      "Atur dark mode, kartu popup, dan layout biar extension langsung kerasa kepake.",
    href: "#sect1",
    cta: "Open settings",
    icon: MoonStar,
  },
  {
    id: "popup",
    title: "Customize popup cards",
    description:
      "Pilih kartu yang mau keliatan, urutkan ulang, terus hide yang ga kepake.",
    href: "#sect1",
    cta: "Customize popup",
    icon: LayoutDashboard,
  },
  {
    id: "moodle",
    title: "Setup Moodle AI",
    description:
      "Pilih provider AI, isi API/model, terus test connection sebelum dipakai di quiz.",
    href: "#moodleHelper",
    cta: "Setup Moodle AI",
    icon: Sparkles,
  },
  {
    id: "jadwal",
    title: "Enable schedule helper",
    description:
      "Buka bagian jadwal kalau mau parse dan rapihin jadwal lebih cepat.",
    href: "#jadwalSettings",
    cta: "Open jadwal",
    icon: CalendarDays,
  },
  {
    id: "foodtruk",
    title: "Setup FoodTruk helper",
    description:
      "Kalau sering rebutan slot FoodTruk, siapin helper lokasi dan auto-flow dari awal.",
    href: "#foodTruk",
    cta: "Setup FoodTruk",
    icon: UtensilsCrossed,
  },
  {
    id: "tutorials",
    title: "See detailed tutorials",
    description:
      "Kalau masih bingung, lanjut ke tutorial detail buat fitur-fitur yang lebih spesifik.",
    href: "#Tutorials",
    cta: "See tutorials",
    icon: BookOpen,
  },
];

const QuickStartSection = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    try {
      const seen = localStorage.getItem(LOCAL_STORAGE_OPTION_ONBOARDING_SEEN_KEY);
      const collapsed = localStorage.getItem(
        LOCAL_STORAGE_OPTION_ONBOARDING_COLLAPSED_KEY
      );

      if (!seen) {
        localStorage.setItem(LOCAL_STORAGE_OPTION_ONBOARDING_SEEN_KEY, "true");
        localStorage.setItem(
          LOCAL_STORAGE_OPTION_ONBOARDING_COLLAPSED_KEY,
          "false"
        );
        setIsCollapsed(false);
      } else {
        setIsCollapsed(collapsed === "true");
      }
    } catch (error) {
      console.warn("[QuickStart] Failed to read onboarding state:", error);
    } finally {
      setHasLoaded(true);
    }
  }, []);

  const completedCount = useMemo(() => quickSteps.length, []);

  const setCollapsedState = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
    try {
      localStorage.setItem(
        LOCAL_STORAGE_OPTION_ONBOARDING_SEEN_KEY,
        "true"
      );
      localStorage.setItem(
        LOCAL_STORAGE_OPTION_ONBOARDING_COLLAPSED_KEY,
        collapsed ? "true" : "false"
      );
    } catch (error) {
      console.warn("[QuickStart] Failed to persist onboarding state:", error);
    }
  };

  if (!hasLoaded) {
    return null;
  }

  if (isCollapsed) {
    return (
      <section id="quickStart" className="pt-8 sm:pt-10 lg:pt-12">
        <Card className="border-primary/20 bg-gradient-to-r from-primary/10 via-background to-background">
          <CardContent className="py-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Quick Start</Badge>
                <span className="text-sm text-muted-foreground">
                  First-run guide available anytime
                </span>
              </div>
              <p className="text-base font-semibold">
                Udah pernah buka onboarding. Tinggal buka lagi kalau mau refresh
                setup flow.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  window.location.href = "#Tutorials";
                }}
              >
                Detailed tutorials
              </Button>
              <Button onClick={() => setCollapsedState(false)}>
                Show guide <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section id="quickStart" className="pt-8 sm:pt-10 lg:pt-12">
        <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <Badge className="w-fit">Quick Start</Badge>
              <CardTitle className="text-2xl sm:text-3xl">
                Setup paling penting dulu, sisanya nyusul
              </CardTitle>
              <p className="max-w-2xl text-sm sm:text-base text-muted-foreground">
                Flow yang paling masuk akal buat first install: paham fungsi
                extension, aktifin setup inti, terus baru explore fitur detail.
                Targetnya kurang dari satu menit.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{completedCount} core steps</Badge>
              <Button variant="ghost" onClick={() => setCollapsedState(true)}>
                Collapse guide <ChevronUp className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
            <Card className="border-border/60 bg-background/85 backdrop-blur">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Workflow className="h-5 w-5 text-primary" />
                  <p className="text-lg font-semibold">Apa itu SiapDiPS?</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  SiapDiPS itu extension helper buat ngerapihin flow Undip yang
                  biasanya kepisah-pisah: popup shortcut, helper Moodle,
                  jadwal, FoodTruk, PBM, sampai beberapa automations kecil yang
                  kepake pas harian.
                </p>
                <p className="text-sm text-muted-foreground">
                  Cara paling waras makainya: aktifin fitur yang emang relevan,
                  jangan nyalain semua cuma karena ada. Quick start ini nunjukin
                  bagian yang paling worth di-set dulu.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-5 space-y-3">
                <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
                  Best first clicks
                </p>
                <div className="space-y-2 text-sm">
                  <p className="font-medium">1. Popup + layout</p>
                  <p className="font-medium">2. Moodle AI</p>
                  <p className="font-medium">3. Jadwal / FoodTruk</p>
                  <p className="font-medium">4. Detailed guides</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {quickSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <Card
                  key={step.id}
                  className="border-border/60 bg-background/80 backdrop-blur"
                >
                  <CardContent className="p-5 flex h-full flex-col gap-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            Step {index + 1}
                          </p>
                          <h3 className="text-lg font-semibold">{step.title}</h3>
                        </div>
                      </div>
                      <CheckCircle2 className="h-5 w-5 text-primary/60" />
                    </div>

                    <p className="text-sm text-muted-foreground flex-1">
                      {step.description}
                    </p>

                    <Button
                      variant={step.id === "moodle" ? "default" : "secondary"}
                      className="w-full justify-between"
                      onClick={() => {
                        window.location.href = step.href;
                      }}
                    >
                      {step.cta}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4 sm:p-5">
            <p className="text-sm sm:text-base font-medium">
              Rekomendasi flow:
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              `Settings` dulu buat layout dan toggle dasar, lanjut `Moodle AI`
              kalau mau helper/quiz, terus pilih `Jadwal` atau `FoodTruk`
              sesuai kebutuhan harian, baru cek `Detailed tutorials` buat fitur
              lain yang emang pengen dipakai.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default QuickStartSection;
