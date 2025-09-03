import NavbarLogo from "./Navbar.logo";
import NavbarProfile from "./Navbar.profile";
import ModeToggle from "./ModeToggle";
import SupportProjectButton from "./Navbar.support";
import NotificationDropdown from "./Navbar.notification";

const Navbar = () => {
  return (
    <div className="sticky top-0 z-50 w-full  bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between px-4 h-14">
        <NavbarLogo />

        {/* KANAN */}
        <div className="flex items-center gap-2">
          <SupportProjectButton />
          <NotificationDropdown />
          <ModeToggle />
          <NavbarProfile />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
