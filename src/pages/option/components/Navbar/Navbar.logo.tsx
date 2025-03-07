const Icons = {
  logoMyudak: (props: any) => (
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
  logoSiapDips: (props: any) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      id="Layer_3"
      data-name="Layer 3"
      viewBox="0 0 283.46 283.46"
      className="stroke-black dark:stroke-white"
      {...props}
    >
      <path
        d="m94.86,34.25l1.76,30.39c-8.19-.18-14.5-.15-18.92.09-14.12.82-21.15,6.09-21.11,15.79.05,9.27,7.4,13.87,22.06,13.8,7.22-.04,14.6-1.8,22.13-5.28,4.84-2.29,11.88-6.91,21.12-13.85l22.56-15.31c12.25-8.25,22.41-14.18,30.48-17.78,11.08-4.9,21.96-7.38,32.63-7.43,14.01-.07,25.24,3.65,33.69,11.16,9.42,8.25,14.16,19.55,14.23,33.89.07,14.66-5.16,25.68-15.69,33.06-8.17,5.86-19.04,8.93-32.62,9.21-1.08,0-4.8.02-11.16.05l-3.22-30.22c9.59-.05,16.33-.35,20.21-.91,9.26-1.34,13.88-5.62,13.84-12.84-.04-8.63-6.96-12.9-20.76-12.83-7.76.04-14.92,1.85-21.48,5.44-3.98,2.18-12.52,7.66-25.63,16.46l-22.73,15.63c-21.49,14.87-42.21,22.36-62.15,22.46-11.86.06-21.57-2.43-29.14-7.46-11.25-7.38-16.91-19.75-17-37.11-.08-16.39,5.47-28.7,16.64-36.95,5.91-4.45,12.2-7.28,18.88-8.5,5.38-.89,11.96-1.35,19.72-1.39,3.56-.02,7.44.13,11.65.43Z"
        className="stroke-black dark:stroke-white top-path"
        style={{ strokeMiterlimit: 10, strokeWidth: "14px" }}
      />
      <path
        d="m252.41,161.34l.16,32.99c1.47,35.68-15.37,53.92-50.51,54.74l-119.17.58c-35.15-.48-52.16-18.56-51.04-54.25l-.16-32.99,220.72-1.07Zm-191.95,31.82l.02,3.88c.04,9.06,2.07,15.14,6.07,18.24,3.03,2.25,8.42,3.41,16.19,3.48l119.17-.58c8.84-.15,14.81-2.01,17.92-5.58,2.68-3.25,4.05-8.7,4.13-16.35l-.02-3.88-163.48.79Z"
        className="stroke-black dark:stroke-white bottom-path"
        style={{ strokeMiterlimit: 10, strokeWidth: "14px" }}
      />
    </svg>
  ),
};

const NavbarLogo = () => {
  const linkClickMyudak = (e: React.MouseEvent) => {
    e.preventDefault();
    chrome.tabs.create({ url: "https://myudak.com" });
  };
  return (
    <div className="flex items-center gap-2">
      {/* <Gem className="h-5 w-5 text-blue-600" /> */}
      <a href="#">
        <Icons.logoSiapDips className="h-5 w-5 logo-wrapper hover:cursor-pointer" />
      </a>
      <Icons.logoMyudak
        className="h-5 w-5 logo-containerNew hover:cursor-pointer"
        onClick={linkClickMyudak}
      />
      <span className="text-lg font-bold cursor-default">Siap Dipss</span>
    </div>
  );
};

export default NavbarLogo;
export { Icons };
