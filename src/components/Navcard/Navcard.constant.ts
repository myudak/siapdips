import { 
    KeyRound,
    GraduationCap,
    ScanLine,
    MonitorPlay,
    Headphones, 
    SquareTerminal
  } from "lucide-react";
  
  export type NavLinksItem = {
    icon: React.ElementType;
    title: string;
    subtitle: string;
    tooltip: string;
    href: string;
  };

  export const navLinks: NavLinksItem[] = [
      {
        icon: KeyRound,
        title: "SSO",
        subtitle: "SSO UNDIP",
        tooltip: "SSO adalah sistem terintegrasi yang menghubungkan seluruh civitas akademika Undip.",
        href: "https://sso.undip.ac.id/pages/dashboard"
      },
      {
        icon: GraduationCap,
        title: "SIAP",
        subtitle: "SIAP UNDIP",
        tooltip: "sistem informasi akademik Universitas Diponegoro untuk mahasiswa",
        href: "https://siap.undip.ac.id/pages/mhs/dashboard"
      },
      {
        icon: ScanLine,
        title: "ABSENSI",
        subtitle: "Absensi Scanner",
        tooltip: "Scanner Absensi - SIAP Undip",
        href: "https://siap.undip.ac.id/master_perkuliahan/mhs/absensi/scanner"
      },
      {
        icon: MonitorPlay,
        title: "KULON",
        subtitle: "Kuliah Online",
        tooltip: "Kulon Undip Moodle",
        href:"https://kulon2.undip.ac.id/my/"
      }, 
      {
          icon: Headphones,
          title: "HALO",
          subtitle: "HALO UNDIP",
          tooltip: "Helpdesk etc",
          href: "https://halo.undip.ac.id/"
        },
        {
          icon: SquareTerminal,
          title: "LearnSocial",
          subtitle: "LearnSocial Hack",
          tooltip: "isn't exactly a 'hack' in the traditional sense&mdash;",
          href:"https://github.com/myudak/learnSocial-hack"
        },
    ];