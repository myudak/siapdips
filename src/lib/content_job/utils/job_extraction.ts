import {
  extractLinkedInJobInfo,
  extractIndeedJobInfo,
  extractGlassdoorJobInfo,
  extractNaukriJobInfo,
  extractZipRecruiterJobInfo,
  extractGenericJobInfo,
} from "../extractors";

/**
 * Main function to extract job information based on the current page.
 * It detects the site and calls the appropriate extractor function.
 * @returns {Object} - The extracted job data.
 */
export function extractJobInfo() {
  const hostname = window.location.hostname.toLowerCase();

  // Initialize a default job data object
  let jobData = {
    title: "Unknown Position",
    company: "Unknown Company",
    location: "Unknown Location",
    url: window.location.href,
    date: new Date().toLocaleDateString(),
    salary: "Not specified",
    jobType: "Not specified",
    experienceLevel: "Not specified",
    companySize: "Not specified",
    industry: "Not specified",
    notes: "",
    status: "saved",
  };

  try {
    if (hostname.includes("linkedin.com")) {
      jobData = extractLinkedInJobInfo(jobData);
    } else if (hostname.includes("indeed.com")) {
      jobData = extractIndeedJobInfo(jobData);
    } else if (hostname.includes("glassdoor.com")) {
      jobData = extractGlassdoorJobInfo(jobData);
    } else if (hostname.includes("naukri.com")) {
      jobData = extractNaukriJobInfo(jobData);
    } else if (hostname.includes("ziprecruiter.com")) {
      jobData = extractZipRecruiterJobInfo(jobData);
    } else {
      // Fallback to generic extractor for other sites
      jobData = extractGenericJobInfo(jobData);
    }
  } catch (error) {
    console.error("Error extracting job info:", error);
  }

  // Final check for essential data
  if (jobData.title === "Unknown Position") {
    jobData.title = document.title.split("|")[0].trim();
  }

  return jobData;
}
