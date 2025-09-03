/**
 * Cleans the extracted job data by trimming whitespace and removing duplicates.
 * @param {Object} jobData - The raw extracted job data.
 * @returns {Object} - The cleaned job data.
 */
export function cleanJobData(jobData: any) {
  const cleanedData = { ...jobData };

  for (const key in cleanedData) {
    if (typeof cleanedData[key] === "string") {
      cleanedData[key] = cleanedData[key].trim();
    }
  }

  // Example of more specific cleaning: remove "remote" from location if jobType is "Remote"
  if (
    cleanedData.jobType.toLowerCase().includes("remote") &&
    cleanedData.location.toLowerCase().includes("remote")
  ) {
    cleanedData.location = cleanedData.location.replace(/remote/i, "").trim();
    if (cleanedData.location.startsWith(",")) {
      cleanedData.location = cleanedData.location.substring(1).trim();
    }
  }

  return cleanedData;
}

/**
 * Validates and cleans the job data.
 * @param {Object} jobData - The job data to validate and clean.
 * @returns {Object} - The validated and cleaned job data.
 */
export function validateAndCleanJobData(jobData: any) {
  let cleanedData = cleanJobData(jobData);

  // Ensure essential fields are not empty
  if (!cleanedData.title || cleanedData.title === "Unknown Position") {
    cleanedData.title =
      document.title.split("|")[0].trim() || "Unknown Position";
  }
  if (!cleanedData.company || cleanedData.company === "Unknown Company") {
    // Try to get company from meta tags as a fallback
    const metaCompany = document.querySelector('meta[property="og:site_name"]');
    cleanedData.company = metaCompany
      ? (metaCompany as HTMLMetaElement).content
      : "Unknown Company";
  }

  // Add more validation rules as needed

  return cleanedData;
}
