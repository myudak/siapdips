import NavbarLogo from "./Navbar.logo";
import NavbarProfile from "./Navbar.profile";
import ModeToggle from "./ModeToggle";

const Navbar = () => {
  return (
    <div className="sticky top-0 z-50 w-full  bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between px-4 h-14">
        <NavbarLogo />

        <div className="flex items-center gap-2">
          <a href="#sect1">Settings</a>
          <a href="#sect1">Settings</a>
          <a href="#sect1">Settings</a>
          <a href="#sect1">Settings</a>
        </div>

        {/* Right side icons */}
        <div className="flex items-center gap-2">
          <ModeToggle />
          <NavbarProfile />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
