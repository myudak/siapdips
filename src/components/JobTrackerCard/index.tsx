import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { ArrowUpRightIcon, GripHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { JobDashboard } from "./JobDashboard";
import { JobCard } from "./JobCard";
import JobManual from "./JobManual";

export type Job = {
  title: string;
  company: string;
  location: string;
  date: string;
  salary: string;
  jobType: string;
  companySize: string;
  industry: string;
  experienceLevel: string;
  url?: string;
  status: string;
};

export default function JobTrackerCard({
  listeners,
  attributes,
}: {
  listeners?: DraggableAttributes;
  attributes?: SyntheticListenerMap;
}) {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    chrome.storage.local.get("jobs", (result) => {
      const storedJobs = result.jobs || [];
      setJobs(storedJobs);
    });
  }, []);

  const handleDeleteJobs = (job: Job) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    const updatedJobs = jobs.filter((j) => j !== job);
    chrome.storage.local.set({ jobs: updatedJobs });

    setJobs(updatedJobs);
    toast.success("Job deleted successfully");
  };

  const handleApplyJobs = (job: Job) => {
    console.log("handleAPplyJobs");
    const updatedJobs = jobs.map((j) =>
      j === job ? { ...j, status: "applied" } : j
    );

    chrome.storage.local.set({ jobs: updatedJobs });
    setJobs(updatedJobs);
    toast.success("done apply jobs");
  };

  return (
    <Card className="w-full dark:bg-gray-800 dark:border-gray-700 ">
      <Button
        variant="ghost"
        size="icon"
        className="w-full h-8 rounded-b-none border border-b-0 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
        {...attributes}
        {...listeners}
      >
        <GripHorizontal className="h-4 w-4" />
      </Button>
      <CardContent className="flex flex-col">
        <div className="flex justify-between">
          <div className="text-lg font-semibold">Job Tracker</div>
          <Button
            size={"icon"}
            variant="ghost"
            title="Open Dashboard"
            onClick={() => {
              // chrome tab open html
              chrome.tabs.create({ url: "job.html" });
            }}
          >
            <ArrowUpRightIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="gap-4">
          <Tabs defaultValue="saved">
            <TabsList className="dark:bg-gray-800 dark:border-gray-700">
              <TabsTrigger value="saved">Saved</TabsTrigger>
              <TabsTrigger value="applied">Applied</TabsTrigger>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="add job">Add Job</TabsTrigger>
            </TabsList>
            <TabsContent value="saved">
              <Card className="dark:bg-gray-800 dark:border-gray-700 p-0 m-0 border-0">
                <CardHeader className="p-0 mb-3">
                  <CardTitle>Saved for later</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {jobs.filter((job) => job.status === "saved").length > 0 ? (
                    <>
                      {(() => {
                        const saved = jobs
                          .filter((j) => j.status === "saved")
                          .sort(
                            (a, b) =>
                              new Date(b.date).getTime() -
                              new Date(a.date).getTime()
                          );
                        return (
                          <>
                            {saved.slice(0, 5).map((job, index) => (
                              <JobCard
                                key={index}
                                job={job}
                                handleDeleteJobs={handleDeleteJobs}
                                handleApplyJobs={handleApplyJobs}
                              />
                            ))}
                            {saved.length > 5 && (
                              <Button
                                variant="outline"
                                className="mt-2 w-full"
                                onClick={() => {
                                  chrome.tabs.create({ url: "job.html" });
                                }}
                              >
                                See more saved jobs
                              </Button>
                            )}
                          </>
                        );
                      })()}
                    </>
                  ) : (
                    <CardDescription>
                      No jobs saved yet. Start tracking your jobs!
                    </CardDescription>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="applied">
              <Card className="dark:bg-gray-800 dark:border-gray-700 p-0 m-0 border-0">
                <CardHeader className="p-0 mb-3">
                  <CardTitle>Applied Jobs</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {jobs.filter((job) => job.status === "applied").length > 0 ? (
                    <>
                      {(() => {
                        const applied = jobs
                          .filter((j) => j.status === "applied")
                          .sort(
                            (a, b) =>
                              new Date(b.date).getTime() -
                              new Date(a.date).getTime()
                          );
                        return (
                          <>
                            {applied.slice(0, 5).map((job, index) => (
                              <JobCard
                                key={index}
                                job={job}
                                handleDeleteJobs={handleDeleteJobs}
                                handleApplyJobs={handleApplyJobs}
                              />
                            ))}
                            {applied.length > 5 && (
                              <Button
                                variant="outline"
                                className="mt-2 w-full"
                                onClick={() => {
                                  chrome.tabs.create({ url: "job.html" });
                                }}
                              >
                                See more applied jobs
                              </Button>
                            )}
                          </>
                        );
                      })()}
                    </>
                  ) : (
                    <CardDescription>
                      No jobs saved yet. Start tracking your jobs!
                    </CardDescription>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="dashboard">
              <JobDashboard jobs={jobs} setJobs={setJobs} />
            </TabsContent>
            <TabsContent value="add job">
              <JobManual />
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}
