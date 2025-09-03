/**
 * Generic job information extraction for any job site
 * @param {Object} jobData - The default job data object to populate
 * @returns {Object} - The populated job data object
 */
export function extractGenericJobInfo(jobData: any) {
  try {
    // Extract job title from common tags
    const titleSelectors = ["h1", "h2", '[class*="title"]', '[id*="title"]'];
    jobData.title = getBestMatch(titleSelectors, ["job", "position"]);

    // Extract company name
    const companySelectors = [
      '[class*="company"]',
      '[id*="company"]',
      '[class*="business"]',
      '[class*="employer"]',
    ];
    jobData.company = getBestMatch(companySelectors, ["company", "employer"]);

    // Extract location
    const locationSelectors = [
      '[class*="location"]',
      '[id*="location"]',
      '[class*="city"]',
      '[class*="address"]',
    ];
    jobData.location = getBestMatch(locationSelectors, [
      "location",
      "city",
      "address",
    ]);

    // Extract salary from text containing currency symbols
    const allText = document.body.innerText;
    const salaryRegex = /[$₹€£]\s?\d{1,3}(?:,?\d{3})*(?:\.\d{2})?/g;
    const salaries = allText.match(salaryRegex);
    if (salaries && salaries.length > 0) {
      jobData.salary = salaries[0];
    }

    // Extract job type from text
    const jobTypeRegex =
      /(full-?time|part-?time|contract|internship|temporary)/i;
    const jobTypeMatch = allText.match(jobTypeRegex);
    if (jobTypeMatch) {
      jobData.jobType = jobTypeMatch[0];
    }

    // Extract experience level from text
    const experienceRegex = /(\d+)\+?\s?years? of experience/i;
    const experienceMatch = allText.match(experienceRegex);
    if (experienceMatch) {
      jobData.experienceLevel = experienceMatch[0];
    }

    return jobData;
  } catch (error) {
    console.error("Error in generic job extraction:", error);
    return jobData;
  }
}

/**
 * Helper function to find the best matching text from a list of selectors
 * @param {string[]} selectors - Array of CSS selectors to query
 * @param {string[]} keywords - Keywords to look for in the text content
 * @returns {string} - The best matching text or an empty string
 */
function getBestMatch(selectors: string[], keywords: string[]): string {
  for (const selector of selectors) {
    const elements = document.querySelectorAll(selector);
    for (const element of elements) {
      const text = element.textContent?.trim().toLowerCase();
      if (text) {
        for (const keyword of keywords) {
          if (text.includes(keyword)) {
            return element.textContent?.trim() || "";
          }
        }
      }
    }
  }
  // If no keyword match, return the first non-empty text from the first selector
  if (selectors.length > 0) {
    const firstSelectorElements = document.querySelectorAll(selectors[0]);
    if (
      firstSelectorElements.length > 0 &&
      firstSelectorElements[0].textContent
    ) {
      return firstSelectorElements[0].textContent.trim();
    }
  }
  return "";
}
