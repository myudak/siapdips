import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Building,
  Briefcase,
  MapPin,
  Target,
  Link,
  DollarSign,
  Clock,
  Users,
  TrendingUp,
  Building2,
  FileText,
} from "lucide-react";
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Select,
} from "../ui/select";

// Define the job interface based on the new data structure
interface Job {
  company: string;
  companySize: string;
  date: string;
  experienceLevel: string;
  industry: string;
  jobType: string;
  location: string;
  notes: string;
  salary: string;
  status: string;
  title: string;
  url: string;
}

const JobManual = () => {
  const [jobData, setJobData] = useState<Job[]>([]);
  const [addFormData, setAddFormData] = useState<Job>({
    company: "",
    companySize: "",
    date: "",
    experienceLevel: "",
    industry: "",
    jobType: "",
    location: "",
    notes: "",
    salary: "",
    status: "saved",
    title: "",
    url: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadJobsFromStorage = async () => {
      try {
        if (
          typeof chrome !== "undefined" &&
          chrome.storage &&
          chrome.storage.local
        ) {
          const result = await chrome.storage.local.get(["jobs"]);
          const jobs = result.jobs || [];
          setJobData(jobs);
        } else {
          // Fallback for non-extension environment
          const stored = localStorage.getItem("jobs");
          const jobs = stored ? JSON.parse(stored) : [];
          setJobData(jobs);
        }
      } catch (error) {
        console.error("Error loading jobs from storage:", error);
        setJobData([]);
      }
    };

    loadJobsFromStorage();
  }, []);

  // Utility functions for job management
  const saveJobsToStorage = async (jobs: Job[]) => {
    try {
      if (
        typeof chrome !== "undefined" &&
        chrome.storage &&
        chrome.storage.local
      ) {
        await chrome.storage.local.set({ jobs });
      } else {
        localStorage.setItem("jobs", JSON.stringify(jobs));
      }
      setJobData(jobs);
    } catch (error) {
      console.error("Error saving jobs to storage:", error);
    }
  };

  // Add job functions
  const validateAddJobForm = () => {
    const errors: Record<string, string> = {};

    // Required field validation
    if (!addFormData.company.trim()) {
      errors.company = "Company name is required";
    }
    if (!addFormData.title.trim()) {
      errors.title = "Job title is required";
    }
    if (!addFormData.location.trim()) {
      errors.location = "Location is required";
    }
    if (!addFormData.status.trim()) {
      errors.status = "Status is required";
    }
    if (!addFormData.url.trim()) {
      errors.url = "Job URL is required";
    } else {
      // Check for duplicate URL
      const isDuplicate = jobData.some((job) => job.url === addFormData.url);
      if (isDuplicate) {
        errors.url = "This URL already exists";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveAddJob = async () => {
    if (!validateAddJobForm()) return;

    const newJob: Job = {
      ...addFormData,
      date: new Date().toLocaleDateString(),
    };

    const updatedJobs = [...jobData, newJob];
    await saveJobsToStorage(updatedJobs);

    // Reset form and close dialog
    setAddFormData({
      company: "",
      companySize: "",
      date: "",
      experienceLevel: "",
      industry: "",
      jobType: "",
      location: "",
      notes: "",
      salary: "",
      status: "saved",
      title: "",
      url: "",
    });
    setFormErrors({});
  };

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700 p-0 m-0 border-0">
      <CardHeader className="p-0 mb-3">
        <CardTitle>Add job manually</CardTitle>
        <CardDescription>
          Can't see the tracker button? Add the job manually:
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 mt-5">
        <div className="flex flex-col gap-4 py-4">
          {/* Required Fields Row 1 */}
          <div className="flex gap-4">
            <div className="flex flex-col gap-2 flex-1">
              <Label htmlFor="add-company" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Company *
              </Label>
              <Input
                id="add-company"
                value={addFormData.company}
                onChange={(e) =>
                  setAddFormData({
                    ...addFormData,
                    company: e.target.value,
                  })
                }
                className={`dark:bg-gray-800 dark:border-gray-700" ${
                  formErrors.company ? "border-red-500" : ""
                }`}
                placeholder="Enter company name"
              />
              {formErrors.company && (
                <span className="text-sm text-red-500">
                  {formErrors.company}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <Label htmlFor="add-title" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Job Title *
              </Label>
              <Input
                id="add-title"
                value={addFormData.title}
                onChange={(e) =>
                  setAddFormData({
                    ...addFormData,
                    title: e.target.value,
                  })
                }
                className={`dark:bg-gray-800 dark:border-gray-700 ${
                  formErrors.title ? "border-red-500" : ""
                }`}
                placeholder="Enter job title"
              />
              {formErrors.title && (
                <span className="text-sm text-red-500">{formErrors.title}</span>
              )}
            </div>
          </div>

          {/* Required Fields Row 2 */}
          <div className="flex gap-4">
            <div className="flex flex-col gap-2 flex-1">
              <Label htmlFor="add-location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location *
              </Label>
              <Input
                id="add-location"
                value={addFormData.location}
                onChange={(e) =>
                  setAddFormData({
                    ...addFormData,
                    location: e.target.value,
                  })
                }
                className={`dark:bg-gray-800 dark:border-gray-700 ${
                  formErrors.location ? "border-red-500" : ""
                }`}
                placeholder="e.g., Jakarta, Indonesia"
              />
              {formErrors.location && (
                <span className="text-sm text-red-500">
                  {formErrors.location}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <Label htmlFor="add-status" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Status *
              </Label>
              <Select
                value={addFormData.status}
                onValueChange={(value) =>
                  setAddFormData({ ...addFormData, status: value })
                }
              >
                <SelectTrigger
                  className={formErrors.status ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="saved">Saved</SelectItem>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="assessment">Assessment</SelectItem>
                  <SelectItem value="phone-screen">Phone Screen</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="offer">Offer</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.status && (
                <span className="text-sm text-red-500">
                  {formErrors.status}
                </span>
              )}
            </div>
          </div>

          {/* Required URL Field */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="add-url" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              Job URL *
            </Label>
            <Input
              id="add-url"
              value={addFormData.url}
              onChange={(e) =>
                setAddFormData({
                  ...addFormData,
                  url: e.target.value,
                })
              }
              className={`dark:bg-gray-800 dark:border-gray-700 ${
                formErrors.url ? "border-red-500" : ""
              }`}
              placeholder="https://company.com/jobs/123"
            />
            {formErrors.url && (
              <span className="text-sm text-red-500">{formErrors.url}</span>
            )}
          </div>

          {/* Optional Fields Row 1 */}
          <div className="flex gap-4">
            <div className="flex flex-col gap-2 flex-1">
              <Label htmlFor="add-salary" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Salary
              </Label>
              <Input
                className="dark:bg-gray-800 dark:border-gray-700"
                id="add-salary"
                value={addFormData.salary}
                onChange={(e) =>
                  setAddFormData({
                    ...addFormData,
                    salary: e.target.value,
                  })
                }
                placeholder="e.g., $80,000 - $100,000"
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <Label htmlFor="add-jobType" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Job Type
              </Label>
              <Input
                className="dark:bg-gray-800 dark:border-gray-700"
                id="add-jobType"
                value={addFormData.jobType}
                onChange={(e) =>
                  setAddFormData({
                    ...addFormData,
                    jobType: e.target.value,
                  })
                }
                placeholder="e.g., Full-time, Part-time"
              />
            </div>
          </div>

          {/* Optional Fields Row 2 */}
          <div className="flex gap-4">
            <div className="flex flex-col gap-2 flex-1">
              <Label
                htmlFor="add-companySize"
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Company Size
              </Label>
              <Input
                className="dark:bg-gray-800 dark:border-gray-700"
                id="add-companySize"
                value={addFormData.companySize}
                onChange={(e) =>
                  setAddFormData({
                    ...addFormData,
                    companySize: e.target.value,
                  })
                }
                placeholder="e.g., 50-200 employees"
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <Label
                htmlFor="add-experienceLevel"
                className="flex items-center gap-2"
              >
                <TrendingUp className="h-4 w-4" />
                Experience Level
              </Label>
              <Input
                className="dark:bg-gray-800 dark:border-gray-700"
                id="add-experienceLevel"
                value={addFormData.experienceLevel}
                onChange={(e) =>
                  setAddFormData({
                    ...addFormData,
                    experienceLevel: e.target.value,
                  })
                }
                placeholder="e.g., Mid-level, Senior"
              />
            </div>
          </div>

          {/* Industry Field */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="add-industry" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Industry
            </Label>
            <Input
              className="dark:bg-gray-800 dark:border-gray-700"
              id="add-industry"
              value={addFormData.industry}
              onChange={(e) =>
                setAddFormData({
                  ...addFormData,
                  industry: e.target.value,
                })
              }
              placeholder="e.g., Technology, Finance, Healthcare"
            />
          </div>

          {/* Notes Field */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="add-notes" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Notes
            </Label>
            <Textarea
              className="dark:bg-gray-800 dark:border-gray-700"
              id="add-notes"
              value={addFormData.notes}
              onChange={(e) =>
                setAddFormData({ ...addFormData, notes: e.target.value })
              }
              rows={3}
              placeholder="Additional notes about this job opportunity..."
            />
          </div>
        </div>

        <div className="flex  mt-4">
          <Button className="w-full" onClick={handleSaveAddJob}>
            Save Job
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobManual;
