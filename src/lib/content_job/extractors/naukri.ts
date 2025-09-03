/**
 * Extract job information from Naukri.com job pages
 * @param {Object} jobData - The default job data object to populate
 * @returns {Object} - The populated job data object
 */
export function extractNaukriJobInfo(jobData: any) {
  try {
    // Extract job title
    const titleElement = document.querySelector(".jd-header-title");
    if (titleElement && titleElement.textContent) {
      jobData.title = titleElement.textContent.trim();
    }

    // Extract company name
    const companyElement = document.querySelector(".jd-header-comp-name a");
    if (companyElement && companyElement.textContent) {
      jobData.company = companyElement.textContent.trim();
    }

    // Extract location
    const locationElement = document.querySelector(".loc a");
    if (locationElement && locationElement.textContent) {
      jobData.location = locationElement.textContent.trim();
    }

    // Extract salary
    const salaryElement = document.querySelector(".salary");
    if (salaryElement && salaryElement.textContent) {
      jobData.salary = salaryElement.textContent.trim();
    }

    // Extract experience
    const experienceElement = document.querySelector(".exp");
    if (experienceElement && experienceElement.textContent) {
      jobData.experienceLevel = experienceElement.textContent.trim();
    }

    // Extract job type from tags
    const tagsContainer = document.querySelector(".jd-tags");
    if (tagsContainer) {
      const tags = Array.from(tagsContainer.querySelectorAll("a.tag"));
      const jobTypeKeywords = [
        "full-time",
        "part-time",
        "contract",
        "internship",
        "remote",
        "hybrid",
      ];
      const foundTypes = tags
        .map((tag) => tag.textContent?.toLowerCase().trim())
        .filter((text) => text && jobTypeKeywords.includes(text));

      if (foundTypes.length > 0) {
        jobData.jobType = foundTypes.join(", ");
      }
    }

    return jobData;
  } catch (error) {
    console.error("Error in Naukri job extraction:", error);
    return jobData;
  }
}
