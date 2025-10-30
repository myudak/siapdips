import {
  Building,
  MapPin,
  Calendar,
  Briefcase,
  Check,
  ArrowUpRightIcon,
  Trash2,
  Eye,
} from "lucide-react";
import { Job } from ".";
import { Button } from "../ui/button";

export const JobCard = ({
  job,
  handleDeleteJobs,
  handleApplyJobs,
}: {
  job: Job;
  handleDeleteJobs: (job: Job) => void;
  handleApplyJobs: (job: Job) => void;
}) => (
  <div className="group relative overflow-hidden bg-card rounded-xl shadow-lg border p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 mb-5 bg-gray-100 dark:bg-gray-900 ">
    <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

    <div className="relative z-10">
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-card-foreground mb-3">
            {job.title}
          </h3>
          <div className="flex items-center text-muted-foreground mb-3">
            <div className="p-1.5 bg-primary rounded-lg mr-3">
              <Building className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-card-foreground">
              {job.company}
            </span>
          </div>
          <div className="flex items-center text-muted-foreground mb-3">
            <div className="p-1.5 bg-accent rounded-lg mr-3">
              <MapPin className="w-4 h-4 text-accent-foreground" />
            </div>
            <span>{job.location}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center text-sm mb-1 bg-muted px-3 py-1.5 rounded-full">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="font-medium">{job.date}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center text-card-foreground bg-secondary p-3 rounded-lg">
          <Briefcase className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">{job.jobType}</span>
        </div>
      </div>

      {job.experienceLevel !== "Not specified" && (
        <div className="mb-6">
          <span className="inline-block bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
            {job.experienceLevel}
          </span>
        </div>
      )}

      <div className="flex gap-3 flex-wrap">
        <Button
          disabled={job.status === "applied"}
          onClick={() => handleApplyJobs(job)}
          variant={job.status === "applied" ? "secondary" : "default"}
          className="flex items-center gap-2"
        >
          {job.status === "applied" ? (
            <Check className="w-4 h-4" />
          ) : (
            <ArrowUpRightIcon className="w-4 h-4" />
          )}
          {job.status === "applied" ? "Applied" : "Apply"}
        </Button>
        <Button
          onClick={() => {
            handleDeleteJobs(job);
          }}
          variant="destructive"
          className="flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </Button>
        <Button
          onClick={() => job.url && window.open(job.url, "_blank")}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Eye className="w-4 h-4" />
          View
        </Button>
      </div>
    </div>
  </div>
);
