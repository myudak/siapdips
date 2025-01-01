import NavbarLogo from "./Navbar.logo";
import NavbarProfile from "./Navbar.profile";
import ModeToggle from "./ModeToggle";
import { Rss } from "lucide-react";

const Navbar = ({ isLocalStatus }: { isLocalStatus: any }) => {
  // console.log("isLocalStatus", isLocalStatus);
  return (
    <div className="sticky top-0 z-50 w-full  bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between px-4 h-14">
        <NavbarLogo />

        {/* Right side icons */}
        <div className="flex items-center gap-2">
          {isLocalStatus && <Rss className="h-4 w-4" />}
          <ModeToggle />
          <NavbarProfile />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
