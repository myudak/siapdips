export function SiteFooter() {
  const linkClickMyudak = (e: React.MouseEvent) => {
    e.preventDefault();
    chrome.tabs.create({ url: "https://myudak.site" });
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
      </div>
    </footer>
  );
}
