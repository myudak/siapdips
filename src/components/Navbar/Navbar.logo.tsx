import { Gem } from "lucide-react";

const Icons = {
  logoNew: (props: any) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      id="LogoBaru"
      data-name="LogoBaru"
      viewBox="0 0 595.28 595.28"
      {...props}
    >
      <polygon points="206.43 406.96 297.66 564.99 297.65 565.01 115 565.01 206.32 406.83 206.34 406.8 206.43 406.96" />
      <polygon points="571.62 90.47 480.3 248.65 388.99 406.8 297.75 248.78 297.66 248.63 388.97 90.47 571.62 90.47" />
      <polygon points="297.65 248.65 115 248.65 23.67 90.47 206.32 90.47 297.65 248.65" />
    </svg>
  ),
};

const NavbarLogo = () => {
  return (
    <div className="flex items-center gap-2">
      <Gem className="h-5 w-5 text-blue-600" />
      <Icons.logoNew className="h-5 w-5 logo-containerNew" />
      <span className="text-lg font-bold">Siap Dipss</span>
    </div>
  );
};

export default NavbarLogo;
