export function SiteFooter() {
  const linkClickMyudak = (e: React.MouseEvent) => {
    e.preventDefault();
    chrome.tabs.create({ url: "https://myudak.com" });
  };
  return (
    <footer>
      <div className="flex flex-col items-center bg-muted/50">
        <div
          className="my-4 flex space-x-2 text-sm text-muted-foreground hover:underline hover:cursor-pointer"
          onClick={linkClickMyudak}
        >
          {"myudakk"} | made with ❤️ \(￣︶￣*\))
        </div>
        <span className="text-sm text-muted-foreground ">
          remember the helpers is just that- a helper, dont use it for any
          system abuse etc, i dont responsible for any
        </span>
      </div>
    </footer>
  );
}
