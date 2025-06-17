import { useState } from "react";
import { Menu, X } from "lucide-react";
import NavbarLogo from "./Navbar.logo";
import NavbarProfile from "./Navbar.profile";
import ModeToggle from "./ModeToggle";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { href: "#Tutorials", label: "Tutorial" },
    { href: "#sect1", label: "Settings" },
    { href: "#TemplatePBM", label: "Template PBM" },
    { href: "#profileSettings", label: "Profile" },
    { href: "#foodTruk", label: "FoodTruk" },
    { href: "#moodleHelper", label: "Moodle" },
    { href: "#todoboard", label: "TODO" },
  ];

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
      <div className="flex items-center justify-between px-4 h-14 max-w-7xl mx-auto">
        <NavbarLogo />

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              className="text-sm font-medium hover:underline transition-colors hover:text-primary px-2 py-1"
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right Side - Desktop */}
        <div className="hidden lg:flex items-center gap-2">
          <ModeToggle />
          <NavbarProfile />
        </div>

        {/* Mobile Menu Button and Right Controls */}
        <div className="flex lg:hidden items-center gap-2">
          <ModeToggle />
          <NavbarProfile />
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMenu}
            className="p-2 touch-manipulation"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-border/40 bg-background/95 backdrop-blur">
          <div className="px-4 py-4 space-y-3 max-w-7xl mx-auto">
            {navLinks.map((link) => (
              <a
                key={link.href}
                className="block text-sm font-medium hover:text-primary transition-colors py-2 px-2 rounded-md hover:bg-muted touch-manipulation"
                href={link.href}
                onClick={handleLinkClick}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
