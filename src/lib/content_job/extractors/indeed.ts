/**
 * Extract job information from Indeed job pages with improved accuracy
 * @param {Object} jobData - The default job data object to populate
 * @returns {Object} - The populated job data object
 */
export function extractIndeedJobInfo(jobData: any) {
  try {
    // Extract job title - targeting Indeed's specific title elements
    const titleSelectors = [
      "h1.jobsearch-JobInfoHeader-title",
      'h2[data-testid="jobsearch-JobInfoHeader-title"]',
      ".jobsearch-JobInfoHeader-title",
      'h1[data-testid="jobTitle"]',
      "h1.icl-u-xs-mb--xs",
      'h1[data-testid="simpler-jobTitle"]',
      ".css-dpa6rd.e1tiznh50", // Matches your example
      '[data-testid="jobTitle-editJob"]',
    ];

    for (const selector of titleSelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent.trim()) {
        jobData.title = element.textContent.trim();
        break;
      }
    }

    // Extract company name - targeting Indeed's company name elements
    const companySelectors = [
      '.jobsearch-InlineCompanyRating div[data-testid="company-name"]',
      ".jobsearch-DesktopStickyContainer .jobsearch-JobInfoHeader-companyName",
      ".jobsearch-DesktopStickyContainer .jobsearch-JobInfoHeader-companyNameSimple",
      ".jobsearch-JobInfoHeader-companyName",
      ".css-88a4u1.e1wnkr790", // Matches your example
      '[data-testid="company-name"]',
      ".css-1h7lukg.eu4oa1w0", // Matches Indeed's new format
      ".companyName",
    ];

    for (const selector of companySelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent.trim()) {
        jobData.company = element.textContent.trim();
        break;
      }
    }

    // Extract location - targeting Indeed's location elements
    const locationSelectors = [
      ".jobsearch-JobInfoHeader-companyLocation",
      '[data-testid="jobsearch-JobInfoHeader-companyLocation"]',
      '.jobsearch-JobMetadataHeader-iconLabel[data-testid="location"]',
      ".companyLocation",
      ".css-5qwe7c.eu4oa1w0", // Matches your example
      ".css-xb6x8x.e37uo190", // Also in your sample
      '.jobDetails .data-testid="location"',
      ".css-1restlb.eu4oa1w0", // Found in one of your examples
    ];

    for (const selector of locationSelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent.trim()) {
        jobData.location = element.textContent.trim();
        break;
      }
    }

    // Extract salary information
    jobData.salary = extractSalaryFromIndeed();

    // Extract job type
    jobData.jobType = extractJobTypeFromIndeed();

    // Extract experience level
    jobData.experienceLevel = extractExperienceLevelFromIndeed();

    return jobData;
  } catch (error) {
    console.error("Error in Indeed job extraction:", error);
    return jobData;
  }
}

/**
 * Extract salary from Indeed job pages
 * @returns {string} - The salary text or empty string if not found
 */
