import React, { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Download,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Send,
  ClipboardList,
  Phone,
  MessageSquare,
  Trophy,
  Link,
  X,
  Building,
  Briefcase,
  MapPin,
  Target,
  DollarSign,
  Clock,
  Users,
  TrendingUp,
  Building2,
  FileText,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  ShareIcon,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import SankeyDiagram from "../SankeyDiagram";

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

const TableJob = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [jobData, setJobData] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit functionality
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [editFormData, setEditFormData] = useState<Job>({
    company: "",
    companySize: "",
    date: "",
    experienceLevel: "",
    industry: "",
    jobType: "",
    location: "",
    notes: "",
    salary: "",
    status: "",
    title: "",
    url: "",
  });

  // Delete functionality
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<"single" | "bulk">("single");
  const [deleteJobUrl, setDeleteJobUrl] = useState<string>("");

  // Bulk operations
  const [bulkStatus, setBulkStatus] = useState("");

  // Sorting functionality
  const [sortBy, setSortBy] = useState<keyof Job | null>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Add job functionality
  const [showAddJobDialog, setShowAddJobDialog] = useState(false);
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

  // Sankey diagram functionality
  const [showSankeyDialog, setShowSankeyDialog] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Load data from Chrome storage
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
      } finally {
        setLoading(false);
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

  // Sankey Export function
  const exportToSankey = () => {
    setShowSankeyDialog(true);
  };

  // CSV Export function
  const exportToCSV = () => {
    const headers = [
      "Company",
      "Title",
      "Location",
      "Status",
      "Date",
      "Salary",
      "Industry",
      "Job Type",
      "Company Size",
      "Experience Level",
      "Notes",
      "URL",
    ];

    const dataToExport = filteredJobs.length > 0 ? filteredJobs : jobData;
    const csvData = dataToExport.map((job) => [
      job.company,
      job.title,
      job.location,
      job.status,
      job.date,
      job.salary,
      job.industry,
      job.jobType,
      job.companySize,
      job.experienceLevel,
      job.notes,
      job.url,
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) =>
        row.map((field) => `"${String(field).replace(/"/g, '""')}"`)
      )
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `jobs_export_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Edit job functions
  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setEditFormData({ ...job });
  };

  const handleSaveEdit = async () => {
    if (!editingJob) return;

    const updatedJobs = jobData.map((job) =>
      job.url === editingJob.url ? editFormData : job
    );
    await saveJobsToStorage(updatedJobs);
    setEditingJob(null);
  };

  const handleCancelEdit = () => {
    setEditingJob(null);
    setEditFormData({
      company: "",
      companySize: "",
      date: "",
      experienceLevel: "",
      industry: "",
      jobType: "",
      location: "",
      notes: "",
      salary: "",
      status: "",
      title: "",
      url: "",
    });
  };

  // Delete job functions
  const handleDeleteJob = (jobUrl: string) => {
    setDeleteJobUrl(jobUrl);
    setDeleteTarget("single");
    setShowDeleteConfirm(true);
  };

  const handleBulkDelete = () => {
    setDeleteTarget("bulk");
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (deleteTarget === "single") {
      const updatedJobs = jobData.filter((job) => job.url !== deleteJobUrl);
      await saveJobsToStorage(updatedJobs);
    } else {
      const updatedJobs = jobData.filter((job) => !selectedRows.has(job.url));
      await saveJobsToStorage(updatedJobs);
      setSelectedRows(new Set());
    }
    setShowDeleteConfirm(false);
    setDeleteJobUrl("");
  };

  // Bulk status update
  const handleBulkStatusUpdate = async () => {
    if (!bulkStatus || selectedRows.size === 0) return;

    const updatedJobs = jobData.map((job) =>
      selectedRows.has(job.url) ? { ...job, status: bulkStatus } : job
    );
    await saveJobsToStorage(updatedJobs);
    setSelectedRows(new Set());
    setBulkStatus("");
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

  const handleAddJob = () => {
    setShowAddJobDialog(true);
    // Set current date
    setAddFormData({
      ...addFormData,
      date: new Date().toLocaleDateString(),
    });
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
    setShowAddJobDialog(false);
  };

  const handleCancelAddJob = () => {
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
    setShowAddJobDialog(false);
  };

  // Filter configuration - made dynamic to update with job data
  const filters = useMemo(
    () => [
      { key: "all", label: "All Jobs", count: jobData.length },
      {
        key: "saved",
        label: "Saved",
        count: jobData.filter((job) => job.status === "saved").length,
      },
      {
        key: "applied",
        label: "Applied",
        count: jobData.filter((job) => job.status === "applied").length,
      },
      {
        key: "assessment",
        label: "Assessment",
        count: jobData.filter((job) => job.status === "assessment").length,
      },
      {
        key: "phone-screen",
        label: "Phone Screen",
        count: jobData.filter((job) => job.status === "phone-screen").length,
      },
      {
        key: "interview",
        label: "Interview",
        count: jobData.filter((job) => job.status === "interview").length,
      },
      {
        key: "offer",
        label: "Offer",
        count: jobData.filter((job) => job.status === "offer").length,
      },
    ],
    [jobData]
  );

  // Sorting functions
  const handleSort = (column: keyof Job) => {
    if (sortBy === column) {
      // Toggle sort order if same column
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Set new column and default to ascending
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (column: keyof Job) => {
    if (sortBy !== column) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortOrder === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  // Filter, search, and sort jobs
  const filteredJobs = useMemo(() => {
    let filtered = jobData;

    // Apply status filter
    if (activeFilter !== "all") {
      filtered = filtered.filter((job) => job.status === activeFilter);
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (job) =>
          job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];

        // Handle different data types
        if (sortBy === "date") {
          // Parse dates for proper chronological sorting
          const aDate = new Date(aValue);
          const bDate = new Date(bValue);
          return sortOrder === "asc"
            ? aDate.getTime() - bDate.getTime()
            : bDate.getTime() - aDate.getTime();
        } else if (sortBy === "status") {
          // Custom status order: saved → applied → assessment → phone-screen → interview → offer
          const statusOrder = [
            "saved",
            "applied",
            "assessment",
            "phone-screen",
            "interview",
            "offer",
          ];
          const aIndex = statusOrder.indexOf(aValue);
          const bIndex = statusOrder.indexOf(bValue);
          return sortOrder === "asc" ? aIndex - bIndex : bIndex - aIndex;
        } else {
          // Alphabetical sorting for strings
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
          if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
          if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
          return 0;
        }
      });
    }

    return filtered;
  }, [activeFilter, searchQuery, jobData, sortBy, sortOrder]);

  // Pagination logic
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchQuery]);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page
  };

  const canGoToPreviousPage = currentPage > 1;
  const canGoToNextPage = currentPage < totalPages;

  // Handle row selection - using url as unique identifier since there's no id field
  const handleRowSelect = (jobUrl: string, checked: boolean) => {
    const newSelection = new Set(selectedRows);
    if (checked) {
      newSelection.add(jobUrl);
    } else {
      newSelection.delete(jobUrl);
    }
    setSelectedRows(newSelection);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Select all jobs on the current page
      const currentPageUrls = new Set(paginatedJobs.map((job) => job.url));
      setSelectedRows(new Set([...selectedRows, ...currentPageUrls]));
    } else {
      // Unselect all jobs on the current page
      const currentPageUrls = new Set(paginatedJobs.map((job) => job.url));
      const newSelection = new Set(
        Array.from(selectedRows).filter((url) => !currentPageUrls.has(url))
      );
      setSelectedRows(newSelection);
    }
  };

  // Status badge styling
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { variant: "secondary"; className: string }
    > = {
      saved: {
        variant: "secondary",
        className:
          "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-950 dark:text-blue-300",
      },
      applied: {
        variant: "secondary",
        className:
          "bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700",
      },
      assessment: {
        variant: "secondary",
        className:
          "bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-950 dark:text-purple-300",
      },
      "phone-screen": {
        variant: "secondary",
        className:
          "bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-950 dark:text-purple-300",
      },
      interview: {
        variant: "secondary",
        className:
          "bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-950 dark:text-orange-300",
      },
      offer: {
        variant: "secondary",
        className:
          "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-950 dark:text-green-300",
      },
    };

    const config = statusConfig[status] || statusConfig.saved;

    return (
      <Badge variant={config.variant} className={config.className}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
      </Badge>
    );
  };

  const getFilterIcon = (filterKey: string) => {
    const iconMap: Record<string, React.ReactElement> = {
      saved: <Bookmark className="h-4 w-4" />,
      applied: <Send className="h-4 w-4" />,
      assessment: <ClipboardList className="h-4 w-4" />,
      "phone-screen": <Phone className="h-4 w-4" />,
      interview: <MessageSquare className="h-4 w-4" />,
      offer: <Trophy className="h-4 w-4" />,
    };
    return iconMap[filterKey] || <Link className="h-4 w-4" />;
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-background rounded-md ">
      {/* Header Filters */}
      <Card className="mb-6">
        <CardContent className="p-1">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeFilter === filter.key
                    ? "bg-muted text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {getFilterIcon(filter.key)}
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold">
                {filters.find((f) => f.key === activeFilter)?.label} (
                {filteredJobs.length})
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              {/* <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button> */}
              <Button variant="outline" size="sm" onClick={exportToCSV}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm" onClick={exportToSankey}>
                <ShareIcon className="h-4 w-4 mr-2" />
                Export Sankey
              </Button>
              <Button size="sm" onClick={handleAddJob}>
                <Plus className="h-4 w-4 mr-2" />
                Add Job
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      paginatedJobs.length > 0 &&
                      paginatedJobs.every((job) => selectedRows.has(job.url))
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                    onClick={() => handleSort("company")}
                  >
                    <div className="flex items-center gap-2">
                      Company
                      {getSortIcon("company")}
                    </div>
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                    onClick={() => handleSort("title")}
                  >
                    <div className="flex items-center gap-2">
                      Job Title
                      {getSortIcon("title")}
                    </div>
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                    onClick={() => handleSort("location")}
                  >
                    <div className="flex items-center gap-2">
                      Location
                      {getSortIcon("location")}
                    </div>
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center gap-2">
                      Status
                      {getSortIcon("status")}
                    </div>
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                    onClick={() => handleSort("date")}
                  >
                    <div className="flex items-center gap-2">
                      Date
                      {getSortIcon("date")}
                    </div>
                  </Button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedJobs.length > 0 ? (
                paginatedJobs.map((job, index) => (
                  <TableRow key={job.url || index}>
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.has(job.url)}
                        onCheckedChange={(checked) =>
                          handleRowSelect(job.url, checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell className="font-medium">{job.company}</TableCell>
                    <TableCell>{job.title}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {job.location}
                    </TableCell>
                    <TableCell>{getStatusBadge(job.status)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {job.date}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditJob(job)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteJob(job.url)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    {loading ? "Loading jobs..." : "No jobs found"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="text-sm text-muted-foreground flex items-center">
              Rows per page:
              <select
                className="ml-2 border rounded px-2 py-1 bg-background"
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(e.target.value)}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {filteredJobs.length > 0
                  ? `${startIndex + 1}–${Math.min(
                      endIndex,
                      filteredJobs.length
                    )} of ${filteredJobs.length}`
                  : "0 of 0"}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={!canGoToPreviousPage}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Page numbers */}
                <div className="flex items-center gap-1 mx-2">
                  {totalPages <= 7 ? (
                    // Show all pages if 7 or fewer
                    Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "ghost"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      )
                    )
                  ) : (
                    // Show condensed pagination for more than 7 pages
                    <>
                      {currentPage > 3 && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePageChange(1)}
                            className="w-8 h-8 p-0"
                          >
                            1
                          </Button>
                          {currentPage > 4 && <span className="px-2">...</span>}
                        </>
                      )}

                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          let page;
                          if (currentPage <= 3) {
                            page = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            page = totalPages - 4 + i;
                          } else {
                            page = currentPage - 2 + i;
                          }

                          if (page >= 1 && page <= totalPages) {
                            return (
                              <Button
                                key={page}
                                variant={
                                  currentPage === page ? "default" : "ghost"
                                }
                                size="sm"
                                onClick={() => handlePageChange(page)}
                                className="w-8 h-8 p-0"
                              >
                                {page}
                              </Button>
                            );
                          }
                          return null;
                        }
                      )}

                      {currentPage < totalPages - 2 && (
                        <>
                          {currentPage < totalPages - 3 && (
                            <span className="px-2">...</span>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePageChange(totalPages)}
                            className="w-8 h-8 p-0"
                          >
                            {totalPages}
                          </Button>
                        </>
                      )}
                    </>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  disabled={!canGoToNextPage}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Action Bar */}
      {selectedRows.size > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
          <Card className="shadow-lg border-2">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">
                  {selectedRows.size} item(s) selected
                </span>
                <div className="flex items-center gap-2">
                  <Select value={bulkStatus} onValueChange={setBulkStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Change status" />
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
                  <Button
                    size="sm"
                    onClick={handleBulkStatusUpdate}
                    disabled={!bulkStatus}
                  >
                    Update Status
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleBulkDelete}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedRows(new Set())}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Job Dialog */}
      <Dialog open={!!editingJob} onOpenChange={() => handleCancelEdit()}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] p-0 overflow-hidden">
          <ScrollArea className="h-[80vh] w-full px-6 py-4">
            <DialogHeader>
              <DialogTitle>Edit Job</DialogTitle>
              <DialogDescription>
                Update the job information below.
              </DialogDescription>
            </DialogHeader>
            {editingJob && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={editFormData.company}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          company: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="title">Job Title</Label>
                    <Input
                      id="title"
                      value={editFormData.title}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          title: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={editFormData.location}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          location: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={editFormData.status}
                      onValueChange={(value) =>
                        setEditFormData({ ...editFormData, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="saved">Saved</SelectItem>
                        <SelectItem value="applied">Applied</SelectItem>
                        <SelectItem value="assessment">Assessment</SelectItem>
                        <SelectItem value="phone-screen">
                          Phone Screen
                        </SelectItem>
                        <SelectItem value="interview">Interview</SelectItem>
                        <SelectItem value="offer">Offer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="salary">Salary</Label>
                    <Input
                      id="salary"
                      value={editFormData.salary}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          salary: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="jobType">Job Type</Label>
                    <Input
                      id="jobType"
                      value={editFormData.jobType}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          jobType: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="companySize">Company Size</Label>
                    <Input
                      id="companySize"
                      value={editFormData.companySize}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          companySize: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="experienceLevel">Experience Level</Label>
                    <Input
                      id="experienceLevel"
                      value={editFormData.experienceLevel}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          experienceLevel: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    value={editFormData.industry}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        industry: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={editFormData.notes}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        notes: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>Save Changes</Button>
            </DialogFooter>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Add Job Dialog */}
      <Dialog open={showAddJobDialog} onOpenChange={handleCancelAddJob}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] p-0 overflow-hidden">
          <ScrollArea className="h-[80vh] w-full px-6 py-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Job
              </DialogTitle>
              <DialogDescription>
                Fill in the job information below. Fields marked with * are
                required.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Required Fields Row 1 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label
                    htmlFor="add-company"
                    className="flex items-center gap-2"
                  >
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
                    className={formErrors.company ? "border-red-500" : ""}
                    placeholder="Enter company name"
                  />
                  {formErrors.company && (
                    <span className="text-sm text-red-500">
                      {formErrors.company}
                    </span>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label
                    htmlFor="add-title"
                    className="flex items-center gap-2"
                  >
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
                    className={formErrors.title ? "border-red-500" : ""}
                    placeholder="Enter job title"
                  />
                  {formErrors.title && (
                    <span className="text-sm text-red-500">
                      {formErrors.title}
                    </span>
                  )}
                </div>
              </div>

              {/* Required Fields Row 2 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label
                    htmlFor="add-location"
                    className="flex items-center gap-2"
                  >
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
                    className={formErrors.location ? "border-red-500" : ""}
                    placeholder="e.g., Jakarta, Indonesia"
                  />
                  {formErrors.location && (
                    <span className="text-sm text-red-500">
                      {formErrors.location}
                    </span>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label
                    htmlFor="add-status"
                    className="flex items-center gap-2"
                  >
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
              <div className="grid gap-2">
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
                  className={formErrors.url ? "border-red-500" : ""}
                  placeholder="https://company.com/jobs/123"
                />
                {formErrors.url && (
                  <span className="text-sm text-red-500">{formErrors.url}</span>
                )}
              </div>

              {/* Optional Fields Row 1 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label
                    htmlFor="add-salary"
                    className="flex items-center gap-2"
                  >
                    <DollarSign className="h-4 w-4" />
                    Salary
                  </Label>
                  <Input
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
                <div className="grid gap-2">
                  <Label
                    htmlFor="add-jobType"
                    className="flex items-center gap-2"
                  >
                    <Clock className="h-4 w-4" />
                    Job Type
                  </Label>
                  <Input
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
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label
                    htmlFor="add-companySize"
                    className="flex items-center gap-2"
                  >
                    <Users className="h-4 w-4" />
                    Company Size
                  </Label>
                  <Input
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
                <div className="grid gap-2">
                  <Label
                    htmlFor="add-experienceLevel"
                    className="flex items-center gap-2"
                  >
                    <TrendingUp className="h-4 w-4" />
                    Experience Level
                  </Label>
                  <Input
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
              <div className="grid gap-2">
                <Label
                  htmlFor="add-industry"
                  className="flex items-center gap-2"
                >
                  <Building2 className="h-4 w-4" />
                  Industry
                </Label>
                <Input
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
              <div className="grid gap-2">
                <Label htmlFor="add-notes" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Notes
                </Label>
                <Textarea
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
            <DialogFooter>
              <Button variant="outline" onClick={handleCancelAddJob}>
                Cancel
              </Button>
              <Button onClick={handleSaveAddJob}>
                <Plus className="h-4 w-4 mr-2" />
                Add Job
              </Button>
            </DialogFooter>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              {deleteTarget === "single"
                ? "Are you sure you want to delete this job? This action cannot be undone."
                : `Are you sure you want to delete ${selectedRows.size} selected job(s)? This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sankey Diagram Dialog */}
      <Dialog open={showSankeyDialog} onOpenChange={setShowSankeyDialog}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] p-0 overflow-hidden">
          <ScrollArea className="h-[90vh] w-full">
            <DialogHeader className="px-6 py-4">
              <DialogTitle className="flex items-center gap-2">
                <ShareIcon className="h-5 w-5" />
                Job Application Pipeline - Sankey Diagram
              </DialogTitle>
              <DialogDescription>
                Visualize your job application journey and track progress
                through different stages.
              </DialogDescription>
            </DialogHeader>
            <div className="px-6 pb-6">
              <SankeyDiagram jobs={jobData} />
            </div>
            <DialogFooter className="px-6 py-4">
              <Button
                variant="outline"
                onClick={() => setShowSankeyDialog(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TableJob;
