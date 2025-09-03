/**
 * Extract job information from ZipRecruiter job pages
 * @param {Object} jobData - The default job data object to populate
 * @returns {Object} - The populated job data object
 */
export function extractZipRecruiterJobInfo(jobData: any) {
  try {
    // Extract job title
    const titleElement = document.querySelector("h1.job_title");
    if (titleElement && titleElement.textContent) {
      jobData.title = titleElement.textContent.trim();
    }

    // Extract company name
    const companyElement = document.querySelector("a.company_name");
    if (companyElement && companyElement.textContent) {
      jobData.company = companyElement.textContent.trim();
    }

    // Extract location
    const locationElement = document.querySelector("span.location");
    if (locationElement && locationElement.textContent) {
      jobData.location = locationElement.textContent.trim();
    }

    // Extract salary
    const salaryElement = document.querySelector("div.job_compensation");
    if (salaryElement && salaryElement.textContent) {
      jobData.salary = salaryElement.textContent.trim();
    }

    // Extract job type and experience from metadata
    const metadataElements = document.querySelectorAll("div.job_metadata_row");
    metadataElements.forEach((element) => {
      const text = element.textContent?.toLowerCase();
      if (text) {
        if (text.includes("employment type")) {
          jobData.jobType =
            element.querySelector("span:last-child")?.textContent?.trim() || "";
        }
        if (text.includes("experience")) {
          jobData.experienceLevel =
            element.querySelector("span:last-child")?.textContent?.trim() || "";
        }
      }
    });

    return jobData;
  } catch (error) {
    console.error("Error in ZipRecruiter job extraction:", error);
    return jobData;
  }
}