function extractSalaryFromIndeed() {
  try {
    // Indeed has several places where salary might be displayed
    const salarySelectors = [
      // Primary salary selectors in job header
      ".jobsearch-JobMetadataHeader-item .salary-snippet-container",
      ".salary-snippet-container",
      ".css-18z4q2i.eu4oa1w0", // From your example
      'div[data-testid="attribute_snippet_testid"]:contains("₹")',
      'div[data-testid="attribute_snippet_testid"]:contains("$")',
      'div[data-testid="attribute_snippet_testid"]:contains("€")',

      // Backup selectors in job details
      "#jobDetailsSection",
      "#salaryInfoAndJobType",
      '.jobsearch-JobDescriptionSection-sectionItem div:contains("Salary")',
      ".metadata.salary-snippet-container",
      '[itemprop="baseSalary"]',

      // More general fallbacks
      ".css-5zy3wn", // Another class used for salary in Indeed
      '[data-testid="jobsearch-JobMetadataHeader"]',
    ];

    // First try exact element matches
    for (const selector of salarySelectors) {
      let elements;
      try {
        // Handle contains pseudo-selector specially
        if (selector.includes(":contains(")) {
          const baseSelector = selector.split(":contains(")[0];
          const searchTerm = selector.split(":contains(")[1].slice(0, -1);
          elements = Array.from(document.querySelectorAll(baseSelector)).filter(
            (el) => el.textContent.includes(searchTerm)
          );
        } else {
          elements = document.querySelectorAll(selector);
        }

        for (const element of elements) {
          const text = element.textContent.trim();
          if (text && isLikelySalary(text)) {
            return text;
          }
        }
      } catch (e) {
        // Continue to next selector if one fails
        continue;
      }
    }

    // Look for salary in job metadata items
    const metadataItems = document.querySelectorAll(
      ".jobsearch-JobMetadataHeader-item"
    );
    for (const item of metadataItems) {
      const text = item.textContent.trim();
      if (isLikelySalary(text)) {
        return text;
      }
    }

    // If no specific salary element found, try to find it in any container with currency symbols
    const allDivs = document.querySelectorAll("div");
    for (const div of allDivs) {
      const text = div.textContent.trim();
      // Only match very clear salary patterns to avoid false positives
      if (isDefinitelySalary(text)) {
        return text;
      }
    }

    // If not found, try the job description as a last resort
    const jobDescription = document.querySelector(
      "#jobDescriptionText, .jobsearch-jobDescriptionText"
    );
    if (jobDescription) {
      const description = jobDescription.textContent;
      const salaryPatterns = [
        /(?:salary|compensation|pay)\s*:?\s*[$₹€£¥]\s*[\d,]+\s*(?:to|-|–|—)\s*[$₹€£¥]?\s*[\d,]+/i,
        /[$₹€£¥]\s*[\d,]+\s*(?:to|-|–|—)\s*[$₹€£¥]?\s*[\d,]+\s*(?:per\s+year|per\s+month|\/year|\/month|a\s+year|a\s+month|annually)/i,
        /[$₹€£¥]\s*[\d,.]+k\s*(?:to|-|–|—)\s*[$₹€£¥]?\s*[\d,.]+k/i,
        /[\d,.]+\s*(?:to|-|–|—)\s*[\d,.]+\s+lpa/i,
        /[\d,.]+\s+lpa/i,
      ];

      for (const pattern of salaryPatterns) {
        const match = description.match(pattern);
        if (match) {
          return match[0].trim();
        }
      }
    }

    return "";
  } catch (error) {
    console.error("Error extracting salary from Indeed:", error);
    return "";
  }
}

/**
 * Determine if a text string is likely to be a salary
 * @param {string} text - The text to analyze
 * @returns {boolean} - True if likely a salary
 */
function isLikelySalary(text: string) {
  if (!text) return false;

  // Must have some numeric content
  if (!/\d/.test(text)) return false;

  // Contains currency symbol combined with numbers
  if (/[$₹€£¥]\s*\d/.test(text)) return true;

  // Contains a range with currency
  if (/[$₹€£¥][\d,.]+ ?(?:to|-|–|—) ?[$₹€£¥]?[\d,.]+/i.test(text)) return true;

  // Contains words indicating salary
  const salaryKeywords = [
    "salary",
    "pay",
    "compensation",
    "per year",
    "per month",
    "per annum",
    "annually",
    "a year",
    "a month",
    "hourly",
    "per hour",
    "lpa",
    "lakhs",
    "lac",
  ];

  for (const keyword of salaryKeywords) {
    if (text.toLowerCase().includes(keyword) && /\d/.test(text)) {
      return true;
    }
  }

  // Has K notation (e.g., $50K-$70K)
  if (/\d+k(-\d+k)?/i.test(text)) return true;

  // Has LPA notation (common in India)
  if (/\d+(\.\d+)?\s*lpa/i.test(text)) return true;

  return false;
}

/**
 * Determine if a text string is definitely a salary (stricter check)
 * @param {string} text - The text to analyze
 * @returns {boolean} - True if definitely a salary
 */
