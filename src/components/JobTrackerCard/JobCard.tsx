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
  <div className="group relative overflow-hidden bg-secondary dark:bg-[#314158] rounded-xl shadow-lg border  p-6 hover:shadow-2xl  transition-all duration-300 hover:-translate-y-1 mb-5">
    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-purple-100/20 dark:to-purple-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

    <div className="relative z-10">
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3 ">
            {job.title}
          </h3>
          <div className="flex items-center text-gray-600 dark:text-gray-400 mb-3">
            <div className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mr-3">
              <Building className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              {job.company}
            </span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400 mb-3">
            <div className="p-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg mr-3">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span>{job.location}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center text-gray-500 text-sm mb-1 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/50 dark:to-red-900/50 px-3 py-1.5 rounded-full">
            <Calendar className="w-4 h-4 mr-2 text-orange-600 dark:text-orange-400" />
            <span className="font-medium text-orange-700 dark:text-orange-300">
              {job.date}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* <div className="flex items-center text-gray-600 bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg">
          <DollarSign className="w-4 h-4 mr-2 text-green-600" />
          <span className="text-sm font-medium">{job.salary}</span>
        </div> */}
        <div className="flex items-center text-gray-600 dark:text-gray-300 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/50 dark:to-cyan-900/50 p-3 rounded-lg">
          <Briefcase className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium">{job.jobType}</span>
        </div>
        {/* <div className="flex items-center text-gray-600 bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg">
          <Users className="w-4 h-4 mr-2 text-purple-600" />
          <span className="text-sm font-medium">{job.companySize}</span>
        </div>
        <div className="flex items-center text-gray-600 bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-lg">
          <Building className="w-4 h-4 mr-2 text-indigo-600" />
          <span className="text-sm font-medium">{job.industry}</span>
        </div> */}
      </div>

      {job.experienceLevel !== "Not specified" && (
        <div className="mb-6">
          <span className="inline-block bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
            {job.experienceLevel}
          </span>
        </div>
      )}

      <div className="flex gap-3 flex-wrap">
        <Button
          disabled={job.status === "applied"}
          onClick={() => handleApplyJobs(job)}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-emerald-500/25 transition-all duration-300"
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
          className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shadow-lg hover:shadow-red-500/25 transition-all duration-300"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </Button>
        <Button
          onClick={() => job.url && window.open(job.url, "_blank")}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
        >
          <Eye className="w-4 h-4" />
          View
        </Button>
      </div>
    </div>
  </div>
);
