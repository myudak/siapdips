import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Edit2Icon, Target, RotateCcw } from "lucide-react";

interface Goal {
  title: string;
  target: number;
  timeframe: "daily" | "weekly" | "monthly" | "yearly";
  createdAt: string;
}

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

const GoalProgress = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [jobData, setJobData] = useState<Job[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    target: "",
    timeframe: "weekly" as Goal["timeframe"],
  });

  // Load goal from localStorage
  useEffect(() => {
    const savedGoal = localStorage.getItem("jobGoal");
    if (savedGoal) {
      setGoal(JSON.parse(savedGoal));
    }
  }, []);

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

  // Calculate progress based on goal timeframe
  const progress = useMemo(() => {
    if (!goal) return { current: 0, percentage: 0 };

    const now = new Date();
    let startDate: Date;

    switch (goal.timeframe) {
      case "daily": {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      }
      case "weekly": {
        const dayOfWeek = now.getDay();
        startDate = new Date(now);
        startDate.setDate(now.getDate() - dayOfWeek);
        startDate.setHours(0, 0, 0, 0);
        break;
      }
      case "monthly": {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      }
      case "yearly": {
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      }
    }

    const applicationsInPeriod = jobData.filter((job) => {
      const jobDate = new Date(job.date);
      return jobDate >= startDate && jobDate <= now;
    }).length;

    const percentage = Math.min(
      (applicationsInPeriod / goal.target) * 100,
      100
    );

    return {
      current: applicationsInPeriod,
      percentage: Math.round(percentage),
    };
  }, [goal, jobData]);

  const handleSaveGoal = () => {
    if (
      !formData.title.trim() ||
      !formData.target ||
      parseInt(formData.target) <= 0
    ) {
      return;
    }

    const newGoal: Goal = {
      title: formData.title.trim(),
      target: parseInt(formData.target),
      timeframe: formData.timeframe,
      createdAt: new Date().toISOString(),
    };

    setGoal(newGoal);
    localStorage.setItem("jobGoal", JSON.stringify(newGoal));
    setIsDialogOpen(false);
    setFormData({ title: "", target: "", timeframe: "weekly" });
  };

  const handleEditGoal = () => {
    if (goal) {
      setFormData({
        title: goal.title,
        target: goal.target.toString(),
        timeframe: goal.timeframe,
      });
    }
    setIsDialogOpen(true);
  };

  const handleResetGoal = () => {
    setGoal(null);
    localStorage.removeItem("jobGoal");
    setFormData({ title: "", target: "", timeframe: "weekly" });
  };

  const getTimeframeText = (timeframe: Goal["timeframe"]) => {
    switch (timeframe) {
      case "daily":
        return "today";
      case "weekly":
        return "this week";
      case "monthly":
        return "this month";
      case "yearly":
        return "this year";
    }
  };

  return (
    <>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-3">
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Goal Progress
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                {goal
                  ? `${progress.current} / ${
                      goal.target
                    } applications ${getTimeframeText(goal.timeframe)}`
                  : "No goal set. Click the edit button to create a new goal."}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {goal && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleResetGoal}
                  title="Reset Goal"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
              <Button variant="outline" size="icon" onClick={handleEditGoal}>
                <Edit2Icon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {goal && (
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {goal.title}
                </span>
                <span
                  className={`font-semibold ${
                    progress.percentage >= 100
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {progress.percentage}%
                </span>
              </div>
            )}
            <div className="relative">
              <Progress
                value={goal ? progress.percentage : 0}
                className="h-4 bg-gray-200 dark:bg-gray-700"
              />
              {goal && progress.percentage >= 100 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    Goal Achieved! 🎉
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{goal ? "Edit Goal" : "Set New Goal"}</DialogTitle>
            <DialogDescription>
              Set your job application target and track your progress.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Goal Title</Label>
              <Input
                id="title"
                placeholder="e.g., Weekly Job Applications"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="target">Target Number</Label>
              <Input
                id="target"
                type="number"
                min="1"
                placeholder="e.g., 5"
                value={formData.target}
                onChange={(e) =>
                  setFormData({ ...formData, target: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="timeframe">Time Period</Label>
              <Select
                value={formData.timeframe}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    timeframe: value as Goal["timeframe"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveGoal}>
              {goal ? "Update Goal" : "Save Goal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GoalProgress;
