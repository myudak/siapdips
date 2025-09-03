/**
 * Extract job information from Glassdoor job pages
 * @param {Object} jobData - The default job data object to populate
 * @returns {Object} - The populated job data object
 */
export function extractGlassdoorJobInfo(jobData: any) {
  try {
    // Extract job title
    const titleSelectors = [
      ".JobDetails_jobTitle__s_j5h",
      'h1[data-test="job-title"]',
      ".job-title",
      ".css-17x2pwl.e11nt52q6",
    ];
    for (const selector of titleSelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent) {
        jobData.title = element.textContent.trim();
        break;
      }
    }

    // Extract company name
    const companySelectors = [
      ".EmployerProfile_employerName__Xemli",
      'div[data-test="employer-name"]',
      ".employer-name",
      ".css-16nw49e.e11nt52q1",
    ];
    for (const selector of companySelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent) {
        jobData.company = element.textContent
          .trim()
          .replace(/(\d+.\d+)\s*★?/, "")
          .trim();
        break;
      }
    }

    // Extract location
    const locationSelectors = [
      ".JobDetails_location__mSg5h",
      'div[data-test="location"]',
      ".location",
      ".css-1v5ksva.e11nt52q2",
    ];
    for (const selector of locationSelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent) {
        jobData.location = element.textContent.trim();
        break;
      }
    }

    // Extract salary
    const salarySelectors = [
      ".SalaryEstimate_salaryRange__brHFy",
      ".salary-estimate",
      '.css-1v5ksva.e11nt52q2:contains("$")',
      '.css-1v5ksva.e11nt52q2:contains("₹")',
    ];
    for (const selector of salarySelectors) {
      let element;
      if (selector.includes(":contains")) {
        const baseSelector = selector.split(":contains(")[0];
        const text = selector.split(":contains(")[1].replace(/['")]/g, "");
        const elements = Array.from(document.querySelectorAll(baseSelector));
        element = elements.find((el) => el.textContent?.includes(text));
      } else {
        element = document.querySelector(selector);
      }

      if (element && element.textContent) {
        jobData.salary = element.textContent.trim();
        break;
      }
    }

    // Extract job description to find other details
    const descriptionElement = document.querySelector(
      "#JobDescriptionContainer, .jobDescriptionContent"
    );
    const descriptionText = descriptionElement
      ? descriptionElement.textContent?.toLowerCase()
      : "";

    if (descriptionText) {
      // Extract job type
      if (descriptionText.includes("full-time")) jobData.jobType = "Full-time";
      else if (descriptionText.includes("part-time"))
        jobData.jobType = "Part-time";
      else if (descriptionText.includes("contract"))
        jobData.jobType = "Contract";
      else if (descriptionText.includes("internship"))
        jobData.jobType = "Internship";
      else if (descriptionText.includes("temporary"))
        jobData.jobType = "Temporary";

      // Extract experience level
      const expMatch = descriptionText.match(/(\d+)\+? years of experience/);
      if (expMatch) {
        jobData.experienceLevel = `${expMatch[1]}+ years`;
      } else if (descriptionText.includes("entry level")) {
        jobData.experienceLevel = "Entry Level";
      } else if (descriptionText.includes("senior")) {
        jobData.experienceLevel = "Senior";
      }
    }

    return jobData;
  } catch (error) {
    console.error("Error in Glassdoor job extraction:", error);
    return jobData;
  }
}
