/**
 * Profile image customization functionality
 */

export function applyCustomProfileImage(tabId: number): void {
  chrome.storage.local.get("profileImageLocal", (data) => {
    if (data.profileImageLocal) {
      chrome.scripting.executeScript({
        target: { tabId },
        args: [data],
        func: (data) => {
          const profileImages = [
            document.querySelector(
              "#user-profile > div > div.card.profile-with-cover > div.media.profil-cover-details.w-100 > div.media-left.pl-2.pt-2 > a > div"
            ) as HTMLElement,
            document.querySelector(
              "#navbar-mobile > ul.nav.navbar-nav.float-right > li.dropdown.dropdown-user.nav-item > a > span.avatar._avatar-online > div"
            ) as HTMLElement,
          ];

          profileImages.forEach((image) => {
            if (image) {
              image.style.backgroundImage = `url(${data.profileImageLocal})`;
            }
          });

          // FORM UNDIP FOOD TRUK
          const profileImage = document.querySelector(
            "#navbar-mobile > ul.nav.navbar-nav.float-right > li > a > span.avatar.avatar-online > img"
          ) as HTMLImageElement;
          if (profileImage) {
            profileImage.src = data.profileImageLocal;
          }
        },
      });
    }
  });
}
