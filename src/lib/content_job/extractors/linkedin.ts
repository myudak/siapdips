/**
 * LinkedIn job extraction - enhanced for accuracy
 * @param {Object} jobData - The job data object to populate
 * @return {Object} - The populated job data object
 */
export function extractLinkedInJobInfo(jobData: any) {
  try {
    // Extract job title (multiple selectors for different LinkedIn layouts)
    const titleSelectors = [
      ".job-details-jobs-unified-top-card__job-title",
      ".t-24.t-bold.inline h1",
      ".topcard__title",
      ".jobs-unified-top-card__job-title",
      "h1.t-24",
    ];

    for (const selector of titleSelectors) {
      const elements = document.querySelectorAll(selector);
      if (elements && elements.length > 0) {
        for (const element of elements) {
          const text = element.textContent?.trim();
          if (text) {
            jobData.title = text;
            break;
          }
        }
        if (jobData.title !== "Unknown Position") break;
      }
    }

    // Extract company name
    const companySelectors = [
      ".job-details-jobs-unified-top-card__company-name a",
      ".job-details-jobs-unified-top-card__company-name",
      ".topcard__org-name-link",
      ".jobs-unified-top-card__company-name",
      'a[data-tracking-control-name="public_jobs_topcard_company-name"]',
    ];

    for (const selector of companySelectors) {
      const elements = document.querySelectorAll(selector);
      if (elements && elements.length > 0) {
        for (const element of elements) {
          const text = element.textContent?.trim();
          if (text) {
            jobData.company = text;
            break;
          }
        }
        if (jobData.company !== "Unknown Company") break;
      }
    }

    // Extract location
    const locationSelectors = [
      ".job-details-jobs-unified-top-card__bullet",
      ".job-details-jobs-unified-top-card__primary-description-container .tvm__text:first-child",
      ".topcard__flavor--bullet",
      ".jobs-unified-top-card__bullet",
      ".job-details-jobs-unified-top-card__workplace-type",
    ];

    for (const selector of locationSelectors) {
      const elements = document.querySelectorAll(selector);
      if (elements && elements.length > 0) {
        for (const element of elements) {
          const text = element.textContent?.trim();
          if (
            text &&
            !text.includes("employees") &&
            !text.includes("followers") &&
            !text.includes("applicants")
          ) {
            jobData.location = text;
            break;
          }
        }
        if (jobData.location !== "Unknown Location") break;
      }
    }

    // Extract job type (Remote, Hybrid, On-site, Full-time, Part-time, etc.)
    const jobTypeSelectors = [
      ".job-details-jobs-unified-top-card__workplace-type",
      ".jobs-unified-top-card__workplace-type",
      ".job-details-preferences-and-skills__pill",
      '.job-criteria__item [data-test-job-criteria-label="Working pattern"]',
      ".job-details-fit-level-preferences",
    ];

    for (const selector of jobTypeSelectors) {
      const elements = document.querySelectorAll(selector);
      if (elements && elements.length > 0) {
        for (const element of elements) {
          const text = element.textContent?.trim();

          const addJobType = (type: string) => {
            if (jobData.jobType) {
              jobData.jobType += `, ${type}`;
            } else {
              jobData.jobType = type;
            }
          };

          // Check for various job type patterns
          if (text) {
            jobData.jobType = "";
            if (/remote|work from home|wfh/i.test(text)) {
              addJobType("Remote");
            }
            if (/hybrid/i.test(text)) {
              addJobType("Hybrid");
            }
            if (/on-?site|in-?office/i.test(text)) {
              addJobType("On-site");
            }
            if (/full-?time/i.test(text)) {
              addJobType("Full-time");
            }
            if (/part-?time/i.test(text)) {
              addJobType("Part-time");
            }
            if (/contract/i.test(text)) {
              addJobType("Contract");
            }
            if (/intern|internship/i.test(text)) {
              addJobType("Internship");
            }
            if (/temporary/i.test(text)) {
              addJobType("Temporary");
            }
          }
        }
      }
    }

    // Extract experience level from criteria items and job description
    // First try from job criteria sections
    const jobInfoSections = document.querySelectorAll(
      ".description__job-criteria-item, .job-criteria__item"
    );
    for (const section of jobInfoSections) {
      if (!section) continue;

      const label = section.querySelector(
        ".description__job-criteria-subheader, .job-criteria__subheader"
      );
      const value = section.querySelector(
        ".description__job-criteria-text, .job-criteria__text"
      );

      if (label && value) {
        const labelText = label.textContent?.trim().toLowerCase() || "";
        const valueText = value.textContent?.trim() || "";

        if (
          labelText.includes("experience") ||
          labelText.includes("seniority")
        ) {
          jobData.experienceLevel = valueText;
          break;
        }
      }
    }

    // If experience level not found in criteria, try from job description
    // if (!jobData.experienceLevel) {
    const jobDescElement = document.querySelector(
      ".jobs-description__content, #job-details"
    );
    if (jobDescElement) {
      const jobDescText = jobDescElement.textContent || "";

      console.log("Job Description Text:", jobDescText);

      // Look for experience patterns in the job description
      const experiencePatterns = [
        /\b(?:entry[- ]level|fresher|fresh graduate)\b/i,
        /\bno experience\b/i,
        /\b0[- ]?(?:year|yr)[s]? experience\b/i,
        /\b(?:1|one)[- ]?(?:year|yr)[s]? experience\b/i,
        /\b(?:2|two)[- ]?(?:year|yr)[s]? experience\b/i,
        /\b(?:3|three)[- ]?(?:year|yr)[s]? experience\b/i,
        /\b(?:4|four)[- ]?(?:year|yr)[s]? experience\b/i,
        /\b(?:5|five)[- ]?(?:year|yr)[s]? experience\b/i,
        /\b(?:1|one)[- ]?(?:to|–|-)[- ]?(?:2|two)[- ]?(?:year|yr)[s]? experience\b/i,
        /\b(?:2|two)[- ]?(?:to|–|-)[- ]?(?:3|three)[- ]?(?:year|yr)[s]? experience\b/i,
        /\b(?:3|three)[- ]?(?:to|–|-)[- ]?(?:5|five)[- ]?(?:year|yr)[s]? experience\b/i,
        /\b(?:5|five)[- ]?(?:to|–|-)[- ]?(?:8|eight)[- ]?(?:year|yr)[s]? experience\b/i,
        /\b(?:8|eight)[- ]?(?:to|–|-)[- ]?(?:10|ten)[- ]?(?:year|yr)[s]? experience\b/i,
        /\b(?:10|ten)\+[- ]?(?:year|yr)[s]? experience\b/i,
        /\bjunior\b/i,
        /\bmid[- ]level\b/i,
        /\bsenior\b/i,
        /\bprincipal\b/i,
        /\blead\b/i,
      ];

      for (const pattern of experiencePatterns) {
        const match = jobDescText.match(pattern);
        if (match) {
          jobData.experienceLevel = match[0].trim();
          break;
        }
      }
    }
    // }

    // Extract salary - multiple approaches
    // First try from dedicated salary sections
    const salarySelectors = [
      '.job-details-jobs-unified-top-card__job-insight span:contains("$"), .job-details-jobs-unified-top-card__job-insight span:contains("₹")',
      ".compensation, .salary",
      ".job-details-jobs-unified-top-card__salary-info",
    ];

    let foundSalary = false;

    // Try from job criteria or insights
    for (const section of jobInfoSections) {
      if (!section) continue;

      const label = section.querySelector(
        ".description__job-criteria-subheader, .job-criteria__subheader"
      );
      const value = section.querySelector(
        ".description__job-criteria-text, .job-criteria__text"
      );

      if (label && value) {
        const labelText = label.textContent?.trim().toLowerCase() || "";
        const valueText = value.textContent?.trim() || "";

        if (
          labelText.includes("salary") ||
          labelText.includes("compensation") ||
          labelText.includes("pay")
        ) {
          jobData.salary = valueText;
          foundSalary = true;
          break;
        }
      }
    }

    // If salary not found in criteria, try from job insights
    if (!foundSalary) {
      const salaryElements = document.querySelectorAll(
        ".job-details-jobs-unified-top-card__job-insight, .salary-top-card__salary-range"
      );
      for (const element of salaryElements) {
        if (!element) continue;

        const text = element.textContent?.trim() || "";
        if (
          text.includes("$") ||
          text.includes("₹") ||
          text.includes("€") ||
          text.includes("£") ||
          text.includes("¥") ||
          text.includes("salary") ||
          text.includes("compensation") ||
          text.includes("/yr") ||
          text.includes("/hour") ||
          text.includes("per year") ||
          text.includes("per hour")
        ) {
          jobData.salary = text;
          foundSalary = true;
          break;
        }
      }
    }

    if (!foundSalary) {
      const label = document.querySelector(
        ".job-details-fit-level-preferences"
      );
      if (label) {
        const lines = (label as HTMLElement).innerText
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);
        const salaryKeywords = [
          "$",
          "₹",
          "€",
          "£",
          "¥",
          "salary",
          "compensation",
          "/yr",
          "/hour",
          "per year",
          "per hour",
        ];
        const salaryLine = lines.find((line) =>
          salaryKeywords.some((keyword) => line.toLowerCase().includes(keyword))
        );
        if (salaryLine) {
          jobData.salary = salaryLine;
          foundSalary = true;
        }
      }
    }

    // If salary still not found, search in job description
    if (!foundSalary) {
      const jobDescElement = document.querySelector(
        ".jobs-description__content, #job-details"
      );
      if (jobDescElement) {
        const jobDescText = jobDescElement.textContent || "";

        // Look for salary patterns in the job description
        const salaryPatterns = [
          /\$\s*[\d,]+\s*-\s*\$\s*[\d,]+\s*(?:per\s+year|per\s+annum|\/year|\/yr|a\s+year|annually)/i,
          /\$\s*[\d,]+\s*(?:per\s+year|per\s+annum|\/year|\/yr|a\s+year|annually)/i,
          /₹\s*[\d,]+\s*-\s*₹\s*[\d,]+\s*(?:per\s+year|per\s+annum|\/year|\/yr|a\s+year|annually)/i,
          /₹\s*[\d,]+\s*(?:per\s+year|per\s+annum|\/year|\/yr|a\s+year|annually)/i,
          /₹\s*[\d,\.]+\s*(?:lakh|lakhs|lpa)/i,
          /₹\s*[\d,\.]+\s*-\s*₹\s*[\d,\.]+\s*(?:lakh|lakhs|lpa)/i,
          /(?:[\d,\.]+|[\d,\.]+\s*-\s*[\d,\.]+)\s*(?:lakh|lakhs|lpa)/i,
          /salary\s*:\s*[\$₹€£¥]\s*[\d,]+\s*-\s*[\$₹€£¥]\s*[\d,]+/i,
          /compensation\s*:\s*[\$₹€£¥]\s*[\d,]+\s*-\s*[\$₹€£¥]\s*[\d,]+/i,
          /salary\s*[\$₹€£¥]\s*[\d,]+\s*-\s*[\$₹€£¥]\s*[\d,]+/i,
          /[\$₹€£¥]\s*[\d,]+\s*-\s*[\$₹€£¥]\s*[\d,]+\s*(?:per\s+month|monthly|\/month|\/mo|a\s+month)/i,
          /[\$₹€£¥]\s*[\d,]+\s*(?:per\s+month|monthly|\/month|\/mo|a\s+month)/i,
        ];

        for (const pattern of salaryPatterns) {
          const match = jobDescText.match(pattern);
          if (match) {
            jobData.salary = match[0].trim();
            const extracted = match[0].trim();

            if (extracted.length < 50) {
              jobData.salary = extracted;
            }

            break;
          }
        }
        if (!jobData.salary) {
          jobData.salary = "Not disclosed";
        }
      }
    }

    // Extract company size, if available
    const companySizeElements = document.querySelectorAll(
      ".jobs-company__inline-information"
    );
    for (const element of companySizeElements) {
      if (!element) continue;
      const text = element.textContent?.trim() || "";
      if (text.includes("employee")) {
        jobData.companySize = text;
        break;
      }
    }

    // Extract industry, if available
    const industryElements = document.querySelectorAll(".t-14.mt5");
    for (const element of industryElements) {
      if (!element) continue;
      const text = element.textContent?.trim() || "";
      // if (!text.includes("employee") && !text.includes("LinkedIn")) {
      jobData.industry = text.split("\n")[0].trim();
      break;
      // }
    }

    return jobData;
  } catch (error) {
    console.error("Error in LinkedIn extraction:", error);
    return jobData;
  }
}
