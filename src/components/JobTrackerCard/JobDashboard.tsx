import {
  Clock,
  Plus,
  Eye,
  Trash2,
  Bell,
  X,
  Building2,
  AlertCircle,
  CheckCircle2,
  Timer,
  StickyNote,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Job } from ".";
import {
  MySelect,
  MySelectTrigger,
  MySelectContent,
  MySelectItem,
} from "../Themecard/select";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { DatePicker } from "../ui/date-picker";
import { TimePicker } from "../ui/time-picker";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format, isAfter, isToday, formatDistanceToNow } from "date-fns";
import { cn } from "../../lib/utils";

interface Reminder {
  id: string;
  message: string;
  time: string;
  date: string;
  relatedJob?: string;
  company?: string;
  notes?: string;
  completed: boolean;
  priority?: "low" | "medium" | "high";
}

export function JobDashboard({
  jobs,
  setJobs,
}: {
  jobs: Job[];
  setJobs: (jobs: Job[]) => void;
}) {
  const [selectAJobValue, setSelectAJobValue] = useState("Select a Job...");
  const [selectAJobStatus, setSelectAJobStatus] = useState("applied");

  // Reminder State
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [newReminderText, setNewReminderText] = useState("");
  const [newReminderTime, setNewReminderTime] = useState("");
  const [newReminderDate, setNewReminderDate] = useState("");
  const [newReminderJob, setNewReminderJob] = useState("");
  const [newReminderNotes, setNewReminderNotes] = useState("");
  const [isAddReminderDialogOpen, setIsAddReminderDialogOpen] = useState(false);

  // Combobox State
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [comboboxValue, setComboboxValue] = useState("");

  // Load reminders from localStorage
  useEffect(() => {
    const savedReminders = localStorage.getItem("productivityReminders");
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders));
    }
  }, []);

  // Save reminders to localStorage
  useEffect(() => {
    localStorage.setItem("productivityReminders", JSON.stringify(reminders));
  }, [reminders]);

  // Calculate dynamic stats
  const appliedCount = jobs.filter((job) => job.status === "applied").length;
  const savedCount = jobs.filter((job) => job.status === "saved").length;

  // Calculate jobs added this week
  const thisWeekCount = jobs.filter((job) => {
    const jobDate = new Date(job.date);
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return jobDate >= oneWeekAgo && jobDate <= now;
  }).length;

  const handleUpdateJobStatus = (
    jobTitle: string,
    status: string,
    jobs: Job[],
    setJobs: (jobs: Job[]) => void
  ) => {
    if (jobTitle === "Select a Job...") {
      toast.error("Please select a job to update its status");
      return;
    }

    const updatedJobs = jobs.map((job) =>
      job.title === jobTitle ? { ...job, status } : job
    );

    chrome.storage.local.set({ jobs: updatedJobs });
    setJobs(updatedJobs);
    toast.success(`Job status updated to ${status}`);
  };

  // Reminder utility functions
  const getReminderStatus = (reminder: Reminder) => {
    if (reminder.completed) return "completed";

    const now = new Date();
    const reminderDateTime = new Date(`${reminder.date}T${reminder.time}`);

    if (isAfter(now, reminderDateTime)) return "overdue";
    if (isToday(reminderDateTime)) return "today";
    return "upcoming";
  };

  const formatReminderTime = (reminder: Reminder) => {
    const reminderDateTime = new Date(`${reminder.date}T${reminder.time}`);
    const status = getReminderStatus(reminder);

    if (status === "overdue") {
      return `Overdue by ${formatDistanceToNow(reminderDateTime)}`;
    } else if (status === "today") {
      return `Today at ${reminder.time}`;
    } else {
      return `${format(reminderDateTime, "MMM d, yyyy")} at ${reminder.time}`;
    }
  };

  const toggleReminderComplete = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter((r) => r.id !== id));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setNewReminderDate(format(date, "yyyy-MM-dd"));
    }
  };

  const handleTimeChange = (time: string) => {
    setNewReminderTime(time);
  };

  const addReminder = () => {
    if (!newReminderText.trim() || !newReminderTime || !newReminderDate) return;

    const newReminder: Reminder = {
      id: Date.now().toString(),
      message: newReminderText.trim(),
      time: newReminderTime,
      date: newReminderDate,
      relatedJob: newReminderJob.trim() || undefined,
      notes: newReminderNotes.trim() || undefined,
      completed: false,
    };

    setReminders([...reminders, newReminder]);
    setNewReminderText("");
    setNewReminderTime("");
    setNewReminderDate("");
    setNewReminderJob("");
    setNewReminderNotes("");
    setComboboxValue("");
    setComboboxOpen(false);
    setIsAddReminderDialogOpen(false);
  };

  const openAddReminderDialog = () => {
    setIsAddReminderDialogOpen(true);
  };

  const closeAddReminderDialog = () => {
    setIsAddReminderDialogOpen(false);
    setNewReminderText("");
    setNewReminderTime("");
    setNewReminderDate("");
    setNewReminderJob("");
    setNewReminderNotes("");
    setComboboxValue("");
    setComboboxOpen(false);
  };

  // Job options for combobox
  const jobOptions = jobs.map((job) => ({
    value: job.url,
    label: `${job.title} at ${job.company}`,
    company: job.company,
    title: job.title,
  }));

  return (
    <div className="">
      <div className="w-full">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold mb-1">Job Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Track your applications and progress
          </p>
        </div>

        {/* Stats Cards - Always 3x1 Grid, Optimized for Extension */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="bg-gradient-to-br from-white via-white to-blue-50/50 dark:from-gray-800 dark:via-gray-800 dark:to-blue-950/50 border border-blue-100/50 dark:border-blue-800/50 shadow-md hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-blue-400/10 transition-all duration-300 hover:-translate-y-0.5 group">
            <CardContent className="p-3 text-center h-full flex flex-col justify-center relative overflow-hidden min-h-[4rem]">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-100/20 dark:to-blue-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-1">
                  {appliedCount}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-xs font-medium">
                  Applied
                </div>
                <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-1 rounded-full" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white via-white to-emerald-50/50 dark:from-gray-800 dark:via-gray-800 dark:to-emerald-950/50 border border-emerald-100/50 dark:border-emerald-800/50 shadow-md hover:shadow-lg hover:shadow-emerald-500/10 dark:hover:shadow-emerald-400/10 transition-all duration-300 hover:-translate-y-0.5 group">
            <CardContent className="p-3 text-center h-full flex flex-col justify-center relative overflow-hidden min-h-[4rem]">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-emerald-100/20 dark:to-emerald-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent mb-1">
                  {savedCount}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-xs font-medium">
                  Saved
                </div>
                <div className="w-8 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto mt-1 rounded-full" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white via-white to-purple-50/50 dark:from-gray-800 dark:via-gray-800 dark:to-purple-950/50 border border-purple-100/50 dark:border-purple-800/50 shadow-md hover:shadow-lg hover:shadow-purple-500/10 dark:hover:shadow-purple-400/10 transition-all duration-300 hover:-translate-y-0.5 group">
            <CardContent className="p-3 text-center h-full flex flex-col justify-center relative overflow-hidden min-h-[4rem]">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-purple-100/20 dark:to-purple-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-1">
                  {thisWeekCount}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-xs font-medium">
                  This Week
                </div>
                <div className="w-8 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-1 rounded-full" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Compact Tabs Section for Extension */}
        <Card className="bg-gradient-to-br from-white via-white to-gray-50/50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-850/50 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
          <CardContent className="p-0">
            <Tabs defaultValue="status" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-transparent border-b border-gray-200 dark:border-gray-700 rounded-none h-auto p-0">
                <TabsTrigger
                  value="status"
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 dark:data-[state=active]:border-blue-400 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-none py-3 px-4 font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-200 text-sm"
                >
                  Status
                </TabsTrigger>
                <TabsTrigger
                  value="reminders"
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 dark:data-[state=active]:border-blue-400 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-none py-3 px-4 font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-200 text-sm"
                >
                  Reminders
                </TabsTrigger>
              </TabsList>

              <TabsContent value="status" className="p-4 w-full">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
                  {/* Job Selector */}
                  <div className="flex-1 w-full">
                    <Label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Select Job
                    </Label>
                    <MySelect
                      value={selectAJobValue}
                      onChange={(v) => {
                        setSelectAJobValue(v);
                        setSelectAJobStatus(
                          jobs.find((job) => job.title === v)?.status ||
                            "applied"
                        );
                      }}
                      placeholder="Select a Job..."
                      className="w-full"
                    >
                      <MySelectTrigger className="w-full">
                        {selectAJobValue}
                      </MySelectTrigger>
                      <MySelectContent>
                        {jobs.filter((job) => job.status !== "saved").length ===
                        0 ? (
                          <div className="px-4 py-2 text-gray-500 text-sm">
                            No jobs available
                          </div>
                        ) : (
                          jobs
                            .filter((job) => job.status !== "saved")
                            .map((job, index) => (
                              <MySelectItem key={index} value={job.title}>
                                {job.title}
                              </MySelectItem>
                            ))
                        )}
                      </MySelectContent>
                    </MySelect>
                  </div>

                  {/* Status Selector */}
                  <div className="flex-1 w-full">
                    <Label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Update Status
                    </Label>
                    <MySelect
                      value={selectAJobStatus}
                      onChange={setSelectAJobStatus}
                      placeholder="Select Status"
                      className="w-full"
                      disabled={selectAJobValue === "Select a Job..."}
                    >
                      <MySelectTrigger className="w-full">
                        {selectAJobStatus}
                      </MySelectTrigger>
                      <MySelectContent>
                        <MySelectItem value="applied">Applied</MySelectItem>
                        <MySelectItem value="saved">Saved</MySelectItem>
                        <MySelectItem value="interview">Interview</MySelectItem>
                        <MySelectItem value="offer">Offer</MySelectItem>
                        <MySelectItem value="rejected">Rejected</MySelectItem>
                      </MySelectContent>
                    </MySelect>
                  </div>

                  {/* Save Button */}
                  <div className="flex items-end mt-4 md:mt-7">
                    <Button
                      onClick={() =>
                        handleUpdateJobStatus(
                          selectAJobValue,
                          selectAJobStatus,
                          jobs,
                          setJobs
                        )
                      }
                      className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow hover:from-blue-700 hover:to-indigo-700 transition-all"
                    >
                      Save Status
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reminders" className="p-4">
                <div className="flex flex-row items-center justify-between mb-4">
                  <h4 className="text-sm font-medium">Your Reminders</h4>
                  <Button onClick={openAddReminderDialog} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>

                {/* Reminders List */}
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {reminders.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-full mb-3">
                        <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        No Reminders Set
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                        Set up reminders for follow-ups
                      </p>
                      <Button
                        onClick={openAddReminderDialog}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 shadow-lg hover:shadow-purple-500/25 dark:hover:shadow-purple-400/25 transition-all duration-300 text-sm"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Reminder
                      </Button>
                    </div>
                  ) : (
                    reminders.map((reminder) => {
                      const status = getReminderStatus(reminder);
                      return (
                        <div
                          key={reminder.id}
                          className={`group cursor-pointer transition-all duration-200 hover:shadow-md rounded-lg border p-3 ${
                            status === "completed"
                              ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                              : status === "overdue"
                              ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                              : status === "today"
                              ? "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800"
                              : "bg-card hover:bg-muted/50"
                          }`}
                          onClick={() => toggleReminderComplete(reminder.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              {/* Status Icon */}
                              <div className="mt-0.5">
                                {status === "completed" ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                                ) : status === "overdue" ? (
                                  <AlertCircle className="h-4 w-4 text-red-600" />
                                ) : status === "today" ? (
                                  <Timer className="h-4 w-4 text-orange-600" />
                                ) : (
                                  <Bell className="h-4 w-4 text-blue-600" />
                                )}
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <p
                                    className={`font-medium text-sm ${
                                      status === "completed"
                                        ? "line-through text-gray-500"
                                        : ""
                                    }`}
                                  >
                                    {reminder.message}
                                  </p>
                                  {/* Status Badge */}
                                  <Badge
                                    variant={
                                      status === "completed"
                                        ? "secondary"
                                        : status === "overdue"
                                        ? "destructive"
                                        : status === "today"
                                        ? "default"
                                        : "outline"
                                    }
                                    className="text-xs"
                                  >
                                    {status === "completed"
                                      ? "Done"
                                      : status === "overdue"
                                      ? "Overdue"
                                      : status === "today"
                                      ? "Today"
                                      : "Upcoming"}
                                  </Badge>
                                </div>

                                {/* Time info */}
                                <p className="text-xs text-muted-foreground mb-1">
                                  {formatReminderTime(reminder)}
                                </p>

                                {/* Job and Notes */}
                                <div className="space-y-1">
                                  {reminder.relatedJob && (
                                    <div className="flex items-center gap-1">
                                      <Building2 className="h-3 w-3 text-blue-500" />
                                      <span className="text-xs text-blue-600 dark:text-blue-400 truncate">
                                        {reminder.relatedJob}
                                      </span>
                                    </div>
                                  )}
                                  {reminder.notes && (
                                    <div className="flex items-center gap-1">
                                      <StickyNote className="h-3 w-3 text-gray-500" />
                                      <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {reminder.notes}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleReminderComplete(reminder.id);
                                }}
                              >
                                {status === "completed" ? (
                                  <X className="h-3 w-3" />
                                ) : (
                                  <CheckCircle2 className="h-3 w-3" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-red-500 hover:text-red-700"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteReminder(reminder.id);
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Compact View Dashboard Link */}
        <div className="mt-4 text-center">
          <Button
            variant="ghost"
            onClick={() => chrome.tabs.create({ url: "job.html" })}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/50 gap-2 px-4 py-2 transition-all duration-300 group text-sm"
          >
            <Eye className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
            Explore Dashboard
          </Button>
        </div>
      </div>

      {/* Add Reminder Dialog */}
      <Dialog
        open={isAddReminderDialogOpen}
        onOpenChange={setIsAddReminderDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Reminder</DialogTitle>
            <DialogDescription>
              Set a reminder to help you stay productive and follow up on
              applications.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="dialog-reminder-text">Reminder Message</Label>
              <Input
                id="dialog-reminder-text"
                placeholder="e.g., Follow up on job application"
                value={newReminderText}
                onChange={(e) => setNewReminderText(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Date</Label>
                <DatePicker
                  date={newReminderDate ? new Date(newReminderDate) : undefined}
                  onDateChange={handleDateChange}
                  placeholder="Select date"
                />
              </div>

              <div className="grid gap-2">
                <Label>Time</Label>
                <TimePicker
                  time={newReminderTime}
                  onTimeChange={handleTimeChange}
                  placeholder="Select time"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dialog-reminder-job">
                Related Job (Optional)
              </Label>
              <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={comboboxOpen}
                    className="w-full justify-between"
                  >
                    {comboboxValue
                      ? jobOptions.find((job) => job.label === comboboxValue)
                          ?.label
                      : "Select a job..."}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search jobs..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No jobs found.</CommandEmpty>
                      <CommandGroup>
                        {jobOptions.map((job) => (
                          <CommandItem
                            key={job.label}
                            value={job.label}
                            onSelect={(currentValue) => {
                              const selectedValue =
                                currentValue === comboboxValue
                                  ? ""
                                  : currentValue;
                              setComboboxValue(selectedValue);
                              const selectedJob = jobOptions.find(
                                (j) => j.label === selectedValue
                              );
                              setNewReminderJob(
                                selectedJob ? selectedJob.label : ""
                              );
                              setComboboxOpen(false);
                            }}
                          >
                            {job.label}
                            <Check
                              className={cn(
                                "ml-auto",
                                comboboxValue === job.label
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dialog-reminder-notes">
                Additional Notes (Optional)
              </Label>
              <Input
                id="dialog-reminder-notes"
                placeholder="e.g., Prepare questions for interview"
                value={newReminderNotes}
                onChange={(e) => setNewReminderNotes(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeAddReminderDialog}>
              Cancel
            </Button>
            <Button onClick={addReminder}>
              <Plus className="h-4 w-4 mr-2" />
              Add Reminder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
