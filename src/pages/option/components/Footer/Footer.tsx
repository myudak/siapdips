export function SiteFooter() {
  return (
    <footer>
      <div className="flex flex-col items-center bg-muted/50">
        <div
          className="my-4 flex space-x-2 text-sm text-muted-foreground hover:underline hover:cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            chrome.tabs.create({ url: "https://myudak.com" });
          }}
        >
          {"myudakk"} | made with ❤️ \(￣︶￣*\))
        </div>
        <span className="text-sm text-muted-foreground ">
          {/* remember the helpers is just that- a helper, dont use it for any
          system abuse etc, i dont responsible for any */}
          remember the helper is just that—a helper, its not intended for- nor
          should it be used for any form of abuse. i dont responsible for any
        </span>
      </div>
    </footer>
  );
}
