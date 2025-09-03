import { useState, useMemo, useEffect } from "react";
import { Bell, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Define Task and Status types
interface Task {
  id: string;
  message: string;
  time: string;
  date: string;
  completed: boolean;
  relatedJob?: string;
}
type Status = "overdue" | "today" | "upcoming";

// Mock data - replace with your actual data source
const mockTasks: Task[] = [
  {
    id: "1754492594135",
    message: "Complete project presentation",
    time: "11:00",
    date: "2025-08-06", // Today
    completed: false,
  },
  {
    id: "1754492594136",
    message: "Review documents",
    time: "14:30",
    date: "2025-08-05", // Yesterday (overdue)
    completed: false,
  },
  {
    id: "1754492594137",
    message: "Team meeting",
    time: "09:00",
    date: "2025-08-07", // Tomorrow
    completed: false,
  },
  {
    id: "1754492594138",
    message: "Submit report",
    time: "16:00",
    date: "2025-08-04", // Overdue
    completed: true,
  },
];

export default function NotificationDropdown(): JSX.Element {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const stored = localStorage.getItem("productivityReminders");
    return stored ? JSON.parse(stored) : mockTasks;
  });

  useEffect(() => {
    localStorage.setItem("productivityReminders", JSON.stringify(tasks));
  }, [tasks]);
  // Toggle between urgent-only and all tasks view
  const [showAll, setShowAll] = useState(false);

  const { urgentTasks, hasUrgentNotifications } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const urgent = tasks.filter((task) => {
      if (task.completed) return false;

      const taskDate = new Date(task.date);
      taskDate.setHours(0, 0, 0, 0);

      // Show tasks that are overdue, due today, or due tomorrow
      return taskDate <= tomorrow;
    });

    return {
      urgentTasks: urgent,
      hasUrgentNotifications: urgent.length > 0,
    };
  }, [tasks]);
  // Select which list to display
  const displayedTasks = showAll ? tasks : urgentTasks;

  const getTaskStatus = (task: Task): Status => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const taskDate = new Date(task.date);
    taskDate.setHours(0, 0, 0, 0);

    if (taskDate < today) return "overdue";
    if (taskDate.getTime() === today.getTime()) return "today";
    return "upcoming";
  };

  const getStatusIcon = (status: Status): JSX.Element => {
    switch (status) {
      case "overdue":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "today":
        return <Clock className="w-4 h-4 text-orange-500" />;
      default:
        return <Clock className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusVariant = (
    status: Status
  ): "destructive" | "secondary" | "outline" => {
    switch (status) {
      case "overdue":
        return "destructive";
      case "today":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusText = (status: Status): string => {
    switch (status) {
      case "overdue":
        return "Overdue";
      case "today":
        return "Due Today";
      default:
        return "Due Tomorrow";
    }
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const taskDate = new Date(dateStr);
    taskDate.setHours(0, 0, 0, 0);

    if (taskDate.getTime() === today.getTime()) return "Today";

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (taskDate.getTime() === yesterday.getTime()) return "Yesterday";

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (taskDate.getTime() === tomorrow.getTime()) return "Tomorrow";

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const markAsCompleted = (taskId: string): void => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: true } : task
      )
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <div className="relative">
            <Bell className="w-5 h-5" />
            {hasUrgentNotifications && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80 p-0" align="end">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>
            {hasUrgentNotifications && (
              <Badge variant="destructive" className="text-xs">
                {urgentTasks.length} urgent
              </Badge>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {displayedTasks.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="font-medium">All caught up!</p>
              <p className="text-sm">No urgent tasks at the moment.</p>
            </div>
          ) : (
            displayedTasks.map((task) => {
              const status = getTaskStatus(task);
              return (
                <div
                  key={task.id}
                  className="p-4 border-b last:border-b-0 hover:bg-accent transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {getStatusIcon(status)}
                    <div className="flex-1 min-w-0 space-y-2">
                      <p className="text-sm font-medium truncate">
                        {task.message}
                      </p>
                      {task.relatedJob && (
                        <p className="text-xs text-muted-foreground truncate">
                          {task.relatedJob}
                        </p>
                      )}
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={getStatusVariant(status)}
                          className="text-xs"
                        >
                          {getStatusText(status)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(task.date)} at {task.time}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-auto p-1"
                      onClick={() => markAsCompleted(task.id)}
                    >
                      Mark Done
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {tasks.length > 0 && (
          <div className="p-3 border-t">
            <Button
              variant="ghost"
              className="w-full text-sm"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Show Urgent Tasks" : "View All Tasks"}
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
