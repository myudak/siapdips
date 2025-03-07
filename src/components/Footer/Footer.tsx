export function SiteFooter() {
  const linkClickMyudak = (e: React.MouseEvent) => {
    e.preventDefault();
    chrome.tabs.create({ url: "https://myudak.com" });
  };
  return (
    <footer>
      <div className="flex flex-col items-center dark:bg-gray-800 dark:border-gray-700">
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