function isDefinitelySalary(text: string) {
  if (!text) return false;

  // Must have both currency symbol and numbers and be relatively short text
  if (/[$₹€£¥]\s*\d/.test(text) && text.length < 100) {
    return true;
  }

  // Must have range format with currency
  if (
    /[$₹€£¥][\d,.]+ ?(?:to|-|–|—) ?[$₹€£¥]?[\d,.]+/i.test(text) &&
    text.length < 100
  ) {
    return true;
  }

  // Must have explicit salary label with numbers
  if (
    /salary|compensation/i.test(text) &&
    (/\d+\s*(?:to|-|–|—)\s*\d+/.test(text) || /\$\s*\d+/.test(text)) &&
    text.length < 100
  ) {
    return true;
  }

  return false;
}

/**
 * Extract job type from Indeed job page
 * @returns {string} The extracted job type or empty string
 */
function extractJobTypeFromIndeed() {
  try {
    // Indeed job type could be in several places
    const jobTypeSelectors = [
      // Primary job type selectors
      'div[data-testid="attribute_snippet_testid"]',
      ".css-18z4q2i.eu4oa1w0", // From your example
      ".jobsearch-JobMetadataHeader-item",

      // Job details section job type
      '#jobDetailsSection div:contains("Job Type")',
      '#jobDetailsSection div:contains("Employment Type")',
      ".js-match-insights-provider-4r10qm.eu4oa1w0", // From your example

      // Job Insights section
      '[data-testid="job-type-tile"]',
      '[data-testid="list-item"] [data-testid="Full-time-tile"]',
      '[data-testid="list-item"] [data-testid="Part-time-tile"]',
      '[data-testid="list-item"] [data-testid="Contract-tile"]',
      '[data-testid="list-item"] [data-testid="Temporary-tile"]',
      '[data-testid="list-item"] [data-testid="Internship-tile"]',
      '[data-testid="list-item"] [data-testid="Fresher-tile"]',
    ];

    // Job type keywords to look for
    const jobTypeKeywords = [
      { keyword: "full-time", type: "Full-time" },
      { keyword: "part-time", type: "Part-time" },
      { keyword: "contract", type: "Contract" },
      { keyword: "temporary", type: "Temporary" },
      { keyword: "internship", type: "Internship" },
      { keyword: "fresher", type: "Fresher" },
      { keyword: "permanent", type: "Permanent" },
      { keyword: "remote", type: "Remote" },
      { keyword: "hybrid", type: "Hybrid" },
      { keyword: "on-site", type: "On-site" },
      { keyword: "work from home", type: "Remote" },
      { keyword: "onsite", type: "On-site" },
    ];

    // First try specific job type elements
    for (const selector of jobTypeSelectors) {
      let elements;
      try {
        // Handle contains pseudo-selector
        if (selector.includes(":contains(")) {
          const baseSelector = selector.split(":contains(")[0];
          const searchTerm = selector.split(":contains(")[1].slice(0, -1);
          elements = Array.from(document.querySelectorAll(baseSelector)).filter(
            (el) => el.textContent.includes(searchTerm)
          );
        } else {
          elements = document.querySelectorAll(selector);
        }

        for (const element of elements) {
          const text = element.textContent.trim().toLowerCase();

          // Skip elements that are clearly not job type related
          if (
            text.includes("salary") ||
            text.includes("reviews") ||
            text.length > 50
          ) {
            continue;
          }

          // Check if the element's text matches job type keywords
          for (const { keyword, type } of jobTypeKeywords) {
            if (text.includes(keyword)) {
              // For matches from metadata snippets, return the whole snippet
              if (
                selector.includes("attribute_snippet_testid") ||
                selector.includes("css-18z4q2i") ||
                selector.includes("JobMetadataHeader-item")
              ) {
                return element.textContent.trim();
              }
              return type;
            }
          }

          // If the parent element or this element contains "Job Type" or "Employment Type"
          if (text.includes("job type") || text.includes("employment type")) {
            // Try to get the value after the label
            const colonIndex = text.indexOf(":");
            if (colonIndex !== -1) {
              return text.substring(colonIndex + 1).trim();
            }

            // Try to find a sibling element that might contain the value
            const siblings = element.parentElement
              ? Array.from(element.parentElement.children)
              : [];

            for (const sibling of siblings) {
              if (sibling !== element) {
                const siblingText = sibling.textContent.trim();
                for (const { keyword, type } of jobTypeKeywords) {
                  if (siblingText.toLowerCase().includes(keyword)) {
                    return siblingText;
                  }
                }
              }
            }
          }
        }
      } catch (e) {
        continue;
      }
    }

    // Find job type in job insights tiles
    const tiles = document.querySelectorAll('[data-testid$="-tile"]');
    for (const tile of tiles) {
      const text = tile.textContent.trim();
      for (const { keyword, type } of jobTypeKeywords) {
        if (text.toLowerCase().includes(keyword)) {
          return type;
        }
      }
    }

    // Check in job description as a fallback
    const jobDescription = document.querySelector(
      "#jobDescriptionText, .jobsearch-jobDescriptionText"
    );
    if (jobDescription) {
      const description = jobDescription.textContent.toLowerCase();

      // Look for job type mentions in description
      const jobTypeMatches = [];

      for (const { keyword, type } of jobTypeKeywords) {
        if (description.includes(keyword)) {
          jobTypeMatches.push(type);
        }
      }

      // Look for "Job Type: X" pattern
      const jobTypePattern = /job\s*type\s*:?\s*([^,.;:]+)/i;
      const match = description.match(jobTypePattern);
      if (match && match[1]) {
        const extractedType = match[1].trim();
        for (const { keyword, type } of jobTypeKeywords) {
          if (extractedType.includes(keyword)) {
            jobTypeMatches.push(type);
          }
        }
      }

      // Return all matched job types in a comma-separated list
      if (jobTypeMatches.length > 0) {
        // Remove duplicates
        const uniqueTypes = [...new Set(jobTypeMatches)];
        return uniqueTypes.join(", ");
      }
    }

    return "";
  } catch (error) {
    console.error("Error extracting job type from Indeed:", error);
    return "";
  }
}

