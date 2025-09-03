/* eslint-disable @typescript-eslint/no-explicit-any */
import { isJobPage } from "./lib/content_job/utils/page_detection";
import { extractJobInfo } from "./lib/content_job/utils/job_extraction";
import { validateAndCleanJobData } from "./lib/content_job/utils/data_cleaning";
import {
  createTrackerButton,
  removeTrackerButton,
} from "./lib/content_job/ui/button";
import { showTrackerModal } from "./lib/content_job/ui/modal";
import { startObserving } from "./lib/content_job/observers";
import { toast } from "./lib/content_job/ui/toast";

/**
 * Main function to initialize the job tracker feature on a page.
 */
function init() {
  console.log("Job Tracker Initializing...");

  // The main logic to run on page change
  const onPageChange = () => {
    if (isJobPage()) {
      createTrackerButton(handleTrackButtonClick);
    } else {
      removeTrackerButton();
    }
  };

  // Start observing for page changes
  startObserving(onPageChange);
}

/**
 * Handles the click event of the "Track Job" button.
 */
async function handleTrackButtonClick() {
  try {
    const rawJobData = extractJobInfo();
    const jobData = validateAndCleanJobData(rawJobData);

    // Check if the job is already tracked
    // const isDuplicate = await chrome.runtime.sendMessage({
    //   type: "CHECK_DUPLICATE_JOB",
    //   url: jobData.url,
    // });

    // if (isDuplicate) {
    //   showDuplicateWarningModal(() => {
    //     showTrackerModal(jobData, saveJobData);
    //   });
    // } else {
    showTrackerModal(jobData, saveJobData);
    // }
  } catch (error) {
    console.error("Error handling track button click:", error);
  }
}

/**
 * Saves the job data to storage via the background script.
 * @param {Object} jobData - The job data to save.
 */
function saveJobData(jobData: any) {
  // chrome.runtime.sendMessage(
  //   { type: "SAVE_JOB", data: jobData },
  //   (response) => {
  //     console.log("jobData", jobData);
  //     if (response && response.success) {
  //       console.log("Job saved successfully!");
  //       // Optionally, show a success message to the user
  //     } else {
  //       console.error(
  //         "Failed to save job:",
  //         response ? response.error : "No response"
  //       );
  //       // Optionally, show an error message to the user
  //     }
  //   }
  // );

  // save the data to storage local array
  console.log("Saving job data to local storage:", jobData);

  chrome.storage.local.get("jobs", (result) => {
    const jobs = result.jobs || [];
    jobs.push(jobData);
    chrome.storage.local.set({ jobs }, () => {
      console.log("Job data saved successfully!");
      toast.success(
        "Job saved successfully!",
        "Your job has been added to tracking"
      );
      // Optionally, show a success message to the user
    });
  });
}

// Start the initialization process
init();
