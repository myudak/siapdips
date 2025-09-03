// Get URL parameters from hash
const hashParams = new URLSearchParams(location.hash.slice(1));
const originalUrl = decodeURIComponent(hashParams.get("url") || "");
const originalTitle = decodeURIComponent(
  hashParams.get("title") || "Sleeping Tab"
);
const faviconUrl = decodeURIComponent(hashParams.get("favicon") || "");

console.log("Original URL:", originalUrl);

// Display the URL
document.getElementById("urlDisplay").textContent =
  originalUrl || "No URL provided";

// Set title
if (originalTitle) {
  document.title = `😴 ${originalTitle}`;
}

// Set favicon
if (faviconUrl) {
  const link = document.createElement("link");
  link.rel = "icon";
  link.href = faviconUrl;
  link.id = "dynamic-favicon";
  document.head.appendChild(link);

  // Also display the favicon in the page design
  const faviconImg = document.getElementById("originalFavicon");
  faviconImg.src = faviconUrl;
  faviconImg.onload = () => {
    faviconImg.classList.add("loaded");
  };
  faviconImg.onerror = () => {
    // If favicon fails to load, hide the container and show regular sleeping face
    document.querySelector(".favicon-container").style.display = "none";
    const sleepingFace = document.createElement("div");
    sleepingFace.className = "sleeping-face";
    sleepingFace.textContent = "😴";
    document
      .querySelector(".browser-content")
      .insertBefore(sleepingFace, document.querySelector(".zzz"));
  };
} else {
  // No favicon provided, show regular sleeping face
  document.querySelector(".favicon-container").style.display = "none";
  const sleepingFace = document.createElement("div");
  sleepingFace.className = "sleeping-face";
  sleepingFace.textContent = "😴";
  document
    .querySelector(".browser-content")
    .insertBefore(sleepingFace, document.querySelector(".zzz"));
}

// Function to wake up the tab
function wakeUp() {
  if (originalUrl) {
    // Show loading spinner
    document.getElementById("loadingSpinner").style.display = "block";

    // Add a small delay for visual feedback
    setTimeout(() => {
      location.replace(originalUrl);
    }, 200);
  } else {
    alert("No URL to redirect to!");
  }
}

// Handle page refresh - redirect to original URL
window.addEventListener("beforeunload", (e) => {
  if (originalUrl && !e.defaultPrevented) {
    // This will redirect on refresh
    location.href = originalUrl;
  }
});

// Alternative approach: Check if page was refreshed
if (performance.navigation.type === 1 && originalUrl) {
  // Page was refreshed, redirect immediately
  location.href = originalUrl;
}

// Click anywhere to wake up
document.getElementById("clickOverlay").addEventListener("click", wakeUp);
document.body.addEventListener("click", wakeUp);

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  // Space bar or Enter to wake up
  if (e.code === "Space" || e.code === "Enter") {
    e.preventDefault();
    wakeUp();
  }
});

// Prevent default behavior on specific elements
document.querySelectorAll("a, button").forEach((el) => {
  el.addEventListener("click", (e) => {
    e.stopPropagation();
  });
});