/**
 * Extract experience level from Indeed job page
 * @returns {string} The extracted experience level or empty string
 */
function extractExperienceLevelFromIndeed() {
  try {
    // Commonly used experience level selectors
    const experienceSelectors = [
      // Profile insights and job details
      '[data-testid="jobsearch-JobDescriptionSection-item"] div:contains("Experience")',
      '#jobDetailsSection div:contains("Experience")',
      ".js-match-insights-provider-nyn4vz",

      // Look for specific labels
      '.jobsearch-JobDescriptionSection-sectionItem div:contains("Experience")',
      '[data-testid="experienceLevel-title"]',
    ];

    // Experience level patterns to look for
    const experiencePatterns = [
      { pattern: /entry[- ]level/i, value: "Entry Level" },
      { pattern: /fresher/i, value: "Fresher" },
      { pattern: /trainee/i, value: "Trainee" },
      { pattern: /no experience/i, value: "No Experience Required" },
      { pattern: /0[- ]years?/i, value: "0 Years Experience" },
      { pattern: /junior/i, value: "Junior" },
      { pattern: /mid[- ]level/i, value: "Mid Level" },
      { pattern: /senior/i, value: "Senior" },
      { pattern: /lead/i, value: "Lead" },
      { pattern: /principal/i, value: "Principal" },
      { pattern: /executive/i, value: "Executive" },
      { pattern: /director/i, value: "Director" },
      { pattern: /manager/i, value: "Manager" },
      { pattern: /(\d+)\+?\s*(?:to|-|–|—)\s*(\d+)\+?\s*years?/i, value: null }, // Matches "X to Y years"
      { pattern: /(\d+)\+?\s*years?/i, value: null }, // Matches "X+ years"
    ];

    // First check in specific experience level sections
    for (const selector of experienceSelectors) {
      let elements;
      try {
        // Handle contains pseudo-selector
        if (selector.includes(":contains(")) {
          const baseSelector = selector.split(":contains(")[0];
          const searchTerm = selector.split(":contains(")[1].slice(0, -1);
          elements = Array.from(document.querySelectorAll(baseSelector)).filter(
            (el) => el.textContent.includes(searchTerm)
          );
        } else {
          elements = document.querySelectorAll(selector);
        }

        for (const element of elements) {
          const text = element.textContent.trim();

          // If the element text contains "Experience" label
          if (text.includes("Experience")) {
            const colonIndex = text.indexOf(":");
            if (colonIndex !== -1) {
              const experienceText = text.substring(colonIndex + 1).trim();
              if (experienceText) return experienceText;
            }

            // Try to find a sibling element with experience level
            const siblings = element.parentElement
              ? Array.from(element.parentElement.children)
              : [];

            for (const sibling of siblings) {
              if (sibling !== element) {
                const siblingText = sibling.textContent.trim();
                for (const { pattern, value } of experiencePatterns) {
                  const match = siblingText.match(pattern);
                  if (match) {
                    if (value === null) {
                      // For year ranges, extract properly
                      if (pattern.toString().includes("to")) {
                        if (match[1] && match[2]) {
                          return `${match[1]}-${match[2]} years experience`;
                        }
                      } else if (match[1]) {
                        return `${match[1]}${
                          siblingText.includes("+") ? "+" : ""
                        } years experience`;
                      }
                    }
                    return value || siblingText;
                  }
                }
              }
            }
          }

          // Check the element itself for experience patterns
          for (const { pattern, value } of experiencePatterns) {
            const match = text.match(pattern);
            if (match) {
              if (value === null) {
                // For year ranges, extract properly
                if (pattern.toString().includes("to")) {
                  if (match[1] && match[2]) {
                    return `${match[1]}-${match[2]} years experience`;
                  }
                } else if (match[1]) {
                  return `${match[1]}${
                    text.includes("+") ? "+" : ""
                  } years experience`;
                }
              }
              return value || text;
            }
          }
        }
      } catch (e) {
        continue;
      }
    }

    // Look for experience in job insights tiles
    const tiles = document.querySelectorAll('[data-testid$="-tile"]');
    for (const tile of tiles) {
      const text = tile.textContent.trim();
      for (const { pattern, value } of experiencePatterns) {
        const match = text.match(pattern);
        if (match) {
          if (value === null) {
            // For year ranges, extract properly
            if (pattern.toString().includes("to")) {
              if (match[1] && match[2]) {
                return `${match[1]}-${match[2]} years experience`;
              }
            } else if (match[1]) {
              return `${match[1]}${
                text.includes("+") ? "+" : ""
              } years experience`;
            }
          }
          return value || text;
        }
      }
    }

    // Check job description as a fallback
    const jobDescription = document.querySelector(
      "#jobDescriptionText, .jobsearch-jobDescriptionText"
    );
    if (jobDescription) {
      const description = jobDescription.textContent;

      // First look for experience section headers
      const experienceHeaders = [
        /experience[^.]*required[^.]*/i,
        /required[^.]*experience[^.]*/i,
        /experience[^.]*:/i,
        /work experience[^.]*/i,
        /qualifications[^.]*:/i,
      ];

      for (const headerPattern of experienceHeaders) {
        const headerMatch = description.match(headerPattern);
        if (headerMatch) {
          const headerText = headerMatch[0];
          // Look for experience patterns near the header
          for (const { pattern, value } of experiencePatterns) {
            const match = headerText.match(pattern);
            if (match) {
              if (value === null) {
                // For year ranges, extract properly
                if (pattern.toString().includes("to")) {
                  if (match[1] && match[2]) {
                    return `${match[1]}-${match[2]} years experience`;
                  }
                } else if (match[1]) {
                  return `${match[1]}${
                    headerText.includes("+") ? "+" : ""
                  } years experience`;
                }
              }
              return value || match[0];
            }
          }
        }
      }

      // Look for any experience pattern in the full description
      for (const { pattern, value } of experiencePatterns) {
        const match = description.match(pattern);
        if (match) {
          if (value === null) {
            // For year ranges, extract properly
            if (pattern.toString().includes("to")) {
              if (match[1] && match[2]) {
                return `${match[1]}-${match[2]} years experience`;
              }
            } else if (match[1]) {
              return `${match[1]}${
                description.includes("+") ? "+" : ""
              } years experience`;
            }
          }
          return value || match[0];
        }
      }
    }

    return "";
  } catch (error) {
    console.error("Error extracting experience level from Indeed:", error);
    return "";
  }
}
