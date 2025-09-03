import React, { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { DatePicker } from "@/components/ui/date-picker";
import { TimePicker } from "@/components/ui/time-picker";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Clock,
  Plus,
  Trash2,
  Bell,
  X,
  Calendar,
  Building2,
  AlertCircle,
  CheckCircle2,
  Timer,
  StickyNote,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { format, isAfter, isToday, formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

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

interface TimerMode {
  name: string;
  duration: number;
  color: string;
}

const TIMER_MODES: TimerMode[] = [
  { name: "Work", duration: 25 * 60, color: "#ef4444" }, // 25 minutes
  { name: "Short Break", duration: 5 * 60, color: "#22c55e" }, // 5 minutes
  { name: "Long Break", duration: 15 * 60, color: "#3b82f6" }, // 15 minutes
];

const ProductiveTools = () => {
  // Pomodoro Timer State
  const [currentModeIndex, setCurrentModeIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_MODES[0].duration);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);

  // Job Data State
  const [jobData, setJobData] = useState<Job[]>([]);

  // Reminder State
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [newReminderText, setNewReminderText] = useState("");
  const [newReminderTime, setNewReminderTime] = useState("");
  const [newReminderDate, setNewReminderDate] = useState("");
  const [newReminderJob, setNewReminderJob] = useState("");
  const [newReminderNotes, setNewReminderNotes] = useState("");
  const [triggeredReminder, setTriggeredReminder] = useState<Reminder | null>(
    null
  );
  const [isAddReminderDialogOpen, setIsAddReminderDialogOpen] = useState(false);

  // Combobox State
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [comboboxValue, setComboboxValue] = useState("");

  // Load job data from Chrome storage
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

  // Timer countdown logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      // Timer completed
      setCompletedSessions((prev) => prev + 1);

      // Auto-switch to next mode
      const nextModeIndex = (currentModeIndex + 1) % TIMER_MODES.length;
      setCurrentModeIndex(nextModeIndex);
      setTimeLeft(TIMER_MODES[nextModeIndex].duration);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, currentModeIndex]);

  // Check for triggered reminders
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;

      const reminder = reminders.find(
        (r) => r.time === currentTime && !r.completed
      );

      if (reminder) {
        setTriggeredReminder(reminder);
        // Mark as completed
        setReminders((prev) =>
          prev.map((r) =>
            r.id === reminder.id ? { ...r, completed: true } : r
          )
        );
      }
    };

    const interval = setInterval(checkReminders, 1000);
    return () => clearInterval(interval);
  }, [reminders]);

  const currentMode = TIMER_MODES[currentModeIndex];
  const progress =
    ((currentMode.duration - timeLeft) / currentMode.duration) * 100;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(currentMode.duration);
  };

  const handleSkip = () => {
    setIsRunning(false);
    const nextModeIndex = (currentModeIndex + 1) % TIMER_MODES.length;
    setCurrentModeIndex(nextModeIndex);
    setTimeLeft(TIMER_MODES[nextModeIndex].duration);
  };

  const handleModeChange = (modeIndex: number) => {
    setIsRunning(false);
    setCurrentModeIndex(modeIndex);
    setTimeLeft(TIMER_MODES[modeIndex].duration);
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

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter((r) => r.id !== id));
  };

  const dismissAlert = () => {
    setTriggeredReminder(null);
  };

  // Utility functions for reminder status
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

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setNewReminderDate(format(date, "yyyy-MM-dd"));
    }
  };

  const handleTimeChange = (time: string) => {
    setNewReminderTime(time);
  };

  // Combobox utility functions
  const jobOptions = jobData.map((job) => ({
    value: job.url,
    label: `${job.title} at ${job.company}`,
    company: job.company,
    title: job.title,
  }));

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Alert for triggered reminders */}
      {triggeredReminder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-500" />
                <CardTitle className="text-lg">Reminder</CardTitle>
              </div>
              <Button variant="ghost" size="icon" onClick={dismissAlert}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {triggeredReminder.time}
              </p>
              <p className="font-medium">{triggeredReminder.message}</p>
              <Button onClick={dismissAlert} className="w-full mt-4">
                Got it!
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pomodoro Timer */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Pomodoro Timer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Mode Selection */}
            <div className="flex gap-2">
              {TIMER_MODES.map((mode, index) => (
                <Button
                  key={mode.name}
                  variant={currentModeIndex === index ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleModeChange(index)}
                  className="flex-1"
                >
                  {mode.name}
                </Button>
              ))}
            </div>

            {/* Circular Timer */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-48 h-48">
                <CircularProgressbar
                  value={progress}
                  text={formatTime(timeLeft)}
                  styles={buildStyles({
                    textSize: "16px",
                    pathColor: currentMode.color,
                    textColor: currentMode.color,
                    trailColor: "#e5e7eb",
                    strokeLinecap: "round",
                  })}
                />
              </div>

              <div className="text-center">
                <p
                  className="text-lg font-semibold"
                  style={{ color: currentMode.color }}
                >
                  {currentMode.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sessions completed: {completedSessions}
                </p>
              </div>
            </div>

            {/* Timer Controls */}
            <div className="flex justify-center gap-3">
              <Button
                onClick={handlePlayPause}
                size="lg"
                className="flex items-center gap-2"
              >
                {isRunning ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                {isRunning ? "Pause" : "Start"}
              </Button>
              <Button onClick={handleReset} variant="outline" size="lg">
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button onClick={handleSkip} variant="outline" size="lg">
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reminders */}
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Reminders
            </CardTitle>
            <Button onClick={openAddReminderDialog} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Reminder
            </Button>
          </CardHeader>
          <CardContent>
            {/* Reminders List */}
            <div className="space-y-2  overflow-y-auto">
              {reminders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Calendar className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    No reminders yet
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                    Set up reminders to stay on track with your tasks or to help
                    you follow up on applications.
                  </p>
                  <Button
                    onClick={openAddReminderDialog}
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create your first reminder
                  </Button>
                </div>
              ) : (
                reminders.map((reminder) => {
                  const status = getReminderStatus(reminder);
                  return (
                    <div
                      key={reminder.id}
                      className={`group cursor-pointer transition-all duration-200 hover:shadow-md rounded-lg border p-4 ${
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
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : status === "overdue" ? (
                              <AlertCircle className="h-5 w-5 text-red-600" />
                            ) : status === "today" ? (
                              <Timer className="h-5 w-5 text-orange-600" />
                            ) : (
                              <Bell className="h-5 w-5 text-blue-600" />
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
                            <p className="text-xs text-muted-foreground mb-2">
                              {formatReminderTime(reminder)}
                            </p>

                            {/* Job and Notes */}
                            <div className="space-y-1">
                              {reminder.relatedJob && (
                                <div className="flex items-center gap-1">
                                  <Building2 className="h-3 w-3 text-blue-500" />
                                  <span className="text-xs text-blue-600 dark:text-blue-400">
                                    {reminder.relatedJob}
                                  </span>
                                </div>
                              )}
                              {reminder.notes && (
                                <div className="flex items-center gap-1">
                                  <StickyNote className="h-3 w-3 text-gray-500" />
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
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
                            className="h-8 w-8"
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
                            className="h-8 w-8 text-red-500 hover:text-red-700"
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
          </CardContent>
        </Card>
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
              Set a reminder to help you stay productive and take breaks when
              needed.
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
};

export default ProductiveTools;
