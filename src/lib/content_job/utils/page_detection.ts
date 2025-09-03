// Enhanced and more precise job page detection
function isJobPage() {
  const url = window.location.href.toLowerCase();
  const pathname = window.location.pathname.toLowerCase();
  const hostname = window.location.hostname.toLowerCase();

  // LinkedIn-specific detection (most precise)
  if (hostname.includes("linkedin.com")) {
    return isLinkedInJobPage(url, pathname);
  }

  // Indeed-specific detection
  if (hostname.includes("indeed.com")) {
    return isIndeedJobPage(url, pathname);
  }

  // Glassdoor-specific detection
  if (hostname.includes("glassdoor.com")) {
    return isGlassdoorJobPage(url, pathname);
  }

  // Naukri-specific detection
  if (hostname.includes("naukri.com")) {
    return isNaukriJobPage(url, pathname);
  }

  // ZipRecruiter-specific detection
  if (hostname.includes("ziprecruiter.com")) {
    return isZipRecruiterJobPage(url, pathname);
  }

  // Generic job site detection for other sites
  return isGenericJobPage(url, pathname);
}

// LinkedIn-specific job page detection
function isLinkedInJobPage(url: string, pathname: string) {
  // Only show on these specific LinkedIn job-related pages:

  // 1. Individual job detail pages
  if (pathname.includes("/jobs/view/") || url.includes("/jobs/view/")) {
    return true;
  }

  // 2. Job search results pages
  if (pathname.includes("/jobs/search/") || url.includes("/jobs/search/")) {
    return true;
  }

  // 3. Jobs collection pages
  if (pathname.includes("/jobs/collections/")) {
    return true;
  }

  // 4. Company jobs pages
  if (pathname.includes("/company/") && pathname.includes("/jobs")) {
    return true;
  }

  // 5. Main jobs page with search results
  if (pathname === "/jobs/" || pathname === "/jobs") {
    // Additional check: only if there are job listings on the page
    return (
      document.querySelector(
        ".jobs-search-results, .job-card, .jobs-search__results-list"
      ) !== null
    );
  }

  // Don't show on these LinkedIn pages:
  // - Homepage (/feed/, / )
  // - Profile pages (/in/)
  // - Company pages (without /jobs)
  // - Messages (/messaging/)
  // - Network (/mynetwork/)
  // - Notifications (/notifications/)

  return false;
}

// Indeed-specific job page detection
function isIndeedJobPage(url: string, pathname: string) {
  // Individual job detail pages
  if (pathname.includes("/viewjob") || url.includes("jk=")) {
    return true;
  }

  // Job search results
  if (
    pathname.includes("/jobs") &&
    (url.includes("q=") || url.includes("l="))
  ) {
    return true;
  }

  // Company job pages
  if (pathname.includes("/cmp/") && pathname.includes("/jobs")) {
    return true;
  }

  return false;
}

// Glassdoor-specific job page detection
// Fixed Glassdoor-specific job page detection
function isGlassdoorJobPage(url: string, pathname: string) {
  console.log("Glassdoor check - URL:", url, "Pathname:", pathname);

  // Individual job detail pages
  if (pathname.includes("/job-listing/")) {
    console.log("Glassdoor: Individual job listing detected");
    return true;
  }

  // Job search results and main job pages
  if (
    pathname.includes("/Job/index.htm") ||
    pathname.includes("/job/jobs.htm")
  ) {
    console.log("Glassdoor: Job index page detected");
    return true;
  }

  // Alternative job search patterns
  if (pathname.includes("/Job/") && pathname.length > 5) {
    console.log("Glassdoor: Job section detected");
    return true;
  }

  // Company jobs section
  if (pathname.includes("/jobs/")) {
    console.log("Glassdoor: Company jobs section detected");
    return true;
  }

  // Company overview with job filters
  if (pathname.includes("/overview.htm") && url.includes("filter.jobType")) {
    console.log("Glassdoor: Company overview with job filter detected");
    return true;
  }

  // Job search with query parameters
  if (
    pathname.includes("/Jobs/") ||
    (url.includes("glassdoor") && url.includes("job"))
  ) {
    console.log("Glassdoor: Job search with parameters detected");
    return true;
  }

  // Additional patterns for international Glassdoor sites (like .co.in)
  if (pathname.includes("/Job/") || pathname.includes("/job/")) {
    // Check if it's actually a job-related page by looking at content indicators
    const hasJobContent = document.querySelector(
      [
        ".jobResult",
        ".job-search-card",
        ".react-job-listing",
        '[data-test="job-title"]',
        ".jobTitle",
        ".job-listing",
      ].join(",")
    );

    if (hasJobContent) {
      console.log("Glassdoor: Job content detected on page");
      return true;
    }
  }

  console.log("Glassdoor: No job page pattern matched");
  return false;
}

// Naukri-specific job page detection
function isNaukriJobPage(url: string, pathname: string) {
  // Individual job detail pages
  if (pathname.includes("/job-listings-") || pathname.includes("/jobs-")) {
    return true;
  }

  // Job search results
  if (
    pathname.includes("/jobs-in-") ||
    url.includes("qp=") ||
    url.includes("experience=")
  ) {
    return true;
  }

  // Company job pages
  if (pathname.includes("/company/") && pathname.includes("/jobs")) {
    return true;
  }

  return false;
}

// ZipRecruiter-specific job page detection
function isZipRecruiterJobPage(url: string, pathname: string) {
  // Individual job detail pages
  if (pathname.includes("/jobs/") && pathname.length > 10) {
    return true;
  }

  // Job search results
  if (pathname.includes("/candidate/search") || url.includes("search=")) {
    return true;
  }

  return false;
}

// Generic job page detection for other sites
function isGenericJobPage(url: string, pathname: string) {
  // Only proceed if URL contains job-related patterns
  const jobUrlPatterns = [
    "/job/",
    "/jobs/",
    "/career",
    "/careers",
    "/apply",
    "/application",
    "/position",
    "/vacancy",
    "/opening",
    "/hiring",
    "/recruitment",
    "/job-listing",
    "/job_listing",
    "/employment",
    "/opportunities",
  ];

  const hasJobUrl = jobUrlPatterns.some((pattern) =>
    pathname.includes(pattern)
  );

  if (!hasJobUrl) {
    return false;
  }

  // Additional content-based validation
  const title = document.title.toLowerCase();
  const bodyText = document.body ? document.body.innerText.toLowerCase() : "";

  // Strong job content indicators
  const strongJobIndicators = [
    "apply now",
    "job description",
    "apply for this job",
    "submit application",
    "job requirements",
    "job responsibilities",
    "position overview",
    "role description",
    "employment type",
    "salary range",
  ];

  const hasStrongIndicator = strongJobIndicators.some(
    (indicator) => bodyText.includes(indicator) || title.includes(indicator)
  );

  // Job-related title patterns
  const jobTitlePatterns = [
    "job",
    "position",
    "career",
    "opening",
    "opportunity",
    "employment",
    "vacancy",
    "hiring",
    "recruitment",
    "apply",
  ];

  const hasJobTitle = jobTitlePatterns.some((pattern) =>
    title.includes(pattern)
  );

  // Must have both URL pattern AND content validation
  return hasJobUrl && (hasStrongIndicator || hasJobTitle);
}

export {
  isJobPage,
  isLinkedInJobPage,
  isIndeedJobPage,
  isGlassdoorJobPage,
  isNaukriJobPage,
  isZipRecruiterJobPage,
  isGenericJobPage,
};
